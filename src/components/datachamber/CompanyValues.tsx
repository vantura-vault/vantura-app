import { useState, useRef, useEffect } from 'react';
import { Plus, X, Sparkles, Users, MessageSquare } from 'lucide-react';
import { Card } from '../shared/Card';
import styles from './CompanyValues.module.css';

interface CompanyValuesProps {
  values: string[];
  brandVoice: string;
  targetAudience: string;
  onUpdate: (data: { values: string[]; brandVoice: string; targetAudience: string }) => void;
}

export function CompanyValues({ values, brandVoice, targetAudience, onUpdate }: CompanyValuesProps) {
  const [editingField, setEditingField] = useState<'values' | 'brandVoice' | 'targetAudience' | null>(null);
  const [editedValues, setEditedValues] = useState<string[]>(values);
  const [editedBrandVoice, setEditedBrandVoice] = useState(brandVoice);
  const [editedTargetAudience, setEditedTargetAudience] = useState(targetAudience);
  const [newValue, setNewValue] = useState('');

  const brandVoiceRef = useRef<HTMLTextAreaElement>(null);
  const targetAudienceRef = useRef<HTMLTextAreaElement>(null);
  const newValueRef = useRef<HTMLInputElement>(null);

  // Focus input when entering edit mode
  useEffect(() => {
    if (editingField === 'brandVoice' && brandVoiceRef.current) {
      brandVoiceRef.current.focus();
      brandVoiceRef.current.setSelectionRange(brandVoiceRef.current.value.length, brandVoiceRef.current.value.length);
    } else if (editingField === 'targetAudience' && targetAudienceRef.current) {
      targetAudienceRef.current.focus();
      targetAudienceRef.current.setSelectionRange(targetAudienceRef.current.value.length, targetAudienceRef.current.value.length);
    } else if (editingField === 'values' && newValueRef.current) {
      newValueRef.current.focus();
    }
  }, [editingField]);

  const handleSaveField = (field: 'brandVoice' | 'targetAudience') => {
    onUpdate({
      values: editedValues,
      brandVoice: field === 'brandVoice' ? editedBrandVoice : brandVoice,
      targetAudience: field === 'targetAudience' ? editedTargetAudience : targetAudience,
    });
    setEditingField(null);
  };

  const handleAddValue = () => {
    if (newValue.trim()) {
      const updatedValues = [...editedValues, newValue.trim()];
      setEditedValues(updatedValues);
      onUpdate({
        values: updatedValues,
        brandVoice,
        targetAudience,
      });
      setNewValue('');
    }
  };

  const handleRemoveValue = (index: number) => {
    const updatedValues = editedValues.filter((_, i) => i !== index);
    setEditedValues(updatedValues);
    onUpdate({
      values: updatedValues,
      brandVoice,
      targetAudience,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent, field: 'brandVoice' | 'targetAudience') => {
    if (e.key === 'Escape') {
      setEditingField(null);
      if (field === 'brandVoice') setEditedBrandVoice(brandVoice);
      if (field === 'targetAudience') setEditedTargetAudience(targetAudience);
    }
    if (e.key === 'Enter' && e.metaKey) {
      handleSaveField(field);
    }
  };

  return (
    <Card className={styles.companyValues}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h2 className={styles.title}>Brand Identity</h2>
          <p className={styles.subtitle}>Define your voice and values to power AI-generated content</p>
        </div>
      </div>

      <div className={styles.content}>
        {/* Core Values - Left side */}
        <div className={styles.valuesSection}>
          <div className={styles.sectionHeader}>
            <Sparkles size={18} className={styles.sectionIcon} />
            <h3 className={styles.sectionTitle}>Core Values</h3>
          </div>

          <div className={styles.valuesList}>
            {editedValues.map((value, index) => (
              <div key={index} className={styles.valueTag}>
                <span>{value}</span>
                <button
                  onClick={() => handleRemoveValue(index)}
                  className={styles.removeButton}
                  aria-label={`Remove ${value}`}
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>

          <div className={styles.addValueRow}>
            <input
              ref={newValueRef}
              type="text"
              className={styles.valueInput}
              placeholder="Add a value..."
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddValue()}
              onFocus={() => setEditingField('values')}
            />
            <button
              onClick={handleAddValue}
              className={styles.addButton}
              disabled={!newValue.trim()}
            >
              <Plus size={16} />
            </button>
          </div>
        </div>

        {/* Brand Voice & Target Audience - Right side */}
        <div className={styles.textSections}>
          {/* Brand Voice */}
          <div className={styles.textSection}>
            <div className={styles.sectionHeader}>
              <MessageSquare size={18} className={styles.sectionIcon} />
              <h3 className={styles.sectionTitle}>Brand Voice</h3>
            </div>

            {editingField === 'brandVoice' ? (
              <div className={styles.editContainer}>
                <textarea
                  ref={brandVoiceRef}
                  className={styles.textArea}
                  value={editedBrandVoice}
                  onChange={(e) => setEditedBrandVoice(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, 'brandVoice')}
                  onBlur={() => handleSaveField('brandVoice')}
                  placeholder="Describe your brand's voice and tone..."
                  rows={4}
                />
                <span className={styles.editHint}>Press Esc to cancel, Cmd+Enter to save</span>
              </div>
            ) : (
              <p
                className={styles.text}
                onClick={() => {
                  setEditedBrandVoice(brandVoice);
                  setEditingField('brandVoice');
                }}
              >
                {brandVoice || <span className={styles.placeholder}>Click to add your brand voice...</span>}
              </p>
            )}
          </div>

          {/* Target Audience */}
          <div className={styles.textSection}>
            <div className={styles.sectionHeader}>
              <Users size={18} className={styles.sectionIcon} />
              <h3 className={styles.sectionTitle}>Target Audience</h3>
            </div>

            {editingField === 'targetAudience' ? (
              <div className={styles.editContainer}>
                <textarea
                  ref={targetAudienceRef}
                  className={styles.textArea}
                  value={editedTargetAudience}
                  onChange={(e) => setEditedTargetAudience(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, 'targetAudience')}
                  onBlur={() => handleSaveField('targetAudience')}
                  placeholder="Describe your target audience..."
                  rows={4}
                />
                <span className={styles.editHint}>Press Esc to cancel, Cmd+Enter to save</span>
              </div>
            ) : (
              <p
                className={styles.text}
                onClick={() => {
                  setEditedTargetAudience(targetAudience);
                  setEditingField('targetAudience');
                }}
              >
                {targetAudience || <span className={styles.placeholder}>Click to define your target audience...</span>}
              </p>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
