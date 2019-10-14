// ================================================================================================
// <summary>
//      ホーム画面PCドロップダウンプレゼンターソース</summary>
//
// <copyright file="PcDropdownPresenter.cs">
//      Copyright (C) 2018 Koichi Tanaka. All rights reserved.</copyright>
// <author>
//      Koichi Tanaka</author>
// ================================================================================================

namespace Honememo.RougeLikeMmo.Presenters.Home
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
    public class PcDropdownPresenter : MonoBehaviour
    {
        #region 内部変数

        /// <summary>
        /// グローバルデータ。
        /// </summary>
        [Inject]
        private Global global = null;

        /// <summary>
        /// ホーム情報読み込みユースケース。
        /// </summary>
        [Inject]
        private LoadHomeUseCase loadHomeUseCase = null;

        /// <summary>
        /// PC作成ユースケース。
        /// </summary>
        [Inject]
        private CreatePcUseCase createPcUseCase = null;

        #endregion

        #region イベントメソッド

        /// <summary>
        /// ドロップダウンの初期化。
        /// </summary>
        public void Start()
        {
            var dropdown = this.GetComponent<Dropdown>();
            dropdown.options.Clear();

            // ドロップボックスを再読み込みする
            this.loadHomeUseCase.Subscribe(_ => {
                foreach (var pc in this.global.PlayerCharacterEntities.Values)
                {
                    this.AddOption(dropdown, pc);
                }
            });

            // 追加されたPCを登録、選択中にする
            this.createPcUseCase.Subscribe((pc) => {
                this.AddOption(dropdown, pc, true);
            });
        }

        #endregion

        #region 内部メソッド

        /// <summary>
        /// ドロップダウンにPCを追加する。
        /// </summary>
        /// <param name="dropdown">追加するドロップダウン。</param>
        /// <param name="pc">追加するPC。</param>
        /// <param name="select">追加したPCを選択中にする場合true。</param>
        private void AddOption(Dropdown dropdown, PlayerCharacterEntity pc, bool select = false)
        {
            // TODO: 設定値のフォーマットは仮、将来的にはそもそもDropbox止めるかも
            dropdown.options.Add(new Dropdown.OptionData("#" + pc.PcId + " " + pc.Name));
            if (select)
            {
                dropdown.value = dropdown.options.Count - 1;
            }

            dropdown.RefreshShownValue();

            // 変更した場合の他、1件目を追加したときも変わっているはずなのでイベントを呼ぶ
            if (select || dropdown.options.Count == 1)
            {
                dropdown.onValueChanged.Invoke(dropdown.value);
            }
        }

        #endregion
    }
}