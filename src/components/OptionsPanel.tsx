import {
  FurnitureInstance, FURNITURE_CATALOG, SHAPE_VARIANTS, COLOR_PRESETS,
  isWallMounted, WallId, FloorStyle, WallStyle,
  FLOOR_STYLES, WALL_STYLES, FLOOR_COLORS, WALL_COLORS,
} from '../types';
import FurnitureIcon from './FurnitureIcon';

interface Props {
  roomDescription: string;
  onRoomDescriptionChange: (d: string) => void;
  selectedFurniture: FurnitureInstance | null;
  onUpdateFurniture: (id: string, u: Partial<FurnitureInstance>) => void;
  onDeleteFurniture: (id: string) => void;
  floorStyle: FloorStyle;
  floorColor: string;
  wallStyle: WallStyle;
  wallColor: string;
  onFloorStyleChange: (s: FloorStyle) => void;
  onFloorColorChange: (c: string) => void;
  onWallStyleChange: (s: WallStyle) => void;
  onWallColorChange: (c: string) => void;
}

const WALL_OPTS: { id: WallId; label: string }[] = [
  { id: 'back',  label: 'Trasera' },
  { id: 'front', label: 'Frontal' },
  { id: 'left',  label: 'Izquierda' },
  { id: 'right', label: 'Derecha' },
];

