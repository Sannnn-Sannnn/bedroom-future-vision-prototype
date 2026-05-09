import { FurnitureType, FURNITURE_SIZES } from '../types';

interface Props {
  type: FurnitureType;
  color: string;
  shape: number;
  shadow?: boolean;
  preview?: boolean;
}

const L = (h: string, a: number) => {
  const c = h.startsWith('#') ? h : '#888';
  let r = parseInt(c.slice(1,3),16), g = parseInt(c.slice(3,5),16), b = parseInt(c.slice(5,7),16);
  return `rgb(${Math.min(255,Math.max(0,r+a))},${Math.min(255,Math.max(0,g+a))},${Math.min(255,Math.max(0,b+a))})`;
};
const D = (h: string, a: number) => L(h, -a);

/* ── Floor items (top-down view) ── */

function BedSVG({ w, h, color, shape }: { w: number; h: number; color: string; shape: number }) {
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <rect x={1} y={1} width={w-2} height={h-2} rx={1} fill={D(color,15)} stroke={D(color,35)} strokeWidth={1.5}/>
      <rect x={1} y={1} width={w-2} height={h*0.11} rx={1} fill={D(color,40)}/>
      <rect x={4} y={h*0.14} width={w-8} height={h*0.82} rx={1} fill={L(color,40)}/>
      {shape===0 ? (
        <rect x={w*0.18} y={h*0.16} width={w*0.64} height={h*0.12} rx={2.5} fill="#fff" stroke={D(color,8)} strokeWidth={.8}/>
      ) : (
        <><rect x={5} y={h*0.16} width={w*0.4} height={h*0.11} rx={2.5} fill="#fff" stroke={D(color,8)} strokeWidth={.8}/>
          <rect x={w-5-w*0.4} y={h*0.16} width={w*0.4} height={h*0.11} rx={2.5} fill="#fff" stroke={D(color,8)} strokeWidth={.8}/></>
      )}
      <line x1={6} y1={h*0.42} x2={w-6} y2={h*0.42} stroke={D(color,5)} strokeWidth={.8} opacity={.4} strokeDasharray="3 2"/>
    </svg>
  );
}

function WardrobeSVG({ w, h, color, shape }: { w: number; h: number; color: string; shape: number }) {
  const doors = shape === 2 ? 3 : 2;
  const dw = (w - 4) / doors;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <rect x={1} y={1} width={w-2} height={h-2} rx={1} fill={color} stroke={D(color,40)} strokeWidth={1.5}/>
      {Array.from({length: doors}, (_,i) => (
        <g key={i}>
          <rect x={2+i*dw+1} y={3} width={dw-2} height={h-6} rx={.5} fill={L(color,8)} stroke={D(color,20)} strokeWidth={.5}/>
          <rect x={2+i*dw+dw/2-1.5} y={h/2-2.5} width={3} height={5} rx={.8} fill={L(color,50)}/>
        </g>
      ))}
    </svg>
  );
}

function DeskSVG({ w, h, color, shape }: { w: number; h: number; color: string; shape: number }) {
  const m = 2;
  const topH = h * 0.6;
  const extX = w * 0.58;
  const extW = w - extX - m;
  const hi = 3;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      {shape === 1 && (
        <rect x={extX} y={m} width={extW} height={h - m * 2} rx={1} fill={L(color,5)} stroke={D(color,35)} strokeWidth={1.5}/>
      )}
      <rect x={m} y={m} width={w - m * 2} height={topH} rx={1} fill={color} stroke={D(color,35)} strokeWidth={1.5}/>
      <rect x={m + hi} y={m + hi} width={w - m * 2 - hi * 2} height={topH - hi * 2} rx={0.5} fill="none" stroke={L(color,30)} strokeWidth={1} opacity={0.25}/>
      {shape === 1 && (
        <rect x={extX + hi} y={topH + hi} width={extW - hi * 2} height={h - m * 2 - topH - hi} rx={0.5} fill="none" stroke={L(color,30)} strokeWidth={1} opacity={0.2}/>
      )}
    </svg>
  );
}

