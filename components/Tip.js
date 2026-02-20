"use client";
import { useState } from "react";
import { useT } from "@/lib/theme";

/* Inline tooltip — hover ? or i icon to reveal explanatory text.
   Usage: <Tip text="Explanation here" />
          <Tip text="Explanation" icon="i" />  */
export default function Tip(p) {
  var T = useT();
  var _h = useState(false); var show = _h[0]; var setShow = _h[1];
  var icon = p.icon || "?";
  var sz = p.sz || 14;

  return (
    <span style={{ position:"relative", display:"inline-flex", alignItems:"center", marginLeft:p.ml !== undefined ? p.ml : 4 }}
      onMouseEnter={function(){ setShow(true); }}
      onMouseLeave={function(){ setShow(false); }}
    >
      <span style={{
        width:sz, height:sz, borderRadius:sz,
        display:"inline-flex", alignItems:"center", justifyContent:"center",
        fontSize: sz * 0.65, fontWeight:600, lineHeight:1,
        color: T.td, background: T.sa, border:"1px solid "+T.bd,
        cursor:"help", userSelect:"none", flexShrink:0,
        fontStyle: icon === "i" ? "italic" : "normal",
        fontFamily: icon === "i" ? "Georgia,serif" : "inherit"
      }}>{icon}</span>
      {show && (
        <span style={{
          position:"absolute", bottom:"calc(100% + 8px)", left:"50%", transform:"translateX(-50%)",
          padding:"8px 12px", borderRadius:8, fontSize:11, lineHeight:1.45, fontWeight:400,
          color:"#fff", background:"#1c253f", whiteSpace:"normal", width:"max-content",
          maxWidth:240, zIndex:50, pointerEvents:"none",
          boxShadow:"0 4px 12px rgba(0,0,0,0.15)",
          fontStyle:"normal", textTransform:"none", letterSpacing:0
        }}>
          {p.text}
          <span style={{
            position:"absolute", top:"100%", left:"50%", transform:"translateX(-50%)",
            width:0, height:0,
            borderLeft:"5px solid transparent", borderRight:"5px solid transparent",
            borderTop:"5px solid #1c253f"
          }}/>
        </span>
      )}
    </span>
  );
}
