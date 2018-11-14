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
    using System.Threading.Tasks;
    using MiniJSON;
    using UniRx;
    using UnityEngine;
    using WebSocketSharp;

    /// <summary>
    /// WebSocket/JSON-RPC2コネクションクラス。
    /// </summary>
    public class WebSocketRpcConnection : IDisposable
    {
        #region 定数

        /// <summary>
        /// JSON-RPCバージョン。
        /// </summary>
        private const string VERSION = "2.0";

        #endregion

        #region delegate定義

        /// <summary>
        /// サーバーから送られたリクエストを処理するハンドラー。
        /// </summary>
        /// <param name="method">メソッド名。</param>
        /// <param name="param">引数のJSONオブジェクト。</param>
        /// <param name="id">stringまたはlongのID。</param>
        /// <param name="conn">リクエストを受けたコネクション。</param>
        /// <returns>メソッドの戻り値。</returns>
        public delegate Task<object> RequestHandlerDelegate(string method, object param, object id, WebSocketRpcConnection conn);

        /// <summary>
        /// WebSocketクローズ時のイベント用ハンドラー。
        /// </summary>
        /// <param name="code">終了コード。</param>
        /// <param name="conn">クローズしたコネクション。</param>
        public delegate void OnCloseDelegate(int code, WebSocketRpcConnection conn);

        /// <summary>
        /// WebSocketエラー時のイベント用ハンドラー。
        /// </summary>
        /// <param name="ex">例外。</param>
        /// <param name="conn">エラーが発生したコネクション。</param>
        public delegate void OnErrorDelegate(Exception ex, WebSocketRpcConnection conn);

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

        /// <summary>
        /// サーバーから送られたリクエストを処理するハンドラー。
        /// </summary>
        public RequestHandlerDelegate requestHandler = (method, param, id, conn) =>
        {
            throw new JsonRpc2Exception(JsonRpc2Exception.ErrorCode.MethodNotFound);
        };

        #endregion

        #region プロパティ

        /// <summary>
        /// 接続先URL。
        /// </summary>
        public string Url { get; }

        /// <summary>
        /// Callのタイムアウト時間。
        /// </summary>
        public uint Timeout { get; set; } = 60000;

        /// <summary>
        /// サーバーから送られたリクエストを処理するハンドラー。
        /// </summary>
        public RequestHandlerDelegate RequestHandler
        {
            get
            {
                return this.requestHandler;
            }
            set
            {
                if (value == null)
                {
                    throw new ArgumentException("RequestHandler is required");
                }

                this.requestHandler = value;
            }
        }

        #endregion

        #region イベント

        /// <summary>
        /// WebSocketクローズイベント。
        /// </summary>
        public event OnCloseDelegate OnClose;

        /// <summary>
        /// WebSocketエラーイベント。
        /// </summary>
        public event OnErrorDelegate OnError;

        #endregion

        #region コンストラクタ

        /// <summary>
        /// 指定されたURLへのWebSocket/JSON-RPC2コネクションを生成する。
        /// </summary>
        /// <param name="url">接続先URL。</param>
        public WebSocketRpcConnection(string url)
        {
            this.Url = url;
        }

        #endregion

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
                this.OnError?.Invoke(e.Exception, this);
                this.Close();
            };

            ws.OnClose += (sender, e) =>
            {
                Debug.Log("CLOSE code=" + e.Code + ", reason=" + e.Reason);
                this.OnClose?.Invoke(e.Code, this);

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
        /// <param name="param">引数のJSONオブジェクト（MiniJSONで変換可能な型のみ）。</param>
        /// <returns>メソッドの戻り値。</returns>
        public IObservable<string> Call(string method, object param = null)
        {
            return Observable.Defer(() =>
            {
                // リトライされた場合もIDは変える
                var id = this.GenerateId();
                var json = new JsonRpc2Request(method, param, id).ToJson();

                var subject = new Subject<object>();
                this.callback[id] = subject;

                this.Send(json)
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
                            sub.OnError(new JsonRpc2Exception((int)JsonRpc2Exception.ErrorCode.InternalError, "RPC response timeouted. (" + json + ")"));
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
            return this.Call(method, Json.Deserialize(param));
        }

        /// <summary>
        /// JSON-RPC2リクエストを送信する。
        /// </summary>
        /// <typeparam name="T">戻り値の型（MiniJSONで変換可能な型のみ）。</typeparam>
        /// <param name="method">メソッド名。</param>
        /// <param name="param">引数のJSONオブジェクト（MiniJSONで変換可能な型のみ）。</param>
        /// <returns>メソッドの戻り値。</returns>
        public IObservable<T> Call<T>(string method, object param = null)
        {
            return this.Call(method, param).Select((s) => (T)Json.Deserialize(s));
        }

        /// <summary>
        /// JSON-RPC2通知リクエストを送信する。
        /// </summary>
        /// <param name="method">メソッド名。</param>
        /// <param name="param">引数のJSONオブジェクト。</param>
        /// <returns>処理状態。</returns>
        public IObservable<Unit> Notice(string method, object param = null)
        {
            return this.Send(new JsonRpc2Request(method, param).ToJson());
        }

        /// <summary>
        /// JSON-RPC2通知リクエストを送信する。
        /// </summary>
        /// <param name="method">メソッド名。</param>
        /// <param name="param">引数のJSON文字列。</param>
        /// <returns>処理状態。</returns>
        public IObservable<Unit> Notice(string method, string param)
        {
            return this.Notice(method, Json.Deserialize(param));
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
                    throw new WebSocketException("WebSocket is not connected");
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
                        subject.OnError(new WebSocketException("WebSocket send failed"));
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
        private async void Receive(string message)
        {
            JsonRpc2Response res;
            try
            {
                res = await this.DoMethodOrCallback(message);
            }
            catch (Exception ex)
            {
                res = new JsonRpc2Response(JsonRpc2Exception.Convert(ex));
            }

            if (res != null)
            {
                this.Send(res.ToJson()).Subscribe();
            }
        }

        /// <summary>
        /// JSON-RPC2リクエスト/レスポンスを処理する。
        /// </summary>
        /// <param name="json">リクエスト/レスポンスのJSON文字列。</param>
        /// <returns>レスポンスのJSON文字列。通知やレスポンス無しの場合はnull。</returns>
        private async Task<JsonRpc2Response> DoMethodOrCallback(string json)
        {
            // TODO: バッチリクエスト／レスポンスには未対応

            // レスポンス/リクエストかチェック
            JsonRpc2Response res;
            JsonRpc2Request req;
            if (JsonRpc2Response.TryParse(json, out res))
            {
                // ※ intのIDしか送ってないのでintのIDしか返ってこない想定
                var id = (int)(long)res.Id;
                Subject<object> subject;
                if (this.callback.TryGetValue(id, out subject))
                {
                    if (res.Error != null)
                    {
                        subject.OnError(res.Error);
                    }
                    else
                    {
                        subject.OnNext(Json.Serialize(res.Result));
                        subject.OnCompleted();
                    }

                    this.callback.Remove(id);
                }

                return null;
            }
            else if (JsonRpc2Request.TryParse(json, out req))
            {
                // リクエストの場合はハンドラーに任せる
                try
                {
                    var result = await this.RequestHandler(req.Method, req.Params, req.Id, this);
                    if (req.Id != null)
                    {
                        return new JsonRpc2Response(result, req.Id);
                    }

                    return null;
                }
                catch (Exception ex)
                {
                    return new JsonRpc2Response(JsonRpc2Exception.Convert(ex), req.Id);
                }
            }

            throw new JsonRpc2Exception(JsonRpc2Exception.ErrorCode.ParseError);
        }

        #endregion

        #region 内部クラス

        /// <summary>
        /// JSON-RPC2リクエストクラス。
        /// </summary>
        public class JsonRpc2Request
        {
            #region プロパティ

            /// <summary>
            /// プロトコルバージョン。
            /// </summary>
            public string Jsonrpc { get; private set; } = VERSION;

            /// <summary>
            /// メソッド名。
            /// </summary>
            public string Method { get; }

            /// <summary>
            /// 引数。
            /// </summary>
            public object Params { get; set; }

            /// <summary>
            /// ID。
            /// </summary>
            public object Id { get; set; }

            #endregion

            #region コンストラクタ

            /// <summary>
            /// JSON-RPC2リクエストを生成する。
            /// </summary>
            /// <param name="method">メソッド名。</param>
            /// <param name="param">引数。</param>
            /// <param name="id">ID。通知リクエストの場合無し。</param>
            public JsonRpc2Request(string method, object param, object id = null)
            {
                this.Method = method;
                this.Params = param;
                this.Id = id;
            }

            #endregion

            #region メソッド

            /// <summary>
            /// MiniJSONのオブジェクトをJSON-RPC2リクエストとして解析する。
            /// </summary>
            /// <param name="json">JSONオブジェクト。</param>
            /// <param name="request">解析したリクエスト。</param>
            /// <returns>解析できた場合true。</returns>
            public static bool TryParse(object json, out JsonRpc2Request request)
            {
                request = null;

                var req = json as IDictionary<string, object>;
                if (req == null)
                {
                    return false;
                }

                // 以下methodだけ必須。他はあれば取得（jsonrpcのバージョンチェックはしない）
                object method;
                if (!req.TryGetValue("method", out method) || method == null)
                {
                    return false;
                }

                object jsonrpcObj;
                var jsonrpc = "";
                if (req.TryGetValue("jsonrpc", out jsonrpcObj) && jsonrpcObj != null)
                {
                    jsonrpc = jsonrpcObj.ToString();
                }

                object param;
                req.TryGetValue("params", out param);
                object id;
                req.TryGetValue("id", out id);

                request = new JsonRpc2Request(method.ToString(), param, id) { Jsonrpc = jsonrpc };
                return true;
            }

            /// <summary>
            /// JSON文字列をJSON-RPC2リクエストとして解析する。
            /// </summary>
            /// <param name="json">JSON文字列。</param>
            /// <param name="request">解析したリクエスト。</param>
            /// <returns>解析できた場合true。</returns>
            public static bool TryParse(string json, out JsonRpc2Request request)
            {
                return TryParse(Json.Deserialize(json), out request);
            }

            /// <summary>
            /// JSON-RPC2リクエストのJSON文字列を生成する。
            /// </summary>
            /// <returns>JSON文字列。</returns>
            public string ToJson()
            {
                var req = new Dictionary<string, object>() {
                    { "jsonrpc", this.Jsonrpc },
                    { "method", this.Method },
                    { "id", this.Id },
                };

                if (this.Params != null)
                {
                    req["params"] = this.Params;
                }

                return Json.Serialize(req);
            }

            #endregion
        }

        /// <summary>
        /// JSON-RPC2レスポンスクラス。
        /// </summary>
        public class JsonRpc2Response
        {
            #region プロパティ

            /// <summary>
            /// プロトコルバージョン。
            /// </summary>
            public string Jsonrpc { get; set; } = VERSION;

            /// <summary>
            /// 戻り値。
            /// </summary>
            public object Result { get; }

            /// <summary>
            /// エラー。
            /// </summary>
            public JsonRpc2Exception Error { get; }

            /// <summary>
            /// ID。
            /// </summary>
            public object Id { get; }

            #endregion

            #region コンストラクタ

            /// <summary>
            /// JSON-RPC2レスポンスを生成する。
            /// </summary>
            /// <param name="id">ID。</param>
            /// <param name="result">戻り値。</param>
            public JsonRpc2Response(object result, object id)
            {
                this.Id = id;
                this.Result = result;
            }

            /// <summary>
            /// JSON-RPC2エラーレスポンスを生成する。
            /// </summary>
            /// <param name="error">エラー。</param>
            public JsonRpc2Response(JsonRpc2Exception error, object id = null)
            {
                this.Error = error;
            }

            #endregion

            #region メソッド

            /// <summary>
            /// MiniJSONのオブジェクトをJSON-RPC2レスポンスとして解析する。
            /// </summary>
            /// <param name="json">JSONオブジェクト。</param>
            /// <param name="response">解析したレスポンス。</param>
            /// <returns>解析できた場合true。</returns>
            public static bool TryParse(object json, out JsonRpc2Response response)
            {
                response = null;

                var res = json as IDictionary<string, object>;
                if (res == null)
                {
                    return false;
                }

                // 以下resultまたはerrorが必須。他はあれば取得（jsonrpcのバージョンチェックはしない）
                object jsonrpcObj;
                var jsonrpc = "";
                if (res.TryGetValue("jsonrpc", out jsonrpcObj) && jsonrpcObj != null)
                {
                    jsonrpc = jsonrpcObj.ToString();
                }

                object id;
                res.TryGetValue("id", out id);


                object error;
                object result = null;
                if (res.TryGetValue("error", out error))
                {
                    response = new JsonRpc2Response(JsonRpc2Exception.Convert(error), id) { Jsonrpc = jsonrpc };
                    return true;
                }
                else if (res.TryGetValue("result", out result))
                {
                    response = new JsonRpc2Response(result, id) { Jsonrpc = jsonrpc };
                    return true;
                }

                return false;
            }

            /// <summary>
            /// JSON文字列をJSON-RPC2レスポンスとして解析する。
            /// </summary>
            /// <param name="json">JSON文字列。</param>
            /// <param name="response">解析したレスポンス。</param>
            /// <returns>解析できた場合true。</returns>
            public static bool TryParse(string json, out JsonRpc2Response response)
            {
                return TryParse(Json.Deserialize(json), out response);
            }

            /// <summary>
            /// JSON-RPC2レスポンスのJSON文字列を生成する。
            /// </summary>
            /// <returns>JSON文字列。</returns>
            public string ToJson()
            {
                var res = new Dictionary<string, object>() {
                    { "jsonrpc", this.Jsonrpc },
                    { "id", this.Id },
                };

                if (this.Error != null)
                {
                    res["error"] = this.Error.ToDictionary();
                }
                else
                {
                    res["result"] = this.Result;
                }

                return Json.Serialize(res);
            }

            #endregion
        }

        #endregion
    }
}