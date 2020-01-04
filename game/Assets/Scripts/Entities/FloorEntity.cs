// ================================================================================================
// <summary>
//      フロアエンティティソース</summary>
//
// <copyright file="FloorEntity.cs">
//      Copyright (C) 2018 Koichi Tanaka. All rights reserved.</copyright>
// <author>
//      Koichi Tanaka</author>
// ================================================================================================

namespace Honememo.RougeLikeMmo.Entities
{
    using System.Collections.Generic;

    /// <summary>
    /// フロアエンティティクラス。
    /// </summary>
    /// <remarks>ダンジョンの1フロアの情報を扱う。</remarks>
    public class FloorEntity
    {
        #region 公開プロパティ

        /// <summary>
        /// マップデータ。
        /// </summary>
        /// <remarks>現状は『ローグ』と同じ形式のテキストデータ。</remarks>
        public char[][] Map { get; set; }

        /// <summary>
        /// フロアに滞在するPCやモンスターなど。
        /// </summary>
        public IDictionary<string, FloorUnit> Units { get; set; }

        #endregion

        #region 公開メソッド

        /// <summary>
        /// 『ローグ』形式のテキストデータを文字の2次元配列で保存する。
        /// </summary>
        /// <param name="map">テキストデータ。</param>
        public void SetMapFromString(string map)
        {
            var newMap = new List<char[]>();
            var lines = map.Split('\n');
            for (int y = 0; y < lines.Length; y++)
            {
                var newLine = new List<char>();
                for (int x = 0; x < lines[y].Length; x++)
                {
                    newLine.Add(lines[y][x]);
                }

                newMap.Add(newLine.ToArray());
            }

            this.Map = newMap.ToArray();
        }

        #endregion
    }
}