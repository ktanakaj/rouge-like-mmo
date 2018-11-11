// ================================================================================================
// <summary>
//      Chat送信ユースケースソース</summary>
//
// <copyright file="SendChatUseCase.cs">
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
    /// Chat送信ユースケースクラス。
    /// </summary>
    /// TODO: 戻り値は自分が送信したメッセージにする、Chat受け取りと共通化でもいいかも
    public class SendChatUseCase : IObservable<Unit>
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
        /// Chat送信を監視する。
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
        /// Chatを送信する。
        /// </summary>
        /// <param name="message">メッセージ。</param>
        /// <returns>処理状態。</returns>
        public async Task Send(string message)
        {
            // TODO: 未実装
            // = await this.gameRepository.
            this.outputPort.OnNext(Unit.Default);
        }

        #endregion
    }
}