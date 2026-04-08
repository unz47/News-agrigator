# 📰 Daily News Collector

Claude Code + Next.js SSG で構築するゼロコスト自動ニュース収集ダッシュボード。

## アーキテクチャ

```
crontab (毎朝 7:00)
  → Claude Code がニュースを Web検索で収集
  → data/{category}/YYYY-MM-DD.json に保存
  → git commit & push
  → Vercel が自動ビルド & デプロイ（SSG）
```

**コスト: ¥0**（Claude Max プランの枠 + Vercel 無料枠）

## カテゴリ

| カテゴリ | ディレクトリ | 内容 |
|---------|-------------|------|
| 📰 一般 | `data/general/` | 政治・経済・社会・国際 |
| 🤖 AI・LLM | `data/ai/` | AI・LLM関連の技術ニュース |
| 💻 フロントエンド | `data/frontend/` | React, Angular, Vue, TypeScript 等 |

## セットアップ

### 1. リポジトリをクローン & 依存インストール
```bash
git clone https://github.com/YOUR_USER/daily-news-collector.git
cd daily-news-collector
npm install
```

### 2. ローカルで確認
```bash
npm run dev
# http://localhost:3000 で確認
```

### 3. Vercel にデプロイ
```bash
npx vercel
```

### 4. crontab に登録（毎朝自動収集）
```bash
crontab -e
# 以下を追加:
0 7 * * * cd /path/to/daily-news-collector && claude -p "CLAUDE.md の collect-news タスクを実行して" --allowedTools bash,web_search 2>&1 >> /tmp/news-collector.log
```

### 5. 手動で収集（テスト用）
```bash
claude -p "CLAUDE.md の collect-news タスクを実行して"
```

## 技術スタック

- **収集**: Claude Code (Max プラン) + Web検索
- **データ**: JSONファイル（DB不要）
- **フロント**: Next.js 15 (App Router, SSG)
- **ホスティング**: Vercel (無料枠)
- **自動化**: crontab + Claude Code CLI
