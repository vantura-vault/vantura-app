import { Upload } from 'lucide-react';
import { Card } from '../shared/Card';
import styles from './FileUploadZone.module.css';

interface FileUploadZoneProps {
  onFileSelect: (files: FileList) => void;
}

export function FileUploadZone({ onFileSelect }: FileUploadZoneProps) {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileSelect(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files);
    }
  };

  return (
    <Card className={styles.fileUploadZone}>
      <h2 className={styles.title}>File Upload Zone</h2>
      <div
        className={styles.dropZone}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <Upload className={styles.uploadIcon} />
        <div className={styles.dropText}>
          Drag & drop files here or{' '}
          <label className={styles.uploadButton}>
            click to upload
            <input
              type="file"
              multiple
              onChange={handleFileInput}
              className={styles.fileInput}
            />
          </label>
        </div>
      </div>
    </Card>
  );
}
