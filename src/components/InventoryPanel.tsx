import { FURNITURE_CATALOG, FurnitureType } from '../types';
import FurnitureIcon from './FurnitureIcon';

interface Props {
  onDragStart: (type: FurnitureType) => void;
}

export default function InventoryPanel({ onDragStart }: Props) {
  const all = Object.entries(FURNITURE_CATALOG) as [FurnitureType, (typeof FURNITURE_CATALOG)[FurnitureType]][];
  const floorItems = all.filter(([, v]) => v.category === 'floor');
  const wallItems = all.filter(([, v]) => v.category === 'wall');

  const renderItem = ([type, info]: [FurnitureType, (typeof FURNITURE_CATALOG)[FurnitureType]]) => (
    <div key={type} draggable
      onDragStart={(e) => { e.dataTransfer.setData('furnitureType', type); onDragStart(type); }}
      className="group bg-white hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded p-2 cursor-grab active:cursor-grabbing transition-all duration-100"
    >
      <div className="flex items-center gap-2.5">
        <div className="w-11 h-11 bg-gray-50 border border-gray-100 rounded flex items-center justify-center flex-shrink-0 group-hover:bg-white overflow-hidden">
          <FurnitureIcon type={type} color={info.defaultColor} shape={0} preview />
        </div>
        <div className="min-w-0">
          <span className="text-xs font-medium text-gray-700">{info.label}</span>
          <p className="text-[9px] text-gray-400 leading-tight">Arrastra</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-52 flex-shrink-0 bg-white border-r border-gray-200 flex flex-col h-full">
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
        <h2 className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
          📦 Inventario
        </h2>
        <p className="text-[10px] text-gray-400 mt-0.5">Arrastra elementos a la habitación</p>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {/* Floor category */}
        <div className="flex items-center gap-1.5 px-1 pt-1 pb-1">
          <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Muebles</span>
        </div>
        {floorItems.map(renderItem)}

        {/* Wall category */}
        <div className="flex items-center gap-1.5 px-1 pt-3 pb-1 border-t border-gray-100 mt-2">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Pared</span>
        </div>
        {wallItems.map(renderItem)}
      </div>

      <div className="px-3 py-2 border-t border-gray-200 bg-gray-50">
        <p className="text-[9px] text-gray-400 text-center leading-tight">
          Los elementos de pared rotan automáticamente
        </p>
      </div>
    </div>
  );
}
