import { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { Button } from '../shared/Button';
import { useAddCompetitor, useCompanyId } from '../../hooks';
import styles from './AddCompetitorModal.module.css';

interface PlatformInput {
  id: string;
  platform: string;
  url: string;
  type: 'company' | 'profile';
}

interface AddCompetitorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SUPPORTED_PLATFORMS = ['LinkedIn', 'Twitter', 'Instagram', 'Facebook', 'YouTube'];

export function AddCompetitorModal({ isOpen, onClose }: AddCompetitorModalProps) {
  const companyId = useCompanyId();
  const addCompetitorMutation = useAddCompetitor();

  const [competitorName, setCompetitorName] = useState('');
  const [platforms, setPlatforms] = useState<PlatformInput[]>([
    { id: '1', platform: 'LinkedIn', url: '', type: 'company' }
  ]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleAddPlatform = () => {
    const newId = Date.now().toString();
    setPlatforms([...platforms, { id: newId, platform: 'LinkedIn', url: '', type: 'company' }]);
  };

  const handleRemovePlatform = (id: string) => {
    if (platforms.length > 1) {
      setPlatforms(platforms.filter(p => p.id !== id));
      // Remove any errors for this platform
      const newErrors = { ...errors };
      delete newErrors[`platform-${id}`];
      delete newErrors[`url-${id}`];
      delete newErrors[`type-${id}`];
      setErrors(newErrors);
    }
  };

  const handlePlatformChange = (id: string, field: 'platform' | 'url' | 'type', value: string) => {
    setPlatforms(platforms.map(p =>
      p.id === id ? { ...p, [field]: value } : p
    ));

    // Clear error for this field
    const errorKey = `${field}-${id}`;
    if (errors[errorKey]) {
      const newErrors = { ...errors };
      delete newErrors[errorKey];
      setErrors(newErrors);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!competitorName.trim()) {
      newErrors.competitorName = 'Competitor name is required';
    }

    if (platforms.length === 0) {
      newErrors.platforms = 'At least one social media account is required';
    }

    platforms.forEach(p => {
      if (!p.platform) {
        newErrors[`platform-${p.id}`] = 'Platform is required';
      }
      if (!p.url.trim()) {
        newErrors[`url-${p.id}`] = 'URL is required';
      } else if (!isValidUrl(p.url)) {
        newErrors[`url-${p.id}`] = 'Please enter a valid URL';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await addCompetitorMutation.mutateAsync({
        companyId,
        name: competitorName,
        platforms: platforms.map(p => ({
          platform: p.platform,
          url: p.url,
          type: p.type
        }))
      });

      // Reset form and close modal
      setCompetitorName('');
      setPlatforms([{ id: '1', platform: 'LinkedIn', url: '', type: 'company' }]);
      setErrors({});
      onClose();
    } catch (error) {
      console.error('Failed to add competitor:', error);
      setErrors({ submit: 'Failed to add competitor. Please try again.' });
    }
  };

  const handleClose = () => {
    setCompetitorName('');
    setPlatforms([{ id: '1', platform: 'LinkedIn', url: '', type: 'company' }]);
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Add Competitor</h2>
          <button className={styles.closeButton} onClick={handleClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="competitorName" className={styles.label}>
              Competitor Name <span className={styles.required}>*</span>
            </label>
            <input
              id="competitorName"
              type="text"
              value={competitorName}
              onChange={(e) => setCompetitorName(e.target.value)}
              className={`${styles.input} ${errors.competitorName ? styles.inputError : ''}`}
              placeholder="e.g., Coca-Cola"
              autoComplete="off"
            />
            {errors.competitorName && (
              <span className={styles.error}>{errors.competitorName}</span>
            )}
          </div>

          <div className={styles.platformsSection}>
            <div className={styles.platformsHeader}>
              <label className={styles.label}>
                Social Media Accounts <span className={styles.required}>*</span>
              </label>
              <button
                type="button"
                onClick={handleAddPlatform}
                className={styles.addPlatformButton}
              >
                <Plus size={16} />
                Add Platform
              </button>
            </div>

            <div className={styles.platformsList}>
              {platforms.map((platform) => (
                <div key={platform.id} className={styles.platformRow}>
                  <div className={styles.platformInputs}>
                    <div className={styles.formGroup}>
                      <select
                        value={platform.platform}
                        onChange={(e) => handlePlatformChange(platform.id, 'platform', e.target.value)}
                        className={`${styles.select} ${errors[`platform-${platform.id}`] ? styles.inputError : ''}`}
                      >
                        {SUPPORTED_PLATFORMS.map(p => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                      {errors[`platform-${platform.id}`] && (
                        <span className={styles.error}>{errors[`platform-${platform.id}`]}</span>
                      )}
                    </div>

                    <div className={styles.formGroup}>
                      <input
                        type="text"
                        value={platform.url}
                        onChange={(e) => handlePlatformChange(platform.id, 'url', e.target.value)}
                        className={`${styles.input} ${errors[`url-${platform.id}`] ? styles.inputError : ''}`}
                        placeholder={platform.type === 'company' ? 'https://linkedin.com/company/example' : 'https://linkedin.com/in/example'}
                        autoComplete="off"
                      />
                      {errors[`url-${platform.id}`] && (
                        <span className={styles.error}>{errors[`url-${platform.id}`]}</span>
                      )}
                    </div>

                    <div className={styles.formGroup}>
                      <div className={styles.typeToggle}>
                        <button
                          type="button"
                          className={`${styles.typeButton} ${platform.type === 'company' ? styles.typeButtonActive : ''}`}
                          onClick={() => handlePlatformChange(platform.id, 'type', 'company')}
                        >
                          Company
                        </button>
                        <button
                          type="button"
                          className={`${styles.typeButton} ${platform.type === 'profile' ? styles.typeButtonActive : ''}`}
                          onClick={() => handlePlatformChange(platform.id, 'type', 'profile')}
                        >
                          Profile
                        </button>
                      </div>
                      {errors[`type-${platform.id}`] && (
                        <span className={styles.error}>{errors[`type-${platform.id}`]}</span>
                      )}
                    </div>
                  </div>

                  {platforms.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemovePlatform(platform.id)}
                      className={styles.removeButton}
                      aria-label="Remove platform"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {errors.submit && (
            <div className={styles.submitError}>{errors.submit}</div>
          )}

          <div className={styles.footer}>
            <Button type="button" onClick={handleClose} variant="secondary">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={addCompetitorMutation.isPending}
            >
              {addCompetitorMutation.isPending ? 'Adding...' : 'Add Competitor'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
