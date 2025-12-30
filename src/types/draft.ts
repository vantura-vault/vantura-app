// Draft API Types

import type { Hashtag, Mention, ContentFramework, WhatToIncludeItem, WhatNotToDoItem } from './blueprint';

export type DraftStatus = 'in_progress' | 'ready_to_publish';

export type WizardStep = 1 | 2 | 3 | 4;

export type CaptionSubStep = 1 | 2 | 3 | 4;

// Minimal blueprint info included with draft
export interface DraftBlueprint {
  id: string;
  title: string;
  platform: string;
  objective: string;
  hook: string;
  context: string;
  visualDescription: string;
  hashtags: Hashtag[];
  mentions?: Mention[];
  contentFramework?: ContentFramework;
  whatToInclude?: WhatToIncludeItem[];
  whatNotToDo?: WhatNotToDoItem[];
  bestTimeToPost?: string | null;
  recommendedFormat?: string | null;
  postingInsight?: string | null;
}

export interface Draft {
  id: string;
  companyId: string;
  blueprintId: string;
  platform: string;
  imageUrl: string | null;
  caption: string | null;
  selectedHashtags: string[];
  currentStep: WizardStep;
  captionSubStep?: CaptionSubStep;
  captionHook?: string;
  captionBody?: string;
  captionEngagement?: string;
  captionCta?: string;
  status: DraftStatus;
  createdAt: string;
  updatedAt: string;
  blueprint: DraftBlueprint;
}

export interface CreateDraftParams {
  blueprintId: string;
}

export interface UpdateDraftParams {
  imageUrl?: string | null;
  caption?: string | null;
  selectedHashtags?: string[];
  currentStep?: WizardStep;
  captionSubStep?: CaptionSubStep;
  captionHook?: string;
  captionBody?: string;
  captionEngagement?: string;
  captionCta?: string;
  status?: DraftStatus;
}

// For the wizard steps
export const WIZARD_STEPS = {
  OVERVIEW: 1 as WizardStep,
  VISUAL: 2 as WizardStep,
  CAPTION: 3 as WizardStep,
  UPLOAD: 4 as WizardStep,
} as const;

export const WIZARD_STEP_LABELS = {
  1: 'Overview',
  2: 'Visual',
  3: 'Caption',
  4: 'Upload',
} as const;

// Caption sub-steps for step 3
export const CAPTION_SUB_STEPS = {
  HOOK: 1 as CaptionSubStep,
  BODY: 2 as CaptionSubStep,
  ENGAGEMENT: 3 as CaptionSubStep,
  CTA: 4 as CaptionSubStep,
} as const;

export const CAPTION_SUB_STEP_LABELS = {
  1: 'Hook',
  2: 'Body',
  3: 'Engagement',
  4: 'CTA',
} as const;
