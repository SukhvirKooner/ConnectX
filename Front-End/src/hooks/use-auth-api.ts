import { useApiQuery, useApiMutation } from './use-api';
import { authService, userService } from '@/services';

// Hook for user registration
export function useRegister() {
  return useApiMutation(
    (data) => authService.register(data),
    {
      successMessage: 'Registration successful!',
    }
  );
}

// Hook for user login
export function useLogin() {
  return useApiMutation(
    (data) => authService.login(data),
    {
      successMessage: 'Login successful!',
    }
  );
}

// Hook for user logout
export function useLogout() {
  return useApiMutation(
    () => authService.logout(),
    {
      successMessage: 'Logged out successfully',
    }
  );
}

// Hook for getting current user
export function useCurrentUser() {
  return useApiQuery(
    ['currentUser'],
    () => authService.getCurrentUser(),
    {
      retry: false,
      refetchOnWindowFocus: false,
    }
  );
}

// Hook for updating user profile
export function useUpdateProfile() {
  return useApiMutation(
    ({ userId, data }) => userService.updateProfile(userId, data),
    {
      invalidateQueries: ['currentUser'],
      successMessage: 'Profile updated successfully!',
    }
  );
}

// Hook for completing user profile
export function useCompleteProfile() {
  return useApiMutation(
    () => userService.completeProfile(),
    {
      invalidateQueries: ['currentUser'],
      successMessage: 'Profile completed successfully!',
    }
  );
}

// Hook for uploading avatar
export function useUploadAvatar() {
  return useApiMutation(
    (file) => userService.uploadAvatar(file),
    {
      invalidateQueries: ['currentUser'],
      successMessage: 'Avatar uploaded successfully!',
    }
  );
}