function ChairSVG({ w, h, color }: { w: number; h: number; color: string }) {
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <rect x={4} y={4} width={w-8} height={h-8} rx={3} fill={color} stroke={D(color,30)} strokeWidth={1.5}/>
      <rect x={8} y={8} width={w-16} height={h-16} rx={2} fill={L(color,15)}/>
    </svg>
  );
}

function PlantSVG({ w, h, color }: { w: number; h: number; color: string }) {
  const cx = w / 2, cy = h / 2, r = Math.min(w, h) * 0.42;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <circle cx={cx} cy={cy} r={r} fill={color} opacity={0.85}/>
      <circle cx={cx} cy={cy} r={r*0.7} fill={L(color,15)} opacity={0.5}/>
      <circle cx={cx-r*0.15} cy={cy-r*0.1} r={r*0.35} fill={L(color,30)} opacity={0.45}/>
    </svg>
  );
}

function TVSVG({ w, h, color }: { w: number; h: number; color: string }) {
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <rect x={2} y={2} width={w-4} height={h-8} rx={2} fill={color} stroke={D(color,30)} strokeWidth={1.5}/>
      <rect x={5} y={5} width={w-10} height={h-14} rx={1} fill={L(color,80)}/>
      <rect x={w/2-8} y={h-6} width={16} height={4} rx={1} fill={D(color,20)}/>
    </svg>
  );
}

function EaselSVG({ w, h, color }: { w: number; h: number; color: string }) {
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <line x1={w*0.2} y1={h-4} x2={w/2} y2={4} stroke={color} strokeWidth={3}/>
      <line x1={w*0.8} y1={h-4} x2={w/2} y2={4} stroke={color} strokeWidth={3}/>
      <rect x={8} y={h*0.2} width={w-16} height={h*0.5} rx={1} fill={L(color,60)} stroke={D(color,20)} strokeWidth={1}/>
    </svg>
  );
}

/* ── Wall items (front elevation view) ── */

function PosterSVG({ w, h, color }: { w: number; h: number; color: string }) {
  const fc = D(color,50);
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <rect x={2} y={2} width={w-4} height={h-4} rx={1} fill={fc} stroke={D(fc,20)} strokeWidth={1.2}/>
      <rect x={5} y={5} width={w-10} height={h-10} fill="#f8f6f0"/>
      <rect x={7} y={7} width={w-14} height={h-14} fill={color}/>
      <circle cx={w*.38} cy={h*.35} r={Math.min(w,h)*.1} fill={L(color,40)} opacity={.6}/>
      <rect x={w*.46} y={h*.5} width={w*.25} height={h*.08} rx={1} fill={D(color,22)} opacity={.45}/>
      <line x1={w*.2} y1={h*.7} x2={w*.7} y2={h*.7} stroke={L(color,45)} strokeWidth={1.2} opacity={.4}/>
    </svg>
  );
}

function PaintingSVG({ w, h, color }: { w: number; h: number; color: string }) {
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <rect x={2} y={2} width={w-4} height={h-4} rx={1} fill={D(color,40)} stroke={D(color,50)} strokeWidth={2}/>
      <rect x={5} y={5} width={w-10} height={h-10} fill={color}/>
      <circle cx={w*0.3} cy={h*0.4} r={w*0.12} fill={L(color,30)}/>
      <rect x={w*0.5} y={h*0.6} width={w*0.3} height={h*0.15} rx={1} fill={D(color,20)} opacity={0.5}/>
    </svg>
  );
}

