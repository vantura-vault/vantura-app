import { Calendar } from 'lucide-react';
import styles from './TimeframeSelector.module.css';

export type Timeframe = 'month' | '6months' | 'year' | 'all';

interface TimeframeSelectorProps {
  selected: Timeframe;
  onChange: (timeframe: Timeframe) => void;
}

const timeframes: { value: Timeframe; label: string }[] = [
  { value: 'month', label: '1M' },
  { value: '6months', label: '6M' },
  { value: 'year', label: '1Y' },
  { value: 'all', label: 'All' },
];

// Get date range based on timeframe
const getDateRange = (timeframe: Timeframe) => {
  const endDate = new Date();
  const startDate = new Date();

  switch (timeframe) {
    case 'month':
      startDate.setMonth(startDate.getMonth() - 1);
      break;
    case '6months':
      startDate.setMonth(startDate.getMonth() - 6);
      break;
    case 'year':
      startDate.setFullYear(startDate.getFullYear() - 1);
      break;
    case 'all':
      startDate.setFullYear(startDate.getFullYear() - 2);
      break;
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return `${formatDate(startDate)} - ${formatDate(endDate)}`;
};

export function TimeframeSelector({ selected, onChange }: TimeframeSelectorProps) {
  return (
    <div className={styles.container}>
      <button className={styles.dateRangeButton}>
        <Calendar size={16} />
        <span>{getDateRange(selected)}</span>
      </button>
      <div className={styles.selector}>
        {timeframes.map((timeframe) => (
          <button
            key={timeframe.value}
            className={`${styles.button} ${selected === timeframe.value ? styles.active : ''}`}
            onClick={() => onChange(timeframe.value)}
          >
            {timeframe.label}
          </button>
        ))}
      </div>
    </div>
  );
}
