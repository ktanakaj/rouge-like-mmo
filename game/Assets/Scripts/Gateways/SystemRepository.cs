// ================================================================================================
// <summary>
//      システムAPIリポジトリソース</summary>
//
// <copyright file="SystemRepository.cs">
//      Copyright (C) 2018 Koichi Tanaka. All rights reserved.</copyright>
// <author>
//      Koichi Tanaka</author>
// ================================================================================================

namespace Honememo.RougeLikeMmo.Gateways
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using Codeplex.Data;
    using UniRx;
    using UnityEngine;
    using Zenject;

    /// <summary>
    /// システムAPIリポジトリクラス。
    /// </summary>
    public class SystemRepository
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
        /// 環境情報を取得する。
        /// </summary>
        /// <returns>環境情報。</returns>
        public async Task<dynamic> GetEnv()
        {
            var json = await this.request.Get("api/env");
            return JsonUtility.FromJson<GetEnvResult>(json);
        }

        /// <summary>
        /// 最新マスタの一覧を取得する。
        /// </summary>
        /// <returns>マスタ名一覧。</returns>
        public async Task<IList<string>> FindLatestMasters()
        {
            var result = await this.request.Get("api/masters");
            return ((object[])DynamicJson.Parse(result)).Cast<string>().ToList();
        }

        /// <summary>
        /// 指定されたマスタを取得する。
        /// </summary>
        /// <typeparam name="T">マスタ型。</typeparam>
        /// <param name="name">マスタ名。</param>
        /// <returns>マスタ一覧。</returns>
        public async Task<T[]> FindLatestMaster<T>(string name)
        {
            var result = await this.request.Get("api/masters/" + name);
            // FIXME: 頑張ってキャストする
            dynamic json = DynamicJson.Parse(result);
            Debug.Log(json);
            return null;
        }

        #endregion

        #region 内部クラス

        /// <summary>
        /// /api/env API戻り値パラメータ。
        /// </summary>
        [Serializable]
        public class GetEnvResult
        {
            public string serverVersion;
            public long serverTime;
            public string minimumAppVersion;
            public int latestMasterVersion;
        }

        #endregion
    }
}