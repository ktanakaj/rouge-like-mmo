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
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using Codeplex.Data;
    using UniRx;
    using UnityEngine;
    using Zenject;
    using Honememo.RougeLikeMmo.Entities;

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
        public async Task<EnvEntity> GetEnv()
        {
            var json = await this.request.Get("api/env");
            return JsonUtility.FromJson<EnvEntity>(json);
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
        public async Task<IList<T>> FindLatestMaster<T>(string name)
        {
            var result = await this.request.Get("api/masters/" + name);
            var records = (object[])DynamicJson.Parse(result);
            return records.Select((rec) => JsonUtility.FromJson<T>(rec.ToString())).ToList();
        }

        #endregion
    }
}