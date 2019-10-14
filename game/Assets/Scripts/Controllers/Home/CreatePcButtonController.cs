// ================================================================================================
// <summary>
//      ホーム画面PC作成ボタンコントローラソース</summary>
//
// <copyright file="CreatePcButtonController.cs">
//      Copyright (C) 2018 Koichi Tanaka. All rights reserved.</copyright>
// <author>
//      Koichi Tanaka</author>
// ================================================================================================

namespace Honememo.RougeLikeMmo.Controllers.Home
{
    using UnityEngine;
    using UnityEngine.UI;
    using Zenject;
    using Honememo.RougeLikeMmo.UseCases;

    /// <summary>
    /// ホーム画面PC作成ボタンコントローラクラス。
    /// </summary>
    public class CreatePcButtonController : MonoBehaviour
    {
        #region 内部変数

        /// <summary>
        /// PC作成ユースケース。
        /// </summary>
        [Inject]
        private CreatePcUseCase useCase = null;

        #endregion

        #region イベントメソッド

        /// <summary>
        /// PCを作成する。
        /// </summary>
        public async void Create()
        {
            var button = this.GetComponent<Button>();
            button.interactable = false;
            try
            {
                // FIXME: テキストボックスを用意して名前を入力させる
                await this.useCase.Create("Taro");
            }
            finally
            {
                button.interactable = true;
            }
        }

        #endregion
    }
}