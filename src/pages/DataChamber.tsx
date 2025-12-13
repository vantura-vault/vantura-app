import { useState } from 'react';
import { ProfileCard } from '../components/datachamber/ProfileCard';
import { ProfilePictureModal } from '../components/datachamber/ProfilePictureModal';
import { CompanyValues } from '../components/datachamber/CompanyValues';
import { DataHealthMonitor } from '../components/datachamber/DataHealthMonitor';
import { IntegrationsPanel } from '../components/datachamber/IntegrationsPanel';
import { FileUploadZone } from '../components/datachamber/FileUploadZone';
import { useAuthStore } from '../store/authStore';
import { useDashboard, useDataChamberSettings, useUpdateDataChamberSettings } from '../hooks';
import { syncLinkedInProfile } from '../api/endpoints';
import { toast } from '../store/toastStore';
import styles from './DataChamber.module.css';

export function DataChamber() {
  const user = useAuthStore((state) => state.user);
  const { data: dashboard } = useDashboard();
  const companyId = user?.companyId || dashboard?.company?.id;

  // Fetch data chamber settings from API
  const { data: settings, isLoading } = useDataChamberSettings(companyId);
  const updateSettings = useUpdateDataChamberSettings();

  // Modal state
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isSyncingLinkedIn, setIsSyncingLinkedIn] = useState(false);

  // LinkedIn integration config
  const [linkedInConfig, setLinkedInConfig] = useState({
    url: settings?.linkedInUrl || '',
    type: (settings?.linkedInType as 'profile' | 'company') || 'company',
    enabled: true,
  });

  // Use data from API or fallback to defaults
  const companyValues = {
    values: settings?.values || ['Innovation', 'Transparency', 'Customer-First', 'Data-Driven'],
    brandVoice: settings?.brandVoice || 'Professional yet approachable. We speak with authority on industry trends while remaining accessible to founders and decision-makers.',
    targetAudience: settings?.targetAudience || 'B2B SaaS founders, marketing leaders, and growth teams at early to mid-stage startups.',
  };

  const handleLinkedInChange = (config: typeof linkedInConfig) => {
    setLinkedInConfig(config);
    // Save to backend
    if (companyId) {
      updateSettings.mutate({
        companyId,
        settings: {
          linkedInUrl: config.url,
          linkedInType: config.type,
        },
      });
    }
  };

  const handleSyncLinkedIn = async (url: string, type: 'profile' | 'company') => {
    if (!companyId) return;

    setIsSyncingLinkedIn(true);
    try {
      const result = await syncLinkedInProfile(companyId, url, type);

      if (result.profilePictureUrl || result.followers) {
        // Update the profile picture
        if (result.profilePictureUrl) {
          updateSettings.mutate({
            companyId,
            settings: {
              profilePictureUrl: result.profilePictureUrl,
              linkedInUrl: url,
              linkedInType: type,
            },
          });
        }

        // Build success message
        const updates: string[] = [];
        if (result.profilePictureUrl) updates.push('profile picture');
        if (result.followers) updates.push(`${result.followers.toLocaleString()} followers`);

        toast.success('LinkedIn synced', `Updated: ${updates.join(', ')}`);
      } else {
        toast.info('LinkedIn synced', 'No data found');
      }
    } catch (error) {
      console.error('Failed to sync LinkedIn:', error);
      toast.error('Sync failed', 'Could not fetch LinkedIn data. Please try again.');
    } finally {
      setIsSyncingLinkedIn(false);
    }
  };


  const handleUpdateValues = (updatedValues: typeof companyValues) => {
    if (!companyId) {
      console.error('No companyId available');
      return;
    }

    console.log('Updating company values:', updatedValues);
    updateSettings.mutate({
      companyId,
      settings: {
        values: updatedValues.values,
        brandVoice: updatedValues.brandVoice,
        targetAudience: updatedValues.targetAudience,
      },
    }, {
      onSuccess: (data) => {
        console.log('Company values updated successfully:', data);
      },
      onError: (error) => {
        console.error('Error updating company values:', error);
      },
    });
  };

  const handleUpdateProfilePicture = (url: string) => {
    if (!companyId) {
      console.error('No companyId available');
      return;
    }

    console.log('Updating profile picture:', url);
    updateSettings.mutate({
      companyId,
      settings: {
        profilePictureUrl: url,
      },
    }, {
      onSuccess: (data) => {
        console.log('Profile picture updated successfully:', data);
      },
      onError: (error) => {
        console.error('Error updating profile picture:', error);
      },
    });
  };

  // Get profile information from user and company data
  const profileName = dashboard?.company?.name || user?.name || 'User';
  const profileTitle = dashboard?.company?.industry || 'Strategic Intelligence Platform';

  if (isLoading) {
    return (
      <div className={styles.dataChamber}>
        <div className={styles.header}>
          <h1 className={styles.title}>Data Chamber</h1>
          <p className={styles.subtitle}>Loading your intelligence hub...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.dataChamber}>
      <div className={styles.header}>
        <h1 className={styles.title}>Data Chamber</h1>
        <p className={styles.subtitle}>Your Connected Intelligence Hub</p>
      </div>

      <div className={styles.layout}>
        <ProfileCard
          name={profileName}
          avatarUrl={settings?.profilePictureUrl || user?.avatar}
          title={profileTitle}
          onAvatarClick={() => setIsProfileModalOpen(true)}
        />
        <CompanyValues
          values={companyValues.values}
          brandVoice={companyValues.brandVoice}
          targetAudience={companyValues.targetAudience}
          onUpdate={handleUpdateValues}
        />
        <DataHealthMonitor companyId={companyId} />
        <IntegrationsPanel
          linkedIn={linkedInConfig}
          onLinkedInChange={handleLinkedInChange}
          onSyncLinkedIn={handleSyncLinkedIn}
          isSyncing={isSyncingLinkedIn}
        />
        <FileUploadZone companyId={companyId} />
      </div>

      <ProfilePictureModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        currentUrl={settings?.profilePictureUrl}
        companyName={profileName}
        onUpdate={handleUpdateProfilePicture}
        isUpdating={updateSettings.isPending}
      />
    </div>
  );
}
