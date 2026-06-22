import { CalendarDays, Filter, Building2, Sun } from 'lucide-react';
import { useComplaintAnalysis } from '../hooks/useComplaintAnalysis';
import { cn } from '../lib/utils';

interface FilterBarProps {
  onDateRangeChange?: () => void;
  onExport?: () => void;
}

export const FilterBar = ({ onDateRangeChange, onExport }: FilterBarProps) => {
  const { filters, setFilters, parks, toggleParkSelection, selectAllParks, clearParkSelection } =
    useComplaintAnalysis();

  return (
    <div className="bg-[#e8f0f7] rounded-xl p-4 mb-6 animate-fadeIn">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-[#1e3a5f]" />
          <span className="text-sm font-medium text-[#1e3a5f]">筛选条件</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setFilters({ onlyWeekend: !filters.onlyWeekend })}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
              filters.onlyWeekend
                ? 'bg-[#1e3a5f] text-white shadow-md'
                : 'bg-white text-[#2d3748] hover:bg-gray-100 border border-gray-200'
            )}
          >
            <Sun className="w-4 h-4" />
            仅周末
          </button>

          <button
            onClick={() => setFilters({ onlyConstruction: !filters.onlyConstruction })}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
              filters.onlyConstruction
                ? 'bg-[#1e3a5f] text-white shadow-md'
                : 'bg-white text-[#2d3748] hover:bg-gray-100 border border-gray-200'
            )}
          >
            <Building2 className="w-4 h-4" />
            仅有施工
          </button>
        </div>

        <div className="h-8 w-px bg-gray-300 hidden sm:block" />

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-[#2d3748]">公园选择：</span>
          <button
            onClick={selectAllParks}
            className="px-3 py-1 text-xs rounded-full bg-white text-[#1e3a5f] border border-[#1e3a5f] hover:bg-[#1e3a5f] hover:text-white transition-colors"
          >
            全选
          </button>
          <button
            onClick={clearParkSelection}
            className="px-3 py-1 text-xs rounded-full bg-white text-gray-500 border border-gray-300 hover:bg-gray-100 transition-colors"
          >
            清空
          </button>
        </div>

        <div className="flex flex-wrap gap-2 ml-0 sm:ml-auto">
          {parks.map((park) => (
            <button
              key={park.parkId}
              onClick={() => toggleParkSelection(park.parkId)}
              className={cn(
                'px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200',
                filters.selectedParks.includes(park.parkId)
                  ? 'bg-[#ff6b35] text-white shadow-sm'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-[#ff6b35]'
              )}
            >
              {park.parkName}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 ml-0 sm:ml-auto mt-2 sm:mt-0">
          {onDateRangeChange && (
            <button
              onClick={onDateRangeChange}
              className="flex items-center gap-2 px-4 py-2 bg-white text-[#1e3a5f] rounded-lg border border-gray-200 hover:border-[#1e3a5f] transition-colors text-sm"
            >
              <CalendarDays className="w-4 h-4" />
              {filters.dateRange.start && filters.dateRange.end
                ? `${filters.dateRange.start} ~ ${filters.dateRange.end}`
                : '选择日期区间'}
            </button>
          )}

          {onExport && (
            <button
              onClick={onExport}
              className="flex items-center gap-2 px-4 py-2 bg-[#1e3a5f] text-white rounded-lg hover:bg-[#2d4a6f] transition-colors text-sm font-medium shadow-md hover:shadow-lg"
            >
              导出CSV
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
