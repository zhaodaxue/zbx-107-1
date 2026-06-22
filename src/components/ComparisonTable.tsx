import { useComplaintAnalysis } from '../hooks/useComplaintAnalysis';
import { ArrowUpRight, ArrowDownRight, Minus, Flame, Table2 } from 'lucide-react';
import { cn } from '../lib/utils';

export const ComparisonTable = () => {
  const { comparisonData, heatingCount } = useComplaintAnalysis();

  const renderGrowthRate = (rate: number, isHeating: boolean) => {
    const isPositive = rate > 0;
    const isNegative = rate < 0;

    return (
      <div className="flex items-center gap-1 justify-end">
        {isPositive && <ArrowUpRight className="w-4 h-4 text-red-500" />}
        {isNegative && <ArrowDownRight className="w-4 h-4 text-green-500" />}
        {!isPositive && !isNegative && <Minus className="w-4 h-4 text-gray-400" />}
        <span
          className={cn(
            'font-semibold tabular-nums',
            isPositive ? 'text-red-500' : isNegative ? 'text-green-500' : 'text-gray-500'
          )}
        >
          {isPositive ? '+' : ''}
          {rate.toFixed(1)}%
        </span>
        {isHeating && (
          <span className="flex items-center gap-1 px-2 py-0.5 ml-2 bg-gradient-to-r from-[#ff6b35] to-[#ff8c5a] text-white text-xs font-medium rounded-full animate-pulse-slow">
            <Flame className="w-3 h-3" />
            升温
          </span>
        )}
      </div>
    );
  };

  if (comparisonData.length === 0) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-[0_4px_20px_rgba(30,58,95,0.08)] animate-fadeIn">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Table2 className="w-5 h-5 text-[#1e3a5f]" />
            <h2 className="text-lg font-bold text-[#1e3a5f]">本周环比分析</h2>
          </div>
        </div>
        <div className="h-64 flex items-center justify-center text-gray-400">
          暂无数据
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-[0_4px_20px_rgba(30,58,95,0.08)] animate-fadeIn">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Table2 className="w-5 h-5 text-[#1e3a5f]" />
          <h2 className="text-lg font-bold text-[#1e3a5f]">本周环比分析</h2>
        </div>
        {heatingCount > 0 && (
          <div className="flex items-center gap-1 px-3 py-1 bg-orange-50 text-[#ff6b35] rounded-full text-sm font-medium">
            <Flame className="w-4 h-4" />
            {heatingCount} 个公园升温预警
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-[#e8f0f7]">
              <th className="text-left py-3 px-4 text-sm font-semibold text-[#1e3a5f]">
                公园名称
              </th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-[#1e3a5f]">
                本周投诉
              </th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-[#1e3a5f]">
                上周投诉
              </th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-[#1e3a5f]">
                环比增幅
              </th>
            </tr>
          </thead>
          <tbody>
            {comparisonData.map((item, index) => (
              <tr
                key={item.parkId}
                className={cn(
                  'border-b border-gray-100 transition-colors hover:bg-[#f8fafc]',
                  index % 2 === 0 ? 'bg-gray-50/50' : 'bg-white'
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        'w-2 h-2 rounded-full',
                        item.isHeating ? 'bg-[#ff6b35] animate-pulse' : 'bg-[#1e3a5f]'
                      )}
                    />
                    <span className="font-medium text-[#2d3748]">{item.parkName}</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-right tabular-nums font-semibold text-[#1e3a5f]">
                  {item.currentWeek}
                </td>
                <td className="py-3 px-4 text-right tabular-nums text-gray-500">
                  {item.previousWeek}
                </td>
                <td className="py-3 px-4">
                  {renderGrowthRate(item.growthRate, item.isHeating)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-400 text-center">
          * 增幅≥40%且本周投诉≥3次标记为「升温」
        </p>
      </div>
    </div>
  );
};
