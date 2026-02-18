"use client";
import { useState } from "react";
import { useT } from "@/lib/theme";
import { fmt, fD, rc, cc2 } from "@/lib/utils";
import { allRoles, wRd, iRd, staffRd, skillRd, certRd } from "@/lib/readiness";
import Badge from "./Badge";
import ProgressBar from "./ProgressBar";
import MiniGauge from "./MiniGauge";
import KPICard from "./KPICard";
import TabBar from "./TabBar";
import HeatmapView from "./HeatmapView";
import PortfolioView from "./PortfolioView";

export default function OverviewPage(p){
  var T=useT();var ini=p.ini;
  var tv=0,opp=0,trr=0;
  ini.forEach(function(it){var rd=iRd(it);tv+=it.rev;opp+=it.rev*(1-rd/100);trr+=rd;});
  var ar=ini.length?Math.round(trr/ini.length):0;

  var fState=useState("All");var fl=fState[0],sF=fState[1];
  var vState=useState("cards");var vw=vState[0],sVw=vState[1];

  var fd=ini;
  if(fl==="Operational") fd=ini.filter(function(x){return x.tp==="Operational";});
  if(fl==="Administrative") fd=ini.filter(function(x){return x.tp==="Administrative";});
  if(fl==="Projections") fd=ini.filter(function(x){return x.st==="projection";});

  return (
    <div style={{padding:"24px 32px",maxWidth:1400,margin:"0 auto"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:24}}>
        <div>
          <h1 style={{fontSize:24,fontWeight:700,marginBottom:4}}>Initiatives</h1>
          <p style={{color:T.tm,fontSize:13}}>Workforce readiness across all locations</p>
        </div>
        <div style={{display:"flex",gap:8}}>
          <button onClick={p.onReport} style={{padding:"10px 24px",borderRadius:10,border:"1px solid "+T.bd,cursor:"pointer",background:T.cd,color:T.tx,fontSize:13,fontWeight:500,fontFamily:"inherit"}}>Export PDF</button>
          <button onClick={p.onCreate} style={{padding:"10px 24px",borderRadius:10,border:"none",cursor:"pointer",background:"linear-gradient(135deg,"+T.ac+",#06B6D4)",color:"#0B0F1A",fontSize:13,fontWeight:600,fontFamily:"inherit"}}>+ Create Initiative</button>
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:24}}>
        <KPICard l="Initiatives" v={ini.length} c={T.ac}/>
        <KPICard l="Value at Stake" v={fD(tv)}/>
        <KPICard l="Opportunity Cost" v={fD(opp)} c={T.am}/>
        <KPICard l="Avg. Readiness" v={ar+"%"} c={rc(ar,T)}/>
      </div>

      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,gap:12,flexWrap:"wrap"}}>
        <TabBar tabs={["All","Operational","Administrative","Projections"]} a={fl} on={sF}/>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          <TabBar tabs={["cards","ranking","heatmap","portfolio"]} a={vw} on={sVw}/>
          <span style={{fontSize:11,color:T.td}}>{fd.length} items</span>
        </div>
      </div>

      {/* CARDS VIEW */}
      {vw==="cards" && (
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(360px,1fr))",gap:14}}>
          {fd.map(function(it){
            var crd=iRd(it);var mr=it.rev*(1-crd/100);
            var trq2=0,tgp2=0;
            it.depts.forEach(function(d){d.roles.forEach(function(r){trq2+=r.rq;tgp2+=r.gp;});});
            var sR=staffRd(allRoles(it)),skR=it._skillRd||skillRd(it),cR=it._certRd||certRd(it);
            return (
              <div key={it.id} onClick={function(){p.onOpen(it);}} style={{padding:20,borderRadius:14,border:"1px solid "+T.bd,background:T.cd,cursor:"pointer",position:"relative",overflow:"hidden"}}>
                <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:rc(crd,T),opacity:0.6}}/>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
                  <div style={{flex:1}}>
                    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                      <h3 style={{fontSize:15,fontWeight:600,margin:0}}>{it.nm}</h3>
                      {it.st==="projection"&&<Badge c={T.pu} b={T.pd}>Projection</Badge>}
                    </div>
                    <div style={{display:"flex",gap:4}}>
                      <Badge c={T.tm}>{it.depts.length} loc.</Badge>
                      <Badge c={T.tm}>{it.sd} - {it.td}</Badge>
                    </div>
                  </div>
                  <MiniGauge v={crd}/>
                </div>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                  <span style={{fontSize:11,color:T.tm}}>Overall Readiness</span>
                  <span style={{fontSize:12,fontWeight:600,color:rc(crd,T)}}>{crd}%</span>
                </div>
                <ProgressBar v={crd}/>
                {/* Three-part mini readiness */}
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginTop:12}}>
                  {[{l:"Staff",v:sR},{l:"Capability",v:skR},{l:"Compliance",v:cR}].map(function(m){
                    return (
                      <div key={m.l} style={{padding:"6px 8px",borderRadius:8,background:T.sa,border:"1px solid transparent"}}>
                        <div style={{fontSize:9,color:T.td,textTransform:"uppercase",marginBottom:2}}>{m.l}</div>
                        <div style={{fontSize:14,fontWeight:600,color:rc(m.v,T)}}>{m.v}%</div>
                      </div>
                    );
                  })}
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginTop:10}}>
                  <div><div style={{fontSize:9,color:T.td,textTransform:"uppercase",marginBottom:1}}>Risk (DKK)</div><div style={{fontSize:13,fontWeight:600,color:T.am}}>{fD(mr)}</div></div>
                  <div><div style={{fontSize:9,color:T.td,textTransform:"uppercase",marginBottom:1}}>Gap</div><div style={{fontSize:13,fontWeight:600,color:tgp2>0?T.rd:T.gn}}>{tgp2>0?"-"+tgp2:"OK"} / {trq2}</div></div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* RANKING VIEW */}
      {vw==="ranking" && (
        <div style={{borderRadius:14,border:"1px solid "+T.bd,overflow:"hidden"}}>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead><tr style={{borderBottom:"1px solid "+T.bd}}>
              {["#","Initiative","Type","Readiness","Staff","Capability","Compliance","Risk (DKK)","Gaps","Value"].map(function(h){return <th key={h} style={{padding:"10px 12px",fontSize:10,color:T.td,textTransform:"uppercase",textAlign:"left"}}>{h}</th>;})}
            </tr></thead>
            <tbody>{fd.sort(function(a,b){return iRd(a)-iRd(b);}).map(function(it,idx){
              var crd=iRd(it),mr=it.rev*(1-crd/100);
              var sR=staffRd(allRoles(it)),skR=it._skillRd||0,cR=it._certRd||0;
              var tgp=0;it.depts.forEach(function(d){d.roles.forEach(function(r){tgp+=r.gp;});});
              return (
                <tr key={it.id} onClick={function(){p.onOpen(it);}} style={{borderBottom:"1px solid "+T.bd+"40",cursor:"pointer"}}>
                  <td style={{padding:"10px 12px",fontSize:12,color:T.td}}>{idx+1}</td>
                  <td style={{padding:"10px 12px"}}><span style={{fontSize:13,fontWeight:500}}>{it.nm}</span>{it.st==="projection"&&<span style={{fontSize:10,color:T.pu,marginLeft:6}}>Proj.</span>}</td>
                  <td style={{padding:"10px 12px"}}><Badge c={T.gn} b={T.gd}>{it.tp}</Badge></td>
                  <td style={{padding:"10px 12px"}}><div style={{display:"flex",alignItems:"center",gap:6}}><div style={{width:60}}><ProgressBar v={crd} h={4}/></div><span style={{fontSize:12,color:rc(crd,T),fontWeight:600}}>{crd}%</span></div></td>
                  <td style={{padding:"10px 12px",fontSize:12,color:rc(sR,T)}}>{sR}%</td>
                  <td style={{padding:"10px 12px",fontSize:12,color:rc(skR,T)}}>{skR}%</td>
                  <td style={{padding:"10px 12px",fontSize:12,color:rc(cR,T)}}>{cR}%</td>
                  <td style={{padding:"10px 12px",fontSize:12,color:T.am,fontWeight:500}}>{fD(mr)}</td>
                  <td style={{padding:"10px 12px",fontSize:12,color:tgp>0?T.rd:T.gn}}>{tgp>0?tgp:"-"}</td>
                  <td style={{padding:"10px 12px",fontSize:12}}>{fD(it.rev)}</td>
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
