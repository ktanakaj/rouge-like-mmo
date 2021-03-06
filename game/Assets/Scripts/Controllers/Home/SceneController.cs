﻿// ================================================================================================
// <summary>
//      ホーム画面コントローラソース</summary>
//
// <copyright file="SceneController.cs">
//      Copyright (C) 2018 Koichi Tanaka. All rights reserved.</copyright>
// <author>
//      Koichi Tanaka</author>
// ================================================================================================

namespace Honememo.RougeLikeMmo.Controllers.Home
{
    using UnityEngine;
    using Zenject;
    using Honememo.RougeLikeMmo.UseCases;

    /// <summary>
    /// ホーム画面コントローラクラス。
    /// </summary>
    public class SceneController : MonoBehaviour
    {
        #region 内部変数

        /// <summary>
        /// ホーム情報読み込みユースケース。
        /// </summary>
        [Inject]
        private LoadHomeUseCase useCase = null;

        #endregion

        #region イベントメソッド

        /// <summary>
        /// ホーム画面の諸情報を読み込む。
        /// </summary>
        public async void Start()
        {
            await this.useCase.Load();
        }

        #endregion
    }
}