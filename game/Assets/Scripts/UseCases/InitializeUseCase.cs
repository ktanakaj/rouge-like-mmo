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
    using System.Linq;
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
        /// グローバルデータ。
        /// </summary>
        [Inject]
        private Global global = null;

        /// <summary>
        /// ローカルリポジトリ。
        /// </summary>
        [Inject]
        private LocalRepository localRepository = null;

        /// <summary>
        /// プレイヤーリポジトリ。
        /// </summary>
        [Inject]
        private PlayerRepository playerRepository = null;

        /// <summary>
        /// システムリポジトリ。
        /// </summary>
        [Inject]
        private SystemRepository systemRepository = null;

        #endregion

        #region 公開メソッド

        /// <summary>
        /// 初期化を行う。
        /// </summary>
        /// <returns>処理状態。</returns>
        public async Task Initialize()
        {
            await this.LoadEnv();
            await this.Login();
            await this.LoadMasters();
        }

        #endregion

        #region 内部メソッド

        /// <summary>
        /// 環境情報を読み込む。
        /// </summary>
        /// <returns>処理状態。</returns>
        private async Task LoadEnv()
        {
            // TODO: メンテナンス中とかバージョンとかチェックするようにする
            this.global.EnvEntity = await this.systemRepository.GetEnv();
        }

        /// <summary>
        /// プレイヤーをログインさせる。
        /// </summary>
        /// <returns>処理状態。</returns>
        private async Task Login()
        {
            PlayerEntity player;
            AuthEntity auth = this.localRepository.LoadAuth();
            if (auth != null)
            {
                // 認証情報がある場合は、それで認証する
                // TODO: 認証失敗時の処理を考える
                player = await this.playerRepository.Login(auth.Id, auth.Token);
            }
            else
            {
                // 認証情報が無い場合は、新規作成する
                var token = AuthEntity.NewToken();
                player = await this.playerRepository.CreatePlayer(token);
                auth = new AuthEntity() { Id = player.Id, Token = token };
                this.localRepository.SaveAuth(auth);
            }

            this.global.AuthEntity = auth;
            this.global.PlayerEntity = player;
        }

        /// <summary>
        /// マスタ情報を読み込む。
        /// </summary>
        /// <returns>処理状態。</returns>
        private async Task LoadMasters()
        {
            // マスタ追加時はどのみちアプリ改修も必須なのでべた書きしている。
            // もし多くなるようなら何か簡略化の方法も考える。
            var errorCodes = await this.systemRepository.FindMaster<ErrorCodeEntity>("ErrorCode");
            this.global.ErrorCodeEntities = errorCodes.ToDictionary((n) => n.Id, (n) => n);
            var dungeons = await this.systemRepository.FindMaster<DungeonEntity>("Dungeon");
            this.global.DungeonEntities = dungeons.ToDictionary((n) => n.Id, (n) => n);
        }

        #endregion
    }
}