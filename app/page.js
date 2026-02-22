"use client";
import { useState, useEffect } from "react";
import { ThemeCtx, TH } from "@/lib/theme";
import { mkIni, mkDepts, mkCircles, mkJobProfiles, LAYOUT_TEMPLATES } from "@/lib/data";
import useIsMobile from "@/lib/useIsMobile";
import OverviewPage from "@/components/OverviewPage";
import DetailPage from "@/components/DetailPage";
import WizardPage from "@/components/WizardPage";
import ReportPage from "@/components/ReportPage";

function loadLT() {
  if (typeof window === "undefined") return LAYOUT_TEMPLATES;
  try { var s = localStorage.getItem("lb_lt"); if (s) return JSON.parse(s); } catch (e) {}
  return LAYOUT_TEMPLATES;
}

export default function App() {
  var _m = useState("light"); var mode = _m[0], sMode = _m[1];
  var _v = useState("overview"); var view = _v[0], sView = _v[1];
  var _si = useState(null); var selIni = _si[0], sSel = _si[1];
  var _t = useState(null); var toast = _t[0], sToast = _t[1];
  var _ini = useState(mkIni); var initiatives = _ini[0], sIni = _ini[1];
  var _dt = useState(mkDepts); var deptTree = _dt[0], sDT = _dt[1];
  var _cl = useState(mkCircles); var circles = _cl[0], sCL = _cl[1];
  var _jp = useState(mkJobProfiles); var jobProfiles = _jp[0], sJP = _jp[1];
  var _lt = useState(loadLT); var layoutTemplates = _lt[0], setLT = _lt[1];
  /* Persist layout templates (with role presets) to localStorage */
  useEffect(function() { try { localStorage.setItem("lb_lt", JSON.stringify(layoutTemplates)); } catch (e) {} }, [layoutTemplates]);
  var T = TH[mode];
  var mob = useIsMobile();

  function showToast(m) { sToast(m); setTimeout(function() { sToast(null); }, 3000); }
  function handleCreate(ni) { sIni(function(pr) { return [ni].concat(pr); }); sView("overview"); showToast(ni.nm + " created!"); }

  return (
    <ThemeCtx.Provider value={T}>
      <div style={{ minHeight:"100vh", background:T.bg, color:T.tx, fontFamily:"system-ui,sans-serif" }}>
        <div style={{ height:48, display:"flex", alignItems:"center", justifyContent:"space-between", padding:mob?"0 12px":"0 32px", borderBottom:"1px solid "+T.bd, background:T.sf }}>
          <div style={{ display:"flex", alignItems:"center", gap:mob?6:10 }}>
            {mode==="dark"
              ? <svg width="28" height="28" viewBox="0 0 1000 1000" style={{ borderRadius:7, flexShrink:0 }}><rect fill="#EEF4FC" width="1000" height="1000" rx="140"/><path fill="#03024E" d="M414.7,522.5l-190.3,26.8c-9.6,1.5-16.2,10.1-14.6,19.7l13.1,92.9c1,8.6,8.6,15.1,17.2,15.1c1,0,1.5,0,2.5,0l533.1-74.7c9.6-1.5,16.2-10.1,14.6-19.7l-13.1-92.9c-1-8.6-8.6-15.1-17.2-15.1c-1,0-1.5,0-2.5,0l-120.7,16.7c-39.4,28.8-87.8,45.9-140.3,45.9C467.7,537.1,440.4,532.1,414.7,522.5z"/><path fill="#03024E" d="M608,662.3l-232.2,32.3C314.2,738,271.8,807.2,265.8,887c-1,10.1,7.1,19.2,17.7,19.2h95.9c8.6,0,16.2-6.6,17.2-15.1c7.6-63.1,61.6-112.6,126.7-112.6S642.4,827.9,649.9,891c1,8.6,8.6,15.1,17.2,15.1H763c10.1,0,18.2-9.1,17.7-19.2C773.6,782.5,702.9,695.1,608,662.3z"/><path fill="#03024E" d="M496.5,502.3c112.6,0,204.5-91.4,204.5-204S609.6,93.9,496.5,93.9C383.9,93.9,292,185.2,292,298.3C292.5,410.9,383.9,502.3,496.5,502.3z M496.5,218.5c43.9,0,79.8,35.8,79.8,79.8s-35.8,79.8-79.8,79.8c-43.9,0-79.8-35.8-79.8-79.8C417.2,254.4,452.5,218.5,496.5,218.5z"/></svg>
              : <svg width="28" height="28" viewBox="0 0 1000 1000" style={{ borderRadius:7, flexShrink:0 }}><rect fill="transparent" width="1000" height="1000" rx="140"/><path fill="#FAD461" d="M414.7,522.5l-190.3,26.8c-9.6,1.5-16.2,10.1-14.6,19.7l13.1,92.9c1,8.6,8.6,15.1,17.2,15.1c1,0,1.5,0,2.5,0l533.1-74.7c9.6-1.5,16.2-10.1,14.6-19.7l-13.1-92.9c-1-8.6-8.6-15.1-17.2-15.1c-1,0-1.5,0-2.5,0l-120.7,16.7c-39.4,28.8-87.8,45.9-140.3,45.9C467.7,537.1,440.4,532.1,414.7,522.5z"/><path fill="#03024E" d="M608,662.3l-232.2,32.3C314.2,738,271.8,807.2,265.8,887c-1,10.1,7.1,19.2,17.7,19.2h95.9c8.6,0,16.2-6.6,17.2-15.1c7.6-63.1,61.6-112.6,126.7-112.6S642.4,827.9,649.9,891c1,8.6,8.6,15.1,17.2,15.1H763c10.1,0,18.2-9.1,17.7-19.2C773.6,782.5,702.9,695.1,608,662.3z"/><path fill="#66DDB5" d="M496.5,502.3c112.6,0,204.5-91.4,204.5-204S609.6,93.9,496.5,93.9C383.9,93.9,292,185.2,292,298.3C292.5,410.9,383.9,502.3,496.5,502.3z M496.5,218.5c43.9,0,79.8,35.8,79.8,79.8s-35.8,79.8-79.8,79.8c-43.9,0-79.8-35.8-79.8-79.8C417.2,254.4,452.5,218.5,496.5,218.5z"/></svg>
            }
            <span style={{ fontSize:mob?12:14, fontWeight:600 }}>Learningbank</span>
            {!mob&&<span style={{ fontSize:11, color:T.td, marginLeft:6 }}>/ Initiatives</span>}
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:mob?6:12 }}>
            <button onClick={function() { sMode(function(m) { return m === "dark" ? "light" : "dark"; }); }} style={{ padding:"5px 12px", borderRadius:16, border:"1px solid "+T.bd, background:T.sa, cursor:"pointer", color:T.tm, fontSize:11, fontFamily:"inherit" }}>
              {mode === "dark" ? "Light" : "Dark"}
            </button>
            {!mob&&<span style={{ fontSize:11, color:T.td }}>Jane Doe</span>}
            <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face" alt="User" style={{ width:28, height:28, borderRadius:14, objectFit:"cover", flexShrink:0 }} />
          </div>
        </div>

        {view === "overview" && <OverviewPage ini={initiatives} onOpen={function(i) { sSel(i); sView("detail"); }} onCreate={function() { sView("wizard"); }} onReport={function() { sView("report"); }} onToast={showToast} />}
        {view === "detail" && selIni && <DetailPage ini={selIni} onBack={function() { sSel(null); sView("overview"); }} onDelete={function(id) { sIni(function(pr) { return pr.filter(function(x) { return x.id !== id; }); }); sSel(null); sView("overview"); showToast("Deleted"); }} />}
        {view === "wizard" && <WizardPage onClose={function() { sView("overview"); }} onDone={handleCreate} deptTree={deptTree} setDT={sDT} circlesList={circles} setCL={sCL} jobProfilesList={jobProfiles} setJP={sJP} layoutTemplates={layoutTemplates} setLT={setLT} />}
        {view === "report" && <ReportPage ini={initiatives} onBack={function() { sView("overview"); }} />}

        {toast && <div style={{ position:"fixed", bottom:24, left:"50%", transform:"translateX(-50%)", padding:"10px 20px", borderRadius:10, background:T.gn, color:"#FFFFFF", fontSize:13, fontWeight:600, zIndex:100 }}>{toast}</div>}
      </div>
    </ThemeCtx.Provider>
  );
}
