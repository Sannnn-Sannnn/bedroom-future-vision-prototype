import {
  FurnitureInstance, FURNITURE_CATALOG, SHAPE_VARIANTS, COLOR_PRESETS,
  isWallMounted, WallId, FloorStyle, WallStyle,
  FLOOR_STYLES, WALL_STYLES, FLOOR_COLORS, WALL_COLORS,
} from '../types';
import FurnitureIcon from './FurnitureIcon';

interface Props {
  mode: 'room' | 'element';
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
  mode,
  roomDescription, onRoomDescriptionChange,
  selectedFurniture, onUpdateFurniture, onDeleteFurniture,
  floorStyle, floorColor, wallStyle, wallColor,
  onFloorStyleChange, onFloorColorChange, onWallStyleChange, onWallColorChange,
}: Props) {

  const sec = (t: string) => (
    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{t}</label>
  );

  /* ── ELEMENT SELECTED ── */
  if (mode === 'element' && selectedFurniture) {
    const shapes = SHAPE_VARIANTS[selectedFurniture.type];
    const wm = isWallMounted(selectedFurniture.type);

    return (
      <div className="p-4 space-y-5">
        {/* Preview */}
        <div className="flex justify-center py-4 bg-gray-50 rounded-xl border border-gray-100">
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
            placeholder={`Describe ${FURNITURE_CATALOG[selectedFurniture.type].label.toLowerCase()}…`}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 resize-none"
            rows={2}
          />
        </div>

        {/* Wall selector */}
        {wm && (
          <div>
            {sec('Pared')}
            <div className="grid grid-cols-4 gap-2">
              {WALL_OPTS.map(w => (
                <button key={w.id} onClick={() => onUpdateFurniture(selectedFurniture.id, { wall: w.id })}
                  className={`px-2 py-2 rounded-lg text-xs font-medium transition-all ${
                    selectedFurniture.wall === w.id
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200'
                  }`}>
                  {w.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Color */}
        <div>
          {sec('Color (tinte)')}
          <div className="grid grid-cols-8 gap-1.5">
            {COLOR_PRESETS.map(c => (
              <button key={c} onClick={() => onUpdateFurniture(selectedFurniture.id, { color: c })}
                className={`w-8 h-8 rounded-lg border-2 transition-all hover:scale-110 ${
                  selectedFurniture.color === c ? 'border-blue-500 ring-2 ring-blue-200 scale-110' : 'border-gray-300'
                }`} style={{ backgroundColor: c }} />
            ))}
          </div>
          <div className="mt-2 flex items-center gap-2">
            <input type="color" value={selectedFurniture.color}
              onChange={e => onUpdateFurniture(selectedFurniture.id, { color: e.target.value })}
              className="w-8 h-8 rounded-lg cursor-pointer border border-gray-300 bg-transparent" />
            <span className="text-xs text-gray-400 font-mono">{selectedFurniture.color}</span>
          </div>
        </div>

        {/* Shape */}
        <div>
          {sec('Forma / Variante')}
          <div className="grid grid-cols-1 gap-1.5">
            {shapes.map((name, i) => (
              <button key={i} onClick={() => onUpdateFurniture(selectedFurniture.id, { shape: i })}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all ${
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
          <div className="flex justify-between text-[10px] text-gray-400 mt-1">
            <span>0°</span><span>90°</span><span>180°</span><span>270°</span><span>360°</span>
          </div>
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
          className="w-full px-3 py-3 bg-red-50 hover:bg-red-100 text-red-500 rounded-lg text-sm font-medium transition-colors border border-red-200 active:scale-[0.98]">
          Eliminar
        </button>
      </div>
    );
  }

  /* ── ROOM OPTIONS ── */
  return (
    <div className="p-4 space-y-5">
      {/* Room description */}
      <div>
        {sec('Descripción')}
        <textarea value={roomDescription} onChange={e => onRoomDescriptionChange(e.target.value)}
          placeholder="Describe tu habitación…"
          className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 resize-none"
          rows={3} />
      </div>

      {/* Floor style */}
      <div>
        {sec('Estilo de piso')}
        <div className="flex flex-wrap gap-2 mb-3">
          {FLOOR_STYLES.map(fs => (
            <button key={fs.id} onClick={() => onFloorStyleChange(fs.id)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                floorStyle === fs.id ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200'
              }`}>{fs.label}</button>
          ))}
        </div>
        <div className="grid grid-cols-5 gap-1.5">
          {FLOOR_COLORS.map(c => (
            <button key={c} onClick={() => onFloorColorChange(c)}
              className={`w-full h-8 rounded-lg border-2 transition-all ${floorColor === c ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-300'}`}
              style={{ backgroundColor: c }} />
          ))}
        </div>
      </div>

      {/* Wall style */}
      <div>
        {sec('Estilo de pared')}
        <div className="flex flex-wrap gap-2 mb-3">
          {WALL_STYLES.map(ws => (
            <button key={ws.id} onClick={() => onWallStyleChange(ws.id)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                wallStyle === ws.id ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200'
              }`}>{ws.label}</button>
          ))}
        </div>
        <div className="grid grid-cols-5 gap-1.5">
          {WALL_COLORS.map(c => (
            <button key={c} onClick={() => onWallColorChange(c)}
              className={`w-full h-8 rounded-lg border-2 transition-all ${wallColor === c ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-300'}`}
              style={{ backgroundColor: c }} />
          ))}
        </div>
      </div>
    </div>
  );
}
