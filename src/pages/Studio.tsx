import { PageHeader } from '../components/shared/PageHeader';
import { DraftsList } from '../components/studio/DraftsList';
import styles from './Studio.module.css';

export function Studio() {
  return (
    <div className={styles.container}>
      <PageHeader
        title="Studio"
        subtitle="Your post drafts and works in progress"
      />

      {/* Drafts List */}
      <div className={styles.tabContent}>
        <DraftsList />
      </div>
    </div>
  );
}
