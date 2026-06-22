import {
  ComplaintRecord,
  FilterOptions,
  WeeklyData,
  ComparisonData,
  MatrixCell,
  ParkInfo,
} from '../types';
import {
  getWeekStart,
  getWeekEnd,
  getWeekLabel,
  isDateInRange,
  formatDate,
} from './dateUtils';

export const filterRecords = (
  records: ComplaintRecord[],
  filters: FilterOptions
): ComplaintRecord[] => {
  return records.filter((record) => {
    if (filters.onlyWeekend && record.isWeekend !== 1) {
      return false;
    }
    if (filters.onlyConstruction && record.hasConstruction !== 1) {
      return false;
    }
    if (filters.dateRange.start && filters.dateRange.end) {
      if (!isDateInRange(record.date, filters.dateRange.start, filters.dateRange.end)) {
        return false;
      }
    }
    if (filters.selectedParks.length > 0 && !filters.selectedParks.includes(record.parkId)) {
      return false;
    }
    return true;
  });
};

export const getParkList = (records: ComplaintRecord[]): ParkInfo[] => {
  const parkMap = new Map<string, string>();
  records.forEach((record) => {
    if (!parkMap.has(record.parkId)) {
      parkMap.set(record.parkId, record.parkName);
    }
  });
  return Array.from(parkMap.entries()).map(([parkId, parkName]) => ({
    parkId,
    parkName,
  }));
};

export const calculateWeeklyData = (
  records: ComplaintRecord[],
  parks: ParkInfo[]
): WeeklyData[] => {
  const weekMap = new Map<string, WeeklyData>();

  records.forEach((record) => {
    const weekStart = formatDate(getWeekStart(record.date));
    const weekEnd = formatDate(getWeekEnd(record.date));
    const weekLabel = getWeekLabel(record.date);
    const key = `${weekStart}-${record.parkId}`;

    if (!weekMap.has(key)) {
      weekMap.set(key, {
        weekStart,
        weekEnd,
        weekLabel,
        parkId: record.parkId,
        parkName: record.parkName,
        totalComplaints: 0,
      });
    }

    const existing = weekMap.get(key)!;
    existing.totalComplaints += record.complaintCount;
  });

  const allWeeks = getAllWeeks(records);
  const result: WeeklyData[] = [];

  allWeeks.forEach((week) => {
    parks.forEach((park) => {
      const key = `${week.weekStart}-${park.parkId}`;
      if (weekMap.has(key)) {
        result.push(weekMap.get(key)!);
      } else {
        result.push({
          weekStart: week.weekStart,
          weekEnd: week.weekEnd,
          weekLabel: week.weekLabel,
          parkId: park.parkId,
          parkName: park.parkName,
          totalComplaints: 0,
        });
      }
    });
  });

  return result.sort((a, b) => a.weekStart.localeCompare(b.weekStart));
};

const getAllWeeks = (
  records: ComplaintRecord[]
): { weekStart: string; weekEnd: string; weekLabel: string }[] => {
  const weekSet = new Set<string>();
  const result: { weekStart: string; weekEnd: string; weekLabel: string }[] = [];

  records.forEach((record) => {
    const weekStart = formatDate(getWeekStart(record.date));
    if (!weekSet.has(weekStart)) {
      weekSet.add(weekStart);
      result.push({
        weekStart,
        weekEnd: formatDate(getWeekEnd(record.date)),
        weekLabel: getWeekLabel(record.date),
      });
    }
  });

  return result.sort((a, b) => a.weekStart.localeCompare(b.weekStart));
};

