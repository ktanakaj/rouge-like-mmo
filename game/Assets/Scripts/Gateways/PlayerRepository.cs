// ================================================================================================
// <summary>
//      プレイヤーAPIリポジトリソース</summary>
//
// <copyright file="PlayerRepository.cs">
//      Copyright (C) 2018 Koichi Tanaka. All rights reserved.</copyright>
// <author>
//      Koichi Tanaka</author>
// ================================================================================================

namespace Honememo.RougeLikeMmo.Gateways
{
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using Codeplex.Data;
    using UniRx;
    using UnityEngine;
    using Zenject;
    using Honememo.RougeLikeMmo.Entities;

    /// <summary>
    /// プレイヤーAPIリポジトリクラス。
    /// </summary>
    public class PlayerRepository
    {
        #region 内部変数

        /// <summary>
        /// APIクライアント。
        /// </summary>
        [Inject]
        private AppWebRequest request;

        #endregion

        #region API呼び出しメソッド

        /// <summary>
        /// プレイヤーを新規登録する。
        /// </summary>
        /// <param name="token">端末トークン。</param>
        /// <returns>プレイヤー情報。</returns>
        public async Task<PlayerEntity> CreatePlayer(string token)
        {
            dynamic body = new DynamicJson();
            body.token = token;
            string json = body.ToString();
            var result = await this.request.Post("api/players", json);
            return JsonUtility.FromJson<PlayerEntity>(result);
        }

        /// <summary>
        /// プレイヤーを認証する。
        /// </summary>
        /// <param name="playerId">プレイヤーID。</param>
        /// <param name="token">端末トークン。</param>
        /// <returns>プレイヤー情報。</returns>
        public async Task<PlayerEntity> Login(int playerId, string token)
        {
            dynamic body = new DynamicJson();
            body.id = playerId;
            body.token = token;
            string json = body.ToString();
            var result = await this.request.Post("api/players/login", json);
            return JsonUtility.FromJson<PlayerEntity>(result);
        }

        /// <summary>
        /// プレイヤーキャラクターを取得する。
        /// </summary>
        /// <returns>プレイヤーキャラクター情報。</returns>
        public async Task<IList<PlayerCharacterEntity>> FindPlayerCharacters()
        {
            var result = await this.request.Get("api/pc");
            var records = (object[])DynamicJson.Parse(result);
            return records.Select((rec) => JsonUtility.FromJson<PlayerCharacterEntity>(rec.ToString())).ToList();
        }

        /// <summary>
        /// プレイヤーキャラクターを新規登録する。
        /// </summary>
        /// <param name="name">キャラクター名。</param>
        /// <returns>登録したプレイヤーキャラクター情報。</returns>
        public async Task<PlayerCharacterEntity> CreatePlayerCharacter(string name)
        {
            dynamic body = new DynamicJson();
            body.name = name;
            string json = body.ToString();
            var result = await this.request.Post("api/pc", json);
            return JsonUtility.FromJson<PlayerCharacterEntity>(result);
        }

        #endregion
    }
}