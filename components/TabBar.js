"use client";
import { useT } from "@/lib/theme";
import useIsMobile from "@/lib/useIsMobile";

export default function TabBar({ tabs, a, on }) {
  var T = useT();
  var mob = useIsMobile();
  return (
    <div className="tabbar-scroll" style={{ display:"flex", gap:2, background:T.sa, borderRadius:10, padding:3, flexWrap:mob?"nowrap":"wrap", overflowX:mob?"auto":"visible", scrollbarWidth:"none", msOverflowStyle:"none" }}>
      {tabs.map(function(t) {
        return (
          <button key={t} onClick={function() { on(t); }} style={{ padding:"8px 14px", borderRadius:8, border:"none", cursor:"pointer", fontSize:12, fontWeight:a===t?600:400, fontFamily:"inherit", background:a===t?T.sf:"transparent", color:a===t?T.tx:T.tm, whiteSpace:"nowrap", flexShrink:0 }}>
            {t}
          </button>
        );
      })}
    </div>
  );
}
