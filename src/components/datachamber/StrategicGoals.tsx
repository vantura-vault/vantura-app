import { useState } from 'react';
import { CheckCircle2, Circle, Edit2, Check, X, Plus } from 'lucide-react';
import { Card } from '../shared/Card';
import styles from './StrategicGoals.module.css';

interface Goal {
  label: string;
  current: number;
  target: number;
  unit?: string;
  achieved: boolean;
}

interface StrategicGoalsProps {
  quarter: string;
  goals: Goal[];
  onUpdate: (goals: Goal[]) => void;
}

export function StrategicGoals({ quarter, goals, onUpdate }: StrategicGoalsProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editedGoal, setEditedGoal] = useState<Goal | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setEditedGoal({ ...goals[index] });
    setIsAddingNew(false);
  };

  const handleAddNew = () => {
    setIsAddingNew(true);
    setEditingIndex(null);
    setEditedGoal({
      label: '',
      current: 0,
      target: 0,
      unit: '',
      achieved: false,
    });
  };

  const handleSave = () => {
    if (editedGoal) {
      if (isAddingNew) {
        // Add new goal
        const newGoals = [...goals, editedGoal];
        onUpdate(newGoals);
        setIsAddingNew(false);
      } else if (editingIndex !== null) {
        // Update existing goal
        const newGoals = [...goals];
        newGoals[editingIndex] = editedGoal;
        onUpdate(newGoals);
        setEditingIndex(null);
      }
      setEditedGoal(null);
    }
  };

  const handleCancel = () => {
    setEditingIndex(null);
    setEditedGoal(null);
    setIsAddingNew(false);
  };
  return (
    <Card className={styles.strategicGoals}>
      <div className={styles.header}>
        <h2 className={styles.title}>{quarter} Strategic Goals</h2>
        {!isAddingNew && editingIndex === null && (
          <button onClick={handleAddNew} className={styles.addButton}>
            <Plus size={16} />
          </button>
        )}
      </div>
      <div className={styles.goalsList}>
        {goals.map((goal, index) => {
          const isEditing = editingIndex === index;
          const currentGoal = isEditing && editedGoal ? editedGoal : goal;
          const displayValue = currentGoal.unit === '%'
            ? `${currentGoal.current}${currentGoal.unit}`
            : currentGoal.current >= 1000
            ? `${(currentGoal.current / 1000).toFixed(1)}K`
            : currentGoal.current.toString();

          return (
            <div key={index} className={styles.goalItem}>
              {isEditing ? (
                <>
                  <input
                    type="number"
                    className={styles.editInput}
                    value={editedGoal?.current || 0}
                    onChange={(e) => setEditedGoal(prev => prev ? { ...prev, current: Number(e.target.value) } : null)}
                  />
                  <div className={styles.goalInfo}>
                    <input
                      type="text"
                      className={styles.editLabel}
                      value={editedGoal?.label || ''}
                      onChange={(e) => setEditedGoal(prev => prev ? { ...prev, label: e.target.value } : null)}
                    />
                    <div className={styles.editTarget}>
                      <span>Target:</span>
                      <input
                        type="number"
                        className={styles.editTargetInput}
                        value={editedGoal?.target || 0}
                        onChange={(e) => setEditedGoal(prev => prev ? { ...prev, target: Number(e.target.value) } : null)}
                      />
                    </div>
                  </div>
                  <div className={styles.editActions}>
                    <button onClick={handleSave} className={styles.saveButton}>
                      <Check size={18} />
                    </button>
                    <button onClick={handleCancel} className={styles.cancelButton}>
                      <X size={18} />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className={styles.goalValue}>{displayValue}</div>
                  <div className={styles.goalInfo}>
                    <div className={styles.goalLabel}>{currentGoal.label}</div>
                    <div className={styles.goalTarget}>
                      Target: {currentGoal.unit === '%' ? `${currentGoal.target}${currentGoal.unit}` : currentGoal.target.toLocaleString()}
                    </div>
                  </div>
                  <div className={styles.goalActions}>
                    <button onClick={() => handleEdit(index)} className={styles.editButton}>
                      <Edit2 size={16} />
                    </button>
                    <div className={styles.goalStatus}>
                      {currentGoal.achieved ? (
                        <CheckCircle2 size={24} className={styles.iconAchieved} />
                      ) : (
                        <Circle size={24} className={styles.iconPending} />
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          );
        })}
        {isAddingNew && editedGoal && (
          <div className={styles.goalItem}>
            <input
              type="number"
              className={styles.editInput}
              value={editedGoal.current || 0}
              onChange={(e) => setEditedGoal(prev => prev ? { ...prev, current: Number(e.target.value) } : null)}
              placeholder="0"
            />
            <div className={styles.goalInfo}>
              <input
                type="text"
                className={styles.editLabel}
                value={editedGoal.label || ''}
                onChange={(e) => setEditedGoal(prev => prev ? { ...prev, label: e.target.value } : null)}
                placeholder="Goal name..."
              />
              <div className={styles.editTarget}>
                <span>Target:</span>
                <input
                  type="number"
                  className={styles.editTargetInput}
                  value={editedGoal.target || 0}
                  onChange={(e) => setEditedGoal(prev => prev ? { ...prev, target: Number(e.target.value) } : null)}
                  placeholder="0"
                />
                <input
                  type="text"
                  className={styles.editUnitInput}
                  value={editedGoal.unit || ''}
                  onChange={(e) => setEditedGoal(prev => prev ? { ...prev, unit: e.target.value } : null)}
                  placeholder="Unit (%, K, etc.)"
                />
              </div>
            </div>
            <div className={styles.editActions}>
              <button onClick={handleSave} className={styles.saveButton}>
                <Check size={18} />
              </button>
              <button onClick={handleCancel} className={styles.cancelButton}>
                <X size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
