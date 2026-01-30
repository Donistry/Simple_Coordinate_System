
export type Language = 'en' | 'zh';

export interface Point {
  id: string;
  x: number;
  y: number;
  color: string;
  size: number;
  label: string;
  visible: boolean;
}

export interface Vector {
  id: string;
  startX: number;
  startY: number;
  length: number;
  angle: number;
  color: string;
  thickness: number;
  arrowSize: number;
  label: string;
  labelPosition: number; // 0 (start) to 1 (end)
  visible: boolean;
}

export interface GridConfig {
  bgColor: string;
  axisColor: string;
  gridColorMajor: string;
  gridColorMinor: string;
  textColor: string;
  unitSizeX: number; // Pixels per 1 unit on X axis
  unitSizeY: number; // Pixels per 1 unit on Y axis
  lockAspectRatio: boolean;
  showGrid: boolean;
  showLabels: boolean;
  originX: number; // Offset from center
  originY: number; // Offset from center
}
