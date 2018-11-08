// ================================================================================================
// <summary>
//      Zenject初期化ソース</summary>
//
// <copyright file="DefaultInstaller.cs">
//      Copyright (C) 2018 Koichi Tanaka. All rights reserved.</copyright>
// <author>
//      Koichi Tanaka</author>
// ================================================================================================

namespace Honememo.RougeLikeMmo.Core
{
    using Zenject;
    using Honememo.RougeLikeMmo.Entities;
    using Honememo.RougeLikeMmo.Gateways;
    using Honememo.RougeLikeMmo.UseCases;

    /// <summary>
    /// Zenjectの初期設定クラス。
    /// </summary>
    public class DefaultInstaller : MonoInstaller
    {
        #region overrideメソッド

        /// <summary>
        /// Zenjectの依存関係を登録する。
        /// </summary>
        public override void InstallBindings()
        {
            Container.BindInterfacesAndSelfTo<ObservableSerialRunner>().AsSingle().NonLazy();
            Container.Bind<AppWebRequest>().AsSingle().NonLazy();
            Container.Bind<LocalRepository>().AsSingle().NonLazy();
            Container.Bind<SystemRepository>().AsSingle().NonLazy();
            Container.Bind<PlayerRepository>().AsSingle().NonLazy();
            Container.Bind<GameRepository>().AsSingle().NonLazy();
            Container.Bind<Global>().AsSingle().NonLazy();
            Container.Bind<InitializeUseCase>().AsSingle().NonLazy();
            Container.Bind<LoadHomeUseCase>().AsSingle().NonLazy();
            Container.Bind<CreatePcUseCase>().AsSingle().NonLazy();
            Container.Bind<StartGameUseCase>().AsSingle().NonLazy();
        }

        #endregion
    }
}