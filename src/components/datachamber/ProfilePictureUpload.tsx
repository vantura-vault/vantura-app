import { useState, useRef } from 'react';
import { Upload, X, Check } from 'lucide-react';
import { Card } from '../shared/Card';
import styles from './ProfilePictureUpload.module.css';

interface ProfilePictureUploadProps {
  currentUrl?: string | null;
  companyName: string;
  onUpdate: (url: string) => void;
  isUpdating?: boolean;
}

export function ProfilePictureUpload({
  currentUrl,
  companyName,
  onUpdate,
  isUpdating = false,
}: ProfilePictureUploadProps) {
  const [imageUrl, setImageUrl] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUrlSubmit = () => {
    if (imageUrl.trim()) {
      onUpdate(imageUrl.trim());
      setImageUrl('');
      setShowUrlInput(false);
      setPreviewUrl(null);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real app, you would upload this to a file storage service (S3, Cloudinary, etc.)
      // For now, we'll create a local preview and show instructions
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);

      console.log('File selected:', file.name);
      console.log('Note: You need to upload this to a file storage service and get a URL');
    }
  };

  const handleRemove = () => {
    onUpdate('');
    setPreviewUrl(null);
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
    <Card className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Company Profile Picture</h3>
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
                  // Fallback to initials if image fails to load
                  e.currentTarget.style.display = 'none';
                }}
              />
              <button
                onClick={handleRemove}
                className={styles.removeButton}
                title="Remove picture"
                disabled={isUpdating}
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <div className={styles.placeholder}>
              <span className={styles.initials}>{getInitials(companyName)}</span>
            </div>
          )}
        </div>

        {/* Upload Options */}
        <div className={styles.actions}>
          {!showUrlInput ? (
            <>
              <button
                onClick={() => setShowUrlInput(true)}
                className={styles.button}
                disabled={isUpdating}
              >
                <Upload size={16} />
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
                <Upload size={16} />
                Upload File
              </button>
            </>
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
              />
              <button
                onClick={handleUrlSubmit}
                className={styles.buttonIcon}
                disabled={!imageUrl.trim() || isUpdating}
                title="Save URL"
              >
                <Check size={16} />
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
                <X size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Helper Text */}
        {previewUrl && (
          <div className={styles.note}>
            <p className={styles.noteText}>
              📌 File preview shown. To use this image, upload it to an image hosting service
              (like Cloudinary, Imgur, or AWS S3) and paste the URL above.
            </p>
          </div>
        )}

        {!displayUrl && (
          <div className={styles.suggestions}>
            <p className={styles.suggestionsTitle}>Quick suggestions:</p>
            <div className={styles.suggestionButtons}>
              <button
                onClick={() => onUpdate(`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(companyName)}&backgroundColor=3B82F6`)}
                className={styles.suggestionButton}
                disabled={isUpdating}
              >
                Default Avatar
              </button>
              <button
                onClick={() => onUpdate(`https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(companyName)}`)}
                className={styles.suggestionButton}
                disabled={isUpdating}
              >
                Random Pattern
              </button>
            </div>
          </div>
        )}
      </div>

      {isUpdating && (
        <div className={styles.loadingOverlay}>
          <div className={styles.spinner} />
        </div>
      )}
    </Card>
  );
}
