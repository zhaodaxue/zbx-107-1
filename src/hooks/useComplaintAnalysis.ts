import { useDataStore } from '../store/useDataStore';

export const useComplaintAnalysis = () => {
  const {
    rawRecords,
    filteredRecords,
    parks,
    weeklyData,
    comparisonData,
    matrixData,
    filters,
    isLoading,
    error,
    setFilters,
    toggleParkSelection,
    selectAllParks,
    clearParkSelection,
  } = useDataStore();

  const getMatrixByParkAndSlot = (parkId: string, timeSlot: '晨' | '午' | '晚') => {
    return matrixData.find(
      (cell) => cell.parkId === parkId && cell.timeSlot === timeSlot
    );
  };

  const getWeeklyChartData = () => {
    const weekMap = new Map<string, Record<string, string | number>>();

    weeklyData.forEach((item) => {
      const key = item.weekStart;
      if (!weekMap.has(key)) {
        weekMap.set(key, {
          weekStart: item.weekStart,
          weekLabel: item.weekLabel,
        });
      }
      const weekEntry = weekMap.get(key)!;
      weekEntry[item.parkName] = item.totalComplaints;
    });

    return Array.from(weekMap.values()).sort(
      (a, b) => String(a.weekStart).localeCompare(String(b.weekStart))
    );
  };

  const getParkColors = () => {
    const colors = [
      '#1e3a5f',
      '#ff6b35',
      '#4a7c59',
      '#9b59b6',
      '#3498db',
      '#e74c3c',
      '#f39c12',
      '#1abc9c',
    ];
    return parks.reduce((acc, park, index) => {
      acc[park.parkId] = colors[index % colors.length];
      return acc;
    }, {} as Record<string, string>);
  };

  const heatingCount = comparisonData.filter((item) => item.isHeating).length;
  const totalCurrentWeek = comparisonData.reduce(
    (sum, item) => sum + item.currentWeek,
    0
  );
  const totalPreviousWeek = comparisonData.reduce(
    (sum, item) => sum + item.previousWeek,
    0
  );
  const overallGrowthRate =
    totalPreviousWeek > 0
      ? Math.round(((totalCurrentWeek - totalPreviousWeek) / totalPreviousWeek) * 1000) / 10
      : totalCurrentWeek > 0
      ? 100
      : 0;

  return {
    rawRecords,
    filteredRecords,
    parks,
    weeklyData,
    comparisonData,
    matrixData,
    filters,
    isLoading,
    error,
    setFilters,
    toggleParkSelection,
    selectAllParks,
    clearParkSelection,
    getMatrixByParkAndSlot,
    getWeeklyChartData,
    getParkColors,
    heatingCount,
    totalCurrentWeek,
    totalPreviousWeek,
    overallGrowthRate,
  };
};
