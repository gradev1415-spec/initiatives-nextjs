"use client";
import { useT } from "@/lib/theme";

export default function KPICard({ l, v, c, sub }) {
  var T = useT();
  return (
    <div style={{ padding:"16px 20px", borderRadius:14, border:"1px solid "+T.bd, background:T.cd }}>
      <span style={{ fontSize:10, color:T.td, textTransform:"uppercase", letterSpacing:0.5 }}>{l}</span>
      <div style={{ fontSize:24, fontWeight:700, color:c||T.tx, marginTop:6 }}>{v}</div>
      {sub && <div style={{ fontSize:11, color:T.tm, marginTop:2 }}>{sub}</div>}
    </div>
  );
}
