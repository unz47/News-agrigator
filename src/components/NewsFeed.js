'use client';
import { useState } from 'react';

function extractDomain(url) {
  try { return new URL(url).hostname.replace('www.', ''); } catch { return url; }
}

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  const days = ['日', '月', '火', '水', '木', '金', '土'];
  return `${d.getMonth() + 1}月${d.getDate()}日（${days[d.getDay()]}）`;
}

const ChevronLeft = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
);

const ChevronRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
);

const ArrowUpRight = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 17 17 7" /><path d="M7 7h10v10" /></svg>
);

export default function NewsFeed({ data: { dates, data, categories } }) {
  const [dateIndex, setDateIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('all');

  const currentDate = dates[dateIndex] || null;
  const currentNews = currentDate ? data[currentDate] : [];

  const filtered = (activeTab === 'all'
    ? currentNews
    : currentNews.filter((c) => c.id === activeTab)
  ).filter((c) => c.articles.length > 0);

  const prevDate = () => setDateIndex((i) => Math.min(i + 1, dates.length - 1));
  const nextDate = () => setDateIndex((i) => Math.max(i - 1, 0));

  return (
    <>
      <header className="masthead">
        <div className="masthead-inner">
          <h1 className="wordmark">Daily News<span className="wordmark-mark" aria-hidden="true">_</span></h1>
          <span className="masthead-meta">UPDATED 08:00 JST</span>
        </div>
      </header>
      <div className="app">
      <div className="toolbar">
        <div className="toolbar-row">
          <span className="date-label">{currentDate ? formatDate(currentDate) : '—'}</span>
          <div className="date-nav" role="group" aria-label="日付の移動">
            <button className="nav-btn" onClick={prevDate} disabled={dateIndex >= dates.length - 1} aria-label="前の日"><ChevronLeft /></button>
            <button className="nav-btn" onClick={nextDate} disabled={dateIndex <= 0} aria-label="次の日"><ChevronRight /></button>
          </div>
        </div>
        <nav className="tabs" aria-label="カテゴリ">
          <button className={`tab ${activeTab === 'all' ? 'active' : ''}`} onClick={() => setActiveTab('all')} aria-pressed={activeTab === 'all'}>すべて</button>
          {categories.map((c) => (
            <button key={c.id} className={`tab ${activeTab === c.id ? 'active' : ''}`} onClick={() => setActiveTab(c.id)} aria-pressed={activeTab === c.id}>
              <span className="tab-chip" style={{ background: c.color }} aria-hidden="true" />{c.label}
            </button>
          ))}
        </nav>
      </div>

      <main className="feed">
        {filtered.map((cat) => (
          <section key={cat.id} className="cat">
            <header className="cat-head">
              <span className="cat-chip" style={{ background: cat.color }} aria-hidden="true" />
              <h2 className="cat-name">{cat.label}</h2>
              <span className="cat-count">{cat.articles.length}件</span>
              <span className="cat-rule" aria-hidden="true" />
            </header>
            <ul className="articles">
              {cat.articles.map((article, i) => (
                <li key={i}>
                  <a className="article" href={article.url} target="_blank" rel="noopener noreferrer">
                    <h3 className="article-title">{article.title}</h3>
                    <p className="article-summary">{article.summary}</p>
                    <span className="article-meta">{extractDomain(article.url)}<ArrowUpRight /></span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ))}
        {filtered.length === 0 && <div className="empty">この日のニュースはありません</div>}
      </main>

      <footer className="colophon">
        <span className="colophon-wordmark">Daily News<span className="wordmark-mark" aria-hidden="true">_</span></span>
        <span className="colophon-note">毎朝 Claude Code が自動収集 — 30日分を保持</span>
      </footer>
      </div>
    </>
  );
}
