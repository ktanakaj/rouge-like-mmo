// ================================================================================================
// <summary>
//      ホーム画面コントローラソース</summary>
//
// <copyright file="HomeSceneController.cs">
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
    /// ホーム画面コントローラクラス。
    /// </summary>
    public class HomeSceneController : MonoBehaviour
    {
        #region 内部変数

        /// <summary>
        /// ホーム情報読み込みユースケース。
        /// </summary>
        [Inject]
        private LoadHomeUseCase loadHomeUseCase;

        /// <summary>
        /// ゲーム開始ユースケース。
        /// </summary>
        [Inject]
        private StartGameUseCase startGameUseCase;

        #endregion

        #region イベントメソッド

        /// <summary>
        /// 画面表示時。
        /// </summary>
        public async void Start()
        {
            //await this.loadHomeUseCase.Load();
        }

        /// <summary>
        /// ゲーム開始実行ボタン。
        /// </summary>
        public async void Initialize()
        {
            var button = this.GetComponent<Button>();
            button.interactable = false;
            // TODO: Loding... も出す、ドロップダウンも触れなくする
            try
            {
                // FIXME: ダミーデータなので直す
                await this.startGameUseCase.Start(1, 1);
                SceneManager.LoadScene("Game");
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