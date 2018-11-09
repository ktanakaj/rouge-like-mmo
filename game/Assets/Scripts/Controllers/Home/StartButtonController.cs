// ================================================================================================
// <summary>
//      ホーム画面スタートボタンコントローラソース</summary>
//
// <copyright file="StartButtonController.cs">
//      Copyright (C) 2018 Koichi Tanaka. All rights reserved.</copyright>
// <author>
//      Koichi Tanaka</author>
// ================================================================================================

namespace Honememo.RougeLikeMmo.Controllers.Home
{
    using System;
    using System.Text.RegularExpressions;
    using UnityEngine;
    using UnityEngine.SceneManagement;
    using UnityEngine.UI;
    using Zenject;
    using Honememo.RougeLikeMmo.UseCases;

    /// <summary>
    /// ホーム画面スタートボタンコントローラクラス。
    /// </summary>
    public class StartButtonController : MonoBehaviour
    {
        #region 内部変数

        /// <summary>
        /// ゲーム開始ユースケース。
        /// </summary>
        [Inject]
        private StartGameUseCase useCase;

        #endregion

        #region 公開変数

        /// <summary>
        /// ダンジョン選択用のドロップダウン。
        /// </summary>
        public Dropdown DungeonDropdown;

        /// <summary>
        /// PC選択用のドロップダウン。
        /// </summary>
        public Dropdown PcDropdown;

        #endregion

        #region イベントメソッド

        /// <summary>
        /// パラメータチェック。
        /// </summary>
        public void Start()
        {
            Debug.Assert(this.DungeonDropdown != null);
            Debug.Assert(this.PcDropdown != null);
        }

        /// <summary>
        /// ゲームを作成し、次のゲーム画面に遷移する。
        /// </summary>
        public async void Play()
        {
            var button = this.GetComponent<Button>();
            button.interactable = false;
            this.DungeonDropdown.interactable = false;
            this.PcDropdown.interactable = false;
            // TODO: Waiting... も出す
            try
            {
                // ドロップダウンには暫定で "#{id} {name}" でデータが入っているのでそれをパースする
                var dungeonMatch = Regex.Match(this.DungeonDropdown.options[this.DungeonDropdown.value].text, "#([0-9]+?) ");
                var pcMatch = Regex.Match(this.PcDropdown.options[this.PcDropdown.value].text, "#([0-9]+?) ");
                if (!dungeonMatch.Success || !pcMatch.Success)
                {
                    // TODO: 選ばれてない場合はそもそも押せなくする
                    throw new Exception("Dropdown is not selected");
                }

                await this.useCase.Start(int.Parse(pcMatch.Groups[1].Value), int.Parse(dungeonMatch.Groups[1].Value));
                SceneManager.LoadScene("Game");
            }
            catch (Exception ex)
            {
                button.interactable = true;
                this.DungeonDropdown.interactable = true;
                this.PcDropdown.interactable = true;
                throw ex;
            }
        }

        #endregion
    }
}