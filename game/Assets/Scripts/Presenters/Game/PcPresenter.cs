// ================================================================================================
// <summary>
//      ゲーム画面PCプレゼンターソース</summary>
//
// <copyright file="PcPresenter.cs">
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
    /// ゲーム画面PCプレゼンタークラス。
    /// </summary>
    public class PcPresenter : MonoBehaviour
    {
        #region 内部変数

        /// <summary>
        /// グローバルデータ。
        /// </summary>
        [Inject]
        private Global global;


        #endregion

        #region イベントメソッド

        /// <summary>
        /// PCイベントの登録。
        /// </summary>
        public void Start()
        {
            // TODO: 未実装、PCの行動を表示に反映させる。Unitと共通でもいいかも
        }

        #endregion
    }
}