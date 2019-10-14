// ================================================================================================
// <summary>
//      ゲーム画面PC情報プレゼンターソース</summary>
//
// <copyright file="PcStatusTextPresenter.cs">
//      Copyright (C) 2018 Koichi Tanaka. All rights reserved.</copyright>
// <author>
//      Koichi Tanaka</author>
// ================================================================================================

namespace Honememo.RougeLikeMmo.Presenters.Game
{
    using UnityEngine;
    using UnityEngine.UI;
    using Zenject;
    using Honememo.RougeLikeMmo.Entities;

    /// <summary>
    /// ゲーム画面PC情報プレゼンタークラス。
    /// </summary>
    public class PcStatusTextPresenter : MonoBehaviour
    {
        #region 内部変数

        /// <summary>
        /// グローバルデータ。
        /// </summary>
        [Inject]
        private Global global = null;

        #endregion

        #region イベントメソッド

        /// <summary>
        /// ラベルの初期化。
        /// </summary>
        public void Start()
        {
            // TODO: ダメージを受けたらHPが更新されるようにする
            var text = this.GetComponent<Text>();
            var pc = this.global.GameEntity.PlayerCharacter;
            text.text = "Name=" + pc.Name + ", HP=" + pc.Hp;
        }

        #endregion
    }
}