function ClockSVG({ w, h, color, shape }: { w: number; h: number; color: string; shape: number }) {
  const cx=w/2, cy=h/2, r=w*.38, rim=D(color,60);
  const ms = Array.from({length:12},(_,i)=>{
    const a=(i*30-90)*Math.PI/180;
    return <line key={i} x1={cx+Math.cos(a)*r*.76} y1={cy+Math.sin(a)*r*.76} x2={cx+Math.cos(a)*r*.92} y2={cy+Math.sin(a)*r*.92} stroke={D(color,80)} strokeWidth={i%3===0?2:.8}/>;
  });
  const hA=(310-90)*Math.PI/180, mA=(60-90)*Math.PI/180;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      {shape===0&&<><circle cx={cx} cy={cy} r={r+3} fill={rim}/><circle cx={cx} cy={cy} r={r} fill={color}/></>}
      {shape===1&&<><rect x={cx-r-3} y={cy-r-3} width={(r+3)*2} height={(r+3)*2} rx={1} fill={rim}/><rect x={cx-r} y={cy-r} width={r*2} height={r*2} rx={.5} fill={color}/></>}
      {shape===2&&<><polygon points={Array.from({length:6},(_,i)=>{const a=(i*60-30)*Math.PI/180;return `${cx+r*1.15*Math.cos(a)},${cy+r*1.15*Math.sin(a)}`;}).join(' ')} fill={rim}/><circle cx={cx} cy={cy} r={r} fill={color}/></>}
      {ms}
      <line x1={cx} y1={cy} x2={cx+Math.cos(hA)*r*.48} y2={cy+Math.sin(hA)*r*.48} stroke={D(color,80)} strokeWidth={2.2}/>
      <line x1={cx} y1={cy} x2={cx+Math.cos(mA)*r*.66} y2={cy+Math.sin(mA)*r*.66} stroke={D(color,80)} strokeWidth={1.3}/>
      <circle cx={cx} cy={cy} r={2} fill={D(color,70)}/>
    </svg>
  );
}

function CalendarSVG({ w, h, color }: { w: number; h: number; color: string }) {
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <rect x={2} y={2} width={w-4} height={h-4} rx={2} fill={color} stroke={D(color,30)} strokeWidth={1.5}/>
      <rect x={2} y={2} width={w-4} height={h*0.2} rx={2} fill={D(color,30)}/>
      <rect x={5} y={h*0.28} width={w-10} height={h*0.6} fill={L(color,50)}/>
      {[0,1,2].map(row => [0,1,2].map(col => (
        <rect key={`${row}-${col}`} x={7+col*(w-14)/3} y={h*0.32+row*(h*0.5)/3} width={(w-18)/3} height={(h*0.45)/3} rx={1} fill={D(color,10)} opacity={0.3}/>
      )))}
    </svg>
  );
}

function DiplomasSVG({ w, h, color }: { w: number; h: number; color: string }) {
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <rect x={2} y={2} width={w-4} height={h-4} rx={1} fill={color} stroke={D(color,40)} strokeWidth={2}/>
      <rect x={6} y={6} width={w-12} height={h-12} fill={L(color,60)}/>
      <line x1={10} y1={h*0.35} x2={w-10} y2={h*0.35} stroke={D(color,30)} strokeWidth={1}/>
      <line x1={12} y1={h*0.5} x2={w-12} y2={h*0.5} stroke={D(color,20)} strokeWidth={0.8}/>
      <line x1={12} y1={h*0.6} x2={w-12} y2={h*0.6} stroke={D(color,20)} strokeWidth={0.8}/>
      <circle cx={w/2} cy={h*0.78} r={4} fill={color} stroke={D(color,30)} strokeWidth={1}/>
    </svg>
  );
}

function DoorSVG({ w, h, color, shape }: { w: number; h: number; color: string; shape: number }) {
  const fc = D(color,30);
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <rect x={1} y={1} width={w-2} height={h-2} rx={1} fill={fc} stroke={D(fc,25)} strokeWidth={1.5}/>
      {shape===1?(
        <><rect x={4} y={4} width={w/2-5} height={h-8} rx={.5} fill={color} stroke={D(color,15)} strokeWidth={.8}/>
          <rect x={w/2+1} y={4} width={w/2-5} height={h-8} rx={.5} fill={color} stroke={D(color,15)} strokeWidth={.8}/>
          <rect x={w/2-4} y={h*.48} width={2.5} height={5} rx={.5} fill={D(color,50)}/>
          <rect x={w/2+1.5} y={h*.48} width={2.5} height={5} rx={.5} fill={D(color,50)}/></>
      ):shape===2?(
        <><rect x={3} y={3} width={w*.55} height={h-6} rx={.5} fill={color} stroke={D(color,15)} strokeWidth={.8}/>
          <rect x={w*.35} y={3} width={w*.55} height={h-6} rx={.5} fill={L(color,8)} stroke={D(color,15)} strokeWidth={.8} opacity={.85}/>
          <rect x={w*.55} y={h*.43} width={2.5} height={h*.14} rx={.5} fill={D(color,50)}/></>
      ):(
        <><rect x={4} y={4} width={w-8} height={h-8} rx={.5} fill={color} stroke={D(color,15)} strokeWidth={.8}/>
          <circle cx={w-11} cy={h*.52} r={3} fill={D(color,50)}/>
          <rect x={8} y={10} width={w-16} height={h*.26} rx={1} fill={L(color,12)} stroke={D(color,8)} strokeWidth={.5}/>
          <rect x={8} y={h*.48} width={w-16} height={h*.26} rx={1} fill={L(color,12)} stroke={D(color,8)} strokeWidth={.5}/></>
      )}
    </svg>
  );
}

