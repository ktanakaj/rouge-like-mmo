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
    using System.Text.RegularExpressions;
    using UniRx;
    using UnityEngine;
    using Zenject;

    /// <summary>
    /// APIリクエスト用クライアントクラス。
    /// </summary>
    public class AppWebRequest
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

        /// <summary>
        /// セッションID。
        /// </summary>
        /// <remarks>簡易的な管理。シーンを跨ぐと消えてしまうので保持。</remarks>
        private string sessionId;

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
                this.ExceptionFilter(
                    this.LogFilter(
                        this.ResponseFilter(
                            ObservableWWW.GetWWW(url, this.MakeDefaultHeaders())),
                        "GET",
                        url)));
        }

        /// <summary>
        /// APIサーバーにJSONボディでPOSTリクエストを送信する。
        /// </summary>
        /// <param name="api">APIパス。</param>
        /// <param name="json">送信するJSON文字列。</param>
        /// <returns>レスポンス文字列。</returns>
        public IObservable<string> Post(string api, string json = "")
        {
            var headers = this.MakeDefaultHeaders();
            headers["Content-Type"] = "application/json";
            var url = this.CreateUrl(api);
            return this.taskRunner.Enqueue<string>(
                this.ExceptionFilter(
                    this.LogFilter(
                        this.ResponseFilter(
                            ObservableWWW.PostWWW(this.CreateUrl(api), System.Text.Encoding.UTF8.GetBytes(json), headers)),
                        "POST",
                        url,
                        json)));
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
            return Observable.Defer(() =>
            {
                var start = DateTimeOffset.Now;
                return observable
                    .Select((result) =>
                    {
                        this.Log(method, url, body, result, HttpStatusCode.OK, start);
                        return result;
                    })
                    .Catch((WWWErrorException ex) =>
                    {
                        this.Log(method, url, body, ex.Text, ex.StatusCode, start);
                        throw ex;
                    });
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

        /// <summary>
        /// API例外のフィルターを追加する。
        /// </summary>
        /// <param name="observable">フィルター対象のAPI呼び出し。</param>
        /// <returns>フィルターしたAPI呼び出し。</returns>
        private IObservable<string> ExceptionFilter(IObservable<string> observable)
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

        /// <summary>
        /// APIのレスポンス処理用のフィルターを追加する。
        /// </summary>
        /// <param name="observable">フィルター対象のAPI呼び出し。</param>
        /// <returns>フィルターしたAPI呼び出し。</returns>
        private IObservable<string> ResponseFilter(IObservable<WWW> observable)
        {
            // WWWを貰って、レスポンスヘッダーなどを処理した上で、textを返す
            return observable
                .Select((www) => {
                    // レスポンスにCookieがある場合は、セッションIDを取り出して保存する
                    // （WWWのCookieはシーン切り替えで消滅するため）
                    string header;
                    if (www.responseHeaders.TryGetValue("Set-Cookie", out header))
                    {
                        // ※ 面倒なのでPathとかHttpOnlyとかは無視している。サーバーが信用できなくなる場合注意
                        var m = Regex.Match(header, SESSION_ID + "=(.+?);");
                        if (m.Success)
                        {
                            this.sessionId = m.Groups[1].Value;
                        }
                    }

                    return www.text;
                });
        }

        /// <summary>
        /// ヘッダーの初期値を生成する。
        /// </summary>
        /// <returns>ヘッダー。</returns>
        private Dictionary<string, string> MakeDefaultHeaders()
        {
            var headers = new Dictionary<string, string>();
            if (this.sessionId != null)
            {
                // ※ Cookieは上書きされてしまう？が、APIサーバーでは他に使っていないはずなので許容する
                headers["Cookie"] = SESSION_ID + "=" + this.sessionId;
            }

            return headers;
        }

        #endregion
    }
}