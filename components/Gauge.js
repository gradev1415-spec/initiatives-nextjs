"use client";
import { useT } from "@/lib/theme";
import { rc } from "@/lib/utils";

/* Same non-linear mapping as MiniGauge */
function visualPct(v) {
  if (v >= 100) return 100;
  if (v <= 0) return 0;
  if (v <= 90) return v * 0.85;
  return 76.5 + ((v - 90) / 10) * 23.5;
}

export default function Gauge({ v, sz, sw, clr }) {
  var T = useT();
  var size = sz || 120, stroke = sw || 8;
  var r2 = (size - stroke) / 2;
  var ci = 2 * Math.PI * r2;
  var isOver = v > 100;
  var isFull = v === 100;
  var c = clr || rc(v, T);
  var cx = size / 2, cy = size / 2;

  /* 100% celebration: glowing ring + checkmark + "100%" text */
  if (isFull) {
    var s = size * 0.16;
    var x1 = cx - s * 0.9;
    var y1 = cy + s * 0.1;
    var x2 = cx - s * 0.15;
    var y2 = cy + s * 0.7;
    var x3 = cx + s * 1.0;
    var y3 = cy - s * 0.7;
    return (
      <svg width={size} height={size} viewBox={"0 0 "+size+" "+size}>
        <circle cx={cx} cy={cy} r={r2} fill="none" stroke={c} strokeWidth={stroke}/>
        <polyline
          points={x1+","+y1+" "+x2+","+y2+" "+x3+","+y3}
          fill="none" stroke={c} strokeWidth={Math.max(2, stroke * 0.5)} strokeLinecap="round" strokeLinejoin="round"
        />
      </svg>
    );
  }

  /* Normal + over-100 with non-linear arc */
  var vPct = isOver ? 100 : visualPct(v);
  var off = isOver ? 0 : ci - (vPct / 100) * ci;

  return (
    <svg width={size} height={size} viewBox={"0 0 "+size+" "+size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={cx} cy={cy} r={r2} fill="none" stroke={c + "15"} strokeWidth={stroke} />
      <circle cx={cx} cy={cy} r={r2} fill="none" stroke={c} strokeWidth={stroke} strokeDasharray={ci} strokeDashoffset={off} strokeLinecap="round" style={{}} />
      <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central" style={{ transform: "rotate(90deg)", transformOrigin: "center", fontSize: size * 0.25, fontWeight: 700, fill: c }}>
        {v}%
      </text>
    </svg>
  );
}
