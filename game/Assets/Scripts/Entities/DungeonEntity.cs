// ================================================================================================
// <summary>
//      ダンジョンマスタエンティティソース</summary>
//
// <copyright file="DungeonEntity.cs">
//      Copyright (C) 2018 Koichi Tanaka. All rights reserved.</copyright>
// <author>
//      Koichi Tanaka</author>
// ================================================================================================

namespace Honememo.RougeLikeMmo.Entities
{
    using System;
    using UnityEngine;

    /// <summary>
    /// ダンジョンマスタエンティティクラス。
    /// </summary>
    [Serializable]
    public class DungeonEntity
    {
        #region 内部変数

        /// <summary>
        /// ダンジョンID。
        /// </summary>
        [SerializeField]
        private int id;

        /// <summary>
        /// ダンジョン名。
        /// </summary>
        [SerializeField]
        private string name;

        /// <summary>
        /// 難易度。
        /// </summary>
        [SerializeField]
        private uint difficulty;

        /// <summary>
        /// 総フロア数。
        /// </summary>
        [SerializeField]
        private uint numbers;

        #endregion

        #region 公開プロパティ

        /// <summary>
        /// ダンジョンID。
        /// </summary>
        public int Id { get { return this.id; } set { this.id = value; } }

        /// <summary>
        /// ダンジョン名。
        /// </summary>
        public string Name { get { return this.name; } set { this.name = value; } }

        /// <summary>
        /// 難易度。
        /// </summary>
        public uint Difficulty { get { return this.difficulty; } set { this.difficulty = value; } }

        /// <summary>
        /// 総フロア数。
        /// </summary>
        public uint Numbers { get { return this.numbers; } set { this.numbers = value; } }

        #endregion
    }
}