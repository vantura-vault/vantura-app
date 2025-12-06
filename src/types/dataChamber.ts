export interface DataChamberSettings {
  values: string[];
  brandVoice: string;
  targetAudience: string;
  personalNotes: string;
  profilePictureUrl?: string;
  linkedInUrl?: string;
  linkedInType?: 'profile' | 'company';
}

export interface UpdateDataChamberSettings {
  values?: string[];
  brandVoice?: string;
  targetAudience?: string;
  personalNotes?: string;
  profilePictureUrl?: string;
  linkedInUrl?: string;
  linkedInType?: string;
}

export interface DataHealthComponent {
  name: string;
  complete: boolean;
  weight: number;
  details?: string;
}

export interface DataHealthResult {
  score: number;
  status: 'excellent' | 'good' | 'fair' | 'needs_attention';
  components: DataHealthComponent[];
}
