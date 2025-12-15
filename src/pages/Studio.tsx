import { useState } from 'react';
import { useCompanyId } from '../hooks/useCompanyId';
import { useBlueprints } from '../hooks/useBlueprints';
import { BlueprintSelector } from '../components/studio/BlueprintSelector';
import { StudioWorkspace } from '../components/studio/StudioWorkspace';
import type { Blueprint } from '../types/blueprint';
import styles from './Studio.module.css';

export function Studio() {
  const companyId = useCompanyId();
  const [selectedBlueprint, setSelectedBlueprint] = useState<Blueprint | null>(null);

  const { data, isLoading, error } = useBlueprints({
    companyId,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const handleSelectBlueprint = (blueprint: Blueprint) => {
    setSelectedBlueprint(blueprint);
  };

  const handleBack = () => {
    setSelectedBlueprint(null);
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading blueprints...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>Failed to load blueprints. Please try again.</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {selectedBlueprint ? (
        <StudioWorkspace blueprint={selectedBlueprint} onBack={handleBack} />
      ) : (
        <>
          <header className={styles.header}>
            <h1 className={styles.title}>Studio</h1>
            <p className={styles.subtitle}>
              Select a blueprint to refine and craft your perfect post
            </p>
          </header>
          <BlueprintSelector
            blueprints={data?.blueprints || []}
            onSelect={handleSelectBlueprint}
          />
        </>
      )}
    </div>
  );
}
