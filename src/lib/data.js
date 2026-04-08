import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');

const CATEGORIES = [
  { id: 'general', label: '📰 一般', color: '#3b82f6' },
  { id: 'ai', label: '🤖 AI・LLM', color: '#8b5cf6' },
  { id: 'frontend', label: '💻 フロントエンド', color: '#10b981' },
];

function getDatesForCategory(category) {
  const dir = path.join(DATA_DIR, category);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.json'))
    .map((f) => f.replace('.json', ''))
    .sort()
    .reverse();
}

function getNewsForDate(category, date) {
  const filePath = path.join(DATA_DIR, category, `${date}.json`);
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

function getLatestNews() {
  return CATEGORIES.map((cat) => {
    const dates = getDatesForCategory(cat.id);
    const latestDate = dates[0] || null;
    const data = latestDate ? getNewsForDate(cat.id, latestDate) : null;
    return { ...cat, latestDate, articles: data?.articles || [] };
  });
}

function getAllDates() {
  const dateSet = new Set();
  for (const cat of CATEGORIES) {
    for (const d of getDatesForCategory(cat.id)) {
      dateSet.add(d);
    }
  }
  return [...dateSet].sort().reverse();
}

export { CATEGORIES, getDatesForCategory, getNewsForDate, getLatestNews, getAllDates };
