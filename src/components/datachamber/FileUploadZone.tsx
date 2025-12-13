import { useState, useRef } from 'react';
import { Upload, FileText, Image, Trash2, Loader2 } from 'lucide-react';
import { Card } from '../shared/Card';
import { useFiles, useUploadFiles, useDeleteFile, type CompanyFile } from '../../hooks';
import { toast } from '../../store/toastStore';
import styles from './FileUploadZone.module.css';

interface FileUploadZoneProps {
  companyId: string | undefined;
}

const ACCEPTED_TYPES = '.pdf,.docx,.doc,.png,.jpg,.jpeg,.gif,.webp';

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileIcon(mimeType: string) {
  if (mimeType.startsWith('image/')) {
    return <Image size={20} className={styles.fileIconImage} />;
  }
  return <FileText size={20} className={styles.fileIconDoc} />;
}

export function FileUploadZone({ companyId }: FileUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: files = [], isLoading } = useFiles(companyId);
  const uploadFiles = useUploadFiles();
  const deleteFile = useDeleteFile();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleUpload(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleUpload(Array.from(e.target.files));
      // Reset input so same file can be selected again
      e.target.value = '';
    }
  };

  const handleUpload = async (selectedFiles: File[]) => {
    if (!companyId) {
      toast.error('Upload failed', 'Company ID not available');
      return;
    }

    try {
      const result = await uploadFiles.mutateAsync({
        companyId,
        files: selectedFiles,
      });

      if (result.uploaded.length > 0) {
        toast.success(
          'Files uploaded',
          `${result.uploaded.length} file${result.uploaded.length > 1 ? 's' : ''} uploaded successfully`
        );
      }

      if (result.errors && result.errors.length > 0) {
        result.errors.forEach((err) => {
          toast.error('Upload failed', `${err.filename}: ${err.error}`);
        });
      }
    } catch (error) {
      toast.error('Upload failed', error instanceof Error ? error.message : 'Unknown error');
    }
  };

  const handleDelete = async (file: CompanyFile) => {
    if (!companyId) return;

    setDeletingId(file.id);
    try {
      await deleteFile.mutateAsync({ fileId: file.id, companyId });
      toast.success('File deleted', file.originalName);
    } catch (error) {
      toast.error('Delete failed', error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setDeletingId(null);
    }
  };

  const handleZoneClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className={styles.fileUploadZone}>
      <h2 className={styles.title}>File Upload Zone</h2>

      <div
        className={`${styles.dropZone} ${isDragging ? styles.dropZoneDragging : ''} ${uploadFiles.isPending ? styles.dropZoneUploading : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleZoneClick}
      >
        {uploadFiles.isPending ? (
          <>
            <Loader2 className={styles.uploadIconSpinning} />
            <div className={styles.dropText}>Uploading...</div>
          </>
        ) : (
          <>
            <Upload className={styles.uploadIcon} />
            <div className={styles.dropText}>
              Drag & drop files here or click to upload
            </div>
            <div className={styles.supportedTypes}>
              PDF, DOCX, PNG, JPG, GIF, WebP (max 10MB)
            </div>
          </>
        )}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={ACCEPTED_TYPES}
          onChange={handleFileInput}
          className={styles.fileInput}
        />
      </div>

      {isLoading ? (
        <div className={styles.loadingFiles}>
          <Loader2 size={16} className={styles.spinner} />
          <span>Loading files...</span>
        </div>
      ) : files.length > 0 ? (
        <div className={styles.fileList}>
          <div className={styles.fileListHeader}>Uploaded Files ({files.length})</div>
          {files.map((file) => (
            <div key={file.id} className={styles.fileItem}>
              <div className={styles.fileInfo}>
                {getFileIcon(file.mimeType)}
                <a
                  href={file.s3Url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.fileName}
                  onClick={(e) => e.stopPropagation()}
                >
                  {file.originalName}
                </a>
                <span className={styles.fileSize}>{formatFileSize(file.size)}</span>
              </div>
              <button
                className={styles.deleteButton}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(file);
                }}
                disabled={deletingId === file.id}
                title="Delete file"
              >
                {deletingId === file.id ? (
                  <Loader2 size={16} className={styles.spinner} />
                ) : (
                  <Trash2 size={16} />
                )}
              </button>
            </div>
          ))}
        </div>
      ) : null}
    </Card>
  );
}
