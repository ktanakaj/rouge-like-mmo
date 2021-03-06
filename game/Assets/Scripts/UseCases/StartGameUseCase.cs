﻿// ================================================================================================
// <summary>
//      ゲーム開始ユースケースソース</summary>
//
// <copyright file="StartGameUseCase.cs">
//      Copyright (C) 2018 Koichi Tanaka. All rights reserved.</copyright>
// <author>
//      Koichi Tanaka</author>
// ================================================================================================

namespace Honememo.RougeLikeMmo.UseCases
{
    using System.Threading.Tasks;
    using Zenject;
    using Honememo.RougeLikeMmo.Entities;
    using Honememo.RougeLikeMmo.Gateways;

    /// <summary>
    /// ゲーム開始ユースケースクラス。
    /// </summary>
    public class StartGameUseCase
    {
        #region 内部変数

        /// <summary>
        /// グローバルデータ。
        /// </summary>
        [Inject]
        private Global global = null;

        /// <summary>
        /// ゲームリポジトリ。
        /// </summary>
        [Inject]
        private GameRepository gameRepository = null;

        #endregion

        #region 公開メソッド

        /// <summary>
        /// ゲームを開始する。
        /// </summary>
        /// <param name="pcId">使用するPCのID。</param>
        /// <param name="dungeonId">プレイするダンジョンのID。</param>
        /// <returns>処理状態。</returns>
        public async Task Start(int pcId, int dungeonId)
        {
            var pc = this.global.PlayerCharacterEntities[pcId];
            var dungeon = this.global.DungeonEntities[dungeonId];

            var url = await this.gameRepository.Start(pcId, dungeonId);

            // 開始されたゲームと接続先URLを保存
            this.global.GameEntity = new GameEntity() {
                PlayerCharacter = pc,
                Dungeon = dungeon,
                Url = url,
            };
        }

        #endregion
    }
}