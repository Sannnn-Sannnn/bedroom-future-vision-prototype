import { FURNITURE_CATALOG, FurnitureType } from '../types';
import FurnitureIcon from './FurnitureIcon';
import { ChevronUp } from 'lucide-react';
import { useEffect, useRef } from 'react';

interface Props {
  isOpen: boolean;
  onToggle: (state?: boolean) => void;
  onQuickDrop: (type: FurnitureType) => void; // Nueva prop
}

export default function InventoryPanel({ isOpen, onToggle, onQuickDrop }: Props) {
  const all = Object.entries(FURNITURE_CATALOG) as [FurnitureType, (typeof FURNITURE_CATALOG)[FurnitureType]][];
  const floorItems = all.filter(([, v]) => v.category === 'floor');
  const wallItems = all.filter(([, v]) => v.category === 'wall');
  const decorItems = all.filter(([, v]) => v.category === 'decor');

  const scrollRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Limpiar temporizadores al desmontar
  useEffect(() => {
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  const handleDragStart = (e: React.DragEvent, type: FurnitureType) => {
    e.dataTransfer.setData('furnitureType', type);
    e.dataTransfer.effectAllowed = 'copy';
    setTimeout(() => onToggle(false), 50);
  };

  /* --- Lógica de Long Press --- */
  const startPress = (type: FurnitureType) => {
    // Si ya hay un timer, lo limpiamos
    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      onQuickDrop(type);
      // Feedback táctil si el dispositivo lo soporta
      if (window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate(50);
      }
    }, 1000); // 1 segundo
  };

  const endPress = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const renderItem = ([type, info]: [FurnitureType, (typeof FURNITURE_CATALOG)[FurnitureType]]) => (
    <div
      key={type}
      draggable
      onDragStart={(e) => handleDragStart(e, type)}
      // Eventos para PC
      onMouseDown={() => startPress(type)}
      onMouseUp={endPress}
      onMouseLeave={endPress}
      // Eventos para Móvil
      onTouchStart={() => startPress(type)}
      onTouchEnd={endPress}
      className="draggable-item bg-white border rounded-lg p-2 cursor-grab active:cursor-grabbing transition-all duration-200 border-gray-200 hover:border-blue-300 hover:bg-blue-50 active:scale-95 touch-none select-none"
    >
      <div className="flex flex-col items-center gap-1 pointer-events-none">
        <div className="w-12 h-12 bg-gray-50 border border-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
          <FurnitureIcon type={type} color={info.defaultColor} preview />
        </div>
        <span className="text-[10px] font-medium text-gray-700 text-center leading-tight">
          {info.label}
        </span>
      </div>
    </div>
  );

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 z-10 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
      <button
        onClick={() => onToggle()}
        className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors active:bg-gray-200"
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-700">Inventario</span>
          <span className="text-[10px] text-gray-400 font-normal italic">(Mantén presionado para añadir al centro)</span>
        </div>
        <ChevronUp className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[60vh] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div ref={scrollRef} className="p-4 overflow-y-auto max-h-[calc(60vh-50px)] pb-10">
          <CategoryHeader label="Muebles" color="bg-amber-500" />
          <div className="grid grid-cols-4 gap-3 mb-6">{floorItems.map(renderItem)}</div>

          <CategoryHeader label="Pared" color="bg-blue-500" />
          <div className="grid grid-cols-4 gap-3 mb-6">{wallItems.map(renderItem)}</div>

          <CategoryHeader label="Decoración" color="bg-purple-500" />
          <div className="grid grid-cols-4 gap-3">{decorItems.map(renderItem)}</div>
        </div>
      </div>
    </div>
  );
}

function CategoryHeader({ label, color }: { label: string; color: string }) {
  return (
    <div className="flex items-center gap-2 mb-3 mt-2 first:mt-0">
      <div className={`w-1.5 h-4 rounded-full ${color}`} />
      <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">{label}</span>
      <div className="flex-1 h-px bg-gray-100" />
    </div>
  );
}