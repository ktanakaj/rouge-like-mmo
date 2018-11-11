// ================================================================================================
// <summary>
//      フロアユニットソース</summary>
//
// <copyright file="FloorUnit.cs">
//      Copyright (C) 2018 Koichi Tanaka. All rights reserved.</copyright>
// <author>
//      Koichi Tanaka</author>
// ================================================================================================

namespace Honememo.RougeLikeMmo.Entities
{
    /// <summary>
    /// フロアユニットインタフェース。
    /// </summary>
    /// <remarks>
    /// フロアに出現するPCやNPC、モンスターのI/F。
    /// </remarks>
    public interface FloorUnit
    {
        #region プロパティ

        /// <summary>
        /// ID。
        /// </summary>
        string Id { get; }

        /// <summary>
        /// 名前。
        /// </summary>
        string Name { get; }

        /// <summary>
        /// HP。
        /// </summary>
        uint Hp { get; }

        /// <summary>
        /// 敵対的か？
        /// </summary>
        bool Hostility { get; }

        #endregion
    }
}