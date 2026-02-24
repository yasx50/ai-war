import { useState, useEffect, useCallback } from 'react';
import { useApi } from '../lib/api';
import { toast } from 'sonner';

export const useProfiles = () => {
  const api = useApi();
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfiles = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/customprofiles');
      setProfiles(res.data);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load profiles');
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  const createProfile = async (profileData) => {
    if (profiles.length >= 2) {
      toast.error('Maximum 2 profiles allowed. Delete one to create a new one.');
      return null;
    }
    try {
      const res = await api.post('/customprofiles', profileData);
      setProfiles((prev) => [...prev, res.data]);
      toast.success(`Profile "${res.data.name}" created!`);
      return res.data;
    } catch (err) {
      toast.error(err.message);
      return null;
    }
  };

  const updateProfile = async (id, profileData) => {
    try {
      const res = await api.put(`/customprofiles/${id}`, profileData);
      setProfiles((prev) =>
        prev.map((p) => (p._id === id ? res.data : p))
      );
      toast.success('Profile updated!');
      return res.data;
    } catch (err) {
      toast.error(err.message);
      return null;
    }
  };

  const deleteProfile = async (id) => {
    try {
      await api.delete(`/customprofiles/${id}`);
      setProfiles((prev) => prev.filter((p) => p._id !== id));
      toast.success('Profile deleted');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const canCreateMore = profiles.length < 2;

  return {
    profiles,
    loading,
    error,
    canCreateMore,
    createProfile,
    updateProfile,
    deleteProfile,
    refetch: fetchProfiles,
  };
};

export default useProfiles;