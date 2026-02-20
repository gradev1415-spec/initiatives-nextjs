"use client";
import { useState } from "react";
import { useT } from "@/lib/theme";
import { fmt, fD, rc, cc2, forEachRole } from "@/lib/utils";
import { allRoles, wRd, iRd, staffRd, skillRd, certRd, hasSkillData, hasCertData, portfolioRoles, portfolioCoverage, portfolioPriorities } from "@/lib/readiness";
import Badge from "./Badge";
import ProgressBar from "./ProgressBar";
import MiniGauge from "./MiniGauge";
import KPICard from "./KPICard";
import Tip from "./Tip";
import TabBar from "./TabBar";
import HeatmapView from "./HeatmapView";
import PortfolioView from "./PortfolioView";

/* ─── Period options for trend analysis ─── */
var PERIODS = [
  { key: "1Q", label: "Last quarter", n: 1 },
  { key: "2Q", label: "Last 2 quarters", n: 2 },
  { key: "YTD", label: "Year to date", n: 4 },
  { key: "ALL", label: "All time", n: 999 }
];

/* ─── Slice history to selected period window ─── */
function sliceHist(hist, periodN) {
  if (!hist || hist.length === 0) return [];
  /* Keep last (periodN + 1) entries so we have a baseline + window */
  var keep = Math.min(hist.length, periodN + 1);
  return hist.slice(hist.length - keep);
}

