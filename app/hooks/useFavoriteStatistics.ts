import {useEffect, useState} from 'react';
import {fetchWithAuth} from '@/app/api/fetchWithAuth';

export type FavoriteStatistics = {
  totalCount: number;
  currentCount: number;
  previousCount: number;
  percentageChange: number;
};

export const useFavoriteStatistics = () => {
  const [data, setData] = useState<FavoriteStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFavoriteStatistics = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetchWithAuth('/api/v1/dashboard/favorite-statistics');

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        console.error('즐겨찾기 통계 조회 실패:', err);
        setError(err instanceof Error ? err.message : '즐겨찾기 통계를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchFavoriteStatistics();
  }, []);

  return {data, loading, error};
}; 