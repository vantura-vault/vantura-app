import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import { useBlueprints, useCompanyId } from '../../hooks';
import { PlatformIcon } from '../shared/PlatformIcon';
import type { Blueprint } from '../../types/blueprint';
import styles from './RecentBlueprints.module.css';

export function RecentBlueprints() {
  const navigate = useNavigate();
  const companyId = useCompanyId();
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const { data, isLoading } = useBlueprints({
    companyId,
    sortBy: 'createdAt',
    sortOrder: 'desc',
    limit: 10,
    offset: 0,
  });

  const blueprints = data?.blueprints || [];

  const updateScrollButtons = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = 300;
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
      // Update buttons after scroll animation
      setTimeout(updateScrollButtons, 350);
    }
  };

  const handleBlueprintClick = (blueprint: Blueprint) => {
    // Navigate to blueprints page with saved tab active and open this blueprint
    navigate('/blueprint', {
      state: {
        tab: 'saved',
        openBlueprintId: blueprint.id
      }
    });
  };

  if (isLoading) {
    return (
      <section className={styles.section}>
        <div className={styles.header}>
          <div className={styles.iconHeader}>
            <span className={styles.icon}>
              <FileText size={28} />
            </span>
            <div>
              <h3 className={styles.title}>Recent Blueprints</h3>
              <p className={styles.subtitle}>Your recently saved content strategies</p>
            </div>
          </div>
        </div>
        <div className={styles.loading}>Loading blueprints...</div>
      </section>
    );
  }

  if (blueprints.length === 0) {
    return (
      <section className={styles.section}>
        <div className={styles.header}>
          <div className={styles.iconHeader}>
            <span className={styles.icon}>
              <FileText size={28} />
            </span>
            <div>
              <h3 className={styles.title}>Recent Blueprints</h3>
              <p className={styles.subtitle}>Your recently saved content strategies</p>
            </div>
          </div>
        </div>
        <div className={styles.empty}>
          <p>No blueprints saved yet. Generate and save blueprints to see them here.</p>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <div className={styles.iconHeader}>
          <span className={styles.icon}>
            <FileText size={28} />
          </span>
          <div>
            <h3 className={styles.title}>Recent Blueprints</h3>
            <p className={styles.subtitle}>Your recently saved content strategies</p>
          </div>
        </div>

        <div className={styles.navButtons}>
          <button
            className={`${styles.navButton} ${!canScrollLeft ? styles.disabled : ''}`}
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            aria-label="Scroll left"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            className={`${styles.navButton} ${!canScrollRight ? styles.disabled : ''}`}
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            aria-label="Scroll right"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div
        className={styles.carousel}
        ref={carouselRef}
        onScroll={updateScrollButtons}
      >
        {blueprints.map((blueprint) => (
          <div
            key={blueprint.id}
            className={styles.card}
            onClick={() => handleBlueprintClick(blueprint)}
            role="button"
            tabIndex={0}
          >
            <div className={styles.cardContent}>
              <h4 className={styles.cardTitle}>{blueprint.title}</h4>
            </div>
            <div className={styles.platformIcon}>
              <PlatformIcon platform={blueprint.platform} size={32} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
