# ローグ風オンラインゲーム
WebSocketを使ったオンラインゲームのネットワークやDB周りの練習用に作成したローグライクゲーム（予定）。

## 機能
* （目標）ローグ風のリアルタイムRPG
    * （実装中）WebSocketを使った双方向通信、位置や行動の共有など
* （目標）複数人が同一マップにアクセス可
    * （実装中）参加中のマップの管理、マップ移動時の参加／離脱など

※ ネットワークやDB周りは気合入れていますが、画面は現状何もありません…。

## 環境
* CentOS 7
* Node.js v10.x
* MySQL 8.x
* Redis 3.x
* nginx 1.12.x
* Nest 6.x
    * Sequelize 4.x
    * Sequelize-typescript 0.6.x
    * Node-config 2.x
    * Log4js 3.x
* Angular 6.x

### 動作確認ブラウザ
* &gt;= Google Chrome Ver69.0.3497.100

### 開発環境
* Vagrant 2.1.x - 仮想環境管理
    * VirtualBox 5.2.x - 仮想環境
    * vagrant-vbguest - Vagrantプラグイン
* Visual Studio Code - アプリ開発用エディター
* MySQL Workbench 6.x - DB管理・EL図作成用ツール
* Unity 2018.3.0 - インゲーム部分開発用

## フォルダ構成
* VMルートフォルダ
    * server - Node.js Webアプリサーバーソース
        * config - アプリ設定
    * web - Angular Webアプリクライアントソース
    * game - Unity インゲームアプリソース
    * ansible - Ansible関連ファイル

## VM環境構築手順
1. Vagrantをインストールした後、ファイル一式をVMのフォルダとする場所に展開。
2. 初回の `vagrant up` でVM環境を構築（DB構築やWebアプリの初回ビルド等も自動実行）。

※ 初回の `vagrant up` はVMイメージダウンロード等で1時間以上かかる場合があります。また `yarn install` 等で一時的にエラーが発生する場合は、もう一度 `vagrant provision` 等で展開してください。  
※ 2018年8月現在、npmコマンドにはvagrant共有フォルダでのインストールが失敗する[不具合](https://github.com/npm/npm/issues/20605)があります。`npm install` の代わりに `yarn install` を使用してください。

### 起動方法
アプリはVM起動時に自動的に立ち上がります。

デフォルトのVMでは http://[DHCPで振られたIP]/ または http://localhost/ でアクセス可能です。

※ Microsoft EdgeだとプライベートIP（前者）はアクセスできない場合あり。  
※ 自動的に立ち上がらない場合は、後述のサーバーコマンドで起動してください。

## サーバーコマンド
Webアプリの操作用に、以下のようなサーバーコマンドを用意しています。
アプリのビルドや再起動などを行う場合は、VMにログインして `server`, `web` ディレクトリでコマンドを実行してください。

* `server`
    * `npm start` - Webアプリの起動
        * `npm run production` Webアプリの起動（運用モード）
    * `npm restart` - Webアプリの再起動
    * `npm stop` - Webアプリの停止
* `server/web`共通
    * `npm run build` - Webアプリのビルド
    * `npm run watch` - Webアプリのビルド（ファイル更新監視）
    * `npm run doc` - WebアプリのAPIドキュメント生成
    * `npm test` - Webアプリのユニットテスト実行
    * `npm run lint` - Webアプリの静的解析ツールの実行
    * `npm run clean` - 全ビルド生成物の削除

いずれのソースもビルドが必要です。またサーバーアプリのソース変更を反映するためには、Webアプリの再起動が必要です。

## その他
各種ログは `/var/log/local/rouge-like-mmo` 下に出力されます。
アクセスログ、デバッグログ、エラーログを出力します。

VMのDBを参照する場合は、MySQL Workbench等でMySQLの標準ポートに接続してください（接続情報は `default.yaml` 参照）。

また開発環境ではSwaggerのAPIデバッグページがあります。 http://localhost/swagger/ でアクセス可能です。

## ライセンス
[MIT](https://github.com/ktanakaj/rouge-like-mmo/blob/master/LICENSE)

※ ただし `game/Assets/Plugins` 以下のライブラリについては、各ライブラリごとのライセンスが適用されます（[zenject](https://assetstore.unity.com/packages/tools/integration/zenject-dependency-injection-ioc-17758), [UniRx](https://assetstore.unity.com/packages/tools/integration/unirx-reactive-extensions-for-unity-17276), [websocket-sharp](https://github.com/sta/websocket-sharp), [MiniJSON](https://gist.github.com/darktable/1411710)いずれもMITライセンス）。
