// ================================================================================================
// <summary>
//      ローグ風MMO ゲームAPIリポジトリソース</summary>
//
// <copyright file="GameRepository.cs">
//      Copyright (C) 2018 Koichi Tanaka. All rights reserved.</copyright>
// <author>
//      Koichi Tanaka</author>
// ================================================================================================

namespace Honememo.RougeLikeMmo.Gateways
{
    using System.Collections;
    using System.Collections.Generic;
    using System.Threading.Tasks;
    using UnityEngine;
    using Zenject;

    /// <summary>
    /// ゲームAPIリポジトリクラス。
    /// </summary>
    public class GameRepository
    {
        #region 内部変数

        /// <summary>
        /// 初期化ユースケース。
        /// </summary>
        [Inject]
        private ObservableSerialRunner taskRunner;

        #endregion

        #region API呼び出しメソッド

        public async Task Start()
        {

        }

        #endregion
    }
}