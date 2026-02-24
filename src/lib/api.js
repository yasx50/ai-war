import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';
import { useMemo } from 'react';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const useApi = () => {
  const { getToken } = useAuth();

  const api = useMemo(() => {
    const instance = axios.create({
      baseURL: `${BASE_URL}/api`,
      headers: { 'Content-Type': 'application/json' },
    });

    instance.interceptors.request.use(async (config) => {
      try {
        const token = await getToken();
        if (token) config.headers.Authorization = `Bearer ${token}`;
      } catch (err) {
        console.error('Failed to get Clerk token:', err);
      }
      return config;
    });

    instance.interceptors.response.use(
      (response) => response,
      (error) => {
        const message =
          error.response?.data?.error || error.message || 'Something went wrong';
        return Promise.reject(new Error(message));
      }
    );

    return instance;
  }, [getToken]);

  return api;
};

export default useApi;