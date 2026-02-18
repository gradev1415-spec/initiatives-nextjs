"use client";
import { useT } from "@/lib/theme";
import { rc, fD, forEachRole } from "@/lib/utils";
import { allRoles, wRd, iRd } from "@/lib/readiness";
import Badge from "./Badge";
import MiniGauge from "./MiniGauge";

export default function PortfolioView(p){
  var T=useT();
  var totalGaps=0,topSkillGaps={},topCertGaps={};
  p.ini.forEach(function(it){
    forEachRole(it.depts,function(r){totalGaps+=r.gp;});
    it.sg.forEach(function(g){if(g.s!=="All skills"){topSkillGaps[g.s]=(topSkillGaps[g.s]||0)+g.n;}});
    it.cg.forEach(function(g){if(g.c!=="All certs"){topCertGaps[g.c]=(topCertGaps[g.c]||0)+g.n;}});
  });
  var sgArr=Object.keys(topSkillGaps).map(function(k){return {s:k,n:topSkillGaps[k]};}).sort(function(a,b){return b.n-a.n;});
  var cgArr=Object.keys(topCertGaps).map(function(k){return {c:k,n:topCertGaps[k]};}).sort(function(a,b){return b.n-a.n;});

  return (
    <div>
      {/* Systemic gaps */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:20}}>
        <div style={{borderRadius:14,border:"1px solid "+T.bd,overflow:"hidden"}}>
          <div style={{padding:"14px 20px",borderBottom:"1px solid "+T.bd}}><h3 style={{fontSize:14,fontWeight:600,margin:0}}>Systemic Skill Gaps</h3><p style={{fontSize:11,color:T.tm,margin:"4px 0 0"}}>Aggregated across all initiatives</p></div>
          {sgArr.length===0&&<div style={{padding:20,textAlign:"center",color:T.gn,fontSize:12}}>No systemic gaps detected</div>}
          {sgArr.slice(0,6).map(function(g,i){
            var affected=p.ini.filter(function(it){return it.sg.find(function(x){return x.s===g.s;});}).length;
            return (
              <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 20px",borderBottom:"1px solid "+T.bd+"08"}}>
                <div style={{width:22,height:22,borderRadius:6,background:T.rd+"20",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:T.rd,flexShrink:0}}>{i+1}</div>
                <span style={{fontSize:13,fontWeight:500,flex:1}}>{g.s}</span>
                <Badge c={T.am} b={T.amd}>{affected} initiatives</Badge>
                <span style={{fontSize:12,color:T.rd,fontWeight:600}}>{g.n} people</span>
              </div>
            );
          })}
        </div>
        <div style={{borderRadius:14,border:"1px solid "+T.bd,overflow:"hidden"}}>
          <div style={{padding:"14px 20px",borderBottom:"1px solid "+T.bd}}><h3 style={{fontSize:14,fontWeight:600,margin:0}}>Systemic Cert Gaps</h3><p style={{fontSize:11,color:T.tm,margin:"4px 0 0"}}>Aggregated across all initiatives</p></div>
          {cgArr.length===0&&<div style={{padding:20,textAlign:"center",color:T.gn,fontSize:12}}>No systemic gaps detected</div>}
          {cgArr.slice(0,6).map(function(g,i){
            var affected=p.ini.filter(function(it){return it.cg.find(function(x){return x.c===g.c;});}).length;
            return (
              <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 20px",borderBottom:"1px solid "+T.bd+"08"}}>
                <div style={{width:22,height:22,borderRadius:6,background:T.am+"20",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:T.am,flexShrink:0}}>{i+1}</div>
                <span style={{fontSize:13,fontWeight:500,flex:1}}>{g.c}</span>
                <Badge c={T.am} b={T.amd}>{affected} initiatives</Badge>
                <span style={{fontSize:12,color:T.am,fontWeight:600}}>{g.n} people</span>
              </div>
            );
          })}
        </div>
      </div>
      {/* Quick stats */}
      <div style={{padding:16,borderRadius:12,border:"1px solid "+T.bd,background:T.sa}}>
        <span style={{fontSize:12,color:T.tm}}>Portfolio totals: </span>
        <span style={{fontSize:13,fontWeight:600,color:T.rd}}>{totalGaps} staffing gaps</span>
        <span style={{fontSize:12,color:T.tm}}> across </span>
        <span style={{fontSize:13,fontWeight:600}}>{p.ini.length} initiatives</span>
        <span style={{fontSize:12,color:T.tm}}> with </span>
        <span style={{fontSize:13,fontWeight:600,color:T.am}}>{fD(p.ini.reduce(function(s,it){return s+it.rev*(1-iRd(it)/100);},0))} total risk</span>
      </div>
    </div>
  );
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
/* === RISK & ACTIONS TAB === */
