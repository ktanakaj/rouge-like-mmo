// ================================================================================================
// <summary>
//      プレイヤー操作ユースケースソース</summary>
//
// <copyright file="SendActionUseCase.cs">
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
    /// プレイヤー操作ユースケースクラス。
    /// </summary>
    /// <remarks>プレイヤーの移動（or攻撃）に伴う操作に対応。</remarks>
    /// TODO: 戻り値はたぶん変える、結果受け取りはUnit全般と共通化でもいいかも
    public class SendActionUseCase : IObservable<Unit>
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
        /// プレイヤー操作の結果を監視する。
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
        /// プレイヤー操作を実施する。
        /// </summary>
        /// <returns>処理状態。</returns>
        /// TODO: 方向を示す引数を貰う
        public async Task DoAction()
        {
            // TODO: 未実装
            // = await this.gameRepository.
            this.outputPort.OnNext(Unit.Default);
        }

        #endregion
    }
}