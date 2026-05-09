import { FURNITURE_CATALOG, FurnitureType } from '../types';
import FurnitureIcon from './FurnitureIcon';
import { ChevronUp } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onToggle: () => void;
}

export default function InventoryPanel({ isOpen, onToggle }: Props) {
  const all = Object.entries(FURNITURE_CATALOG) as [FurnitureType, (typeof FURNITURE_CATALOG)[FurnitureType]][];
  const floorItems = all.filter(([, v]) => v.category === 'floor');
  const wallItems = all.filter(([, v]) => v.category === 'wall');
  const decorItems = all.filter(([, v]) => v.category === 'decor');

  const handleDragStart = (e: React.DragEvent, type: FurnitureType) => {
    e.dataTransfer.setData('furnitureType', type);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleTouchStart = (e: React.TouchEvent, type: FurnitureType) => {
    const target = e.currentTarget as HTMLElement;
    target.dataset.draggingType = type;
  };

  const renderItem = ([type, info]: [FurnitureType, (typeof FURNITURE_CATALOG)[FurnitureType]]) => (
    <div
      key={type}
      draggable
      onDragStart={(e) => handleDragStart(e, type)}
      onTouchStart={(e) => handleTouchStart(e, type)}
      className="bg-white border rounded-lg p-2 cursor-grab active:cursor-grabbing transition-all duration-200 border-gray-200 hover:border-blue-300 hover:bg-blue-50 active:scale-95"
    >
      <div className="flex flex-col items-center gap-1">
        <div className="w-12 h-12 bg-gray-50 border border-gray-100 rounded-lg flex items-center justify-center overflow-hidden pointer-events-none">
          <FurnitureIcon type={type} color={info.defaultColor} shape={0} preview />
        </div>
        <span className="text-[10px] font-medium text-gray-700 text-center pointer-events-none leading-tight">{info.label}</span>
      </div>
    </div>
  );

  return (
    <div className="shrink-0 bg-white border-t border-gray-200 z-40">
      {/* Collapsed Header / Toggle */}
      <button
        onClick={onToggle}
        className="fixed bottom-0 left-0 w-full px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-700">Inventario</span>
          <span className="text-xs text-gray-400 bg-gray-200 px-2 py-0.5 rounded-full">
            {all.length} elementos
          </span>
        </div>
        <ChevronUp className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Expandable Content */}
      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[50vh]' : 'max-h-0'}`}>
        <div className="p-3 overflow-y-auto max-h-[calc(50vh-52px)]">
          {/* Muebles category */}
          <div className="flex items-center gap-1.5 px-1 mb-2">
            <div className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Muebles</span>
          </div>
          <div className="grid grid-cols-4 gap-2 mb-4">
            {floorItems.map(renderItem)}
          </div>

          {/* Pared category */}
          <div className="flex items-center gap-1.5 px-1 mb-2 pt-2 border-t border-gray-100">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Pared</span>
          </div>
          <div className="grid grid-cols-4 gap-2 mb-4">
            {wallItems.map(renderItem)}
          </div>

          {/* Decoracion category */}
          <div className="flex items-center gap-1.5 px-1 mb-2 pt-2 border-t border-gray-100">
            <div className="w-2 h-2 rounded-full bg-purple-500" />
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Decoracion</span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {decorItems.map(renderItem)}
          </div>
        </div>
      </div>
    </div>
  );
}
