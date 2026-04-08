import { getAllNewsData } from '@/lib/data';
import NewsFeed from '@/components/NewsFeed';

export default function Home() {
  const newsData = getAllNewsData();
  return <NewsFeed data={newsData} />;
}
