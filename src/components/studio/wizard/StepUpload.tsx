import { ArrowLeft, Save, Send, AlertCircle, CheckCircle } from 'lucide-react';
import { WizardStepHeader } from './WizardStepHeader';
import { LinkedInPreview } from './LinkedInPreview';
import styles from './StepUpload.module.css';

interface StepUploadProps {
  imageUrl: string | null;
  caption: string;
  selectedHashtags: string[];
  onBack: () => void;
  onSaveAsDraft: () => void;
  isSaving?: boolean;
}

const LINKEDIN_CHAR_LIMIT = 3000;

export function StepUpload({
  imageUrl,
  caption,
  selectedHashtags,
  onBack,
  onSaveAsDraft,
  isSaving = false,
}: StepUploadProps) {
  // Build full caption with hashtags for char count
  const hashtagsText = selectedHashtags.length > 0
    ? '\n\n' + selectedHashtags.map(tag => `#${tag}`).join(' ')
    : '';
  const fullCaption = caption + hashtagsText;
  const charCount = fullCaption.length;
  const isOverLimit = charCount > LINKEDIN_CHAR_LIMIT;

  // Validation checks
  const hasCaption = caption.trim().length > 0;
  const isValid = hasCaption && !isOverLimit;

  return (
    <div className={styles.container}>
      {/* Standardized Header */}
      <WizardStepHeader
        stepLabel="Step 4"
        title="Review & Publish"
        description="Preview your post and save or publish"
      />

      <div className={styles.columns}>
        {/* Left Column - Preview */}
        <div className={styles.previewColumn}>
          <h3 className={styles.columnTitle}>Preview</h3>

          <LinkedInPreview
            imageUrl={imageUrl}
            caption={caption}
            selectedHashtags={selectedHashtags}
          />

          {/* Character count warning if over limit */}
          {isOverLimit && (
            <div className={styles.warningBanner}>
              <AlertCircle size={16} />
              <span>
                Caption exceeds LinkedIn's {LINKEDIN_CHAR_LIMIT.toLocaleString()} character limit by {(charCount - LINKEDIN_CHAR_LIMIT).toLocaleString()} characters
              </span>
            </div>
          )}
        </div>

        {/* Right Column - Actions */}
        <div className={styles.actionsColumn}>
          <h3 className={styles.columnTitle}>Ready to Go?</h3>

          {/* Validation Checklist */}
          <div className={styles.checklist}>
            <div className={`${styles.checkItem} ${hasCaption ? styles.checkItemPassed : styles.checkItemFailed}`}>
              {hasCaption ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
              <span>Caption written</span>
            </div>
            <div className={`${styles.checkItem} ${!isOverLimit ? styles.checkItemPassed : styles.checkItemFailed}`}>
              {!isOverLimit ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
              <span>Within character limit</span>
            </div>
            <div className={`${styles.checkItem} ${imageUrl ? styles.checkItemPassed : styles.checkItemOptional}`}>
              {imageUrl ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
              <span>{imageUrl ? 'Visual uploaded' : 'No visual (text-only post)'}</span>
            </div>
          </div>

          {/* Save as Draft */}
          <button
            className={styles.saveDraftButton}
            onClick={onSaveAsDraft}
            disabled={!isValid || isSaving}
          >
            <Save size={18} />
            {isSaving ? 'Saving...' : 'Save as Draft'}
          </button>

          {/* Publish (Coming Soon) */}
          <div className={styles.publishSection}>
            <button className={styles.publishButton} disabled>
              <Send size={18} />
              Publish to LinkedIn
            </button>
            <span className={styles.comingSoonLabel}>Coming Soon</span>
          </div>

          {/* Platform Info */}
          <div className={styles.platformInfo}>
            <p className={styles.platformNote}>
              Publishing directly to LinkedIn will be available soon. For now, you can save your draft and copy it to post manually.
            </p>
          </div>

          {/* Quick Actions */}
          <div className={styles.quickActions}>
            <h4 className={styles.quickActionsTitle}>Quick Actions</h4>
            <button
              className={styles.quickActionButton}
              onClick={() => {
                navigator.clipboard.writeText(fullCaption);
              }}
            >
              Copy Caption
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        <button className={styles.backButton} onClick={onBack}>
          <ArrowLeft size={18} />
          Back to Caption
        </button>
      </div>
    </div>
  );
}
