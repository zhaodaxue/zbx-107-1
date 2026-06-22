import Papa from 'papaparse';
import { ComplaintRecord } from '../types';
import { isDateInRange } from './dateUtils';

export const exportToCsv = (
  records: ComplaintRecord[],
  dateRange: { start: string; end: string },
  filename: string = '投诉明细.csv'
): void => {
  const filteredRecords = records.filter((r) =>
    isDateInRange(r.date, dateRange.start, dateRange.end)
  );

  const csvData = filteredRecords.map((record) => ({
    日期: record.date,
    公园编号: record.parkId,
    公园名: record.parkName,
    投诉时段标签: record.timeSlot,
    投诉次数: record.complaintCount,
    当日最高分贝: record.maxDecibel,
    是否周末: record.isWeekend,
    周边是否有施工: record.hasConstruction,
  }));

  const csvContent = Papa.unparse(csvData, {
    header: true,
  });

  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], {
    type: 'text/csv;charset=utf-8;',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
