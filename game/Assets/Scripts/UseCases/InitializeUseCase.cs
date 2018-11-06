// ================================================================================================
// <summary>
//      初期化ユースケースソース</summary>
//
// <copyright file="InitializeUseCase.cs">
//      Copyright (C) 2018 Koichi Tanaka. All rights reserved.</copyright>
// <author>
//      Koichi Tanaka</author>
// ================================================================================================

namespace Honememo.RougeLikeMmo.UseCases
{
    using System;
    using UnityEngine;
    using Zenject;
    using Honememo.RougeLikeMmo.Entities;
    using Honememo.RougeLikeMmo.Gateways;

    /// <summary>
    /// 初期化ユースケースクラス。
    /// </summary>
    public class InitializeUseCase
    {
        #region 内部変数

        /// <summary>
        /// プレイヤーエンティティ。
        /// </summary>
        [Inject]
        private PlayerEntity player;

        /// <summary>
        /// 認証リポジトリ。
        /// </summary>
        [Inject]
        private AuthRepository authRepository;

        #endregion

        #region 公開メソッド

        /// <summary>
        /// 初期化を行う。
        /// </summary>
        public async void Initialize()
        {
            await this.authRepository.Auth(this.player.Token);
        }

        #endregion
    }
}