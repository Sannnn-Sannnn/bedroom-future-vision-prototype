import { useState, useCallback } from 'react';
import {
  FurnitureInstance, FurnitureType, FURNITURE_CATALOG,
  RoomState, WallId, isWallMounted, FloorStyle, WallStyle,
  calculateDimensionVector, DIMENSION_LABELS, FURNITURE_DIMENSIONS,
} from './types';
import InventoryPanel from './components/InventoryPanel';
import OptionsPanel from './components/OptionsPanel';
import Room from './components/Room';
import { Pencil, HelpCircle, X, Trash2, RotateCcw } from 'lucide-react';

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
  const [resultsOpen, setResultsOpen] = useState(false);
  const [listoPressed, setListoPressed] = useState(false);
  const [namePromptOpen, setNamePromptOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

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

  // --- NUEVA FUNCIÓN DE RESETEO ---
  const handleResetFurniture = useCallback(() => {
    if (window.confirm('¿Estás seguro de que quieres eliminar todos los muebles?')) {
      persist({ ...state, furniture: [] });
      setSelectedId(null);
    }
  }, [state, persist]);

  const toggleInventory = useCallback((forceState?: boolean) => {
    setInventoryOpen(prev => forceState !== undefined ? forceState : !prev);
  }, []);

  const handleQuickDrop = useCallback((type: FurnitureType) => {
    handleDrop(type, 140, 190); 
    setInventoryOpen(false);
  }, [handleDrop]);

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
    setNamePromptOpen(true);
    setSaveError(null);
    setSaveSuccess(false);
  };

  const handleSaveResult = async () => {
    if (!userName.trim()) {
      setSaveError('Por favor ingresa tu nombre completo');
      return;
    }

    setIsSaving(true);
    setSaveError(null);

    try {
      const payload = {
        fullName: userName,
        dimensionVector: dimensionVector,
      };
      console.log('[v0] Sending payload:', JSON.stringify(payload));
      
      const response = await fetch('/api/save-result', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      console.log('[v0] Response status:', response.status);
      const text = await response.text();
      console.log('[v0] Response text:', text);
      const data = text ? JSON.parse(text) : {};

      if (!response.ok) {
        console.log('[v0] Error response:', data);
        throw new Error(data.error || 'Error al guardar');
      }

      setSaveSuccess(true);
      setTimeout(() => {
        setNamePromptOpen(false);
        setResultsOpen(true);
        setUserName('');
        setSaveSuccess(false);
      }, 1500);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Error al guardar el resultado');
    } finally {
      setIsSaving(false);
    }
  };

  const sel = state.furniture.find(f => f.id === selectedId) || null;
  const dimensionVector = calculateDimensionVector(state.furniture);
  const maxDimValue = Math.max(...dimensionVector, 1);

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-gray-100 text-gray-800 select-none">
      {/* Top Bar */}
      <div className="shrink-0 px-4 py-3 bg-white border-b border-gray-200 flex items-center justify-between z-50 shadow-sm">
        <button
          onClick={handleListoPress}
          className={`px-4 py-2 rounded-lg text-sm font-bold transition-all duration-150 ${
            listoPressed 
              ? 'bg-green-600 text-white scale-95' 
              : 'bg-green-500 text-white hover:bg-green-600 active:scale-95'
          }`}
        >
          ¡Listo!
        </button>

        <div className="flex items-center gap-2">
          {/* Reset Button */}
          <button
            onClick={handleResetFurniture}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors shadow-sm bg-red-500 hover:bg-red-600'`}
        
          >
            <RotateCcw className="w-5 h-5 text-white" />
          </button>

          {/* Help button */}
          <button
            onClick={() => setHelpOpen(true)}
            className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <HelpCircle className="w-5 h-5 text-gray-600" />
          </button>

          {/* Pencil button */}
          <button
            onClick={handlePencilPress}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors shadow-sm ${
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
      <div className="flex-1 overflow-hidden relative bg-slate-200">
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
        onToggle={toggleInventory}
        onQuickDrop={handleQuickDrop}
      />

      {/* Room Options Panel */}
      {roomOptionsOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/20" onClick={() => setRoomOptionsOpen(false)} />
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
          <div className="absolute inset-0 bg-black/40" onClick={() => setElementPopupOpen(false)} />
          <div className="relative w-full max-w-lg bg-white rounded-t-2xl shadow-xl flex flex-col max-h-[85vh] animate-slide-up">
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
                className="w-12 h-12 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center justify-center transition-colors active:scale-95 shadow-md"
              >
                <Trash2 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setElementPopupOpen(false)}
                className="flex-1 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors active:scale-[0.98] shadow-md"
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
          <div className="absolute inset-0 bg-black/40" onClick={() => setHelpOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl max-w-sm w-full p-5 animate-scale-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <HelpCircle className="w-5 h-5 text-blue-500" />
              </div>
              <h2 className="text-lg font-bold text-gray-800">Instrucciones</h2>
            </div>
            <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
              <p>• Abre el panel de abajo para ver los elementos disponibles.</p>
              <p>• Arrastra un elemento a la habitación para colocarlo.</p>
              <p>• Toca un elemento para seleccionarlo y moverlo.</p>
              <p>• Usa el <b>lápiz</b> para personalizar colores y estilos.</p>
              <p>• Usa el botón de <b>flecha circular</b> para borrar todo y empezar de cero.</p>
            </div>
            
            <div className="mt-6 space-y-2">
              <button
                onClick={() => { setHelpOpen(false); }}
                className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors active:scale-[0.98]"
              >
                Entendido
              </button>
              <button
                onClick={() => { setHelpOpen(false); handleResetFurniture(); }}
                className="w-full py-2 text-red-500 text-sm font-medium hover:bg-red-50 rounded-lg transition-colors"
              >
                Reiniciar diseño
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Name Prompt Modal */}
      {namePromptOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => !isSaving && setNamePromptOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl max-w-sm w-full p-5 animate-scale-in">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-800">Guardar Resultado</h2>
              {!isSaving && (
                <button onClick={() => setNamePromptOpen(false)} className="p-1.5 hover:bg-gray-200 rounded-full transition-colors">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              )}
            </div>
            
            {saveSuccess ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                  <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-gray-700 font-medium">Resultado guardado correctamente</p>
              </div>
            ) : (
              <>
                <p className="text-sm text-gray-600 mb-4">
                  Ingresa tu nombre completo para guardar tu resultado. Si ya tienes un resultado guardado, se actualizará.
                </p>
                
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Nombre completo"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  disabled={isSaving}
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveResult()}
                />
                
                {saveError && (
                  <p className="mt-2 text-sm text-red-500">{saveError}</p>
                )}
                
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setNamePromptOpen(false)}
                    disabled={isSaving}
                    className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition-colors active:scale-[0.98] disabled:opacity-50"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSaveResult}
                    disabled={isSaving || !userName.trim()}
                    className="flex-1 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-colors active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSaving ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Guardando...
                      </>
                    ) : (
                      'Guardar'
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Results Panel */}
      {resultsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setResultsOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-5 animate-scale-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-800">Análisis del Espacio</h2>
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
                      <span className="text-xs text-gray-600 leading-tight uppercase font-semibold">{label}</span>
                      <span className="text-xs font-bold text-gray-800 ml-2">{value}</span>
                    </div>
                    <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
                      <div 
                        className="h-full bg-blue-500 rounded-full transition-all duration-700 ease-out"
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
              Continuar Editando
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
