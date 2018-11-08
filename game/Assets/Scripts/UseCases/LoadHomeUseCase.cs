// ================================================================================================
// <summary>
//      ホーム情報読み込みユースケースソース</summary>
//
// <copyright file="LoadHomeUseCase.cs">
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
    /// ホーム情報読み込みユースケースクラス。
    /// </summary>
    public class LoadHomeUseCase
    {
        #region 内部変数

        /// <summary>
        /// グローバルデータ。
        /// </summary>
        [Inject]
        private Global global;

        /// <summary>
        /// プレイヤーリポジトリ。
        /// </summary>
        [Inject]
        private PlayerRepository playerRepository;

        #endregion

        #region 公開メソッド

        /// <summary>
        /// ホーム情報読み込む。
        /// </summary>
        /// <returns>処理状態。</returns>
        public async Task Load()
        {
            await this.playerRepository.FindPlayerCharacters();
            // TODO: 未実装
            // this.global.
        }

        #endregion
    }
}