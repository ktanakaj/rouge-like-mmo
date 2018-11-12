// ================================================================================================
// <summary>
//      WebSocket/JSON-RPC2 APIリクエスト用クライアントソース</summary>
//
// <copyright file="AppWsRequest.cs">
//      Copyright (C) 2018 Koichi Tanaka. All rights reserved.</copyright>
// <author>
//      Koichi Tanaka</author>
// ================================================================================================

namespace Honememo.RougeLikeMmo.Gateways
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Net;
    using UniRx;
    using Zenject;

    /// <summary>
    /// WebSocket/JSON-RPC2 APIリクエスト用クライアントクラス。
    /// </summary>
    /// <remarks>WebSocket APIは認証必須なので、その辺りも含めて提供する。</remarks>
    public class AppWsRequest
    {
        // TODO: ApiWebRequestと処理の粒度が異なる（あちらは認証が手動だったり）のが気になる。できれば統一したい。あちらを合わせる？

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

        #endregion

        #region 公開変数

        /// <summary>
        /// APIサーバーのルート。
        /// </summary>
        public string Url = "/ws/";

        /// <summary>
        /// プレイヤーID。
        /// </summary>
        public int PlayerId;

        /// <summary>
        /// 端末トークン。
        /// </summary>
        public string Token;

        #endregion

        #region 公開メソッド

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
            return this.taskRunner.Enqueue<string>(
                this.ExceptionFilter(
                    this.GetConnection().SelectMany((conn) => conn.Call(method, param))));
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
            return this.taskRunner.Enqueue<T>(
                this.ExceptionFilter(
                    this.GetConnection().SelectMany((conn) => conn.Call<T>(method, param))));
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
            return this.taskRunner.Enqueue<Unit>(
                this.ExceptionFilter(
                    this.GetConnection().SelectMany((conn) => conn.Notice(method, param))));
        }

        #endregion

        #region 内部メソッド

        /// <summary>
        /// WebSocket接続を取得する。
        /// </summary>
        /// <returns>コネクション。</returns>
        /// <remarks>未接続の場合は接続する。</remarks>
        private IObservable<WebSocketRpcConnection> GetConnection()
        {
            return Observable.Defer<WebSocketRpcConnection>(() => 
            {
                var conn = this.conn;
                if (conn != null && conn.IsConnected())
                {
                    return Observable.Return(conn);
                }

                var subject = new Subject<WebSocketRpcConnection>();
                conn = new WebSocketRpcConnection(this.Url);
                conn.Connect();
                conn.Call("login", new Dictionary<string, object>() {
                    { "id", this.PlayerId },
                    { "token", this.Token },
                }).Subscribe(_ => {
                    this.conn = conn;
                    subject.OnNext(conn);
                }, subject.OnError, subject.OnCompleted);
                return subject;
            });
        }

        /// <summary>
        /// API例外のフィルターを追加する。
        /// </summary>
        /// <param name="observable">フィルター対象のAPI呼び出し。</param>
        /// <returns>フィルターしたAPI呼び出し。</returns>
        private IObservable<T> ExceptionFilter<T>(IObservable<T> observable)
        {
            // TODO: HTTPエラーみたいに決まったものがないので、アプリ独自のエラーコードを見て判断する
            return observable
                .Catch((WWWErrorException ex) =>
                {
                    // サーバーエラーのエラーコードの場合、リトライ可として例外を投げる
                    if (ex.StatusCode == HttpStatusCode.InternalServerError || ex.StatusCode == HttpStatusCode.ServiceUnavailable)
                    {
                        throw new ObservableSerialRunner.RetryableException(ex);
                    }

                    throw ex;
                });
        }

        #endregion
    }
}