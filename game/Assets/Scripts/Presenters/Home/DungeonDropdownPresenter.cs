// ================================================================================================
// <summary>
//      ホーム画面ダンジョンドロップダウンプレゼンターソース</summary>
//
// <copyright file="DungeonDropdownPresenter.cs">
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
    /// ホーム画面ダンジョンドロップダウンプレゼンタークラス。
    /// </summary>
    public class DungeonDropdownPresenter : MonoBehaviour
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
        /// ドロップダウンの初期化。
        /// </summary>
        public void Start()
        {
            // マスタをリストとして表示する
            var dropdown = this.GetComponent<Dropdown>();
            dropdown.options.Clear();
            foreach (var dungeon in this.global.DungeonEntities.Values)
            {
                // TODO: 設定値のフォーマットは仮、将来的にはそもそもDropbox止める
                dropdown.options.Add(new Dropdown.OptionData("#" + dungeon.Id + " " + dungeon.Name));
            }

            // 先頭データを選択中にする
            // TODO: 前回選択したものを選択中にする
            dropdown.RefreshShownValue();
        }

        #endregion
    }
}