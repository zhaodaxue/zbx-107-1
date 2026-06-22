import { useComplaintAnalysis } from '../hooks/useComplaintAnalysis';
import { Grid3X3, Flame } from 'lucide-react';
import { cn } from '../lib/utils';

const TIME_SLOTS: { key: '晨' | '午' | '晚'; label: string; time: string }[] = [
  { key: '晨', label: '晨间', time: '06:00-09:00' },
  { key: '午', label: '午间', time: '11:00-14:00' },
  { key: '晚', label: '晚间', time: '18:00-22:00' },
];

export const TimeSlotMatrix = () => {
  const { parks, getMatrixByParkAndSlot, filters } = useComplaintAnalysis();

  const activeParks = parks.filter((p) => filters.selectedParks.includes(p.parkId));

  if (activeParks.length === 0) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-[0_4px_20px_rgba(30,58,95,0.08)] animate-fadeIn">
        <div className="flex items-center gap-2 mb-4">
          <Grid3X3 className="w-5 h-5 text-[#1e3a5f]" />
          <h2 className="text-lg font-bold text-[#1e3a5f]">时段投诉矩阵</h2>
        </div>
        <div className="h-64 flex items-center justify-center text-gray-400">
          请选择至少一个公园
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-[0_4px_20px_rgba(30,58,95,0.08)] animate-fadeIn">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Grid3X3 className="w-5 h-5 text-[#1e3a5f]" />
          <h2 className="text-lg font-bold text-[#1e3a5f]">时段投诉矩阵</h2>
        </div>
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-gradient-to-br from-[#ff6b35] to-[#ff8c5a] animate-glow" />
            <span>升温预警</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-gray-100" />
            <span>正常</span>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left py-3 px-4 text-sm font-semibold text-[#1e3a5f] bg-[#e8f0f7] rounded-tl-lg">
                公园\时段
              </th>
              {TIME_SLOTS.map((slot) => (
                <th
                  key={slot.key}
                  className="text-center py-3 px-4 text-sm font-semibold text-[#1e3a5f] bg-[#e8f0f7] last:rounded-tr-lg"
                >
                  <div>{slot.label}</div>
                  <div className="text-xs font-normal text-gray-500">{slot.time}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {activeParks.map((park, parkIndex) => (
              <tr
                key={park.parkId}
                className="border-b border-gray-100 last:border-b-0"
                style={{ animationDelay: `${parkIndex * 80}ms` }}
              >
                <td className="py-4 px-4 bg-gray-50/50">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-[#2d3748]">{park.parkName}</span>
                  </div>
                </td>
                {TIME_SLOTS.map((slot, slotIndex) => {
                  const cell = getMatrixByParkAndSlot(park.parkId, slot.key);
                  const count = cell?.complaintCount || 0;
                  const isHeating = cell?.isHeating || false;
                  const growthRate = cell?.growthRate || 0;

                  return (
                    <td
                      key={slot.key}
                      className={cn(
                        'py-4 px-4 text-center transition-all duration-200',
                        slotIndex < TIME_SLOTS.length - 1 && 'border-r border-gray-100'
                      )}
                    >
                      <div
                        className={cn(
                          'relative p-3 rounded-lg transition-all duration-300 group cursor-pointer',
                          isHeating
                            ? 'bg-gradient-to-br from-[#ff6b35] to-[#ff8c5a] text-white shadow-lg shadow-orange-200 animate-glow'
                            : count > 0
                            ? 'bg-[#e8f0f7] text-[#1e3a5f] hover:bg-[#d0e0ef]'
                            : 'bg-gray-50 text-gray-400'
                        )}
                      >
                        <div
                          className={cn(
                            'text-2xl font-bold tabular-nums',
                            isHeating && 'drop-shadow-sm'
                          )}
                        >
                          {count}
                        </div>
                        <div className="text-xs mt-1 opacity-80">
                          {count > 0 ? '次投诉' : '无投诉'}
                        </div>
                        {isHeating && (
                          <div className="absolute top-1 right-1">
                            <Flame className="w-4 h-4 text-yellow-200 animate-pulse" />
                          </div>
                        )}

                        <div
                          className={cn(
                            'absolute inset-0 rounded-lg flex items-center justify-center bg-black/80 text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200',
                            isHeating && 'bg-black/70'
                          )}
                        >
                          {growthRate > 0 && (
                            <span>环比 +{growthRate.toFixed(1)}%</span>
                          )}
                          {growthRate < 0 && (
                            <span>环比 {growthRate.toFixed(1)}%</span>
                          )}
                          {growthRate === 0 && count > 0 && <span>与上周持平</span>}
                          {count === 0 && <span>无数据</span>}
                        </div>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-400 text-center">
          * 单元格显示本周该时段投诉总量，悬停可查看环比变化
        </p>
      </div>
    </div>
  );
};
