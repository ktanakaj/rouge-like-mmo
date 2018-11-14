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
    using System;
    using System.Linq;
    using System.Threading.Tasks;
    using UniRx;
    using Zenject;
    using Honememo.RougeLikeMmo.Entities;
    using Honememo.RougeLikeMmo.Gateways;

    /// <summary>
    /// ホーム情報読み込みユースケースクラス。
    /// </summary>
    public class LoadHomeUseCase : IObservable<Unit>
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

        /// <summary>
        /// 結果通知用Subject。
        /// </summary>
        private Subject<Unit> outputPort = new Subject<Unit>();

        #endregion

        #region I/F実装メソッド

        /// <summary>
        /// ホーム情報の読み込みを監視する。
        /// </summary>
        /// <param name="observer">監視処理。</param>
        /// <returns>リソース解放用。</returns>
        public IDisposable Subscribe(IObserver<Unit> observer)
        {
            return this.outputPort.Subscribe(observer);
        }

        #endregion

        #region 公開メソッド

        /// <summary>
        /// ホーム情報読み込む。
        /// </summary>
        /// <returns>処理状態。</returns>
        public async Task Load()
        {
            var playerCharacters = await this.playerRepository.FindPlayerCharacters();
            this.global.PlayerCharacterEntities = playerCharacters.ToDictionary((n) => n.PcId, (n) => n);
            this.outputPort.OnNext(Unit.Default);
        }

        #endregion
    }
}