export interface ComplaintRecord {
  date: string;
  parkId: string;
  parkName: string;
  timeSlot: '晨' | '午' | '晚';
  complaintCount: number;
  maxDecibel: number;
  isWeekend: 0 | 1;
  hasConstruction: 0 | 1;
}

export interface FilterOptions {
  onlyWeekend: boolean;
  onlyConstruction: boolean;
  dateRange: { start: string; end: string };
  selectedParks: string[];
}

export interface WeeklyData {
  weekStart: string;
  weekEnd: string;
  weekLabel: string;
  parkId: string;
  parkName: string;
  totalComplaints: number;
}

export interface ComparisonData {
  parkId: string;
  parkName: string;
  currentWeek: number;
  previousWeek: number;
  growthRate: number;
  isHeating: boolean;
}

export interface MatrixCell {
  parkId: string;
  parkName: string;
  timeSlot: '晨' | '午' | '晚';
  complaintCount: number;
  isHeating: boolean;
  growthRate: number;
}

export interface ParkInfo {
  parkId: string;
  parkName: string;
}
