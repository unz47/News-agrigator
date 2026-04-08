# Daily News Collector

## プロジェクト概要
毎朝ニュースをWeb検索で収集し、JSONファイルとして保存。Next.js SSGでビルドしてS3に静的サイトとしてデプロイする。

## 重要な制約
- **絶対に新しいブランチを作成しない。必ず `main` ブランチで作業すること。**
- AWS CLIが必要な操作は `bash scripts/deploy.sh` で実行すること
- deploy.sh のスキップは禁止。必ず実行すること。

## タスク: collect-news

以下の手順を順番に実行する。

### Step 1: mainブランチを最新化

**新しいブランチを作成してはいけない。**

```bash
git checkout main || git switch main
git pull origin main --rebase
```

### Step 2: Web検索でニュース収集

以下の3カテゴリについて、Web検索で**本日の日本語ニュース**を各3〜5件収集する。

**カテゴリ別の検索クエリ:**
- フロントエンド: "Angular OR TypeScript OR React OR Next.js OR CSS OR Web標準 最新ニュース"
- AI・LLM: "AI OR LLM OR 生成AI OR Claude OR GPT OR Gemini 最新ニュース"
- 一般: "日本 世界 主要ニュース 今日"

**収集ルール:**
- 昨日以前の古いニュースは除外
- 要約は2〜3文の日本語で、ポイントが伝わるように書く
- URLは検索結果から取得した実在URLのみ使用（推測で生成しない）

### Step 3: JSONファイルに保存

収集したニュースを `data/{category}/YYYY-MM-DD.json` に保存する。

| カテゴリ | ディレクトリ |
|---|---|
| 一般 | `data/general/` |
| AI・LLM | `data/ai/` |
| フロントエンド | `data/frontend/` |

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

### Step 4: ビルド & S3デプロイ

**このステップは必ず実行すること。スキップ禁止。**

```bash
bash scripts/deploy.sh
```

### Step 5: Git commit & push to main

**main ブランチに直接 push する。別ブランチを作らない。**

```bash
git add .
git commit -m "📰 YYYY-MM-DD ニュース収集"
git push origin main
```
