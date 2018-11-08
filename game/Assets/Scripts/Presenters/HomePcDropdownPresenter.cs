// ================================================================================================
// <summary>
//      ホーム画面PCドロップダウンプレゼンターソース</summary>
//
// <copyright file="HomePcDropdownPresenter.cs">
//      Copyright (C) 2018 Koichi Tanaka. All rights reserved.</copyright>
// <author>
//      Koichi Tanaka</author>
// ================================================================================================

namespace Honememo.RougeLikeMmo.Presenters
{
    using System;
    using UnityEngine;
    using UnityEngine.UI;
    using Zenject;
    using Honememo.RougeLikeMmo.UseCases;

    /// <summary>
    /// ホーム画面PCドロップダウンプレゼンタークラス。
    /// </summary>
    public class HomePcDropdownPresenter : MonoBehaviour
    {
        #region 内部変数

        /// <summary>
        /// ホーム情報読み込みユースケース。
        /// </summary>
        [Inject]
        private LoadHomeUseCase loadHomeUseCase;

        /// <summary>
        /// PC作成ユースケース。
        /// </summary>
        [Inject]
        private CreatePcUseCase createPcUseCase;

        #endregion

        #region イベントメソッド

        /// <summary>
        /// 画面表示時。
        /// </summary>
        public void Start()
        {
            // TODO: subscribeする
            //this.loadHomeUseCase.;
        }

        #endregion
    }
}