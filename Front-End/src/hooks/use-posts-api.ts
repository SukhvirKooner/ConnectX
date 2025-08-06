import { useApiQuery, useApiMutation } from './use-api';
import { postService } from '@/services';

// Hook for fetching posts
export function usePosts<T = any>(params = {}) {
  return useApiQuery<T>(
    ['posts', JSON.stringify(params)],
    () => postService.getPosts(params)
  );
}

// Hook for fetching a single post
export function usePost(postId: string) {
  return useApiQuery(
    ['post', postId],
    () => postService.getPostById(postId),
    {
      enabled: !!postId,
    }
  );
}

// Hook for creating a post
export function useCreatePost() {
  return useApiMutation<any, any>(
    (data: any) => postService.createPost(data),
    {
      invalidateQueries: ['posts'],
      successMessage: 'Post created successfully!',
    }
  );
}

// Hook for updating a post
export function useUpdatePost() {
  return useApiMutation(
    ({ postId, data }) => postService.updatePost(postId, data),
    {
      invalidateQueries: ['posts'],
      successMessage: 'Post updated successfully!',
    }
  );
}

// Hook for deleting a post
export function useDeletePost() {
  return useApiMutation(
    (postId) => postService.deletePost(postId),
    {
      invalidateQueries: ['posts'],
      successMessage: 'Post deleted successfully!',
    }
  );
}

// Hook for toggling like on a post
export function useToggleLike() {
  return useApiMutation(
    (postId) => postService.toggleLike(postId),
    {
      // We don't invalidate the whole posts query to avoid refetching everything
      // Instead, we'll update the cache manually in the component
    }
  );
}

// Hook for fetching post likes
export function usePostLikes(postId: string, params = {}) {
  return useApiQuery(
    ['postLikes', postId, JSON.stringify(params)],
    () => postService.getPostLikes(postId, params),
    {
      enabled: !!postId,
    }
  );
}

// Hook for adding a comment to a post
export function useAddComment() {
  return useApiMutation(
    ({ postId, data }) => postService.addComment(postId, data),
    {
      invalidateQueries: ['postComments'],
      successMessage: 'Comment added successfully!',
    }
  );
}

// Hook for fetching post comments
export function usePostComments(postId: string, params = {}) {
  return useApiQuery(
    ['postComments', postId, JSON.stringify(params)],
    () => postService.getPostComments(postId, params),
    {
      enabled: !!postId,
    }
  );
}

// Hook for sharing a post
export function useSharePost() {
  return useApiMutation(
    ({ postId, data }) => postService.sharePost(postId, data),
    {
      invalidateQueries: ['posts'],
      successMessage: 'Post shared successfully!',
    }
  );
}