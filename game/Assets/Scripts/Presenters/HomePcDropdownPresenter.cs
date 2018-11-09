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
    using UnityEngine;
    using UnityEngine.UI;
    using UniRx;
    using Zenject;
    using Honememo.RougeLikeMmo.Entities;
    using Honememo.RougeLikeMmo.UseCases;

    /// <summary>
    /// ホーム画面PCドロップダウンプレゼンタークラス。
    /// </summary>
    public class HomePcDropdownPresenter : MonoBehaviour
    {
        #region 内部変数

        /// <summary>
        /// グローバルデータ。
        /// </summary>
        [Inject]
        private Global global;

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
            var dropdown = this.GetComponent<Dropdown>();
            dropdown.options.Clear();
            this.loadHomeUseCase.Subscribe(_ => {
                // ドロップボックスを再読み込みする
                foreach (var pc in this.global.PlayerCharacterEntities.Values)
                {
                    // TODO: 設定値のフォーマットは仮、将来的にはそもそもDropbox止める
                    dropdown.options.Add(new Dropdown.OptionData("#" + pc.Id + " " + pc.Name));
                }

                // 先頭データを選択中にする
                // TODO: 前回選択したものを選択中にする
                dropdown.RefreshShownValue();
            });
            this.createPcUseCase.Subscribe((pc) => {
                // 追加されたPCを登録、選択中にする
                dropdown.options.Add(new Dropdown.OptionData("#" + pc.Id + " " + pc.Name));
                dropdown.value = dropdown.options.Count - 1;
                dropdown.RefreshShownValue();
            });
        }

        #endregion
    }
}