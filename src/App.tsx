import { useState, useCallback } from 'react';
import {
  FurnitureInstance, FurnitureType, FURNITURE_CATALOG,
  RoomState, WallId, isWallMounted, FloorStyle, WallStyle,
} from './types';
import InventoryPanel from './components/InventoryPanel';
import OptionsPanel from './components/OptionsPanel';
import Room from './components/Room';

function genId() {
  return Math.random().toString(36).slice(2, 11) + Date.now().toString(36);
}

const DEFAULT_STATE: RoomState = {
  description: '',
  furniture: [],
  floorStyle: 'wood',
  floorColor: '#c4a26e',
  wallStyle: 'paint',
  wallColor: '#e8e0d4',
};

function loadState(): RoomState {
  try {
    const s = localStorage.getItem('roomState_v4');
    if (s) return { ...DEFAULT_STATE, ...JSON.parse(s) };
  } catch {}
  return DEFAULT_STATE;
}

function saveState(st: RoomState) {
  try { localStorage.setItem('roomState_v4', JSON.stringify(st)); } catch {}
}

export default function App() {
  const [state, setState] = useState<RoomState>(loadState);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const persist = useCallback((s: RoomState) => { setState(s); saveState(s); }, []);

  const handleDescChange = useCallback((description: string) => {
    persist({ ...state, description });
  }, [state, persist]);

  const handleDrop = useCallback((type: FurnitureType, x: number, y: number, wall?: WallId) => {
    const cat = FURNITURE_CATALOG[type];
    const wm = isWallMounted(type);
    const item: FurnitureInstance = {
      id: genId(), type, x, y,
      color: cat.defaultColor,
      description: '', shape: 0, rotation: 0, scale: 1,
      wall: wm ? (wall || 'back') : undefined,
    };
    persist({ ...state, furniture: [...state.furniture, item] });
    setSelectedId(item.id);
  }, [state, persist]);

  // Unified move: can change wall assignment and position in one call
  const handleMoveTo = useCallback((id: string, wall: WallId | undefined, x: number, y: number) => {
    persist({
      ...state,
      furniture: state.furniture.map(f => f.id === id ? { ...f, wall, x, y } : f),
    });
  }, [state, persist]);

  const handleUpdate = useCallback((id: string, u: Partial<FurnitureInstance>) => {
    persist({ ...state, furniture: state.furniture.map(f => f.id === id ? { ...f, ...u } : f) });
  }, [state, persist]);

  const handleDelete = useCallback((id: string) => {
    persist({ ...state, furniture: state.furniture.filter(f => f.id !== id) });
    setSelectedId(null);
  }, [state, persist]);

  const sel = state.furniture.find(f => f.id === selectedId) || null;

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-gray-100 text-gray-800 select-none">
      <InventoryPanel onDragStart={() => {}} />
      <Room
        furniture={state.furniture}
        selectedId={selectedId}
        onSelect={setSelectedId}
        onDrop={handleDrop}
        onMoveTo={handleMoveTo}
        roomDescription={state.description}
        floorStyle={state.floorStyle}
        floorColor={state.floorColor}
        wallStyle={state.wallStyle}
        wallColor={state.wallColor}
      />
      <OptionsPanel
        roomDescription={state.description}
        onRoomDescriptionChange={handleDescChange}
        selectedFurniture={sel}
        onUpdateFurniture={handleUpdate}
        onDeleteFurniture={handleDelete}
        floorStyle={state.floorStyle}
        floorColor={state.floorColor}
        wallStyle={state.wallStyle}
        wallColor={state.wallColor}
        onFloorStyleChange={(s: FloorStyle) => persist({ ...state, floorStyle: s })}
        onFloorColorChange={(c: string) => persist({ ...state, floorColor: c })}
        onWallStyleChange={(s: WallStyle) => persist({ ...state, wallStyle: s })}
        onWallColorChange={(c: string) => persist({ ...state, wallColor: c })}
      />
    </div>
  );
}
