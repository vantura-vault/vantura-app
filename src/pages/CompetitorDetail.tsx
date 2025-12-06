import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, ExternalLink } from 'lucide-react';
import { useCompetitorDetails, useCompanyId } from '../hooks';
import { formatNumber, formatRelativeTime } from '../utils/formatters';
import { Button } from '../components/shared/Button';
import styles from './CompetitorDetail.module.css';

export function CompetitorDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const companyId = useCompanyId();

  const { data: competitor, isLoading, error } = useCompetitorDetails({
    id: id!,
    companyId,
  }, { enabled: !!id });

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading competitor details...</div>
      </div>
    );
  }

  if (error || !competitor) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          Failed to load competitor details. {error?.message}
        </div>
        <Button onClick={() => navigate('/competitor-vault')}>Back to Vault</Button>
      </div>
    );
  }

  const totalFollowers = competitor.platforms.reduce(
    (sum, p) => sum + p.currentFollowers,
    0
  );

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <Button
          variant="ghost"
          onClick={() => navigate('/competitor-vault')}
          className={styles.backButton}
        >
          <ArrowLeft size={20} />
          Back to Vault
        </Button>

        <div className={styles.headerInfo}>
          <h1 className={styles.title}>{competitor.name}</h1>
          {competitor.industry && (
            <span className={styles.industry}>{competitor.industry}</span>
          )}
          {competitor.description && (
            <p className={styles.description}>{competitor.description}</p>
          )}
        </div>
      </div>

      {/* Stats Overview */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Total Followers</div>
          <div className={styles.statValue}>{formatNumber(totalFollowers)}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Platforms</div>
          <div className={styles.statValue}>{competitor.platforms.length}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Total Posts</div>
          <div className={styles.statValue}>{competitor.posts.length}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Avg Engagement</div>
          <div className={styles.statValue}>
            {competitor.posts.length > 0
              ? formatNumber(
                  competitor.posts.reduce((sum, p) => sum + p.engagement, 0) /
                    competitor.posts.length
                )
              : '0'}
          </div>
        </div>
      </div>

      {/* Platform Accounts */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Platform Accounts</h2>
        <div className={styles.platformsGrid}>
          {competitor.platforms.map((platform) => (
            <div key={platform.platform} className={styles.platformCard}>
              <div className={styles.platformHeader}>
                <span className={styles.platformName}>{platform.platform}</span>
                <a
                  href={platform.profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.platformLink}
                >
                  <ExternalLink size={16} />
                </a>
              </div>
              <div className={styles.platformFollowers}>
                {formatNumber(platform.currentFollowers)} followers
              </div>
              {platform.snapshots.length > 1 && (
                <div className={styles.platformGrowth}>
                  <TrendingUp size={14} />
                  <span>
                    {formatNumber(
                      platform.currentFollowers -
                        platform.snapshots[platform.snapshots.length - 1].followers
                    )}{' '}
                    last {platform.snapshots.length} days
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Recent Posts */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Recent Posts</h2>
        {competitor.posts.length === 0 ? (
          <div className={styles.emptyState}>No posts available</div>
        ) : (
          <div className={styles.postsGrid}>
            {competitor.posts.map((post) => (
              <div key={post.id} className={styles.postCard}>
                <div className={styles.postHeader}>
                  <span className={styles.postPlatform}>{post.platform}</span>
                  <span className={styles.postDate}>
                    {formatRelativeTime(new Date(post.postedAt))}
                  </span>
                </div>
                <p className={styles.postContent}>{post.content}</p>
                <div className={styles.postStats}>
                  <div className={styles.postStat}>
                    <span className={styles.postStatLabel}>Likes</span>
                    <span className={styles.postStatValue}>
                      {formatNumber(post.likes)}
                    </span>
                  </div>
                  <div className={styles.postStat}>
                    <span className={styles.postStatLabel}>Comments</span>
                    <span className={styles.postStatValue}>
                      {formatNumber(post.comments)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
