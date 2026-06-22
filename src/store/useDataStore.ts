import { create } from 'zustand';
import {
  ComplaintRecord,
  FilterOptions,
  WeeklyData,
  ComparisonData,
  MatrixCell,
  ParkInfo,
} from '../types';
import {
  filterRecords,
  getParkList,
  calculateWeeklyData,
  calculateComparisonData,
  calculateMatrixData,
  getDateRange,
} from '../utils/analysisUtils';

interface DataState {
  rawRecords: ComplaintRecord[];
  filteredRecords: ComplaintRecord[];
  parks: ParkInfo[];
  weeklyData: WeeklyData[];
  comparisonData: ComparisonData[];
  matrixData: MatrixCell[];
  filters: FilterOptions;
  isLoading: boolean;
  error: string | null;

  setRawRecords: (records: ComplaintRecord[]) => void;
  setFilters: (filters: Partial<FilterOptions>) => void;
  toggleParkSelection: (parkId: string) => void;
  selectAllParks: () => void;
  clearParkSelection: () => void;
  recalculateData: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useDataStore = create<DataState>((set, get) => ({
  rawRecords: [],
  filteredRecords: [],
  parks: [],
  weeklyData: [],
  comparisonData: [],
  matrixData: [],
  filters: {
    onlyWeekend: false,
    onlyConstruction: false,
    dateRange: { start: '', end: '' },
    selectedParks: [],
  },
  isLoading: true,
  error: null,

  setRawRecords: (records) => {
    const parks = getParkList(records);
    const dateRange = getDateRange(records);
    set({
      rawRecords: records,
      parks,
      filters: {
        ...get().filters,
        dateRange,
        selectedParks: parks.map((p) => p.parkId),
      },
    });
    get().recalculateData();
  },

  setFilters: (newFilters) => {
    set({
      filters: {
        ...get().filters,
        ...newFilters,
      },
    });
    get().recalculateData();
  },

  toggleParkSelection: (parkId) => {
    const { selectedParks } = get().filters;
    const newSelected = selectedParks.includes(parkId)
      ? selectedParks.filter((id) => id !== parkId)
      : [...selectedParks, parkId];
    set({
      filters: {
        ...get().filters,
        selectedParks: newSelected,
      },
    });
    get().recalculateData();
  },

  selectAllParks: () => {
    const allParkIds = get().parks.map((p) => p.parkId);
    set({
      filters: {
        ...get().filters,
        selectedParks: allParkIds,
      },
    });
    get().recalculateData();
  },

  clearParkSelection: () => {
    set({
      filters: {
        ...get().filters,
        selectedParks: [],
      },
    });
    get().recalculateData();
  },

  recalculateData: () => {
    const { rawRecords, filters, parks } = get();
    const filtered = filterRecords(rawRecords, filters);
    const activeParks = parks.filter((p) =>
      filters.selectedParks.includes(p.parkId)
    );

    const weekly = calculateWeeklyData(filtered, activeParks);
    const comparison = calculateComparisonData(filtered, activeParks);
    const matrix = calculateMatrixData(filtered, activeParks);

    set({
      filteredRecords: filtered,
      weeklyData: weekly,
      comparisonData: comparison,
      matrixData: matrix,
    });
  },

  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
}));
