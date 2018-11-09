// ================================================================================================
// <summary>
//      端末リセットユースケースソース</summary>
//
// <copyright file="ResetPlayerUseCase.cs">
//      Copyright (C) 2018 Koichi Tanaka. All rights reserved.</copyright>
// <author>
//      Koichi Tanaka</author>
// ================================================================================================

namespace Honememo.RougeLikeMmo.UseCases
{
    using Zenject;
    using Honememo.RougeLikeMmo.Gateways;

    /// <summary>
    /// 端末リセットユースケースクラス。
    /// </summary>
    public class ResetPlayerUseCase
    {
        #region 内部変数

        /// <summary>
        /// ローカルリポジトリ。
        /// </summary>
        [Inject]
        private LocalRepository localRepository;

        #endregion

        #region 公開メソッド

        /// <summary>
        /// 端末のリセットを行う。
        /// </summary>
        /// <remarks>
        /// 端末のトークン情報などを削除するのみ。
        /// メモリ上のプレイヤー情報などはそのままのため、
        /// 認証前に行うか、アプリを再起動させてください。
        /// </remarks>
        public void Reset()
        {
            this.localRepository.Reset();
        }

        #endregion
   }
}