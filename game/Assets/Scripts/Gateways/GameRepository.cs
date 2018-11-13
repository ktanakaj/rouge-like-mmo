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
        private AppWsRpcRequest wsRequest;

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

            return JsonUtility.FromJson<StartResult>(json);
        }

        /// <summary>
        /// WebSocketサーバーに接続する。
        /// </summary>
        /// <param name="playerId">プレイヤーID。</param>
        /// <param name="token">端末トークン。</param>
        /// <param name="address">サーバーアドレス。</param>
        /// <param name="port">サーバーポート。</param>
        /// <returns>処理状態。</returns>
        public async Task Connect(int playerId, string token, string address, int port)
        {
            await this.wsRequest.Connect("ws://" + address + ":" + port + "/ws/", playerId, token);
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
            // FIXME: URLを返すようにする（自由度が高くなるので）
            public string server;
            public int port;
        }

        #endregion
    }
}