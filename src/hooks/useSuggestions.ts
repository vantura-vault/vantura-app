import { useMutation } from '@tanstack/react-query';
import { generateSuggestions } from '../api/endpoints';
import type {
  GenerateSuggestionsParams,
  SuggestionsData,
} from '../types/suggestions';

/**
 * Hook to generate AI-powered post suggestions
 * @returns Mutation result with variants and metadata
 */
export const useGenerateSuggestions = () => {
  return useMutation<SuggestionsData, Error, GenerateSuggestionsParams>({
    mutationFn: (params: GenerateSuggestionsParams) => generateSuggestions(params),
  });
};
