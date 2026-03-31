import { useState, useCallback } from 'react';

export type Era = '2007' | '2010' | '2013' | '2016' | '2020' | '2026';

export interface ChipConfig {
  name: string;
  cores: number;
  maxFreq: number;
  process: number;
  overclock: number;
  score: number;
}

export interface CameraConfig {
  id: string;
  name: string;
  megapixels: number;
  aperture: string;
  features: string[];
  count: number;
}

export interface OSConfig {
  id: string;
  name: string;
  type: 'android' | 'ios' | 'custom';
  animationLevel: number;
  iconStyle: 'ios' | 'android' | 'custom';
  theme: 'default' | 'dark' | 'liquid-glass';
  customKernel: boolean;
}

export interface PhoneConfig {
  era: Era;
  name: string;
  brand: string;
  screenSize: number;
  screenType: 'lcd' | 'amoled' | 'oled';
  chip: ChipConfig;
  cameras: CameraConfig[];
  os: OSConfig;
  material: 'plastic' | 'aluminum' | 'titanium' | 'ceramic';
  color: string;
  battery: number;
  price: number;
}

export interface GameState {
  money: number;
  researchPoints: number;
  totalResearchMax: number;
  unlockedTech: string[];
  era: Era;
  phonesReleased: number;
  currentPhone: PhoneConfig;
  ratings: { name: string; score: number; price: number }[];
}

export const ERAS: { id: Era; label: string; year: number; desc: string }[] = [
  { id: '2007', label: '2007', year: 2007, desc: 'Кнопочная эра — первые тачскрины' },
  { id: '2010', label: '2010', year: 2010, desc: 'Полноценный тачскрин, первые HD-экраны' },
  { id: '2013', label: '2013', year: 2013, desc: 'Полусенсорные — кнопка Home + тачскрин' },
  { id: '2016', label: '2016', year: 2016, desc: 'Двойные камеры, AMOLED, безрамочность' },
  { id: '2020', label: '2020', year: 2020, desc: '5G, 108МП камеры, 120Гц дисплеи' },
  { id: '2026', label: '2026', year: 2026, desc: 'AI-чипы, жидкое стекло, 2нм техпроцесс' },
];

export const CHIPS: ChipConfig[] = [
  { name: 'BasicChip X1', cores: 2, maxFreq: 1200, process: 65, overclock: 0, score: 100 },
  { name: 'MidCore A4', cores: 4, maxFreq: 2400, process: 28, overclock: 5, score: 350 },
  { name: 'PowerDrive 8', cores: 8, maxFreq: 3200, process: 7, overclock: 15, score: 1200 },
  { name: 'NeuroCore 12', cores: 12, maxFreq: 4800, process: 4, overclock: 25, score: 4800 },
  { name: 'DragonFire 8 Elite', cores: 16, maxFreq: 8000, process: 3, overclock: 40, score: 18000 },
  { name: 'APEX UltraChip', cores: 16, maxFreq: 280000, process: 2, overclock: 100, score: 280000 },
];

export const CAMERAS: CameraConfig[] = [
  { id: 'basic', name: 'Базовая VGA', megapixels: 2, aperture: 'f/2.8', features: ['Фото'], count: 1 },
  { id: 'hd', name: 'HD Shooter', megapixels: 13, aperture: 'f/2.2', features: ['Фото', 'Видео 1080p'], count: 1 },
  { id: 'dual', name: 'Двойная система', megapixels: 50, aperture: 'f/1.8', features: ['Фото', '4K видео', 'Портрет'], count: 2 },
  { id: 'triple', name: 'Triple AI Cam', megapixels: 108, aperture: 'f/1.6', features: ['Фото', '8K видео', 'Портрет', 'Перископ'], count: 3 },
  { id: 'quad', name: 'Quad Matrix', megapixels: 200, aperture: 'f/1.4', features: ['Фото', '8K видео', 'Перископ', 'Ночной режим', 'AI'], count: 4 },
  { id: 'custom', name: 'Custom Array Pro', megapixels: 500, aperture: 'f/1.2', features: ['Фото', '16K видео', 'Перископ', 'Ночной режим', 'AI', 'Лидар', 'Термо'], count: 5 },
];

