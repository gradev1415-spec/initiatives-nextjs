"use client";
import { fD, forEachRole } from "@/lib/utils";
import { allRoles, staffRd, skillRd, certRd, iRd, hasSkillData, hasCertData, portfolioRoles, portfolioCoverage, portfolioPriorities } from "@/lib/readiness";

/* ─── Compute initiative signal (mirrors OverviewPage) ─── */
function iniSignal(it) {
  var crd = iRd(it);
  var mr = it.rev * (1 - crd / 100);
  var tgp = 0, trq = 0, tql = 0;
  forEachRole(it.depts, function(r) { trq += r.rq; tgp += r.gp; tql += r.ql; });
  var hSk = hasSkillData(it), hCt = hasCertData(it);
  var sR = staffRd(allRoles(it)), skR = hSk ? skillRd(it) : null, cR = hCt ? certRd(it) : null;
  var weakest = null, weakestV = 999;
  if (sR < weakestV) { weakest = "Staff"; weakestV = sR; }
  if (skR !== null && skR < weakestV) { weakest = "Capability"; weakestV = skR; }
  if (cR !== null && cR < weakestV) { weakest = "Compliance"; weakestV = cR; }
  /* Action signal */
  var action = null, actionType = null;
  if (crd >= 100) { action = "Fully ready"; actionType = "ok"; }
  else if (tgp > 0 && weakest === "Staff") { action = "Hire " + tgp + " to unblock readiness"; actionType = "hire"; }
  else if (weakest === "Compliance") {
    var exp30 = 0;
    (it.certs || []).forEach(function(c) { exp30 += (c.exp30 || 0) + (c.expired || 0); });
    if (exp30 > 0) { action = exp30 + " cert" + (exp30 !== 1 ? "s" : "") + " expiring or expired"; actionType = "cert"; }
    else { action = "Close compliance gaps"; actionType = "cert"; }
  } else if (weakest === "Capability" && tgp === 0) {
    action = "Train existing staff on skill gaps"; actionType = "train";
  } else if (tgp > 0) {
    action = "Fill " + tgp + " position" + (tgp !== 1 ? "s" : "") + " to improve readiness"; actionType = "hire";
  } else {
    action = "Review skill and cert requirements"; actionType = "review";
  }
  /* Urgency */
  var urgency = 0;
  if (crd < 40) urgency += 3; else if (crd < 60) urgency += 2; else if (crd < 85) urgency += 1;
  if (mr > 20000000) urgency += 2; else if (mr > 5000000) urgency += 1;
  if (tgp > 15) urgency += 2; else if (tgp > 5) urgency += 1;
  return { crd: crd, mr: mr, tgp: tgp, trq: trq, tql: tql, sR: sR, skR: skR, cR: cR, hSk: hSk, hCt: hCt, urgency: urgency, weakest: weakest, weakestV: weakestV, fillPct: trq > 0 ? Math.round(tql / trq * 100) : 0, action: action, actionType: actionType };
}

/* ─── Readiness band color (print-safe, always light theme) ─── */
function rdClr(v) { return v >= 85 ? "#34B77A" : v >= 60 ? "#D4A017" : "#E07A6E"; }

/* ─── Action color by type ─── */
function actClr(type) {
  if (type === "ok") return "#34B77A";
  if (type === "hire") return "#73A6FF";
  if (type === "train") return "#D4A017";
  if (type === "cert") return "#E07A6E";
  return "#797C91";
}

