import {useEffect, useState} from 'react';
import {fetchWithAuth} from '@/app/api/fetchWithAuth';

export type UserStatistics = {
  totalCount: number;
  currentCount: number;
  previousCount: number;
  percentageChange: number;
};

export const useUserStatistics = () => {
  const [data, setData] = useState<UserStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserStatistics = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetchWithAuth('/api/v1/dashboard/user-statistics');

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        console.error('유저 통계 조회 실패:', err);
        setError(err instanceof Error ? err.message : '유저 통계를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserStatistics();
  }, []);

  return {data, loading, error};
}; 