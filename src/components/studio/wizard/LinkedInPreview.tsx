import { ThumbsUp, MessageCircle, Repeat2, Send, MoreHorizontal, Globe } from 'lucide-react';
import styles from './LinkedInPreview.module.css';

interface LinkedInPreviewProps {
  imageUrl: string | null;
  caption: string;
  selectedHashtags: string[];
  userName?: string;
  userTitle?: string;
}

export function LinkedInPreview({
  imageUrl,
  caption,
  selectedHashtags,
  userName = 'Your Name',
  userTitle = 'Your Title at Your Company',
}: LinkedInPreviewProps) {
  // Build full caption with hashtags
  const hashtagsText = selectedHashtags.length > 0
    ? '\n\n' + selectedHashtags.map(tag => `#${tag}`).join(' ')
    : '';
  const fullCaption = caption + hashtagsText;

  // Split caption into visible portion and expand
  const MAX_VISIBLE_CHARS = 250;
  const shouldTruncate = fullCaption.length > MAX_VISIBLE_CHARS;
  const visibleCaption = shouldTruncate
    ? fullCaption.substring(0, MAX_VISIBLE_CHARS) + '...'
    : fullCaption;

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.avatar}>
          <span className={styles.avatarText}>{userName.charAt(0)}</span>
        </div>
        <div className={styles.userInfo}>
          <span className={styles.userName}>{userName}</span>
          <span className={styles.userTitle}>{userTitle}</span>
          <span className={styles.postMeta}>
            Now · <Globe size={12} />
          </span>
        </div>
        <button className={styles.moreButton}>
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* Caption */}
      <div className={styles.captionContainer}>
        {fullCaption ? (
          <p className={styles.caption}>
            {visibleCaption}
            {shouldTruncate && (
              <button className={styles.seeMore}>...see more</button>
            )}
          </p>
        ) : (
          <p className={styles.captionPlaceholder}>
            Your caption will appear here...
          </p>
        )}
      </div>

      {/* Image */}
      {imageUrl && (
        <div className={styles.imageContainer}>
          <img src={imageUrl} alt="Post visual" className={styles.postImage} />
        </div>
      )}

      {/* Engagement Stats */}
      <div className={styles.engagementStats}>
        <span className={styles.reactions}>
          <span className={styles.reactionEmoji}>
            <span className={styles.like}>👍</span>
            <span className={styles.celebrate}>🎉</span>
            <span className={styles.love}>❤️</span>
          </span>
          <span className={styles.reactionCount}>12</span>
        </span>
        <span className={styles.commentCount}>3 comments</span>
      </div>

      {/* Divider */}
      <div className={styles.divider} />

      {/* Action Buttons */}
      <div className={styles.actions}>
        <button className={styles.actionButton}>
          <ThumbsUp size={20} />
          <span>Like</span>
        </button>
        <button className={styles.actionButton}>
          <MessageCircle size={20} />
          <span>Comment</span>
        </button>
        <button className={styles.actionButton}>
          <Repeat2 size={20} />
          <span>Repost</span>
        </button>
        <button className={styles.actionButton}>
          <Send size={20} />
          <span>Send</span>
        </button>
      </div>
    </div>
  );
}
