"use client";
import { useT } from "@/lib/theme";

export default function TabBar({ tabs, a, on }) {
  var T = useT();
  return (
    <div style={{ display:"flex", gap:2, background:T.sa, borderRadius:10, padding:3, flexWrap:"wrap" }}>
      {tabs.map(function(t) {
        return (
          <button key={t} onClick={function() { on(t); }} style={{ padding:"8px 14px", borderRadius:8, border:"none", cursor:"pointer", fontSize:12, fontWeight:a===t?600:400, fontFamily:"inherit", background:a===t?T.sf:"transparent", color:a===t?T.tx:T.tm, whiteSpace:"nowrap" }}>
            {t}
          </button>
        );
      })}
    </div>
  );
}
