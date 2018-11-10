// ================================================================================================
// <summary>
//      タイトル画面スタートボタンコントローラソース</summary>
//
// <copyright file="StartButtonController.cs">
//      Copyright (C) 2018 Koichi Tanaka. All rights reserved.</copyright>
// <author>
//      Koichi Tanaka</author>
// ================================================================================================

namespace Honememo.RougeLikeMmo.Controllers.Title
{
    using System;
    using UnityEngine;
    using UnityEngine.SceneManagement;
    using UnityEngine.UI;
    using Zenject;
    using Honememo.RougeLikeMmo.UseCases;

    /// <summary>
    /// タイトル画面スタートボタンコントローラクラス。
    /// </summary>
    public class StartButtonController : MonoBehaviour
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
        /// 初期化を行い、次のホーム画面に遷移する。
        /// </summary>
        public async void Initialize()
        {
            // TODO: ボタンの制御を共通化して、Resetも含めて押せなくする
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