function WindowSVG({ w, h, color, shape }: { w: number; h: number; color: string; shape: number }) {
  const fc = '#e8e4dc';
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <rect x={1} y={1} width={w-2} height={h-2} rx={1} fill={fc} stroke={D(fc,30)} strokeWidth={1.5}/>
      {shape===1?(
        <><rect x={4} y={4} width={w/2-5} height={h-8} rx={.5} fill={color} opacity={.45} stroke={D(fc,15)} strokeWidth={.8}/>
          <rect x={w/2+1} y={4} width={w/2-5} height={h-8} rx={.5} fill={color} opacity={.45} stroke={D(fc,15)} strokeWidth={.8}/></>
      ):shape===2?(
        <><rect x={4} y={4} width={w/3-4} height={h-8} rx={.5} fill={color} opacity={.45} stroke={D(fc,15)} strokeWidth={.8}/>
          <rect x={w/3+1} y={4} width={w/3-2} height={h-8} rx={.5} fill={color} opacity={.45} stroke={D(fc,15)} strokeWidth={.8}/>
          <rect x={w*2/3+1} y={4} width={w/3-5} height={h-8} rx={.5} fill={color} opacity={.45} stroke={D(fc,15)} strokeWidth={.8}/></>
      ):(
        <><rect x={4} y={4} width={w-8} height={h-8} rx={.5} fill={color} opacity={.45} stroke={D(fc,15)} strokeWidth={.8}/>
          <line x1={w/2} y1={4} x2={w/2} y2={h-4} stroke={fc} strokeWidth={2.5}/>
          <line x1={4} y1={h/2} x2={w-4} y2={h/2} stroke={fc} strokeWidth={2.5}/></>
      )}
      <rect x={6} y={6} width={Math.min(w*.18,12)} height={3} rx={1} fill="white" opacity={.5}/>
    </svg>
  );
}

/* ── Decoracion items ── */

function GenericBoxSVG({ w, h, color, icon }: { w: number; h: number; color: string; icon?: string }) {
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <rect x={2} y={2} width={w-4} height={h-4} rx={3} fill={color} stroke={D(color,30)} strokeWidth={1.5}/>
      <rect x={5} y={5} width={w-10} height={h-10} rx={2} fill={L(color,20)} opacity={0.5}/>
      {icon && <text x={w/2} y={h/2+4} textAnchor="middle" fontSize={Math.min(w,h)*0.35} fill={D(color,40)}>{icon}</text>}
    </svg>
  );
}

function InstrumentsSVG({ w, h, color }: { w: number; h: number; color: string }) {
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <ellipse cx={w/2} cy={h*0.65} rx={w*0.35} ry={h*0.28} fill={color} stroke={D(color,30)} strokeWidth={1.5}/>
      <rect x={w/2-2} y={4} width={4} height={h*0.5} rx={1} fill={D(color,20)}/>
      <line x1={w/2-6} y1={h*0.3} x2={w/2+6} y2={h*0.3} stroke={D(color,30)} strokeWidth={2}/>
    </svg>
  );
}

function ExerciseMatSVG({ w, h, color }: { w: number; h: number; color: string }) {
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <rect x={2} y={6} width={w-4} height={h-12} rx={2} fill={color} stroke={D(color,20)} strokeWidth={1.5}/>
      <line x1={w*0.3} y1={8} x2={w*0.3} y2={h-8} stroke={L(color,20)} strokeWidth={1} opacity={0.5}/>
      <line x1={w*0.7} y1={8} x2={w*0.7} y2={h-8} stroke={L(color,20)} strokeWidth={1} opacity={0.5}/>
    </svg>
  );
}

