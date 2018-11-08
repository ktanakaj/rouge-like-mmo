// ================================================================================================
// <summary>
//      プレイヤーキャラクターエンティティソース</summary>
//
// <copyright file="PlayerCharacterEntity.cs">
//      Copyright (C) 2018 Koichi Tanaka. All rights reserved.</copyright>
// <author>
//      Koichi Tanaka</author>
// ================================================================================================

namespace Honememo.RougeLikeMmo.Entities
{
    using System;
    using UnityEngine;

    /// <summary>
    /// プレイヤーキャラクターエンティティクラス。
    /// </summary>
    [Serializable]
    public class PlayerCharacterEntity
    {
        #region 内部変数

        /// <summary>
        /// プレイヤーキャラクターID。
        /// </summary>
        [SerializeField]
        private int id;

        /// <summary>
        /// プレイヤーID。
        /// </summary>
        [SerializeField]
        private int playerId;

        /// <summary>
        /// キャラクター名。
        /// </summary>
        [SerializeField]
        private string name;

        /// <summary>
        /// キャラクターレベル。
        /// </summary>
        [SerializeField]
        private uint level;

        /// <summary>
        /// キャラクター累計経験値。
        /// </summary>
        [SerializeField]
        private ulong exp;

        /// <summary>
        /// HP。
        /// </summary>
        [SerializeField]
        private uint hp;

        /// <summary>
        /// 最終選択日時。
        /// </summary>
        [SerializeField]
        private string lastSelected;

        #endregion

        #region 公開プロパティ

        /// <summary>
        /// プレイヤーキャラクターID。
        /// </summary>
        public int Id { get { return this.id; } set { this.id = value; } }

        /// <summary>
        /// プレイヤーID。
        /// </summary>
        public int PlayerId { get { return this.playerId; } set { this.playerId = value; } }

        /// <summary>
        /// キャラクター名。
        /// </summary>
        public string Name { get { return this.name; } set { this.name = value; } }

        /// <summary>
        /// キャラクターレベル。
        /// </summary>
        public uint Level { get { return this.level; } set { this.level = value; } }

        /// <summary>
        /// キャラクター累計経験値。
        /// </summary>
        public ulong Exp { get { return this.exp; } set { this.exp = value; } }

        /// <summary>
        /// HP。
        /// </summary>
        public uint Hp { get { return this.hp; } set { this.hp = value; } }

        /// <summary>
        /// 最終選択日時。
        /// </summary>
        public DateTimeOffset? LastSelected {
            get {
                DateTimeOffset date;
                if (DateTimeOffset.TryParse(this.lastSelected, out date))
                {
                    return date;
                }
                return null;
            }
            set {
                if (value != null)
                {
                    this.lastSelected = ((DateTimeOffset)value).ToString("u");
                }
                else
                {
                    this.lastSelected = null;
                }
            }
        }

        #endregion
    }
}