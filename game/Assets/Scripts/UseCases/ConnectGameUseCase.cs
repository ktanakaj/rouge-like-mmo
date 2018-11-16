// ================================================================================================
// <summary>
//      ゲーム接続ユースケースソース</summary>
//
// <copyright file="ConnectGameUseCase.cs">
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
    /// ゲーム接続ユースケースクラス。
    /// </summary>
    /// <remarks>現在居るフロアのサーバーにコネクション確立、フロア情報を読み込む。</remarks>
    public class ConnectGameUseCase : IObservable<Unit>
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
        /// 接続成功、フロア情報の読み込みを監視する。
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
        /// サーバーに接続して、フロア情報を読み込む。
        /// </summary>
        /// <returns>処理状態。</returns>
        public async Task Connect()
        {
            await this.gameRepository.Connect(
                this.global.GameEntity.Url,
                this.global.AuthEntity.Id,
                this.global.AuthEntity.Token);

            // TODO: フロア情報読み込みは未実装
            // this.global.FloorEntity = await this.gameRepository.
            await this.gameRepository.Activate();
            this.outputPort.OnNext(Unit.Default);
        }

        #endregion
    }
}