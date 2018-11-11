// ================================================================================================
// <summary>
//      フロアエンティティソース</summary>
//
// <copyright file="FloorEntity.cs">
//      Copyright (C) 2018 Koichi Tanaka. All rights reserved.</copyright>
// <author>
//      Koichi Tanaka</author>
// ================================================================================================

namespace Honememo.RougeLikeMmo.Entities
{
    using System.Collections.Generic;

    /// <summary>
    /// フロアエンティティクラス。
    /// </summary>
    /// <remarks>ダンジョンの1フロアの情報を扱う。</remarks>
    public class FloorEntity
    {
        #region 公開プロパティ

        /// <summary>
        /// マップデータ。
        /// </summary>
        public string Map { get; set; }

        /// <summary>
        /// フロアに滞在するPCやモンスターなど。
        /// </summary>
        public IDictionary<string, FloorUnit> Units { get; set; }

        #endregion
    }
}