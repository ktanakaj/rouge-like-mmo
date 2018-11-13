// ================================================================================================
// <summary>
//      ゲーム画面フロアプレゼンターソース</summary>
//
// <copyright file="FloorPresenter.cs">
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
    /// ゲーム画面フロアプレゼンタークラス。
    /// </summary>
    public class FloorPresenter : MonoBehaviour
    {
        #region 内部変数

        /// <summary>
        /// グローバルデータ。
        /// </summary>
        [Inject]
        private Global global;

        /// <summary>
        /// ゲーム情報読み込みユースケース。
        /// </summary>
        [Inject]
        private ConnectGameUseCase useCase;

        #endregion

        #region イベントメソッド

        /// <summary>
        /// フロアの生成。
        /// </summary>
        public void Start()
        {
            // TODO: 未実装
            this.useCase.Subscribe(_ => {
            });
        }

        #endregion
   }
}