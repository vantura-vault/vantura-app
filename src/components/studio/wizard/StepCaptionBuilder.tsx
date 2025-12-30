import type { DraftBlueprint, CaptionSubStep } from '../../../types/draft';
import { CAPTION_SUB_STEPS } from '../../../types/draft';
import { SubStepHook } from './SubStepHook';
import { SubStepBody } from './SubStepBody';
import { SubStepEngagement } from './SubStepEngagement';
import { SubStepCTA } from './SubStepCTA';

interface StepCaptionBuilderProps {
  blueprint: DraftBlueprint;
  captionSubStep: CaptionSubStep;
  captionHook: string;
  captionBody: string;
  captionEngagement: string;
  captionCta: string;
  selectedHashtags: string[];
  onCaptionSubStepChange: (subStep: CaptionSubStep) => void;
  onCaptionHookChange: (value: string) => void;
  onCaptionBodyChange: (value: string) => void;
  onCaptionEngagementChange: (value: string) => void;
  onCaptionCtaChange: (value: string) => void;
  onHashtagsChange: (hashtags: string[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export function StepCaptionBuilder({
  blueprint,
  captionSubStep,
  captionHook,
  captionBody,
  captionEngagement,
  captionCta,
  selectedHashtags,
  onCaptionSubStepChange,
  onCaptionHookChange,
  onCaptionBodyChange,
  onCaptionEngagementChange,
  onCaptionCtaChange,
  onHashtagsChange,
  onNext,
  onBack,
}: StepCaptionBuilderProps) {
  // Navigation handlers for sub-steps
  const handleSubStepNext = () => {
    if (captionSubStep === CAPTION_SUB_STEPS.CTA) {
      // Last sub-step, go to Upload step
      onNext();
    } else {
      // Move to next sub-step
      onCaptionSubStepChange((captionSubStep + 1) as CaptionSubStep);
    }
  };

  const handleSubStepBack = () => {
    if (captionSubStep === CAPTION_SUB_STEPS.HOOK) {
      // First sub-step, go back to Visual step
      onBack();
    } else {
      // Move to previous sub-step
      onCaptionSubStepChange((captionSubStep - 1) as CaptionSubStep);
    }
  };

  // Render the appropriate sub-step component
  switch (captionSubStep) {
    case CAPTION_SUB_STEPS.HOOK:
      return (
        <SubStepHook
          blueprint={blueprint}
          value={captionHook}
          onChange={onCaptionHookChange}
          onNext={handleSubStepNext}
          onBack={handleSubStepBack}
        />
      );

    case CAPTION_SUB_STEPS.BODY:
      return (
        <SubStepBody
          blueprint={blueprint}
          value={captionBody}
          hookValue={captionHook}
          onChange={onCaptionBodyChange}
          onNext={handleSubStepNext}
          onBack={handleSubStepBack}
        />
      );

    case CAPTION_SUB_STEPS.ENGAGEMENT:
      return (
        <SubStepEngagement
          blueprint={blueprint}
          value={captionEngagement}
          hookValue={captionHook}
          bodyValue={captionBody}
          onChange={onCaptionEngagementChange}
          onNext={handleSubStepNext}
          onBack={handleSubStepBack}
        />
      );

    case CAPTION_SUB_STEPS.CTA:
      return (
        <SubStepCTA
          blueprint={blueprint}
          value={captionCta}
          hookValue={captionHook}
          bodyValue={captionBody}
          engagementValue={captionEngagement}
          selectedHashtags={selectedHashtags}
          onChange={onCaptionCtaChange}
          onHashtagsChange={onHashtagsChange}
          onNext={handleSubStepNext}
          onBack={handleSubStepBack}
        />
      );

    default:
      return null;
  }
}
