﻿// ================================================================================================
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
    using UniRx;
    using UnityEngine;
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
        /// <returns>レスポンス文字列。</returns>
        public IObservable<string> Get(string api)
        {
            var url = this.CreateUrl(api);
            return this.taskRunner.Enqueue<string>(
                this.LogFilter(
                    ObservableWWW.Get(url),
                    "GET",
                    url));
        }

        /// <summary>
        /// APIサーバーにJSONボディでPOSTリクエストを送信する。
        /// </summary>
        /// <param name="api">APIパス。</param>
        /// <param name="json">送信するJSON文字列。</param>
        /// <returns>レスポンス文字列。</returns>
        public IObservable<string> Post(string api, string json = "")
        {
            var headers = new Dictionary<string, string>();
            headers["Content-Type"] = "application/json";
            var url = this.CreateUrl(api);
            return this.taskRunner.Enqueue<string>(
                this.LogFilter(
                    ObservableWWW.Post(this.CreateUrl(api), System.Text.Encoding.UTF8.GetBytes(json), headers),
                    "POST",
                    url,
                    json));
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
        /// APIログのフィルターを追加する。
        /// </summary>
        /// <param name="observable">フィルター対象のAPI呼び出し。</param>
        /// <param name="method">HTTPメソッド名。</param>
        /// <param name="url">URL。</param>
        /// <param name="body">ボディ文字列。</param>
        /// <returns>フィルターしたAPI呼び出し。</returns>
        private IObservable<string> LogFilter(IObservable<string> observable, string method, string url, string body = "")
        {
            return observable
                .Select((result) => {
                    this.Log(method, url, body, result, HttpStatusCode.OK);
                    return result;
                })
                .Catch((WWWErrorException ex) => {
                    this.Log(method, url, body, ex.Text, ex.StatusCode);
                    throw ex;
                });
        }

        /// <summary>
        /// APIログを出力する。
        /// </summary>
        /// <param name="method">HTTPメソッド名。</param>
        /// <param name="url">URL。</param>
        /// <param name="body">ボディ文字列。</param>
        /// <param name="result">レスポンス文字列。</param>
        /// <param name="status">HTTPステータスコード。</param>
        /// <param name="start">処理開始日時。</param>
        private void Log(string method, string url, string body, string result, HttpStatusCode status, DateTimeOffset? start = null)
        {
            string log = method.ToUpper() + " " + url;
            if (status > 0)
            {
                log += " " + status;
            }

            if (start != null)
            {
                log += " " + (DateTimeOffset.Now - (DateTimeOffset)start).TotalMilliseconds + " ms";
            }

            if (body.Length > 0)
            {
                log += Environment.NewLine + "BODY: " + body;
            }

            if (result.Length > 0)
            {
                log += Environment.NewLine + "RESULT: " + result;
            }

            if (status >= HttpStatusCode.InternalServerError)
            {
                Debug.LogError(log);
            }
            else if (status >= HttpStatusCode.BadRequest)
            {
                Debug.LogWarning(log);
            }
            else
            {
                Debug.Log(log);
            }
        }

        #endregion
    }
}