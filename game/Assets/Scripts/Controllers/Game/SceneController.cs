// ================================================================================================
// <summary>
//      ゲーム画面コントローラソース</summary>
//
// <copyright file="SceneController.cs">
//      Copyright (C) 2018 Koichi Tanaka. All rights reserved.</copyright>
// <author>
//      Koichi Tanaka</author>
// ================================================================================================

namespace Honememo.RougeLikeMmo.Controllers.Game
{
    using UnityEngine;
    using Zenject;
    using Honememo.RougeLikeMmo.UseCases;

    /// <summary>
    /// ゲーム画面コントローラクラス。
    /// </summary>
    public class SceneController : MonoBehaviour
    {
        #region 内部変数

        /// <summary>
        /// ゲーム情報読み込みユースケース。
        /// </summary>
        [Inject]
        private LoadGameUseCase useCase;

        #endregion

        #region イベントメソッド

        /// <summary>
        /// ゲーム画面の諸情報を読み込む。
        /// </summary>
        public async void Start()
        {
            await this.useCase.Load();
        }

        #endregion
    }
}