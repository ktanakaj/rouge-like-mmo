// ================================================================================================
// <summary>
//      WebSocket/JSON-RPC2 APIリクエスト用クライアントソース</summary>
//
// <copyright file="AppWsRpcRequest.cs">
//      Copyright (C) 2018 Koichi Tanaka. All rights reserved.</copyright>
// <author>
//      Koichi Tanaka</author>
// ================================================================================================

namespace Honememo.RougeLikeMmo.Gateways
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using MiniJSON;
    using UniRx;
    using Zenject;

    /// <summary>
    /// WebSocket/JSON-RPC2 APIリクエスト用クライアントクラス。
    /// </summary>
    /// <remarks>
    /// DIをする都合上、接続のたびにConnectionを作る形だと他のクラスから使い難いため、
    /// Connectionをラップするクライアントとして定義。
    /// </remarks>
    public class AppWsRpcRequest
    {
        #region 内部変数

        /// <summary>
        /// タスクランナー。
        /// </summary>
        [Inject]
        private ObservableSerialRunner taskRunner = null;

        /// <summary>
        /// WebSocket接続。
        /// </summary>
        private WebSocketRpcConnection conn;

        /// <summary>
        /// WebSocket接続先URL。
        /// </summary>
        private string url;

        /// <summary>
        /// プレイヤーID。
        /// </summary>
        private int playerId;

        /// <summary>
        /// 端末トークン。
        /// </summary>
        private string token;

        #endregion

        #region プロパティ

        /// <summary>
        /// JSON-RPC2リクエスト処理用のメソッド定義。
        /// </summary>
        /// <remarks>メソッドを登録すると、サーバーからのリクエスト受信時に呼び出される。</remarks>
        public IDictionary<string, WebSocketRpcConnection.RequestHandlerDelegate> Methods { get; } = new Dictionary<string, WebSocketRpcConnection.RequestHandlerDelegate>();

        #endregion

        #region 公開メソッド

        /// <summary>
        /// WebSocket接続を開始する。
        /// </summary>
        /// <param name="url">接続先URL。</param>
        /// <param name="playerId">プレイヤーID。</param>
        /// <param name="token">端末トークン。</param>
        /// <returns>処理状態。</returns>
        public IObservable<Unit> Connect(string url, int playerId, string token)
        {
            // 接続情報を保存
            this.url = url;
            this.playerId = playerId;
            this.token = token;

            // 保存された情報で接続を開始
            return this.Reconnect();
        }

        /// <summary>
        /// WebSocket接続を終了する。
        /// </summary>
        public void Close()
        {
            var conn = this.conn;
            if (conn != null)
            {
                this.conn = null;
                conn.Close();
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
            return this.taskRunner.Enqueue<string>(
                this.ExceptionFilter(
                    this.ObservableConn().SelectMany((conn) => conn.Call(method, param))));
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
        /// <param name="param">引数のJSONオブジェクト（MiniJSONで変換可能な型のみ）。</param>
        /// <returns>処理状態。</returns>
        public IObservable<Unit> Notice(string method, object param = null)
        {
            return this.taskRunner.Enqueue<Unit>(
                this.ExceptionFilter(
                    this.ObservableConn().SelectMany((conn) => conn.Notice(method, param))));
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

        #endregion

        #region 内部メソッド

        /// <summary>
        /// WebSocket接続を現在の設定から接続する。
        /// </summary>
        /// <returns>処理状態。</returns>
        private IObservable<Unit> Reconnect()
        {
            return Observable.Defer(() =>
            {
                try
                {
                    // 既に接続済みの場合は一旦終了する
                    this.Close();

                    // 接続を確立し、リクエスト受け取り用の処理を登録
                    var conn = new WebSocketRpcConnection(this.url);
                    conn.Connect();
                    conn.RequestHandler = this.Receive;

                    // 自動的にログインAPIも呼ぶ
                    return conn.Call("login", new Dictionary<string, object>() {
                        { "id", this.playerId },
                        { "token", this.token },
                    }).Select(_ =>
                    {
                        // 確立したコネクションを保存
                        // TODO: OnCloseイベントなどに、コネクションエラー時の再接続を登録する
                        this.conn = conn;
                        return Unit.Default;
                    });
                }
                catch (Exception e)
                {
                    return Observable.Throw<Unit>(e);
                }
            });
        }

        /// <summary>
        /// WebSocket接続を非同期で取得する。
        /// </summary>
        /// <returns>コネクション。</returns>
        private IObservable<WebSocketRpcConnection> ObservableConn()
        {
            // this.connから直接Subscribeを伸ばすと、再接続時に古いインスタンスが
            // 参照される気がしたので、非同期で取得する処理を用意。
            return Observable.Defer(() => Observable.Return(this.conn));
        }

        /// <summary>
        /// API例外のフィルターを追加する。
        /// </summary>
        /// <param name="observable">フィルター対象のAPI呼び出し。</param>
        /// <returns>フィルターしたAPI呼び出し。</returns>
        private IObservable<T> ExceptionFilter<T>(IObservable<T> observable)
        {
            return observable
                .Catch((WebSocketException ex) =>
                {
                    throw new ObservableSerialRunner.RetryableException(ex);
                })
                .Catch((JsonRpc2Exception ex) =>
                {
                    // TODO: HTTPエラーみたいに汎用的に判断ができないので、アプリ独自のエラーコードを見て判断する
                    // サーバーエラーのエラーコードの場合、リトライ可として例外を投げる
                    if (ex.Code == (int)JsonRpc2Exception.ErrorCode.InternalError)
                    {
                        throw new ObservableSerialRunner.RetryableException(ex);
                    }

                    throw ex;
                });
        }

        /// <summary>
        /// JSON-RPC2リクエストを受け取る。
        /// </summary>
        /// <param name="method">メソッド名。</param>
        /// <param name="param">引数。</param>
        /// <param name="id">ID。</param>
        /// <param name="conn">リクエストを受け取ったコネクション。</param>
        /// <returns>メソッドの戻り値。</returns>
        private async Task<object> Receive(string method, object param, object id, WebSocketRpcConnection conn)
        {
            // 登録されているメソッドを実行する
            WebSocketRpcConnection.RequestHandlerDelegate func;
            if (!this.Methods.TryGetValue(method, out func))
            {
                throw new JsonRpc2Exception(JsonRpc2Exception.ErrorCode.MethodNotFound);
            }

            return await func(method, param, id, conn);
        }

        #endregion
    }
}