function GymEquipmentSVG({ w, h, color }: { w: number; h: number; color: string }) {
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <rect x={w*0.4} y={h*0.4} width={w*0.2} height={h*0.2} rx={1} fill={D(color,10)}/>
      <rect x={4} y={h*0.3} width={w*0.2} height={h*0.4} rx={2} fill={color} stroke={D(color,30)} strokeWidth={1.5}/>
      <rect x={w-4-w*0.2} y={h*0.3} width={w*0.2} height={h*0.4} rx={2} fill={color} stroke={D(color,30)} strokeWidth={1.5}/>
    </svg>
  );
}

function CalculatorSVG({ w, h, color }: { w: number; h: number; color: string }) {
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <rect x={2} y={2} width={w-4} height={h-4} rx={2} fill={color} stroke={D(color,30)} strokeWidth={1.5}/>
      <rect x={5} y={5} width={w-10} height={h*0.25} rx={1} fill={L(color,50)}/>
      {[0,1,2].map(row => [0,1,2].map(col => (
        <rect key={`${row}-${col}`} x={5+col*(w-10)/3} y={h*0.4+row*(h*0.45)/3} width={(w-14)/3} height={(h*0.4)/3} rx={1} fill={D(color,20)}/>
      )))}
    </svg>
  );
}

function ComputerSVG({ w, h, color }: { w: number; h: number; color: string }) {
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <rect x={2} y={4} width={w-4} height={h*0.65} rx={2} fill={color} stroke={D(color,30)} strokeWidth={1.5}/>
      <rect x={5} y={7} width={w-10} height={h*0.5} rx={1} fill={L(color,80)}/>
      <rect x={w*0.3} y={h*0.72} width={w*0.4} height={h*0.08} rx={1} fill={D(color,20)}/>
      <rect x={w*0.15} y={h*0.82} width={w*0.7} height={h*0.12} rx={1} fill={D(color,10)}/>
    </svg>
  );
}

function DiarySVG({ w, h, color }: { w: number; h: number; color: string }) {
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <rect x={4} y={2} width={w-6} height={h-4} rx={2} fill={color} stroke={D(color,30)} strokeWidth={1.5}/>
      <rect x={2} y={h*0.15} width={4} height={h*0.15} rx={1} fill={D(color,40)}/>
      <rect x={2} y={h*0.45} width={4} height={h*0.15} rx={1} fill={D(color,40)}/>
      <rect x={2} y={h*0.75} width={4} height={h*0.15} rx={1} fill={D(color,40)}/>
      <rect x={w*0.3} y={h*0.35} width={w*0.4} height={2} rx={1} fill={L(color,40)}/>
    </svg>
  );
}

function SewingSVG({ w, h, color }: { w: number; h: number; color: string }) {
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <rect x={2} y={2} width={w-4} height={h-4} rx={2} fill={color} stroke={D(color,30)} strokeWidth={1.5}/>
      <circle cx={w*0.3} cy={h*0.4} r={w*0.15} fill={L(color,30)} stroke={D(color,20)} strokeWidth={1}/>
      <circle cx={w*0.6} cy={h*0.5} r={w*0.12} fill={D(color,20)} stroke={D(color,30)} strokeWidth={1}/>
      <line x1={w*0.7} y1={h*0.7} x2={w*0.85} y2={h*0.3} stroke={D(color,40)} strokeWidth={1.5}/>
    </svg>
  );
}

function PhotosSVG({ w, h, color }: { w: number; h: number; color: string }) {
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <rect x={8} y={2} width={w-12} height={h-6} rx={1} fill={D(color,20)} stroke={D(color,40)} strokeWidth={1}/>
      <rect x={4} y={5} width={w-12} height={h-6} rx={1} fill={D(color,10)} stroke={D(color,30)} strokeWidth={1}/>
      <rect x={2} y={8} width={w-8} height={h-10} rx={1} fill={color} stroke={D(color,30)} strokeWidth={1.5}/>
      <rect x={5} y={11} width={w-14} height={h-16} fill={L(color,60)}/>
    </svg>
  );
}

