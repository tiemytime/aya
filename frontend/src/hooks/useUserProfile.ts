import { useState, useEffect, useCallback } from 'react';
import { apiService, UserResponse, UpdateUserRequest, UpdateUserResponse, PrayerNotesResponse } from '@/services';

export interface UserProfile {
  _id: string;
  email: string;
  name: string;
  bio?: string;
  profilePicture?: string;
  createdAt: string;
  updatedAt?: string;
}

/**
 * Hook for managing user profile data
 */
export function useUserProfile() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchUserProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response: UserResponse = await apiService.getCurrentUser();
      if (response.success) {
        setUser(response.data.user);
      }
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  return {
    user,
    isLoading,
    error,
    refetch: fetchUserProfile,
  };
}

/**
 * Hook for updating user profile
 */
export function useUpdateProfile() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const updateProfile = useCallback(async (profileData: UpdateUserRequest): Promise<UserProfile | null> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response: UpdateUserResponse = await apiService.updateUserProfile(profileData);
      if (response.success) {
        return response.data.user;
      }
      return null;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    updateProfile,
    isLoading,
    error,
  };
}

/**
 * Hook for fetching user's prayer notes
 */
export function useUserPrayerNotes(page = 1, limit = 10) {
  const [data, setData] = useState<PrayerNotesResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchUserNotes = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await apiService.getUserProfileNotes(page, limit);
      setData(response);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    fetchUserNotes();
  }, [fetchUserNotes]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchUserNotes,
  };
}
