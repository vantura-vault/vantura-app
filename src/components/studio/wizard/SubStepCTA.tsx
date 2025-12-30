import { useCallback } from 'react';
import { ArrowLeft, ArrowRight, Megaphone, Lightbulb, Hash } from 'lucide-react';
import { WizardStepHeader } from './WizardStepHeader';
import type { DraftBlueprint } from '../../../types/draft';
import type { Hashtag, WhatToIncludeItem } from '../../../types/blueprint';
import styles from './SubStep.module.css';

interface SubStepCTAProps {
  blueprint: DraftBlueprint;
  value: string;
  hookValue: string;
  bodyValue: string;
  engagementValue: string;
  selectedHashtags: string[];
  onChange: (value: string) => void;
  onHashtagsChange: (hashtags: string[]) => void;
  onNext: () => void;
  onBack: () => void;
}

const CTA_CHAR_LIMIT = 150;

export function SubStepCTA({
  blueprint,
  value,
  hookValue,
  bodyValue,
  engagementValue,
  selectedHashtags,
  onChange,
  onHashtagsChange,
  onNext,
  onBack,
}: SubStepCTAProps) {
  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  }, [onChange]);

  const toggleHashtag = useCallback((tag: string) => {
    const normalizedTag = tag.startsWith('#') ? tag.slice(1) : tag;
    if (selectedHashtags.includes(normalizedTag)) {
      onHashtagsChange(selectedHashtags.filter(t => t !== normalizedTag));
    } else {
      onHashtagsChange([...selectedHashtags, normalizedTag]);
    }
  }, [selectedHashtags, onHashtagsChange]);

  // Parse whatToInclude for CTA guidance
  const whatToInclude: WhatToIncludeItem[] = (() => {
    if (!blueprint.whatToInclude) return [];
    if (typeof blueprint.whatToInclude === 'string') {
      try {
        return JSON.parse(blueprint.whatToInclude);
      } catch {
        return [];
      }
    }
    return Array.isArray(blueprint.whatToInclude) ? blueprint.whatToInclude : [];
  })();

  // Find CTA-related items
  const ctaItem = whatToInclude.find(item =>
    item.label.toLowerCase().includes('cta') ||
    item.label.toLowerCase().includes('call to action') ||
    item.label.toLowerCase().includes('action')
  );

  // Parse hashtags
  const hashtags: Hashtag[] = Array.isArray(blueprint.hashtags) ? blueprint.hashtags : [];

  const charCount = value.length;
  const isOverLimit = charCount > CTA_CHAR_LIMIT;
  const isNearLimit = charCount > CTA_CHAR_LIMIT * 0.8;

  // Calculate total caption length for preview
  const fullCaption = [hookValue, bodyValue, engagementValue, value]
    .filter(Boolean)
    .join('\n\n');
  const totalChars = fullCaption.length;

  return (
    <div className={styles.container}>
      <WizardStepHeader
        stepLabel="Step 3.4"
        title="Add Your Call-to-Action"
        description="End strong with a clear action you want readers to take."
      />

      <div className={styles.columns}>
        {/* Left Column - Guidance */}
        <div className={styles.guidanceColumn}>
          <h3 className={styles.columnTitle}>CTA Guide</h3>

          <div className={styles.guidanceSection}>
            <h4 className={styles.guidanceTitle}>
              <Megaphone size={14} className={styles.guidanceIcon} />
              Purpose
            </h4>
            <p className={styles.guidanceText}>
              Tell your audience exactly what to do next. A strong CTA converts readers into action-takers.
            </p>
          </div>

          <div className={styles.guidanceSection}>
            <h4 className={styles.guidanceTitle}>
              <Lightbulb size={14} className={styles.tipIcon} />
              Tips
            </h4>
            <ul className={styles.tipsList}>
              <li>Be specific and direct</li>
              <li>Use action verbs (Try, Get, Join, Shop)</li>
              <li>Create urgency when appropriate</li>
              <li>Include a link or next step</li>
              <li>Keep it short and punchy</li>
            </ul>
          </div>

          {ctaItem && (
            <div className={styles.guidanceSection}>
              <div className={styles.exampleCard}>
                <div className={styles.exampleLabel}>Blueprint Guidance</div>
                <p className={styles.exampleText}>{ctaItem.guidance}</p>
              </div>
            </div>
          )}
        </div>

        {/* Center Column - Editor */}
        <div className={styles.editorColumn}>
          <h3 className={styles.columnTitle}>Your Call-to-Action</h3>

          <div className={styles.editorWrapper}>
            <textarea
              className={`${styles.textInput} ${styles.ctaInput} ${isOverLimit ? styles.textInputError : ''}`}
              placeholder="Tell readers what to do next..."
              value={value}
              onChange={handleChange}
            />
            <div className={`${styles.charCount} ${isOverLimit ? styles.charCountError : isNearLimit ? styles.charCountWarning : ''}`}>
              {charCount} / {CTA_CHAR_LIMIT}
            </div>
          </div>

          {/* Hashtag Selection */}
          {hashtags.length > 0 && (
            <div className={styles.hashtagSection}>
              <h4 className={styles.hashtagTitle}>
                <Hash size={14} />
                Select Hashtags
              </h4>
              <div className={styles.hashtagList}>
                {hashtags.map((hashtag, idx) => {
                  const tag = hashtag.tag.startsWith('#') ? hashtag.tag.slice(1) : hashtag.tag;
                  const isSelected = selectedHashtags.includes(tag);
                  return (
                    <button
                      key={idx}
                      className={`${styles.hashtagChip} ${isSelected ? styles.hashtagChipSelected : ''}`}
                      onClick={() => toggleHashtag(tag)}
                    >
                      #{tag}
                      <span className={styles.hashtagEngagement}>{hashtag.engagement}</span>
                    </button>
                  );
                })}
              </div>
              {selectedHashtags.length > 0 && (
                <p className={styles.hashtagHint}>
                  {selectedHashtags.length} hashtag{selectedHashtags.length !== 1 ? 's' : ''} selected
                </p>
              )}
            </div>
          )}

          {/* Full Preview */}
          <div className={styles.previewSection}>
            <h4 className={styles.previewTitle}>
              Full Caption Preview ({totalChars.toLocaleString()} chars)
            </h4>
            <div className={`${styles.previewContent} ${!fullCaption ? styles.previewEmpty : ''}`}>
              {fullCaption || 'Your caption will appear here...'}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        <button className={styles.backButton} onClick={onBack}>
          <ArrowLeft size={18} />
          Back to Engagement
        </button>
        <button
          className={styles.nextButton}
          onClick={onNext}
          disabled={isOverLimit}
        >
          Continue to Preview
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
