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
        /// 初期化。
        /// </summary>
        public void Start()
        {
            Debug.Assert(this.DungeonDropdown != null);
            Debug.Assert(this.PcDropdown != null);

            // ドロップダウンが両方とも有効になったらボタンを押せるようにする
            var button = this.GetComponent<Button>();
            this.PcDropdown.onValueChanged.AddListener((n) => 
            {
                button.interactable = this.DungeonDropdown.options.Count > 0 && this.PcDropdown.options.Count > 0;
            });
        }

        /// <summary>
        /// ゲームを作成し、次のゲーム画面に遷移する。
        /// </summary>
        public async void Play()
        {
            // TODO: ボタンの制御を共通化して、CreatePcも含めて押せなくする
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
                    throw new Exception("Dropdowns are invalid");
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