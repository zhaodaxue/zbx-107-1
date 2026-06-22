import { useState, useEffect } from 'react';
import { X, Calendar } from 'lucide-react';
import { useComplaintAnalysis } from '../hooks/useComplaintAnalysis';
import { cn } from '../lib/utils';

interface DateRangePickerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DateRangePicker = ({ isOpen, onClose }: DateRangePickerProps) => {
  const { filters, setFilters, rawRecords } = useComplaintAnalysis();
  const [startDate, setStartDate] = useState(filters.dateRange.start);
  const [endDate, setEndDate] = useState(filters.dateRange.end);

  useEffect(() => {
    if (isOpen) {
      setStartDate(filters.dateRange.start);
      setEndDate(filters.dateRange.end);
    }
  }, [isOpen, filters.dateRange.start, filters.dateRange.end]);

  const allDates = rawRecords.map((r) => r.date).sort();
  const minDate = allDates.length > 0 ? allDates[0] : '';
  const maxDate = allDates.length > 0 ? allDates[allDates.length - 1] : '';

  const handleApply = () => {
    if (startDate && endDate && startDate <= endDate) {
      setFilters({
        dateRange: { start: startDate, end: endDate },
      });
      onClose();
    }
  };

  const handleReset = () => {
    setStartDate(minDate);
    setEndDate(maxDate);
    setFilters({
      dateRange: { start: minDate, end: maxDate },
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl animate-scaleIn">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#1e3a5f]" />
            <h3 className="text-lg font-bold text-[#1e3a5f]">选择日期区间</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              开始日期
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              min={minDate}
              max={endDate || maxDate}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              结束日期
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={startDate || minDate}
              max={maxDate}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent outline-none transition-all"
            />
          </div>

          {startDate && endDate && startDate > endDate && (
            <p className="text-sm text-red-500">开始日期不能晚于结束日期</p>
          )}

          <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
            数据范围：{minDate} ~ {maxDate}
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={handleReset}
            className="flex-1 px-4 py-3 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            重置
          </button>
          <button
            onClick={handleApply}
            disabled={!startDate || !endDate || startDate > endDate}
            className={cn(
              'flex-1 px-4 py-3 rounded-lg font-medium transition-all',
              startDate && endDate && startDate <= endDate
                ? 'bg-[#1e3a5f] text-white hover:bg-[#2d4a6f]'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            )}
          >
            应用
          </button>
        </div>
      </div>
    </div>
  );
};
