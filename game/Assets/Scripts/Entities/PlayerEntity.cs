﻿// ================================================================================================
// <summary>
//      プレイヤーエンティティソース</summary>
//
// <copyright file="PlayerEntity.cs">
//      Copyright (C) 2018 Koichi Tanaka. All rights reserved.</copyright>
// <author>
//      Koichi Tanaka</author>
// ================================================================================================

namespace Honememo.RougeLikeMmo.Entities
{
    using System;
    using UnityEngine;

    /// <summary>
    /// プレイヤーエンティティクラス。
    /// </summary>
    [Serializable]
    public class PlayerEntity
    {
        #region 内部変数

        /// <summary>
        /// プレイヤーID。
        /// </summary>
        [SerializeField]
        private int id;

        /// <summary>
        /// プレイヤーレベル。
        /// </summary>
        [SerializeField]
        private uint level;

        /// <summary>
        /// プレイヤー経験値。
        /// </summary>
        [SerializeField]
        private ulong exp;

        /// <summary>
        /// プレイヤー所持金。
        /// </summary>
        [SerializeField]
        private ulong gameCoins;

        #endregion

        #region 公開プロパティ

        /// <summary>
        /// プレイヤーID。
        /// </summary>
        public int Id { get { return this.id; } set { this.id = value; } }

        /// <summary>
        /// プレイヤーレベル。
        /// </summary>
        public uint Level { get { return this.level; } set { this.level = value; } }

        /// <summary>
        /// プレイヤー経験値。
        /// </summary>
        public ulong Exp { get { return this.exp; } set { this.exp = value; } }

        /// <summary>
        /// プレイヤー所持金。
        /// </summary>
        public ulong GameCoins { get { return this.gameCoins; } set { this.gameCoins = value; } }

        #endregion
    }
}