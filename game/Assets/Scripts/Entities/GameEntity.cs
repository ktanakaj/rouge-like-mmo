// ================================================================================================
// <summary>
//      ゲームエンティティソース</summary>
//
// <copyright file="GameEntity.cs">
//      Copyright (C) 2018 Koichi Tanaka. All rights reserved.</copyright>
// <author>
//      Koichi Tanaka</author>
// ================================================================================================

namespace Honememo.RougeLikeMmo.Entities
{
    /// <summary>
    /// ゲームエンティティクラス。
    /// </summary>
    /// <remarks>プレイ中のゲーム情報を扱う。</remarks>
    public class GameEntity
    {
        #region 公開プロパティ

        /// <summary>
        /// ダンジョンマスタ。
        /// </summary>
        public DungeonEntity Dungeon { get; set; }

        /// <summary>
        /// PC情報。
        /// </summary>
        public PlayerCharacterEntity PlayerCharacter { get; set; }

        /// <summary>
        /// サーバーアドレス。
        /// </summary>
        public string Address { get; set; }

        /// <summary>
        /// サーバーport。
        /// </summary>
        public int Port { get; set; }

        #endregion
    }
}