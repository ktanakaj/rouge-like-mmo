// ================================================================================================
// <summary>
//      初期化ユースケースソース</summary>
//
// <copyright file="InitializeUseCase.cs">
//      Copyright (C) 2018 Koichi Tanaka. All rights reserved.</copyright>
// <author>
//      Koichi Tanaka</author>
// ================================================================================================

namespace Honememo.RougeLikeMmo.UseCases
{
    using System;
    using System.Threading.Tasks;
    using Zenject;
    using Honememo.RougeLikeMmo.Entities;
    using Honememo.RougeLikeMmo.Gateways;

    /// <summary>
    /// 初期化ユースケースクラス。
    /// </summary>
    public class InitializeUseCase
    {
        #region 内部変数

        /// <summary>
        /// プレイヤーエンティティ。
        /// </summary>
        [Inject]
        private PlayerEntity player;

        /// <summary>
        /// プレイヤーリポジトリ。
        /// </summary>
        [Inject]
        private PlayerRepository playerRepository;

        /// <summary>
        /// システムリポジトリ。
        /// </summary>
        [Inject]
        private SystemRepository systemRepository;

        #endregion

        #region 公開メソッド

        /// <summary>
        /// 初期化を行う。
        /// </summary>
        public async void Initialize()
        {
            await this.LoadEnv();
            await this.Login();
            await this.LoadMasters();
        }

        #endregion

        /// <summary>
        /// プレイヤーをログインさせる。
        /// </summary>
        /// <returns>処理状態。</returns>
        private async Task Login()
        {
            dynamic player;
            if (this.player.Id == 0)
            {
                player = await this.playerRepository.Create(this.player.Token);
                this.player.Id = (int)player.id;
            }
            else
            {
                player = await this.playerRepository.Login(this.player.Id, this.player.Token);
            }

            this.player.Level = (uint)player.level;
            this.player.Exp = (ulong)player.exp;
            this.player.GameCoins = (ulong)player.gameCoins;
        }

        /// <summary>
        /// 環境情報を読み込む。
        /// </summary>
        /// <returns>処理状態。</returns>
        private async Task LoadEnv()
        {
            // TODO: 扱いは未定
            await this.systemRepository.GetEnv();
        }

        /// <summary>
        /// マスタ情報を読み込む。
        /// </summary>
        /// <returns>処理状態。</returns>
        private async Task LoadMasters()
        {
            var names = await this.systemRepository.FindLatestMasters();
            foreach (var name in names)
            {
                // TODO: どこかグローバルなところに詰める
                await this.systemRepository.FindLatestMaster<object>(name);
            }
        }
    }
}