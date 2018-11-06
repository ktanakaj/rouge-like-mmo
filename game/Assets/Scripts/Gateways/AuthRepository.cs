// ================================================================================================
// <summary>
//      認証APIリポジトリソース</summary>
//
// <copyright file="AuthRepository.cs">
//      Copyright (C) 2018 Koichi Tanaka. All rights reserved.</copyright>
// <author>
//      Koichi Tanaka</author>
// ================================================================================================

namespace Honememo.RougeLikeMmo.Gateways
{
    using System;
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
        /// APIクライアント。
        /// </summary>
        [Inject]
        private AppWebRequest request;

        #endregion

        #region API呼び出しメソッド

        /// <summary>
        /// 端末トークンを認証する。
        /// </summary>
        /// <param name="token">端末トークン。</param>
        /// <returns>処理状態。</returns>
        /// <remarks>エラーにならなければOK。通信できれば基本的に必ず成功。</remarks>
        public async Task Auth(string token)
        {
            await this.request.Post("api/auth", JsonUtility.ToJson(new AuthParam { token = token }));
        }

        #endregion

        #region 内部クラス

        /// <summary>
        /// /api/auth API引数パラメータ。
        /// </summary>
        [Serializable]
        public class AuthParam
        {
            public string token;
        }

        #endregion
    }
}