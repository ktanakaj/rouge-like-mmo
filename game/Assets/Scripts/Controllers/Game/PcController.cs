// ================================================================================================
// <summary>
//      ゲーム画面PCコントローラソース</summary>
//
// <copyright file="PcController.cs">
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
    /// ゲーム画面PCコントローラクラス。
    /// </summary>
    public class PcController : MonoBehaviour
    {
        #region 内部変数

        /// <summary>
        /// プレイヤー操作ユースケース。
        /// </summary>
        [Inject]
        private SendActionUseCase sendActionUseCase;

        #endregion

        #region イベントメソッド

        // TODO: プレイヤーの操作を実行する

        #endregion
    }
}