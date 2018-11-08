// ================================================================================================
// <summary>
//      エラーコードマスタエンティティソース</summary>
//
// <copyright file="ErrorCodeEntity.cs">
//      Copyright (C) 2018 Koichi Tanaka. All rights reserved.</copyright>
// <author>
//      Koichi Tanaka</author>
// ================================================================================================

namespace Honememo.RougeLikeMmo.Entities
{
    using System;
    using UnityEngine;

    /// <summary>
    /// エラーコードマスタエンティティクラス。
    /// </summary>
    [Serializable]
    public class ErrorCodeEntity
    {
        #region 内部変数

        /// <summary>
        /// エラーコードID。
        /// </summary>
        [SerializeField]
        private int id;

        /// <summary>
        /// レスポンスコード。
        /// </summary>
        [SerializeField]
        private int responseCode;

        /// <summary>
        /// エラーコード。
        /// </summary>
        [SerializeField]
        private string errorCode;

        /// <summary>
        /// 説明。
        /// </summary>
        [SerializeField]
        private string description;

        /// <summary>
        /// ログレベル。
        /// </summary>
        [SerializeField]
        private string logLevel;

        #endregion

        #region 公開プロパティ

        /// <summary>
        /// エラーコードID。
        /// </summary>
        public int Id { get { return this.id; } set { this.id = value; } }

        /// <summary>
        /// レスポンスコード。
        /// </summary>
        public int ResponseCode { get { return this.responseCode; } set { this.responseCode = value; } }

        /// <summary>
        /// エラーコード。
        /// </summary>
        public string ErrorCode { get { return this.errorCode; } set { this.errorCode = value; } }

        /// <summary>
        /// 説明。
        /// </summary>
        public string Description { get { return this.description; } set { this.description = value; } }

        /// <summary>
        /// ログレベル。
        /// </summary>
        public string LogLevel { get { return this.logLevel; } set { this.logLevel = value; } }

        #endregion
    }
}