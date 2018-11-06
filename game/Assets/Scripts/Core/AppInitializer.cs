// ================================================================================================
// <summary>
//      アプリ初期設定ソース</summary>
//
// <copyright file="AppInitializer.cs">
//      Copyright (C) 2018 Koichi Tanaka. All rights reserved.</copyright>
// <author>
//      Koichi Tanaka</author>
// ================================================================================================

namespace Honememo.RougeLikeMmo.Core
{
    using UnityEngine;
    using Zenject;
    using Honememo.RougeLikeMmo.Gateways;

    /// <summary>
    /// アプリ初期設定クラス。
    /// </summary>
    /// <remarks>
    /// 様々な設定値をインスペクターから変更するためのクラス。
    /// </remarks>
    public class AppInitializer : MonoBehaviour
    {
        #region 設定値

        /// <summary>
        /// APIサーバーのルート。
        /// </summary>
        public string ApiBase = "/";

        #endregion

        #region 設定対象

        /// <summary>
        /// 認証リポジトリ。
        /// </summary>
        [Inject]
        private AppWebRequest webRequest;

        #endregion

        #region イベントメソッド

        /// <summary>
        /// 初期化処理。
        /// </summary>
        public void Start()
        {
            // インスペクターで設定された値をシングルトンの各インスタンスにコピーする
            this.webRequest.ApiBase = this.ApiBase;
        }

        #endregion
    }
}