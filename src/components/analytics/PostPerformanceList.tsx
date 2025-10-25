import { Heart, MessageCircle, TrendingUp, TrendingDown } from 'lucide-react';
import { Card } from '../shared/Card';
import { Badge } from '../shared/Badge';
import styles from './PostPerformanceList.module.css';

interface Post {
  id: number;
  platform: string;
  caption: string;
  postedAt: string;
  likes: number;
  comments: number;
  engagement: number;
  trend: 'up' | 'down' | 'neutral';
}

interface PostPerformanceListProps {
  posts: Post[];
  title: string;
}

export function PostPerformanceList({ posts, title }: PostPerformanceListProps) {
  return (
    <Card>
      <div className={styles.container}>
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.list}>
          {posts.map((post) => (
            <div key={post.id} className={styles.postItem}>
              <div className={styles.postHeader}>
                <Badge variant="secondary">{post.platform}</Badge>
                <span className={styles.date}>{post.postedAt}</span>
              </div>
              <p className={styles.caption}>{post.caption}</p>
              <div className={styles.metrics}>
                <div className={styles.metric}>
                  <Heart size={16} className={styles.icon} />
                  <span>{post.likes.toLocaleString()}</span>
                </div>
                <div className={styles.metric}>
                  <MessageCircle size={16} className={styles.icon} />
                  <span>{post.comments.toLocaleString()}</span>
                </div>
                <div className={`${styles.engagement} ${styles[post.trend]}`}>
                  {post.trend === 'up' && <TrendingUp size={14} />}
                  {post.trend === 'down' && <TrendingDown size={14} />}
                  <span>{post.engagement}% engagement</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
