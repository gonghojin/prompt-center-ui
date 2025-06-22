import {useEffect, useState} from 'react';
import {fetchWithAuth} from '@/app/api/fetchWithAuth';

export type WeeklyViewStatistics = {
  thisWeekViewCount: number;
  lastWeekViewCount: number;
  changeCount: number;
  changeRate: number;
};

export const useWeeklyViewStatistics = () => {
  const [data, setData] = useState<WeeklyViewStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeeklyViewStatistics = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetchWithAuth('/api/v1/dashboard/view-statistics/weekly');

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        console.error('주간 조회수 통계 조회 실패:', err);
        setError(err instanceof Error ? err.message : '주간 조회수 통계를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchWeeklyViewStatistics();
  }, []);

  return {data, loading, error};
}; 