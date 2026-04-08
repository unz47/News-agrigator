# Daily News Collector

## プロジェクト概要
毎朝 Claude Code で実行して、3カテゴリのニュースを収集し、JSONファイルとして保存するプロジェクト。
Next.js SSG でビルドして Vercel にデプロイする。

## ニュース収集タスク

以下のコマンドで実行:
```
claude -p "collect-news タスクを実行して" --allowedTools bash,web_search
```

### 実行内容
1. 今日の日付で以下の3カテゴリのニュースを **各5件** Web検索で収集
2. 各カテゴリに対応するJSONファイルを `data/{category}/YYYY-MM-DD.json` に書き出し
3. `git add . && git commit -m "📰 YYYY-MM-DD ニュース収集" && git push`

### カテゴリ
- `general` : 一般ニュース（政治・経済・社会・国際）
- `ai` : AI・LLM関連ニュース
- `frontend` : フロントエンド開発ニュース（React, Angular, Vue, TypeScript, CSS, Web標準）

### JSONフォーマット
```json
{
  "date": "2026-04-08",
  "category": "general",
  "articles": [
    {
      "title": "記事タイトル",
      "summary": "2-3行の日本語要約",
      "url": "ソースURL",
      "collectedAt": "2026-04-08T07:00:00+09:00"
    }
  ]
}
```

## 技術スタック
- Next.js 15 (App Router, SSG with `output: 'export'`)
- React 19
- TypeScript は使用しない（軽量に保つ）
- Vercel でホスティング（無料枠）

## ディレクトリ構成
```
data/
  general/     # 一般ニュースJSON
  ai/          # AI・LLMニュースJSON
  frontend/    # フロントエンド開発ニュースJSON
scripts/
  collect-news.mjs   # Claude Code用の収集スクリプトテンプレート
src/app/             # Next.js App Router
```
