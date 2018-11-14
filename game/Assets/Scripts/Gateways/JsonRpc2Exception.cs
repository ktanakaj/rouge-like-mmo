// ================================================================================================
// <summary>
//      JSON-RPC2エラー例外ソース</summary>
//
// <copyright file="JsonRpc2Exception.cs">
//      Copyright (C) 2018 Koichi Tanaka. All rights reserved.</copyright>
// <author>
//      Koichi Tanaka</author>
// ================================================================================================

namespace Honememo.RougeLikeMmo.Gateways
{
    using System;
    using System.Collections.Generic;

    /// <summary>
    /// JSON-RPC2エラー例外クラス。
    /// </summary>
    public class JsonRpc2Exception : Exception
    {
        #region Enum定義

        /// <summary>
        /// JSON-RPC2規定のエラーコード。
        /// </summary>
        public enum ErrorCode
        {
            ParseError = -32700,
            InvalidRequest = -32600,
            MethodNotFound = -32601,
            InvalidParams = -32602,
            InternalError = -32603,
        }

        #endregion

        #region 定数

        /// <summary>
        /// サーバーエラーのコード範囲開始。
        /// </summary>
        public const int SERVER_ERROR_SINCE = -32000;

        /// <summary>
        /// サーバーエラーのコード範囲終了。
        /// </summary>
        public const int SERVER_ERROR_UNTIL = -32099;

        #endregion

        #region 内部変数

        /// <summary>
        /// 追加データ。
        /// </summary>
        private System.Collections.IDictionary data;

        #endregion

        #region プロパティ

        /// <summary>
        /// エラーコード。
        /// </summary>
        public int Code { get; }

        /// <summary>
        /// 追加データ。
        /// </summary>
        public override System.Collections.IDictionary Data
        {
            get { return this.data; }
        }

        #endregion

        #region コンストラクタ

        /// <summary>
        /// JSON-RPC2エラーを生成する。
        /// </summary>
        /// <param name="code">エラーコード。</param>
        /// <param name="message">エラーメッセージ。</param>
        /// <param name="data">追加データ。</param>
        public JsonRpc2Exception(int code, string message, System.Collections.IDictionary data)
            : base(message != null ? message : MakeDefaultErrorMessage(code))
        {
            this.Code = code;
            this.data = (System.Collections.IDictionary)data;
        }

        /// <summary>
        /// JSON-RPC2エラーを生成する。
        /// </summary>
        /// <param name="code">エラーコード。</param>
        /// <param name="message">エラーメッセージ。</param>
        /// <param name="data">追加データ。</param>
        public JsonRpc2Exception(int code, string message = null, IDictionary<string, object> data = null)
            : this(code, message, (System.Collections.IDictionary)data)
        {
        }

        /// <summary>
        /// JSON-RPC2エラーを生成する。
        /// </summary>
        /// <param name="code">エラーコード。</param>
        public JsonRpc2Exception(ErrorCode code) : this((int)code)
        {
        }

        /// <summary>
        /// JSON-RPC2エラーを生成する。
        /// </summary>
        public JsonRpc2Exception() : this(ErrorCode.InternalError)
        {
        }

        #endregion

        #region メソッド

        /// <summary>
        /// 任意の例外を<see cref="JsonRpc2Exception"/>に変換する。
        /// </summary>
        /// <param name="ex">変換する例外。</param>
        /// <returns>変換された例外。</returns>
        public static JsonRpc2Exception Convert(Exception ex)
        {
            var newEx = ex as JsonRpc2Exception;
            if (newEx != null)
            {
                return newEx;
            }

            return new JsonRpc2Exception((int)ErrorCode.InternalError, ex.Message, ex.Data);
        }

        /// <summary>
        /// MiniJSONのobjectを<see cref="JsonRpc2Exception"/>に変換する。
        /// </summary>
        /// <param name="ex">変換する例外。</param>
        /// <returns>変換された例外。</returns>
        public static JsonRpc2Exception Convert(object err)
        {
            var json = err as IDictionary<string, object>;
            var code = 0;
            var message = "";
            object data = null;
            if (json != null)
            {
                object codeObj;
                if (json.TryGetValue("code", out codeObj) && codeObj is long)
                {
                    code = (int)(long)codeObj;
                }

                object messageObj;
                if (!json.TryGetValue("message", out messageObj) && messageObj != null)
                {
                    message = messageObj.ToString();
                }

                json.TryGetValue("data", out data);
            }

            return new JsonRpc2Exception(code, message, data as IDictionary<string, object>);
        }

        /// <summary>
        /// MiniJSONシリアライズ用のDictionaryを生成する。
        /// </summary>
        /// <returns>エラー情報のDictionary。</returns>
        public IDictionary<string, object> ToDictionary()
        {
            var json = new Dictionary<string, object>()
            {
                { "code", this.Code },
                { "message", this.Message },
            };

            if (this.Data != null)
            {
                json["data"] = this.Data;
            }

            return json;
        }

        /// <summary>
        /// デフォルトのエラーメッセージを生成する。
        /// </summary>
        /// <param name="code">エラーコード。</param>
        /// <returns>エラーメッセージ。</returns>
        private static string MakeDefaultErrorMessage(int code)
        {
            switch (code)
            {
                case (int)ErrorCode.ParseError:
                    return "Parse error";
                case (int)ErrorCode.InvalidRequest:
                    return "Invalid Request";
                case (int)ErrorCode.MethodNotFound:
                    return "Method not found";
                case (int)ErrorCode.InvalidParams:
                    return "Invalid params";
                case (int)ErrorCode.InternalError:
                    return "Internal error";
            }

            if (code >= SERVER_ERROR_SINCE && code <= SERVER_ERROR_UNTIL)
            {
                return "Server error";
            }

            return "Unknown Error";
        }

        #endregion
    }
}