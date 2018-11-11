// ================================================================================================
// <summary>
//      ゲーム情報読み込みユースケースソース</summary>
//
// <copyright file="LoadGameUseCase.cs">
//      Copyright (C) 2018 Koichi Tanaka. All rights reserved.</copyright>
// <author>
//      Koichi Tanaka</author>
// ================================================================================================

namespace Honememo.RougeLikeMmo.UseCases
{
    using System;
    using System.Threading.Tasks;
    using UniRx;
    using Zenject;
    using Honememo.RougeLikeMmo.Entities;
    using Honememo.RougeLikeMmo.Gateways;

    /// <summary>
    /// ゲーム情報読み込みユースケースクラス。
    /// </summary>
    /// <remarks>現在居るフロアの情報を読み込む。</remarks>
    public class LoadGameUseCase : IObservable<Unit>
    {
        #region 内部変数

        /// <summary>
        /// グローバルデータ。
        /// </summary>
        [Inject]
        private Global global;

        /// <summary>
        /// ゲームリポジトリ。
        /// </summary>
        [Inject]
        private GameRepository gameRepository;

        /// <summary>
        /// 結果通知用Subject。
        /// </summary>
        private Subject<Unit> outputPort = new Subject<Unit>();

        #endregion

        #region I/F実装メソッド

        /// <summary>
        /// ゲーム情報の読み込みを監視する。
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
        /// ゲーム情報読み込む。
        /// </summary>
        /// <returns>処理状態。</returns>
        public async Task Load()
        {
            // TODO: 未実装
            // this.global.FloorEntity = await this.gameRepository.
            this.outputPort.OnNext(Unit.Default);
        }

        #endregion
    }
}