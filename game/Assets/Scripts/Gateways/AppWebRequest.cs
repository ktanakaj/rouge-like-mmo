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
    using UniRx;
    using Zenject;

    /// <summary>
    /// APIリクエスト用クライアントクラス。
    /// </summary>
    public class AppWebRequest
    {
        #region 内部変数

        /// <summary>
        /// タスクランナー。
        /// </summary>
        [Inject]
        private ObservableSerialRunner taskRunner;

        #endregion

        #region 公開変数

        /// <summary>
        /// APIサーバーのルート。
        /// </summary>
        public string ApiBase = "/";

        #endregion

        #region 公開メソッド

        /// <summary>
        /// APIサーバーにGETリクエストを送信する。
        /// </summary>
        /// <param name="api">APIパス。</param>
        /// <returns>レスポンスのJSON文字列。</returns>
        public IObservable<string> Get(string api)
        {
            var headers = new Dictionary<string, string>();
            headers["Content-Type"] = "application/json";
            return this.taskRunner.Enqueue<string>(ObservableWWW.Get(this.CreateUrl(api), headers));
        }

        /// <summary>
        /// APIサーバーにPOSTリクエストを送信する。
        /// </summary>
        /// <param name="api">APIパス。</param>
        /// <param name="json">送信するJSON文字列。</param>
        /// <returns>レスポンスのJSON文字列。</returns>
        public IObservable<string> Post(string api, string json = "")
        {
            var headers = new Dictionary<string, string>();
            headers["Content-Type"] = "application/json";
            return this.taskRunner.Enqueue<string>(ObservableWWW.Post(this.CreateUrl(api), System.Text.Encoding.UTF8.GetBytes(json), headers));
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

        #endregion
    }
}