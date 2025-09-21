export enum AppStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export enum ColorBlindnessType {
  NORMAL = 'Normal',
  PROTANOPIA = 'Protanopia',
  DEUTERANOPIA = 'Deuteranopia',
  TRITANOPIA = 'Tritanopia',
  ACHROMATOPSIA = 'Achromatopsia',
}

export interface ColorData {
  role: string;
  hex: string;
  rgb: [number, number, number];
  description: string;
  locked?: boolean;
}

export interface Palette {
  paletteName: string;
  colors: ColorData[];
  generatedName?: string;
  brandMood?: string;
}

export interface WCAGCompliance {
  aa: boolean;
  aaa: boolean;
}
