import { useState, useCallback } from 'react';
import {
  FurnitureInstance, FurnitureType, FURNITURE_CATALOG,
  RoomState, WallId, isWallMounted, FloorStyle, WallStyle,
} from './types';
import InventoryPanel from './components/InventoryPanel';
import OptionsPanel from './components/OptionsPanel';
import Room from './components/Room';
import { Pencil, HelpCircle, X } from 'lucide-react';

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
  const [inventoryOpen, setInventoryOpen] = useState(false);
  const [roomOptionsOpen, setRoomOptionsOpen] = useState(false);
  const [elementPopupOpen, setElementPopupOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [listoPressed, setListoPressed] = useState(false);
  const [placingItem, setPlacingItem] = useState<FurnitureType | null>(null);

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
    setPlacingItem(null);
  }, [state, persist]);

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
    setElementPopupOpen(false);
  }, [state, persist]);

  // Handle long press on inventory item - hide panel and start placing
  const handleInventoryItemLongPress = useCallback((type: FurnitureType) => {
    setInventoryOpen(false);
    setPlacingItem(type);
  }, []);

  // Handle long press on placed element - show popup
  const handleElementLongPress = useCallback((id: string) => {
    setSelectedId(id);
    setElementPopupOpen(true);
  }, []);

  const handleListoPress = () => {
    setListoPressed(true);
    setTimeout(() => setListoPressed(false), 150);
  };

  const sel = state.furniture.find(f => f.id === selectedId) || null;

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-gray-100 text-gray-800 select-none">
      {/* Top Bar */}
      <div className="flex-shrink-0 px-4 py-3 bg-white border-b border-gray-200 flex items-center justify-between z-50">
        {/* Listo button - top left */}
        <button
          onClick={handleListoPress}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-150 ${
            listoPressed 
              ? 'bg-green-600 text-white scale-95' 
              : 'bg-green-500 text-white hover:bg-green-600 active:scale-95'
          }`}
        >
          Listo!
        </button>

        <div className="flex items-center gap-3">
          {/* Help button */}
          <button
            onClick={() => setHelpOpen(true)}
            className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <HelpCircle className="w-5 h-5 text-gray-600" />
          </button>

          {/* Room options (pencil) button */}
          <button
            onClick={() => setRoomOptionsOpen(true)}
            className="w-10 h-10 rounded-full bg-blue-500 hover:bg-blue-600 flex items-center justify-center transition-colors"
          >
            <Pencil className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Main Room Area */}
      <div className="flex-1 overflow-hidden relative">
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
          onElementLongPress={handleElementLongPress}
          placingItem={placingItem}
          onCancelPlacing={() => setPlacingItem(null)}
        />
      </div>

      {/* Bottom Inventory Panel */}
      <InventoryPanel 
        isOpen={inventoryOpen}
        onToggle={() => setInventoryOpen(!inventoryOpen)}
        onItemLongPress={handleInventoryItemLongPress}
      />

      {/* Room Options Panel (slide from right) */}
      {roomOptionsOpen && (
        <div className="fixed inset-0 z-50">
          <div 
            className="absolute inset-0 bg-black/40"
            onClick={() => setRoomOptionsOpen(false)}
          />
          <div className="absolute right-0 top-0 bottom-0 w-80 max-w-[85vw] bg-white shadow-xl flex flex-col animate-slide-in-right">
            <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
              <h2 className="text-sm font-bold text-gray-700">Personalizar Habitación</h2>
              <button onClick={() => setRoomOptionsOpen(false)} className="p-1.5 hover:bg-gray-200 rounded-full transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <OptionsPanel
                mode="room"
                roomDescription={state.description}
                onRoomDescriptionChange={handleDescChange}
                selectedFurniture={null}
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
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setRoomOptionsOpen(false)}
                className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors active:scale-[0.98]"
              >
                Listo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Element Options Popup */}
      {elementPopupOpen && sel && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div 
            className="absolute inset-0 bg-black/40"
            onClick={() => setElementPopupOpen(false)}
          />
          <div className="relative w-full max-w-lg bg-white rounded-t-2xl shadow-xl flex flex-col max-h-[85vh] animate-slide-up">
            <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 rounded-t-2xl flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-gray-700">Personalizar Elemento</h2>
                <p className="text-xs text-blue-500 font-medium">{FURNITURE_CATALOG[sel.type].emoji} {FURNITURE_CATALOG[sel.type].label}</p>
              </div>
              <button onClick={() => setElementPopupOpen(false)} className="p-1.5 hover:bg-gray-200 rounded-full transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <OptionsPanel
                mode="element"
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
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setElementPopupOpen(false)}
                className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors active:scale-[0.98]"
              >
                Listo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Help Modal */}
      {helpOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/40"
            onClick={() => setHelpOpen(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-xl max-w-sm w-full p-5 animate-scale-in">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <HelpCircle className="w-5 h-5 text-blue-500" />
              </div>
              <h2 className="text-lg font-bold text-gray-800">Instrucciones</h2>
            </div>
            <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
              <p>Toca en el panel de abajo para ver los elementos disponibles</p>
              <p>Mantén presionado un elemento por 1 segundo para colocarlo en la habitación</p>
              <p>Mantén presionado un elemento en la habitación para personalizarlo</p>
              <p>Usa el botón del lápiz para cambiar el piso y las paredes</p>
              <p>Arrastra los elementos para moverlos entre zonas</p>
            </div>
            <button
              onClick={() => setHelpOpen(false)}
              className="w-full mt-5 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors active:scale-[0.98]"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
