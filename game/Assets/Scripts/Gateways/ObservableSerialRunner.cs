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
    using System.Linq;
    using System.Collections.Concurrent;
    using System.Threading;
    using UniRx;
    using UnityEngine;
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
        private ConcurrentQueue<QueueValue> queue = new ConcurrentQueue<QueueValue>();

        /// <summary>
        /// 実行中処理。
        /// </summary>
        private IObservable<object> current;

        /// <summary>
        /// メインスレッドのコンテキスト。
        /// </summary>
        private SynchronizationContext mainContext;

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
            QueueValue queue;
            if (this.current == null && this.queue.TryDequeue(out queue))
            {
                // サブスクライブして処理を起動させる
                var subject = queue.responser;
                this.current = queue.observable;
                this.current.Subscribe(
                    (ret) => 
                    {
                        // OnNextが呼ばれたタイミングで次のキューを呼べる状態にする
                        // ※ OnCompletedまで待ってもいいけど、現状はそうしている
                        subject.OnNext(ret);
                        this.current = null;
                    },
                    // TODO: リトライの仕組みを入れる
                    (ex) => subject.OnError(ex),
                    subject.OnCompleted);
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
        public IObservable<T> Enqueue<T>(IObservable<T> observable)
        {
            var v = new QueueValue();
            v.observable = (IObservable<object>)observable;
            v.responser = new Subject<object>();
            this.queue.Enqueue(v);
            return v.responser.Select((res) => (T)res);
        }

        #endregion

        #region 内部クラス

        /// <summary>
        /// キューに入れる情報を扱うタプル。
        /// </summary>
        private class QueueValue
        {
            public IObservable<object> observable;
            public Subject<object> responser;
        }

        #endregion
    }
}