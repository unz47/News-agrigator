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

export default function NewsFeed({ data: { dates, data, categories } }) {
  const [dateIndex, setDateIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('all');

  const currentDate = dates[dateIndex] || null;
  const currentNews = currentDate ? data[currentDate] : [];

  const filtered = activeTab === 'all'
    ? currentNews
    : currentNews.filter((c) => c.id === activeTab);

  const prevDate = () => setDateIndex((i) => Math.min(i + 1, dates.length - 1));
  const nextDate = () => setDateIndex((i) => Math.max(i - 1, 0));

  return (
    <div className="screen">
      {/* Header */}
      <header className="header">
        <div className="header-top">
          <h1 className="title">Daily News</h1>
          <button className="icon-btn" aria-label="検索">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </button>
        </div>
        <div className="header-row">
          <div className="date-nav">
            <button className="nav-arrow" onClick={prevDate} disabled={dateIndex >= dates.length - 1} aria-label="前の日">‹</button>
            <span className="date-label">{currentDate ? formatDate(currentDate) : '—'}</span>
            <button className="nav-arrow" onClick={nextDate} disabled={dateIndex <= 0} aria-label="次の日">›</button>
          </div>
          <div className="update-badge"><span className="update-dot" />08:00 更新</div>
        </div>
      </header>

      {/* Tabs */}
      <div className="tabs-wrap">
        <div className="tabs">
          <button className={`tab ${activeTab === 'all' ? 'active' : ''}`} onClick={() => setActiveTab('all')}>すべて</button>
          {categories.map((c) => (
            <button key={c.id} className={`tab ${activeTab === c.id ? 'active' : ''}`} onClick={() => setActiveTab(c.id)}>
              <span className="tab-dot" style={{ background: c.color }} />{c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <main className="content">
        {filtered.map((cat) => (
          <section key={cat.id}>
            <div className="cat-header">
              <div className="cat-left"><span className="cat-dot" style={{ background: cat.color }} /><span className="cat-name">{cat.label}</span></div>
              <span className="cat-count" style={{ background: cat.color + '18', color: cat.color }}>{cat.articles.length}件</span>
            </div>
            {cat.articles.map((article, i) => (
              <a key={i} className={`card ${i === 0 && activeTab === 'all' && cat === filtered[0] ? 'hero' : ''}`} href={article.url} target="_blank" rel="noopener noreferrer">
                <div className="card-title">{article.title}</div>
                <div className="card-summary">{article.summary}</div>
                <div className="card-bottom">
                  <span className="card-source">{extractDomain(article.url)}</span>
                  <div className="card-actions">
                    <span className="action-btn" aria-label="ブックマーク">☆</span>
                    <span className="action-btn" aria-label="シェア">↗</span>
                  </div>
                </div>
              </a>
            ))}
          </section>
        ))}
        {filtered.length === 0 && <div className="empty">ニュースがありません</div>}
      </main>

      {/* Bottom Tab Bar */}
      <nav className="bottom-bar">
        <div className="bottom-pill">
          <div className="bottom-tab active">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8"/><path d="M15 18h-5"/><path d="M10 6h8v4h-8V6Z"/></svg>
            <span>NEWS</span>
          </div>
          <div className="bottom-tab">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
            <span>SAVED</span>
          </div>
          <div className="bottom-tab">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
            <span>SETTINGS</span>
          </div>
        </div>
      </nav>
    </div>
  );
}
