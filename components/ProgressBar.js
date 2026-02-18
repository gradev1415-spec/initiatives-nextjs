"use client";
import { useT } from "@/lib/theme";
import { rc } from "@/lib/utils";

export default function ProgressBar({ v, mx, h, c }) {
  var T = useT();
  var raw = (v / (mx || 100)) * 100;
  var isOver = raw > 100;
  var pct = Math.min(raw, 100);
  var color = c || rc(raw, T);
  var barH = h || 6;

  if (isOver) {
    /* Overflow visual: full bar in base color, then a layered accent segment */
    var overPct = Math.min((raw - 100) / 100 * 100, 100); /* how far into the overflow */
    return (
      <div style={{ width: "100%", height: barH, borderRadius: 6, background: color + "15", overflow: "hidden", position: "relative" }}>
        <div style={{ width: "100%", height: "100%", borderRadius: 6, background: color, opacity: 0.35 }} />
        <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", borderRadius: 6, background: "linear-gradient(90deg, " + color + ", " + color + "CC)", boxShadow: "0 0 6px " + color + "40" }} />
      </div>
    );
  }

  return (
    <div style={{ width: "100%", height: barH, borderRadius: 6, background: color + "15", overflow: "hidden" }}>
      <div style={{ width: pct + "%", height: "100%", borderRadius: 6, background: color }} />
    </div>
  );
}
