import { useState, useRef, useEffect } from 'react';
import { StickyNote } from 'lucide-react';
import { Card } from '../shared/Card';
import styles from './PersonalNotes.module.css';

interface PersonalNotesProps {
  notes: string;
  onUpdate: (notes: string) => void;
}

export function PersonalNotes({ notes, onUpdate }: PersonalNotesProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedNotes, setEditedNotes] = useState(notes);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(
        textareaRef.current.value.length,
        textareaRef.current.value.length
      );
    }
  }, [isEditing]);

  const handleSave = () => {
    onUpdate(editedNotes);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setEditedNotes(notes);
      setIsEditing(false);
    }
    if (e.key === 'Enter' && e.metaKey) {
      handleSave();
    }
  };

  return (
    <Card className={styles.personalNotes}>
      <div className={styles.header}>
        <StickyNote size={20} className={styles.icon} />
        <h2 className={styles.title}>Personal Notes</h2>
      </div>

      <div className={styles.content}>
        {isEditing ? (
          <div className={styles.editContainer}>
            <textarea
              ref={textareaRef}
              className={styles.textArea}
              value={editedNotes}
              onChange={(e) => setEditedNotes(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleSave}
              placeholder="Write your notes, ideas, reminders..."
            />
            <span className={styles.editHint}>Esc to cancel · Cmd+Enter to save</span>
          </div>
        ) : (
          <div
            className={styles.notesDisplay}
            onClick={() => {
              setEditedNotes(notes);
              setIsEditing(true);
            }}
          >
            {notes ? (
              <p className={styles.notesText}>{notes}</p>
            ) : (
              <p className={styles.placeholder}>Click to add notes...</p>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
