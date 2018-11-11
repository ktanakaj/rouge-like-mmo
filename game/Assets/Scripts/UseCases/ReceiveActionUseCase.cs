// ================================================================================================
// <summary>
//      ユニット動作受信ユースケースソース</summary>
//
// <copyright file="ReceiveActionUseCase.cs">
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
    /// ユニット動作受信ユースケースクラス。
    /// </summary>
    /// TODO: 戻り値は自分が受信したメッセージにする
    public class ReceiveActionUseCase : IObservable<Unit>, IInitializable
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
        /// ユニット動作受信を監視する。
        /// </summary>
        /// <param name="observer">監視処理。</param>
        /// <returns>リソース解放用。</returns>
        public IDisposable Subscribe(IObserver<Unit> observer)
        {
            return this.outputPort.Subscribe(observer);
        }

        /// <summary>
        /// 初期化処理。
        /// </summary>
        public void Initialize()
        {
            // TODO: リポジトリにユニット動作受信イベントを登録する
            throw new NotImplementedException();
        }

        #endregion
    }
}