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
    using System.Net;
    using UniRx;
    using UnityEngine;
    using Zenject;

    /// <summary>
    /// WebSocket/JSON-RPC2 APIリクエスト用クライアントクラス。
    /// </summary>
    public class AppWsRequest
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

        #endregion
    }
}