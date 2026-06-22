import { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useComplaintAnalysis } from '../hooks/useComplaintAnalysis';
import { TrendingUp } from 'lucide-react';

interface TooltipPayloadItem {
  name: string;
  value: number;
  color: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-100">
        <p className="text-sm font-semibold text-[#1e3a5f] mb-2">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-gray-600">{entry.name}:</span>
            <span className="font-semibold tabular-nums">{entry.value} 次</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

interface LegendEventData {
  value: string;
}

export const WeeklyBarChart = () => {
  const { getWeeklyChartData, parks, getParkColors, filters } =
    useComplaintAnalysis();
  const [hiddenParks, setHiddenParks] = useState<Set<string>>(new Set());

  const chartData = getWeeklyChartData();
  const parkColors = getParkColors();

  const handleLegendClick = (data: LegendEventData) => {
    const park = parks.find((p) => p.parkName === data.value);
    if (park) {
      setHiddenParks((prev) => {
        const next = new Set(prev);
        if (next.has(park.parkId)) {
          next.delete(park.parkId);
        } else {
          next.add(park.parkId);
        }
        return next;
      });
    }
  };

  const handleLegendMouseEnter = (data: LegendEventData) => {
    const park = parks.find((p) => p.parkName === data.value);
    if (park) {
      const newHidden = new Set<string>();
      parks.forEach((p) => {
        if (p.parkId !== park.parkId) {
          newHidden.add(p.parkId);
        }
      });
      setHiddenParks(newHidden);
    }
  };

  const handleLegendMouseLeave = () => {
    setHiddenParks((prev) => {
      if (prev.size === 0) return prev;
      const park = parks.find(
        (p) => !prev.has(p.parkId) && filters.selectedParks.includes(p.parkId)
      );
      if (park) {
        const originalHidden = new Set<string>();
        parks.forEach((p) => {
          if (!filters.selectedParks.includes(p.parkId)) {
            originalHidden.add(p.parkId);
          }
        });
        return originalHidden;
      }
      return prev;
    });
  };

  const visibleParks = parks
    .filter((p) => filters.selectedParks.includes(p.parkId));

  if (chartData.length === 0) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-[0_4px_20px_rgba(30,58,95,0.08)] animate-fadeIn">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-[#1e3a5f]" />
          <h2 className="text-lg font-bold text-[#1e3a5f]">各公园周投诉汇总</h2>
        </div>
        <div className="h-80 flex items-center justify-center text-gray-400">
          暂无数据
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-[0_4px_20px_rgba(30,58,95,0.08)] animate-fadeIn">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-[#1e3a5f]" />
          <h2 className="text-lg font-bold text-[#1e3a5f]">各公园周投诉汇总</h2>
        </div>
        <span className="text-xs text-gray-400">点击图例可切换公园显示</span>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <defs>
              {visibleParks.map((park) => (
                <linearGradient
                  key={park.parkId}
                  id={`gradient-${park.parkId}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor={parkColors[park.parkId]}
                    stopOpacity={0.9}
                  />
                  <stop
                    offset="100%"
                    stopColor={parkColors[park.parkId]}
                    stopOpacity={0.6}
                  />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
            <XAxis
              dataKey="weekLabel"
              tick={{ fontSize: 12, fill: '#6b7280' }}
              axisLine={{ stroke: '#e5e7eb' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: '#6b7280' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              onClick={handleLegendClick}
              onMouseEnter={handleLegendMouseEnter}
              onMouseLeave={handleLegendMouseLeave}
              formatter={(value) => {
                const park = parks.find((p) => p.parkName === value);
                const isSelected = park
                  ? !hiddenParks.has(park.parkId) && filters.selectedParks.includes(park.parkId)
                  : true;
                return (
                  <span
                    style={{
                      color: isSelected ? '#374151' : '#d1d5db',
                      textDecoration: isSelected ? 'none' : 'line-through',
                      cursor: 'pointer',
                      fontSize: '12px',
                    }}
                  >
                    {value}
                  </span>
                );
              }}
              wrapperStyle={{ paddingTop: '20px' }}
            />
            {visibleParks.map((park) => (
              <Bar
                key={park.parkId}
                dataKey={park.parkName}
                fill={`url(#gradient-${park.parkId})`}
                radius={[4, 4, 0, 0]}
                hide={hiddenParks.has(park.parkId)}
                animationDuration={600}
                animationEasing="ease-out"
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
