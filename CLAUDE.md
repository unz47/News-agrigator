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

以下の5カテゴリについて、**公式サイトの巡回 + Web検索**で本日のニュースを各3〜5件収集する。

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
- Claude Release Notes: https://support.claude.com/en/articles/12138966-release-notes
- OpenAI News: https://openai.com/news/
- OpenAI API Changelog: https://developers.openai.com/api/docs/changelog

AI論文:
- Hugging Face Daily Papers: https://huggingface.co/papers
- arXiv cs.AI 新着: https://arxiv.org/list/cs.AI/recent
- arXiv cs.CL 新着: https://arxiv.org/list/cs.CL/recent
- arXiv cs.LG 新着: https://arxiv.org/list/cs.LG/recent
- arXiv cs.CV 新着: https://arxiv.org/list/cs.CV/recent
- Google Research Blog: https://research.google/blog/
- Google DeepMind Blog: https://deepmind.google/discover/blog/
- Anthropic Research: https://www.anthropic.com/research
- Meta AI Blog: https://ai.meta.com/blog/

全部を毎回読み込む必要はないが、できるだけ多くの公式ソースを巡回し、新着があればニュースとして採用する。

**カテゴリ別の検索クエリ(公式巡回の補完としてWeb検索も行う):**
- フロントエンド: "Angular OR TypeScript OR React OR Next.js OR CSS OR Web標準 最新ニュース"（フレームワークやライブラリのリリース・アップデート情報、CSSの新機能・ブラウザ実装状況も含める）
- AI・LLM: "AI OR LLM OR 生成AI OR Claude OR GPT OR Gemini 最新ニュース"
- 開発ツール: "Kiro OR Claude Code OR Cursor OR GitHub Copilot OR VS Code OR AI IDE アップデート OR リリース 最新情報"（開発ツール・AI IDEのアップデート/リリース情報を優先）
- AI論文: "arXiv LLM paper" "new AI research paper" "AI 論文 話題"（注目論文・研究機関の発表。AI・LLMカテゴリが製品/企業ニュースなのに対し、こちらは論文・研究成果に限定する）
- 一般: "日本 世界 主要ニュース 今日"

**AI論文カテゴリの採用ルール:**
- 対象は論文（arXiv・学会採択論文）と研究機関による研究発表。製品リリースや企業ニュースはAI・LLMカテゴリに入れ、重複させない
- 投稿・公開から1週間以内で、まだ収集していない論文なら可
- 優先順位: Hugging Face Daily Papers で上位の論文、主要研究機関（Google/DeepMind/Anthropic/OpenAI/Meta/大学等）の論文、SNSや技術メディアで話題の論文
- `title` は論文タイトル（英語のまま可）
- **AI論文カテゴリは文字数制限なし**（他カテゴリの「要約は2〜3文」ルールは適用しない）。内容に応じて必要なだけ書いてよい
- `summary`: 日本語で「何を提案したか・何が新しいか・主な結果」を書く。専門用語はそのまま使ってよい
- `explanation`（AI論文カテゴリのみ必須）: 専門知識がない人でも読めるように噛み砕いた日本語の解説。以下を意識する
  - 「どんな問題を解こうとしているか」「なぜそれが難しい／大事なのか」「どうやって解いたか」「結果、何ができるようになったか」の流れで書く
  - 専門用語は初出時に一言で言い換える（例: 「蒸留（大きいモデルの知識を小さいモデルに移す手法）」）
  - 身近なたとえを1つ以上入れる
  - 段落の区切りは `\n\n` を使う
- `url` は arXiv の abs ページ（https://arxiv.org/abs/XXXX.XXXXX）を優先し、なければ論文または研究ブログの公式URLを使う

**収集ルール:**
- 昨日以前の古いニュースは除外。ただし公式サイトのリリース/アップデート情報は、まだ収集していないものなら直近1週間以内まで可
- 英語ソース(公式ブログ等)は日本語で要約する
- 要約は2〜3文の日本語で、ポイントが伝わるように書く（AI論文カテゴリは例外で文字数制限なし。上記「AI論文カテゴリの採用ルール」に従う）
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
| AI論文 | `data/papers/` |

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

AI論文カテゴリ（`data/papers/`）のみ、各記事に `explanation` フィールドを追加する:
```json
{
  "title": "論文タイトル",
  "summary": "日本語の要約（文字数制限なし）",
  "explanation": "噛み砕いた解説（文字数制限なし、段落は\\n\\nで区切る）",
  "url": "https://arxiv.org/abs/XXXX.XXXXX",
  "collectedAt": "ISO 8601 タイムスタンプ"
}
```

### Step 4: 30日より古いデータを削除

保持期間は30日。ファイル名の日付が30日前より古いJSONを削除する(サイトから該当日付のページが消えるだけで、git履歴には残る)。

```bash
cutoff=$(date -v-30d +%Y-%m-%d)
for f in data/*/*.json; do
  d=$(basename "$f" .json)
  [[ "$d" < "$cutoff" ]] && rm "$f"
done
```

### Step 5: Git commit & push to main

**main ブランチに直接 push する。別ブランチを作らない。**

```bash
git add .
git commit -m "📰 YYYY-MM-DD ニュース収集"
git push origin main
```
