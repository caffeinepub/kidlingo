import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import { UserProfile, UserProgress, Reward } from '../backend';

// User Profile Queries
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !!identity && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// Vocabulary Queries
export function useGetWordsByCategory(category: string) {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['words', category],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getWordsByCategory(category);
    },
    enabled: !!actor && !isFetching,
  });
}

// Progress Queries
export function useGetProgress() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<UserProgress>({
    queryKey: ['progress'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getProgress();
    },
    enabled: !!actor && !!identity && !isFetching,
  });
}

export function useCompleteLesson() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (score: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.completeLesson(score);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['progress'] });
      queryClient.invalidateQueries({ queryKey: ['rewards'] });
    },
  });
}

// Rewards Queries
export function useGetRewards() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<Reward[]>({
    queryKey: ['rewards'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getRewards();
    },
    enabled: !!actor && !!identity && !isFetching,
  });
}

// Quiz Queries
export function useCheckQuizAnswer() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async ({ word, translation }: { word: string; translation: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.checkQuizAnswer(word, translation);
    },
  });
}
