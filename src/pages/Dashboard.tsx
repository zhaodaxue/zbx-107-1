import { useState } from 'react';
import { useCsvData } from '../hooks/useCsvData';
import { useComplaintAnalysis } from '../hooks/useComplaintAnalysis';
import { FilterBar } from '../components/FilterBar';
import { WeeklyBarChart } from '../components/WeeklyBarChart';
import { ComparisonTable } from '../components/ComparisonTable';
import { TimeSlotMatrix } from '../components/TimeSlotMatrix';
import { DateRangePicker } from '../components/DateRangePicker';
import { exportToCsv } from '../utils/exportUtils';
import { Volume2, Flame, TrendingUp, CalendarRange, Loader2, AlertTriangle } from 'lucide-react';

const CSV_FILE_PATH = '/src/data/mock_complaints.csv';

export const Dashboard = () => {
  const { isLoading, error } = useCsvData(CSV_FILE_PATH);
  const {
    rawRecords,
    filters,
    heatingCount,
    totalCurrentWeek,
    overallGrowthRate,
  } = useComplaintAnalysis();

  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const handleExport = () => {
    if (rawRecords.length > 0) {
      exportToCsv(rawRecords, filters.dateRange, '噪声投诉明细.csv');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f5f9fc] to-[#e8f0f7] flex items-center justify-center">
        <div className="text-center animate-fadeIn">
          <Loader2 className="w-12 h-12 text-[#1e3a5f] animate-spin mx-auto mb-4" />
          <p className="text-[#1e3a5f] font-medium">加载数据中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f5f9fc] to-[#e8f0f7] flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-xl animate-fadeIn">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 font-medium mb-2">数据加载失败</p>
          <p className="text-gray-500 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f9fc] to-[#e8f0f7]">
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="animate-fadeIn">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-[#1e3a5f] to-[#2d4a6f] rounded-xl flex items-center justify-center shadow-lg">
                  <Volume2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-[#1e3a5f]">
                    口袋公园噪声投诉时段复盘
                  </h1>
                  <p className="text-sm text-gray-500">城管热线数据分析平台</p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 animate-fadeIn" style={{ animationDelay: '100ms' }}>
              <div className="bg-white border border-gray-200 rounded-xl px-5 py-3 shadow-sm">
                <div className="flex items-center gap-2">
                  <CalendarRange className="w-5 h-5 text-[#1e3a5f]" />
                  <div>
                    <p className="text-xs text-gray-500">本周投诉</p>
                    <p className="text-xl font-bold text-[#1e3a5f] tabular-nums">
                      {totalCurrentWeek}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl px-5 py-3 shadow-sm">
                <div className="flex items-center gap-2">
                  <TrendingUp
                    className={`w-5 h-5 ${overallGrowthRate > 0 ? 'text-red-500' : 'text-green-500'}`}
                  />
                  <div>
                    <p className="text-xs text-gray-500">环比变化</p>
                    <p
                      className={`text-xl font-bold tabular-nums ${overallGrowthRate > 0 ? 'text-red-500' : overallGrowthRate < 0 ? 'text-green-500' : 'text-gray-500'}`}
                    >
                      {overallGrowthRate > 0 ? '+' : ''}
                      {overallGrowthRate.toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-xl px-5 py-3 shadow-sm">
                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-[#ff6b35] animate-pulse" />
                  <div>
                    <p className="text-xs text-orange-600">升温预警</p>
                    <p className="text-xl font-bold text-[#ff6b35] tabular-nums">
                      {heatingCount} 个
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <FilterBar
          onDateRangeChange={() => setIsDatePickerOpen(true)}
          onExport={handleExport}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <WeeklyBarChart />
          <ComparisonTable />
        </div>

        <TimeSlotMatrix />
      </main>

      <footer className="mt-12 py-6 border-t border-gray-200 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            © 2024 城管热线数据分析平台 | 数据更新时间：
            {filters.dateRange.end}
          </p>
        </div>
      </footer>

      <DateRangePicker
        isOpen={isDatePickerOpen}
        onClose={() => setIsDatePickerOpen(false)}
      />
    </div>
  );
};
