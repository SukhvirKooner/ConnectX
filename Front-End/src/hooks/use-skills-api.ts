import { useApiQuery, useApiMutation } from './use-api';
import { skillService } from '@/services';

// Hook for fetching all skills
export function useSkills(params = {}) {
  return useApiQuery(
    ['skills', JSON.stringify(params)],
    () => skillService.getAllSkills(params)
  );
}

// Hook for fetching a single skill
export function useSkill(skillId: string) {
  return useApiQuery(
    ['skill', skillId],
    () => skillService.getSkillById(skillId),
    {
      enabled: !!skillId,
    }
  );
}

// Hook for adding a skill to user profile
export function useAddSkill() {
  return useApiMutation(
    (skillId) => skillService.addSkillToProfile(skillId),
    {
      invalidateQueries: ['userSkills'],
      successMessage: 'Skill added to your profile!',
    }
  );
}

// Hook for removing a skill from user profile
export function useRemoveSkill() {
  return useApiMutation(
    (userSkillId) => skillService.removeSkillFromProfile(userSkillId),
    {
      invalidateQueries: ['userSkills'],
      successMessage: 'Skill removed from your profile!',
    }
  );
}

// Hook for fetching user skills
export function useUserSkills(userId: string, params = {}) {
  return useApiQuery(
    ['userSkills', userId, JSON.stringify(params)],
    () => skillService.getUserSkills(userId, params),
    {
      enabled: !!userId,
    }
  );
}