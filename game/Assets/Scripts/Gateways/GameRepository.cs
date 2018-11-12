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
        private AppWebRequest webRequest;

        /// <summary>
        /// WebSocket/JSON-RPC2 APIクライアント。
        /// </summary>
        [Inject]
        private AppWsRequest wsRequest;

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
        /// <returns>ゲーム情報。</returns>
        public async Task<StartResult> Start(int pcId, int dungeonId)
        {
            var json = await this.webRequest.Post("api/game/start", new Dictionary<string, object>()
            {
                { "pcId", pcId },
                { "dungeonId", dungeonId },
            });

            var result = JsonUtility.FromJson<StartResult>(json);

            // 接続先WebSocketの情報を詰める
            // FIXME: どこか別の場所に整理する
            this.wsRequest.Url = "ws://" + result.server + ":" + result.port + "/ws/";

            return result;
        }

        /// <summary>
        /// PCをゲーム内に出現させる。
        /// </summary>
        /// <returns>処理状態。</returns>
        public async Task Activate()
        {
            await this.wsRequest.Call("activate");
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
            public string server;
        }

        /// <summary>
        /// /api/game/start API戻り値パラメータ。
        /// </summary>
        [Serializable]
        public class StartResult
        {
            public string server;
            public int port;
        }

        #endregion
    }
}