import { useState, useCallback, useMemo, useRef } from 'react';
import {
  FurnitureInstance, FurnitureType, FURNITURE_CATALOG, FURNITURE_SIZES,
  isWallMounted, WallId, FloorStyle, WallStyle,
} from '../types';
import FurnitureIcon from './FurnitureIcon';

/* ── Layout - VERTICAL orientation ── */
const FLOOR_W = 280;
const FLOOR_H = 380;
const MARGIN = 100;
const OUTER_W = FLOOR_W + MARGIN * 2;
const OUTER_H = FLOOR_H + MARGIN * 2;
const FLOOR_X = MARGIN;
const FLOOR_Y = MARGIN;

interface Props {
  furniture: FurnitureInstance[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onDrop: (type: FurnitureType, x: number, y: number, wall?: WallId) => void;
  onMoveTo: (id: string, wall: WallId | undefined, x: number, y: number) => void;
  roomDescription: string;
  floorStyle: FloorStyle;
  floorColor: string;
  wallStyle: WallStyle;
  wallColor: string;
}

const dk = (hex: string, a: number) => {
  const r = Math.max(0, parseInt(hex.slice(1,3),16)-a);
  const g = Math.max(0, parseInt(hex.slice(3,5),16)-a);
  const b = Math.max(0, parseInt(hex.slice(5,7),16)-a);
  return `rgb(${r},${g},${b})`;
};

function floorBg(style: FloorStyle, c: string): string {
  switch (style) {
    case 'wood':
      return `repeating-linear-gradient(0deg,${c} 0px,${c} 54px,${dk(c,20)} 54px,${dk(c,20)} 56px),repeating-linear-gradient(90deg,transparent 0 180px,${dk(c,12)} 180px 182px),${c}`;
    case 'tile':
      return `repeating-linear-gradient(0deg,transparent 0 38px,${dk(c,28)} 38px 39px),repeating-linear-gradient(90deg,transparent 0 38px,${dk(c,28)} 38px 39px),${c}`;
    case 'carpet':
      return `repeating-linear-gradient(0deg,${dk(c,6)} 0 1px,transparent 1px 4px),repeating-linear-gradient(90deg,${dk(c,6)} 0 1px,transparent 1px 4px),repeating-linear-gradient(45deg,transparent 0 6px,${dk(c,3)} 6px 7px),${c}`;
    case 'paint': return c;
    default: return c;
  }
}

/* ── SVG pattern defs ── */
function WallPatterns({ wallColor: c }: { wallStyle: WallStyle; wallColor: string }) {
  const mortar = dk(c, 28);
  const bW = 36, bH = 18, gap = 2, pW = bW + gap, pH = (bH + gap) * 2;

  return (
    <defs>
      <pattern id="pat-brick" patternUnits="userSpaceOnUse" width={pW} height={pH}>
        <rect width={pW} height={pH} fill={mortar}/>
        <rect x={0} y={0} width={bW} height={bH} rx={.5} fill={c}/>
        <rect x={-pW/2} y={bH+gap} width={bW} height={bH} rx={.5} fill={dk(c,6)}/>
        <rect x={pW/2} y={bH+gap} width={bW} height={bH} rx={.5} fill={dk(c,6)}/>
      </pattern>
      <pattern id="pat-brick-side" patternUnits="userSpaceOnUse" width={pH} height={pW}>
        <rect width={pH} height={pW} fill={mortar}/>
        <rect x={0} y={0} width={bH} height={bW} rx={.5} fill={dk(c,10)}/>
        <rect x={bH+gap} y={-pW/2} width={bH} height={bW} rx={.5} fill={dk(c,16)}/>
        <rect x={bH+gap} y={pW/2} width={bH} height={bW} rx={.5} fill={dk(c,16)}/>
      </pattern>
      <pattern id="pat-brick-front" patternUnits="userSpaceOnUse" width={pW} height={pH}>
        <rect width={pW} height={pH} fill={mortar}/>
        <rect x={0} y={0} width={bW} height={bH} rx={.5} fill={dk(c,10)}/>
        <rect x={-pW/2} y={bH+gap} width={bW} height={bH} rx={.5} fill={dk(c,16)}/>
        <rect x={pW/2} y={bH+gap} width={bW} height={bH} rx={.5} fill={dk(c,16)}/>
      </pattern>

      <pattern id="pat-wood" patternUnits="userSpaceOnUse" width={200} height={14}>
        <rect width={200} height={14} fill={c}/>
        <rect x={0} y={12} width={200} height={2} fill={dk(c,16)}/>
        <rect x={0} y={0} width={200} height={1} fill={dk(c,6)} opacity={.3}/>
      </pattern>
      <pattern id="pat-wood-side" patternUnits="userSpaceOnUse" width={14} height={200}>
        <rect width={14} height={200} fill={dk(c,10)}/>
        <rect x={12} y={0} width={2} height={200} fill={dk(c,24)}/>
        <rect x={0} y={0} width={1} height={200} fill={dk(c,14)} opacity={.3}/>
      </pattern>
      <pattern id="pat-wood-front" patternUnits="userSpaceOnUse" width={200} height={14}>
        <rect width={200} height={14} fill={dk(c,8)}/>
        <rect x={0} y={12} width={200} height={2} fill={dk(c,22)}/>
      </pattern>

      <pattern id="pat-wp" patternUnits="userSpaceOnUse" width={20} height={20}>
        <rect width={20} height={20} fill={c}/>
        <path d="M0,10 L10,0 L20,10 L10,20 Z" fill="none" stroke={dk(c,12)} strokeWidth={.8}/>
        <circle cx={10} cy={10} r={1.5} fill={dk(c,15)} opacity={.5}/>
      </pattern>
      <pattern id="pat-wp-side" patternUnits="userSpaceOnUse" width={20} height={20} patternTransform="rotate(90)">
        <rect width={20} height={20} fill={dk(c,8)}/>
        <path d="M0,10 L10,0 L20,10 L10,20 Z" fill="none" stroke={dk(c,18)} strokeWidth={.8}/>
        <circle cx={10} cy={10} r={1.5} fill={dk(c,20)} opacity={.5}/>
      </pattern>
      <pattern id="pat-wp-front" patternUnits="userSpaceOnUse" width={20} height={20}>
        <rect width={20} height={20} fill={dk(c,6)}/>
        <path d="M0,10 L10,0 L20,10 L10,20 Z" fill="none" stroke={dk(c,16)} strokeWidth={.8}/>
        <circle cx={10} cy={10} r={1.5} fill={dk(c,18)} opacity={.5}/>
      </pattern>
    </defs>
  );
}

function wallFill(style: WallStyle, wall: WallId, color: string): string {
  if (style === 'paint') {
    if (wall === 'back') return color;
    if (wall === 'left') return dk(color, 8);
    if (wall === 'right') return dk(color, 14);
    return dk(color, 10);
  }
  const isSide = wall === 'left' || wall === 'right';
  const isFront = wall === 'front';
  if (style === 'brick') return `url(#pat-brick${isSide ? '-side' : isFront ? '-front' : ''})`;
  if (style === 'wood') return `url(#pat-wood${isSide ? '-side' : isFront ? '-front' : ''})`;
  if (style === 'wallpaper') return `url(#pat-wp${isSide ? '-side' : isFront ? '-front' : ''})`;
  return color;
}

function hitZone(ox: number, oy: number): WallId | 'floor' {
  if (ox >= FLOOR_X && ox <= FLOOR_X + FLOOR_W && oy >= FLOOR_Y && oy <= FLOOR_Y + FLOOR_H) return 'floor';
  if (oy < FLOOR_Y) {
    const t = oy / FLOOR_Y;
    if (ox < FLOOR_X * t) return 'left';
    if (ox > OUTER_W - (OUTER_W - FLOOR_X - FLOOR_W) * t) return 'right';
    return 'back';
  }
  if (oy > FLOOR_Y + FLOOR_H) {
    const t = (oy - FLOOR_Y - FLOOR_H) / (OUTER_H - FLOOR_Y - FLOOR_H);
    if (ox < FLOOR_X * (1 - t)) return 'left';
    if (ox > FLOOR_X + FLOOR_W + (OUTER_W - FLOOR_X - FLOOR_W) * t) return 'right';
    return 'front';
  }
  return ox < FLOOR_X ? 'left' : 'right';
}

function toLocal(ox: number, oy: number, zone: WallId | 'floor') {
  if (zone === 'floor') return { x: ox - FLOOR_X, y: oy - FLOOR_Y };
  if (zone === 'back') return { x: ox - FLOOR_X, y: oy };
  if (zone === 'front') return { x: ox - FLOOR_X, y: oy - FLOOR_Y - FLOOR_H };
  if (zone === 'left') return { x: ox, y: oy };
  return { x: ox - FLOOR_X - FLOOR_W, y: oy };
}

function autoRot(wall?: WallId): number {
  if (wall === 'right') return 90;
  if (wall === 'front') return 180;
  if (wall === 'left') return 270;
  return 0;
}

export default function Room({
  furniture, selectedId, onSelect, onMoveTo,
  floorStyle, floorColor, wallStyle, wallColor, onDrop,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const [dragOverZone, setDragOverZone] = useState<string | null>(null);

  const outerPos = useCallback((e: { clientX: number; clientY: number }) => {
    if (!containerRef.current) return { x: 0, y: 0 };
    const r = containerRef.current.getBoundingClientRect();
    const scaleX = OUTER_W / r.width;
    const scaleY = OUTER_H / r.height;
    return { x: (e.clientX - r.left) * scaleX, y: (e.clientY - r.top) * scaleY };
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const clientPos = 'touches' in e ? e.touches[0] : e;
    if (!draggingId) return;
    const op = outerPos(clientPos);
    const zone = hitZone(op.x, op.y);
    const wallVal = zone === 'floor' ? undefined : zone as WallId;
    const local = toLocal(op.x - dragOffsetRef.current.x, op.y - dragOffsetRef.current.y, zone);
    onMoveTo(draggingId, wallVal, local.x, local.y);
  }, [draggingId, outerPos, onMoveTo]);

  const handleMouseUp = useCallback(() => {
    setDraggingId(null);
  }, []);

  const itemDown = useCallback((e: React.MouseEvent | React.TouchEvent, item: FurnitureInstance) => {
    e.stopPropagation();
    const clientPos = 'touches' in e ? e.touches[0] : e;
    onSelect(item.id);

    setDraggingId(item.id);
    const op = outerPos(clientPos);
    const zone = item.wall || 'floor';
    let ix = item.x, iy = item.y;
    if (zone === 'floor') { ix += FLOOR_X; iy += FLOOR_Y; }
    else if (zone === 'back') { ix += FLOOR_X; }
    else if (zone === 'front') { ix += FLOOR_X; iy += FLOOR_Y + FLOOR_H; }
    else if (zone === 'right') { ix += FLOOR_X + FLOOR_W; }
    dragOffsetRef.current = { x: op.x - ix, y: op.y - iy };
  }, [onSelect, outerPos]);

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); const p = outerPos(e); setDragOverZone(hitZone(p.x, p.y) as string); };
  const handleDragLeave = () => setDragOverZone(null);
  const handleContainerDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragOverZone(null);
    const t = e.dataTransfer.getData('furnitureType') as FurnitureType;
    if (!t || !FURNITURE_CATALOG[t]) return;
    const op = outerPos(e);
    const zone = hitZone(op.x, op.y);
    const wm = isWallMounted(t);
    const finalWall = zone !== 'floor' ? (zone as WallId) : (wm ? 'back' as WallId : undefined);
    const sz = FURNITURE_SIZES[t][0];
    const local = toLocal(op.x - sz.w / 2, op.y - sz.h / 2, finalWall || 'floor');
    onDrop(t, local.x, local.y, wm ? finalWall : undefined);
  };

  const handleBgMouseDown = useCallback(() => {
    onSelect(null);
  }, [onSelect]);

  const renderItems = (items: FurnitureInstance[], offX: number, offY: number) =>
    items.map(item => {
      const sel = selectedId === item.id;
      const drg = draggingId === item.id;
      const wm = isWallMounted(item.type);
      const rot = wm ? autoRot(item.wall) + (item.rotation || 0) : (item.rotation || 0);
      return (
        <div key={item.id}
          className={`absolute cursor-grab active:cursor-grabbing group pointer-events-auto ${drg ? 'z-50 opacity-80' : sel ? 'z-40' : 'z-10'}`}
          style={{
            left: item.x + offX, top: item.y + offY,
            transform: `rotate(${rot}deg) scale(${item.scale})`,
            transformOrigin: 'center center',
          }}
          onMouseDown={e => itemDown(e, item)}
          onMouseUp={handleMouseUp}
          onTouchStart={e => itemDown(e, item)}
          onTouchEnd={handleMouseUp}
        >
          {sel && <div className="absolute -inset-2 border-2 border-blue-500 rounded-sm bg-blue-100/15 pointer-events-none" style={{ animation: 'selPulse 1.5s ease-in-out infinite' }} />}
          <div className="absolute -inset-1 border border-transparent group-hover:border-blue-400/30 rounded-sm pointer-events-none transition-colors" />
          <FurnitureIcon type={item.type} color={item.color} shape={item.shape} shadow={!drg} />
          {item.description && !drg && (
            <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white text-gray-500 text-[7px] px-1.5 py-0.5 rounded-sm shadow-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-gray-200 z-60">
              {item.description.length > 25 ? item.description.slice(0, 25) + '…' : item.description}
            </div>
          )}
        </div>
      );
    });

  const floorItems = useMemo(() => furniture.filter(f => !f.wall), [furniture]);
  const backItems  = useMemo(() => furniture.filter(f => f.wall === 'back'), [furniture]);
  const leftItems  = useMemo(() => furniture.filter(f => f.wall === 'left'), [furniture]);
  const rightItems = useMemo(() => furniture.filter(f => f.wall === 'right'), [furniture]);
  const frontItems = useMemo(() => furniture.filter(f => f.wall === 'front'), [furniture]);

  const fBgCss = floorBg(floorStyle, floorColor);
  const hlFloor = dragOverZone === 'floor', hlBack = dragOverZone === 'back';
  const hlLeft = dragOverZone === 'left', hlRight = dragOverZone === 'right', hlFront = dragOverZone === 'front';

  const OTL = { x: 0, y: 0 }, OTR = { x: OUTER_W, y: 0 }, OBL = { x: 0, y: OUTER_H }, OBR = { x: OUTER_W, y: OUTER_H };
  const FTL = { x: FLOOR_X, y: FLOOR_Y }, FTR = { x: FLOOR_X + FLOOR_W, y: FLOOR_Y };
  const FBL = { x: FLOOR_X, y: FLOOR_Y + FLOOR_H }, FBR = { x: FLOOR_X + FLOOR_W, y: FLOOR_Y + FLOOR_H };
  const poly = (...pts: { x: number; y: number }[]) => pts.map(p => `${p.x},${p.y}`).join(' ');
  const hl = (on: boolean) => on ? { stroke: 'rgba(59,130,246,0.5)', strokeWidth: 3 } : { stroke: 'none', strokeWidth: 0 };

  return (
    <div className="flex-1 flex flex-col bg-gray-100 overflow-hidden">
      <div className="flex-1 flex items-center justify-center p-3 overflow-auto">
        <div ref={containerRef}
          style={{ 
            width: '100%', 
            maxWidth: OUTER_W, 
            aspectRatio: `${OUTER_W}/${OUTER_H}`,
            position: 'relative', 
            cursor: draggingId ? 'grabbing' : 'default' 
          }}
          onMouseMove={handleMouseMove} 
          onMouseUp={handleMouseUp} 
          onMouseLeave={handleMouseUp}
          onTouchMove={handleMouseMove}
          onTouchEnd={handleMouseUp}
          onDragOver={handleDragOver} 
          onDragLeave={handleDragLeave} 
          onDrop={handleContainerDrop}
        >
          <svg className="absolute inset-0 w-full h-full" viewBox={`0 0 ${OUTER_W} ${OUTER_H}`} preserveAspectRatio="xMidYMid meet" style={{ zIndex: 0 }}>
            <WallPatterns wallStyle={wallStyle} wallColor={wallColor} />
            <polygon points={poly(OTL, OTR, FTR, FTL)} fill={wallFill(wallStyle, 'back', wallColor)} {...hl(hlBack)} />
            <polygon points={poly(OTL, FTL, FBL, OBL)} fill={wallFill(wallStyle, 'left', wallColor)} {...hl(hlLeft)} />
            <polygon points={poly(OTR, FTR, FBR, OBR)} fill={wallFill(wallStyle, 'right', wallColor)} {...hl(hlRight)} />
            <polygon points={poly(FBL, FBR, OBR, OBL)} fill={wallFill(wallStyle, 'front', wallColor)} {...hl(hlFront)} />
            <rect x={FLOOR_X} y={FLOOR_Y} width={FLOOR_W} height={FLOOR_H} fill="white" {...hl(hlFloor)} />
          </svg>

          <div 
            data-bg="true" 
            className="absolute" 
            style={{ 
              left: `${(FLOOR_X / OUTER_W) * 100}%`, 
              top: `${(FLOOR_Y / OUTER_H) * 100}%`, 
              width: `${(FLOOR_W / OUTER_W) * 100}%`, 
              height: `${(FLOOR_H / OUTER_H) * 100}%`, 
              background: fBgCss, 
              zIndex: 1 
            }}
          >
            <div className="absolute top-0 left-0 right-0 h-5 bg-gradient-to-b from-black/[0.06] to-transparent pointer-events-none" />
            <div className="absolute top-0 left-0 bottom-0 w-5 bg-gradient-to-r from-black/[0.04] to-transparent pointer-events-none" />
            <div className="absolute top-0 right-0 bottom-0 w-5 bg-gradient-to-l from-black/[0.04] to-transparent pointer-events-none" />
            <div className="absolute bottom-0 left-0 right-0 h-5 bg-gradient-to-t from-black/[0.04] to-transparent pointer-events-none" />
          </div>

          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox={`0 0 ${OUTER_W} ${OUTER_H}`} preserveAspectRatio="xMidYMid meet" style={{ zIndex: 10 }}>
            <rect x={.5} y={.5} width={OUTER_W-1} height={OUTER_H-1} fill="none" stroke="rgba(0,0,0,0.15)" strokeWidth={1.5} />
            <rect x={FLOOR_X} y={FLOOR_Y} width={FLOOR_W} height={FLOOR_H} fill="none" stroke="rgba(0,0,0,0.12)" strokeWidth={1} />
            <line x1={OTL.x} y1={OTL.y} x2={FTL.x} y2={FTL.y} stroke="rgba(0,0,0,0.12)" strokeWidth={1} />
            <line x1={OTR.x} y1={OTR.y} x2={FTR.x} y2={FTR.y} stroke="rgba(0,0,0,0.12)" strokeWidth={1} />
            <line x1={OBL.x} y1={OBL.y} x2={FBL.x} y2={FBL.y} stroke="rgba(0,0,0,0.10)" strokeWidth={1} />
            <line x1={OBR.x} y1={OBR.y} x2={FBR.x} y2={FBR.y} stroke="rgba(0,0,0,0.10)" strokeWidth={1} />
          </svg>

          {/* Deselect overlay */}
          <div className="absolute inset-0" style={{ zIndex: 5 }} onMouseDown={handleBgMouseDown} />

          {/* Furniture items */}
          <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 10 }}>
            <svg className="absolute inset-0 w-full h-full" viewBox={`0 0 ${OUTER_W} ${OUTER_H}`} preserveAspectRatio="xMidYMid meet">
              <foreignObject x="0" y="0" width={OUTER_W} height={OUTER_H}>
                <div style={{ width: OUTER_W, height: OUTER_H, position: 'relative' }}>
                  {renderItems(floorItems, FLOOR_X, FLOOR_Y)}
                  {renderItems(backItems, FLOOR_X, 0)}
                  {renderItems(frontItems, FLOOR_X, FLOOR_Y + FLOOR_H)}
                  {renderItems(leftItems, 0, 0)}
                  {renderItems(rightItems, FLOOR_X + FLOOR_W, 0)}
                </div>
              </foreignObject>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
