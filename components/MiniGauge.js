"use client";
import { useT } from "@/lib/theme";
import { rc } from "@/lib/utils";

/* Map value to visual arc: stretch the last 10% so progress
   above 90 is more visible. Below 90 = linear. Above 90,
   the remaining 10% maps to more arc space, making each
   point above 90 visually ~1.5x larger than below 90. */
function visualPct(v) {
  if (v >= 100) return 100;
  if (v <= 0) return 0;
  if (v <= 90) return v * 0.85;
  return 76.5 + ((v - 90) / 10) * 23.5;
}

export default function MiniGauge({ v, sz, sw, clr }) {
  var T = useT();
  var size = sz || 40, stroke = sw || 3;
  var r2 = (size - stroke) / 2;
  var ci = 2 * Math.PI * r2;
  var isOver = v > 100;
  var isFull = v === 100;
  var c = clr || rc(v, T);
  var cx = size / 2, cy = size / 2;

  /* 100% celebration: complete ring with glow + centered checkmark */
  if (isFull) {
    /* Checkmark sized to ~40% of the inner area */
    var s = size * 0.18;
    var x1 = cx - s * 0.9;
    var y1 = cy + s * 0.1;
    var x2 = cx - s * 0.15;
    var y2 = cy + s * 0.7;
    var x3 = cx + s * 1.0;
    var y3 = cy - s * 0.7;
    return (
      <svg width={size} height={size} viewBox={"0 0 "+size+" "+size} style={{ flexShrink:0 }}>
        <circle cx={cx} cy={cy} r={r2} fill="none" stroke={c} strokeWidth={stroke}/>
        <polyline
          points={x1+","+y1+" "+x2+","+y2+" "+x3+","+y3}
          fill="none" stroke={c} strokeWidth={Math.max(1.5, stroke * 0.7)} strokeLinecap="round" strokeLinejoin="round"
        />
      </svg>
    );
  }

  /* Normal + over-100 state with non-linear arc */
  var vPct = isOver ? 100 : visualPct(v);
  var off = isOver ? 0 : ci - (vPct / 100) * ci;

  return (
    <svg width={size} height={size} viewBox={"0 0 "+size+" "+size} style={{ transform:"rotate(-90deg)", flexShrink:0 }}>
      <circle cx={cx} cy={cy} r={r2} fill="none" stroke={c+"15"} strokeWidth={stroke} />
      <circle cx={cx} cy={cy} r={r2} fill="none" stroke={c} strokeWidth={stroke} strokeDasharray={ci} strokeDashoffset={off} strokeLinecap="round" style={{}} />
    </svg>
  );
}
