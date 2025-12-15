import { useState } from 'react';
import { ArrowLeft, Copy, Check, Sparkles, MessageSquare } from 'lucide-react';
import type { Blueprint } from '../../types/blueprint';
import styles from './StudioWorkspace.module.css';

interface StudioWorkspaceProps {
  blueprint: Blueprint;
  onBack: () => void;
}

export function StudioWorkspace({ blueprint, onBack }: StudioWorkspaceProps) {
  const [copied, setCopied] = useState(false);

  // Combine hook and context for the full post
  const fullPost = `${blueprint.hook}\n\n${blueprint.context}${
    blueprint.hashtags?.length
      ? '\n\n' + blueprint.hashtags.map((h) => h.tag).join(' ')
      : ''
  }`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullPost);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className={styles.workspace}>
      <header className={styles.header}>
        <button className={styles.backButton} onClick={onBack}>
          <ArrowLeft size={18} />
          Back to blueprints
        </button>
        <h1 className={styles.title}>{blueprint.title}</h1>
      </header>

      <div className={styles.content}>
        {/* Blueprint Summary */}
        <section className={styles.summary}>
          <h2 className={styles.sectionTitle}>Blueprint Summary</h2>
          <div className={styles.summaryContent}>
            <div className={styles.summaryRow}>
              <span className={styles.label}>Platform</span>
              <span className={styles.value}>{blueprint.platform}</span>
            </div>
            <div className={styles.summaryRow}>
              <span className={styles.label}>Objective</span>
              <span className={styles.value}>{blueprint.objective}</span>
            </div>
            {blueprint.vanturaScore && (
              <div className={styles.summaryRow}>
                <span className={styles.label}>Vantura Score</span>
                <span className={styles.scoreValue}>{blueprint.vanturaScore}</span>
              </div>
            )}
          </div>
        </section>

        {/* Chat Area - Placeholder */}
        <section className={styles.chatSection}>
          <div className={styles.chatHeader}>
            <MessageSquare size={20} />
            <h2 className={styles.sectionTitle}>Refinement Chat</h2>
          </div>
          <div className={styles.chatPlaceholder}>
            <Sparkles size={32} className={styles.sparklesIcon} />
            <h3 className={styles.placeholderTitle}>Coming Soon</h3>
            <p className={styles.placeholderText}>
              Soon you'll be able to have a conversation with Vantura to refine
              your blueprint into the perfect post. For now, you can copy and
              edit the draft below.
            </p>
          </div>
        </section>

        {/* Post Output */}
        <section className={styles.outputSection}>
          <div className={styles.outputHeader}>
            <h2 className={styles.sectionTitle}>Your Post</h2>
            <button
              className={styles.copyButton}
              onClick={handleCopy}
            >
              {copied ? (
                <>
                  <Check size={16} />
                  Copied!
                </>
              ) : (
                <>
                  <Copy size={16} />
                  Copy Post
                </>
              )}
            </button>
          </div>
          <div className={styles.postPreview}>
            <p className={styles.postHook}>{blueprint.hook}</p>
            <p className={styles.postContext}>{blueprint.context}</p>
            {blueprint.hashtags?.length > 0 && (
              <p className={styles.postHashtags}>
                {blueprint.hashtags.map((h) => h.tag).join(' ')}
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
