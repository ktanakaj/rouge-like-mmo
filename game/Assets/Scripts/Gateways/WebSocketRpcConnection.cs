// ================================================================================================
// <summary>
//      WebSocket/JSON-RPC2コネクションソース</summary>
//
// <copyright file="WebSocketRpcConnection.cs">
//      Copyright (C) 2018 Koichi Tanaka. All rights reserved.</copyright>
// <author>
//      Koichi Tanaka</author>
// ================================================================================================

namespace Honememo.RougeLikeMmo.Gateways
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading;
    using MiniJSON;
    using UniRx;
    using UnityEngine;
    using WebSocketSharp;

    /// <summary>
    /// WebSocket/JSON-RPC2コネクションクラス。
    /// </summary>
    /// TODO: 全体的にソース整理する
    public class WebSocketRpcConnection : IDisposable
    {
        #region 定数

        /// <summary>
        /// JSON-RPCバージョン。
        /// </summary>
        private const string VERSION = "2.0";

        #endregion

        #region 内部変数

        /// <summary>
        /// WebSocket接続。
        /// </summary>
        private WebSocket ws;

        /// <summary>
        /// JSON-RPC2のID採番用カウンター。
        /// </summary>
        private int idCounter = 0;

        /// <summary>
        /// リクエストコールバック受付用のマップ。
        /// </summary>
        private IDictionary<int, Subject<object>> callback = new Dictionary<int, Subject<object>>();

        #endregion

        #region 公開変数

        /// <summary>
        /// 接続先URL。
        /// </summary>
        public string Url { get; }

        /// <summary>
        /// Callのタイムアウト時間。
        /// </summary>
        public uint Timeout = 60000;

        #endregion

        /// <summary>
        /// 指定されたURLへのWebSocket/JSON-RPC2コネクションを生成する。
        /// </summary>
        /// <param name="url">接続先URL。</param>
        public WebSocketRpcConnection(string url)
        {
            this.Url = url;
        }

        #region I/F実装メソッド

        /// <summary>
        /// リソースを解放する。
        /// </summary>
        public void Dispose()
        {
            this.Close();
        }

        #endregion

        #region 公開メソッド

        /// <summary>
        /// WebSocket接続を開始する。
        /// </summary>
        public void Connect()
        {
            // 既に接続済みの場合は一旦終了する
            this.Close();

            // WebSocket接続を確立し、各種イベントを登録する
            var ws = new WebSocket(this.Url);

            ws.OnError += (sender, e) =>
            {
                Debug.LogError("ERROR " + e.Message);
                this.Close();
            };

            ws.OnClose += (sender, e) =>
            {
                Debug.Log("CLOSE code=" + e.Code + ", reason=" + e.Reason);
                this.ws = null;
            };

            ws.OnMessage += (sender, e) =>
            {
                Debug.Log("RECEIVE " + e.Data);
                this.Receive(e.Data);
            };

            ws.Connect();
            Debug.Log("CONNECTION " + ws.Url);

            this.ws = ws;
        }

        /// <summary>
        /// WebSocket接続を切断する。
        /// </summary>
        public void Close()
        {
            var ws = this.ws;
            if (ws != null)
            {
                this.ws = null;
                ws.Close();
            }
        }

        /// <summary>
        /// JSON-RPC2リクエストを送信する。
        /// </summary>
        /// <param name="method">メソッド名。</param>
        /// <param name="param">引数のJSONオブジェクト。</param>
        /// <returns>メソッドの戻り値。</returns>
        public IObservable<string> Call(string method, IDictionary<string, object> param = null)
        {
            IDictionary<string, object> body = new Dictionary<string, object>() {
                { "jsonrpc", VERSION },
                { "method", method },
                { "id", this.GenerateId() },
            };

            if (param != null)
            {
                body["params"] = param;
            }

            return Observable.Defer(() =>
            {
                // リトライされた場合もIDは変える
                var id = this.GenerateId();
                var copiedbody = new Dictionary<string, object>(body);
                copiedbody["id"] = id;

                var subject = new Subject<object>();
                this.callback[id] = subject;

                this.Send(Json.Serialize(copiedbody))
                    .Subscribe(_ => { }, (ex) =>
                    {
                        this.callback.Remove(id);
                        subject.OnError(ex);
                    });

                // タイムアウトチェック用のタイマーもセットする
                if (this.Timeout > 0)
                {
                    Observable.Timer(TimeSpan.FromMilliseconds(this.Timeout)).Subscribe(_ =>
                    {
                        Subject<object> sub;
                        if (this.callback.TryGetValue(id, out sub))
                        {
                            this.callback.Remove(id);
                            sub.OnError(new Exception("Call is timeouted"));
                        }
                    });
                }

                return subject.Select((s) => (string)s);
            });
        }

        /// <summary>
        /// JSON-RPC2リクエストを送信する。
        /// </summary>
        /// <param name="method">メソッド名。</param>
        /// <param name="param">引数のJSON文字列。</param>
        /// <returns>メソッドの戻り値。</returns>
        public IObservable<string> Call(string method, string param)
        {
            return this.Call(method, (IDictionary<string, object>)Json.Deserialize(param));
        }

        /// <summary>
        /// JSON-RPC2リクエストを送信する。
        /// </summary>
        /// <typeparam name="T">戻り値の型（MiniJSONで変換可能な型のみ）。</typeparam>
        /// <param name="method">メソッド名。</param>
        /// <param name="param">引数のJSON文字列。</param>
        /// <returns>メソッドの戻り値。</returns>
        public IObservable<T> Call<T>(string method, IDictionary<string, object> param = null)
        {
            return this.Call(method, param).Select((s) => (T)Json.Deserialize(s));
        }

        /// <summary>
        /// JSON-RPC2通知リクエストを送信する。
        /// </summary>
        /// <param name="method">メソッド名。</param>
        /// <param name="param">引数のJSONオブジェクト。</param>
        /// <returns>処理状態。</returns>
        public IObservable<Unit> Notice(string method, IDictionary<string, object> param = null)
        {
            var body = new Dictionary<string, object>() {
                { "jsonrpc", VERSION },
                { "method", method },
            };

            if (param != null)
            {
                body["params"] = param;
            }

            return this.Send(Json.Serialize(body));
        }

        /// <summary>
        /// JSON-RPC2通知リクエストを送信する。
        /// </summary>
        /// <param name="method">メソッド名。</param>
        /// <param name="param">引数のJSON文字列。</param>
        /// <returns>処理状態。</returns>
        public IObservable<Unit> Notice(string method, string param)
        {
            return this.Notice(method, (IDictionary<string, object>)Json.Deserialize(param));
        }

        /// <summary>
        /// WebSocketメッセージを送信する。
        /// </summary>
        /// <param name="message">メッセージ。</param>
        /// <returns>処理状態。</returns>
        public IObservable<Unit> Send(string message)
        {
            return Observable.Defer(() =>
            {
                var ws = this.ws;
                if (ws == null)
                {
                    throw new Exception("WebSocket is not connected");
                }

                Debug.Log("SEND " + message);
                var subject = new Subject<Unit>();
                ws.SendAsync(message, (success) =>
                {
                    if (success)
                    {
                        subject.OnNext(Unit.Default);
                        subject.OnCompleted();
                    }
                    else
                    {
                        subject.OnError(new Exception("WebSocket send failed"));
                    }
                });

                return subject;
            });
        }

        /// <summary>
        /// コネクションが接続中の状態か？
        /// </summary>
        /// <returns>接続中の場合true。</returns>
        public bool IsConnected()
        {
            var ws = this.ws;
            return ws != null && ws.ReadyState == WebSocketState.Connecting;
        }

        #endregion

        #region 内部メソッド

        /// <summary>
        /// リクエスト用のIDを発行する。
        /// </summary>
        /// <returns>生成したID。</returns>
        private int GenerateId()
        {
            // ※ クライアント想定なので、桁あふれとかは想定しない
            return Interlocked.Increment(ref this.idCounter);
        }

        /// <summary>
        /// WebSocketメッセージを受信する。
        /// </summary>
        /// <param name="message">メッセージ。</param>
        private void Receive(string message)
        {
            var json = Json.Deserialize(message) as IDictionary<string, object>;
            if (json == null)
            {
                this.Send(this.CreateResponse(null, null, new Exception("ParseError"))).Subscribe();
                return;
            }

            // resultかerrorがあったらレスポンス
            object error;
            object result = null;
            if (json.TryGetValue("error", out error) || json.TryGetValue("result", out result))
            {
                object idObj;
                if (json.TryGetValue("id", out idObj))
                {
                    if (idObj is long)
                    {
                        var id = (int)(long)idObj;
                        Subject<object> subject;
                        if (this.callback.TryGetValue(id, out subject))
                        {
                            if (error != null)
                            {
                                // TODO: 存在チェックとかちゃんとする
                                var err = error as IDictionary<string, object>;
                                subject.OnError(new Exception((string)err["message"]));
                            }
                            else
                            {
                                subject.OnNext(Json.Serialize(result));
                                subject.OnCompleted();
                            }

                            this.callback.Remove(id);
                        }
                    }
                }
            }

            // TODO: サーバー発のリクエストにも対応する
        }

        /// <summary>
        /// JSON-RPC2レスポンスを生成する。
        /// </summary>
        /// <param name="id">ID。</param>
        /// <param name="result">正常終了時の結果。</param>
        /// <param name="ex">エラー時の例外。</param>
        /// <returns>レスポンスJSON文字列。</returns>
        private string CreateResponse(object id, IDictionary<string, object> result, Exception ex = null)
        {
            var res = new Dictionary<string, object>() {
                { "jsonrpc", VERSION },
                { "id", id },
            };

            if (ex != null)
            {
                var err = new Dictionary<string, object>() {
                    // FIXME: codeは何か入れる
                    { "code", 0 },
                    { "message", ex.Message },
                };

                var data = ex.Data;
                if (data != null)
                {
                    err["data"] = data;
                }

                res["error"] = err;
            }
            else
            {
                res["result"] = result;
            }

            return Json.Serialize(res);

        }

        #endregion

        #region 内部クラス

        /// <summary>
        /// JSON-RPCエラー例外クラス。
        /// </summary>
        public class JsonRpc2Exception : Exception
        {
            private System.Collections.IDictionary data;

            public int Code { get; }
            public override System.Collections.IDictionary Data {
                get { return this.data; }
            }

            public JsonRpc2Exception(int code, string message, dynamic data) : base(message)
            {
                this.Code = code;
                this.data = data;
            }
        }

        #endregion
    }
}