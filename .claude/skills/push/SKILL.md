---
name: push
description: 変更をコミットしてpushする
disable-model-invocation: true
allowed-tools: Bash(git *)
---

# Git Commit and Push

変更をコミットしてリモートにpushする。

## 手順

1. `git status` と `git diff` で変更内容を確認
2. 変更ファイルをステージング
3. "$ARGUMENTS" がある場合はそれをコミットメッセージとして使用。なければ変更内容から適切なメッセージを生成
4. コミットメッセージの末尾に `Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>` を付与
5. `git push` でリモートにpush
6. 完了後、コミットハッシュとステータスを表示
