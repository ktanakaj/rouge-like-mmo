// ================================================================================================
// <summary>
//      APIリクエスト用クライアントソース</summary>
//
// <copyright file="AppWebRequest.cs">
//      Copyright (C) 2018 Koichi Tanaka. All rights reserved.</copyright>
// <author>
//      Koichi Tanaka</author>
// ================================================================================================

namespace Honememo.RougeLikeMmo.Gateways
{
    using System;
    using System.Collections.Generic;
    using System.Net;
    using MiniJSON;
    using UniRx;
    using UnityEngine;
    using Zenject;
    using Honememo.RougeLikeMmo.Entities;

    /// <summary>
    /// APIリクエスト用クライアントクラス。
    /// </summary>
    public class AppWebRequest : WebRequest
    {
        #region 定数

        /// <summary>
        /// APIサーバーのセッションIDキー名。
        /// </summary>
        private const string SESSION_ID = "connect.sid";

        #endregion

        #region 内部変数

        /// <summary>
        /// タスクランナー。
        /// </summary>
        [Inject]
        private ObservableSerialRunner taskRunner;

        #endregion

        #region プロパティ

        /// <summary>
        /// APIサーバーのルート。
        /// </summary>
        public string ApiBase { get; set; } = "/";

        #endregion

        #region コンストラクタ

        /// <summary>
        /// APIリクエスト用のクライアントを生成する。
        /// </summary>
        public AppWebRequest()
        {
            this.SessionKey = SESSION_ID;
        }

        #endregion

        #region 公開メソッド

        /// <summary>
        /// APIサーバーにGETリクエストを送信する。
        /// </summary>
        /// <param name="api">APIパス。</param>
        /// <returns>レスポンス文字列。</returns>
        public override IObservable<string> Get(string api)
        {
            return this.taskRunner.Enqueue<string>(this.ExceptionFilter(base.Get(this.CreateUrl(api))));
        }

        /// <summary>
        /// APIサーバーにGETリクエストを送信し、結果をJSONデコードして受け取る。
        /// </summary>
        /// <typeparam name="T">戻り値の型（MiniJSONで変換可能な型のみ）。</typeparam>
        /// <param name="api">APIパス。</param>
        /// <returns>レスポンスJSON。</returns>
        public override IObservable<T> Get<T>(string api)
        {
            return this.Get(api).Select((s) => (T)Json.Deserialize(s));
        }

        /// <summary>
        /// APIサーバーにJSONボディでPOSTリクエストを送信する。
        /// </summary>
        /// <param name="api">APIパス。</param>
        /// <param name="json">送信するJSON文字列。</param>
        /// <returns>レスポンス文字列。</returns>
        public override IObservable<string> Post(string api, string json = "")
        {
            return this.taskRunner.Enqueue<string>(this.ExceptionFilter(base.Post(this.CreateUrl(api), json)));
        }

        /// <summary>
        /// APIサーバーにJSONボディでPOSTリクエストを送信する。
        /// </summary>
        /// <param name="api">APIパス。</param>
        /// <param name="json">送信するJSONオブジェクト。</param>
        /// <returns>レスポンス文字列。</returns>
        public override IObservable<string> Post(string api, IDictionary<string, object> json)
        {
            return this.Post(api, json != null ? Json.Serialize(json) : "");
        }

        /// <summary>
        /// APIサーバーにJSONボディでPOSTリクエストを送信し、結果をJSONデコードして受け取る。
        /// </summary>
        /// <typeparam name="T">戻り値の型（MiniJSONで変換可能な型のみ）。</typeparam>
        /// <param name="api">APIパス。</param>
        /// <param name="json">送信するJSONオブジェクト。</param>
        /// <returns>レスポンスJSON。</returns>
        public override IObservable<T> Post<T>(string api, IDictionary<string, object> json = null)
        {
            return this.Post(api, json).Select((s) => (T)Json.Deserialize(s));
        }

        /// <summary>
        /// APIサーバーに指定されたIDとトークンでログインする。
        /// </summary>
        /// <param name="playerId">プレイヤーID。</param>
        /// <param name="token">端末トークン。</param>
        /// <returns>プレイヤー情報。</returns>
        public IObservable<PlayerEntity> Login(int playerId, string token)
        {
            // ※ ここに実装すべきか微妙だが、AppWsRpcRequestが認証も含んでいるので、こちらも合わせる
            return this.Post("api/players/login", new Dictionary<string, object>()
            {
                { "id", playerId },
                { "token", token },
            }).Select((result) => JsonUtility.FromJson<PlayerEntity>(result));
        }

        #endregion

        #region 内部メソッド

        /// <summary>
        /// APIのURLを生成する。
        /// </summary>
        /// <param name="api">APIパス。</param>
        /// <returns>生成したURL。</returns>
        private string CreateUrl(string api)
        {
            // 現状は文字列連結するだけ
            return this.ApiBase + api;
        }

        /// <summary>
        /// API例外のフィルターを追加する。
        /// </summary>
        /// <typeparam name="T">Observableの型。</typeparam>
        /// <param name="observable">フィルター対象のAPI呼び出し。</param>
        /// <returns>フィルターしたAPI呼び出し。</returns>
        private IObservable<T> ExceptionFilter<T>(IObservable<T> observable)
        {
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