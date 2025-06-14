# RepoInterviewer/フロントエンド

React + TypeScript + Vite を用いたアプリです。VisualStudioCodeの拡張機能として動作します。

## 環境変数の設定

`env-sample.ts` をコピーして `env.ts` を作成しバックエンドのエンドポイントを記述してください。

## セットアップ手順

1. ターミナルのfrontendディレクトリで以下のコマンドを実行し，必要なパッケージをインストールします。

```sh
  pnpm install
```

2. ターミナルのfrontendディレクトリで以下のコマンドを実行するとwebviewディレクトリのTypeScriptのコードが拡張機能で扱えるJavaScript + HTMLにビルドされます。

```sh
  pnpm run build
```

ビルド成果物はfrontend/buildディレクトリで確認できます。

## 起動手順

1. エディターで`frontend\src\commands\src\extension.ts`を開いてください。

2. キーボードのF5を押してください。VSCodeの新しいウインドウが開くので，任意のプロジェクトを開いてください。コマンドパレットが開いた場合は，`VSCode Extension Development`を選択してください。

3. 画面下部のステータスバーに表示される「RepoInterviewer」のアイコンを押して拡張機能を起動します。コマンドパレットで「repointerviewer.start」と入力して起動させることも可能です。
