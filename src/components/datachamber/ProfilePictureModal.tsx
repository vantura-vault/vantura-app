import { useState, useRef } from 'react';
import { Upload, X, Check, Camera } from 'lucide-react';
import styles from './ProfilePictureModal.module.css';

interface ProfilePictureModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUrl?: string | null;
  companyName: string;
  onUpdate: (url: string) => void;
  isUpdating?: boolean;
}

export function ProfilePictureModal({
  isOpen,
  onClose,
  currentUrl,
  companyName,
  onUpdate,
  isUpdating = false,
}: ProfilePictureModalProps) {
  const [imageUrl, setImageUrl] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleUrlSubmit = () => {
    if (imageUrl.trim()) {
      onUpdate(imageUrl.trim());
      setImageUrl('');
      setShowUrlInput(false);
      setPreviewUrl(null);
      onClose();
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
      console.log('File selected:', file.name);
    }
  };

  const handleRemove = () => {
    onUpdate('');
    setPreviewUrl(null);
    onClose();
  };

  const handleQuickAvatar = (url: string) => {
    onUpdate(url);
    onClose();
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const displayUrl = previewUrl || currentUrl;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Company Profile Picture</h2>
          <button onClick={onClose} className={styles.closeButton} disabled={isUpdating}>
            <X size={20} />
          </button>
        </div>

        <div className={styles.content}>
          {/* Profile Picture Display */}
          <div className={styles.pictureContainer}>
            {displayUrl ? (
              <div className={styles.imageWrapper}>
                <img
                  src={displayUrl}
                  alt={companyName}
                  className={styles.profileImage}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                {currentUrl && (
                  <button
                    onClick={handleRemove}
                    className={styles.removeButton}
                    title="Remove picture"
                    disabled={isUpdating}
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            ) : (
              <div className={styles.placeholder}>
                <span className={styles.initials}>{getInitials(companyName)}</span>
              </div>
            )}
          </div>

          {/* Upload Options */}
          {!showUrlInput ? (
            <div className={styles.actions}>
              <button
                onClick={() => setShowUrlInput(true)}
                className={styles.button}
                disabled={isUpdating}
              >
                <Upload size={18} />
                Add Image URL
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className={styles.fileInput}
                disabled={isUpdating}
              />

              <button
                onClick={() => fileInputRef.current?.click()}
                className={styles.buttonSecondary}
                disabled={isUpdating}
              >
                <Camera size={18} />
                Upload File
              </button>
            </div>
          ) : (
            <div className={styles.urlInputContainer}>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className={styles.urlInput}
                disabled={isUpdating}
                onKeyDown={(e) => e.key === 'Enter' && handleUrlSubmit()}
                autoFocus
              />
              <button
                onClick={handleUrlSubmit}
                className={styles.buttonIcon}
                disabled={!imageUrl.trim() || isUpdating}
                title="Save URL"
              >
                <Check size={18} />
              </button>
              <button
                onClick={() => {
                  setShowUrlInput(false);
                  setImageUrl('');
                }}
                className={styles.buttonIcon}
                disabled={isUpdating}
                title="Cancel"
              >
                <X size={18} />
              </button>
            </div>
          )}

          {/* Helper Text */}
          {previewUrl && (
            <div className={styles.note}>
              <p className={styles.noteText}>
                📌 File preview shown. Upload to an image hosting service (Cloudinary, Imgur, AWS S3) and paste the URL above.
              </p>
            </div>
          )}

          {/* Quick Suggestions */}
          <div className={styles.suggestions}>
            <p className={styles.suggestionsTitle}>Quick suggestions:</p>
            <div className={styles.suggestionButtons}>
              <button
                onClick={() => handleQuickAvatar(`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(companyName)}&backgroundColor=3B82F6`)}
                className={styles.suggestionButton}
                disabled={isUpdating}
              >
                Default Avatar
              </button>
              <button
                onClick={() => handleQuickAvatar(`https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(companyName)}`)}
                className={styles.suggestionButton}
                disabled={isUpdating}
              >
                Random Pattern
              </button>
            </div>
          </div>
        </div>

        {isUpdating && (
          <div className={styles.loadingOverlay}>
            <div className={styles.spinner} />
          </div>
        )}
      </div>
    </div>
  );
}
