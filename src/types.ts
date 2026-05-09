export type FurnitureType = 'bed' | 'wardrobe' | 'desk' | 'plant' | 'poster' | 'clock' | 'door' | 'window';

export type WallId = 'back' | 'left' | 'right' | 'front';

export interface FurnitureInstance {
  id: string;
  type: FurnitureType;
  x: number;
  y: number;
  color: string;
  description: string;
  shape: number;
  rotation: number;
  scale: number;
  wall?: WallId;
}

export type FloorStyle = 'wood' | 'tile' | 'carpet' | 'paint';
export type WallStyle = 'paint' | 'brick' | 'wallpaper' | 'wood';

export interface RoomState {
  description: string;
  furniture: FurnitureInstance[];
  floorStyle: FloorStyle;
  floorColor: string;
  wallStyle: WallStyle;
  wallColor: string;
}

export const WALL_MOUNTED_TYPES: FurnitureType[] = ['poster', 'clock', 'door', 'window'];
export const isWallMounted = (type: FurnitureType) => WALL_MOUNTED_TYPES.includes(type);



// Default sizes for each type (width x height at scale 1) - increased for better visibility
export const FURNITURE_SIZES: Record<FurnitureType, { w: number; h: number }[]> = {
  bed:      [{ w: 70, h: 110 }, { w: 95, h: 120 }, { w: 115, h: 130 }],
  wardrobe: [{ w: 65, h: 45 }, { w: 85, h: 50 }, { w: 110, h: 55 }],
  desk:     [{ w: 85, h: 55 }, { w: 95, h: 85 }, { w: 115, h: 55 }],
  plant:    [{ w: 60, h: 60 }],
  poster:   [{ w: 50, h: 70 }, { w: 75, h: 50 }, { w: 60, h: 60 }],
  clock:    [{ w: 48, h: 48 }, { w: 45, h: 45 }, { w: 50, h: 50 }],
  door:     [{ w: 55, h: 80 }, { w: 90, h: 80 }, { w: 75, h: 80 }],
  window:   [{ w: 55, h: 60 }, { w: 75, h: 60 }, { w: 100, h: 55 }],
};

export const FURNITURE_CATALOG: Record<FurnitureType, { label: string; emoji: string; defaultColor: string; category: 'floor' | 'wall' }> = {
  bed:      { label: 'Cama',      emoji: '🛏️', defaultColor: '#7c8eb5', category: 'floor' },
  wardrobe: { label: 'Armario',   emoji: '🗄️', defaultColor: '#b08850', category: 'floor' },
  desk:     { label: 'Escritorio',emoji: '📐', defaultColor: '#7a9caa', category: 'floor' },
  plant:    { label: 'Planta',    emoji: '🌿', defaultColor: '#5a9a5a', category: 'floor' },
  poster:   { label: 'Póster',    emoji: '🖼️', defaultColor: '#c05050', category: 'wall' },
  clock:    { label: 'Reloj',     emoji: '🕐', defaultColor: '#f0ece4', category: 'wall' },
  door:     { label: 'Puerta',    emoji: '🚪', defaultColor: '#9a7b5a', category: 'wall' },
  window:   { label: 'Ventana',   emoji: '🪟', defaultColor: '#a8d8ea', category: 'wall' },
};

export const SHAPE_VARIANTS: Record<FurnitureType, string[]> = {
  bed:      ['1 Plaza', '1.5 Plazas', '2 Plazas'],
  wardrobe: ['Pequeño', 'Mediano', 'Grande'],
  desk:     ['Compacto', 'En L', 'Largo'],
  plant:    ['Planta'],
  poster:   ['Vertical', 'Horizontal', 'Cuadrado'],
  clock:    ['Redondo', 'Cuadrado', 'Hexagonal'],
  door:     ['Simple', 'Doble', 'Corrediza'],
  window:   ['Simple', 'Doble', 'Panorámica'],
};

export const COLOR_PRESETS = [
  '#c05050', '#d97706', '#ca8a04', '#65a30d',
  '#059669', '#0891b2', '#6366f1', '#9333ea',
  '#db2777', '#b08850', '#78716c', '#475569',
  '#1e293b', '#f5f5f4', '#e8e0d4', '#b0c4de',
];

export const FLOOR_STYLES: { id: FloorStyle; label: string }[] = [
  { id: 'wood',   label: 'Madera' },
  { id: 'tile',   label: 'Loseta' },
  { id: 'carpet', label: 'Alfombra' },
  { id: 'paint',  label: 'Pintura' },
];

export const WALL_STYLES: { id: WallStyle; label: string }[] = [
  { id: 'paint',     label: 'Pintura' },
  { id: 'brick',     label: 'Ladrillo' },
  { id: 'wallpaper', label: 'Empapelado' },
  { id: 'wood',      label: 'Madera' },
];

export const FLOOR_COLORS = ['#c4a26e', '#e8dcc8', '#a0b0a0', '#d4c4a8', '#8b7355', '#b8c8d8', '#d08080', '#7a9a7a', '#bca58a', '#9bb0c0'];
export const WALL_COLORS = ['#e8e0d4', '#d4c8b8', '#c8d8e0', '#d8d0c4', '#b8c0a8', '#e0d0c0', '#f0e8dc', '#d0c0b0', '#c0d4c8', '#e8d8c8'];