function ToolsSVG({ w, h, color }: { w: number; h: number; color: string }) {
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <rect x={2} y={h*0.3} width={w-4} height={h*0.65} rx={2} fill={color} stroke={D(color,30)} strokeWidth={1.5}/>
      <rect x={w*0.15} y={2} width={w*0.2} height={h*0.4} rx={1} fill={D(color,20)}/>
      <rect x={w*0.55} y={2} width={w*0.15} height={h*0.35} rx={1} fill={D(color,30)}/>
      <rect x={5} y={h*0.4} width={w-10} height={3} rx={1} fill={D(color,40)}/>
    </svg>
  );
}

function BoardGamesSVG({ w, h, color }: { w: number; h: number; color: string }) {
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <rect x={2} y={2} width={w-4} height={h-4} rx={2} fill={color} stroke={D(color,30)} strokeWidth={1.5}/>
      <line x1={w/2} y1={4} x2={w/2} y2={h-4} stroke={D(color,40)} strokeWidth={1}/>
      <line x1={4} y1={h/2} x2={w-4} y2={h/2} stroke={D(color,40)} strokeWidth={1}/>
      <circle cx={w*0.3} cy={h*0.3} r={w*0.1} fill={L(color,30)}/>
      <circle cx={w*0.7} cy={h*0.7} r={w*0.1} fill={D(color,30)}/>
    </svg>
  );
}

function BookSVG({ w, h, color }: { w: number; h: number; color: string }) {
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <rect x={4} y={2} width={w-6} height={h-4} rx={1} fill={color} stroke={D(color,30)} strokeWidth={1.5}/>
      <rect x={2} y={4} width={3} height={h-8} rx={0.5} fill={D(color,20)}/>
      <line x1={10} y1={h*0.3} x2={w-8} y2={h*0.3} stroke={L(color,40)} strokeWidth={1}/>
      <line x1={10} y1={h*0.45} x2={w-10} y2={h*0.45} stroke={L(color,30)} strokeWidth={0.8}/>
      <line x1={10} y1={h*0.6} x2={w-12} y2={h*0.6} stroke={L(color,30)} strokeWidth={0.8}/>
    </svg>
  );
}

function PlushiesSVG({ w, h, color }: { w: number; h: number; color: string }) {
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <circle cx={w/2} cy={h*0.55} r={w*0.35} fill={color} stroke={D(color,20)} strokeWidth={1.5}/>
      <circle cx={w*0.3} cy={h*0.25} r={w*0.15} fill={color} stroke={D(color,20)} strokeWidth={1}/>
      <circle cx={w*0.7} cy={h*0.25} r={w*0.15} fill={color} stroke={D(color,20)} strokeWidth={1}/>
      <circle cx={w*0.38} cy={h*0.5} r={w*0.06} fill={D(color,60)}/>
      <circle cx={w*0.62} cy={h*0.5} r={w*0.06} fill={D(color,60)}/>
      <ellipse cx={w/2} cy={h*0.65} rx={w*0.08} ry={w*0.05} fill={D(color,40)}/>
    </svg>
  );
}

function MemoriesSVG({ w, h, color }: { w: number; h: number; color: string }) {
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <rect x={2} y={h*0.2} width={w-4} height={h*0.75} rx={2} fill={color} stroke={D(color,30)} strokeWidth={1.5}/>
      <rect x={w*0.2} y={2} width={w*0.6} height={h*0.25} rx={2} fill={D(color,20)} stroke={D(color,40)} strokeWidth={1}/>
      <circle cx={w*0.3} cy={h*0.55} r={w*0.1} fill={L(color,30)}/>
      <rect x={w*0.5} y={h*0.45} width={w*0.3} height={h*0.2} rx={1} fill={L(color,20)}/>
    </svg>
  );
}

function PuzzlesSVG({ w, h, color }: { w: number; h: number; color: string }) {
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <rect x={2} y={2} width={w*0.45} height={h*0.45} rx={2} fill={color} stroke={D(color,30)} strokeWidth={1}/>
      <rect x={w*0.52} y={2} width={w*0.45} height={h*0.45} rx={2} fill={L(color,15)} stroke={D(color,30)} strokeWidth={1}/>
      <rect x={2} y={h*0.52} width={w*0.45} height={h*0.45} rx={2} fill={D(color,15)} stroke={D(color,30)} strokeWidth={1}/>
      <rect x={w*0.52} y={h*0.52} width={w*0.45} height={h*0.45} rx={2} fill={color} stroke={D(color,30)} strokeWidth={1}/>
      <circle cx={w*0.5} cy={h*0.25} r={w*0.08} fill={L(color,15)}/>
      <circle cx={w*0.25} cy={h*0.5} r={w*0.08} fill={color}/>
    </svg>
  );
}

