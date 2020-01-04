// ================================================================================================
// <summary>
//      ゲームAPIリポジトリソース</summary>
//
// <copyright file="GameRepository.cs">
//      Copyright (C) 2018 Koichi Tanaka. All rights reserved.</copyright>
// <author>
//      Koichi Tanaka</author>
// ================================================================================================

namespace Honememo.RougeLikeMmo.Gateways
{
    using System;
    using System.Collections.Generic;
    using System.Threading.Tasks;
    using UniRx;
    using UnityEngine;
    using Zenject;

    /// <summary>
    /// ゲームAPIリポジトリクラス。
    /// </summary>
    public class GameRepository
    {
        #region 内部変数

        /// <summary>
        /// HTTP APIクライアント。
        /// </summary>
        [Inject]
        private AppWebRequest webRequest = null;

        /// <summary>
        /// WebSocket/JSON-RPC2 APIクライアント。
        /// </summary>
        [Inject]
        private AppWsRpcRequest wsRequest = null;

        #endregion

        #region API呼び出しメソッド

        /// <summary>
        /// 現在のゲーム状態を取得する。
        /// </summary>
        /// <param name="dungeonId">ダンジョンID。</param>
        /// <returns>ゲーム情報。</returns>
        public async Task<GetStatusResult> GetStatus()
        {
            var json = await this.webRequest.Get("api/game/status");
            return JsonUtility.FromJson<GetStatusResult>(json);
        }

        /// <summary>
        /// 新しいゲームを開始する。
        /// </summary>
        /// <param name="pcId">プレイヤーキャラクターID。</param>
        /// <param name="dungeonId">ダンジョンID。</param>
        /// <returns>フロアサーバーURL。</returns>
        public async Task<string> Start(int pcId, int dungeonId)
        {
            return await this.webRequest.Post("api/game/start", new Dictionary<string, object>()
            {
                { "pcId", pcId },
                { "dungeonId", dungeonId },
            });
        }

        /// <summary>
        /// フロアサーバーに接続する。
        /// </summary>
        /// <param name="url">接続先URL。</param>
        /// <param name="playerId">プレイヤーID。</param>
        /// <param name="token">端末トークン。</param>
        /// <returns>処理状態。</returns>
        public async Task Connect(string url, int playerId, string token)
        {
            await this.wsRequest.Connect(url, playerId, token);
        }

        /// <summary>
        /// PCをゲーム内に出現させる。
        /// </summary>
        /// <returns>処理状態。</returns>
        public async Task Activate()
        {
            await this.wsRequest.Call("activate");
        }

        /// <summary>
        /// 現在いるフロアの情報を取得する。
        /// </summary>
        /// <returns>フロア情報。</returns>
        public async Task<GetFloorResult> GetFloor()
        {
            return await this.wsRequest.Call<GetFloorResult>("getFloor");
        }

        #endregion

        #region 内部クラス

        /// <summary>
        /// /api/game/status API戻り値パラメータ。
        /// </summary>
        [Serializable]
        public class GetStatusResult
        {
            public int playerLevel;
            public int dungeonId;
            public int floorNo;
            public string url;
        }

        /// <summary>
        /// /ws/getFloor API戻り値パラメータ。
        /// </summary>
        [Serializable]
        public class GetFloorResult
        {
            public int dungeonId;
	        public int no;
	        public string map;
        }

        #endregion
    }
}