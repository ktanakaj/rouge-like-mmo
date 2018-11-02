// ================================================================================================
// <summary>
//      ローグ風MMO初期化ユースケースソース</summary>
//
// <copyright file="InitializeUseCase.cs">
//      Copyright (C) 2018 Koichi Tanaka. All rights reserved.</copyright>
// <author>
//      Koichi Tanaka</author>
// ================================================================================================

namespace Honememo.RougeLikeMmo.UseCases
{
    using System.Collections;
    using System.Collections.Generic;
    using UnityEngine;
    using Zenject;
    using Honememo.RougeLikeMmo.Gateways;

    /// <summary>
    /// ローグ風MMO初期化ユースケースクラス。
    /// </summary>
    public class InitializeUseCase
    {
        #region 内部変数

        /// <summary>
        /// 初期化ユースケース。
        /// </summary>
        [Inject]
        private AuthRepository authRepository;

        #endregion

        #region 公開メソッド

        public async void Initialize()
        {
            Debug.Log("InitializeUseCase.Initialize");
            await this.authRepository.Auth("TEST");
        }

        #endregion
    }
}