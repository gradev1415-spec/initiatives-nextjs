"use client";
import { useState } from "react";
import { useT } from "@/lib/theme";
import { fmt, fD, rc, cc2, cw, ic2, forEachRole } from "@/lib/utils";
import { allRoles, wRd, staffRd, skillRd, certRd, iRd } from "@/lib/readiness";
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

  function rdClr(v){return v>=85?"#059669":v>=60?"#D97706":"#DC2626";}

  /* print CSS injected as style element */
  var printCSS="@media print { .report-no-print { display: none !important; } .report-root { background: white !important; padding: 0 !important; } .report-page { box-shadow: none !important; margin: 0 !important; border-radius: 0 !important; page-break-after: always; } .report-page:last-child { page-break-after: auto; } @page { size: A4 landscape; margin: 12mm 16mm; } body > div > div:first-child { display: none !important; } }";

  var S={
    root:{background:"#E2E8F0",minHeight:"100vh",padding:"24px 32px"},
    toolbar:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20,maxWidth:1000,margin:"0 auto 20px"},
    page:{maxWidth:1000,margin:"0 auto 24px",background:"white",borderRadius:12,padding:"48px 56px",boxShadow:"0 2px 12px rgba(0,0,0,0.06)"},
    cover:{background:"#0B0F1A",color:"white",borderRadius:12,padding:"56px 60px",minHeight:400,position:"relative",marginBottom:24,maxWidth:1000,margin:"0 auto 24px"},
    hdr:{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:20,paddingBottom:12,borderBottom:"2px solid #0891B2"},
    kpis:{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:24},
    kpi:{padding:"14px 16px",borderRadius:8,background:"#F8FAFC",border:"1px solid #E2E8F0"},
    tbl:{width:"100%",borderCollapse:"collapse",fontSize:12,color:"#0F172A"},
    th:{textAlign:"left",padding:"8px 12px",fontSize:9,textTransform:"uppercase",color:"#475569",fontWeight:700,letterSpacing:0.5,borderBottom:"2px solid #CBD5E1"},
    td:{padding:"8px 12px",borderBottom:"1px solid #E2E8F0",fontSize:12,color:"#1E293B"},
    twoCol:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:20},
    panel:{border:"1px solid #CBD5E1",borderRadius:8,overflow:"hidden"},
    panelHdr:{padding:"10px 14px",background:"#F1F5F9",borderBottom:"1px solid #CBD5E1",fontWeight:700,fontSize:13,color:"#0F172A"},
    callout:{padding:"16px 20px",borderRadius:8,background:"#0B0F1A",color:"white",marginTop:24},
    foot:{fontSize:8,color:"#94A3B8",paddingTop:12,borderTop:"1px solid #E2E8F0",display:"flex",justifyContent:"space-between",marginTop:24}
  };

  function Bar(bp){var w2=Math.min(bp.v,100);return(
    <div style={{display:"flex",alignItems:"center",gap:6}}>
      <div style={{width:bp.w||50,height:5,borderRadius:3,background:"#e5e7eb",overflow:"hidden"}}>
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
        <button onClick={p.onBack} style={{padding:"8px 20px",borderRadius:8,border:"1px solid #CBD5E1",background:"white",color:"#475569",cursor:"pointer",fontSize:13,fontFamily:"inherit"}}>Back to Initiatives</button>
        <div style={{display:"flex",gap:8}}>
          <span style={{fontSize:12,color:"#64748B",lineHeight:"36px"}}>Use Ctrl+P / Cmd+P to save as PDF</span>
          <button onClick={function(){window.print();}} style={{padding:"8px 24px",borderRadius:8,border:"none",background:"#0891B2",color:"white",cursor:"pointer",fontSize:13,fontWeight:600,fontFamily:"inherit"}}>Print / Save PDF</button>
        </div>
      </div>

      {/* PAGE 1: COVER */}
      <div className="report-page" style={S.cover}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:56}}>
          <div style={{width:36,height:36,borderRadius:8,background:"linear-gradient(135deg,#0891B2,#06B6D4)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,fontWeight:800,color:"#0B0F1A"}}>L</div>
          <span style={{fontSize:18,fontWeight:600}}>Learningbank</span>
        </div>
        <h1 style={{fontSize:40,fontWeight:700,lineHeight:1.1,marginBottom:6}}>Workforce Readiness</h1>
        <h1 style={{fontSize:40,fontWeight:700,lineHeight:1.1,color:"#0891B2",marginBottom:24}}>Portfolio Report</h1>
        <p style={{fontSize:16,color:"#94A3B8",marginBottom:40}}>Executive Summary &nbsp;|&nbsp; McDonald's Denmark</p>
        <p style={{fontSize:12,color:"#64748B"}}>{dateStr}</p>

        <div style={{position:"absolute",right:60,top:"50%",transform:"translateY(-50%)",background:"#111827",border:"1px solid #1E293B",borderRadius:12,padding:"24px 28px",minWidth:200}}>
          <h4 style={{fontSize:10,color:"#CBD5E1",textTransform:"uppercase",letterSpacing:1,marginBottom:16,paddingBottom:8,borderBottom:"1px solid #1E293B"}}>Portfolio Snapshot</h4>
          <div style={{marginBottom:14}}><div style={{fontSize:10,color:"#94A3B8",marginBottom:2}}>Portfolio Readiness</div><div style={{fontSize:28,fontWeight:800,color:rdClr(ar2)}}>{ar2}%</div></div>
          <div style={{marginBottom:10}}><div style={{fontSize:10,color:"#94A3B8",marginBottom:1}}>Initiatives</div><div style={{fontSize:18,fontWeight:700,color:"#0891B2"}}>{ini.length}<span style={{fontSize:11,fontWeight:400,color:"#94A3B8",marginLeft:6}}>{activeC} active, {projC} projected</span></div></div>
          <div style={{marginBottom:10}}><div style={{fontSize:10,color:"#94A3B8",marginBottom:1}}>Value at Stake</div><div style={{fontSize:18,fontWeight:700}}>{fD(tv)}</div></div>
          <div style={{marginBottom:10}}><div style={{fontSize:10,color:"#94A3B8",marginBottom:1}}>Opportunity Cost</div><div style={{fontSize:18,fontWeight:700,color:"#F59E0B"}}>{fD(opp2)}</div></div>
          <div><div style={{fontSize:10,color:"#94A3B8",marginBottom:1}}>Staffing Gaps</div><div style={{fontSize:18,fontWeight:700,color:"#F87171"}}>{totalGaps} positions</div></div>
        </div>

        <p style={{position:"absolute",bottom:40,left:60,fontSize:10,color:"#475569"}}>CONFIDENTIAL - For internal use only</p>
      </div>

      {/* PAGE 2: PORTFOLIO OVERVIEW */}
      <div className="report-page" style={S.page}>
        <div style={S.hdr}>
          <div><h2 style={{fontSize:20,fontWeight:700,color:"#0F172A"}}>Portfolio Overview</h2><p style={{fontSize:11,color:"#475569"}}>All initiatives at a glance</p></div>
          <span style={{fontSize:11,color:"#64748B"}}>{dateStr}</span>
        </div>

        <div style={S.kpis}>
          <div style={S.kpi}><div style={{fontSize:9,color:"#334155",textTransform:"uppercase",letterSpacing:0.5,fontWeight:600}}>INITIATIVES</div><div style={{fontSize:22,fontWeight:700,color:"#0891B2",marginTop:4}}>{ini.length}</div><div style={{fontSize:10,color:"#475569",marginTop:2}}>{activeC} active, {projC} projected</div></div>
          <div style={S.kpi}><div style={{fontSize:9,color:"#334155",textTransform:"uppercase",letterSpacing:0.5,fontWeight:600}}>VALUE AT STAKE</div><div style={{fontSize:22,fontWeight:700,color:"#0F172A",marginTop:4}}>{fD(tv)}</div><div style={{fontSize:10,color:"#475569",marginTop:2}}>Total revenue</div></div>
          <div style={S.kpi}><div style={{fontSize:9,color:"#334155",textTransform:"uppercase",letterSpacing:0.5,fontWeight:600}}>OPPORTUNITY COST</div><div style={{fontSize:22,fontWeight:700,color:"#B45309",marginTop:4}}>{fD(opp2)}</div><div style={{fontSize:10,color:"#475569",marginTop:2}}>Revenue at risk</div></div>
          <div style={S.kpi}><div style={{fontSize:9,color:"#334155",textTransform:"uppercase",letterSpacing:0.5,fontWeight:600}}>AVG. READINESS</div><div style={{fontSize:22,fontWeight:700,color:rdClr(ar2),marginTop:4}}>{ar2}%</div><div style={{fontSize:10,color:"#475569",marginTop:2}}>{ar2>=85?"Strong":ar2>=60?"Needs attention":"Critical"}</div></div>
        </div>

        <h3 style={{fontSize:13,fontWeight:700,marginBottom:10,color:"#0F172A"}}>Initiative Breakdown</h3>
        <table style={S.tbl}>
          <thead><tr>
            {["Initiative","Status","Staff","Skill","Cert","Overall","Risk (DKK)","Gaps","Value"].map(function(h){return <th key={h} style={S.th}>{h}</th>;})}
          </tr></thead>
          <tbody>
            {ini.map(function(it,idx){
              var rd2=iRd(it);var roles2=allRoles(it);var sR2=staffRd(roles2);
              var skR2=it._skillRd||Math.min(100,rd2+5);var cR2=it._certRd||Math.max(0,rd2-8);
              var mr2=it.rev*(1-rd2/100);var tgp=0;
              forEachRole(it.depts,function(r){tgp+=r.gp;});
              return (
                <tr key={it.id} style={{background:idx%2===0?"#FAFBFC":"white"}}>
                  <td style={{padding:"8px 12px",borderBottom:"1px solid #E2E8F0",fontWeight:700,fontSize:12,color:"#0F172A"}}>{it.nm}</td>
                  <td style={{padding:"8px 12px",borderBottom:"1px solid #E2E8F0"}}><Pill c={it.st==="projection"?"#7C3AED":"#059669"}>{it.st==="projection"?"Projection":"Active"}</Pill></td>
                  <td style={{padding:"8px 12px",borderBottom:"1px solid #E2E8F0",color:rdClr(sR2),fontWeight:700,fontSize:12}}>{sR2}%</td>
                  <td style={{padding:"8px 12px",borderBottom:"1px solid #E2E8F0",color:rdClr(skR2),fontWeight:700,fontSize:12}}>{skR2}%</td>
                  <td style={{padding:"8px 12px",borderBottom:"1px solid #E2E8F0",color:rdClr(cR2),fontWeight:700,fontSize:12}}>{cR2}%</td>
                  <td style={{padding:"8px 12px",borderBottom:"1px solid #E2E8F0"}}><Bar v={rd2}/></td>
                  <td style={{padding:"8px 12px",borderBottom:"1px solid #E2E8F0",color:"#B45309",fontWeight:600,fontSize:12}}>{fD(mr2)}</td>
                  <td style={{padding:"8px 12px",borderBottom:"1px solid #E2E8F0",color:tgp>0?"#DC2626":"#059669",fontWeight:700,fontSize:12}}>{tgp>0?tgp:"-"}</td>
                  <td style={{padding:"8px 12px",borderBottom:"1px solid #E2E8F0",fontSize:12,color:"#0F172A",fontWeight:500}}>{fD(it.rev)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div style={S.foot}><span>Learningbank | Workforce Readiness Report | McDonald's Denmark</span><span>Page 2</span></div>
      </div>

      {/* PAGE 3: RISK & GAPS */}
      <div className="report-page" style={S.page}>
        <div style={S.hdr}>
          <div><h2 style={{fontSize:20,fontWeight:700,color:"#0F172A"}}>Risk Analysis &amp; Systemic Gaps</h2><p style={{fontSize:11,color:"#475569"}}>Aggregated patterns across all initiatives</p></div>
          <span style={{fontSize:11,color:"#64748B"}}>{dateStr}</span>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:24}}>
          <div style={{padding:"14px 16px",borderRadius:8,background:"#FFFBEB",border:"1px solid #FDE68A"}}>
            <div style={{fontSize:9,color:"#92400E",textTransform:"uppercase",letterSpacing:0.5,fontWeight:600}}>TOTAL OPPORTUNITY COST</div>
            <div style={{fontSize:22,fontWeight:700,color:"#B45309",marginTop:4}}>{fD(opp2)}</div>
          </div>
          <div style={{padding:"14px 16px",borderRadius:8,background:"#FFF5F5",border:"1px solid #FECACA"}}>
            <div style={{fontSize:9,color:"#991B1B",textTransform:"uppercase",letterSpacing:0.5,fontWeight:600}}>TOTAL STAFFING GAPS</div>
            <div style={{fontSize:22,fontWeight:700,color:"#DC2626",marginTop:4}}>{totalGaps} positions</div>
          </div>
        </div>

        <div style={S.twoCol}>
          <div style={S.panel}>
            <div style={S.panelHdr}>Top Skill Gaps</div>
            <table style={S.tbl}>
              <thead><tr><th style={S.th}>Skill</th><th style={S.th}>Scope</th><th style={S.th}>Impact</th></tr></thead>
              <tbody>
                {sgArr.length===0 && <tr><td colSpan={3} style={{padding:12,textAlign:"center",color:"#059669",borderBottom:"1px solid #F1F5F9"}}>No systemic skill gaps</td></tr>}
                {sgArr.slice(0,6).map(function(g,i){
                  var affected=ini.filter(function(it){return it.sg.find(function(x){return x.s===g.s;});}).length;
                  return <tr key={i}><td style={{padding:"8px 12px",borderBottom:"1px solid #E2E8F0",fontWeight:600,fontSize:12,color:"#0F172A"}}>{i+1}. {g.s}</td><td style={{padding:"8px 12px",borderBottom:"1px solid #E2E8F0",fontSize:12,color:"#334155"}}>{affected} initiatives</td><td style={{padding:"8px 12px",borderBottom:"1px solid #E2E8F0",color:"#DC2626",fontWeight:700,fontSize:12}}>{g.n} people</td></tr>;
                })}
              </tbody>
            </table>
          </div>
          <div style={S.panel}>
            <div style={S.panelHdr}>Top Certificate Gaps</div>
            <table style={S.tbl}>
              <thead><tr><th style={S.th}>Certificate</th><th style={S.th}>Scope</th><th style={S.th}>Impact</th></tr></thead>
              <tbody>
                {cgArr.length===0 && <tr><td colSpan={3} style={{padding:12,textAlign:"center",color:"#059669",borderBottom:"1px solid #F1F5F9"}}>No systemic cert gaps</td></tr>}
                {cgArr.slice(0,6).map(function(g,i){
                  var affected=ini.filter(function(it){return it.cg.find(function(x){return x.c===g.c;});}).length;
                  return <tr key={i}><td style={{padding:"8px 12px",borderBottom:"1px solid #E2E8F0",fontWeight:600,fontSize:12,color:"#0F172A"}}>{i+1}. {g.c}</td><td style={{padding:"8px 12px",borderBottom:"1px solid #E2E8F0",fontSize:12,color:"#334155"}}>{affected} initiatives</td><td style={{padding:"8px 12px",borderBottom:"1px solid #E2E8F0",color:"#B45309",fontWeight:700,fontSize:12}}>{g.n} people</td></tr>;
                })}
              </tbody>
            </table>
          </div>
        </div>

        <h3 style={{fontSize:13,fontWeight:700,marginBottom:10,color:"#0F172A"}}>Initiatives by Risk (highest first)</h3>
        <table style={S.tbl}>
          <thead><tr><th style={S.th}>Initiative</th><th style={S.th}>Readiness</th><th style={S.th}>At Risk</th><th style={S.th}>Total Value</th></tr></thead>
          <tbody>
            {sorted.slice(0,5).map(function(it,i){
              var rd2=iRd(it);var risk=it.rev*(1-rd2/100);
              return <tr key={it.id} style={{background:i%2===0?"#FAFBFC":"white"}}><td style={{padding:"8px 12px",borderBottom:"1px solid #E2E8F0",fontWeight:700,fontSize:12,color:"#0F172A"}}>{i+1}. {it.nm}</td><td style={{padding:"8px 12px",borderBottom:"1px solid #E2E8F0"}}><Bar v={rd2} w={60}/></td><td style={{padding:"8px 12px",borderBottom:"1px solid #E2E8F0",color:"#B45309",fontWeight:700,fontSize:12}}>{fD(risk)} at risk</td><td style={{padding:"8px 12px",borderBottom:"1px solid #E2E8F0",color:"#334155",fontSize:12}}>of {fD(it.rev)}</td></tr>;
            })}
          </tbody>
        </table>

        <div style={S.foot}><span>Learningbank | Workforce Readiness Report | McDonald's Denmark</span><span>Page 3</span></div>
      </div>

      {/* PAGE 4: RECOMMENDATIONS */}
      <div className="report-page" style={S.page}>
        <div style={S.hdr}>
          <div><h2 style={{fontSize:20,fontWeight:700,color:"#0F172A"}}>Strategic Recommendations</h2><p style={{fontSize:12,color:"#475569"}}>Priority actions to improve portfolio readiness</p></div>
          <span style={{fontSize:12,color:"#475569"}}>{dateStr}</span>
        </div>

        {totalGaps>0 && (
          <div style={{padding:"12px 16px",borderRadius:8,background:"#FFFBEB",marginBottom:8}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}><span style={{fontWeight:700,fontSize:12,color:"#D97706"}}>HIRING <span style={{fontWeight:500,fontSize:9,padding:"1px 6px",borderRadius:3,background:"#D9770618",marginLeft:4}}>High</span></span><span style={{fontSize:11,color:"#475569"}}>{totalGaps} hires needed</span></div>
            <div style={{fontSize:12,color:"#0F172A"}}>Recruit {totalGaps} positions across all initiatives to close staffing gaps</div>
          </div>
        )}
        {sgArr.length>0 && (
          <div style={{padding:"12px 16px",borderRadius:8,background:"#FFFBEB",marginBottom:8}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}><span style={{fontWeight:700,fontSize:12,color:"#D97706"}}>TRAINING <span style={{fontWeight:500,fontSize:9,padding:"1px 6px",borderRadius:3,background:"#D9770618",marginLeft:4}}>High</span></span><span style={{fontSize:11,color:"#475569"}}>{sgArr.reduce(function(s,g){return s+g.n;},0)} people to train</span></div>
            <div style={{fontSize:12,color:"#0F172A"}}>Address top skill gaps: {sgArr.slice(0,3).map(function(g){return g.s;}).join(", ")}</div>
          </div>
        )}
        {cgArr.length>0 && (
          <div style={{padding:"12px 16px",borderRadius:8,background:"#FFF5F5",marginBottom:8}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}><span style={{fontWeight:700,fontSize:12,color:"#DC2626"}}>CERTIFICATION <span style={{fontWeight:500,fontSize:9,padding:"1px 6px",borderRadius:3,background:"#DC262618",marginLeft:4}}>Critical</span></span><span style={{fontSize:11,color:"#475569"}}>{cgArr.reduce(function(s,g){return s+g.n;},0)} certifications needed</span></div>
            <div style={{fontSize:12,color:"#0F172A"}}>Close certificate gaps: {cgArr.slice(0,3).map(function(g){return g.c;}).join(", ")}</div>
          </div>
        )}
        {projC>0 && (
          <div style={{padding:"12px 16px",borderRadius:8,background:"#F0F9FF",marginBottom:8}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}><span style={{fontWeight:700,fontSize:12,color:"#0891B2"}}>PROJECTIONS <span style={{fontWeight:500,fontSize:9,padding:"1px 6px",borderRadius:3,background:"#0891B218",marginLeft:4}}>Medium</span></span><span style={{fontSize:11,color:"#475569"}}>{projC} new openings</span></div>
            <div style={{fontSize:12,color:"#0F172A"}}>{projC} new location(s) in pipeline. Begin recruitment and training 6+ months before target.</div>
          </div>
        )}

        <div style={S.callout}>
          <h4 style={{color:"#0891B2",fontSize:12,marginBottom:4}}>Key Takeaway</h4>
          <p style={{fontSize:12,color:"#E2E8F0"}}>{takeaway}</p>
        </div>

        <div style={S.foot}><span>Learningbank | Workforce Readiness Report | McDonald's Denmark | {dateStr}</span><span>Confidential</span></div>
      </div>
    </div>
  );
}

/* â•â•â• OVERVIEW PAGE â•â•â• */
/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
