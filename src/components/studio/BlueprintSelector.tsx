import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Linkedin, Twitter, Instagram, ArrowRight } from 'lucide-react';
import type { Blueprint } from '../../types/blueprint';
import styles from './BlueprintSelector.module.css';

interface BlueprintSelectorProps {
  blueprints: Blueprint[];
  onSelect: (blueprint: Blueprint) => void;
}

const platformIcons: Record<string, typeof Linkedin> = {
  LinkedIn: Linkedin,
  Twitter: Twitter,
  Instagram: Instagram,
};

const platformFilters = [
  { id: 'All', label: 'All', comingSoon: false },
  { id: 'LinkedIn', label: 'LinkedIn', comingSoon: false },
  { id: 'Twitter', label: 'Twitter', comingSoon: true },
  { id: 'Instagram', label: 'Instagram', comingSoon: true },
];

export function BlueprintSelector({ blueprints, onSelect }: BlueprintSelectorProps) {
  const [platformFilter, setPlatformFilter] = useState('All');

  // Only show LinkedIn blueprints (other platforms coming soon)
  const supportedBlueprints = blueprints.filter((b) => b.platform === 'LinkedIn');

  const filteredBlueprints = platformFilter === 'All'
    ? supportedBlueprints
    : supportedBlueprints.filter((b) => b.platform === platformFilter);

  if (blueprints.length === 0) {
    return (
      <div className={styles.emptyState}>
        <FileText size={48} className={styles.emptyIcon} />
        <h2 className={styles.emptyTitle}>No blueprints yet</h2>
        <p className={styles.emptyText}>
          Create a blueprint first to start refining your posts in the Studio
        </p>
        <Link to="/blueprint" className={styles.createButton}>
          Create Blueprint
          <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.selector}>
      <div className={styles.filters}>
        {platformFilters.map((filter) => (
          <button
            key={filter.id}
            className={`${styles.filterChip} ${platformFilter === filter.id ? styles.active : ''} ${filter.comingSoon ? styles.disabled : ''}`}
            onClick={() => !filter.comingSoon && setPlatformFilter(filter.id)}
            disabled={filter.comingSoon}
          >
            {filter.label}
            {filter.comingSoon && <span className={styles.comingSoon}>Soon</span>}
          </button>
        ))}
      </div>

      <div className={styles.grid}>
        {filteredBlueprints.map((blueprint) => {
          const PlatformIcon = platformIcons[blueprint.platform] || FileText;
          return (
            <button
              key={blueprint.id}
              className={styles.card}
              onClick={() => onSelect(blueprint)}
            >
              <div className={styles.cardHeader}>
                <PlatformIcon size={18} className={styles.platformIcon} />
                <span className={styles.platform}>{blueprint.platform}</span>
              </div>
              <h3 className={styles.cardTitle}>{blueprint.title}</h3>
              <p className={styles.cardHook}>{blueprint.hook}</p>
              <div className={styles.cardFooter}>
                <span className={styles.date}>
                  {new Date(blueprint.createdAt).toLocaleDateString()}
                </span>
                <ArrowRight size={16} className={styles.arrow} />
              </div>
            </button>
          );
        })}
      </div>

      {filteredBlueprints.length === 0 && (
        <div className={styles.noResults}>
          No blueprints found for {platformFilter}
        </div>
      )}
    </div>
  );
}
