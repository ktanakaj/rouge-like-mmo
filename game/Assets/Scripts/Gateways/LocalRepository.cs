// ================================================================================================
// <summary>
//      ローカルへのデータ保存用リポジトリソース</summary>
//
// <copyright file="LocalRepository.cs">
//      Copyright (C) 2018 Koichi Tanaka. All rights reserved.</copyright>
// <author>
//      Koichi Tanaka</author>
// ================================================================================================

namespace Honememo.RougeLikeMmo.Gateways
{
    using UnityEngine;
    using Honememo.RougeLikeMmo.Entities;

    /// <summary>
    /// ローカルへのデータ保存用リポジトリクラス。
    /// </summary>
    public class LocalRepository
    {
        #region 公開メソッド

        /// <summary>
        /// 認証情報を保存する。
        /// </summary>
        /// <param name="auth">認証情報。</param>
        public void SaveAuth(AuthEntity auth)
        {
            PlayerPrefs.SetInt("PlayerId", auth.Id);
            PlayerPrefs.SetString("PlayerToken", auth.Token);
            PlayerPrefs.Save();
        }

        /// <summary>
        /// 認証情報を読み込む。
        /// </summary>
        /// <returns>保存されている認証情報。存在しない場合null。</returns>
        public AuthEntity LoadAuth()
        {
            if (!PlayerPrefs.HasKey("PlayerId") || !PlayerPrefs.HasKey("PlayerToken"))
            {
                return null;
            }

            return new AuthEntity()
            {
                Id = PlayerPrefs.GetInt("PlayerId"),
                Token = PlayerPrefs.GetString("PlayerToken")
            };
        }

        /// <summary>
        /// 全ローカルデータを削除する。
        /// </summary>
        public void Reset()
        {
            PlayerPrefs.DeleteAll();
        }

        #endregion
    }
}