// ================================================================================================
// <summary>
//      ホーム画面プレイヤー情報プレゼンターソース</summary>
//
// <copyright file="PlayerTextPresenter.cs">
//      Copyright (C) 2018 Koichi Tanaka. All rights reserved.</copyright>
// <author>
//      Koichi Tanaka</author>
// ================================================================================================

namespace Honememo.RougeLikeMmo.Presenters.Home
{
    using UnityEngine;
    using UnityEngine.UI;
    using Zenject;
    using Honememo.RougeLikeMmo.Entities;

    /// <summary>
    /// ホーム画面プレイヤー情報プレゼンタークラス。
    /// </summary>
    public class PlayerTextPresenter : MonoBehaviour
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
        /// ラベルの初期化。
        /// </summary>
        public void Start()
        {
            var text = this.GetComponent<Text>();
            var player = this.global.PlayerEntity;
            text.text = "PlayerId=" + player.Id + ", Level=" + player.Level + ", Coins=" + player.GameCoins;
        }

        #endregion
    }
}