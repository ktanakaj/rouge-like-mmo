// ================================================================================================
// <summary>
//      タイトル画面コントローラソース</summary>
//
// <copyright file="TitleSceneController.cs">
//      Copyright (C) 2018 Koichi Tanaka. All rights reserved.</copyright>
// <author>
//      Koichi Tanaka</author>
// ================================================================================================

namespace Honememo.RougeLikeMmo.Controllers
{
    using System;
    using UnityEngine;
    using UnityEngine.SceneManagement;
    using UnityEngine.UI;
    using Zenject;
    using Honememo.RougeLikeMmo.UseCases;

    /// <summary>
    /// タイトル画面コントローラクラス。
    /// </summary>
    public class TitleSceneController : MonoBehaviour
    {
        #region 内部変数

        /// <summary>
        /// 初期化ユースケース。
        /// </summary>
        [Inject]
        private InitializeUseCase useCase;

        #endregion

        #region イベントメソッド

        /// <summary>
        /// アプリ初期化実行ボタン。
        /// </summary>
        public async void Initialize()
        {
            var button = this.GetComponent<Button>();
            button.interactable = false;
            // TODO: Loding... も出す
            try
            {
                await this.useCase.Initialize();
                SceneManager.LoadScene("Home");
            }
            catch (Exception ex)
            {
                button.interactable = true;
                throw ex;
            }
        }

        #endregion
    }
}