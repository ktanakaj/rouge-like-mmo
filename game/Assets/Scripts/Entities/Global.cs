// ================================================================================================
// <summary>
//      グローバル変数的な共通データ置き場ソース</summary>
//
// <copyright file="Global.cs">
//      Copyright (C) 2018 Koichi Tanaka. All rights reserved.</copyright>
// <author>
//      Koichi Tanaka</author>
// ================================================================================================

namespace Honememo.RougeLikeMmo.Entities
{
    using System.Collections.Generic;

    /// <summary>
    /// グローバル変数的な共通データ置き場クラス。
    /// </summary>
    /// <remarks>ロード済みのデータなどの参照用。不要になったら必ず消してください。</remarks>
    public class Global
    {
        #region システムデータ

        /// <summary>
        /// 認証情報。
        /// </summary>
        public AuthEntity AuthEntity { get; set; }

        /// <summary>
        /// 環境情報。
        /// </summary>
        public EnvEntity EnvEntity { get; set; }

        #endregion

        #region マスタデータ

        /// <summary>
        /// エラーコードマスタ。
        /// </summary>
        public IDictionary<int, ErrorCodeEntity> ErrorCodeEntities { get; set; }

        /// <summary>
        /// ダンジョンマスタ。
        /// </summary>
        public IDictionary<int, DungeonEntity> DungeonEntities { get; set; }

        #endregion

        #region ユーザーデータ

        /// <summary>
        /// プレイヤー情報。
        /// </summary>
        public PlayerEntity PlayerEntity { get; set; }

        /// <summary>
        /// プレイヤーが所持するPC情報。
        /// </summary>
        public IDictionary<int, PlayerCharacterEntity> PlayerCharacterEntities { get; set; }

        #endregion

        #region ゲームデータ

        /// <summary>
        /// プレイ中のゲーム情報。
        /// </summary>
        public GameEntity GameEntity { get; set; }

        /// <summary>
        /// 滞在中のフロアの情報。
        /// </summary>
        public FloorEntity FloorEntity { get; set; }

        #endregion
    }
}