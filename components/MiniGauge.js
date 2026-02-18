"use client";
import { useT } from "@/lib/theme";
import { rc } from "@/lib/utils";

export default function MiniGauge({ v, sz, sw, clr }) {
  var T = useT();
  var size = sz || 40, stroke = sw || 3;
  var r2 = (size - stroke) / 2;
  var ci = 2 * Math.PI * r2;
  var off = ci - (v / 100) * ci;
  var c = clr || rc(v, T);
  return (
    <svg width={size} height={size} style={{ transform:"rotate(-90deg)", flexShrink:0 }}>
      <circle cx={size/2} cy={size/2} r={r2} fill="none" stroke={c+"15"} strokeWidth={stroke} />
      <circle cx={size/2} cy={size/2} r={r2} fill="none" stroke={c} strokeWidth={stroke} strokeDasharray={ci} strokeDashoffset={off} strokeLinecap="round" />
    </svg>
  );
}