function SouvenirsSVG({ w, h, color }: { w: number; h: number; color: string }) {
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <ellipse cx={w/2} cy={h*0.7} rx={w*0.35} ry={h*0.25} fill={D(color,20)} stroke={D(color,40)} strokeWidth={1.5}/>
      <ellipse cx={w/2} cy={h*0.4} rx={w*0.25} ry={h*0.3} fill={color} stroke={D(color,30)} strokeWidth={1.5}/>
      <ellipse cx={w/2} cy={h*0.25} rx={w*0.12} ry={h*0.08} fill={L(color,40)} opacity={0.6}/>
    </svg>
  );
}

function TrophiesSVG({ w, h, color }: { w: number; h: number; color: string }) {
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <rect x={w*0.3} y={h*0.8} width={w*0.4} height={h*0.15} rx={1} fill={D(color,30)}/>
      <rect x={w*0.35} y={h*0.6} width={w*0.3} height={h*0.25} rx={1} fill={D(color,20)}/>
      <ellipse cx={w/2} cy={h*0.35} rx={w*0.35} ry={h*0.3} fill={color} stroke={D(color,30)} strokeWidth={1.5}/>
      <ellipse cx={w/2} cy={h*0.25} rx={w*0.2} ry={h*0.1} fill={L(color,40)} opacity={0.5}/>
      <rect x={4} y={h*0.3} width={w*0.15} height={h*0.15} rx={2} fill={color}/>
      <rect x={w-4-w*0.15} y={h*0.3} width={w*0.15} height={h*0.15} rx={2} fill={color}/>
    </svg>
  );
}

function FoldersSVG({ w, h, color }: { w: number; h: number; color: string }) {
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <rect x={4} y={8} width={w-6} height={h-10} rx={1} fill={D(color,15)} stroke={D(color,30)} strokeWidth={1}/>
      <rect x={2} y={4} width={w-4} height={h-6} rx={1} fill={color} stroke={D(color,30)} strokeWidth={1.5}/>
      <rect x={2} y={4} width={w*0.4} height={h*0.15} rx={1} fill={D(color,20)}/>
      <line x1={8} y1={h*0.4} x2={w-8} y2={h*0.4} stroke={L(color,30)} strokeWidth={0.8}/>
      <line x1={8} y1={h*0.55} x2={w-10} y2={h*0.55} stroke={L(color,30)} strokeWidth={0.8}/>
    </svg>
  );
}

function ClothesSVG({ w, h, color }: { w: number; h: number; color: string }) {
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <polygon points={`${w*0.3},${h*0.15} ${w*0.5},${h*0.05} ${w*0.7},${h*0.15} ${w*0.65},${h*0.25} ${w*0.55},${h*0.2} ${w*0.55},${h*0.95} ${w*0.45},${h*0.95} ${w*0.45},${h*0.2} ${w*0.35},${h*0.25}`} fill={color} stroke={D(color,30)} strokeWidth={1.5}/>
      <line x1={w*0.35} y1={h*0.3} x2={w*0.35} y2={h*0.85} stroke={D(color,20)} strokeWidth={0.8}/>
      <line x1={w*0.65} y1={h*0.3} x2={w*0.65} y2={h*0.85} stroke={D(color,20)} strokeWidth={0.8}/>
    </svg>
  );
}