export default function OptionsPanel({
  roomDescription, onRoomDescriptionChange,
  selectedFurniture, onUpdateFurniture, onDeleteFurniture,
  floorStyle, floorColor, wallStyle, wallColor,
  onFloorStyleChange, onFloorColorChange, onWallStyleChange, onWallColorChange,
}: Props) {

  const sec = (t: string) => (
    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">{t}</label>
  );

  /* ── ELEMENT SELECTED ── */
  if (selectedFurniture) {
    const cat = FURNITURE_CATALOG[selectedFurniture.type];
    const shapes = SHAPE_VARIANTS[selectedFurniture.type];
    const wm = isWallMounted(selectedFurniture.type);

    return (
      <div className="w-60 flex-shrink-0 bg-white border-l border-gray-200 flex flex-col h-full">
        <div className="px-4 py-2.5 border-b border-gray-200 bg-gray-50">
          <h2 className="text-xs font-bold text-gray-600 uppercase tracking-wider flex items-center gap-1.5">✏️ Personalizar</h2>
          <p className="text-[10px] text-blue-500 mt-0.5 font-medium">{cat.emoji} {cat.label}</p>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          {/* Preview */}
          <div className="flex justify-center py-3 bg-gray-50 rounded border border-gray-100">
            <FurnitureIcon 
              type={selectedFurniture.type} 
              color={selectedFurniture.color} 
              shape={selectedFurniture.shape}
              shadow
            />
          </div>

          {/* Description */}
          <div>
            {sec('Descripción')}
            <textarea
              value={selectedFurniture.description}
              onChange={e => onUpdateFurniture(selectedFurniture.id, { description: e.target.value })}
              placeholder={`Describe ${cat.label.toLowerCase()}…`}
              className="w-full bg-gray-50 border border-gray-200 rounded px-2.5 py-1.5 text-xs text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-200 resize-none"
              rows={2}
            />
          </div>

          {/* Wall selector */}
          {wm && (
            <div>
              {sec('Pared')}
              <div className="grid grid-cols-4 gap-1">
                {WALL_OPTS.map(w => (
                  <button key={w.id} onClick={() => onUpdateFurniture(selectedFurniture.id, { wall: w.id })}
                    className={`px-1 py-1.5 rounded text-[10px] font-medium transition-all ${
                      selectedFurniture.wall === w.id
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200 border border-gray-200'
                    }`}>
                    {w.label}
                  </button>
                ))}
              </div>
              <p className="text-[9px] text-gray-400 mt-1">O arrastra directamente entre paredes</p>
            </div>
          )}

          {/* Color */}
          <div>
            {sec('Color (tinte)')}
            <div className="grid grid-cols-8 gap-1">
              {COLOR_PRESETS.map(c => (
                <button key={c} onClick={() => onUpdateFurniture(selectedFurniture.id, { color: c })}
                  className={`w-6 h-6 rounded border transition-all hover:scale-110 ${
                    selectedFurniture.color === c ? 'border-blue-500 ring-1 ring-blue-300 scale-110' : 'border-gray-300'
                  }`} style={{ backgroundColor: c }} />
              ))}
            </div>
            <div className="mt-1.5 flex items-center gap-1.5">
              <input type="color" value={selectedFurniture.color}
                onChange={e => onUpdateFurniture(selectedFurniture.id, { color: e.target.value })}
                className="w-6 h-6 rounded cursor-pointer border border-gray-300 bg-transparent" />
              <span className="text-[9px] text-gray-400 font-mono">{selectedFurniture.color}</span>
            </div>
          </div>

          {/* Shape */}
          <div>
            {sec('Forma / Variante')}
            <div className="space-y-1">
              {shapes.map((name, i) => (
                <button key={i} onClick={() => onUpdateFurniture(selectedFurniture.id, { shape: i })}
                  className={`w-full text-left px-2.5 py-1.5 rounded text-xs transition-all ${
                    selectedFurniture.shape === i
                      ? 'bg-blue-500 text-white font-medium'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}>
                  {name}
                </button>
              ))}
            </div>
          </div>

          {/* Rotation */}
          <div>
            {sec(`Rotación: ${selectedFurniture.rotation}°`)}
            <input type="range" min={0} max={360} step={15} value={selectedFurniture.rotation}
              onChange={e => onUpdateFurniture(selectedFurniture.id, { rotation: Number(e.target.value) })}
              className="w-full accent-blue-500" />
            <div className="flex justify-between text-[8px] text-gray-400 mt-0.5"><span>0°</span><span>90°</span><span>180°</span><span>270°</span><span>360°</span></div>
            {wm && <p className="text-[9px] text-gray-400 mt-1">+ rotación automática según pared (0°/90°/180°/270°)</p>}
          </div>

          {/* Scale */}
          <div>
            {sec(`Tamaño: ${Math.round(selectedFurniture.scale * 100)}%`)}
            <input type="range" min={0.4} max={2.5} step={0.1} value={selectedFurniture.scale}
              onChange={e => onUpdateFurniture(selectedFurniture.id, { scale: Number(e.target.value) })}
              className="w-full accent-blue-500" />
          </div>

          {/* Delete */}
          <button onClick={() => onDeleteFurniture(selectedFurniture.id)}
            className="w-full px-2.5 py-2 bg-red-50 hover:bg-red-100 text-red-500 rounded text-xs font-medium transition-colors border border-red-200">
            🗑️ Eliminar
          </button>
        </div>
      </div>
    );
  }

  /* ── ROOM OPTIONS ── */
  return (
    <div className="w-60 flex-shrink-0 bg-white border-l border-gray-200 flex flex-col h-full">
      <div className="px-4 py-2.5 border-b border-gray-200 bg-gray-50">
        <h2 className="text-xs font-bold text-gray-600 uppercase tracking-wider flex items-center gap-1.5">⚙️ Opciones</h2>
        <p className="text-[10px] text-gray-400 mt-0.5">Configura tu habitación</p>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {/* Room description */}
        <div>
          {sec('Descripción')}
          <textarea value={roomDescription} onChange={e => onRoomDescriptionChange(e.target.value)}
            placeholder="Describe tu habitación…"
            className="w-full bg-gray-50 border border-gray-200 rounded px-2.5 py-1.5 text-xs text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-200 resize-none"
            rows={3} />
        </div>

        {/* Floor style */}
        <div>
          {sec('Estilo de piso')}
          <div className="flex flex-wrap gap-1 mb-2">
            {FLOOR_STYLES.map(fs => (
              <button key={fs.id} onClick={() => onFloorStyleChange(fs.id)}
                className={`px-2 py-1 rounded text-[10px] font-medium transition-all ${
                  floorStyle === fs.id ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200 border border-gray-200'
                }`}>{fs.label}</button>
            ))}
          </div>
          <div className="grid grid-cols-5 gap-1">
            {FLOOR_COLORS.map(c => (
              <button key={c} onClick={() => onFloorColorChange(c)}
                className={`w-full h-5 rounded border transition-all ${floorColor === c ? 'border-blue-500 ring-1 ring-blue-300' : 'border-gray-300'}`}
                style={{ backgroundColor: c }} />
            ))}
          </div>
        </div>

        {/* Wall style */}
        <div>
          {sec('Estilo de pared')}
          <div className="flex flex-wrap gap-1 mb-2">
            {WALL_STYLES.map(ws => (
              <button key={ws.id} onClick={() => onWallStyleChange(ws.id)}
                className={`px-2 py-1 rounded text-[10px] font-medium transition-all ${
                  wallStyle === ws.id ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200 border border-gray-200'
                }`}>{ws.label}</button>
            ))}
          </div>
          <div className="grid grid-cols-5 gap-1">
            {WALL_COLORS.map(c => (
              <button key={c} onClick={() => onWallColorChange(c)}
                className={`w-full h-5 rounded border transition-all ${wallColor === c ? 'border-blue-500 ring-1 ring-blue-300' : 'border-gray-300'}`}
                style={{ backgroundColor: c }} />
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div className="border-t border-gray-100 pt-3">
          {sec('Instrucciones')}
          <div className="space-y-1.5 text-[10px] text-gray-400 leading-tight">
            <p>🖱️ Arrastra elementos del inventario al piso o paredes</p>
            <p>🔄 Arrastra libremente entre zonas sin soltar el clic</p>
            <p>👆 Clic en un elemento para personalizarlo</p>
            <p>🪟 Puertas y ventanas rotan automáticamente según la pared</p>
            <p>♾️ Agrega múltiples copias del mismo elemento</p>
          </div>
        </div>
      </div>
    </div>
  );
}
