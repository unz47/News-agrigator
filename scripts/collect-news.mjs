#!/usr/bin/env node
/**
 * ニュース収集スクリプト（Claude Code 経由で実行）
 *
 * 使い方:
 *   ターミナルから直接:
 *     claude -p "CLAUDE.md の collect-news タスクを実行して。今日のニュースを3カテゴリ各5件収集して data/ にJSONで保存し、git commit & push して。"
 *
 *   crontab で毎朝自動実行:
 *     crontab -e で以下を追加:
 *     0 7 * * * cd /path/to/daily-news-collector && claude -p "CLAUDE.md の collect-news タスクを実行して" --allowedTools bash,web_search 2>&1 >> /tmp/news-collector.log
 *
 * このファイル自体はClaude Codeへの指示書であり、
 * Node.jsで直接実行するものではありません。
 */

console.log(`
=== Daily News Collector ===

このスクリプトは Claude Code 経由で実行します。

  claude -p "CLAUDE.md の collect-news タスクを実行して"

crontab 設定例:
  0 7 * * * cd ${process.cwd()} && claude -p "CLAUDE.md の collect-news タスクを実行して" --allowedTools bash,web_search

詳細は CLAUDE.md を参照してください。
`);