export default function ReportPage(p){
  var ini=p.ini;
  var tv=0,opp2=0,trr=0,totalGaps=0,topSG={},topCG={};
  ini.forEach(function(it){
    var rd2=iRd(it);tv+=it.rev;opp2+=it.rev*(1-rd2/100);trr+=rd2;
    forEachRole(it.depts,function(r){totalGaps+=r.gp;});
    it.sg.forEach(function(g){if(g.s!=="All skills"&&g.s!=="Gaps detected")topSG[g.s]=(topSG[g.s]||0)+g.n;});
    it.cg.forEach(function(g){if(g.c!=="All certs"&&g.c!=="Cert gaps")topCG[g.c]=(topCG[g.c]||0)+g.n;});
  });
  var ar2=ini.length?Math.round(trr/ini.length):0;
  var activeC=ini.filter(function(x){return x.st==="active";}).length;
  var projC=ini.filter(function(x){return x.st==="projection";}).length;
  var sgArr=Object.keys(topSG).map(function(k){return{s:k,n:topSG[k]};}).sort(function(a,b){return b.n-a.n;});
  var cgArr=Object.keys(topCG).map(function(k){return{c:k,n:topCG[k]};}).sort(function(a,b){return b.n-a.n;});

  /* Portfolio aggregates — matching OverviewPage */
  var pR=portfolioRoles(ini);
  var pC=portfolioCoverage(ini);
  var pP=portfolioPriorities(ini);
  var critical=0,atRisk=0,onTrack=0;
  ini.forEach(function(it){var c=iRd(it);if(c<40)critical++;else if(c<85)atRisk++;else onTrack++;});

  /* Compute signals for all initiatives, sort by urgency */
  var signals=ini.map(function(it){return{it:it,s:iniSignal(it)};});
  var sorted=signals.slice().sort(function(a,b){return b.s.urgency-a.s.urgency||a.s.crd-b.s.crd;});

  var today=new Date();
  var months=["January","February","March","April","May","June","July","August","September","October","November","December"];
  var dateStr=months[today.getMonth()]+" "+today.getDate()+", "+today.getFullYear();

  /* Print CSS — A4 landscape, preserve backgrounds, centered */
  var printCSS="@media print { * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; color-adjust: exact !important; } .report-no-print { display: none !important; } .report-root { background: white !important; padding: 0 !important; } .report-page { box-shadow: none !important; margin: 0 auto !important; page-break-after: always; } .report-page:last-child { page-break-after: auto; } @page { size: A4; margin: 12mm 16mm; } body > div > div:first-child { display: none !important; } }";

  /* ─── Shared print-safe colors ─── */
  var C = {
    bg: "#FFFFFF",
    card: "#F8F8FB",
    navy: "#03024E",
    border: "#D8D8D8",
    muted: "#686868",
    sub: "#A0A0A0",
    blue: "#73A6FF",
    green: "#6BAC54",
    red: "#DD614D",
    amber: "#E4A24E",
    lightBg: "#EAF1FF",
    purpleBg: "#F3EEFF",
    purple: "#7C3AED"
  };

  function Bar(bp){var w2=Math.min(bp.v,100);return(
    <div style={{display:"flex",alignItems:"center",gap:6}}>
      <div style={{width:bp.w||50,height:5,borderRadius:3,background:C.border,overflow:"hidden"}}>
        <div style={{width:w2+"%",height:"100%",borderRadius:3,background:rdClr(bp.v)}}/>
      </div>
      <span style={{fontWeight:600,fontSize:11,color:rdClr(bp.v)}}>{bp.v}%</span>
    </div>
  );}

  var takeaway=ar2>=85?"Portfolio is in strong shape. Focus on maintaining standards and preparing projections."
    :ar2>=60?"Portfolio needs targeted attention. Prioritize high-risk initiatives and close critical skill gaps."
    :"Portfolio has significant readiness gaps. Immediate action needed on hiring, training, and certification.";

  return (
    <div className="report-root" style={{background:"#F3F3F5",minHeight:"100vh",padding:"24px 32px"}}>
      <style>{printCSS}</style>

      <div className="report-no-print" style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20,maxWidth:1100,margin:"0 auto 20px"}}>
        <button onClick={p.onBack} style={{padding:"8px 20px",borderRadius:6,border:"1px solid "+C.border,background:"white",color:C.muted,cursor:"pointer",fontSize:13,fontFamily:"inherit"}}>Back to Initiatives</button>
        <div style={{display:"flex",gap:8}}>
          <span style={{fontSize:12,color:C.sub,lineHeight:"36px"}}>Use Ctrl+P / Cmd+P to save as PDF</span>
          <button onClick={function(){window.print();}} style={{padding:"8px 24px",borderRadius:6,border:"none",background:C.navy,color:"white",cursor:"pointer",fontSize:13,fontWeight:600,fontFamily:"inherit"}}>Print / Save PDF</button>
        </div>
      </div>

      {/* ═══ PAGE 1: COVER ═══ */}
      <div className="report-page" style={{maxWidth:1100,margin:"0 auto 24px",background:C.navy,color:"white",borderRadius:8,padding:"56px 60px",minHeight:400,position:"relative"}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:56}}>
          <svg width="36" height="36" viewBox="0 0 1000 1000" style={{borderRadius:8,flexShrink:0}}><rect fill="rgba(255,255,255,0.1)" width="1000" height="1000" rx="140"/><path fill="#FAD461" d="M414.7,522.5l-190.3,26.8c-9.6,1.5-16.2,10.1-14.6,19.7l13.1,92.9c1,8.6,8.6,15.1,17.2,15.1c1,0,1.5,0,2.5,0l533.1-74.7c9.6-1.5,16.2-10.1,14.6-19.7l-13.1-92.9c-1-8.6-8.6-15.1-17.2-15.1c-1,0-1.5,0-2.5,0l-120.7,16.7c-39.4,28.8-87.8,45.9-140.3,45.9C467.7,537.1,440.4,532.1,414.7,522.5z"/><path fill="#fff" d="M608,662.3l-232.2,32.3C314.2,738,271.8,807.2,265.8,887c-1,10.1,7.1,19.2,17.7,19.2h95.9c8.6,0,16.2-6.6,17.2-15.1c7.6-63.1,61.6-112.6,126.7-112.6S642.4,827.9,649.9,891c1,8.6,8.6,15.1,17.2,15.1H763c10.1,0,18.2-9.1,17.7-19.2C773.6,782.5,702.9,695.1,608,662.3z"/><path fill="#66DDB5" d="M496.5,502.3c112.6,0,204.5-91.4,204.5-204S609.6,93.9,496.5,93.9C383.9,93.9,292,185.2,292,298.3C292.5,410.9,383.9,502.3,496.5,502.3z M496.5,218.5c43.9,0,79.8,35.8,79.8,79.8s-35.8,79.8-79.8,79.8c-43.9,0-79.8-35.8-79.8-79.8C417.2,254.4,452.5,218.5,496.5,218.5z"/></svg>
          <span style={{fontSize:18,fontWeight:600}}>Learningbank</span>
        </div>
        <h1 style={{fontSize:40,fontWeight:700,lineHeight:1.1,marginBottom:6}}>Workforce Readiness</h1>
        <h1 style={{fontSize:40,fontWeight:700,lineHeight:1.1,color:C.blue,marginBottom:24}}>Portfolio Report</h1>
        <p style={{fontSize:16,color:C.sub,marginBottom:40}}>Executive Summary &nbsp;|&nbsp; POWER</p>
        <p style={{fontSize:12,color:C.sub}}>{dateStr}</p>

        <div style={{position:"absolute",right:60,top:"50%",transform:"translateY(-50%)",background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:8,padding:"24px 28px",minWidth:200}}>
          <h4 style={{fontSize:10,color:C.border,textTransform:"uppercase",letterSpacing:1,marginBottom:16,paddingBottom:8,borderBottom:"1px solid rgba(255,255,255,0.15)"}}>Portfolio Snapshot</h4>
          <div style={{marginBottom:14}}><div style={{fontSize:10,color:C.sub,marginBottom:2}}>Portfolio Readiness</div><div style={{fontSize:28,fontWeight:800,color:rdClr(ar2)}}>{ar2}%</div></div>
          <div style={{marginBottom:10}}><div style={{fontSize:10,color:C.sub,marginBottom:1}}>Initiatives</div><div style={{fontSize:18,fontWeight:700,color:"#FFFFFF"}}>{ini.length}<span style={{fontSize:11,fontWeight:400,color:C.sub,marginLeft:6}}>{activeC} active, {projC} projected</span></div></div>
          <div style={{marginBottom:10}}><div style={{fontSize:10,color:C.sub,marginBottom:1}}>Value at Stake</div><div style={{fontSize:18,fontWeight:700}}>{fD(tv)}</div></div>
          <div style={{marginBottom:10}}><div style={{fontSize:10,color:C.sub,marginBottom:1}}>Opportunity Cost</div><div style={{fontSize:18,fontWeight:700,color:C.blue}}>{fD(opp2)}</div></div>
          <div><div style={{fontSize:10,color:C.sub,marginBottom:1}}>Staffing Gaps</div><div style={{fontSize:18,fontWeight:700,color:C.red}}>{totalGaps} positions</div></div>
        </div>

        <p style={{position:"absolute",bottom:40,left:60,fontSize:10,color:C.muted}}>CONFIDENTIAL - For internal use only</p>
      </div>

      {/* ═══ PAGE 2: PORTFOLIO OVERVIEW — matches OverviewPage layout ═══ */}
      <div className="report-page" style={{maxWidth:1100,margin:"0 auto 24px",background:"white",borderRadius:8,padding:"48px 56px",boxShadow:"0 1px 3px rgba(0,0,0,0.03)"}}>
        {/* Header — like OverviewPage header */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:32}}>
          <div>
            <h2 style={{fontSize:22,fontWeight:700,color:C.navy,marginBottom:2}}>Initiatives</h2>
            <p style={{fontSize:12,color:C.muted}}>Workforce readiness across all locations</p>
          </div>
          <span style={{fontSize:11,color:C.sub}}>{dateStr}</span>
        </div>

        {/* ═══ KPI Bar — unified grid matching Portfolio Pulse ═══ */}
        <div style={{display:"grid",gridTemplateColumns:"1.4fr 1fr 1fr 1fr 1fr",gap:1,marginBottom:32,borderRadius:8,overflow:"hidden",border:"1px solid "+C.border,background:C.border}}>
          {/* Hero: Portfolio Readiness */}
          <div style={{background:C.card,padding:"18px 22px",display:"flex",alignItems:"center",gap:14}}>
            <div>
              <div style={{fontSize:9,color:C.muted,textTransform:"uppercase",letterSpacing:0.5,marginBottom:4}}>Portfolio Readiness</div>
              <div style={{display:"flex",alignItems:"baseline",gap:3}}>
                <span style={{fontSize:32,fontWeight:700,lineHeight:1,color:rdClr(ar2)}}>{ar2}</span>
                <span style={{fontSize:14,fontWeight:500,color:rdClr(ar2)}}>%</span>
              </div>
              <div style={{display:"flex",gap:5,marginTop:6}}>
                <span style={{fontSize:9,padding:"2px 7px",borderRadius:4,background:"#FDEAEA",color:C.red,fontWeight:600}}>{critical} critical</span>
                <span style={{fontSize:9,padding:"2px 7px",borderRadius:4,background:"#FFF8E1",color:C.amber,fontWeight:600}}>{atRisk} at risk</span>
                <span style={{fontSize:9,padding:"2px 7px",borderRadius:4,background:"#E8F8EF",color:C.green,fontWeight:600}}>{onTrack} on track</span>
              </div>
            </div>
          </div>
          {/* Risk Exposure */}
          <div style={{background:C.card,padding:"18px 22px"}}>
            <div style={{fontSize:9,color:C.muted,textTransform:"uppercase",letterSpacing:0.5,marginBottom:4}}>Risk Exposure</div>
            <div style={{fontSize:22,fontWeight:700,color:C.navy,lineHeight:1}}>{fD(opp2)}</div>
            <div style={{fontSize:10,color:C.muted,marginTop:6}}>{ini.length} initiatives tracked</div>
          </div>
          {/* Workforce Fill */}
          <div style={{background:C.card,padding:"18px 22px"}}>
            <div style={{fontSize:9,color:C.muted,textTransform:"uppercase",letterSpacing:0.5,marginBottom:4}}>Workforce Fill</div>
            <div style={{display:"flex",alignItems:"baseline",gap:3}}>
              <span style={{fontSize:22,fontWeight:700,lineHeight:1,color:C.navy}}>{pR.filled}</span>
              <span style={{fontSize:13,color:C.muted}}>/ {pR.required}</span>
            </div>
            <div style={{marginTop:6}}>
              <div style={{width:"100%",height:4,borderRadius:2,background:C.border,overflow:"hidden"}}>
                <div style={{width:Math.min(pR.required>0?Math.round(pR.filled/pR.required*100):0,100)+"%",height:"100%",borderRadius:2,background:C.blue}}/>
              </div>
              <div style={{fontSize:9,color:C.muted,marginTop:3}}>{pR.required>0?Math.round(pR.filled/pR.required*100):0}% staffed</div>
            </div>
          </div>
          {/* Skills Covered */}
          <div style={{background:C.card,padding:"18px 22px"}}>
            <div style={{fontSize:9,color:C.muted,textTransform:"uppercase",letterSpacing:0.5,marginBottom:4}}>Skills Covered</div>
            <div style={{display:"flex",alignItems:"baseline",gap:3}}>
              <span style={{fontSize:22,fontWeight:700,lineHeight:1,color:C.navy}}>{pC.total>0?pC.covered:"\u2014"}</span>
              {pC.total>0&&<span style={{fontSize:13,color:C.muted}}>/ {pC.total}</span>}
            </div>
            <div style={{marginTop:6}}>
              {pC.total>0?<div><div style={{width:"100%",height:4,borderRadius:2,background:C.border,overflow:"hidden"}}><div style={{width:Math.min(Math.round(pC.covered/pC.total*100),100)+"%",height:"100%",borderRadius:2,background:C.blue}}/></div><div style={{fontSize:9,color:C.muted,marginTop:3}}>{Math.round(pC.covered/pC.total*100)}% capability</div></div>:<div style={{fontSize:9,color:C.muted}}>Define requirements to track</div>}
            </div>
          </div>
          {/* Urgent Priorities */}
          <div style={{background:C.card,padding:"18px 22px"}}>
            <div style={{fontSize:9,color:C.muted,textTransform:"uppercase",letterSpacing:0.5,marginBottom:4}}>Urgent Priorities</div>
            <div style={{fontSize:22,fontWeight:700,lineHeight:1,color:C.navy}}>{pP}</div>
            <div style={{fontSize:10,color:C.muted,marginTop:6}}>{pP>0?"Essential gaps to close":"All critical gaps resolved"}</div>
          </div>
        </div>

        {/* ═══ Initiative Breakdown — matches ranking view ═══ */}
        <div style={{borderRadius:8,border:"1px solid "+C.border,overflow:"hidden"}}>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead><tr style={{borderBottom:"1px solid "+C.border}}>
              {["#","Initiative","Readiness","Next Action","Staff","Capability","Compliance","Risk (DKK)","Gaps"].map(function(h){return <th key={h} style={{padding:"10px 12px",fontSize:9,color:C.muted,textTransform:"uppercase",letterSpacing:0.5,fontWeight:700,textAlign:"left"}}>{h}</th>;})}
            </tr></thead>
            <tbody>
              {sorted.map(function(entry,idx){
                var it=entry.it,s=entry.s;
                return (
                  <tr key={it.id} style={{borderBottom:"1px solid "+C.border+"40"}}>
                    <td style={{padding:"10px 12px",fontSize:12,color:C.muted}}>{idx+1}</td>
                    <td style={{padding:"10px 12px"}}>
                      <span style={{fontSize:13,fontWeight:500,color:C.navy}}>{it.nm}</span>
                      {it.st==="projection"&&<span style={{fontSize:9,color:C.purple,marginLeft:6,fontWeight:500}}>Proj.</span>}
                      {it.tp&&<span style={{fontSize:9,color:C.muted,marginLeft:6}}>{it.tp}</span>}
                    </td>
                    <td style={{padding:"10px 12px"}}>
                      <div style={{display:"flex",alignItems:"center",gap:6}}>
                        <div style={{width:50,height:4,borderRadius:2,background:C.border,overflow:"hidden"}}>
                          <div style={{width:Math.min(s.crd,100)+"%",height:"100%",borderRadius:2,background:rdClr(s.crd)}}/>
                        </div>
                        <span style={{fontSize:12,color:rdClr(s.crd),fontWeight:600}}>{s.crd}%</span>
                      </div>
                    </td>
                    <td style={{padding:"10px 12px"}}>
                      <span style={{fontSize:11,color:actClr(s.actionType),fontWeight:500}}>{s.action}</span>
                    </td>
                    <td style={{padding:"10px 12px",fontSize:12,color:rdClr(s.sR),fontWeight:600}}>{s.sR}%</td>
                    <td style={{padding:"10px 12px",fontSize:12,color:s.skR!==null?rdClr(s.skR):C.muted,fontWeight:s.skR!==null?600:400}}>{s.skR!==null?s.skR+"%":"-"}</td>
                    <td style={{padding:"10px 12px",fontSize:12,color:s.cR!==null?rdClr(s.cR):C.muted,fontWeight:s.cR!==null?600:400}}>{s.cR!==null?s.cR+"%":"-"}</td>
                    <td style={{padding:"10px 12px",fontSize:12,color:C.amber,fontWeight:500}}>{fD(s.mr)}</td>
                    <td style={{padding:"10px 12px",fontSize:12,color:s.tgp>0?C.red:C.green,fontWeight:600}}>{s.tgp>0?s.tgp:"-"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div style={{fontSize:8,color:C.sub,paddingTop:12,borderTop:"1px solid "+C.border,display:"flex",justifyContent:"space-between",marginTop:24}}>
          <span>Learningbank | Workforce Readiness Report | POWER</span><span>Page 2</span>
        </div>
      </div>

      {/* ═══ PAGE 3: RISK & GAPS ═══ */}
      <div className="report-page" style={{maxWidth:1100,margin:"0 auto 24px",background:"white",borderRadius:8,padding:"48px 56px",boxShadow:"0 1px 3px rgba(0,0,0,0.03)"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
          <div>
            <h2 style={{fontSize:20,fontWeight:700,color:C.navy}}>Risk Analysis &amp; Systemic Gaps</h2>
            <p style={{fontSize:11,color:C.muted}}>Aggregated patterns across all initiatives</p>
          </div>
          <span style={{fontSize:11,color:C.sub}}>{dateStr}</span>
        </div>

        {/* Risk summary KPIs — unified bar like Portfolio Pulse */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:1,marginBottom:24,borderRadius:8,overflow:"hidden",border:"1px solid "+C.border,background:C.border}}>
          <div style={{background:C.lightBg,padding:"16px 20px"}}>
            <div style={{fontSize:9,color:C.navy,textTransform:"uppercase",letterSpacing:0.5,fontWeight:600}}>Total Opportunity Cost</div>
            <div style={{fontSize:22,fontWeight:700,color:C.blue,marginTop:4}}>{fD(opp2)}</div>
          </div>
          <div style={{background:"#FFF5F5",padding:"16px 20px"}}>
            <div style={{fontSize:9,color:"#991B1B",textTransform:"uppercase",letterSpacing:0.5,fontWeight:600}}>Total Staffing Gaps</div>
            <div style={{fontSize:22,fontWeight:700,color:C.red,marginTop:4}}>{totalGaps} positions</div>
          </div>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:20}}>
          <div style={{border:"1px solid "+C.border,borderRadius:8,overflow:"hidden"}}>
            <div style={{padding:"10px 14px",background:C.card,borderBottom:"1px solid "+C.border,fontWeight:700,fontSize:13,color:C.navy}}>Top Skill Gaps</div>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:12,color:C.navy}}>
              <thead><tr>
                <th style={{textAlign:"left",padding:"8px 12px",fontSize:9,textTransform:"uppercase",color:C.muted,fontWeight:700,letterSpacing:0.5,borderBottom:"2px solid "+C.border}}>Skill</th>
                <th style={{textAlign:"left",padding:"8px 12px",fontSize:9,textTransform:"uppercase",color:C.muted,fontWeight:700,letterSpacing:0.5,borderBottom:"2px solid "+C.border}}>Scope</th>
                <th style={{textAlign:"left",padding:"8px 12px",fontSize:9,textTransform:"uppercase",color:C.muted,fontWeight:700,letterSpacing:0.5,borderBottom:"2px solid "+C.border}}>Impact</th>
              </tr></thead>
              <tbody>
                {sgArr.length===0 && <tr><td colSpan={3} style={{padding:12,textAlign:"center",color:C.green,borderBottom:"1px solid "+C.border}}>No systemic skill gaps</td></tr>}
                {sgArr.slice(0,6).map(function(g,i){
                  var affected=ini.filter(function(it){return it.sg.find(function(x){return x.s===g.s;});}).length;
                  return <tr key={i}><td style={{padding:"8px 12px",borderBottom:"1px solid "+C.border,fontWeight:600,fontSize:12,color:C.navy}}>{i+1}. {g.s}</td><td style={{padding:"8px 12px",borderBottom:"1px solid "+C.border,fontSize:12,color:C.muted}}>{affected} initiatives</td><td style={{padding:"8px 12px",borderBottom:"1px solid "+C.border,color:C.red,fontWeight:700,fontSize:12}}>{g.n} people</td></tr>;
                })}
              </tbody>
            </table>
          </div>
          <div style={{border:"1px solid "+C.border,borderRadius:8,overflow:"hidden"}}>
            <div style={{padding:"10px 14px",background:C.card,borderBottom:"1px solid "+C.border,fontWeight:700,fontSize:13,color:C.navy}}>Top Certificate Gaps</div>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:12,color:C.navy}}>
              <thead><tr>
                <th style={{textAlign:"left",padding:"8px 12px",fontSize:9,textTransform:"uppercase",color:C.muted,fontWeight:700,letterSpacing:0.5,borderBottom:"2px solid "+C.border}}>Certificate</th>
                <th style={{textAlign:"left",padding:"8px 12px",fontSize:9,textTransform:"uppercase",color:C.muted,fontWeight:700,letterSpacing:0.5,borderBottom:"2px solid "+C.border}}>Scope</th>
                <th style={{textAlign:"left",padding:"8px 12px",fontSize:9,textTransform:"uppercase",color:C.muted,fontWeight:700,letterSpacing:0.5,borderBottom:"2px solid "+C.border}}>Impact</th>
              </tr></thead>
              <tbody>
                {cgArr.length===0 && <tr><td colSpan={3} style={{padding:12,textAlign:"center",color:C.green,borderBottom:"1px solid "+C.border}}>No systemic cert gaps</td></tr>}
                {cgArr.slice(0,6).map(function(g,i){
                  var affected=ini.filter(function(it){return it.cg.find(function(x){return x.c===g.c;});}).length;
                  return <tr key={i}><td style={{padding:"8px 12px",borderBottom:"1px solid "+C.border,fontWeight:600,fontSize:12,color:C.navy}}>{i+1}. {g.c}</td><td style={{padding:"8px 12px",borderBottom:"1px solid "+C.border,fontSize:12,color:C.muted}}>{affected} initiatives</td><td style={{padding:"8px 12px",borderBottom:"1px solid "+C.border,color:C.blue,fontWeight:700,fontSize:12}}>{g.n} people</td></tr>;
                })}
              </tbody>
            </table>
          </div>
        </div>

        <h3 style={{fontSize:13,fontWeight:700,marginBottom:10,color:C.navy}}>Initiatives by Risk (highest first)</h3>
        <div style={{borderRadius:8,border:"1px solid "+C.border,overflow:"hidden"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:12,color:C.navy}}>
            <thead><tr>
              <th style={{textAlign:"left",padding:"8px 12px",fontSize:9,textTransform:"uppercase",color:C.muted,fontWeight:700,letterSpacing:0.5,borderBottom:"2px solid "+C.border}}>Initiative</th>
              <th style={{textAlign:"left",padding:"8px 12px",fontSize:9,textTransform:"uppercase",color:C.muted,fontWeight:700,letterSpacing:0.5,borderBottom:"2px solid "+C.border}}>Readiness</th>
              <th style={{textAlign:"left",padding:"8px 12px",fontSize:9,textTransform:"uppercase",color:C.muted,fontWeight:700,letterSpacing:0.5,borderBottom:"2px solid "+C.border}}>At Risk</th>
              <th style={{textAlign:"left",padding:"8px 12px",fontSize:9,textTransform:"uppercase",color:C.muted,fontWeight:700,letterSpacing:0.5,borderBottom:"2px solid "+C.border}}>Total Value</th>
            </tr></thead>
            <tbody>
              {sorted.slice(0,5).map(function(entry,i){
                var it=entry.it,s=entry.s;
                return <tr key={it.id} style={{background:i%2===0?C.card:"white"}}><td style={{padding:"8px 12px",borderBottom:"1px solid "+C.border,fontWeight:700,fontSize:12,color:C.navy}}>{i+1}. {it.nm}</td><td style={{padding:"8px 12px",borderBottom:"1px solid "+C.border}}><Bar v={s.crd} w={60}/></td><td style={{padding:"8px 12px",borderBottom:"1px solid "+C.border,color:C.blue,fontWeight:700,fontSize:12}}>{fD(s.mr)} at risk</td><td style={{padding:"8px 12px",borderBottom:"1px solid "+C.border,color:C.muted,fontSize:12}}>of {fD(it.rev)}</td></tr>;
              })}
            </tbody>
          </table>
        </div>

        <div style={{fontSize:8,color:C.sub,paddingTop:12,borderTop:"1px solid "+C.border,display:"flex",justifyContent:"space-between",marginTop:24}}>
          <span>Learningbank | Workforce Readiness Report | POWER</span><span>Page 3</span>
        </div>
      </div>

      {/* ═══ PAGE 4: RECOMMENDATIONS ═══ */}
      <div className="report-page" style={{maxWidth:1100,margin:"0 auto 24px",background:"white",borderRadius:8,padding:"48px 56px",boxShadow:"0 1px 3px rgba(0,0,0,0.03)"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
          <div>
            <h2 style={{fontSize:20,fontWeight:700,color:C.navy}}>Strategic Recommendations</h2>
            <p style={{fontSize:12,color:C.muted}}>Priority actions to improve portfolio readiness</p>
          </div>
          <span style={{fontSize:12,color:C.muted}}>{dateStr}</span>
        </div>

        {totalGaps>0 && (
          <div style={{padding:"14px 18px",borderRadius:8,background:C.lightBg,marginBottom:10,border:"1px solid "+C.border}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}><span style={{fontWeight:700,fontSize:12,color:C.navy}}>HIRING <span style={{fontWeight:500,fontSize:9,padding:"2px 7px",borderRadius:6,background:C.navy+"12",marginLeft:4}}>High</span></span><span style={{fontSize:11,color:C.muted}}>{totalGaps} hires needed</span></div>
            <div style={{fontSize:12,color:C.navy}}>Recruit {totalGaps} positions across all initiatives to close staffing gaps</div>
          </div>
        )}
        {sgArr.length>0 && (
          <div style={{padding:"14px 18px",borderRadius:8,background:C.lightBg,marginBottom:10,border:"1px solid "+C.border}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}><span style={{fontWeight:700,fontSize:12,color:C.navy}}>TRAINING <span style={{fontWeight:500,fontSize:9,padding:"2px 7px",borderRadius:6,background:C.navy+"12",marginLeft:4}}>High</span></span><span style={{fontSize:11,color:C.muted}}>{sgArr.reduce(function(s,g){return s+g.n;},0)} people to train</span></div>
            <div style={{fontSize:12,color:C.navy}}>Address top skill gaps: {sgArr.slice(0,3).map(function(g){return g.s;}).join(", ")}</div>
          </div>
        )}
        {cgArr.length>0 && (
          <div style={{padding:"14px 18px",borderRadius:8,background:"#FFF5F5",marginBottom:10,border:"1px solid #FECACA"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}><span style={{fontWeight:700,fontSize:12,color:C.red}}>CERTIFICATION <span style={{fontWeight:500,fontSize:9,padding:"2px 7px",borderRadius:6,background:C.red+"12",marginLeft:4}}>Critical</span></span><span style={{fontSize:11,color:C.muted}}>{cgArr.reduce(function(s,g){return s+g.n;},0)} certifications needed</span></div>
            <div style={{fontSize:12,color:C.navy}}>Close certificate gaps: {cgArr.slice(0,3).map(function(g){return g.c;}).join(", ")}</div>
          </div>
        )}
        {projC>0 && (
          <div style={{padding:"14px 18px",borderRadius:8,background:C.purpleBg,marginBottom:10,border:"1px solid "+C.border}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}><span style={{fontWeight:700,fontSize:12,color:C.navy}}>PROJECTIONS <span style={{fontWeight:500,fontSize:9,padding:"2px 7px",borderRadius:6,background:C.navy+"12",marginLeft:4}}>Medium</span></span><span style={{fontSize:11,color:C.muted}}>{projC} new openings</span></div>
            <div style={{fontSize:12,color:C.navy}}>{projC} new location(s) in pipeline. Begin recruitment and training 6+ months before target.</div>
          </div>
        )}

        <div style={{padding:"18px 22px",borderRadius:8,background:C.navy,color:"white",marginTop:24}}>
          <h4 style={{color:C.blue,fontSize:12,marginBottom:4}}>Key Takeaway</h4>
          <p style={{fontSize:12,color:C.border}}>{takeaway}</p>
        </div>

        <div style={{fontSize:8,color:C.sub,paddingTop:12,borderTop:"1px solid "+C.border,display:"flex",justifyContent:"space-between",marginTop:24}}>
          <span>Learningbank | Workforce Readiness Report | POWER | {dateStr}</span><span>Confidential</span>
        </div>
      </div>
    </div>
  );
}