/* ─── Compute initiative signal: what should the ICP pay attention to? ─── */
function iniSignal(it, periodN) {
  var crd = iRd(it);
  var mr = it.rev * (1 - crd / 100);
  var tgp = 0, trq = 0, tql = 0;
  forEachRole(it.depts, function(r) { trq += r.rq; tgp += r.gp; tql += r.ql; });
  var hSk = hasSkillData(it), hCt = hasCertData(it);
  var sR = staffRd(allRoles(it)), skR = hSk ? skillRd(it) : null, cR = hCt ? certRd(it) : null;
  /* Trajectory from history — scoped to selected period */
  var hist = sliceHist(it.hist, periodN);
  var delta = 0, trend = "stable";
  if (hist.length >= 2) {
    delta = hist[hist.length - 1].rd - hist[0].rd;
    trend = delta > 3 ? "up" : delta < -3 ? "down" : "stable";
  }
  var hPts = hist.map(function(h) { return h.rd; });
  var hLabels = hist.map(function(h) { return h.q; });
  /* Urgency score: combines risk exposure, gap severity, and low readiness */
  var urgency = 0;
  if (crd < 40) urgency += 3;
  else if (crd < 60) urgency += 2;
  else if (crd < 85) urgency += 1;
  if (mr > 20000000) urgency += 2;
  else if (mr > 5000000) urgency += 1;
  if (tgp > 15) urgency += 2;
  else if (tgp > 5) urgency += 1;
  if (trend === "down") urgency += 1;
  /* Weakest pillar */
  var weakest = null, weakestV = 999;
  if (sR < weakestV) { weakest = "Staff"; weakestV = sR; }
  if (skR !== null && skR < weakestV) { weakest = "Capability"; weakestV = skR; }
  if (cR !== null && cR < weakestV) { weakest = "Compliance"; weakestV = cR; }
  var isProj = it.st === "projection";
  /* Action signal — the single most impactful next step */
  var action = null, actionType = null;
  if (crd >= 100) {
    action = "Fully ready"; actionType = "ok";
  } else if (tgp > 0 && weakest === "Staff") {
    action = "Hire " + tgp + " to unblock readiness"; actionType = "hire";
  } else if (weakest === "Compliance") {
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
  return { crd: crd, mr: mr, tgp: tgp, trq: trq, tql: tql, sR: sR, skR: skR, cR: cR, hSk: hSk, hCt: hCt, delta: delta, trend: trend, urgency: urgency, weakest: weakest, weakestV: weakestV, fillPct: trq > 0 ? Math.round(tql / trq * 100) : 0, hPts: hPts, hLabels: hLabels, action: action, actionType: actionType };
}

/* ─── Action signal icon — tiny inline SVG per action type ─── */
function ActionIcon(p) {
  var clr = p.color || "currentColor";
  var s = 12;
  /* hire = person+, train = graduation cap, cert = shield, review = magnifier, ok = check */
  if (p.type === "hire") return <svg width={s} height={s} viewBox="0 0 16 16" fill="none"><circle cx="6" cy="5" r="3" stroke={clr} strokeWidth="1.5"/><path d="M1 14c0-2.8 2.2-5 5-5s5 2.2 5 5" stroke={clr} strokeWidth="1.5" strokeLinecap="round"/><path d="M13 4v4M11 6h4" stroke={clr} strokeWidth="1.5" strokeLinecap="round"/></svg>;
  if (p.type === "train") return <svg width={s} height={s} viewBox="0 0 16 16" fill="none"><path d="M8 2L1 6l7 4 7-4-7-4z" stroke={clr} strokeWidth="1.3" strokeLinejoin="round"/><path d="M3 8v4c0 1 2.2 2 5 2s5-1 5-2V8" stroke={clr} strokeWidth="1.3"/></svg>;
  if (p.type === "cert") return <svg width={s} height={s} viewBox="0 0 16 16" fill="none"><path d="M8 1L2 4v4c0 3.3 2.5 5.5 6 7 3.5-1.5 6-3.7 6-7V4L8 1z" stroke={clr} strokeWidth="1.3" strokeLinejoin="round"/><path d="M6 8l2 2 3-4" stroke={clr} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>;
  if (p.type === "ok") return <svg width={s} height={s} viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke={clr} strokeWidth="1.3"/><path d="M5 8l2.5 2.5L11 6" stroke={clr} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>;
  /* review / default */
  return <svg width={s} height={s} viewBox="0 0 16 16" fill="none"><circle cx="7" cy="7" r="4.5" stroke={clr} strokeWidth="1.3"/><path d="M10.5 10.5L14 14" stroke={clr} strokeWidth="1.3" strokeLinecap="round"/></svg>;
}

/* ─── Action signal color by type ─── */
function actionClr(type, T) {
  if (type === "ok") return T.gn;
  if (type === "hire") return T.ac;
  if (type === "train") return T.am;
  if (type === "cert") return T.rd;
  return T.tm;
}

export default function OverviewPage(p){
  var T=useT();var ini=p.ini;
  var trr=0;
  ini.forEach(function(it){trr+=iRd(it);});
  var ar=ini.length?Math.round(trr/ini.length):0;

  /* Portfolio aggregates */
  var pR=portfolioRoles(ini);
  var pC=portfolioCoverage(ini);
  var pP=portfolioPriorities(ini);
  /* Total risk across all initiatives */
  var totalRisk=0;
  ini.forEach(function(it){var c=iRd(it);totalRisk+=it.rev*(1-c/100);});
  /* Count by status band */
  var critical=0,atRisk=0,onTrack=0;
  ini.forEach(function(it){var c=iRd(it);if(c<40)critical++;else if(c<85)atRisk++;else onTrack++;});

  var fState=useState("All");var fl=fState[0],sF=fState[1];
  var vState=useState("cards");var vw=vState[0],sVw=vState[1];

  var fd=ini;
  if(fl==="Operational") fd=ini.filter(function(x){return x.tp==="Operational";});
  if(fl==="Administrative") fd=ini.filter(function(x){return x.tp==="Administrative";});
  if(fl==="Projections") fd=ini.filter(function(x){return x.st==="projection";});

  /* Pre-compute signals for all filtered initiatives, sort by urgency */
  var signals=fd.map(function(it){return {it:it,s:iniSignal(it,999)};});
  var sorted=signals.slice().sort(function(a,b){return b.s.urgency-a.s.urgency||a.s.crd-b.s.crd;});

  return (
    <div style={{padding:"32px 32px",maxWidth:1400,margin:"0 auto"}}>
      {/* ═══ HEADER ═══ */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:48}}>
        <div>
          <h1 style={{fontSize:24,fontWeight:700,marginBottom:4}}>Initiatives</h1>
          <p style={{color:T.tm,fontSize:13}}>Workforce readiness across all locations</p>
        </div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          <button onClick={p.onReport} style={{padding:"10px 24px",borderRadius:10,border:"1px solid "+T.bd,cursor:"pointer",background:T.cd,color:T.tx,fontSize:13,fontWeight:500,fontFamily:"inherit"}}>Export PDF</button>
          <button onClick={p.onCreate} style={{padding:"10px 24px",borderRadius:10,border:"none",cursor:"pointer",background:T.ac,color:"#FFFFFF",fontSize:13,fontWeight:600,fontFamily:"inherit"}}>+ Create Initiative</button>
        </div>
      </div>

      {/* ═══ COMMAND CENTER: Portfolio Pulse ═══ */}
      <div style={{display:"grid",gridTemplateColumns:"1.4fr 1fr 1fr 1fr 1fr",gap:1,marginBottom:52,borderRadius:14,overflow:"hidden",border:"1px solid "+T.bd,background:T.bd}}>
        {/* Hero readiness */}
        <div style={{background:T.cd,padding:"20px 24px",display:"flex",alignItems:"center",gap:16}}>
          <div>
            <div style={{fontSize:9,color:T.td,textTransform:"uppercase",letterSpacing:0.5,marginBottom:4}}>Portfolio Readiness<Tip text="Weighted average readiness across all initiatives, combining staffing, capability, and compliance." icon="i" sz={12}/></div>
            <div style={{display:"flex",alignItems:"baseline",gap:4}}>
              <span style={{fontSize:36,fontWeight:700,lineHeight:1,color:rc(ar,T)}}>{ar}</span>
              <span style={{fontSize:16,fontWeight:500,color:rc(ar,T)}}>%</span>
            </div>
            <div style={{display:"flex",gap:6,marginTop:6}}>
              <span style={{fontSize:10,padding:"2px 8px",borderRadius:4,background:T.rdd,color:T.rd,fontWeight:600}}>{critical} critical</span>
              <span style={{fontSize:10,padding:"2px 8px",borderRadius:4,background:T.amd,color:T.am,fontWeight:600}}>{atRisk} at risk</span>
              <span style={{fontSize:10,padding:"2px 8px",borderRadius:4,background:T.gd,color:T.gn,fontWeight:600}}>{onTrack} on track</span>
            </div>
          </div>
        </div>
        {/* Risk exposure */}
        <div style={{background:T.cd,padding:"20px 24px"}}>
          <div style={{fontSize:9,color:T.td,textTransform:"uppercase",letterSpacing:0.5,marginBottom:4}}>Risk Exposure<Tip text="Total revenue at risk across all initiatives due to readiness gaps." icon="i" sz={12}/></div>
          <div style={{fontSize:24,fontWeight:700,color:T.tx,lineHeight:1}}>{fD(totalRisk)}</div>
          <div style={{fontSize:11,color:T.tm,marginTop:6}}>{ini.length} initiatives tracked</div>
        </div>
        {/* Workforce fill */}
        <div style={{background:T.cd,padding:"20px 24px"}}>
          <div style={{fontSize:9,color:T.td,textTransform:"uppercase",letterSpacing:0.5,marginBottom:4}}>Workforce Fill<Tip text="Total qualified employees vs. required positions across all initiatives." icon="i" sz={12}/></div>
          <div style={{display:"flex",alignItems:"baseline",gap:4}}>
            <span style={{fontSize:24,fontWeight:700,lineHeight:1,color:T.tx}}>{pR.filled}</span>
            <span style={{fontSize:14,color:T.td}}>/ {pR.required}</span>
          </div>
          <div style={{marginTop:6}}>
            <ProgressBar v={pR.required>0?Math.round(pR.filled/pR.required*100):0} h={4} c={T.ac}/>
            <div style={{fontSize:10,color:T.tm,marginTop:3}}>{pR.required>0?Math.round(pR.filled/pR.required*100):0}% staffed</div>
          </div>
        </div>
        {/* Capability coverage */}
        <div style={{background:T.cd,padding:"20px 24px"}}>
          <div style={{fontSize:9,color:T.td,textTransform:"uppercase",letterSpacing:0.5,marginBottom:4}}>Skills Covered<Tip text="Skill and certificate requirement slots filled by qualified staff." icon="i" sz={12}/></div>
          <div style={{display:"flex",alignItems:"baseline",gap:4}}>
            <span style={{fontSize:24,fontWeight:700,lineHeight:1,color:T.tx}}>{pC.total>0?pC.covered:"\u2014"}</span>
            {pC.total>0&&<span style={{fontSize:14,color:T.td}}>/ {pC.total}</span>}
          </div>
          <div style={{marginTop:6}}>
            {pC.total>0?<div><ProgressBar v={Math.round(pC.covered/pC.total*100)} h={4} c={T.ac}/><div style={{fontSize:10,color:T.tm,marginTop:3}}>{Math.round(pC.covered/pC.total*100)}% capability</div></div>:<div style={{fontSize:10,color:T.tm}}>Define requirements to track</div>}
          </div>
        </div>
        {/* Urgent priorities */}
        <div style={{background:T.cd,padding:"20px 24px"}}>
          <div style={{fontSize:9,color:T.td,textTransform:"uppercase",letterSpacing:0.5,marginBottom:4}}>Urgent Priorities<Tip text="Essential or Critical skill and certificate gaps requiring immediate attention." icon="i" sz={12}/></div>
          <div style={{fontSize:24,fontWeight:700,lineHeight:1,color:T.tx}}>{pP}</div>
          <div style={{fontSize:11,color:T.tm,marginTop:6}}>{pP>0?"Essential gaps to close":"All critical gaps resolved"}</div>
        </div>
      </div>

      {/* ═══ FILTERS + VIEW SWITCH ═══ */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20,gap:12,flexWrap:"wrap"}}>
        <TabBar tabs={["All","Operational","Administrative","Projections"]} a={fl} on={sF}/>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          <TabBar tabs={["cards","ranking","heatmap","portfolio"]} a={vw} on={sVw}/>
          <span style={{fontSize:11,color:T.td}}>{fd.length} items</span>
        </div>
      </div>

      {/* ═══ CARDS VIEW — Signal-Ranked Initiative Cards ═══ */}
      {vw==="cards" && (
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(360px,1fr))",gap:14}}>
          {sorted.map(function(entry){
            var it=entry.it,s=entry.s;
            /* Build meta string */
            var meta=[];
            meta.push(it.depts.length+(it.depts.length===1?" location":" locations"));
            var sd2=it.sd&&it.sd!=="TBD",td2=it.td&&it.td!=="TBD";
            if(sd2&&td2) meta.push(it.sd+" \u2013 "+it.td);
            else if(td2) meta.push("Target "+it.td);
            else if(sd2) meta.push("Start "+it.sd);
            return (
              <div key={it.id} onClick={function(){p.onOpen(it);}} style={{borderRadius:14,border:"1px solid "+T.bd,background:T.cd,cursor:"pointer",position:"relative",overflow:"hidden",transition:"box-shadow 0.15s ease, border-color 0.15s ease"}}
                onMouseEnter={function(e){e.currentTarget.style.boxShadow="0 4px 16px "+T.sh;e.currentTarget.style.borderColor=rc(s.crd,T)+"40";}}
                onMouseLeave={function(e){e.currentTarget.style.boxShadow="none";e.currentTarget.style.borderColor=T.bd;}}>
                {/* Status accent bar */}
                <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:rc(s.crd,T)}}/>
                {/* Main content */}
                <div style={{padding:"18px 20px 14px"}}>
                  {/* Row 1: Title + Status badge */}
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8,marginBottom:8}}>
                    <div style={{flex:1,minWidth:0}}>
                      <h3 style={{fontSize:15,fontWeight:600,margin:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{it.nm}</h3>
                      <div style={{fontSize:11,color:T.td,marginTop:2}}>{meta.join(" \u00b7 ")}</div>
                    </div>
                    <div style={{display:"flex",gap:4,flexShrink:0}}>
                      {it.tp&&<Badge c={T.tm} b={T.sa}>{it.tp}</Badge>}
                      {it.st==="projection"&&<Badge c={T.pu} b={T.pd}>Projection</Badge>}
                    </div>
                  </div>
                  {/* Row 2: Hero readiness + delta chip + action signal */}
                  <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                    <div style={{fontSize:32,fontWeight:700,lineHeight:1,color:rc(s.crd,T)}}>{s.crd}<span style={{fontSize:14,fontWeight:500}}>%</span></div>
                    {/* Action signal — pushed right */}
                    <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:5,padding:"4px 10px",borderRadius:6,background:actionClr(s.actionType,T)+"10"}}>
                      <ActionIcon type={s.actionType} color={actionClr(s.actionType,T)}/>
                      <span style={{fontSize:11,fontWeight:500,color:actionClr(s.actionType,T),whiteSpace:"nowrap"}}>{s.action}</span>
                    </div>
                  </div>
                  {/* Row 3: Progress bar */}
                  <ProgressBar v={s.crd} h={5}/>
                  {/* Row 4: Pillar breakdown — inline */}
                  <div style={{display:"flex",alignItems:"center",gap:0,marginTop:12}}>
                    {[{l:"Staff",v:s.sR,on:true},{l:"Capability",v:s.skR,on:s.hSk},{l:"Compliance",v:s.cR,on:s.hCt}].map(function(m,mi){
                      var isWeakest=s.weakest===m.l&&m.on;
                      return (
                        <div key={m.l} style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:4,borderLeft:mi>0?"1px solid "+T.bd:undefined,padding:"0 8px"}}>
                          <span style={{fontSize:9,color:isWeakest?rc(m.v,T):T.td,textTransform:"uppercase",letterSpacing:0.3,fontWeight:isWeakest?600:400}}>{m.l}</span>
                          {m.on?<span style={{fontSize:13,fontWeight:600,color:rc(m.v,T)}}>{m.v}%</span>:<span style={{fontSize:10,color:T.td,fontStyle:"italic"}}>{"\u2014"}</span>}
                        </div>
                      );
                    })}
                  </div>
                </div>
                {/* Footer strip — operational metrics */}
                <div style={{display:"flex",alignItems:"center",padding:"8px 20px",borderTop:"1px solid "+T.bd,background:T.sa}}>
                  <div style={{flex:1,display:"flex",alignItems:"center",gap:4}}>
                    <span style={{fontSize:9,color:T.td,textTransform:"uppercase",letterSpacing:0.3}}>Risk</span>
                    <span style={{fontSize:12,fontWeight:600,color:T.am}}>{fD(s.mr)}</span>
                  </div>
                  <div style={{width:1,height:12,background:T.bd}}/>
                  <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:4}}>
                    <span style={{fontSize:9,color:T.td,textTransform:"uppercase",letterSpacing:0.3}}>Gaps</span>
                    <span style={{fontSize:12,fontWeight:600,color:s.tgp>0?T.rd:T.gn}}>{s.tgp>0?s.tgp:"None"}</span>
                  </div>
                  <div style={{width:1,height:12,background:T.bd}}/>
                  <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"flex-end",gap:4}}>
                    <span style={{fontSize:9,color:T.td,textTransform:"uppercase",letterSpacing:0.3}}>Filled</span>
                    <span style={{fontSize:12,fontWeight:600,color:rc(s.fillPct,T)}}>{s.tql}/{s.trq}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ═══ RANKING VIEW ═══ */}
      {vw==="ranking" && (
        <div style={{borderRadius:14,border:"1px solid "+T.bd,overflow:"hidden"}}>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead><tr style={{borderBottom:"1px solid "+T.bd}}>
              {[{h:"#"},{h:"Initiative"},{h:"Readiness",t:"Combined score from staffing, capability, and compliance."},{h:"Next Action",t:"The single most impactful next step for this initiative."},{h:"Staff"},{h:"Capability"},{h:"Compliance"},{h:"Risk (DKK)",t:"Revenue at risk due to readiness gaps."},{h:"Gaps",t:"Unfilled positions across all locations."}].map(function(c){return <th key={c.h} style={{padding:"10px 12px",fontSize:10,color:T.td,textTransform:"uppercase",textAlign:"left"}}>{c.h}{c.t&&<Tip text={c.t} sz={12}/>}</th>;})}
            </tr></thead>
            <tbody>{sorted.map(function(entry,idx){
              var it=entry.it,s=entry.s;
              return (
                <tr key={it.id} onClick={function(){p.onOpen(it);}} style={{borderBottom:"1px solid "+T.bd+"40",cursor:"pointer"}}>
                  <td style={{padding:"10px 12px",fontSize:12,color:T.td}}>{idx+1}</td>
                  <td style={{padding:"10px 12px"}}><span style={{fontSize:13,fontWeight:500}}>{it.nm}</span>{it.st==="projection"&&<span style={{fontSize:10,color:T.pu,marginLeft:6}}>Proj.</span>}</td>
                  <td style={{padding:"10px 12px"}}><div style={{display:"flex",alignItems:"center",gap:6}}><div style={{width:60}}><ProgressBar v={s.crd} h={4}/></div><span style={{fontSize:12,color:rc(s.crd,T),fontWeight:600}}>{s.crd}%</span></div></td>
                  <td style={{padding:"10px 12px"}}><div style={{display:"inline-flex",alignItems:"center",gap:4}}><ActionIcon type={s.actionType} color={actionClr(s.actionType,T)}/><span style={{fontSize:11,color:actionClr(s.actionType,T),fontWeight:500}}>{s.action}</span></div></td>
                  <td style={{padding:"10px 12px",fontSize:12,color:rc(s.sR,T)}}>{s.sR}%</td>
                  <td style={{padding:"10px 12px",fontSize:12,color:s.skR!==null?rc(s.skR,T):T.td}}>{s.skR!==null?s.skR+"%":"-"}</td>
                  <td style={{padding:"10px 12px",fontSize:12,color:s.cR!==null?rc(s.cR,T):T.td}}>{s.cR!==null?s.cR+"%":"-"}</td>
                  <td style={{padding:"10px 12px",fontSize:12,color:T.am,fontWeight:500}}>{fD(s.mr)}</td>
                  <td style={{padding:"10px 12px",fontSize:12,color:s.tgp>0?T.rd:T.gn}}>{s.tgp>0?s.tgp:"-"}</td>
                </tr>
              );
            })}</tbody>
          </table>
        </div>
      )}

      {/* HEATMAP VIEW */}
      {vw==="heatmap" && <HeatmapView ini={fd}/>}

      {/* PORTFOLIO VIEW */}
      {vw==="portfolio" && <PortfolioView ini={fd}/>}
    </div>
  );
}

/* â•â•â• HEATMAP COMPONENT â•â•â• */
