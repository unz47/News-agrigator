# Daily News Collector

## プロジェクト概要
毎朝ニュースをWeb検索で収集し、JSONファイルとして保存。Next.js SSGでビルドしてS3に静的サイトとしてデプロイする。

## 重要な制約
- **絶対に新しいブランチを作成しない。必ず `main` ブランチで作業すること。**
- AWS CLIが必要な操作は GitHub Actions が自動実行するため、Claude Code 側では不要

## タスク: collect-news

以下の手順を順番に実行する。

### Step 1: mainブランチを最新化

**新しいブランチを作成してはいけない。**

```bash
git checkout main || git switch main
git pull origin main --rebase
```

### Step 2: Web検索でニュース収集

以下の4カテゴリについて、**公式サイトの巡回 + Web検索**で本日のニュースを各3〜5件収集する。

**公式サイト巡回(WebFetchで新着記事を確認する):**

フロントエンド:
- Angular Blog: https://blog.angular.dev/
- React Blog: https://react.dev/blog
- Next.js Blog: https://nextjs.org/blog
- TypeScript Blog: https://devblogs.microsoft.com/typescript/
- Chrome for Developers: https://developer.chrome.com/blog
- web.dev: https://web.dev/blog
- MDN Blog: https://developer.mozilla.org/en-US/blog/
- WebKit Blog (Safari): https://webkit.org/blog/
- CSS-Tricks: https://css-tricks.com/

開発ツール:
- Kiro Changelog: https://kiro.dev/changelog/
- Claude Code Changelog: https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md
- Cursor Changelog: https://cursor.com/changelog
- VS Code Updates: https://code.visualstudio.com/updates
- GitHub Changelog: https://github.blog/changelog/

AI・LLM:
- Anthropic News: https://www.anthropic.com/news
- OpenAI News: https://openai.com/news/

全部を毎回読み込む必要はないが、できるだけ多くの公式ソースを巡回し、新着があればニュースとして採用する。

**カテゴリ別の検索クエリ(公式巡回の補完としてWeb検索も行う):**
- フロントエンド: "Angular OR TypeScript OR React OR Next.js OR CSS OR Web標準 最新ニュース"（フレームワークやライブラリのリリース・アップデート情報、CSSの新機能・ブラウザ実装状況も含める）
- AI・LLM: "AI OR LLM OR 生成AI OR Claude OR GPT OR Gemini 最新ニュース"
- 開発ツール: "Kiro OR Claude Code OR Cursor OR GitHub Copilot OR VS Code OR AI IDE アップデート OR リリース 最新情報"（開発ツール・AI IDEのアップデート/リリース情報を優先）
- 一般: "日本 世界 主要ニュース 今日"

**収集ルール:**
- 昨日以前の古いニュースは除外。ただし公式サイトのリリース/アップデート情報は、まだ収集していないものなら直近1週間以内まで可
- 英語ソース(公式ブログ等)は日本語で要約する
- 要約は2〜3文の日本語で、ポイントが伝わるように書く
- URLは巡回・検索で実際に確認した実在URLのみ使用（推測で生成しない）
- 信頼性の低いソース(コンテンツファーム、プロパガンダ系ニュースサイト等)は使わない

### Step 3: JSONファイルに保存

収集したニュースを `data/{category}/YYYY-MM-DD.json` に保存する。

| カテゴリ | ディレクトリ |
|---|---|
| 一般 | `data/general/` |
| AI・LLM | `data/ai/` |
| フロントエンド | `data/frontend/` |
| 開発ツール | `data/tools/` |

**JSONフォーマット:**
```json
{
  "date": "YYYY-MM-DD",
  "category": "general",
  "articles": [
    {
      "title": "記事タイトル",
      "summary": "2-3文の日本語要約",
      "url": "ソースURL",
      "collectedAt": "ISO 8601 タイムスタンプ"
    }
  ]
}
```

### Step 4: Git commit & push to main

**main ブランチに直接 push する。別ブランチを作らない。**

```bash
git add .
git commit -m "📰 YYYY-MM-DD ニュース収集"
git push origin main
```
