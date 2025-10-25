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

export function TimeframeSelector({ selected, onChange }: TimeframeSelectorProps) {
  return (
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
  );
}
