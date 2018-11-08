// ================================================================================================
// <summary>
//      認証情報エンティティソース</summary>
//
// <copyright file="AuthEntity.cs">
//      Copyright (C) 2018 Koichi Tanaka. All rights reserved.</copyright>
// <author>
//      Koichi Tanaka</author>
// ================================================================================================

namespace Honememo.RougeLikeMmo.Entities
{
    using System;

    /// <summary>
    /// 認証情報エンティティクラス。
    /// </summary>
    public class AuthEntity
    {
        #region 公開プロパティ

        /// <summary>
        /// プレイヤーID。
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// 端末トークン。
        /// </summary>
        public string Token { get; set; }

        #endregion

        #region 公開staticメソッド

        /// <summary>
        /// 端末トークンを生成する。
        /// </summary>
        /// <returns>生成した端末トークン。</returns>
        public static string NewToken()
        {
            return Guid.NewGuid().ToString("D");
        }

        #endregion
    }
}