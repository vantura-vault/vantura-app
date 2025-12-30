import { useState, useCallback } from 'react';
import { Upload, Image, X, ArrowLeft, ArrowRight, FileText } from 'lucide-react';
import { WizardStepHeader } from './WizardStepHeader';
import type { DraftBlueprint } from '../../../types/draft';
import styles from './StepVisualBuilder.module.css';

interface StepVisualBuilderProps {
  blueprint: DraftBlueprint;
  imageUrl: string | null;
  onImageChange: (imageUrl: string | null) => void;
  onNext: () => void;
  onBack: () => void;
}

export function StepVisualBuilder({
  blueprint,
  imageUrl,
  onImageChange,
  onNext,
  onBack,
}: StepVisualBuilderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, []);

  const handleFileUpload = async (file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('Image must be less than 10MB');
      return;
    }

    setIsUploading(true);

    try {
      // For MVP, convert to base64 data URL
      // In production, you'd upload to S3/Cloudinary
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        onImageChange(dataUrl);
        setIsUploading(false);
      };
      reader.onerror = () => {
        alert('Failed to read image file');
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch {
      alert('Failed to upload image');
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    onImageChange(null);
  };

  const handleSkip = () => {
    onNext();
  };

  return (
    <div className={styles.container}>
      {/* Standardized Header */}
      <WizardStepHeader
        stepLabel="Step 2"
        title="Visual Builder"
        description="Upload or create visuals for your post"
      />

      <div className={styles.columns}>
        {/* Left Column - Upload Area */}
        <div className={styles.uploadColumn}>
          <h3 className={styles.columnTitle}>Upload Visual</h3>

          {imageUrl ? (
            <div className={styles.previewContainer}>
              <img src={imageUrl} alt="Uploaded visual" className={styles.previewImage} />
              <button className={styles.removeButton} onClick={handleRemoveImage}>
                <X size={16} />
                Remove
              </button>
            </div>
          ) : (
            <div
              className={`${styles.dropzone} ${isDragging ? styles.dropzoneDragging : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {isUploading ? (
                <div className={styles.uploadingState}>
                  <div className={styles.spinner} />
                  <span>Uploading...</span>
                </div>
              ) : (
                <>
                  <div className={styles.dropzoneIcon}>
                    <Upload size={32} />
                  </div>
                  <p className={styles.dropzoneText}>
                    Drag and drop your image here
                  </p>
                  <p className={styles.dropzoneSubtext}>or</p>
                  <label className={styles.uploadButton}>
                    <Image size={16} />
                    Choose File
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className={styles.fileInput}
                    />
                  </label>
                  <p className={styles.dropzoneHint}>
                    Supports: JPG, PNG, GIF (max 10MB)
                  </p>
                </>
              )}
            </div>
          )}

          <button className={styles.skipButton} onClick={handleSkip}>
            <FileText size={16} />
            Skip - Create text-only post
          </button>
        </div>

        {/* Right Column - Suggestions */}
        <div className={styles.suggestionsColumn}>
          <h3 className={styles.columnTitle}>Visual Suggestions</h3>

          <div className={styles.suggestionCard}>
            <h4 className={styles.suggestionLabel}>Recommended Format</h4>
            <p className={styles.suggestionValue}>
              {blueprint.recommendedFormat || 'Image + Text'}
            </p>
          </div>

          <div className={styles.suggestionCard}>
            <h4 className={styles.suggestionLabel}>Visual Direction</h4>
            <p className={styles.visualDescription}>
              {blueprint.visualDescription}
            </p>
          </div>

          <div className={styles.tipsCard}>
            <h4 className={styles.tipsTitle}>Best Practices</h4>
            <ul className={styles.tipsList}>
              <li>Use high-quality images (1200x628px for LinkedIn)</li>
              <li>Ensure good contrast for text readability</li>
              <li>Avoid cluttered visuals - keep it clean</li>
              <li>Include your brand colors when possible</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        <button className={styles.backButton} onClick={onBack}>
          <ArrowLeft size={18} />
          Back
        </button>
        <button className={styles.nextButton} onClick={onNext}>
          Continue to Caption
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
