export type FurnitureType = 
  // Muebles (floor)
  | 'bed' | 'wardrobe' | 'desk' | 'chair' | 'plant' | 'tv' | 'easel'
  // Pared (wall)
  | 'poster' | 'painting' | 'clock' | 'calendar' | 'diplomas' | 'door' | 'window'
  // Decoracion
  | 'instruments' | 'exercise_mat' | 'gym_equipment' | 'calculator' | 'computer' 
  | 'diary' | 'sewing' | 'photos' | 'tools' | 'board_games' | 'book' 
  | 'plushies' | 'memories' | 'puzzles' | 'souvenirs' | 'trophies' 
  | 'folders' | 'work_clothes' | 'going_out_clothes' | 'home_clothes' 
  | 'elegant_clothes' | 'work_uniform' | 'formal_clothes' | 'agenda';

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

export const WALL_MOUNTED_TYPES: FurnitureType[] = ['poster', 'painting', 'clock', 'calendar', 'diplomas', 'door', 'window'];
export const isWallMounted = (type: FurnitureType) => WALL_MOUNTED_TYPES.includes(type);

// Psychometric dimensions (7 dimensions):
// 1. Procesamiento analitico y logico
// 2. Organizacion y ejecucion metodica
// 3. Dinamica interpersonal y empatia
// 4. Innovacion y pensamiento divergente
// 5. Liderazgo, influencia y asertividad
// 6. Pragmatismo y ejecucion tangible
// 7. Regulacion intrapersonal y entorno de vida

export const DIMENSION_LABELS = [
  'Procesamiento analitico y logico',
  'Organizacion y ejecucion metodica',
  'Dinamica interpersonal y empatia',
  'Innovacion y pensamiento divergente',
  'Liderazgo, influencia y asertividad',
  'Pragmatismo y ejecucion tangible',
  'Regulacion intrapersonal y entorno de vida',
];

// Each element contributes to specific dimensions (1-indexed in comments, 0-indexed in array)
// Empty array means [0,0,0,0,0,0,0]
export const FURNITURE_DIMENSIONS: Record<FurnitureType, number[]> = {
  // Muebles
  bed: [0,0,0,0,0,0,0],
  wardrobe: [0,0,0,0,0,0,0],
  desk: [0,0,0,0,0,0,0],
  chair: [0,0,0,0,0,0,0],
  plant: [0,0,0,1,0,1,0],      // 4, 6
  tv: [0,0,0,0,0,0,0],
  easel: [0,0,0,1,0,0,0],      // 4
  // Pared
  poster: [0,0,0,0,0,0,0],
  painting: [0,0,0,0,0,0,0],
  clock: [0,0,0,0,0,0,0],
  calendar: [0,0,1,0,0,0,0],   // 3
  diplomas: [0,0,0,0,1,0,0],   // 5
  door: [0,0,0,0,0,0,0],
  window: [0,0,0,0,0,0,0],
  // Decoracion
  instruments: [0,0,0,1,0,0,0],        // 4
  exercise_mat: [0,0,0,0,0,1,1],       // 6, 7
  gym_equipment: [0,0,0,0,0,1,1],      // 6, 7
  calculator: [1,0,0,0,0,0,0],         // 1
  computer: [0,0,0,0,0,0,0],           // X
  diary: [0,0,0,0,0,0,1],              // 7
  sewing: [0,0,1,1,0,0,0],             // 3, 4
  photos: [0,0,1,0,0,0,0],             // 3
  tools: [0,0,0,0,0,1,0],              // 6
  board_games: [0,0,1,0,0,0,0],        // 3
  book: [0,0,0,0,0,0,0],               // X
  plushies: [0,0,1,0,0,0,0],           // 3
  memories: [0,0,1,0,0,0,0],           // 3
  puzzles: [1,0,0,0,0,0,0],            // 1
  souvenirs: [0,0,1,1,0,0,1],          // 3, 4, 7
  trophies: [0,0,0,0,1,0,1],           // 5, 7
  folders: [0,0,0,0,0,0,0],            // X
  work_clothes: [0,0,0,0,0,1,0],       // 6
  going_out_clothes: [0,0,0,1,0,0,0],  // 4
  home_clothes: [0,0,0,0,0,0,1],       // 7
  elegant_clothes: [0,0,0,0,1,0,0],    // 5
  work_uniform: [0,0,0,0,0,0,0],       // X
  formal_clothes: [0,0,0,0,1,0,0],     // 5
  agenda: [0,1,0,0,0,0,0],             // 2
};

