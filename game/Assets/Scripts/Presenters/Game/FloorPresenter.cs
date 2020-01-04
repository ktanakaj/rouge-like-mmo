// ================================================================================================
// <summary>
//      ゲーム画面フロアプレゼンターソース</summary>
//
// <copyright file="FloorPresenter.cs">
//      Copyright (C) 2018 Koichi Tanaka. All rights reserved.</copyright>
// <author>
//      Koichi Tanaka</author>
// ================================================================================================

namespace Honememo.RougeLikeMmo.Presenters.Game
{
    using UnityEngine;
    using UnityEngine.UI;
    using UniRx;
    using Zenject;
    using Honememo.RougeLikeMmo.Entities;
    using Honememo.RougeLikeMmo.UseCases;

    /// <summary>
    /// ゲーム画面フロアプレゼンタークラス。
    /// </summary>
    public class FloorPresenter : MonoBehaviour
    {
        #region Inspector用変数

        /// <summary>
        /// フロアの壁のプレハブ。
        /// </summary>
        public GameObject WallPrefab;

        #endregion

        #region 内部変数

        /// <summary>
        /// グローバルデータ。
        /// </summary>
        [Inject]
        private Global global = null;

        /// <summary>
        /// ゲーム情報読み込みユースケース。
        /// </summary>
        [Inject]
        private ConnectGameUseCase useCase = null;

        #endregion

        #region イベントメソッド

        /// <summary>
        /// フロアの生成。
        /// </summary>
        public void Start()
        {
            // TODO: 未実装
            this.useCase.Subscribe(_ => {
                // TODO: 座標と現在の表示をリセット
                this.CreateFloor();
            });
        }

        #endregion

        #region 内部メソッド

        private void CreateFloor()
        {
            // フロアデータに従い、壁を配置
            var map = this.global.FloorEntity.Map;
            for (int y = 0; y < map.Length; y++)
            {
                for (int x = 0; x < map[y].Length; x++)
                {
                    switch (map[y][x])
                    {
                        case '.':
                        case '#':
                            // 部屋の床 or 廊下の床
                            this.CreateWall(map, x, y);
                            break;
                        default:
                            // 処理対象外
                            break;
                    }
                }
            }
        }

        private void CreateWall(char[][] map, int x, int y)
        {

        }

        #endregion
    }
}