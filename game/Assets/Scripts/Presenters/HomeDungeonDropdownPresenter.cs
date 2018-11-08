// ================================================================================================
// <summary>
//      ホーム画面ダンジョンドロップダウンプレゼンターソース</summary>
//
// <copyright file="HomeDungeonDropdownPresenter.cs">
//      Copyright (C) 2018 Koichi Tanaka. All rights reserved.</copyright>
// <author>
//      Koichi Tanaka</author>
// ================================================================================================

namespace Honememo.RougeLikeMmo.Presenters
{
    using UnityEngine;
    using UnityEngine.UI;
    using Zenject;
    using Honememo.RougeLikeMmo.Entities;

    /// <summary>
    /// ホーム画面ダンジョンドロップダウンプレゼンタークラス。
    /// </summary>
    public class HomeDungeonDropdownPresenter : MonoBehaviour
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
        /// 画面表示時。
        /// </summary>
        public void Start()
        {
            // マスタをリストとして表示する
            var dropdown = this.GetComponent<Dropdown>();
            dropdown.options.Clear();
            foreach (var kv in this.global.DungeonEntities)
            {
                // TODO: IDを持たせたい。textにはIDを入れて、imageに名前を入れる？
                dropdown.options.Add(new Dropdown.OptionData(kv.Value.Name));
            }

            // 先頭データを選択中にする
            // TODO: 前回選択したものを選択中にする
            if (dropdown.options.Count > 0)
            {
                dropdown.value = 1;
            }
        }

        #endregion
    }
}