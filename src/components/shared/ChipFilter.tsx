import React from 'react';
import styles from './ChipFilter.module.css';

export interface ChipOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface ChipFilterProps {
  options: ChipOption[];
  selected: string;
  onSelect: (value: string) => void;
  className?: string;
}

export function ChipFilter({ options, selected, onSelect, className = '' }: ChipFilterProps) {
  return (
    <div className={`${styles.container} ${className}`}>
      {options.map((option) => (
        <button
          key={option.value}
          className={`${styles.chip} ${selected === option.value ? styles.chipActive : ''}`}
          onClick={() => onSelect(option.value)}
          type="button"
        >
          {option.icon && <span className={styles.chipIcon}>{option.icon}</span>}
          {option.label}
        </button>
      ))}
    </div>
  );
}
