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
    using System.Threading.Tasks;
    using Codeplex.Data;
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
            dynamic body = new DynamicJson();
            body.pcId = pcId;
            body.dungeonId = dungeonId;
            string json = body.ToString();
            var result = await this.webRequest.Post("api/game/start", json);
            return JsonUtility.FromJson<StartResult>(result);
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
        }

        #endregion
    }
}