// ================================================================================================
// <summary>
//      タイトル画面リセットボタンコントローラソース</summary>
//
// <copyright file="ResetButtonController.cs">
//      Copyright (C) 2018 Koichi Tanaka. All rights reserved.</copyright>
// <author>
//      Koichi Tanaka</author>
// ================================================================================================

namespace Honememo.RougeLikeMmo.Controllers.Title
{
    using UnityEngine;
    using Zenject;
    using Honememo.RougeLikeMmo.UseCases;

    /// <summary>
    /// タイトル画面リセットボタンコントローラクラス。
    /// </summary>
    public class ResetButtonController : MonoBehaviour
    {
        #region 内部変数

        /// <summary>
        /// 端末リセットユースケース。
        /// </summary>
        [Inject]
        private ResetPlayerUseCase useCase = null;

        #endregion

        #region イベントメソッド

        /// <summary>
        /// 端末情報をリセットする。
        /// </summary>
        public void Reset()
        {
            // ※ 基本的にデバッグ用の処理なので消すだけ
            this.useCase.Reset();
        }

        #endregion
    }
}