"use client";
import { useState } from "react";
import { ThemeCtx, TH } from "@/lib/theme";
import { mkIni, mkDepts, mkCircles, mkJobProfiles, LAYOUT_TEMPLATES } from "@/lib/data";
import OverviewPage from "@/components/OverviewPage";
import DetailPage from "@/components/DetailPage";
import WizardPage from "@/components/WizardPage";
import ReportPage from "@/components/ReportPage";

export default function App() {
  var _m = useState("dark"); var mode = _m[0], sMode = _m[1];
  var _v = useState("overview"); var view = _v[0], sView = _v[1];
  var _si = useState(null); var selIni = _si[0], sSel = _si[1];
  var _t = useState(null); var toast = _t[0], sToast = _t[1];
  var _ini = useState(mkIni); var initiatives = _ini[0], sIni = _ini[1];
  var _dt = useState(mkDepts); var deptTree = _dt[0], sDT = _dt[1];
  var _cl = useState(mkCircles); var circles = _cl[0], sCL = _cl[1];
  var _jp = useState(mkJobProfiles); var jobProfiles = _jp[0], sJP = _jp[1];
  var _lt = useState(function() { return LAYOUT_TEMPLATES; }); var layoutTemplates = _lt[0], setLT = _lt[1];
  var T = TH[mode];

  function showToast(m) { sToast(m); setTimeout(function() { sToast(null); }, 3000); }
  function handleCreate(ni) { sIni(function(pr) { return [ni].concat(pr); }); sView("overview"); showToast(ni.nm + " created!"); }

  return (
    <ThemeCtx.Provider value={T}>
      <div style={{ minHeight:"100vh", background:T.bg, color:T.tx, fontFamily:"system-ui,sans-serif" }}>
        <div style={{ height:48, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 32px", borderBottom:"1px solid "+T.bd, background:T.sf }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:28, height:28, borderRadius:7, background:"linear-gradient(135deg,"+T.ac+",#06B6D4)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, fontWeight:800, color:"#0B0F1A" }}>L</div>
            <span style={{ fontSize:14, fontWeight:600 }}>Learningbank</span>
            <span style={{ fontSize:11, color:T.td, marginLeft:6 }}>/ Initiatives</span>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <button onClick={function() { sMode(function(m) { return m === "dark" ? "light" : "dark"; }); }} style={{ padding:"5px 12px", borderRadius:16, border:"1px solid "+T.bd, background:T.sa, cursor:"pointer", color:T.tm, fontSize:11, fontFamily:"inherit" }}>
              {mode === "dark" ? "Light" : "Dark"}
            </button>
            <span style={{ fontSize:11, color:T.td }}>McDonalds DK</span>
            <div style={{ width:28, height:28, borderRadius:14, background:T.ac, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, color:"#0B0F1A" }}>AD</div>
          </div>
        </div>

        {view === "overview" && <OverviewPage ini={initiatives} onOpen={function(i) { sSel(i); sView("detail"); }} onCreate={function() { sView("wizard"); }} onReport={function() { sView("report"); }} onToast={showToast} />}
        {view === "detail" && selIni && <DetailPage ini={selIni} onBack={function() { sSel(null); sView("overview"); }} onDelete={function(id) { sIni(function(pr) { return pr.filter(function(x) { return x.id !== id; }); }); sSel(null); sView("overview"); showToast("Deleted"); }} />}
        {view === "wizard" && <WizardPage onClose={function() { sView("overview"); }} onDone={handleCreate} deptTree={deptTree} setDT={sDT} circlesList={circles} setCL={sCL} jobProfilesList={jobProfiles} setJP={sJP} layoutTemplates={layoutTemplates} setLT={setLT} />}
        {view === "report" && <ReportPage ini={initiatives} onBack={function() { sView("overview"); }} />}

        {toast && <div style={{ position:"fixed", bottom:24, left:"50%", transform:"translateX(-50%)", padding:"10px 20px", borderRadius:10, background:T.gn, color:"#0B0F1A", fontSize:13, fontWeight:600, zIndex:100 }}>{toast}</div>}
      </div>
    </ThemeCtx.Provider>
  );
}
