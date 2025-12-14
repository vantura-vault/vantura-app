import { useState } from 'react';
import { FileText, X, Plus, FolderOpen } from 'lucide-react';
import { useFiles } from '../../hooks';
import styles from './FileAttachmentSection.module.css';

// FileAttachmentSection - Allows users to attach documents from Data Chamber

interface AttachedDocument {
  fileId: string;
  fileName: string;
  description: string;
}

interface FileAttachmentSectionProps {
  companyId: string;
  attachedDocuments: AttachedDocument[];
  onAttach: (doc: AttachedDocument) => void;
  onRemove: (fileId: string) => void;
  onUpdateDescription: (fileId: string, description: string) => void;
}

export function FileAttachmentSection({
  companyId,
  attachedDocuments,
  onAttach,
  onRemove,
  onUpdateDescription,
}: FileAttachmentSectionProps) {
  const [showFileSelector, setShowFileSelector] = useState(false);
  const { data: files, isLoading: filesLoading } = useFiles(companyId);

  const availableFiles = (files || []).filter(
    (file) => !attachedDocuments.some((doc) => doc.fileId === file.id)
  );

  const handleSelectFile = (file: { id: string; originalName: string }) => {
    onAttach({
      fileId: file.id,
      fileName: file.originalName,
      description: '',
    });
    setShowFileSelector(false);
  };

  return (
    <div className={styles.container}>
      {/* Attached documents list */}
      {attachedDocuments.length > 0 && (
        <div className={styles.attachedList}>
          {attachedDocuments.map((doc) => (
            <div key={doc.fileId} className={styles.attachedItem}>
              <div className={styles.fileHeader}>
                <div className={styles.fileInfo}>
                  <FileText size={16} className={styles.fileIcon} />
                  <span className={styles.fileName}>{doc.fileName}</span>
                </div>
                <button
                  type="button"
                  className={styles.removeButton}
                  onClick={() => onRemove(doc.fileId)}
                  title="Remove document"
                >
                  <X size={14} />
                </button>
              </div>
              <input
                type="text"
                className={styles.descriptionInput}
                value={doc.description}
                onChange={(e) => onUpdateDescription(doc.fileId, e.target.value)}
                placeholder="How should this document be used? (required)"
              />
            </div>
          ))}
        </div>
      )}

      {/* Add document button */}
      <button
        type="button"
        className={styles.addButton}
        onClick={() => setShowFileSelector(!showFileSelector)}
      >
        <FolderOpen size={16} />
        Add from Data Chamber
      </button>

      {/* File selector dropdown */}
      {showFileSelector && (
        <div className={styles.fileSelector}>
          {filesLoading ? (
            <div className={styles.loadingMessage}>Loading files...</div>
          ) : availableFiles.length === 0 ? (
            <div className={styles.emptyMessage}>
              {!files || files.length === 0
                ? 'No files in Data Chamber. Upload files in the Data Chamber section first.'
                : 'All files already attached.'}
            </div>
          ) : (
            <div className={styles.fileList}>
              {availableFiles.map((file) => (
                <button
                  key={file.id}
                  type="button"
                  className={styles.fileOption}
                  onClick={() => handleSelectFile(file)}
                >
                  <FileText size={14} />
                  <span className={styles.fileOptionName}>{file.originalName}</span>
                  <Plus size={14} className={styles.addIcon} />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
