// ================================================================================================
// <summary>
//      PC作成ユースケースソース</summary>
//
// <copyright file="CreatePcUseCase.cs">
//      Copyright (C) 2018 Koichi Tanaka. All rights reserved.</copyright>
// <author>
//      Koichi Tanaka</author>
// ================================================================================================

namespace Honememo.RougeLikeMmo.UseCases
{
    using System;
    using System.Threading.Tasks;
    using UniRx;
    using UnityEngine;
    using Zenject;
    using Honememo.RougeLikeMmo.Entities;
    using Honememo.RougeLikeMmo.Gateways;

    /// <summary>
    /// PC作成ユースケースクラス。
    /// </summary>
    public class CreatePcUseCase : IObservable<PlayerCharacterEntity>
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
        private Subject<PlayerCharacterEntity> outputPort = new Subject<PlayerCharacterEntity>();

        #endregion

        #region I/F実装メソッド

        /// <summary>
        /// PCの作成を監視する。
        /// </summary>
        /// <param name="observer">監視処理。</param>
        /// <returns>リソース解放用。</returns>
        public IDisposable Subscribe(IObserver<PlayerCharacterEntity> observer)
        {
            return this.outputPort.Subscribe(observer);
        }

        #endregion

        #region 公開メソッド

        /// <summary>
        /// PCを作成する。
        /// </summary>
        /// <param name="name"></param>
        /// <returns>処理状態。</returns>
        public async Task Create(string name)
        {
            Debug.Assert(this.global.PlayerCharacterEntities != null);
            var pc = await this.playerRepository.CreatePlayerCharacter(name);
            this.global.PlayerCharacterEntities[pc.PcId] = pc;
            this.outputPort.OnNext(pc);
        }

        #endregion
    }
}