// Calculate the 7-dimension vector from placed furniture (unique types only)
export function calculateDimensionVector(furniture: FurnitureInstance[]): number[] {
  const vector = [0,0,0,0,0,0,0];
  const seenTypes = new Set<FurnitureType>();
  
  for (const item of furniture) {
    if (seenTypes.has(item.type)) continue;
    seenTypes.add(item.type);
    const dims = FURNITURE_DIMENSIONS[item.type];
    for (let i = 0; i < 7; i++) {
      vector[i] += dims[i];
    }
  }
  return vector;
}

// Default sizes for each type (width x height at scale 1) - only one variant per type
export const FURNITURE_SIZES: Record<FurnitureType, { w: number; h: number }[]> = {
  // Muebles
  bed:      [{ w: 70, h: 110 }],
  wardrobe: [{ w: 65, h: 45 }],
  desk:     [{ w: 170, h: 110 }],  // Doubled size
  chair:    [{ w: 45, h: 45 }],
  plant:    [{ w: 60, h: 60 }],
  tv:       [{ w: 80, h: 50 }],
  easel:    [{ w: 55, h: 70 }],
  // Pared
  poster:   [{ w: 50, h: 70 }],
  painting: [{ w: 60, h: 50 }],
  clock:    [{ w: 48, h: 48 }],
  calendar: [{ w: 40, h: 55 }],
  diplomas: [{ w: 55, h: 45 }],
  door:     [{ w: 55, h: 80 }],
  window:   [{ w: 55, h: 60 }],
  // Decoracion
  instruments:       [{ w: 80, h: 50 }],  // Piano shape
  exercise_mat:      [{ w: 120, h: 70 }], // Doubled size
  gym_equipment:     [{ w: 55, h: 55 }],
  calculator:        [{ w: 30, h: 40 }],
  computer:          [{ w: 50, h: 40 }],
  diary:             [{ w: 35, h: 45 }],
  sewing:            [{ w: 45, h: 40 }],
  photos:            [{ w: 40, h: 50 }],  // Single photo shape
  tools:             [{ w: 55, h: 40 }],  // Toolbox shape
  board_games:       [{ w: 50, h: 50 }],
  book:              [{ w: 35, h: 45 }],
  plushies:          [{ w: 45, h: 45 }],
  memories:          [{ w: 40, h: 35 }],  // Small box
  puzzles:           [{ w: 45, h: 45 }],  // Rubik's cube
  souvenirs:         [{ w: 40, h: 55 }],  // Snow globe
  trophies:          [{ w: 40, h: 55 }],  // Cup trophy
  folders:           [{ w: 40, h: 50 }],  // School folder
  work_clothes:      [{ w: 45, h: 55 }],
  going_out_clothes: [{ w: 45, h: 55 }],
  home_clothes:      [{ w: 45, h: 55 }],
  elegant_clothes:   [{ w: 45, h: 55 }],
  work_uniform:      [{ w: 45, h: 55 }],
  formal_clothes:    [{ w: 45, h: 55 }],
  agenda:            [{ w: 35, h: 45 }],
};

export type FurnitureCategory = 'floor' | 'wall' | 'decor';

