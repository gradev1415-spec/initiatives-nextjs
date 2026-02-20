"use client";
import { useState } from "react";
import { useT } from "@/lib/theme";
import { fmt, fD, rc, cc2, cw, ic2, forEachRole } from "@/lib/utils";
import { allRoles, wRd, staffRd, skillRd, certRd, iRd, hasSkillData, hasCertData } from "@/lib/readiness";
import { genActions, matchContent } from "@/lib/actions";
import { LIBRARY } from "@/lib/data";
import Badge from "./Badge";
import ProgressBar from "./ProgressBar";
import Gauge from "./Gauge";
import MiniGauge from "./MiniGauge";
import TabBar from "./TabBar";
import KPICard from "./KPICard";

export default function ReportPage(p){
  var T=useT();var ini=p.ini;
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
  var sorted=ini.slice().sort(function(a,b){return(b.rev*(1-iRd(b)/100))-(a.rev*(1-iRd(a)/100));});

  var today=new Date();
  var months=["January","February","March","April","May","June","July","August","September","October","November","December"];
  var dateStr=months[today.getMonth()]+" "+today.getDate()+", "+today.getFullYear();

  function rdClr(v){return v>=85?"#34B77A":v>=60?"#73A6FF":"#E07A6E";}

  /* print CSS injected as style element — force background graphics preservation */
  var printCSS="@media print { * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; color-adjust: exact !important; } .report-no-print { display: none !important; } .report-root { background: white !important; padding: 0 !important; } .report-page { box-shadow: none !important; margin: 0 !important; border-radius: 0 !important; page-break-after: always; } .report-page:last-child { page-break-after: auto; } @page { size: A4 landscape; margin: 12mm 16mm; } body > div > div:first-child { display: none !important; } }";

  var S={
    root:{background:"#F3F3F5",minHeight:"100vh",padding:"24px 32px"},
    toolbar:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20,maxWidth:1000,margin:"0 auto 20px"},
    page:{maxWidth:1000,margin:"0 auto 24px",background:"white",borderRadius:12,padding:"48px 56px",boxShadow:"0 1px 3px rgba(0,0,0,0.03)"},
    cover:{background:"#1c253f",color:"white",borderRadius:12,padding:"56px 60px",minHeight:400,position:"relative",marginBottom:24,maxWidth:1000,margin:"0 auto 24px"},
    hdr:{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:20,paddingBottom:12,borderBottom:"2px solid #1c253f"},
    kpis:{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:24},
    kpi:{padding:"14px 16px",borderRadius:8,background:"#FAFAFA",border:"1px solid #E1E3E6"},
    tbl:{width:"100%",borderCollapse:"collapse",fontSize:12,color:"#1c253f"},
    th:{textAlign:"left",padding:"8px 12px",fontSize:9,textTransform:"uppercase",color:"#797C91",fontWeight:700,letterSpacing:0.5,borderBottom:"2px solid #E1E3E6"},
    td:{padding:"8px 12px",borderBottom:"1px solid #E1E3E6",fontSize:12,color:"#1c253f"},
    twoCol:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:20},
    panel:{border:"1px solid #E1E3E6",borderRadius:8,overflow:"hidden"},
    panelHdr:{padding:"10px 14px",background:"#F3F3F5",borderBottom:"1px solid #E1E3E6",fontWeight:700,fontSize:13,color:"#1c253f"},
    callout:{padding:"16px 20px",borderRadius:8,background:"#1c253f",color:"white",marginTop:24},
    foot:{fontSize:8,color:"#A0A3B0",paddingTop:12,borderTop:"1px solid #E1E3E6",display:"flex",justifyContent:"space-between",marginTop:24}
  };

  function Bar(bp){var w2=Math.min(bp.v,100);return(
    <div style={{display:"flex",alignItems:"center",gap:6}}>
      <div style={{width:bp.w||50,height:5,borderRadius:3,background:"#E1E3E6",overflow:"hidden"}}>
        <div style={{width:w2+"%",height:"100%",borderRadius:3,background:rdClr(bp.v)}}/>
      </div>
      <span style={{fontWeight:600,fontSize:11,color:rdClr(bp.v)}}>{bp.v}%</span>
    </div>
  );}

  function Pill(pp){return(
    <span style={{display:"inline-block",padding:"2px 8px",borderRadius:4,fontSize:9,fontWeight:600,color:"white",background:pp.c}}>{pp.children}</span>
  );}

  var takeaway=ar2>=85?"Portfolio is in strong shape. Focus on maintaining standards and preparing projections."
    :ar2>=60?"Portfolio needs targeted attention. Prioritize high-risk initiatives and close critical skill gaps."
    :"Portfolio has significant readiness gaps. Immediate action needed on hiring, training, and certification.";

  return (
    <div className="report-root" style={S.root}>
      <style>{printCSS}</style>

      <div className="report-no-print" style={S.toolbar}>
        <button onClick={p.onBack} style={{padding:"8px 20px",borderRadius:8,border:"1px solid #E1E3E6",background:"white",color:"#797C91",cursor:"pointer",fontSize:13,fontFamily:"inherit"}}>Back to Initiatives</button>
        <div style={{display:"flex",gap:8}}>
          <span style={{fontSize:12,color:"#A0A3B0",lineHeight:"36px"}}>Use Ctrl+P / Cmd+P to save as PDF</span>
          <button onClick={function(){window.print();}} style={{padding:"8px 24px",borderRadius:8,border:"none",background:"#1c253f",color:"white",cursor:"pointer",fontSize:13,fontWeight:600,fontFamily:"inherit"}}>Print / Save PDF</button>
        </div>
      </div>

      {/* PAGE 1: COVER */}
      <div className="report-page" style={S.cover}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:56}}>
          <svg width="36" height="36" viewBox="0 0 1000 1000" style={{borderRadius:8,flexShrink:0}}><rect fill="rgba(255,255,255,0.1)" width="1000" height="1000" rx="140"/><path fill="#FAD461" d="M414.7,522.5l-190.3,26.8c-9.6,1.5-16.2,10.1-14.6,19.7l13.1,92.9c1,8.6,8.6,15.1,17.2,15.1c1,0,1.5,0,2.5,0l533.1-74.7c9.6-1.5,16.2-10.1,14.6-19.7l-13.1-92.9c-1-8.6-8.6-15.1-17.2-15.1c-1,0-1.5,0-2.5,0l-120.7,16.7c-39.4,28.8-87.8,45.9-140.3,45.9C467.7,537.1,440.4,532.1,414.7,522.5z"/><path fill="#fff" d="M608,662.3l-232.2,32.3C314.2,738,271.8,807.2,265.8,887c-1,10.1,7.1,19.2,17.7,19.2h95.9c8.6,0,16.2-6.6,17.2-15.1c7.6-63.1,61.6-112.6,126.7-112.6S642.4,827.9,649.9,891c1,8.6,8.6,15.1,17.2,15.1H763c10.1,0,18.2-9.1,17.7-19.2C773.6,782.5,702.9,695.1,608,662.3z"/><path fill="#66DDB5" d="M496.5,502.3c112.6,0,204.5-91.4,204.5-204S609.6,93.9,496.5,93.9C383.9,93.9,292,185.2,292,298.3C292.5,410.9,383.9,502.3,496.5,502.3z M496.5,218.5c43.9,0,79.8,35.8,79.8,79.8s-35.8,79.8-79.8,79.8c-43.9,0-79.8-35.8-79.8-79.8C417.2,254.4,452.5,218.5,496.5,218.5z"/></svg>
          <span style={{fontSize:18,fontWeight:600}}>Learningbank</span>
        </div>
        <h1 style={{fontSize:40,fontWeight:700,lineHeight:1.1,marginBottom:6}}>Workforce Readiness</h1>
        <h1 style={{fontSize:40,fontWeight:700,lineHeight:1.1,color:"#73A6FF",marginBottom:24}}>Portfolio Report</h1>
        <p style={{fontSize:16,color:"#A0A3B0",marginBottom:40}}>Executive Summary &nbsp;|&nbsp; POWER</p>
        <p style={{fontSize:12,color:"#A0A3B0"}}>{dateStr}</p>

        <div style={{position:"absolute",right:60,top:"50%",transform:"translateY(-50%)",background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:12,padding:"24px 28px",minWidth:200}}>
          <h4 style={{fontSize:10,color:"#E1E3E6",textTransform:"uppercase",letterSpacing:1,marginBottom:16,paddingBottom:8,borderBottom:"1px solid rgba(255,255,255,0.15)"}}>Portfolio Snapshot</h4>
          <div style={{marginBottom:14}}><div style={{fontSize:10,color:"#A0A3B0",marginBottom:2}}>Portfolio Readiness</div><div style={{fontSize:28,fontWeight:800,color:rdClr(ar2)}}>{ar2}%</div></div>
          <div style={{marginBottom:10}}><div style={{fontSize:10,color:"#A0A3B0",marginBottom:1}}>Initiatives</div><div style={{fontSize:18,fontWeight:700,color:"#FFFFFF"}}>{ini.length}<span style={{fontSize:11,fontWeight:400,color:"#A0A3B0",marginLeft:6}}>{activeC} active, {projC} projected</span></div></div>
          <div style={{marginBottom:10}}><div style={{fontSize:10,color:"#A0A3B0",marginBottom:1}}>Value at Stake</div><div style={{fontSize:18,fontWeight:700}}>{fD(tv)}</div></div>
          <div style={{marginBottom:10}}><div style={{fontSize:10,color:"#A0A3B0",marginBottom:1}}>Opportunity Cost</div><div style={{fontSize:18,fontWeight:700,color:"#73A6FF"}}>{fD(opp2)}</div></div>
          <div><div style={{fontSize:10,color:"#A0A3B0",marginBottom:1}}>Staffing Gaps</div><div style={{fontSize:18,fontWeight:700,color:"#E07A6E"}}>{totalGaps} positions</div></div>
        </div>

        <p style={{position:"absolute",bottom:40,left:60,fontSize:10,color:"#797C91"}}>CONFIDENTIAL - For internal use only</p>
      </div>

      {/* PAGE 2: PORTFOLIO OVERVIEW */}
      <div className="report-page" style={S.page}>
        <div style={S.hdr}>
          <div><h2 style={{fontSize:20,fontWeight:700,color:"#1c253f"}}>Portfolio Overview</h2><p style={{fontSize:11,color:"#797C91"}}>All initiatives at a glance</p></div>
          <span style={{fontSize:11,color:"#A0A3B0"}}>{dateStr}</span>
        </div>

        <div style={S.kpis}>
          <div style={S.kpi}><div style={{fontSize:9,color:"#797C91",textTransform:"uppercase",letterSpacing:0.5,fontWeight:600}}>INITIATIVES</div><div style={{fontSize:22,fontWeight:700,color:"#1c253f",marginTop:4}}>{ini.length}</div><div style={{fontSize:10,color:"#797C91",marginTop:2}}>{activeC} active, {projC} projected</div></div>
          <div style={S.kpi}><div style={{fontSize:9,color:"#797C91",textTransform:"uppercase",letterSpacing:0.5,fontWeight:600}}>VALUE AT STAKE</div><div style={{fontSize:22,fontWeight:700,color:"#1c253f",marginTop:4}}>{fD(tv)}</div><div style={{fontSize:10,color:"#797C91",marginTop:2}}>Total revenue</div></div>
          <div style={S.kpi}><div style={{fontSize:9,color:"#797C91",textTransform:"uppercase",letterSpacing:0.5,fontWeight:600}}>OPPORTUNITY COST</div><div style={{fontSize:22,fontWeight:700,color:"#73A6FF",marginTop:4}}>{fD(opp2)}</div><div style={{fontSize:10,color:"#797C91",marginTop:2}}>Revenue at risk</div></div>
          <div style={S.kpi}><div style={{fontSize:9,color:"#797C91",textTransform:"uppercase",letterSpacing:0.5,fontWeight:600}}>AVG. READINESS</div><div style={{fontSize:22,fontWeight:700,color:rdClr(ar2),marginTop:4}}>{ar2}%</div><div style={{fontSize:10,color:"#797C91",marginTop:2}}>{ar2>=85?"Strong":ar2>=60?"Needs attention":"Critical"}</div></div>
        </div>

        <h3 style={{fontSize:13,fontWeight:700,marginBottom:10,color:"#1c253f"}}>Initiative Breakdown</h3>
        <table style={S.tbl}>
          <thead><tr>
            {["Initiative","Status","Staff","Skill","Cert","Overall","Risk (DKK)","Gaps","Value"].map(function(h){return <th key={h} style={S.th}>{h}</th>;})}
          </tr></thead>
          <tbody>
            {ini.map(function(it,idx){
              var rd2=iRd(it);var roles2=allRoles(it);var sR2=staffRd(roles2);
              var hSk2=hasSkillData(it),hCt2=hasCertData(it);
              var skR2=hSk2?skillRd(it):null;var cR2=hCt2?certRd(it):null;
              var mr2=it.rev*(1-rd2/100);var tgp=0;
              forEachRole(it.depts,function(r){tgp+=r.gp;});
              return (
                <tr key={it.id} style={{background:idx%2===0?"#FAFBFC":"white"}}>
                  <td style={{padding:"8px 12px",borderBottom:"1px solid #E1E3E6",fontWeight:700,fontSize:12,color:"#1c253f"}}>{it.nm}</td>
                  <td style={{padding:"8px 12px",borderBottom:"1px solid #E1E3E6"}}><Pill c={it.st==="projection"?"#7C3AED":"#34B77A"}>{it.st==="projection"?"Projection":"Active"}</Pill></td>
                  <td style={{padding:"8px 12px",borderBottom:"1px solid #E1E3E6",color:rdClr(sR2),fontWeight:700,fontSize:12}}>{sR2}%</td>
                  <td style={{padding:"8px 12px",borderBottom:"1px solid #E1E3E6",color:skR2!==null?rdClr(skR2):"#A0A3B0",fontWeight:700,fontSize:12}}>{skR2!==null?skR2+"%":"-"}</td>
                  <td style={{padding:"8px 12px",borderBottom:"1px solid #E1E3E6",color:cR2!==null?rdClr(cR2):"#A0A3B0",fontWeight:700,fontSize:12}}>{cR2!==null?cR2+"%":"-"}</td>
                  <td style={{padding:"8px 12px",borderBottom:"1px solid #E1E3E6"}}><Bar v={rd2}/></td>
                  <td style={{padding:"8px 12px",borderBottom:"1px solid #E1E3E6",color:"#73A6FF",fontWeight:600,fontSize:12}}>{fD(mr2)}</td>
                  <td style={{padding:"8px 12px",borderBottom:"1px solid #E1E3E6",color:tgp>0?"#E07A6E":"#34B77A",fontWeight:700,fontSize:12}}>{tgp>0?tgp:"-"}</td>
                  <td style={{padding:"8px 12px",borderBottom:"1px solid #E1E3E6",fontSize:12,color:"#1c253f",fontWeight:500}}>{fD(it.rev)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div style={S.foot}><span>Learningbank | Workforce Readiness Report | POWER</span><span>Page 2</span></div>
      </div>

      {/* PAGE 3: RISK & GAPS */}
      <div className="report-page" style={S.page}>
        <div style={S.hdr}>
          <div><h2 style={{fontSize:20,fontWeight:700,color:"#1c253f"}}>Risk Analysis &amp; Systemic Gaps</h2><p style={{fontSize:11,color:"#797C91"}}>Aggregated patterns across all initiatives</p></div>
          <span style={{fontSize:11,color:"#A0A3B0"}}>{dateStr}</span>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:24}}>
          <div style={{padding:"14px 16px",borderRadius:8,background:"#EEF4FC",border:"1px solid #BAD0FC"}}>
            <div style={{fontSize:9,color:"#1c253f",textTransform:"uppercase",letterSpacing:0.5,fontWeight:600}}>TOTAL OPPORTUNITY COST</div>
            <div style={{fontSize:22,fontWeight:700,color:"#73A6FF",marginTop:4}}>{fD(opp2)}</div>
          </div>
          <div style={{padding:"14px 16px",borderRadius:8,background:"#FFF5F5",border:"1px solid #FECACA"}}>
            <div style={{fontSize:9,color:"#991B1B",textTransform:"uppercase",letterSpacing:0.5,fontWeight:600}}>TOTAL STAFFING GAPS</div>
            <div style={{fontSize:22,fontWeight:700,color:"#E07A6E",marginTop:4}}>{totalGaps} positions</div>
          </div>
        </div>

        <div style={S.twoCol}>
          <div style={S.panel}>
            <div style={S.panelHdr}>Top Skill Gaps</div>
            <table style={S.tbl}>
              <thead><tr><th style={S.th}>Skill</th><th style={S.th}>Scope</th><th style={S.th}>Impact</th></tr></thead>
              <tbody>
                {sgArr.length===0 && <tr><td colSpan={3} style={{padding:12,textAlign:"center",color:"#34B77A",borderBottom:"1px solid #F3F3F5"}}>No systemic skill gaps</td></tr>}
                {sgArr.slice(0,6).map(function(g,i){
                  var affected=ini.filter(function(it){return it.sg.find(function(x){return x.s===g.s;});}).length;
                  return <tr key={i}><td style={{padding:"8px 12px",borderBottom:"1px solid #E1E3E6",fontWeight:600,fontSize:12,color:"#1c253f"}}>{i+1}. {g.s}</td><td style={{padding:"8px 12px",borderBottom:"1px solid #E1E3E6",fontSize:12,color:"#797C91"}}>{affected} initiatives</td><td style={{padding:"8px 12px",borderBottom:"1px solid #E1E3E6",color:"#E07A6E",fontWeight:700,fontSize:12}}>{g.n} people</td></tr>;
                })}
              </tbody>
            </table>
          </div>
          <div style={S.panel}>
            <div style={S.panelHdr}>Top Certificate Gaps</div>
            <table style={S.tbl}>
              <thead><tr><th style={S.th}>Certificate</th><th style={S.th}>Scope</th><th style={S.th}>Impact</th></tr></thead>
              <tbody>
                {cgArr.length===0 && <tr><td colSpan={3} style={{padding:12,textAlign:"center",color:"#34B77A",borderBottom:"1px solid #F3F3F5"}}>No systemic cert gaps</td></tr>}
                {cgArr.slice(0,6).map(function(g,i){
                  var affected=ini.filter(function(it){return it.cg.find(function(x){return x.c===g.c;});}).length;
                  return <tr key={i}><td style={{padding:"8px 12px",borderBottom:"1px solid #E1E3E6",fontWeight:600,fontSize:12,color:"#1c253f"}}>{i+1}. {g.c}</td><td style={{padding:"8px 12px",borderBottom:"1px solid #E1E3E6",fontSize:12,color:"#797C91"}}>{affected} initiatives</td><td style={{padding:"8px 12px",borderBottom:"1px solid #E1E3E6",color:"#73A6FF",fontWeight:700,fontSize:12}}>{g.n} people</td></tr>;
                })}
              </tbody>
            </table>
          </div>
        </div>

        <h3 style={{fontSize:13,fontWeight:700,marginBottom:10,color:"#1c253f"}}>Initiatives by Risk (highest first)</h3>
        <table style={S.tbl}>
          <thead><tr><th style={S.th}>Initiative</th><th style={S.th}>Readiness</th><th style={S.th}>At Risk</th><th style={S.th}>Total Value</th></tr></thead>
          <tbody>
            {sorted.slice(0,5).map(function(it,i){
              var rd2=iRd(it);var risk=it.rev*(1-rd2/100);
              return <tr key={it.id} style={{background:i%2===0?"#FAFBFC":"white"}}><td style={{padding:"8px 12px",borderBottom:"1px solid #E1E3E6",fontWeight:700,fontSize:12,color:"#1c253f"}}>{i+1}. {it.nm}</td><td style={{padding:"8px 12px",borderBottom:"1px solid #E1E3E6"}}><Bar v={rd2} w={60}/></td><td style={{padding:"8px 12px",borderBottom:"1px solid #E1E3E6",color:"#73A6FF",fontWeight:700,fontSize:12}}>{fD(risk)} at risk</td><td style={{padding:"8px 12px",borderBottom:"1px solid #E1E3E6",color:"#797C91",fontSize:12}}>of {fD(it.rev)}</td></tr>;
            })}
          </tbody>
        </table>

        <div style={S.foot}><span>Learningbank | Workforce Readiness Report | POWER</span><span>Page 3</span></div>
      </div>

      {/* PAGE 4: RECOMMENDATIONS */}
      <div className="report-page" style={S.page}>
        <div style={S.hdr}>
          <div><h2 style={{fontSize:20,fontWeight:700,color:"#1c253f"}}>Strategic Recommendations</h2><p style={{fontSize:12,color:"#797C91"}}>Priority actions to improve portfolio readiness</p></div>
          <span style={{fontSize:12,color:"#797C91"}}>{dateStr}</span>
        </div>

        {totalGaps>0 && (
          <div style={{padding:"12px 16px",borderRadius:8,background:"#EEF4FC",marginBottom:8}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}><span style={{fontWeight:700,fontSize:12,color:"#1c253f"}}>HIRING <span style={{fontWeight:500,fontSize:9,padding:"1px 6px",borderRadius:3,background:"#1c253f18",marginLeft:4}}>High</span></span><span style={{fontSize:11,color:"#797C91"}}>{totalGaps} hires needed</span></div>
            <div style={{fontSize:12,color:"#1c253f"}}>Recruit {totalGaps} positions across all initiatives to close staffing gaps</div>
          </div>
        )}
        {sgArr.length>0 && (
          <div style={{padding:"12px 16px",borderRadius:8,background:"#EEF4FC",marginBottom:8}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}><span style={{fontWeight:700,fontSize:12,color:"#1c253f"}}>TRAINING <span style={{fontWeight:500,fontSize:9,padding:"1px 6px",borderRadius:3,background:"#1c253f18",marginLeft:4}}>High</span></span><span style={{fontSize:11,color:"#797C91"}}>{sgArr.reduce(function(s,g){return s+g.n;},0)} people to train</span></div>
            <div style={{fontSize:12,color:"#1c253f"}}>Address top skill gaps: {sgArr.slice(0,3).map(function(g){return g.s;}).join(", ")}</div>
          </div>
        )}
        {cgArr.length>0 && (
          <div style={{padding:"12px 16px",borderRadius:8,background:"#FFF5F5",marginBottom:8}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}><span style={{fontWeight:700,fontSize:12,color:"#E07A6E"}}>CERTIFICATION <span style={{fontWeight:500,fontSize:9,padding:"1px 6px",borderRadius:3,background:"#E07A6E18",marginLeft:4}}>Critical</span></span><span style={{fontSize:11,color:"#797C91"}}>{cgArr.reduce(function(s,g){return s+g.n;},0)} certifications needed</span></div>
            <div style={{fontSize:12,color:"#1c253f"}}>Close certificate gaps: {cgArr.slice(0,3).map(function(g){return g.c;}).join(", ")}</div>
          </div>
        )}
        {projC>0 && (
          <div style={{padding:"12px 16px",borderRadius:8,background:"#F0F9FF",marginBottom:8}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}><span style={{fontWeight:700,fontSize:12,color:"#1c253f"}}>PROJECTIONS <span style={{fontWeight:500,fontSize:9,padding:"1px 6px",borderRadius:3,background:"#1c253f18",marginLeft:4}}>Medium</span></span><span style={{fontSize:11,color:"#797C91"}}>{projC} new openings</span></div>
            <div style={{fontSize:12,color:"#1c253f"}}>{projC} new location(s) in pipeline. Begin recruitment and training 6+ months before target.</div>
          </div>
        )}

        <div style={S.callout}>
          <h4 style={{color:"#73A6FF",fontSize:12,marginBottom:4}}>Key Takeaway</h4>
          <p style={{fontSize:12,color:"#E1E3E6"}}>{takeaway}</p>
        </div>

        <div style={S.foot}><span>Learningbank | Workforce Readiness Report | POWER | {dateStr}</span><span>Confidential</span></div>
      </div>
    </div>
  );
}

/* â•â•â• OVERVIEW PAGE â•â•â• */
/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
