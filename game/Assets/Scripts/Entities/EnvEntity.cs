// ================================================================================================
// <summary>
//      環境情報エンティティソース</summary>
//
// <copyright file="EnvEntity.cs">
//      Copyright (C) 2018 Koichi Tanaka. All rights reserved.</copyright>
// <author>
//      Koichi Tanaka</author>
// ================================================================================================

namespace Honememo.RougeLikeMmo.Entities
{
    using System;
    using UnityEngine;

    /// <summary>
    /// 環境情報エンティティクラス。
    /// </summary>
    [Serializable]
    public class EnvEntity
    {
        #region 内部変数

        /// <summary>
        /// サーバーバージョン。
        /// </summary>
        [SerializeField]
        private string serverVersion;

        /// <summary>
        /// サーバー時間 (UNIXTIME)。
        /// </summary>
        [SerializeField]
        private long serverTime;

        /// <summary>
        /// 最低アプリバージョン。
        /// </summary>
        [SerializeField]
        private string minimumAppVersion;

        #endregion

        #region 公開プロパティ

        /// <summary>
        /// サーバーバージョン。
        /// </summary>
        public string ServerVersion { get { return this.serverVersion; } set { this.serverVersion = value; } }

        /// <summary>
        /// サーバー時間。
        /// </summary>
        public DateTimeOffset ServerTime { get { return DateTimeOffset.FromUnixTimeSeconds(this.serverTime); } set { this.serverTime = value.ToUnixTimeSeconds(); } }

        /// <summary>
        /// 最低アプリバージョン。
        /// </summary>
        public string MinimumAppVersion { get { return this.minimumAppVersion; } set { this.minimumAppVersion = value; } }

        #endregion
    }
}