// ================================================================================================
// <summary>
//      ゲーム画面ユニットプレゼンターソース</summary>
//
// <copyright file="UnitPresenter.cs">
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
    /// ゲーム画面ユニットプレゼンタークラス。
    /// </summary>
    public class UnitPresenter : MonoBehaviour
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
        private ReceiveActionUseCase useCase;

        #endregion

        #region イベントメソッド

        /// <summary>
        /// ユニットイベントの登録。
        /// </summary>
        public void Start()
        {
            // TODO: 未実装、ユニットの行動を表示に反映させる
        }

        #endregion
    }
}