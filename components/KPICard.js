"use client";
import { useT } from "@/lib/theme";
import Tip from "./Tip";

export default function KPICard({ l, v, v2, c, sub, tip }) {
  var T = useT();
  return (
    <div style={{ padding:"16px 20px", borderRadius:14, border:"1px solid "+T.bd, background:T.cd }}>
      <span style={{ fontSize:10, color:T.td, textTransform:"uppercase", letterSpacing:0.5 }}>{l}{tip && <Tip text={tip} icon="i" sz={13}/>}</span>
      <div style={{ marginTop:6 }}>
        <span style={{ fontSize:24, fontWeight:700, color:c||T.tx }}>{v}</span>
        {v2 && <span style={{ fontSize:16, fontWeight:400, color:T.td, marginLeft:2 }}>{v2}</span>}
      </div>
      {sub && <div style={{ fontSize:11, color:T.tm, marginTop:2 }}>{sub}</div>}
    </div>
  );
}
