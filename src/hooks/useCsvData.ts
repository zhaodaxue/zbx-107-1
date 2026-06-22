import { useEffect } from 'react';
import { useDataStore } from '../store/useDataStore';
import { loadCsvFile } from '../utils/csvParser';

export const useCsvData = (filePath: string) => {
  const { setRawRecords, setLoading, setError, isLoading, error } = useDataStore();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const records = await loadCsvFile(filePath);
        setRawRecords(records);
      } catch (err) {
        console.error('加载CSV数据失败:', err);
        setError(err instanceof Error ? err.message : '数据加载失败');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [filePath, setRawRecords, setLoading, setError]);

  return { isLoading, error };
};
