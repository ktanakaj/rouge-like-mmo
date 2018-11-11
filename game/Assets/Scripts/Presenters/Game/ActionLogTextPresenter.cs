// ================================================================================================
// <summary>
//      ゲーム画面行動ログプレゼンターソース</summary>
//
// <copyright file="ActionLogTextPresenter.cs">
//      Copyright (C) 2018 Koichi Tanaka. All rights reserved.</copyright>
// <author>
//      Koichi Tanaka</author>
// ================================================================================================

namespace Honememo.RougeLikeMmo.Presenters.Game
{
    using UnityEngine;
    using UnityEngine.UI;
    using UniRx;
    using Zenject;
    using Honememo.RougeLikeMmo.Entities;
    using Honememo.RougeLikeMmo.UseCases;

    /// <summary>
    /// ゲーム画面行動ログプレゼンタークラス。
    /// </summary>
    public class ActionLogTextPresenter : MonoBehaviour
    {
        #region 内部変数

        /// <summary>
        /// グローバルデータ。
        /// </summary>
        [Inject]
        private Global global;

        /// <summary>
        /// ユニット行動受信ユースケース。
        /// </summary>
        [Inject]
        private ReceiveActionUseCase receiveActionUseCase;

        /// <summary>
        /// Chat受信ユースケース。
        /// </summary>
        [Inject]
        private ReceiveChatUseCase receiveChatUseCase;

        #endregion

        #region イベントメソッド

        /// <summary>
        /// ログイベントの登録。
        /// </summary>
        public void Start()
        {
            // TODO: 未実装、「xxに100のダメージ」とか「Taro: こんにちは」みたいなログを出すイメージ
            // this.receiveActionUseCase.Subscribe(() => { });
        }

        #endregion
    }
}