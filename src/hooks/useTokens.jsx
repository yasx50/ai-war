import { useState, useEffect, useCallback } from 'react';
import { useApi } from '../lib/api';

export const useTokens = () => {
  const api = useApi();
  const [tokenData, setTokenData] = useState({
    tokensUsed: 0,
    tokenLimit: 1000,
  });
  const [loading, setLoading] = useState(true);

  const fetchTokens = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/user/me');
      setTokenData({
        tokensUsed: res.data.tokensUsed,
        tokenLimit: res.data.tokenLimit,
      });
    } catch (err) {
      console.error('Failed to fetch token data:', err.message);
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => {
    fetchTokens();
  }, [fetchTokens]);

  const tokensRemaining = tokenData.tokenLimit - tokenData.tokensUsed;
  const percentUsed = Math.round((tokenData.tokensUsed / tokenData.tokenLimit) * 100);
  const isLow = percentUsed >= 80;
  const isExhausted = tokensRemaining <= 0;

  return {
    ...tokenData,
    tokensRemaining,
    percentUsed,
    isLow,
    isExhausted,
    loading,
    refetch: fetchTokens,
  };
};

export default useTokens;