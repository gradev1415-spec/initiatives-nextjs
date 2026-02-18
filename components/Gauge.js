"use client";
import { useT } from "@/lib/theme";
import { rc } from "@/lib/utils";

export default function Gauge({ v, sz, sw, clr }) {
  var T = useT();
  var size = sz || 120, stroke = sw || 8;
  var r2 = (size - stroke) / 2;
  var ci = 2 * Math.PI * r2;
  var isOver = v > 100;
  var off = isOver ? 0 : ci - (v / 100) * ci;
  var c = clr || rc(v, T);
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={r2} fill="none" stroke={c + "15"} strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={r2} fill="none" stroke={c} strokeWidth={stroke} strokeDasharray={ci} strokeDashoffset={off} strokeLinecap="round" style={isOver ? { filter: "drop-shadow(0 0 4px " + c + "60)" } : {}} />
      <text x={size / 2} y={size / 2} textAnchor="middle" dominantBaseline="central" style={{ transform: "rotate(90deg)", transformOrigin: "center", fontSize: size * 0.25, fontWeight: 700, fill: c }}>
        {v}%
      </text>
    </svg>
  );
}