export const OS_OPTIONS: OSConfig[] = [
  { id: 'android_basic', name: 'DroidOS Lite', type: 'android', animationLevel: 1, iconStyle: 'android', theme: 'default', customKernel: false },
  { id: 'ios_like', name: 'PureOS', type: 'ios', animationLevel: 3, iconStyle: 'ios', theme: 'default', customKernel: false },
  { id: 'android_pro', name: 'DroidOS Pro', type: 'android', animationLevel: 2, iconStyle: 'android', theme: 'dark', customKernel: false },
  { id: 'custom_light', name: 'NexOS Light', type: 'custom', animationLevel: 4, iconStyle: 'custom', theme: 'default', customKernel: true },
  { id: 'liquid', name: 'LiquidOS', type: 'custom', animationLevel: 5, iconStyle: 'custom', theme: 'liquid-glass', customKernel: true },
  { id: 'apex', name: 'APEX Neural OS', type: 'custom', animationLevel: 5, iconStyle: 'custom', theme: 'liquid-glass', customKernel: true },
];

export const TECH_TREE: { id: string; name: string; cost: number; era: Era; unlocks: string }[] = [
  { id: 'multi_camera', name: 'Двойная камера', cost: 5000, era: '2016', unlocks: 'Камера 2+ объектива' },
  { id: 'amoled', name: 'AMOLED дисплей', cost: 8000, era: '2016', unlocks: 'OLED/AMOLED экраны' },
  { id: 'custom_os', name: 'Своя ОС', cost: 50000, era: '2020', unlocks: 'Разработка кастомной ОС' },
  { id: 'custom_chip', name: 'Свой чип', cost: 80000, era: '2020', unlocks: 'Проектирование процессора' },
  { id: 'liquid_glass', name: 'Liquid Glass UI', cost: 150000, era: '2026', unlocks: 'Жидкое стекло в интерфейсе' },
  { id: 'apex_chip', name: 'APEX 2нм чип', cost: 280000, era: '2026', unlocks: 'Революционный чип 280 000 MHz' },
];

const DEFAULT_PHONE: PhoneConfig = {
  era: '2013',
  name: 'PhoneCraft Pro',
  brand: 'MyBrand',
  screenSize: 6.1,
  screenType: 'amoled',
  chip: CHIPS[2],
  cameras: [CAMERAS[1]],
  os: OS_OPTIONS[0],
  material: 'aluminum',
  color: '#1a1a2e',
  battery: 4000,
  price: 599,
};

export const DEFAULT_STATE: GameState = {
  money: 1000000,
  researchPoints: 0,
  totalResearchMax: 280000,
  unlockedTech: [],
  era: '2013',
  phonesReleased: 0,
  currentPhone: DEFAULT_PHONE,
  ratings: [],
};

export function calcPhoneScore(phone: PhoneConfig): number {
  let score = 0;
  score += phone.chip.score;
  score += phone.cameras.reduce((s, c) => s + c.megapixels * 10, 0);
  score += phone.os.animationLevel * 500;
  if (phone.os.customKernel) score += 5000;
  score += phone.battery / 10;
  const materialBonus = { plastic: 1, aluminum: 1.2, titanium: 1.5, ceramic: 1.8 };
  score *= materialBonus[phone.material];
  return Math.round(score);
}

export function calcPhoneRating(phone: PhoneConfig): number {
  const score = calcPhoneScore(phone);
  const expectedPrice = score / 50;
  const priceRatio = expectedPrice / phone.price;
  const rating = Math.min(10, Math.max(1, 5 * priceRatio));
  return Math.round(rating * 10) / 10;
}
