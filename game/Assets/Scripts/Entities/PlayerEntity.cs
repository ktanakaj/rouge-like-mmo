// ================================================================================================
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
    public class PlayerEntity
    {
        #region 公開プロパティ

        /// <summary>
        /// 端末トークン。
        /// </summary>
        public string Token
        {
            get
            {
                // 生成済みならその値を、ない場合は自動生成した値を返す
                if (PlayerPrefs.HasKey("PlayerToken"))
                {
                    return PlayerPrefs.GetString("PlayerToken");
                }

                var token = Guid.NewGuid().ToString("D");
                PlayerPrefs.SetString("PlayerToken", token);
                PlayerPrefs.Save();
                return token;
            }
        }

        #endregion
    }
}