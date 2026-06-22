import Papa from 'papaparse';
import { ComplaintRecord } from '../types';

interface CsvRow {
  date: string;
  '公园编号': string;
  '公园名': string;
  '投诉时段标签': string;
  '投诉次数': string;
  '当日最高分贝': string;
  '是否周末': string;
  '周边是否有施工': string;
}

export const parseCsvData = (csvContent: string): ComplaintRecord[] => {
  const result = Papa.parse<CsvRow>(csvContent, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header) => header.trim(),
  });

  if (result.errors.length > 0) {
    console.error('CSV解析错误:', result.errors);
    throw new Error('CSV数据解析失败');
  }

  return result.data.map((row) => ({
    date: row.date.trim(),
    parkId: row['公园编号'].trim(),
    parkName: row['公园名'].trim(),
    timeSlot: row['投诉时段标签'].trim() as '晨' | '午' | '晚',
    complaintCount: parseInt(row['投诉次数'], 10),
    maxDecibel: parseFloat(row['当日最高分贝']),
    isWeekend: parseInt(row['是否周末'], 10) as 0 | 1,
    hasConstruction: parseInt(row['周边是否有施工'], 10) as 0 | 1,
  }));
};

export const loadCsvFile = async (filePath: string): Promise<ComplaintRecord[]> => {
  const response = await fetch(filePath);
  if (!response.ok) {
    throw new Error(`无法加载CSV文件: ${response.statusText}`);
  }
  const csvContent = await response.text();
  return parseCsvData(csvContent);
};