export const FURNITURE_CATALOG: Record<FurnitureType, { label: string; defaultColor: string; category: FurnitureCategory }> = {
  // Muebles (floor)
  bed:      { label: 'Cama',        defaultColor: '#7c8eb5', category: 'floor' },
  wardrobe: { label: 'Armario',     defaultColor: '#b08850', category: 'floor' },
  desk:     { label: 'Escritorio',  defaultColor: '#7a9caa', category: 'floor' },
  chair:    { label: 'Silla',       defaultColor: '#8b7355', category: 'floor' },
  plant:    { label: 'Plantas',     defaultColor: '#5a9a5a', category: 'floor' },
  tv:       { label: 'Televisor',   defaultColor: '#2a2a2a', category: 'floor' },
  easel:    { label: 'Caballete',   defaultColor: '#c4a26e', category: 'floor' },
  // Pared (wall)
  poster:   { label: 'Poster',      defaultColor: '#c05050', category: 'wall' },
  painting: { label: 'Cuadro',      defaultColor: '#6366f1', category: 'wall' },
  clock:    { label: 'Reloj',       defaultColor: '#f0ece4', category: 'wall' },
  calendar: { label: 'Calendario', defaultColor: '#e8e0d4', category: 'wall' },
  diplomas: { label: 'Diplomas y titulos', defaultColor: '#c4a26e', category: 'wall' },
  door:     { label: 'Puerta',      defaultColor: '#9a7b5a', category: 'wall' },
  window:   { label: 'Ventana',     defaultColor: '#a8d8ea', category: 'wall' },
  // Decoracion
  instruments:       { label: 'Instrumentos musicales', defaultColor: '#1e1e1e', category: 'decor' },  // Piano black
  exercise_mat:      { label: 'Alfombra de ejercicio',  defaultColor: '#6366f1', category: 'decor' },
  gym_equipment:     { label: 'Elementos de gimnasio', defaultColor: '#475569', category: 'decor' },
  calculator:        { label: 'Calculadora',           defaultColor: '#78716c', category: 'decor' },
  computer:          { label: 'Computadora',           defaultColor: '#1e293b', category: 'decor' },
  diary:             { label: 'Diario personal',       defaultColor: '#db2777', category: 'decor' },
  sewing:            { label: 'Elementos de costura',  defaultColor: '#ca8a04', category: 'decor' },
  photos:            { label: 'Fotos',                 defaultColor: '#93c5fd', category: 'decor' },  // Light blue
  tools:             { label: 'Herramientas',          defaultColor: '#3b82f6', category: 'decor' },  // Blue toolbox
  board_games:       { label: 'Juegos de mesa sociales', defaultColor: '#059669', category: 'decor' },
  book:              { label: 'Libro',                 defaultColor: '#22c55e', category: 'decor' },  // Green
  plushies:          { label: 'Peluches y juguetes',   defaultColor: '#a16207', category: 'decor' },  // Brown
  memories:          { label: 'Recuerdos',             defaultColor: '#d97706', category: 'decor' },
  puzzles:           { label: 'Rompecabezas',          defaultColor: '#ef4444', category: 'decor' },  // Red for Rubik's
  souvenirs:         { label: 'Souvenirs',             defaultColor: '#a8d8ea', category: 'decor' },  // Snow globe glass
  trophies:          { label: 'Trofeos',               defaultColor: '#fbbf24', category: 'decor' },  // Gold
  folders:           { label: 'Carpetas',              defaultColor: '#6366f1', category: 'decor' },
  work_clothes:      { label: 'Ropa para trabajo',     defaultColor: '#2d4a3e', category: 'decor' },  // Dirty dark green
  going_out_clothes: { label: 'Ropa para salir',       defaultColor: '#ef4444', category: 'decor' },  // Red
  home_clothes:      { label: 'Ropa de entrecasa',     defaultColor: '#7c8eb5', category: 'decor' },
  elegant_clothes:   { label: 'Ropa elegante',         defaultColor: '#f5f5f4', category: 'decor' },  // White suit
  work_uniform:      { label: 'Uniforme de trabajo',   defaultColor: '#f5f5f4', category: 'decor' },  // White shirt
  formal_clothes:    { label: 'Ropa formal',           defaultColor: '#1e1e1e', category: 'decor' },  // Black suit
  agenda:            { label: 'Agenda',                defaultColor: '#facc15', category: 'decor' },  // Yellow
};

// Only one variant per type now
export const SHAPE_VARIANTS: Record<FurnitureType, string[]> = {
  bed:      ['Cama'],
  wardrobe: ['Armario'],
  desk:     ['Escritorio'],
  chair:    ['Silla'],
  plant:    ['Planta'],
  tv:       ['TV'],
  easel:    ['Caballete'],
  poster:   ['Poster'],
  painting: ['Cuadro'],
  clock:    ['Reloj'],
  calendar: ['Calendario'],
  diplomas: ['Diploma'],
  door:     ['Puerta'],
  window:   ['Ventana'],
  instruments:       ['Piano'],
  exercise_mat:      ['Colchoneta'],
  gym_equipment:     ['Pesas'],
  calculator:        ['Calculadora'],
  computer:          ['Laptop'],
  diary:             ['Diario'],
  sewing:            ['Kit'],
  photos:            ['Foto'],
  tools:             ['Caja'],
  board_games:       ['Juego'],
  book:              ['Libro'],
  plushies:          ['Peluche'],
  memories:          ['Caja'],
  puzzles:           ['Cubo'],
  souvenirs:         ['Globo'],
  trophies:          ['Copa'],
  folders:           ['Carpeta'],
  work_clothes:      ['Remera'],
  going_out_clothes: ['Remera'],
  home_clothes:      ['Remera'],
  elegant_clothes:   ['Traje'],
  work_uniform:      ['Camisa'],
  formal_clothes:    ['Traje'],
  agenda:            ['Agenda'],
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
