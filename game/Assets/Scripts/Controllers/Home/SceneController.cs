// ================================================================================================
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
        private LoadHomeUseCase useCase;

        #endregion

        #region イベントメソッド

        /// <summary>
        /// 画面表示時。
        /// </summary>
        public async void Start()
        {
            await this.useCase.Load();
        }

        #endregion
    }
}