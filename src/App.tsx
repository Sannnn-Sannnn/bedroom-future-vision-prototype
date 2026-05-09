import { useState, useCallback } from 'react';
import {
  FurnitureInstance, FurnitureType, FURNITURE_CATALOG,
  RoomState, WallId, isWallMounted, FloorStyle, WallStyle,
  calculateDimensionVector, DIMENSION_LABELS, FURNITURE_DIMENSIONS,
} from './types';
import InventoryPanel from './components/InventoryPanel';
import OptionsPanel from './components/OptionsPanel';
import Room from './components/Room';
import { Pencil, HelpCircle, X, Trash2 } from 'lucide-react';

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
  const [debugOpen, setDebugOpen] = useState(false);
  const [resultsOpen, setResultsOpen] = useState(false);
  const [listoPressed, setListoPressed] = useState(false);

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

  // Handle pencil button - opens element options if selected, room options otherwise
  const handlePencilPress = useCallback(() => {
    if (selectedId) {
      setElementPopupOpen(true);
    } else {
      setRoomOptionsOpen(true);
    }
  }, [selectedId]);

  const handleListoPress = () => {
    setListoPressed(true);
    setTimeout(() => setListoPressed(false), 150);
    setResultsOpen(true);
  };

  const sel = state.furniture.find(f => f.id === selectedId) || null;

  // Calculate dimension vector
  const dimensionVector = calculateDimensionVector(state.furniture);
  const maxDimValue = Math.max(...dimensionVector, 1);

  // Get unique furniture types for debug panel
  const uniqueTypes = Array.from(new Set(state.furniture.map(f => f.type)));

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-gray-100 text-gray-800 select-none">
      {/* Top Bar */}
      <div className="shrink-0 px-4 py-3 bg-white border-b border-gray-200 flex items-center justify-between z-50">
        {/* Listo button - top left */}
        <button
          onClick={handleListoPress}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-150 ${
            listoPressed 
              ? 'bg-green-600 text-white scale-95' 
              : 'bg-green-500 text-white hover:bg-green-600 active:scale-95'
          }`}
        >
          ¡Listo!
        </button>

        <div className="flex items-center gap-3">
          {/* Help button */}
          <button
            onClick={() => setHelpOpen(true)}
            className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <HelpCircle className="w-5 h-5 text-gray-600" />
          </button>

          {/* Pencil button - element options if selected, room options otherwise */}
          <button
            onClick={handlePencilPress}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
              selectedId 
                ? 'bg-amber-500 hover:bg-amber-600' 
                : 'bg-blue-500 hover:bg-blue-600'
            }`}
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
        />
      </div>

      {/* Bottom Inventory Panel */}
      <InventoryPanel 
        isOpen={inventoryOpen}
        onToggle={() => setInventoryOpen(!inventoryOpen)}
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
              <h2 className="text-sm font-bold text-gray-700">Personalizar Habitacion</h2>
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
            {/* Drag handle */}
            <div className="flex justify-center py-3">
              <div className="w-10 h-1 bg-gray-300 rounded-full" />
            </div>
            <div className="flex-1 overflow-y-auto">
              <OptionsPanel
                mode="element"
                roomDescription={state.description}
                onRoomDescriptionChange={handleDescChange}
                selectedFurniture={sel}
                onUpdateFurniture={handleUpdate}
                onDeleteFurniture={() => {}}
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
            <div className="p-4 border-t border-gray-200 bg-gray-50 flex items-center gap-3">
              <button
                onClick={() => handleDelete(sel.id)}
                className="w-12 h-12 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center justify-center transition-colors active:scale-95"
              >
                <Trash2 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setElementPopupOpen(false)}
                className="flex-1 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors active:scale-[0.98]"
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
          <div className="relative bg-white rounded-2xl shadow-xl max-w-sm w-full p-5 animate-scale-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <HelpCircle className="w-5 h-5 text-blue-500" />
              </div>
              <h2 className="text-lg font-bold text-gray-800">Instrucciones</h2>
            </div>
            <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
              <p>Abre el panel de abajo para ver los elementos disponibles</p>
              <p>Arrastra un elemento desde el panel y sueltalo en la habitación para colocarlo</p>
              <p>Toca un elemento en la habitacion para seleccionarlo</p>
              <p>Usa el boton del lápiz para personalizar el elemento seleccionado</p>
              <p>Sin elemento seleccionado, el boton del lápiz abre las opciones de la habitación</p>
              <p>Arrastra los elementos para moverlos entre zonas</p>
            </div>
            
            {/* Debug Panel Toggle */}
            {/*
            <div className="mt-5 pt-4 border-t border-gray-200">
              <button
                onClick={() => setDebugOpen(!debugOpen)}
                className="w-full py-2 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
              >
                {debugOpen ? 'Ocultar Panel de Debug' : 'Mostrar Panel de Debug'}
              </button>
              
              {debugOpen && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200 max-h-60 overflow-y-auto">
                  <h3 className="text-xs font-bold text-gray-500 uppercase mb-2">Elementos y Puntuaciones</h3>
                  {uniqueTypes.length === 0 ? (
                    <p className="text-xs text-gray-400 italic">No hay elementos colocados</p>
                  ) : (
                    <div className="space-y-2">
                      {uniqueTypes.map(type => {
                        const dims = FURNITURE_DIMENSIONS[type];
                        const label = FURNITURE_CATALOG[type].label;
                        const scores = dims.map((v, i) => v > 0 ? `D${i+1}` : null).filter(Boolean).join(', ');
                        return (
                          <div key={type} className="flex justify-between items-center text-xs">
                            <span className="text-gray-700">{label}</span>
                            <span className="text-gray-500 font-mono">{scores || 'X'}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  
                  <h3 className="text-xs font-bold text-gray-500 uppercase mt-4 mb-2">Vector Total</h3>
                  <div className="font-mono text-xs text-gray-600">
                    [{dimensionVector.join(', ')}]
                  </div>
                </div>
              )}
            </div>
            */}
            
            <button
              onClick={() => { setHelpOpen(false); setDebugOpen(false); }}
              className="w-full mt-5 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors active:scale-[0.98]"
            >
              Entendido
            </button>
          </div>
        </div>
      )}

      {/* Results Panel */}
      {resultsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/40"
            onClick={() => setResultsOpen(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-5 animate-scale-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-800">Resultados</h2>
              <button onClick={() => setResultsOpen(false)} className="p-1.5 hover:bg-gray-200 rounded-full transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="space-y-4">
              {DIMENSION_LABELS.map((label, index) => {
                const value = dimensionVector[index];
                const percentage = maxDimValue > 0 ? (value / maxDimValue) * 100 : 0;
                return (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-gray-600 leading-tight">{label}</span>
                      <span className="text-xs font-bold text-gray-800 ml-2">{value}</span>
                    </div>
                    <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            
            <button
              onClick={() => setResultsOpen(false)}
              className="w-full mt-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-colors active:scale-[0.98]"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
