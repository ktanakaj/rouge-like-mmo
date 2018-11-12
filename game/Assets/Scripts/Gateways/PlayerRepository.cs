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
    using MiniJSON;
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
        /// HTTP APIクライアント。
        /// </summary>
        [Inject]
        private AppWebRequest webRequest;

        /// <summary>
        /// WebSocket/JSON-RPC2 APIクライアント。
        /// </summary>
        [Inject]
        private AppWsRequest wsRequest;

        #endregion

        #region API呼び出しメソッド

        /// <summary>
        /// プレイヤーを新規登録する。
        /// </summary>
        /// <param name="token">端末トークン。</param>
        /// <returns>プレイヤー情報。</returns>
        public async Task<PlayerEntity> CreatePlayer(string token)
        {
            var result = await this.webRequest.Post("api/players", new Dictionary<string, object>()
            {
                { "token", token },
            });

            var player = JsonUtility.FromJson<PlayerEntity>(result);

            // WebSocket APIのクライアントにID情報を詰める
            // TODO: ここでやるのも微妙な気がするので要検討
            this.wsRequest.PlayerId = player.Id;
            this.wsRequest.Token = token;

            return player;
        }

        /// <summary>
        /// プレイヤーを認証する。
        /// </summary>
        /// <param name="playerId">プレイヤーID。</param>
        /// <param name="token">端末トークン。</param>
        /// <returns>プレイヤー情報。</returns>
        public async Task<PlayerEntity> Login(int playerId, string token)
        {
            var result = await this.webRequest.Post("api/players/login", new Dictionary<string, object>()
            {
                { "id", playerId },
                { "token", token },
            });

            // WebSocket APIのクライアントにID情報を詰める
            // TODO: ここでやるのも微妙な気がするので要検討
            this.wsRequest.PlayerId = playerId;
            this.wsRequest.Token = token;

            return JsonUtility.FromJson<PlayerEntity>(result);
        }

        /// <summary>
        /// プレイヤーキャラクターを取得する。
        /// </summary>
        /// <returns>プレイヤーキャラクター情報。</returns>
        public async Task<IList<PlayerCharacterEntity>> FindPlayerCharacters()
        {
            var records = await this.webRequest.Get<IList<object>>("api/pc");
            return records.Select((rec) => JsonUtility.FromJson<PlayerCharacterEntity>(Json.Serialize(rec))).ToList();
        }

        /// <summary>
        /// プレイヤーキャラクターを新規登録する。
        /// </summary>
        /// <param name="name">キャラクター名。</param>
        /// <returns>登録したプレイヤーキャラクター情報。</returns>
        public async Task<PlayerCharacterEntity> CreatePlayerCharacter(string name)
        {
            var result = await this.webRequest.Post("api/pc", new Dictionary<string, object>()
            {
                { "name", name },
            });
            return JsonUtility.FromJson<PlayerCharacterEntity>(result);
        }

        #endregion
    }
}