import { getLatestNews, getAllDates } from '@/lib/data';

function extractDomain(url) {
  try {
    return new URL(url).hostname.replace('www.', '');
  } catch {
    return url;
  }
}

export default function Home() {
  const categories = getLatestNews();
  const dates = getAllDates();
  const latestDate = dates[0] || 'N/A';

  return (
    <div className="container">
      <header className="header">
        <h1>Daily News</h1>
        <span className="date">{latestDate}</span>
      </header>

      {dates.length > 1 && (
        <nav className="date-nav">
          {dates.slice(0, 14).map((d) => (
            <span key={d} className={`date-chip ${d === latestDate ? 'active' : ''}`}>
              {d}
            </span>
          ))}
        </nav>
      )}

      {categories.map((cat) => (
        <section key={cat.id} className="category-section">
          <div className="category-header">
            <span className="category-dot" style={{ background: cat.color }} />
            <h2>{cat.label}</h2>
            <span className="count">{cat.articles.length} articles</span>
          </div>

          {cat.articles.length > 0 ? (
            <div className="articles">
              {cat.articles.map((article, i) => (
                <a
                  key={i}
                  className="article"
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="article-title">{article.title}</div>
                  <div className="article-summary">{article.summary}</div>
                  <div className="article-meta">
                    <span className="article-source">{extractDomain(article.url)}</span>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <div className="empty">まだニュースがありません</div>
          )}
        </section>
      ))}

      <footer className="footer">
        <p>Collected by Claude Code · Powered by Next.js SSG + Vercel</p>
      </footer>
    </div>
  );
}
