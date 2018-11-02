// ================================================================================================
// <summary>
//      ローグ風MMO 認証APIリポジトリソース</summary>
//
// <copyright file="AuthRepository.cs">
//      Copyright (C) 2018 Koichi Tanaka. All rights reserved.</copyright>
// <author>
//      Koichi Tanaka</author>
// ================================================================================================

namespace Honememo.RougeLikeMmo.Gateways
{
    using System;
    using System.Collections;
    using System.Collections.Generic;
    using System.Threading.Tasks;
    using UniRx;
    using UnityEngine;
    using Zenject;

    /// <summary>
    /// 認証APIリポジトリクラス。
    /// </summary>
    public class AuthRepository
    {
        #region 内部変数

        /// <summary>
        /// 初期化ユースケース。
        /// </summary>
        [Inject]
        private ObservableSerialRunner taskRunner;

        #endregion

        #region API呼び出しメソッド

        public async Task Auth(string token)
        {
            var headers = new Dictionary<string, string>();
            headers["Content-Type"] = "application/json";
            var param = new AuthParam { token = token };
            await this.taskRunner.Enqueue<object>(ObservableWWW.Post(
                "http://172.28.128.3/api/auth",
                System.Text.Encoding.UTF8.GetBytes(JsonUtility.ToJson(param)),
                headers));
        }

        #endregion

        #region 内部クラス

        /// <summary>
        /// /api/auth API引数パラメータ。
        /// </summary>
        [Serializable]
        private class AuthParam
        {
            public string token;
        }

        #endregion
    }
}