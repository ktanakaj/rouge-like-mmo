// ================================================================================================
// <summary>
//      ゲーム画面Chatコントローラソース</summary>
//
// <copyright file="ChatController.cs">
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
    /// ゲーム画面Chatコントローラクラス。
    /// </summary>
    public class ChatController : MonoBehaviour
    {
        #region 内部変数

        /// <summary>
        /// Chat送信ユースケース。
        /// </summary>
        [Inject]
        private SendChatUseCase useCase;

        #endregion

        #region イベントメソッド

        // TODO: Chatを送信する
        // TODO: 入力欄の制御もここでやる？

        #endregion
    }
}