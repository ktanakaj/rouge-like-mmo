// ================================================================================================
// <summary>
//      非同期処理逐次実行管理ソース</summary>
//
// <copyright file="ObservableSerialRunner.cs">
//      Copyright (C) 2018 Koichi Tanaka. All rights reserved.</copyright>
// <author>
//      Koichi Tanaka</author>
// ================================================================================================

namespace Honememo.RougeLikeMmo.Gateways
{
    using System;
    using System.Collections.Concurrent;
    using System.Linq;
    using System.Threading;
    using System.Threading.Tasks;
    using UniRx;
    using Zenject;

    /// <summary>
    /// 非同期処理逐次実行管理クラス。
    /// </summary>
    /// <remarks>
    /// 毎フレーム呼び出され、処理待ちの非同期処理をキューから取得して順番に実行する。
    /// </remarks>
    public class ObservableSerialRunner : IInitializable, ITickable
    {
        #region 内部変数

        /// <summary>
        /// 処理待ちキュー。
        /// </summary>
        private ConcurrentQueue<RunInfo> queue = new ConcurrentQueue<RunInfo>();

        /// <summary>
        /// 実行中処理。
        /// </summary>
        private RunInfo current;

        /// <summary>
        /// メインスレッドのコンテキスト。
        /// </summary>
        private SynchronizationContext mainContext;

        #endregion

        #region 公開プロパティ

        /// <summary>
        /// リトライ許容回数。
        /// </summary>
        public int MaxRetry { get; set; } = 3;

        /// <summary>
        /// リトライ時のウェイト (ms)。
        /// </summary>
        public int Wait { get; set; } = 1000;

        #endregion

        #region I/F実装メソッド

        /// <summary>
        /// zenjectによる初期化処理。
        /// </summary>
        public void Initialize()
        {
            // メインスレッドのコンテキストをバックアップする
            this.mainContext = SynchronizationContext.Current;
        }

        /// <summary>
        /// zenjectによる毎フレームの処理。
        /// </summary>
        public void Tick()
        {
            // 現在実行中のものが無い場合、キューから1件取り出して実行する
            if (this.current == null && this.queue.TryDequeue(out this.current))
            {
                this.RunCurrent();
            }
        }

        #endregion

        #region 公開メソッド

        /// <summary>
        /// キューに処理を登録する。
        /// </summary>
        /// <typeparam name="T">処理の戻り値型。</typeparam>
        /// <param name="observable">登録する非同期処理。</param>
        /// <returns>処理結果を受け取るためのObservable。</returns>
        /// <remarks>
        /// Subscribeのタイミングで起動するCold Observableである必要があります。
        /// OnCompletedしないものは処理が終わらないため実行できません。
        /// </remarks>
        public IObservable<T> Enqueue<T>(IObservable<T> observable)
        {
            var info = new RunInfo();
            info.observable = (IObservable<object>)observable;
            info.responser = new Subject<object>();
            this.queue.Enqueue(info);
            return info.responser.Select((res) => (T)res);
        }

        #endregion

        #region 内部メソッド

        /// <summary>
        /// 現在の処理を実行する。
        /// </summary>
        private void RunCurrent()
        {
            var info = this.current;
            info.observable.Subscribe(
                // OnCompleted,OnErrorが呼ばれたタイミングで次のキューを呼べる状態にする
                info.responser.OnNext,
                async (ex) => {
                    // リトライ可能例外が投げられた場合、リトライする
                    if (ex is RetryableException)
                    {
                        // FIXME: 即エラーではなく、確認ダイアログ用のイベントに通知する
                        if (++info.retry >= this.MaxRetry)
                        {
                            info.responser.OnError(ex.InnerException);
                            this.current = null;
                        }
                        else
                        {
                            await Task.Delay(this.Wait);
                            this.RunCurrent();
                        }
                    }
                    else
                    {
                        info.responser.OnError(ex);
                        this.current = null;
                    }
                },
                () => {
                    info.responser.OnCompleted();
                    this.current = null;
                });
        }

        #endregion

        #region 内部クラス

        /// <summary>
        /// リトライ可能であることを示す例外ラッパークラス。
        /// </summary>
        public class RetryableException : Exception
        {
            /// <summary>
            /// 指定された例外をラップするインスタンスを生成する。
            /// </summary>
            /// <param name="innerException">発生した例外。</param>
            public RetryableException(Exception innerException) : base(innerException.Message, innerException)
            {
            }
        }

        /// <summary>
        /// キューに入れる情報を扱うタプル。
        /// </summary>
        private class RunInfo
        {
            public IObservable<object> observable;
            public Subject<object> responser;
            public int retry;
        }

        #endregion
    }
}