function AgendaSVG({ w, h, color }: { w: number; h: number; color: string }) {
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <rect x={4} y={2} width={w-6} height={h-4} rx={2} fill={color} stroke={D(color,30)} strokeWidth={1.5}/>
      <rect x={2} y={h*0.1} width={4} height={h*0.1} rx={1} fill={D(color,50)}/>
      <rect x={2} y={h*0.3} width={4} height={h*0.1} rx={1} fill={D(color,50)}/>
      <rect x={2} y={h*0.5} width={4} height={h*0.1} rx={1} fill={D(color,50)}/>
      <rect x={2} y={h*0.7} width={4} height={h*0.1} rx={1} fill={D(color,50)}/>
      <line x1={10} y1={h*0.25} x2={w-8} y2={h*0.25} stroke={L(color,30)} strokeWidth={0.8}/>
      <line x1={10} y1={h*0.4} x2={w-10} y2={h*0.4} stroke={L(color,30)} strokeWidth={0.8}/>
      <line x1={10} y1={h*0.55} x2={w-8} y2={h*0.55} stroke={L(color,30)} strokeWidth={0.8}/>
      <rect x={w*0.6} y={h*0.65} width={w*0.25} height={h*0.2} rx={1} fill={D(color,20)}/>
    </svg>
  );
}

export default function FurnitureIcon({ type, color, shape, shadow = false, preview = false }: Props) {
  const idx = Math.min(shape, FURNITURE_SIZES[type].length - 1);
  const sz = FURNITURE_SIZES[type][idx];
  const scale = preview ? 0.45 : 1;
  const w = sz.w * scale, h = sz.h * scale;
  const p = { w, h, color, shape: idx };

  const svgs: Record<FurnitureType, React.ReactNode> = {
    // Muebles
    bed: <BedSVG {...p}/>,
    wardrobe: <WardrobeSVG {...p}/>,
    desk: <DeskSVG {...p}/>,
    chair: <ChairSVG w={w} h={h} color={color}/>,
    plant: <PlantSVG w={w} h={h} color={color}/>,
    tv: <TVSVG w={w} h={h} color={color}/>,
    easel: <EaselSVG w={w} h={h} color={color}/>,
    // Pared
    poster: <PosterSVG w={w} h={h} color={color}/>,
    painting: <PaintingSVG w={w} h={h} color={color}/>,
    clock: <ClockSVG {...p}/>,
    calendar: <CalendarSVG w={w} h={h} color={color}/>,
    diplomas: <DiplomasSVG w={w} h={h} color={color}/>,
    door: <DoorSVG {...p}/>,
    window: <WindowSVG {...p}/>,
    // Decoracion
    instruments: <InstrumentsSVG w={w} h={h} color={color}/>,
    exercise_mat: <ExerciseMatSVG w={w} h={h} color={color}/>,
    gym_equipment: <GymEquipmentSVG w={w} h={h} color={color}/>,
    calculator: <CalculatorSVG w={w} h={h} color={color}/>,
    computer: <ComputerSVG w={w} h={h} color={color}/>,
    diary: <DiarySVG w={w} h={h} color={color}/>,
    sewing: <SewingSVG w={w} h={h} color={color}/>,
    photos: <PhotosSVG w={w} h={h} color={color}/>,
    tools: <ToolsSVG w={w} h={h} color={color}/>,
    board_games: <BoardGamesSVG w={w} h={h} color={color}/>,
    book: <BookSVG w={w} h={h} color={color}/>,
    plushies: <PlushiesSVG w={w} h={h} color={color}/>,
    memories: <MemoriesSVG w={w} h={h} color={color}/>,
    puzzles: <PuzzlesSVG w={w} h={h} color={color}/>,
    souvenirs: <SouvenirsSVG w={w} h={h} color={color}/>,
    trophies: <TrophiesSVG w={w} h={h} color={color}/>,
    folders: <FoldersSVG w={w} h={h} color={color}/>,
    work_clothes: <ClothesSVG w={w} h={h} color={color}/>,
    going_out_clothes: <ClothesSVG w={w} h={h} color={color}/>,
    home_clothes: <ClothesSVG w={w} h={h} color={color}/>,
    elegant_clothes: <ClothesSVG w={w} h={h} color={color}/>,
    work_uniform: <ClothesSVG w={w} h={h} color={color}/>,
    formal_clothes: <ClothesSVG w={w} h={h} color={color}/>,
    agenda: <AgendaSVG w={w} h={h} color={color}/>,
  };

  return <div style={{ filter: shadow ? 'drop-shadow(1px 2px 4px rgba(0,0,0,0.22))' : undefined }}>{svgs[type]}</div>;
}
