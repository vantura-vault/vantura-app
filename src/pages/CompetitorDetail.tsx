import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, ExternalLink, Heart, MessageCircle, BarChart3 } from 'lucide-react';
import { useCompetitorDetails, useCompanyId } from '../hooks';
import { useWebSocket } from '../hooks/useWebSocket';
import { formatNumber, formatRelativeTime } from '../utils/formatters';
import { Button } from '../components/shared/Button';
import { PlatformIcon } from '../components/shared/PlatformIcon';
import styles from './CompetitorDetail.module.css';

// Truncate text to a specific word count
const truncateText = (text: string, wordCount = 20): string => {
  const words = text.split(/\s+/);
  if (words.length <= wordCount) return text;
  return words.slice(0, wordCount).join(' ') + '...';
};

export function CompetitorDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const companyId = useCompanyId();
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);

  // Listen for websocket events - auto-refreshes when scrape completes for this competitor
  useWebSocket();

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
          <div className={styles.titleRow}>
            {competitor.logoUrl && (
              <img
                src={competitor.logoUrl}
                alt={`${competitor.name} logo`}
                className={styles.competitorLogo}
              />
            )}
            <h1 className={styles.title}>{competitor.name}</h1>
          </div>
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
            {competitor.posts.map((post) => {
              const isExpanded = expandedPostId === post.id;
              const needsTruncation = post.content.split(/\s+/).length > 20;

              return (
                <div
                  key={post.id}
                  className={`${styles.postCard} ${isExpanded ? styles.postCardExpanded : ''}`}
                  onClick={() => setExpandedPostId(isExpanded ? null : post.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setExpandedPostId(isExpanded ? null : post.id);
                    }
                  }}
                >
                  <div className={styles.postHeader}>
                    <div className={styles.postPlatformWrapper}>
                      <PlatformIcon platform={post.platform} size={20} />
                      <span className={styles.postPlatform}>{post.platform}</span>
                    </div>
                    <span className={styles.postDate}>
                      {formatRelativeTime(new Date(post.postedAt))}
                    </span>
                  </div>

                  <p className={styles.postContent}>
                    {isExpanded || !needsTruncation
                      ? post.content
                      : truncateText(post.content, 20)}
                  </p>

                  {needsTruncation && (
                    <span className={styles.expandHint}>
                      {isExpanded ? 'Click to collapse' : 'Click to expand'}
                    </span>
                  )}

                  <div className={styles.postStats}>
                    <div className={styles.postStat}>
                      <Heart size={14} className={styles.statIcon} />
                      <span className={styles.postStatValue}>
                        {formatNumber(post.likes)}
                      </span>
                    </div>
                    <div className={styles.postStat}>
                      <MessageCircle size={14} className={styles.statIcon} />
                      <span className={styles.postStatValue}>
                        {formatNumber(post.comments)}
                      </span>
                    </div>
                    <div className={styles.postStat}>
                      <BarChart3 size={14} className={styles.statIcon} />
                      <span className={styles.postStatValue}>
                        {post.engagementRate}%
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
