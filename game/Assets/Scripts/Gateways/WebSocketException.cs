// ================================================================================================
// <summary>
//      WebSocket例外ソース</summary>
//
// <copyright file="WebSocketException.cs">
//      Copyright (C) 2018 Koichi Tanaka. All rights reserved.</copyright>
// <author>
//      Koichi Tanaka</author>
// ================================================================================================

namespace Honememo.RougeLikeMmo.Gateways
{
    using System;

    /// <summary>
    /// WebSocket例外クラス。
    /// </summary>
    public class WebSocketException : Exception
    {
        #region コンストラクタ

        /// <summary>
        /// WebSocket例外を生成する。
        /// </summary>
        /// <param name="message">エラーメッセージ。</param>
        public WebSocketException(string message) : base(message)
        {
        }

        #endregion
    }
}