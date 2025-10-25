import { useState } from 'react';
import { Sparkles, Copy, Check } from 'lucide-react';
import { useGenerateSuggestions } from '../hooks';
import { Button } from '../components/shared/Button';
import styles from './Blueprint.module.css';

export function Blueprint() {
  const [platform, setPlatform] = useState<'LinkedIn' | 'Twitter' | 'Instagram'>('LinkedIn');
  const [objective, setObjective] = useState('engagement');
  const [topics, setTopics] = useState('growth, innovation');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const generateMutation = useGenerateSuggestions();

  const handleGenerate = () => {
    const topicTags = topics.split(',').map((t) => t.trim()).filter(Boolean);

    generateMutation.mutate({
      companyId: 'demo-company-1',
      platform,
      objective,
      topicTags,
      nVariants: 3,
    });
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>AI-Powered Content Arsenal</h1>
          <p className={styles.subtitle}>
            Generate high-impact posts tailored to your brand voice and strategic objectives
          </p>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.controlPanel}>
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Configuration</h2>

            <div className={styles.formGroup}>
              <label className={styles.label}>Platform</label>
              <select
                className={styles.select}
                value={platform}
                onChange={(e) => setPlatform(e.target.value as any)}
              >
                <option value="LinkedIn">LinkedIn</option>
                <option value="Twitter">Twitter</option>
                <option value="Instagram">Instagram</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Objective</label>
              <select
                className={styles.select}
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
              >
                <option value="engagement">Engagement</option>
                <option value="brand awareness">Brand Awareness</option>
                <option value="thought leadership">Thought Leadership</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Topics (comma-separated)</label>
              <input
                type="text"
                className={styles.input}
                value={topics}
                onChange={(e) => setTopics(e.target.value)}
                placeholder="growth, innovation, data-driven"
              />
            </div>

            <Button
              onClick={handleGenerate}
              disabled={generateMutation.isPending}
              className={styles.generateButton}
            >
              <Sparkles size={18} />
              {generateMutation.isPending ? 'Generating...' : 'Generate Posts'}
            </Button>

            {generateMutation.error && (
              <div className={styles.error}>
                Error: {generateMutation.error.message}
              </div>
            )}
          </div>

          {generateMutation.data?.meta && (
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Generation Context</h2>
              <div className={styles.metaInfo}>
                <p>
                  <strong>Examples Used:</strong> {generateMutation.data.meta.examplesUsed.length}{' '}
                  high-performing posts
                </p>
                <p>
                  <strong>Competitor Angles:</strong>{' '}
                  {generateMutation.data.meta.competitorAngles.length} insights
                </p>
              </div>
            </div>
          )}
        </div>

        <div className={styles.resultsPanel}>
          {!generateMutation.data && !generateMutation.isPending && (
            <div className={styles.emptyState}>
              <Sparkles size={48} className={styles.emptyIcon} />
              <h3>Ready to Generate</h3>
              <p>Configure your preferences and hit "Generate Posts" to create AI-powered content</p>
            </div>
          )}

          {generateMutation.isPending && (
            <div className={styles.loadingState}>
              <div className={styles.spinner} />
              <p>Generating strategic content...</p>
            </div>
          )}

          {generateMutation.data?.variants && (
            <div className={styles.variantsGrid}>
              {generateMutation.data.variants.map((variant, index) => (
                <div key={index} className={styles.variantCard}>
                  <div className={styles.variantHeader}>
                    <div className={styles.variantMeta}>
                      <span className={styles.variantLabel}>Variant {index + 1}</span>
                      <span className={styles.scoreChip}>
                        Score: {variant.finalScore.toFixed(2)}
                      </span>
                    </div>
                    <button
                      className={styles.copyButton}
                      onClick={() => handleCopy(variant.text, index)}
                      title="Copy to clipboard"
                    >
                      {copiedIndex === index ? (
                        <Check size={16} className={styles.checkIcon} />
                      ) : (
                        <Copy size={16} />
                      )}
                    </button>
                  </div>

                  <div className={styles.variantContent}>
                    <p className={styles.postText}>{variant.text}</p>
                  </div>

                  <div className={styles.variantFooter}>
                    <div className={styles.scoreBreakdown}>
                      <span className={styles.scoreItem}>
                        Analytics: {variant.analyticsScore.toFixed(2)}
                      </span>
                      <span className={styles.scoreItem}>
                        Critic: {variant.criticScore.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
