"use client";
import { useT } from "@/lib/theme";

export default function Overlay({ x, children }) {
  var T = useT();
  return (
    <div onClick={x} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", zIndex:200, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
      <div onClick={function(e) { e.stopPropagation(); }} style={{ background:T.sf, border:"1px solid "+T.bd, borderRadius:16, padding:"20px 16px", minWidth:0, maxWidth:560, width:"100%", maxHeight:"80vh", overflow:"auto" }}>
        {children}
      </div>
    </div>
  );
}
