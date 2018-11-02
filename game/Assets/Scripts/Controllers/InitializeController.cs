// ================================================================================================
// <summary>
//      ローグ風MMO初期化コントローラソース</summary>
//
// <copyright file="InitializeController.cs">
//      Copyright (C) 2018 Koichi Tanaka. All rights reserved.</copyright>
// <author>
//      Koichi Tanaka</author>
// ================================================================================================

namespace Honememo.RougeLikeMmo.Controllers
{
    using UnityEngine;
    using UnityEngine.SceneManagement;
    using Zenject;
    using Honememo.RougeLikeMmo.UseCases;

    /// <summary>
    /// ローグ風MMO初期化コントローラクラス。
    /// </summary>
    public class InitializeController : MonoBehaviour
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
        /// アプリ初期化実行。
        /// </summary>
        public void Initialize()
        {
            this.useCase.Initialize();
            // TODO: 結果を非同期で受け取り、完了次第画面遷移を有効にする
            // TODO: なのでボタンを押せなくして読み込み中表示を出す
            // SceneManager.LoadScene("Game");
        }

        #endregion
    }
}