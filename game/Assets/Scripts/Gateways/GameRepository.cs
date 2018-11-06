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
        /// APIクライアント。
        /// </summary>
        [Inject]
        private AppWebRequest request;

        #endregion

        #region API呼び出しメソッド

        /// <summary>
        /// 現在のゲーム状態を取得する。
        /// </summary>
        /// <param name="dungeonId">ダンジョンID。</param>
        /// <returns>ゲーム情報。</returns>
        public async Task<GetStatusResult> GetStatus()
        {
            var json = await this.request.Get("api/game/status");
            return JsonUtility.FromJson<GetStatusResult>(json);
        }

        /// <summary>
        /// 新しいゲームを開始する。
        /// </summary>
        /// <param name="dungeonId">ダンジョンID。</param>
        /// <returns>ゲーム情報。</returns>
        public async Task<StartResult> Start(int dungeonId)
        {
            var json = await this.request.Post("api/game/start", JsonUtility.ToJson(new StartParam { dungeonId = dungeonId }));
            return JsonUtility.FromJson<StartResult>(json);
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
        /// /api/game/start API引数パラメータ。
        /// </summary>
        [Serializable]
        public class StartParam
        {
            public int dungeonId;
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