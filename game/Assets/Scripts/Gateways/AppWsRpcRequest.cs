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
        private ObservableSerialRunner taskRunner;

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
            return Observable.Defer(() =>
            {
                // 既に接続済みの場合は一旦終了する
                this.Close();

                // 再接続用に接続情報を保存
                this.url = url;
                this.playerId = playerId;
                this.token = token;

                // 接続を作成する
                return this.CreateConnection()
                    .Select((conn) => {
                        this.conn = conn;
                        return Unit.Default;
                    });
            });
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
        /// <param name="param">引数のJSONオブジェクト。</param>
        /// <returns>メソッドの戻り値。</returns>
        public IObservable<string> Call(string method, IDictionary<string, object> param = null)
        {
            return this.taskRunner.Enqueue<string>(
                this.ExceptionFilter(
                    this.GetConnection().SelectMany((conn) => conn.Call(method, param))));
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
            return this.taskRunner.Enqueue<Unit>(
                this.ExceptionFilter(
                    this.GetConnection().SelectMany((conn) => conn.Notice(method, param))));
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

        #endregion

        #region 内部メソッド

        /// <summary>
        /// WebSocket接続を生成する。
        /// </summary>
        /// <returns>コネクション。</returns>
        private IObservable<WebSocketRpcConnection> CreateConnection()
        {
            return Observable.Defer(() =>
            {
                try
                {
                    // 接続を確立し、各種イベントを登録する
                    var conn = new WebSocketRpcConnection(this.url);
                    conn.Connect();
                    // TODO: イベントの登録
                    // TODO: コネクションエラー時の再接続もイベントでやる

                    // 自動的にログインAPIも呼ぶ
                    return conn.Call("login", new Dictionary<string, object>() {
                        { "id", this.playerId },
                        { "token", this.token },
                    }).Select(_ => conn);
                }
                catch (Exception e)
                {
                    return Observable.Throw<WebSocketRpcConnection>(e);
                }
            });
        }

        /// <summary>
        /// WebSocket接続を取得する。
        /// </summary>
        /// <returns>コネクション。</returns>
        private IObservable<WebSocketRpcConnection> GetConnection()
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
                .Catch((WebSocketRpcConnection.JsonRpc2Exception ex) =>
                {
                    // TODO: HTTPエラーみたいに汎用的に判断ができないので、アプリ独自のエラーコードを見て判断する
                    // サーバーエラーのエラーコードの場合、リトライ可として例外を投げる
                    // if (ex.Code == -1)
                    // {
                    //     throw new ObservableSerialRunner.RetryableException(ex);
                    // }

                    throw ex;
                });
        }

        #endregion
    }
}