export const calculateComparisonData = (
  records: ComplaintRecord[],
  parks: ParkInfo[]
): ComparisonData[] => {
  const sortedDates = [...new Set(records.map((r) => r.date))].sort();
  if (sortedDates.length === 0) {
    return [];
  }

  const latestDate = sortedDates[sortedDates.length - 1];
  const currentWeekStart = formatDate(getWeekStart(latestDate));
  const currentWeekEnd = formatDate(getWeekEnd(latestDate));

  const previousWeekStartDate = getWeekStart(latestDate);
  previousWeekStartDate.setDate(previousWeekStartDate.getDate() - 7);
  const previousWeekStart = formatDate(previousWeekStartDate);
  const previousWeekEndDate = getWeekEnd(latestDate);
  previousWeekEndDate.setDate(previousWeekEndDate.getDate() - 7);
  const previousWeekEnd = formatDate(previousWeekEndDate);

  return parks.map((park) => {
    const currentWeekRecords = records.filter(
      (r) =>
        r.parkId === park.parkId &&
        isDateInRange(r.date, currentWeekStart, currentWeekEnd)
    );
    const previousWeekRecords = records.filter(
      (r) =>
        r.parkId === park.parkId &&
        isDateInRange(r.date, previousWeekStart, previousWeekEnd)
    );

    const currentWeek = currentWeekRecords.reduce(
      (sum, r) => sum + r.complaintCount,
      0
    );
    const previousWeek = previousWeekRecords.reduce(
      (sum, r) => sum + r.complaintCount,
      0
    );

    const growthRate =
      previousWeek > 0
        ? ((currentWeek - previousWeek) / previousWeek) * 100
        : currentWeek > 0
        ? 100
        : 0;

    const isHeating = growthRate >= 40 && currentWeek >= 3;

    return {
      parkId: park.parkId,
      parkName: park.parkName,
      currentWeek,
      previousWeek,
      growthRate: Math.round(growthRate * 10) / 10,
      isHeating,
    };
  });
};

export const calculateMatrixData = (
  records: ComplaintRecord[],
  parks: ParkInfo[]
): MatrixCell[] => {
  const sortedDates = [...new Set(records.map((r) => r.date))].sort();
  if (sortedDates.length === 0) {
    return [];
  }

  const latestDate = sortedDates[sortedDates.length - 1];
  const currentWeekStart = formatDate(getWeekStart(latestDate));
  const currentWeekEnd = formatDate(getWeekEnd(latestDate));

  const previousWeekStartDate = getWeekStart(latestDate);
  previousWeekStartDate.setDate(previousWeekStartDate.getDate() - 7);
  const previousWeekStart = formatDate(previousWeekStartDate);
  const previousWeekEndDate = getWeekEnd(latestDate);
  previousWeekEndDate.setDate(previousWeekEndDate.getDate() - 7);
  const previousWeekEnd = formatDate(previousWeekEndDate);

  const timeSlots: ('晨' | '午' | '晚')[] = ['晨', '午', '晚'];
  const result: MatrixCell[] = [];

  parks.forEach((park) => {
    timeSlots.forEach((slot) => {
      const currentRecords = records.filter(
        (r) =>
          r.parkId === park.parkId &&
          r.timeSlot === slot &&
          isDateInRange(r.date, currentWeekStart, currentWeekEnd)
      );
      const previousRecords = records.filter(
        (r) =>
          r.parkId === park.parkId &&
          r.timeSlot === slot &&
          isDateInRange(r.date, previousWeekStart, previousWeekEnd)
      );

      const currentCount = currentRecords.reduce(
        (sum, r) => sum + r.complaintCount,
        0
      );
      const previousCount = previousRecords.reduce(
        (sum, r) => sum + r.complaintCount,
        0
      );

      const growthRate =
        previousCount > 0
          ? ((currentCount - previousCount) / previousCount) * 100
          : currentCount > 0
          ? 100
          : 0;

      const isHeating = growthRate >= 40 && currentCount >= 3;

      result.push({
        parkId: park.parkId,
        parkName: park.parkName,
        timeSlot: slot,
        complaintCount: currentCount,
        isHeating,
        growthRate: Math.round(growthRate * 10) / 10,
      });
    });
  });

  return result;
};

export const getDateRange = (
  records: ComplaintRecord[]
): { start: string; end: string } => {
  const dates = records.map((r) => r.date).sort();
  if (dates.length === 0) {
    const today = new Date();
    const defaultStart = new Date(today);
    defaultStart.setDate(today.getDate() - 30);
    return {
      start: formatDate(defaultStart),
      end: formatDate(today),
    };
  }
  return {
    start: dates[0],
    end: dates[dates.length - 1],
  };
};
