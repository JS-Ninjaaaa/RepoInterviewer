# RepoInterviewer/フロントエンド

React + TypeScript + Vite を用いたアプリです。VisualStudioCodeの拡張機能として動作します。

## 環境変数の設定

`env-sample.ts` をコピーして `env.sample` を作成しバックエンドのエンドポイントを記述してください。

## 起動方法

1. frontendディレクトリ（ターミナル）で以下のコマンドを実行するとwebviewディレクトリのTypeScriptのコードが拡張機能で扱えるJavaScript + HTMLにビルドされます。

```sh
  pnpm run build
```

ビルド成果物はfrontend/buildディレクトリで確認できます。


2. キーボードのF5を押してください。VSCodeの新しいウインドウが開くので，任意のプロジェクトを開いてください。


3. 画面下部のステータスバーに表示される「RepoInterviewer」のアイコンを押して拡張機能を起動します。コマンドパレットで「repointerviewer.start」と入力して起動させることも可能です。
