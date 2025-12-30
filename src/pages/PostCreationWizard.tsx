import { useEffect, useCallback, useState, useMemo } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { WizardProgress } from '../components/studio/wizard/WizardProgress';
import { StepOverview } from '../components/studio/wizard/StepOverview';
import { StepVisualBuilder } from '../components/studio/wizard/StepVisualBuilder';
import { StepCaptionBuilder } from '../components/studio/wizard/StepCaptionBuilder';
import { StepUpload } from '../components/studio/wizard/StepUpload';
import { AIAssistantPanel } from '../components/studio/wizard/AIAssistantPanel';
import { useDraft, useUpdateDraft } from '../hooks/useDrafts';
import { useBlueprint } from '../hooks/useBlueprints';
import { useCompanyId } from '../hooks/useCompanyId';
import type { WizardStep, CaptionSubStep } from '../types/draft';
import { WIZARD_STEPS, CAPTION_SUB_STEPS } from '../types/draft';
import styles from './PostCreationWizard.module.css';

export function PostCreationWizard() {
  const { blueprintId } = useParams<{ blueprintId: string }>();
  const [searchParams] = useSearchParams();
  const draftId = searchParams.get('draftId');
  const navigate = useNavigate();
  const companyId = useCompanyId();

  // Local state
  const [currentStep, setCurrentStep] = useState<WizardStep>(1);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [selectedHashtags, setSelectedHashtags] = useState<string[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Caption sub-step state
  const [captionSubStep, setCaptionSubStep] = useState<CaptionSubStep>(1);
  const [captionHook, setCaptionHook] = useState('');
  const [captionBody, setCaptionBody] = useState('');
  const [captionEngagement, setCaptionEngagement] = useState('');
  const [captionCta, setCaptionCta] = useState('');

  // Queries and mutations
  const { data: blueprint, isLoading: isBlueprintLoading } = useBlueprint(blueprintId || '', companyId || '');
  const { data: draftData, isLoading: isDraftLoading } = useDraft(draftId || '');
  const updateDraftMutation = useUpdateDraft();

  // Initialize state from draft data
  useEffect(() => {
    if (isInitialized || isDraftLoading) return;

    if (draftData) {
      setCurrentStep((draftData.currentStep || 1) as WizardStep);
      setImageUrl(draftData.imageUrl);
      setSelectedHashtags(draftData.selectedHashtags || []);
      // Initialize caption parts
      setCaptionSubStep((draftData.captionSubStep || 1) as CaptionSubStep);
      setCaptionHook(draftData.captionHook || '');
      setCaptionBody(draftData.captionBody || '');
      setCaptionEngagement(draftData.captionEngagement || '');
      setCaptionCta(draftData.captionCta || '');
      setIsInitialized(true);
    } else if (!draftId) {
      // No draft ID provided - this shouldn't happen in normal flow
      // but handle gracefully by initializing with defaults
      setIsInitialized(true);
    }
  }, [draftData, draftId, isDraftLoading, isInitialized]);

  // Compute combined caption from parts
  const combinedCaption = useMemo(() => {
    return [captionHook, captionBody, captionEngagement, captionCta]
      .filter(Boolean)
      .join('\n\n');
  }, [captionHook, captionBody, captionEngagement, captionCta]);

  // Auto-save when state changes (debounced through mutation)
  const saveProgress = useCallback(
    (updates: {
      imageUrl?: string | null;
      caption?: string;
      selectedHashtags?: string[];
      currentStep?: WizardStep;
      captionSubStep?: CaptionSubStep;
      captionHook?: string;
      captionBody?: string;
      captionEngagement?: string;
      captionCta?: string;
    }) => {
      if (!draftId) return;
      updateDraftMutation.mutate({ id: draftId, ...updates });
    },
    [draftId, updateDraftMutation]
  );

  // Handle step navigation
  const handleStepClick = useCallback((step: WizardStep) => {
    setCurrentStep(step);
    // Reset caption sub-step to 1 when clicking on Caption step
    if (step === WIZARD_STEPS.CAPTION) {
      setCaptionSubStep(CAPTION_SUB_STEPS.HOOK);
    }
    saveProgress({ currentStep: step });
  }, [saveProgress]);

  const goToStep = useCallback((step: WizardStep) => {
    setCurrentStep(step);
    saveProgress({ currentStep: step });
  }, [saveProgress]);

  // Handle caption sub-step navigation
  const handleSubStepClick = useCallback((subStep: CaptionSubStep) => {
    setCaptionSubStep(subStep);
    saveProgress({ captionSubStep: subStep });
  }, [saveProgress]);

  const handleCaptionSubStepChange = useCallback((subStep: CaptionSubStep) => {
    setCaptionSubStep(subStep);
    saveProgress({ captionSubStep: subStep });
  }, [saveProgress]);

  // Handle image changes
  const handleImageChange = useCallback((url: string | null) => {
    setImageUrl(url);
    saveProgress({ imageUrl: url });
  }, [saveProgress]);

  // Handle caption part changes
  const handleCaptionHookChange = useCallback((value: string) => {
    setCaptionHook(value);
    saveProgress({ captionHook: value });
  }, [saveProgress]);

  const handleCaptionBodyChange = useCallback((value: string) => {
    setCaptionBody(value);
    saveProgress({ captionBody: value });
  }, [saveProgress]);

  const handleCaptionEngagementChange = useCallback((value: string) => {
    setCaptionEngagement(value);
    saveProgress({ captionEngagement: value });
  }, [saveProgress]);

  const handleCaptionCtaChange = useCallback((value: string) => {
    setCaptionCta(value);
    saveProgress({ captionCta: value });
  }, [saveProgress]);

  // Handle hashtag changes
  const handleHashtagsChange = useCallback((newHashtags: string[]) => {
    setSelectedHashtags(newHashtags);
    saveProgress({ selectedHashtags: newHashtags });
  }, [saveProgress]);

  // Handle save as draft
  const handleSaveAsDraft = useCallback(() => {
    if (!draftId) return;
    // Save the combined caption along with status
    updateDraftMutation.mutate(
      {
        id: draftId,
        caption: combinedCaption,
        status: 'ready_to_publish',
      },
      {
        onSuccess: () => {
          navigate('/studio');
        },
      }
    );
  }, [draftId, updateDraftMutation, navigate, combinedCaption]);

  // Handle back to studio
  const handleBackToStudio = useCallback(() => {
    navigate('/studio');
  }, [navigate]);

  // Loading state
  if (isBlueprintLoading || isDraftLoading || !isInitialized) {
    return (
      <div className={styles.loadingContainer}>
        <Loader2 className={styles.spinner} size={32} />
        <p>Loading wizard...</p>
      </div>
    );
  }

  // Error state - no blueprint
  if (!blueprint) {
    return (
      <div className={styles.errorContainer}>
        <p>Blueprint not found</p>
        <button onClick={handleBackToStudio} className={styles.backButton}>
          <ArrowLeft size={18} />
          Back to Studio
        </button>
      </div>
    );
  }

  // Error state - no draft ID provided
  if (!draftId) {
    return (
      <div className={styles.errorContainer}>
        <p>No draft found. Please start from a blueprint.</p>
        <button onClick={handleBackToStudio} className={styles.backButton}>
          <ArrowLeft size={18} />
          Back to Studio
        </button>
      </div>
    );
  }

  // Build blueprint data for step components
  const blueprintForSteps = {
    id: blueprint.id,
    title: blueprint.title,
    platform: blueprint.platform,
    objective: blueprint.objective,
    hook: blueprint.hook,
    context: blueprint.context,
    visualDescription: blueprint.visualDescription,
    hashtags: blueprint.hashtags,
    mentions: blueprint.mentions,
    contentFramework: blueprint.contentFramework,
    whatToInclude: blueprint.whatToInclude,
    whatNotToDo: blueprint.whatNotToDo,
    bestTimeToPost: blueprint.bestTimeToPost || null,
    recommendedFormat: blueprint.recommendedFormat || null,
    postingInsight: blueprint.postingInsight || null,
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <button className={styles.backLink} onClick={handleBackToStudio}>
          <ArrowLeft size={18} />
          Back to Studio
        </button>
        <h1 className={styles.pageTitle}>Create Post</h1>
      </div>

      {/* Progress Indicator */}
      <WizardProgress
        currentStep={currentStep}
        captionSubStep={captionSubStep}
        onStepClick={handleStepClick}
        onSubStepClick={handleSubStepClick}
      />

      {/* Main Layout: Step Content + AI Assistant */}
      <div className={currentStep === WIZARD_STEPS.UPLOAD ? styles.mainLayoutFullWidth : styles.mainLayout}>
        {/* Step Content */}
        <div className={styles.stepContent}>
          {currentStep === WIZARD_STEPS.OVERVIEW && (
            <StepOverview
              blueprint={blueprintForSteps}
              onNext={() => goToStep(WIZARD_STEPS.VISUAL)}
            />
          )}

          {currentStep === WIZARD_STEPS.VISUAL && (
            <StepVisualBuilder
              blueprint={blueprintForSteps}
              imageUrl={imageUrl}
              onImageChange={handleImageChange}
              onNext={() => goToStep(WIZARD_STEPS.CAPTION)}
              onBack={() => goToStep(WIZARD_STEPS.OVERVIEW)}
            />
          )}

          {currentStep === WIZARD_STEPS.CAPTION && (
            <StepCaptionBuilder
              blueprint={blueprintForSteps}
              captionSubStep={captionSubStep}
              captionHook={captionHook}
              captionBody={captionBody}
              captionEngagement={captionEngagement}
              captionCta={captionCta}
              selectedHashtags={selectedHashtags}
              onCaptionSubStepChange={handleCaptionSubStepChange}
              onCaptionHookChange={handleCaptionHookChange}
              onCaptionBodyChange={handleCaptionBodyChange}
              onCaptionEngagementChange={handleCaptionEngagementChange}
              onCaptionCtaChange={handleCaptionCtaChange}
              onHashtagsChange={handleHashtagsChange}
              onNext={() => goToStep(WIZARD_STEPS.UPLOAD)}
              onBack={() => goToStep(WIZARD_STEPS.VISUAL)}
            />
          )}

          {currentStep === WIZARD_STEPS.UPLOAD && (
            <StepUpload
              imageUrl={imageUrl}
              caption={combinedCaption}
              selectedHashtags={selectedHashtags}
              onBack={() => goToStep(WIZARD_STEPS.CAPTION)}
              onSaveAsDraft={handleSaveAsDraft}
              isSaving={updateDraftMutation.isPending}
            />
          )}
        </div>

        {/* AI Assistant Panel - hidden on Upload step */}
        {currentStep !== WIZARD_STEPS.UPLOAD && (
          <div className={styles.assistantPanel}>
            <AIAssistantPanel />
          </div>
        )}
      </div>
    </div>
  );
}
