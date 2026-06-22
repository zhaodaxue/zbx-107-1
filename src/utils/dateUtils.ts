import {
  format,
  startOfWeek,
  endOfWeek,
  parseISO,
  isWithinInterval,
  subWeeks,
  getISOWeek,
  getYear,
} from 'date-fns';
import { zhCN } from 'date-fns/locale';

export const formatDate = (date: string | Date, pattern: string = 'yyyy-MM-dd'): string => {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, pattern, { locale: zhCN });
};

export const getWeekStart = (date: string | Date): Date => {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return startOfWeek(d, { weekStartsOn: 1 });
};

export const getWeekEnd = (date: string | Date): Date => {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return endOfWeek(d, { weekStartsOn: 1 });
};

export const getWeekLabel = (date: string | Date): string => {
  const d = typeof date === 'string' ? parseISO(date) : date;
  const weekNum = getISOWeek(d);
  const year = getYear(d);
  return `${year}年第${weekNum}周`;
};

export const isDateInRange = (
  date: string,
  start: string,
  end: string
): boolean => {
  const d = parseISO(date);
  const s = parseISO(start);
  const e = parseISO(end);
  return isWithinInterval(d, { start: s, end: e });
};

export const getPreviousWeekStart = (date: string | Date): Date => {
  const weekStart = getWeekStart(date);
  return subWeeks(weekStart, 1);
};

export const getPreviousWeekEnd = (date: string | Date): Date => {
  const weekEnd = getWeekEnd(date);
  return subWeeks(weekEnd, 1);
};

export const formatWeekRange = (start: Date, end: Date): string => {
  return `${format(start, 'MM/dd', { locale: zhCN })} - ${format(end, 'MM/dd', { locale: zhCN })}`;
};
