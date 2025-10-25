import { Card } from '../components/shared/Card';
import styles from './DataChamber.module.css';

export function DataChamber() {
  return (
    <div className={styles.dataChamber}>
      <Card>
        <h2>Data Chamber</h2>
        <p className={styles.subtitle}>Your strategic data repository</p>
        {/* Content will be added here */}
      </Card>
    </div>
  );
}
