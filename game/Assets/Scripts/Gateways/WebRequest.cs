// ================================================================================================
// <summary>
//      HTTPリクエスト用クライアントソース</summary>
//
// <copyright file="WebRequest.cs">
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
    using MiniJSON;
    using UniRx;
    using UnityEngine;

    /// <summary>
    /// HTTPリクエスト用クライアントクラス。
    /// </summary>
    public class WebRequest
    {
        #region 内部変数

        /// <summary>
        /// セッションID。
        /// </summary>
        /// <remarks>簡易的な管理。シーンを跨ぐと消えてしまうので保持。</remarks>
        private string sessionId;

        #endregion

        #region プロパティ

        /// <summary>
        /// セッションIDキー名。
        /// </summary>
        public string SessionKey { get; set; } = null;

        #endregion

        #region 公開メソッド

        /// <summary>
        /// GETリクエストを送信する。
        /// </summary>
        /// <param name="url">URL。</param>
        /// <returns>レスポンス文字列。</returns>
        public virtual IObservable<string> Get(string url)
        {
            return this.LogFilter(
                this.ResponseFilter(
                    ObservableWWW.GetWWW(url, this.MakeDefaultHeaders())),
                "GET",
                url);
        }

        /// <summary>
        /// GETリクエストを送信し、結果をJSONデコードして受け取る。
        /// </summary>
        /// <typeparam name="T">戻り値の型（MiniJSONで変換可能な型のみ）。</typeparam>
        /// <param name="url">URL。</param>
        /// <returns>レスポンスJSON。</returns>
        public virtual IObservable<T> Get<T>(string url)
        {
            return this.Get(url).Select((s) => (T)Json.Deserialize(s));
        }

        /// <summary>
        /// JSONボディでPOSTリクエストを送信する。
        /// </summary>
        /// <param name="url">URL。</param>
        /// <param name="json">送信するJSON文字列。</param>
        /// <returns>レスポンス文字列。</returns>
        public virtual IObservable<string> Post(string url, string json = "")
        {
            var headers = this.MakeDefaultHeaders();
            headers["Content-Type"] = "application/json";
            return this.LogFilter(
                this.ResponseFilter(
                    ObservableWWW.PostWWW(url, System.Text.Encoding.UTF8.GetBytes(json), headers)),
                "POST",
                url,
                json);
        }

        /// <summary>
        /// JSONボディでPOSTリクエストを送信する。
        /// </summary>
        /// <param name="url">URL。</param>
        /// <param name="json">送信するJSONオブジェクト。</param>
        /// <returns>レスポンス文字列。</returns>
        public virtual IObservable<string> Post(string url, IDictionary<string, object> json)
        {
            return this.Post(url, json != null ? Json.Serialize(json) : "");
        }

        /// <summary>
        /// JSONボディでPOSTリクエストを送信し、結果をJSONデコードして受け取る。
        /// </summary>
        /// <typeparam name="T">戻り値の型（MiniJSONで変換可能な型のみ）。</typeparam>
        /// <param name="url">URL。</param>
        /// <param name="json">送信するJSONオブジェクト。</param>
        /// <returns>レスポンスJSON。</returns>
        public virtual IObservable<T> Post<T>(string url, IDictionary<string, object> json = null)
        {
            return this.Post(url, json).Select((s) => (T)Json.Deserialize(s));
        }

        #endregion

        #region 内部メソッド

        /// <summary>
        /// ヘッダーの初期値を生成する。
        /// </summary>
        /// <returns>ヘッダー。</returns>
        protected virtual Dictionary<string, string> MakeDefaultHeaders()
        {
            var headers = new Dictionary<string, string>();
            if (this.sessionId != null)
            {
                // ※ Cookieは上書きされてしまう？が、一旦許容する
                headers["Cookie"] = this.SessionKey + "=" + this.sessionId;
            }

            return headers;
        }

        /// <summary>
        /// HTTPリクエストのログフィルターを追加する。
        /// </summary>
        /// <param name="observable">フィルター対象のHTTP呼び出し。</param>
        /// <param name="method">HTTPメソッド名。</param>
        /// <param name="url">URL。</param>
        /// <param name="body">ボディ文字列。</param>
        /// <returns>フィルターしたHTTP呼び出し。</returns>
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
        /// リクエストログを出力する。
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
        /// レスポンス処理用のフィルターを追加する。
        /// </summary>
        /// <param name="observable">フィルター対象のHTTP呼び出し。</param>
        /// <returns>フィルターしたHTTP呼び出し。</returns>
        private IObservable<string> ResponseFilter(IObservable<WWW> observable)
        {
            // WWWを貰って、レスポンスヘッダーなどを処理した上で、textを返す。
            // 現状では、レスポンスにCookieがある場合は、セッションIDを取り出して保存している。
            // （WWWのCookieはシーン切り替えで消滅するため。）
            // TODO: 本当はセッションID決め打ちじゃなくCookieを保持するようにしたい。
            //     （ちゃんと実装するのが大変なので暫定的にセッションだけ対応している。）
            if (string.IsNullOrEmpty(this.SessionKey))
            {
                return observable.Select((www) => www.text);
            }

            return observable
                .Select((www) =>
                {
                    string header;
                    if (www.responseHeaders.TryGetValue("Set-Cookie", out header))
                    {
                        // ※ PathとかHttpOnlyとかも無視している。サーバーが信用できなくなる場合注意
                        var m = Regex.Match(header, this.SessionKey + "=(.+?);");
                        if (m.Success)
                        {
                            this.sessionId = m.Groups[1].Value;
                        }
                    }

                    return www.text;
                });
        }

        #endregion
    }
}