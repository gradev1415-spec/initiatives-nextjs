"use client";
import { useT } from "@/lib/theme";
import useIsMobile from "@/lib/useIsMobile";

export default function TabBar({ tabs, a, on }) {
  var T = useT();
  var mob = useIsMobile();

  if (mob) {
    return (
      <select
        value={a}
        onChange={function(e) { on(e.target.value); }}
        style={{ padding:"8px 12px", borderRadius:8, border:"1px solid "+T.bd, background:T.sf, color:T.tx, fontSize:12, fontWeight:600, fontFamily:"inherit", cursor:"pointer", WebkitAppearance:"none", MozAppearance:"none", appearance:"none", backgroundImage:"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23888' fill='none' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E\")", backgroundRepeat:"no-repeat", backgroundPosition:"right 10px center", paddingRight:28 }}
      >
        {tabs.map(function(t) {
          return <option key={t} value={t}>{t}</option>;
        })}
      </select>
    );
  }

  return (
    <div className="tabbar-scroll" style={{ display:"flex", gap:2, background:T.sa, borderRadius:10, padding:3, flexWrap:"nowrap", overflowX:"auto", scrollbarWidth:"none", msOverflowStyle:"none" }}>
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
