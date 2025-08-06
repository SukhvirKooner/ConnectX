import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from './use-toast';

// Generic hook for fetching data
export function useApiQuery<T>(queryKey: string[], queryFn: () => Promise<T>, options = {}) {
  const { toast } = useToast();
  
  return useQuery({
    queryKey,
    queryFn,
    onError: (error: any) => {
      console.error(`API Error (${queryKey.join('/')}):`, error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to fetch data',
        variant: 'destructive',
      });
    },
    ...options,
  });
}

// Generic hook for mutations (create, update, delete)
export function useApiMutation<T, V>(
  mutationFn: (variables: V) => Promise<T>,
  options: {
    onSuccess?: (data: T, variables: V) => void;
    onError?: (error: any, variables: V) => void;
    invalidateQueries?: string[];
    successMessage?: string;
  } = {}
) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn,
    onSuccess: (data, variables) => {
      // Invalidate queries if specified
      if (options.invalidateQueries?.length) {
        options.invalidateQueries.forEach(query => {
          queryClient.invalidateQueries({ queryKey: [query] as string[] });
        });
      }
      
      // Show success toast if message provided
      if (options.successMessage) {
        toast({
          title: 'Success',
          description: options.successMessage,
        });
      }
      
      // Call custom onSuccess if provided
      if (options.onSuccess) {
        options.onSuccess(data, variables);
      }
    },
    onError: (error: any, variables) => {
      console.error('API Mutation Error:', error);
      
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Operation failed',
        variant: 'destructive',
      });
      
      // Call custom onError if provided
      if (options.onError) {
        options.onError(error, variables);
      }
    },
  });
}