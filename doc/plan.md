# casual-no-code-service

## 技術選定

- フロントエンド
  - 言語
    - TypeScript
  - フレームワーク
    - React
- バックエンド
  - 言語
    - Go
  - フレームワーク
    - Echo
- データベース
  - 必要になったら考える。

- ドキュメント
  - Markdown + Mermaid
    - VSCode 拡張機能使う
      - https://marketplace.visualstudio.com/items?itemName=shd101wyy.markdown-preview-enhanced

- レポジトリ管理
  - GitHub

- サーバー
  - AWS

## 流れ

1. 環境構築
    - GitHubアカウント
      - 各個人で登録して、discordに載せておく。
    - 開発環境(WSL)
    - フレームワークの環境構築
1. Reactを使ってチュートリアル
    - https://ja.reactjs.org/tutorial/tutorial.html
1. 設計
    - 全体的な設計
    - データ管理のフォーマット
      - Json?
1. 実装
    1. ログイン画面
        1. DB(MariaDB)をAWS上で構築
        1. Reactでログインページ作る  
        1. サーバ側でPOSTリクエストに対してログイン処理
 