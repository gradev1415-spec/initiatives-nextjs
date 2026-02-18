"use client";
import { useT } from "@/lib/theme";

export default function Badge({ c, b, children }) {
  var T = useT();
  return (
    <span style={{ display:"inline-flex", alignItems:"center", padding:"3px 10px", borderRadius:6, fontSize:11, fontWeight:600, color:c||T.tx, background:b||T.sa, whiteSpace:"nowrap" }}>
      {children}
    </span>
  );
}
