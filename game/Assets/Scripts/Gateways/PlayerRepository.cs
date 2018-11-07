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
    using System.Threading.Tasks;
    using Codeplex.Data;
    using UniRx;
    using Zenject;

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
        public async Task<dynamic> Create(string token)
        {
            dynamic body = new DynamicJson();
            body.token = token;
            string json = body.ToString();
            var result = await this.request.Post("api/players", json);
            return DynamicJson.Parse(result);
        }

        /// <summary>
        /// プレイヤーを認証する。
        /// </summary>
        /// <param name="playerId">プレイヤーID。</param>
        /// <param name="token">端末トークン。</param>
        /// <returns>プレイヤー情報。</returns>
        public async Task<dynamic> Login(int playerId, string token)
        {
            dynamic body = new DynamicJson();
            body.id = playerId;
            body.token = token;
            string json = body.ToString();
            var result = await this.request.Post("api/players/login", json);
            return DynamicJson.Parse(result);
        }

        #endregion
    }
}