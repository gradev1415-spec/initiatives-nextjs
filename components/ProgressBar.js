"use client";
import { useT } from "@/lib/theme";
import { rc } from "@/lib/utils";

export default function ProgressBar({ v, mx, h, c }) {
  var T = useT();
  var pct = Math.min((v / (mx || 100)) * 100, 100);
  var color = c || rc(pct, T);
  return (
    <div style={{ width:"100%", height:h||6, borderRadius:6, background:color+"15", overflow:"hidden" }}>
      <div style={{ width:pct+"%", height:"100%", borderRadius:6, background:color }} />
    </div>
  );
}
