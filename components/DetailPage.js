"use client";
import { useState } from "react";
import { useT } from "@/lib/theme";
import { fmt, fD, rc, cc2, cw, ic2 } from "@/lib/utils";
import { allRoles, wRd, staffRd, skillRd, certRd, iRd, deptRd, deptStaff } from "@/lib/readiness";
import { genActions, matchContent } from "@/lib/actions";
import { LIBRARY, FITS } from "@/lib/data";
import Badge from "./Badge";
import ProgressBar from "./ProgressBar";
import Gauge from "./Gauge";
import MiniGauge from "./MiniGauge";
import TabBar from "./TabBar";
import KPICard from "./KPICard";
import Overlay from "./Overlay";
import RiskActionsTab from "./RiskActionsTab";

export default function DetailPage(p){
  var ini=p.ini;var T=useT();
  var tState=useState("Overview");var tab=tState[0],sTab=tState[1];
  var aState=useState([]);var assigned=aState[0],sAssigned=aState[1];
  var eaState=useState(null);var enabledActs=eaState[0],sEnabledActs=eaState[1];

  var ar=allRoles(ini);var trq=0,tql=0;
  ar.forEach(function(r){trq+=r.rq;tql+=r.ql;});
  var crd=wRd(ar),sR=staffRd(ar),skR=ini._skillRd||skillRd(ini),cR=ini._certRd||certRd(ini);
  var mr=ini.rev*(1-crd/100);
  var bn=ar.filter(function(r){return r.gp>0;});
  var acts=genActions(ini);
  var content=matchContent(ini);
  var projRd=Math.min(100,crd+acts.reduce(function(s,a){return s+a.lift;},0));
  var simActs=enabledActs||acts.map(function(_,i){return i;});
  var simLift=simActs.reduce(function(s,idx){return s+(acts[idx]?acts[idx].lift:0);},0);
  var simRd=crd+simLift;

  function doAssign(contentId){
    sAssigned(function(pr){return pr.concat([contentId]);});
  }

  return (
    <div style={{padding:"24px 32px",maxWidth:1400,margin:"0 auto"}}>
      <button onClick={p.onBack} style={{background:"none",border:"none",color:T.tm,fontSize:12,cursor:"pointer",fontFamily:"inherit",marginBottom:12}}>Back to Initiatives</button>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:4}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <h1 style={{fontSize:22,fontWeight:700,margin:0}}>{ini.nm}</h1>
          <Badge c={T.gn} b={T.gd}>{ini.tp}</Badge>
          {ini.st==="projection"&&<Badge c={T.pu} b={T.pd}>Projection</Badge>}
        </div>
        <div style={{display:"flex",gap:6}}>
          <button style={{padding:"7px 16px",borderRadius:8,border:"1px solid "+T.bd,background:"transparent",color:T.tx,fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>Export</button>
          <button onClick={function(){if(confirm("Delete?"))p.onDelete(ini.id);}} style={{padding:"7px 16px",borderRadius:8,border:"1px solid "+T.rd+"40",background:T.rdd,color:T.rd,fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>Delete</button>
        </div>
      </div>
      <p style={{color:T.tm,fontSize:12,marginBottom:20}}>{ini.ds}</p>

      {/* KPI row with three-part readiness */}
      <div style={{display:"grid",gridTemplateColumns:"auto 1fr 1fr 1fr 1fr",gap:12,marginBottom:20}}>
        <div style={{padding:16,borderRadius:14,border:"1px solid "+T.bd,background:T.cd,display:"flex",alignItems:"center",gap:14}}>
          <Gauge v={crd} sz={64} sw={5}/>
          <div>
            <div style={{fontSize:9,color:T.td,textTransform:"uppercase"}}>Overall</div>
            <div style={{fontSize:18,fontWeight:700,color:rc(crd,T)}}>{crd}%</div>
          </div>
        </div>
        {[{k:"staff",l:"Staffing",v:sR},{k:"skill",l:"Capability",v:skR},{k:"cert",l:"Compliance",v:cR}].map(function(m){
          return (
            <div key={m.k} style={{padding:16,borderRadius:14,border:"1px solid "+T.bd,background:T.cd}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                <span style={{fontSize:9,color:T.td,textTransform:"uppercase"}}>{m.l}</span>
                <MiniGauge v={m.v} sz={28} sw={2}/>
              </div>
              <div style={{fontSize:18,fontWeight:700,color:rc(m.v,T)}}>{m.v}%</div>
              <ProgressBar v={m.v} h={3}/>
            </div>
          );
        })}
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:20}}>
        <KPICard l="Value at Stake" v={fD(ini.rev)}/>
        <KPICard l="Risk (DKK)" v={fD(mr)} c={T.am} sub={"Weighted by role criticality"}/>
        <KPICard l="Timeline" v={ini.sd+" - "+ini.td}/>
      </div>

      <div style={{marginBottom:20}}><TabBar tabs={["Overview","Locations","Gaps & Bottlenecks","Recommendations","Simulation","Risk & Actions","Cert Pipeline","Mobility","History"]} a={tab} on={sTab}/></div>

      {/* â”€â”€â”€ OVERVIEW TAB â”€â”€â”€ */}
      {tab==="Overview"&&(
        <div style={{borderRadius:14,border:"1px solid "+T.bd,overflow:"hidden"}}>
          <div style={{padding:"12px 16px",borderBottom:"1px solid "+T.bd,display:"flex",justifyContent:"space-between"}}><h3 style={{fontSize:13,fontWeight:600,margin:0}}>Role Requirements</h3><span style={{fontSize:12,color:T.td}}>{tql}/{trq} filled</span></div>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead><tr style={{borderBottom:"1px solid "+T.bd}}>
              {["Role","Criticality","Required","Qualified","Surplus / Gap","Readiness"].map(function(h){return <th key={h} style={{padding:"8px 14px",fontSize:10,color:T.td,textTransform:"uppercase",textAlign:"left"}}>{h}</th>;})}
            </tr></thead>
            <tbody>{ar.map(function(r,idx){
              var rd2=r.rq>0?Math.round(r.ql/r.rq*100):100;
              var diff=r.ql-r.rq;
              return (
                <tr key={idx} style={{borderBottom:"1px solid "+T.bd+"08"}}>
                  <td style={{padding:"8px 14px",fontSize:13,fontWeight:500}}>{r.cn}</td>
                  <td style={{padding:"8px 14px"}}><Badge c={cc2(r.cr,T)} b={cc2(r.cr,T)+"15"}>{r.cr}</Badge></td>
                  <td style={{padding:"8px 14px",fontSize:12}}>{r.rq}</td>
                  <td style={{padding:"8px 14px",fontSize:12}}>{r.ql}</td>
                  <td style={{padding:"8px 14px",fontSize:12,fontWeight:diff!==0?600:400,color:diff>0?T.ac:diff<0?T.rd:T.gn}}>{diff>0?"+"+diff:diff<0?diff:"-"}</td>
                  <td style={{padding:"8px 14px"}}><div style={{display:"flex",alignItems:"center",gap:6}}><div style={{width:60}}><ProgressBar v={rd2} h={4}/></div><span style={{fontSize:11,color:rc(rd2,T)}}>{rd2}%</span></div></td>
                </tr>
              );
            })}</tbody>
          </table>
        </div>
      )}

      {/* ─── LOCATIONS TAB ─── */}
      {tab==="Locations"&&(function(){
        if(ini.depts.length<=1){
          return (
            <div style={{padding:40,textAlign:"center",borderRadius:14,border:"1px solid "+T.bd}}>
              <div style={{fontSize:40,marginBottom:12,opacity:0.3}}>&#128205;</div>
              <div style={{fontSize:14,fontWeight:600,color:T.tx,marginBottom:6}}>Single Location Initiative</div>
              <div style={{fontSize:12,color:T.td,maxWidth:340,margin:"0 auto"}}>This initiative covers a single location. When multiple locations are added, you can compare staffing and readiness across them here.</div>
            </div>
          );
        }
        /* Compute per-dept stats */
        var deptStats=ini.depts.map(function(dept){
          var dR=deptRd(dept);
          var dS=deptStaff(dept);
          var dReq=0,dFill=0;
          (dept.roles||[]).forEach(function(r){dReq+=r.rq;dFill+=r.ql;});
          var surplus=dFill-dReq;
          return {dept:dept,rd:dR,staff:dS,req:dReq,filled:dFill,surplus:surplus};
        });
        var totalReq=deptStats.reduce(function(s,d){return s+d.req;},0);
        var totalFill=deptStats.reduce(function(s,d){return s+d.filled;},0);
        /* Sort by readiness ascending (worst first) for ranking */
        var ranked=deptStats.slice().sort(function(a,b){return a.rd-b.rd;});
        return (
          <div>
            {/* Overall initiative summary */}
            <div style={{padding:16,borderRadius:14,border:"1px solid "+T.bd,background:T.cd,marginBottom:16}}>
              <div style={{display:"flex",alignItems:"center",gap:16}}>
                <Gauge v={crd} sz={60} sw={5}/>
                <div>
                  <div style={{fontSize:10,color:T.td,textTransform:"uppercase",letterSpacing:0.5,marginBottom:2}}>Overall Initiative</div>
                  <div style={{fontSize:14,fontWeight:600,color:T.tx}}>{ini.depts.length} locations &middot; {totalReq} positions &middot; {totalFill} filled</div>
                </div>
              </div>
            </div>

            {/* Location cards side-by-side */}
            <div style={{display:"grid",gridTemplateColumns:ini.depts.length<=3?"repeat("+ini.depts.length+",1fr)":"repeat(2,1fr)",gap:14,marginBottom:16}}>
              {deptStats.map(function(ds){
                var surpColor=ds.surplus>0?T.ac:ds.surplus===0?T.gn:T.rd;
                var surpLabel=ds.surplus>0?"Over capacity":ds.surplus===0?"Fully staffed":"Understaffed";
                return (
                  <div key={ds.dept.did} style={{borderRadius:14,border:"1px solid "+T.bd,overflow:"hidden"}}>
                    {/* Card header */}
                    <div style={{padding:"14px 16px",borderBottom:"1px solid "+T.bd,display:"flex",alignItems:"center",justifyContent:"space-between",background:T.sa}}>
                      <div style={{fontSize:14,fontWeight:600}}>{ds.dept.dn}</div>
                      <Badge c={surpColor} b={surpColor+"15"}>{surpLabel}</Badge>
                    </div>
                    {/* Gauge + summary */}
                    <div style={{padding:16,display:"flex",alignItems:"center",gap:14}}>
                      <Gauge v={ds.rd} sz={64} sw={5}/>
                      <div>
                        <div style={{fontSize:10,color:T.td,textTransform:"uppercase",marginBottom:4}}>Staffing</div>
                        <div style={{fontSize:18,fontWeight:700,color:rc(ds.staff,T)}}>{ds.staff}%</div>
                        <div style={{fontSize:11,color:T.tm}}>{ds.filled}/{ds.req} filled <span style={{color:surpColor,fontWeight:600}}>({ds.surplus>0?"+":""}{ds.surplus})</span></div>
                      </div>
                    </div>
                    {/* Per-role breakdown */}
                    <div style={{borderTop:"1px solid "+T.bd}}>
                      <div style={{padding:"6px 16px",borderBottom:"1px solid "+T.bd+"08",fontSize:9,color:T.td,textTransform:"uppercase",letterSpacing:0.5,display:"flex"}}>
                        <span style={{flex:1}}>Role</span>
                        <span style={{width:60,textAlign:"center"}}>Filled</span>
                        <span style={{width:50,textAlign:"right"}}>Readiness</span>
                      </div>
                      {(ds.dept.roles||[]).map(function(r,ri){
                        var rrd=r.rq>0?Math.round(r.ql/r.rq*100):100;
                        var rsurp=r.ql-r.rq;
                        return (
                          <div key={ri} style={{display:"flex",alignItems:"center",padding:"5px 16px",borderBottom:"1px solid "+T.bd+"05",fontSize:12}}>
                            <span style={{flex:1,fontWeight:500}}>{r.cn}</span>
                            <span style={{width:60,textAlign:"center",color:T.tm}}>{r.ql}/{r.rq}{rsurp!==0&&<span style={{fontSize:10,color:rsurp>0?T.ac:T.rd,marginLeft:3}}>({rsurp>0?"+":""}{rsurp})</span>}</span>
                            <span style={{width:50,textAlign:"right",fontWeight:600,color:rc(rrd,T)}}>{rrd}%</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Ranking table */}
            <div style={{borderRadius:14,border:"1px solid "+T.bd,overflow:"hidden"}}>
              <div style={{padding:"12px 16px",borderBottom:"1px solid "+T.bd,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <h3 style={{fontSize:13,fontWeight:600,margin:0}}>Location Ranking</h3>
                <span style={{fontSize:11,color:T.td}}>Sorted by readiness (lowest first)</span>
              </div>
              <table style={{width:"100%",borderCollapse:"collapse"}}>
                <thead><tr style={{borderBottom:"1px solid "+T.bd}}>
                  {["#","Location","Readiness","Staffing","Required","Filled","Surplus / Gap"].map(function(h){return <th key={h} style={{padding:"8px 14px",fontSize:10,color:T.td,textTransform:"uppercase",textAlign:"left"}}>{h}</th>;})}
                </tr></thead>
                <tbody>{ranked.map(function(ds,i){
                  var surpColor2=ds.surplus>0?T.ac:ds.surplus===0?T.gn:T.rd;
                  return (
                    <tr key={ds.dept.did} style={{borderBottom:"1px solid "+T.bd+"08"}}>
                      <td style={{padding:"8px 14px"}}><div style={{width:22,height:22,borderRadius:6,background:T.ac+"20",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:T.ac}}>{i+1}</div></td>
                      <td style={{padding:"8px 14px",fontSize:13,fontWeight:500}}>{ds.dept.dn}</td>
                      <td style={{padding:"8px 14px"}}><div style={{display:"flex",alignItems:"center",gap:6}}><div style={{width:60}}><ProgressBar v={ds.rd} h={4}/></div><span style={{fontSize:12,fontWeight:600,color:rc(ds.rd,T)}}>{ds.rd}%</span></div></td>
                      <td style={{padding:"8px 14px",fontSize:12,color:rc(ds.staff,T),fontWeight:500}}>{ds.staff}%</td>
                      <td style={{padding:"8px 14px",fontSize:12,color:T.tm}}>{ds.req}</td>
                      <td style={{padding:"8px 14px",fontSize:12,color:T.tm}}>{ds.filled}</td>
                      <td style={{padding:"8px 14px",fontSize:13,fontWeight:600,color:surpColor2}}>{ds.surplus>0?"+"+ds.surplus:ds.surplus===0?"-":ds.surplus}</td>
                    </tr>
                  );
                })}</tbody>
              </table>
            </div>
          </div>
        );
      })()}

      {/* â"€â"€â"€ GAPS TAB â"€â"€â"€ */}
      {tab==="Gaps & Bottlenecks"&&(
        <div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
            <div style={{borderRadius:14,border:"1px solid "+T.bd,overflow:"hidden"}}>
              <div style={{padding:"12px 16px",borderBottom:"1px solid "+T.bd}}><h3 style={{fontSize:13,fontWeight:600,margin:0}}>Skill Gaps ({ini.sg.length})</h3></div>
              {ini.sg.map(function(g,i){return (
                <div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 16px",borderBottom:"1px solid "+T.bd+"08"}}>
                  <div style={{display:"flex",alignItems:"center",gap:8}}><div style={{width:7,height:7,borderRadius:4,background:ic2(g.i,T)}}/><span style={{fontSize:12}}>{g.s}</span></div>
                  <div style={{display:"flex",gap:6,alignItems:"center"}}><span style={{fontSize:11,color:T.tm}}>{g.n} ppl</span><Badge c={ic2(g.i,T)} b={ic2(g.i,T)+"15"}>{g.i}</Badge></div>
                </div>
              );})}
            </div>
            <div style={{borderRadius:14,border:"1px solid "+T.bd,overflow:"hidden"}}>
              <div style={{padding:"12px 16px",borderBottom:"1px solid "+T.bd}}><h3 style={{fontSize:13,fontWeight:600,margin:0}}>Certificate Gaps ({ini.cg.length})</h3></div>
              {ini.cg.length===0&&<div style={{padding:16,textAlign:"center",color:T.gn,fontSize:12}}>No gaps</div>}
              {ini.cg.map(function(g,i){return (
                <div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 16px",borderBottom:"1px solid "+T.bd+"08"}}>
                  <div style={{display:"flex",alignItems:"center",gap:8}}><div style={{width:7,height:7,borderRadius:4,background:ic2(g.i,T)}}/><span style={{fontSize:12}}>{g.c}</span></div>
                  <div style={{display:"flex",gap:6,alignItems:"center"}}><span style={{fontSize:11,color:T.tm}}>{g.n} ppl</span><Badge c={ic2(g.i,T)} b={ic2(g.i,T)+"15"}>{g.i}</Badge></div>
                </div>
              );})}
            </div>
          </div>
          <div style={{borderRadius:14,border:"1px solid "+T.bd,overflow:"hidden"}}>
            <div style={{padding:"12px 16px",borderBottom:"1px solid "+T.bd}}><h3 style={{fontSize:13,fontWeight:600,margin:0}}>Bottleneck Roles</h3></div>
            {bn.length===0&&<div style={{padding:20,textAlign:"center",color:T.gn}}>All positions staffed</div>}
            {bn.sort(function(a,b){return b.gp*cw(b.cr)-a.gp*cw(a.cr);}).map(function(b,i){
              var rd2=b.rq>0?Math.round(b.ql/b.rq*100):100;
              var impact=Math.round(ini.rev*(b.gp*cw(b.cr))/(trq>0?trq:1));
              return (
                <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 16px",borderBottom:"1px solid "+T.bd+"08"}}>
                  <div style={{width:22,height:22,borderRadius:6,background:T.ac+"20",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:T.ac,flexShrink:0}}>{i+1}</div>
                  <span style={{fontSize:12,fontWeight:500,width:130}}>{b.cn}</span>
                  <Badge c={cc2(b.cr,T)} b={cc2(b.cr,T)+"15"}>{b.cr}</Badge>
                  <div style={{flex:1,display:"flex",alignItems:"center",gap:6}}><div style={{flex:1}}><ProgressBar v={rd2} h={4}/></div><span style={{fontSize:11,color:rc(rd2,T),width:32}}>{rd2}%</span></div>
                  <span style={{fontSize:12,fontWeight:600,color:T.rd}}>{b.gp} missing</span>
                  <span style={{fontSize:11,color:T.td}}>{fD(impact)} impact</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* â”€â”€â”€ RECOMMENDATIONS TAB â”€â”€â”€ */}
      {tab==="Recommendations"&&(
        <div>
          {/* Content matches */}
          <div style={{borderRadius:14,border:"1px solid "+T.bd,overflow:"hidden",marginBottom:14}}>
            <div style={{padding:"12px 16px",borderBottom:"1px solid "+T.bd}}><h3 style={{fontSize:13,fontWeight:600,margin:0}}>Learning Content Matches</h3><p style={{fontSize:11,color:T.tm,margin:"2px 0 0"}}>Existing content that can close gaps</p></div>
            {content.filter(function(c){return c.type!=="content_gap";}).map(function(m,i){
              var isAssigned=assigned.indexOf(m.content.id)!==-1;
              return (
                <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 16px",borderBottom:"1px solid "+T.bd+"08"}}>
                  <div style={{width:32,height:32,borderRadius:8,background:m.content.tp==="Event"?T.amd:T.ad,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0}}>{m.content.tp==="Event"?"E":"P"}</div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:13,fontWeight:500,marginBottom:3}}>{m.content.nm}</div>
                    <div style={{display:"flex",gap:4}}><Badge c={T.ac} b={T.ad}>{m.gap}</Badge>{m.content.ct&&<Badge c={T.gn} b={T.gd}>{m.content.ct}</Badge>}<Badge c={T.td}>{m.type==="skill"?"Skill":"Cert"} gap</Badge></div>
                  </div>
                  <span style={{fontSize:11,color:T.td}}>{m.content.dur}</span>
                  <span style={{fontSize:13,fontWeight:600,color:T.ac}}>{m.n} ppl</span>
                  <button onClick={function(e){e.stopPropagation();doAssign(m.content.id);}} disabled={isAssigned} style={{padding:"6px 14px",borderRadius:8,border:"none",background:isAssigned?T.gd:T.ac,color:isAssigned?T.gn:"#0B0F1A",fontSize:11,fontWeight:600,cursor:isAssigned?"default":"pointer",fontFamily:"inherit"}}>{isAssigned?"Assigned":"Assign All"}</button>
                </div>
              );
            })}
          </div>
          {/* Content gaps */}
          {content.filter(function(c){return c.type==="content_gap";}).length>0&&(
            <div style={{borderRadius:14,border:"1px solid "+T.am+"40",background:T.amd,overflow:"hidden"}}>
              <div style={{padding:"12px 16px",borderBottom:"1px solid "+T.am+"30"}}><h3 style={{fontSize:13,fontWeight:600,margin:0,color:T.am}}>Content Gaps Detected</h3><p style={{fontSize:11,color:T.tm,margin:"2px 0 0"}}>No matching content exists - creation recommended</p></div>
              {content.filter(function(c){return c.type==="content_gap";}).map(function(g,i){
                return (
                  <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"12px 16px",borderBottom:"1px solid "+T.am+"15"}}>
                    <div style={{width:32,height:32,borderRadius:8,background:T.am+"20",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,color:T.am}}>!</div>
                    <div style={{flex:1}}>
                      <div style={{fontSize:13,fontWeight:500}}>{g.gap}</div>
                      <div style={{fontSize:11,color:T.tm}}>No content teaches this skill at the required level</div>
                    </div>
                    <Badge c={ic2(g.impact,T)} b={ic2(g.impact,T)+"15"}>{g.impact}</Badge>
                    <span style={{fontSize:12,color:T.am,fontWeight:600}}>{g.n} people affected</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

            {/* --- SIMULATION TAB --- */}
      {tab==="Simulation"&&(
        <div>
          {/* Simulation header with gauge */}
          <div style={{padding:20,borderRadius:14,border:"1px solid "+T.ac+"30",background:T.ad,marginBottom:16}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
              <div>
                <div style={{fontSize:11,color:T.td,textTransform:"uppercase",letterSpacing:0.5,marginBottom:4}}>Readiness Simulator</div>
                <div style={{fontSize:13,color:T.tm}}>Toggle actions on/off to see projected readiness change in real-time</div>
              </div>
              <div style={{display:"flex",gap:8}}>
                <button onClick={function(){sEnabledActs(acts.map(function(_,i){return i;}));}} style={{padding:"6px 14px",borderRadius:8,border:"1px solid "+T.ac+"40",background:"transparent",color:T.ac,fontSize:11,cursor:"pointer",fontFamily:"inherit"}}>Select All</button>
                <button onClick={function(){sEnabledActs([]);}} style={{padding:"6px 14px",borderRadius:8,border:"1px solid "+T.bd,background:"transparent",color:T.tm,fontSize:11,cursor:"pointer",fontFamily:"inherit"}}>Clear All</button>
              </div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:24}}>
              <div style={{textAlign:"center"}}>
                <Gauge v={crd} sz={72} sw={5}/>
                <div style={{fontSize:10,color:T.td,marginTop:4}}>Current</div>
              </div>
              <div style={{fontSize:24,color:T.td}}>&#8594;</div>
              <div style={{textAlign:"center"}}>
                <Gauge v={Math.round(simRd)} sz={72} sw={5} clr={simRd>crd?T.gn:rc(simRd,T)}/>
                <div style={{fontSize:10,color:T.td,marginTop:4}}>Projected</div>
              </div>
              <div style={{flex:1,padding:"0 20px"}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                  <span style={{fontSize:12,color:T.tm}}>Total lift from selected actions</span>
                  <span style={{fontSize:16,fontWeight:700,color:simLift>0?T.gn:T.td}}>+{Math.round(simLift*10)/10}%</span>
                </div>
                <div style={{height:8,borderRadius:4,background:T.sa,overflow:"hidden",position:"relative"}}>
                  <div style={{width:crd+"%",height:"100%",background:rc(crd,T),borderRadius:4,position:"absolute",left:0}}/>
                  {simLift>0&&<div style={{width:Math.min(simLift,100-crd)+"%",height:"100%",background:T.gn,borderRadius:"0 4px 4px 0",position:"absolute",left:crd+"%",opacity:0.6}}/>}
                </div>
                <div style={{display:"flex",justifyContent:"space-between",marginTop:4}}>
                  <span style={{fontSize:10,color:T.td}}>{crd}%</span>
                  <span style={{fontSize:10,color:simRd>=85?T.gn:simRd>=60?T.am:T.rd}}>{Math.round(simRd)}%</span>
                </div>
              </div>
              <div style={{flexShrink:0,textAlign:"center",padding:"8px 16px",borderRadius:10,background:simActs.length===acts.length?T.gd:T.sa,border:"1px solid "+(simActs.length===acts.length?T.gn+"40":T.bd)}}>
                <div style={{fontSize:20,fontWeight:700,color:simActs.length===acts.length?T.gn:T.tx}}>{simActs.length}/{acts.length}</div>
                <div style={{fontSize:10,color:T.td}}>Actions</div>
              </div>
            </div>
          </div>

          {/* Action items with toggles */}
          <div style={{borderRadius:14,border:"1px solid "+T.bd,overflow:"hidden"}}>
            <div style={{padding:"12px 16px",borderBottom:"1px solid "+T.bd,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <h3 style={{fontSize:13,fontWeight:600,margin:0}}>Action Plan ({acts.length} recommendations)</h3>
              <span style={{fontSize:11,color:T.tm}}>{simActs.length} selected</span>
            </div>
            {acts.map(function(a,i){
              var isOn=simActs.indexOf(i)!==-1;
              var icon=a.tp==="hire"?"H":a.tp==="train"?"T":a.tp==="recert"?"R":"C";
              var color=a.tp==="hire"?T.pu:a.tp==="train"?T.ac:a.tp==="recert"?T.gn:T.am;
              var label=a.tp==="hire"?"Hire":a.tp==="train"?"Train":a.tp==="recert"?"Recertify":"Create";
              return (
                <div key={i} onClick={function(){sEnabledActs(function(prev){var cur=prev||acts.map(function(_,j){return j;});var has=cur.indexOf(i)!==-1;return has?cur.filter(function(x){return x!==i;}):cur.concat([i]);});}} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 16px",borderBottom:"1px solid "+T.bd+"08",cursor:"pointer",opacity:isOn?1:0.45,background:isOn?"transparent":T.sa+"40",transition:"opacity 0.2s, background 0.2s"}}>
                  {/* Toggle switch */}
                  <div style={{width:36,height:20,borderRadius:10,background:isOn?T.gn:T.bd,position:"relative",flexShrink:0,transition:"background 0.2s"}}>
                    <div style={{width:16,height:16,borderRadius:8,background:"white",position:"absolute",top:2,left:isOn?18:2,transition:"left 0.2s",boxShadow:"0 1px 3px rgba(0,0,0,0.2)"}}/>
                  </div>
                  <div style={{width:28,height:28,borderRadius:7,background:color+"20",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,color:color,flexShrink:0}}>{icon}</div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:13,fontWeight:500}}>{a.desc}</div>
                    {a.content&&<div style={{fontSize:11,color:T.tm,marginTop:1}}>Content: {a.content}</div>}
                  </div>
                  <Badge c={color} b={color+"15"}>{label}</Badge>
                  <div style={{textAlign:"right",flexShrink:0,minWidth:70}}>
                    <div style={{fontSize:14,fontWeight:700,color:isOn?T.gn:T.td}}>{isOn?"+":""}{a.lift}%</div>
                    <div style={{fontSize:10,color:T.td}}>readiness lift</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Simulation summary */}
          {simActs.length>0&&simActs.length<acts.length&&(
            <div style={{marginTop:16,padding:16,borderRadius:12,border:"1px solid "+T.gn+"30",background:T.gd}}>
              <div style={{fontSize:13,fontWeight:600,color:T.gn,marginBottom:6}}>Simulation Summary</div>
              <div style={{fontSize:12,color:T.tm}}>
                With {simActs.length} of {acts.length} actions selected, readiness improves from <span style={{fontWeight:700,color:rc(crd,T)}}>{crd}%</span> to <span style={{fontWeight:700,color:rc(Math.round(simRd),T)}}>{Math.round(simRd)}%</span>.
                {simRd>=85?" This achieves healthy readiness status.":simRd>=60?" Additional actions recommended to reach target readiness.":" Significant gap remains - consider enabling more actions."}
              </div>
            </div>
          )}
        </div>
      )}

      {/* --- COST IMPACT TAB --- */}
      {tab==="Risk & Actions"&&<RiskActionsTab ini={ini} acts={acts} crd={crd}/>}

      {/* â”€â”€â”€ CERT PIPELINE TAB â”€â”€â”€ */}
      {tab==="Cert Pipeline"&&(
        <div>
          {(!ini.certs||ini.certs.length===0)&&<div style={{padding:32,textAlign:"center",color:T.td,fontSize:13}}>No certificate data for projections</div>}
          {ini.certs&&ini.certs.length>0&&(
            <div>
              {/* Predictive banner */}
              {(function(){
                var te30=0,te60=0;
                ini.certs.forEach(function(c){te30+=c.exp30;te60+=c.exp60;});
                var totalCerts=ini.certs.reduce(function(s,c){return s+c.total;},0);
                var validNow=ini.certs.reduce(function(s,c){return s+c.valid;},0);
                var pctNow=totalCerts>0?Math.round(validNow/totalCerts*100):100;
                var pct30=totalCerts>0?Math.round((validNow-te30)/totalCerts*100):100;
                var pct60=totalCerts>0?Math.round((validNow-te30-te60)/totalCerts*100):100;
                return (
                  <div style={{padding:16,borderRadius:12,border:"1px solid "+T.am+"30",background:T.amd,marginBottom:16}}>
                    <h4 style={{fontSize:13,fontWeight:600,margin:"0 0 10px",color:T.am}}>Certification Readiness Forecast</h4>
                    <div style={{display:"flex",gap:20}}>
                      <div><div style={{fontSize:10,color:T.td,textTransform:"uppercase"}}>Today</div><div style={{fontSize:20,fontWeight:700,color:rc(pctNow,T)}}>{pctNow}%</div></div>
                      <div style={{fontSize:18,color:T.td,alignSelf:"center"}}>--&gt;</div>
                      <div><div style={{fontSize:10,color:T.td,textTransform:"uppercase"}}>In 30 days</div><div style={{fontSize:20,fontWeight:700,color:rc(pct30,T)}}>{pct30}%</div><div style={{fontSize:10,color:T.am}}>{te30>0?"-"+te30+" expiring":"OK"}</div></div>
                      <div style={{fontSize:18,color:T.td,alignSelf:"center"}}>--&gt;</div>
                      <div><div style={{fontSize:10,color:T.td,textTransform:"uppercase"}}>In 60 days</div><div style={{fontSize:20,fontWeight:700,color:rc(pct60,T)}}>{pct60}%</div><div style={{fontSize:10,color:T.am}}>{te60>0?"-"+te60+" more":"OK"}</div></div>
                    </div>
                  </div>
                );
              })()}
              <div style={{borderRadius:14,border:"1px solid "+T.bd,overflow:"hidden"}}>
                <div style={{padding:"12px 16px",borderBottom:"1px solid "+T.bd}}><h3 style={{fontSize:13,fontWeight:600,margin:0}}>Certificate Status Breakdown</h3></div>
                <table style={{width:"100%",borderCollapse:"collapse"}}>
                  <thead><tr style={{borderBottom:"1px solid "+T.bd}}>
                    {["Certificate","Total","Valid","Expiring (30d)","Expiring (60d)","Expired"].map(function(h){return <th key={h} style={{padding:"8px 14px",fontSize:10,color:T.td,textTransform:"uppercase",textAlign:"left"}}>{h}</th>;})}
                  </tr></thead>
                  <tbody>{ini.certs.map(function(c,i){
                    return (
                      <tr key={i} style={{borderBottom:"1px solid "+T.bd+"08"}}>
                        <td style={{padding:"8px 14px",fontSize:13,fontWeight:500}}>{c.c}</td>
                        <td style={{padding:"8px 14px",fontSize:12}}>{c.total}</td>
                        <td style={{padding:"8px 14px",fontSize:12,color:T.gn,fontWeight:500}}>{c.valid}</td>
                        <td style={{padding:"8px 14px",fontSize:12,color:c.exp30>0?T.am:T.td,fontWeight:c.exp30>0?600:400}}>{c.exp30||"-"}</td>
                        <td style={{padding:"8px 14px",fontSize:12,color:c.exp60>0?T.am:T.td}}>{c.exp60||"-"}</td>
                        <td style={{padding:"8px 14px",fontSize:12,color:c.expired>0?T.rd:T.td,fontWeight:c.expired>0?600:400}}>{c.expired||"-"}</td>
                      </tr>
                    );
                  })}</tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* â”€â”€â”€ MOBILITY TAB â”€â”€â”€ */}
      {tab==="Mobility"&&(
        <div style={{borderRadius:14,border:"1px solid "+T.bd,overflow:"hidden"}}>
          <div style={{padding:"12px 16px",borderBottom:"1px solid "+T.bd}}><h3 style={{fontSize:13,fontWeight:600,margin:0}}>Internal Mobility Suggestions</h3><p style={{fontSize:11,color:T.tm,margin:"2px 0 0"}}>Cross-location candidates with skill overlap. Shows tradeoff impact.</p></div>
          {FITS.map(function(f,fi){
            var initials=f.nm.split(" ").map(function(w){return w[0];}).join("");
            return (
              <div key={fi} style={{display:"flex",alignItems:"center",gap:14,padding:"14px 16px",borderBottom:"1px solid "+T.bd+"08"}}>
                <div style={{width:36,height:36,borderRadius:18,background:T.ac+"20",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,color:T.ac,flexShrink:0}}>{initials}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:13,fontWeight:500}}>{f.nm}</div>
                  <div style={{fontSize:11,color:T.td}}>{f.cur} --&gt; <span style={{color:T.ac,fontWeight:500}}>{f.tgt}</span></div>
                </div>
                <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:1,flexShrink:0}}>
                  <MiniGauge v={f.mp} sz={36} sw={2}/>
                  <span style={{fontSize:10,color:rc(f.mp,T)}}>{f.mp}%</span>
                </div>
                <div style={{flexShrink:0,width:180}}>
                  <div style={{fontSize:10,color:T.td,textTransform:"uppercase",marginBottom:3}}>Needs Training</div>
                  <div style={{display:"flex",gap:3,flexWrap:"wrap"}}>{f.ms.map(function(s,si){return <Badge key={si} c={T.am} b={T.amd}>{s}</Badge>;})}{f.mc.map(function(c,ci){return <Badge key={ci} c={T.rd} b={T.rdd}>{c}</Badge>;})}</div>
                </div>
                <div style={{flexShrink:0,width:100,textAlign:"center"}}>
                  <div style={{fontSize:10,color:T.td,textTransform:"uppercase",marginBottom:2}}>Tradeoff</div>
                  <span style={{fontSize:12,color:T.gn,fontWeight:600}}>+{f.fLift}%</span>
                  <span style={{fontSize:11,color:T.td}}> / </span>
                  <span style={{fontSize:12,color:T.rd,fontWeight:600}}>-{f.fCost}%</span>
                </div>
                <button style={{padding:"6px 14px",borderRadius:8,border:"1px solid "+T.ac+"40",background:T.ad,color:T.ac,fontSize:11,fontWeight:500,cursor:"pointer",fontFamily:"inherit",flexShrink:0}}>{f.hp?"View Plan":"Create Plan"}</button>
              </div>
            );
          })}
        </div>
      )}

      {/* â”€â”€â”€ HISTORY TAB â”€â”€â”€ */}
      {tab==="History"&&(
        <div>
          {(!ini.hist||ini.hist.length===0)&&<div style={{padding:32,textAlign:"center",color:T.td,fontSize:13}}>No historical data yet (projections)</div>}
          {ini.hist&&ini.hist.length>0&&(
            <div>
              <div style={{borderRadius:14,border:"1px solid "+T.bd,overflow:"hidden",marginBottom:14}}>
                <div style={{padding:"12px 16px",borderBottom:"1px solid "+T.bd}}><h3 style={{fontSize:13,fontWeight:600,margin:0}}>Quarterly Snapshots (Before/After)</h3></div>
                <table style={{width:"100%",borderCollapse:"collapse"}}>
                  <thead><tr style={{borderBottom:"1px solid "+T.bd}}>
                    {["Quarter","Overall","Staffing","Skill","Certification","Change"].map(function(h){return <th key={h} style={{padding:"8px 14px",fontSize:10,color:T.td,textTransform:"uppercase",textAlign:"left"}}>{h}</th>;})}
                  </tr></thead>
                  <tbody>{ini.hist.map(function(h,i){
                    var prev=i>0?ini.hist[i-1]:null;
                    var delta=prev?h.rd-prev.rd:0;
                    return (
                      <tr key={i} style={{borderBottom:"1px solid "+T.bd+"08"}}>
                        <td style={{padding:"8px 14px",fontSize:13,fontWeight:600}}>{h.q}</td>
                        <td style={{padding:"8px 14px"}}><div style={{display:"flex",alignItems:"center",gap:6}}><div style={{width:50}}><ProgressBar v={h.rd} h={4}/></div><span style={{fontSize:12,fontWeight:600,color:rc(h.rd,T)}}>{h.rd}%</span></div></td>
                        <td style={{padding:"8px 14px",fontSize:12,color:rc(h.staff,T)}}>{h.staff}%</td>
                        <td style={{padding:"8px 14px",fontSize:12,color:rc(h.skill,T)}}>{h.skill}%</td>
                        <td style={{padding:"8px 14px",fontSize:12,color:rc(h.cert,T)}}>{h.cert}%</td>
                        <td style={{padding:"8px 14px",fontSize:12,fontWeight:600,color:delta>0?T.gn:delta<0?T.rd:T.td}}>{delta>0?"+"+delta+"%":delta<0?delta+"%":"-"}</td>
                      </tr>
                    );
                  })}</tbody>
                </table>
              </div>
              {/* Simple bar chart */}
              <div style={{borderRadius:14,border:"1px solid "+T.bd,padding:20}}>
                <h3 style={{fontSize:13,fontWeight:600,margin:"0 0 16px"}}>Readiness Trend</h3>
                <div style={{display:"flex",alignItems:"flex-end",gap:12,height:120}}>
                  {ini.hist.map(function(h,i){
                    return (
                      <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                        <span style={{fontSize:11,fontWeight:600,color:rc(h.rd,T)}}>{h.rd}%</span>
                        <div style={{width:"100%",height:h.rd*1.1,borderRadius:6,background:rc(h.rd,T)+"30",position:"relative"}}>
                          <div style={{position:"absolute",bottom:0,left:0,right:0,height:h.rd*1.1,borderRadius:6,background:rc(h.rd,T),opacity:0.6}}/>
                        </div>
                        <span style={{fontSize:10,color:T.td}}>{h.q}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
/* â•â•â• WIZARD PAGE (from V1 stable - kept compact) â•â•â• */
/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
