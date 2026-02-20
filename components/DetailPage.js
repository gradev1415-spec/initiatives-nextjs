"use client";
import { useState } from "react";
import { useT } from "@/lib/theme";
import { fmt, fD, rc, cc2, cw, ic2 } from "@/lib/utils";
import { allRoles, wRd, staffRd, skillRd, certRd, iRd, deptRd, deptStaff, areaRd, areaStaff, areaSkillRd, areaCertRd, hasSkillData, hasCertData } from "@/lib/readiness";
import { genActions, matchContent } from "@/lib/actions";
import { LIBRARY, FITS, LAYOUT_TEMPLATES } from "@/lib/data";
import Badge from "./Badge";
import ProgressBar from "./ProgressBar";
import Gauge from "./Gauge";
import MiniGauge from "./MiniGauge";
import TabBar from "./TabBar";
import KPICard from "./KPICard";
import Tip from "./Tip";
import Overlay from "./Overlay";
import dynamic from "next/dynamic";
var FloorPlan3D = dynamic(function(){ return import("./FloorPlan3D"); }, { ssr: false });
import RiskActionsTab from "./RiskActionsTab";

export default function DetailPage(p){
  var ini=p.ini;var T=useT();
  var tState=useState("Overview");var tab=tState[0],sTab=tState[1];
  var aState=useState([]);var assigned=aState[0],sAssigned=aState[1];
  var eaState=useState(null);var enabledActs=eaState[0],sEnabledActs=eaState[1];
  var _sloc=useState(null);var selLoc=_sloc[0],sSelLoc=_sloc[1];
  var _sarea=useState(null);var selArea=_sarea[0],sSelArea=_sarea[1];
  var _hov=useState(null);var hovArea=_hov[0],sHovArea=_hov[1];
  var _pyr=useState(null);var progYear=_pyr[0],sProgYear=_pyr[1];

  var ar=allRoles(ini);var trq=0,tql=0;
  ar.forEach(function(r){trq+=r.rq;tql+=r.ql;});
  /* Merge same-named roles across depts for Overview table */
  var mergedRoles=(function(){var m={};ar.forEach(function(r){if(!m[r.cn])m[r.cn]={cn:r.cn,cr:r.cr,rq:0,ql:0,gp:0};m[r.cn].rq+=r.rq;m[r.cn].ql+=r.ql;m[r.cn].gp+=r.gp;if(cw(r.cr)>cw(m[r.cn].cr))m[r.cn].cr=r.cr;});return Object.keys(m).map(function(k){return m[k];});})();
  var hSk=hasSkillData(ini),hCt=hasCertData(ini);
  var crd=iRd(ini),sR=wRd(ar),skR=hSk?skillRd(ini):null,cR=hCt?certRd(ini):null;
  var mr=ini.rev*(1-crd/100);
  function statusClr(rd){return rd>=85?T.gn:rd>=60?T.am:T.rd;}
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
      <button onClick={p.onBack} style={{background:"none",border:"none",color:T.tm,fontSize:12,cursor:"pointer",fontFamily:"inherit",marginBottom:12,display:"flex",alignItems:"center",gap:4,padding:0}}><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>Initiatives</button>
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
      <div style={{display:"grid",gridTemplateColumns:"1.5fr 1fr 1fr 1fr",gap:12,marginBottom:20}}>
        <div style={{padding:16,borderRadius:14,border:"1px solid "+T.bd,background:T.cd,display:"flex",alignItems:"center",gap:14}}>
          <Gauge v={crd} sz={64} sw={5}/>
          <div style={{minWidth:0}}>
            <div style={{fontSize:9,color:T.td,textTransform:"uppercase",letterSpacing:0.5}}>Workforce Readiness<Tip text="Weighted composite of staffing, capability, and compliance. Only active pillars contribute to the score." icon="i" sz={13}/></div>
            <div style={{fontSize:18,fontWeight:700,color:rc(crd,T)}}>{crd}%</div>
            <div style={{fontSize:10,color:T.tm,marginTop:2}}>{ini.depts.length} location{ini.depts.length!==1?"s":""} {String.fromCharCode(183)} {tql}/{trq} positions filled</div>
          </div>
        </div>
        {[{k:"staff",l:"Staffing",v:sR,on:true,tip:"Add skill requirements to areas to measure",ht:"Qualified employees vs. required positions, weighted by role criticality."},{k:"skill",l:"Capability",v:skR,on:hSk,tip:"Add skill requirements to areas to measure",ht:"How well current staff meet skill requirements. Scales with how many positions are filled."},{k:"cert",l:"Compliance",v:cR,on:hCt,tip:"Add certificate requirements to start tracking",ht:"Valid certifications held by staff vs. requirements. Scales with staffing level."}].map(function(m){
          return m.on?(
            <div key={m.k} style={{padding:16,borderRadius:14,border:"1px solid "+T.bd,background:T.cd}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                <span style={{fontSize:9,color:T.td,textTransform:"uppercase"}}>{m.l}<Tip text={m.ht} sz={12}/></span>
                <MiniGauge v={m.v} sz={28} sw={2}/>
              </div>
              <div style={{fontSize:18,fontWeight:700,color:rc(m.v,T)}}>{m.v}%</div>
              <ProgressBar v={m.v} h={3}/>
            </div>
          ):(
            <div key={m.k} style={{padding:16,borderRadius:14,border:"1px dashed "+T.bd,background:T.sf,opacity:0.7}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                <span style={{fontSize:9,color:T.td,textTransform:"uppercase"}}>{m.l}</span>
              </div>
              <div style={{fontSize:13,fontWeight:600,color:T.td,marginBottom:4}}>Not measured</div>
              <div style={{fontSize:10,color:T.tm,lineHeight:1.4}}>{m.tip}</div>
            </div>
          );
        })}
      </div>

      <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:16,padding:"6px 0",fontSize:11,color:T.td}}>
        <span><span style={{color:T.tm}}>Revenue</span> <span style={{fontWeight:600,color:T.tx}}>{fD(ini.rev)}</span><Tip text="Total revenue value tied to this initiative." icon="i" sz={12}/></span>
        <span style={{color:T.bd}}>{String.fromCharCode(124)}</span>
        <span><span style={{color:T.tm}}>Risk</span> <span style={{fontWeight:600,color:T.am}}>{fD(mr)}</span><Tip text="Revenue at risk due to readiness gaps. Calculated as Revenue \u00D7 (1 \u2212 Readiness%)." icon="i" sz={12}/></span>
        <span style={{color:T.bd}}>{String.fromCharCode(124)}</span>
        <span><span style={{color:T.tm}}>Timeline</span> <span style={{fontWeight:500,color:T.tx}}>{function(){var s=ini.sd&&ini.sd!=="TBD",e=ini.td&&ini.td!=="TBD";if(s&&e)return ini.sd+" "+String.fromCharCode(183)+" "+ini.td;if(e)return "Target "+ini.td;if(s)return "Start "+ini.sd;return "Not set";}()}</span></span>
      </div>

      <div style={{marginBottom:20}}><TabBar tabs={(function(){
        var hasAreas=ini.depts.some(function(d){return d.areas;});
        var multiLoc=ini.depts.length>1;
        var t=["Overview"];
        if(multiLoc)t.push("Locations");
        if(hasAreas)t.push("Store Layout");
        t.push("Gaps & Bottlenecks","Recommendations","Simulation","Risk & Actions","Cert Pipeline","Mobility","Progress");
        return t;
      })()} a={tab} on={sTab}/></div>

      {/* â”€â”€â”€ OVERVIEW TAB â”€â”€â”€ */}
      {tab==="Overview"&&(
        <div style={{borderRadius:14,border:"1px solid "+T.bd,overflow:"hidden"}}>
          <div style={{padding:"12px 16px",borderBottom:"1px solid "+T.bd,display:"flex",justifyContent:"space-between"}}><h3 style={{fontSize:13,fontWeight:600,margin:0}}>Role Requirements</h3><span style={{fontSize:12,color:T.td}}>{tql}/{trq} filled</span></div>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead><tr style={{borderBottom:"1px solid "+T.bd}}>
              {[{h:"Role"},{h:"Criticality",t:"How critical this role is to operations. Essential roles weigh more in readiness."},{h:"Required"},{h:"Qualified"},{h:"Surplus / Gap",t:"Positive means overstaffed, negative means unfilled positions."},{h:"Readiness"}].map(function(c){return <th key={c.h} style={{padding:"8px 14px",fontSize:10,color:T.td,textTransform:"uppercase",textAlign:"left"}}>{c.h}{c.t&&<Tip text={c.t} sz={12}/>}</th>;})}
            </tr></thead>
            <tbody>{mergedRoles.map(function(r,idx){
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
        /* Compute per-dept stats (handles both flat roles and areas) */
        var deptStats=ini.depts.map(function(dept){
          var dR=deptRd(dept);
          var dS=deptStaff(dept);
          var dReq=0,dFill=0;
          if(dept.areas){
            dept.areas.forEach(function(a){(a.roles||[]).forEach(function(r){dReq+=r.rq;dFill+=r.ql;});});
          }else{
            (dept.roles||[]).forEach(function(r){dReq+=r.rq;dFill+=r.ql;});
          }
          var surplus=dFill-dReq;
          return {dept:dept,rd:dR,staff:dS,req:dReq,filled:dFill,surplus:surplus};
        });
        /* Sort by readiness ascending (worst first) for ranking */
        var ranked=deptStats.slice().sort(function(a,b){return a.rd-b.rd;});
        return (
          <div>
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
                      {ds.dept.areas?(
                        /* Area-based: show compact summary, detail is in Store Layout tab */
                        <div style={{padding:"10px 16px"}}>
                          <div style={{fontSize:10,color:T.td,textTransform:"uppercase",letterSpacing:0.5,marginBottom:6}}>{ds.dept.areas.length} Areas</div>
                          <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                            {ds.dept.areas.map(function(area,ai){
                              var aR=areaRd(area);
                              return (
                                <div key={ai} style={{display:"flex",alignItems:"center",gap:5,padding:"4px 10px",borderRadius:6,background:T.sa,border:"1px solid "+T.bd}}>
                                  <div style={{width:6,height:6,borderRadius:3,background:statusClr(aR)}}/>
                                  <span style={{fontSize:11,fontWeight:500}}>{area.anm}</span>
                                  <span style={{fontSize:10,fontWeight:600,color:rc(aR,T)}}>{aR}%</span>
                                </div>
                              );
                            })}
                          </div>
                          <div style={{fontSize:10,color:T.tm,marginTop:6}}>See Store Layout tab for full breakdown</div>
                        </div>
                      ):(
                        /* Flat roles layout */
                        <div>
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
                      )}
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

      {/* ─── STORE LAYOUT TAB — Card Grid + Detail Panel ─── */}
      {tab==="Store Layout"&&(function(){
        var areaDepts=ini.depts.filter(function(d){return d.areas;});
        var flatDepts=ini.depts.filter(function(d){return !d.areas;});
        /* Cross-location area index */
        var areaIndex={};
        areaDepts.forEach(function(d){
          d.areas.forEach(function(a){
            if(!areaIndex[a.anm]){areaIndex[a.anm]={anm:a.anm,depts:[]};}
            var aReq=0,aFill=0;
            (a.roles||[]).forEach(function(r){aReq+=r.rq;aFill+=r.ql;});
            areaIndex[a.anm].depts.push({dn:d.dn,did:d.did,rd:areaRd(a),staff:areaStaff(a),req:aReq,fill:aFill,roles:a.roles||[]});
          });
        });
        var allAreaNames=Object.keys(areaIndex);

        /* Auto-select first location */
        var selDept=(function(){
          var locId=selLoc||(areaDepts[0]&&areaDepts[0].did);
          var found=areaDepts.find(function(d){return d.did===locId;});
          return found||areaDepts[0]||null;
        })();

        return (
          <div>
            {/* ── ZONE 1: Compact Location Selector Bar ── */}
            {areaDepts.length>0&&selDept&&(function(){
              var dept=selDept;
              var dR=deptRd(dept);
              var dSt=deptStaff(dept);
              var totalReq=0,totalFill=0,totalGap=0;
              dept.areas.forEach(function(a){(a.roles||[]).forEach(function(r){totalReq+=r.rq;totalFill+=r.ql;totalGap+=r.gp;});});
              return (
                <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20,flexWrap:"wrap"}}>
                  <div style={{position:"relative"}}>
                    <select value={dept.did} onChange={function(e){sSelLoc(e.target.value);sSelArea(null);}} style={{padding:"8px 32px 8px 12px",borderRadius:8,border:"1px solid "+T.bd,background:T.sf,color:T.tx,fontSize:13,fontWeight:600,appearance:"none",WebkitAppearance:"none",cursor:"pointer",outline:"none",minWidth:180}}>
                      {areaDepts.map(function(d){return <option key={d.did} value={d.did}>{d.dn}</option>;})}
                    </select>
                    <div style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",pointerEvents:"none",fontSize:9,color:T.tm}}>{String.fromCharCode(9660)}</div>
                  </div>
                  <div style={{width:8,height:8,borderRadius:4,background:statusClr(dR),boxShadow:"0 0 6px "+statusClr(dR)+"60"}}/>
                  <span style={{fontSize:15,fontWeight:700,color:statusClr(dR),fontFamily:"monospace"}}>{dR}%</span>
                  <span style={{fontSize:11,color:T.tm,fontFamily:"monospace"}}>{totalFill}/{totalReq} staff</span>
                  <span style={{fontSize:11,color:T.tm,fontFamily:"monospace"}}>{dept.areas.length} areas</span>
                  {totalGap>0&&<span style={{fontSize:11,color:T.rd,fontFamily:"monospace",fontWeight:600}}>{String.fromCharCode(8722)}{totalGap} gap{totalGap!==1?"s":""}</span>}
                </div>
              );
            })()}

            {/* ── ZONE 2: 3D Floor Plan ── */}
            {selDept&&(function(){
              var dept=selDept;
              var activeArea=selArea||(function(){var g=dept.areas.find(function(a){var gap=0;(a.roles||[]).forEach(function(r){gap+=r.gp;});return gap>0;});return g?g.aid:dept.areas[0]?dept.areas[0].aid:null;})();

              return (
                <div style={{marginBottom:20}}>
                  <FloorPlan3D
                    dept={dept}
                    activeArea={activeArea}
                    hovArea={hovArea}
                    onSelectArea={function(aid){sSelArea(activeArea===aid?null:aid);}}
                    onHoverArea={sHovArea}
                    T={T}
                    statusClrFn={statusClr}
                    areaRdFn={areaRd}
                    areaStaffFn={areaStaff}
                    areaSkillRdFn={areaSkillRd}
                    areaCertRdFn={areaCertRd}
                  />

                  {/* ── ZONE 3: Detail Panel ── */}
                  {activeArea&&(function(){
                    var area=dept.areas.find(function(a){return a.aid===activeArea;});
                    if(!area)return null;
                    var aR=areaRd(area);
                    var aSt=areaStaff(area);
                    var aSk=areaSkillRd(area);
                    var aCt=areaCertRd(area);
                    var skReqs=area.skillReqs||[];
                    var ctReqs=area.certReqs||[];
                    var hasReqs=skReqs.length>0||ctReqs.length>0;

                    var aReqD=0,aFillD=0;
                    (area.roles||[]).forEach(function(r){aReqD+=r.rq;aFillD+=r.ql;});
                    var aGapD=aReqD-aFillD;

                    return (
                      <div style={{borderTop:"2px solid "+T.ac,borderRadius:"0 0 12px 12px",background:T.cd,padding:"16px 20px",marginTop:4}}>
                        {/* Panel header */}
                        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
                          <div style={{display:"flex",alignItems:"center",gap:10}}>
                            <span style={{fontSize:14,fontWeight:600}}>{area.anm}</span>
                            <span style={{fontSize:12,fontWeight:700,color:statusClr(aR),fontFamily:"monospace"}}>{aR}% ready</span>
                            <span style={{fontSize:10,color:T.tm,fontFamily:"monospace"}}>{aFillD}/{aReqD} filled{aGapD>0?" "+String.fromCharCode(183)+" "+aGapD+" gap"+(aGapD!==1?"s":""):""}</span>
                          </div>
                        </div>
                        {/* Two-column layout */}
                        <div style={{display:"flex",gap:24}}>
                          {/* Left: Roles (60%) */}
                          <div style={{flex:3,minWidth:0}}>
                            <div style={{fontSize:9,color:T.td,fontFamily:"monospace",letterSpacing:0.5,marginBottom:6}}>ROLES</div>
                            {(area.roles||[]).map(function(r,ri){
                              var rPct=r.rq>0?Math.round(r.ql/r.rq*100):100;
                              var rClr=statusClr(rPct);
                              var rGap=r.rq-r.ql;
                              var crClr=r.cr==="Essential"?T.rd:r.cr==="Important"?T.am:T.gn;
                              return (
                                <div key={ri} style={{display:"flex",alignItems:"center",gap:8,padding:"5px 0",borderBottom:ri<(area.roles||[]).length-1?"1px solid "+T.bd+"15":"none"}}>
                                  <div style={{width:3,height:16,borderRadius:1.5,background:crClr,flexShrink:0}} title={r.cr}/>
                                  <span style={{fontSize:11,fontWeight:500,width:130,flexShrink:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.cn}</span>
                                  <div style={{flex:1,height:4,borderRadius:2,background:T.sa,overflow:"hidden"}}>
                                    <div style={{height:"100%",width:Math.min(rPct,100)+"%",borderRadius:2,background:rClr,transition:"width 0.4s"}}/>
                                  </div>
                                  <span style={{fontSize:9,fontFamily:"monospace",color:T.tm,minWidth:32,textAlign:"right"}}>{r.ql}/{r.rq}</span>
                                  <span style={{fontSize:9,fontFamily:"monospace",color:rClr,fontWeight:600,minWidth:28,textAlign:"right"}}>{rPct}%</span>
                                  {rGap>0?<span style={{fontSize:8,fontFamily:"monospace",color:T.rd,fontWeight:600,minWidth:20,textAlign:"right"}}>{String.fromCharCode(8722)}{rGap}</span>:<span style={{minWidth:20}}/>}
                                </div>
                              );
                            })}
                          </div>
                          {/* Right: Requirements (40%) */}
                          {hasReqs&&(
                            <div style={{flex:2,minWidth:0,paddingLeft:16,borderLeft:"1px solid "+T.bd+"20"}}>
                              {skReqs.length>0&&(
                                <div style={{marginBottom:12}}>
                                  <div style={{fontSize:9,color:T.td,fontFamily:"monospace",letterSpacing:0.5,marginBottom:6}}>SKILLS</div>
                                  <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                                    {skReqs.map(function(sk){
                                      var skName=typeof sk==="string"?sk:sk.s;
                                      var skLvl=typeof sk==="string"?null:sk.lvl;
                                      return (
                                        <span key={skName} style={{fontSize:9,padding:"3px 8px",borderRadius:6,background:T.ac+"12",border:"1px solid "+T.ac+"20",color:T.ac,fontFamily:"monospace",display:"inline-flex",alignItems:"center",gap:3}}>
                                          {skName}
                                          {skLvl&&<span style={{display:"inline-flex",gap:1,marginLeft:2}}>{[1,2,3,4,5].map(function(lv){return <span key={lv} style={{width:3,height:3,borderRadius:2,background:lv<=skLvl?T.ac:T.ac+"25"}}/>;})}</span>}
                                        </span>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}
                              {ctReqs.length>0&&(
                                <div>
                                  <div style={{fontSize:9,color:T.td,fontFamily:"monospace",letterSpacing:0.5,marginBottom:6}}>CERTIFICATIONS</div>
                                  <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                                    {ctReqs.map(function(ct){
                                      var ctName=typeof ct==="string"?ct:ct.c;
                                      var ctCr=typeof ct==="string"?null:ct.cr;
                                      var ctClr=ctCr==="Essential"?T.rd:ctCr==="Important"?T.am:T.am;
                                      return (
                                        <span key={ctName} style={{fontSize:9,padding:"3px 8px",borderRadius:6,background:ctClr+"12",border:"1px solid "+ctClr+"20",color:ctClr,fontFamily:"monospace",display:"inline-flex",alignItems:"center",gap:3}}>
                                          {ctName}
                                          {ctCr&&<span style={{fontSize:7,opacity:0.7}}>({ctCr})</span>}
                                        </span>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              );
            })()}

            {/* ── ZONE 4: Cross-Location Heatmap Matrix ── */}
            {areaDepts.length>1&&allAreaNames.length>0&&(
              <div style={{borderRadius:14,border:"1px solid "+T.bd,overflow:"auto",marginBottom:20}}>
                <div style={{padding:"14px 20px",borderBottom:"1px solid "+T.bd}}><h3 style={{fontSize:14,fontWeight:600,margin:0}}>Area Heatmap</h3><p style={{fontSize:11,color:T.tm,margin:"4px 0 0"}}>Areas x Locations - color = readiness %</p></div>
                <div style={{overflowX:"auto",padding:12}}>
                  <table style={{borderCollapse:"collapse",minWidth:"100%"}}>
                    <thead><tr>
                      <th style={{padding:"8px 12px",fontSize:10,color:T.td,textAlign:"left",position:"sticky",left:0,background:T.cd,zIndex:1}}>Area</th>
                      {areaDepts.map(function(d){return <th key={d.did} style={{padding:"8px 10px",fontSize:10,color:T.td,textAlign:"center",whiteSpace:"nowrap"}}>{d.dn}</th>;})}
                      <th style={{padding:"8px 10px",fontSize:10,color:T.td,textAlign:"center",whiteSpace:"nowrap"}}>AVG</th>
                    </tr></thead>
                    <tbody>{allAreaNames.map(function(anm){
                      var entries=areaIndex[anm].depts;
                      var allRolesInArea=[];
                      entries.forEach(function(e){e.roles.forEach(function(r){allRolesInArea.push(r);});});
                      var aggRd=wRd(allRolesInArea);
                      var byDid={};
                      entries.forEach(function(e){byDid[e.did]=e;});
                      return (
                        <tr key={anm}>
                          <td style={{padding:"8px 12px",fontSize:12,fontWeight:500,whiteSpace:"nowrap",position:"sticky",left:0,background:T.cd,zIndex:1}}>{anm}</td>
                          {areaDepts.map(function(d){
                            var e=byDid[d.did];
                            if(!e)return <td key={d.did} style={{padding:"6px 10px",textAlign:"center"}}><span style={{fontSize:10,color:T.td}}>-</span></td>;
                            var bg=e.rd>=85?T.gd:e.rd>=60?T.amd:T.rdd;
                            var fg=e.rd>=85?T.gn:e.rd>=60?T.am:T.rd;
                            return (
                              <td key={d.did} style={{padding:"6px 10px",textAlign:"center"}}>
                                <div style={{display:"inline-flex",alignItems:"center",justifyContent:"center",minWidth:44,height:28,borderRadius:6,background:bg,color:fg,fontSize:12,fontWeight:600,padding:"0 6px"}}>{e.rd}%</div>
                                <div style={{fontSize:8,color:T.tm,marginTop:1}}>{e.fill}/{e.req}</div>
                              </td>
                            );
                          })}
                          <td style={{padding:"6px 10px",textAlign:"center"}}>
                            <div style={{display:"inline-flex",alignItems:"center",justifyContent:"center",minWidth:44,height:28,borderRadius:6,background:aggRd>=85?T.gd:aggRd>=60?T.amd:T.rdd,color:aggRd>=85?T.gn:aggRd>=60?T.am:T.rd,fontSize:12,fontWeight:600,padding:"0 6px"}}>{aggRd}%</div>
                          </td>
                        </tr>
                      );
                    })}</tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Flat locations note */}
            {flatDepts.length>0&&(
              <div style={{padding:"10px 16px",borderRadius:8,border:"1px dashed "+T.bd,display:"flex",alignItems:"center",gap:8}}>
                <div style={{width:6,height:6,borderRadius:3,background:T.td,opacity:0.5}}/>
                <span style={{fontSize:11,color:T.tm}}>{flatDepts.length} location{flatDepts.length!==1?"s":""} without layout: </span>
                <span style={{fontSize:11,color:T.td,fontFamily:"monospace"}}>{flatDepts.map(function(d){return d.dn;}).join(", ")}</span>
              </div>
            )}
          </div>
        );
      })()}

      {/* â"€â"€â"€ GAPS TAB â"€â"€â"€ */}
      {tab==="Gaps & Bottlenecks"&&(function(){
        var hasAreas=ini.depts.some(function(d){return d.areas;});
        var areaDepts2=ini.depts.filter(function(d){return d.areas;});
        var gapDept=(function(){
          if(!hasAreas)return null;
          var locId=selLoc||areaDepts2[0]&&areaDepts2[0].did;
          return areaDepts2.find(function(d){return d.did===locId;})||areaDepts2[0]||null;
        })();
        /* Collect bottleneck roles for selected location or all */
        var gapRoles=[];
        if(gapDept&&gapDept.areas){
          gapDept.areas.forEach(function(a){
            (a.roles||[]).forEach(function(r){
              if(r.gp>0)gapRoles.push({cn:r.cn,cr:r.cr,rq:r.rq,ql:r.ql,gp:r.gp,area:a.anm});
            });
          });
        }else{
          bn.forEach(function(b){gapRoles.push({cn:b.cn,cr:b.cr,rq:b.rq,ql:b.ql,gp:b.gp,area:null});});
        }
        gapRoles.sort(function(a,b){return b.gp*cw(b.cr)-a.gp*cw(a.cr);});
        /* Collect skill/cert gaps per area */
        var areaGaps=[];
        if(gapDept&&gapDept.areas){
          gapDept.areas.forEach(function(a){
            var aGap={anm:a.anm,skills:a.skillReqs||[],certs:a.certReqs||[],staffGap:0,totalReq:0};
            (a.roles||[]).forEach(function(r){aGap.staffGap+=r.gp;aGap.totalReq+=r.rq;});
            areaGaps.push(aGap);
          });
        }

        return (
        <div>
          {/* Location selector for area-based initiatives */}
          {hasAreas&&areaDepts2.length>0&&(
            <div style={{marginBottom:14,display:"flex",alignItems:"center",gap:12}}>
              <div style={{position:"relative",flex:1,maxWidth:320}}>
                <select value={gapDept?gapDept.did:""} onChange={function(e){sSelLoc(e.target.value);}} style={{width:"100%",padding:"10px 36px 10px 14px",borderRadius:10,border:"1px solid "+T.bd,background:T.sf,color:T.tx,fontSize:14,fontWeight:600,appearance:"none",WebkitAppearance:"none",cursor:"pointer",outline:"none",letterSpacing:0.3}}>
                  {areaDepts2.map(function(d){
                    var dr=deptRd(d);
                    return <option key={d.did} value={d.did}>{d.dn+" "+String.fromCharCode(183)+" "+dr+"% ready"}</option>;
                  })}
                </select>
                <div style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",pointerEvents:"none",fontSize:10,color:T.tm}}>{String.fromCharCode(9660)}</div>
              </div>
            </div>
          )}

          {/* Skill & cert requirements per area — always show both, nudge when empty */}
          {areaGaps.length>0&&(
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
              <div style={{borderRadius:14,border:"1px solid "+T.bd,overflow:"hidden"}}>
                <div style={{padding:"12px 16px",borderBottom:"1px solid "+T.bd}}><h3 style={{fontSize:13,fontWeight:600,margin:0}}>Skill Requirements by Area</h3></div>
                {areaGaps.some(function(ag){return ag.skills.length>0;})?areaGaps.map(function(ag,i){return ag.skills.length>0?(
                  <div key={i} style={{padding:"8px 16px",borderBottom:"1px solid "+T.bd+"08"}}>
                    <div style={{fontSize:11,fontWeight:600,color:T.ac,marginBottom:4}}>{ag.anm}</div>
                    <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                      {ag.skills.map(function(sk){
                        var skName=typeof sk==="string"?sk:sk.s;
                        var skLvl=typeof sk==="string"?null:sk.lvl;
                        return (
                          <span key={skName} style={{fontSize:10,padding:"2px 7px",borderRadius:4,background:T.ac+"12",border:"1px solid "+T.ac+"20",color:T.ac,display:"inline-flex",alignItems:"center",gap:3}}>
                            {skName}
                            {skLvl&&<span style={{display:"inline-flex",gap:1}}>{[1,2,3,4,5].map(function(lv){return <span key={lv} style={{width:3,height:3,borderRadius:2,background:lv<=skLvl?T.ac:T.ac+"30"}}/>;})}</span>}
                          </span>
                        );
                      })}
                    </div>
                    {ag.staffGap>0&&<div style={{fontSize:10,color:T.rd,marginTop:3}}>{ag.staffGap} staff gap{ag.staffGap>1?"s":""} {String.fromCharCode(8212)} skills not covered</div>}
                  </div>
                ):null;}):<div style={{padding:20,textAlign:"center"}}><div style={{fontSize:12,color:T.td,marginBottom:4}}>No skill requirements defined</div><div style={{fontSize:11,color:T.tm}}>Add skill requirements to areas for capability tracking</div></div>}
              </div>
              <div style={{borderRadius:14,border:"1px solid "+T.bd,overflow:"hidden"}}>
                <div style={{padding:"12px 16px",borderBottom:"1px solid "+T.bd}}><h3 style={{fontSize:13,fontWeight:600,margin:0}}>Certificate Requirements by Area</h3></div>
                {areaGaps.some(function(ag){return ag.certs.length>0;})?areaGaps.map(function(ag,i){return ag.certs.length>0?(
                  <div key={i} style={{padding:"8px 16px",borderBottom:"1px solid "+T.bd+"08"}}>
                    <div style={{fontSize:11,fontWeight:600,color:T.ac,marginBottom:4}}>{ag.anm}</div>
                    <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                      {ag.certs.map(function(ct){
                        var ctName=typeof ct==="string"?ct:ct.c;
                        var ctCr=typeof ct==="string"?null:ct.cr;
                        var ctClr=ctCr==="Essential"?T.rd:T.am;
                        return (
                          <span key={ctName} style={{fontSize:10,padding:"2px 7px",borderRadius:4,background:ctClr+"12",border:"1px solid "+ctClr+"20",color:ctClr}}>{ctName}{ctCr?" ("+ctCr+")":""}</span>
                        );
                      })}
                    </div>
                    {ag.staffGap>0&&<div style={{fontSize:10,color:T.rd,marginTop:3}}>{ag.staffGap} staff gap{ag.staffGap>1?"s":""} {String.fromCharCode(8212)} certs not covered</div>}
                  </div>
                ):null;}):<div style={{padding:20,textAlign:"center"}}><div style={{fontSize:12,color:T.td,marginBottom:4}}>No certificate requirements defined</div><div style={{fontSize:11,color:T.tm}}>Add certificate requirements to areas for compliance tracking</div></div>}
              </div>
            </div>
          )}

          {/* Initiative-level skill/cert gaps (non-area) — always show both, nudge when empty */}
          {!hasAreas&&(
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
              <div style={{borderRadius:14,border:"1px solid "+T.bd,overflow:"hidden"}}>
                <div style={{padding:"12px 16px",borderBottom:"1px solid "+T.bd}}><h3 style={{fontSize:13,fontWeight:600,margin:0}}>Skill Gaps {(ini.sg||[]).length>0?"("+(ini.sg||[]).length+")":""}</h3></div>
                {(ini.sg||[]).length>0?(ini.sg||[]).map(function(g,i){return (
                  <div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 16px",borderBottom:"1px solid "+T.bd+"08"}}>
                    <div style={{display:"flex",alignItems:"center",gap:8}}><div style={{width:7,height:7,borderRadius:4,background:ic2(g.i,T)}}/><span style={{fontSize:12}}>{g.s}</span></div>
                    <div style={{display:"flex",gap:6,alignItems:"center"}}><span style={{fontSize:11,color:T.tm}}>{g.n} ppl</span><Badge c={ic2(g.i,T)} b={ic2(g.i,T)+"15"}>{g.i}</Badge></div>
                  </div>
                );}):<div style={{padding:20,textAlign:"center"}}><div style={{fontSize:12,color:T.td,marginBottom:4}}>No skill gaps tracked</div><div style={{fontSize:11,color:T.tm}}>Define skill requirements to measure capability readiness</div></div>}
              </div>
              <div style={{borderRadius:14,border:"1px solid "+T.bd,overflow:"hidden"}}>
                <div style={{padding:"12px 16px",borderBottom:"1px solid "+T.bd}}><h3 style={{fontSize:13,fontWeight:600,margin:0}}>Certificate Gaps {(ini.cg||[]).length>0?"("+(ini.cg||[]).length+")":""}</h3></div>
                {(ini.cg||[]).length>0?(ini.cg||[]).map(function(g,i){return (
                  <div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 16px",borderBottom:"1px solid "+T.bd+"08"}}>
                    <div style={{display:"flex",alignItems:"center",gap:8}}><div style={{width:7,height:7,borderRadius:4,background:ic2(g.i,T)}}/><span style={{fontSize:12}}>{g.c}</span></div>
                    <div style={{display:"flex",gap:6,alignItems:"center"}}><span style={{fontSize:11,color:T.tm}}>{g.n} ppl</span><Badge c={ic2(g.i,T)} b={ic2(g.i,T)+"15"}>{g.i}</Badge></div>
                  </div>
                );}):<div style={{padding:20,textAlign:"center"}}><div style={{fontSize:12,color:T.td,marginBottom:4}}>No certificate gaps tracked</div><div style={{fontSize:11,color:T.tm}}>Add certificate requirements to measure compliance readiness</div></div>}
              </div>
            </div>
          )}

          {/* Bottleneck roles — per area when available */}
          <div style={{borderRadius:14,border:"1px solid "+T.bd,overflow:"hidden"}}>
            <div style={{padding:"12px 16px",borderBottom:"1px solid "+T.bd}}><h3 style={{fontSize:13,fontWeight:600,margin:0}}>Bottleneck Roles{gapDept?" \u2014 "+gapDept.dn:""}</h3></div>
            {gapRoles.length===0&&<div style={{padding:20,textAlign:"center",color:T.gn}}>All positions staffed</div>}
            {gapRoles.map(function(b,i){
              var rd2=b.rq>0?Math.round(b.ql/b.rq*100):100;
              return (
                <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 16px",borderBottom:"1px solid "+T.bd+"08"}}>
                  <div style={{width:22,height:22,borderRadius:6,background:T.ac+"20",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:T.ac,flexShrink:0}}>{i+1}</div>
                  <span style={{fontSize:12,fontWeight:500,width:130}}>{b.cn}</span>
                  {b.area&&<span style={{fontSize:10,color:T.ac,padding:"2px 6px",borderRadius:4,background:T.ac+"12",flexShrink:0}}>{b.area}</span>}
                  <Badge c={cc2(b.cr,T)} b={cc2(b.cr,T)+"15"}>{b.cr}</Badge>
                  <div style={{flex:1,display:"flex",alignItems:"center",gap:6}}><div style={{flex:1}}><ProgressBar v={rd2} h={4}/></div><span style={{fontSize:11,color:rc(rd2,T),width:32}}>{rd2}%</span></div>
                  <span style={{fontSize:12,fontWeight:600,color:T.rd}}>{b.gp} missing</span>
                </div>
              );
            })}
          </div>
        </div>
        );
      })()}

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
                  <button onClick={function(e){e.stopPropagation();doAssign(m.content.id);}} disabled={isAssigned} style={{padding:"6px 14px",borderRadius:8,border:"none",background:isAssigned?T.gd:T.ac,color:isAssigned?T.gn:"#FFFFFF",fontSize:11,fontWeight:600,cursor:isAssigned?"default":"pointer",fontFamily:"inherit"}}>{isAssigned?"Assigned":"Assign All"}</button>
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
      {tab==="Simulation"&&(function(){
        var hasAreas3=ini.depts.some(function(d){return d.areas;});
        var areaDepts3=ini.depts.filter(function(d){return d.areas;});
        var simDept=(function(){
          if(!hasAreas3)return null;
          var locId=selLoc||areaDepts3[0]&&areaDepts3[0].did;
          return areaDepts3.find(function(d){return d.did===locId;})||areaDepts3[0]||null;
        })();
        /* Filter actions to selected location context */
        var simFilteredActs=acts;
        if(simDept){
          var deptRoleNames={};
          (simDept.areas||[]).forEach(function(a){(a.roles||[]).forEach(function(r){deptRoleNames[r.cn]=true;});});
          simFilteredActs=acts.filter(function(a){
            if(a.desc.indexOf(simDept.dn)!==-1)return true;
            for(var k in deptRoleNames){if(a.desc.indexOf(k)!==-1)return true;}
            return !hasAreas3;
          });
          if(simFilteredActs.length===0)simFilteredActs=acts;
        }
        return (
        <div>
          {/* Location selector for area-based */}
          {hasAreas3&&areaDepts3.length>0&&(
            <div style={{marginBottom:14,display:"flex",alignItems:"center",gap:12}}>
              <div style={{position:"relative",flex:1,maxWidth:320}}>
                <select value={simDept?simDept.did:""} onChange={function(e){sSelLoc(e.target.value);}} style={{width:"100%",padding:"10px 36px 10px 14px",borderRadius:10,border:"1px solid "+T.bd,background:T.sf,color:T.tx,fontSize:14,fontWeight:600,appearance:"none",WebkitAppearance:"none",cursor:"pointer",outline:"none",letterSpacing:0.3}}>
                  {areaDepts3.map(function(d){
                    var dr=deptRd(d);
                    return <option key={d.did} value={d.did}>{d.dn+" "+String.fromCharCode(183)+" "+dr+"% ready"}</option>;
                  })}
                </select>
                <div style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",pointerEvents:"none",fontSize:10,color:T.tm}}>{String.fromCharCode(9660)}</div>
              </div>
            </div>
          )}
          {/* Simulation header with gauge */}
          <div style={{padding:20,borderRadius:14,border:"1px solid "+T.ac+"30",background:T.ad,marginBottom:16}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
              <div>
                <div style={{fontSize:11,color:T.td,textTransform:"uppercase",letterSpacing:0.5,marginBottom:4}}>Readiness Simulator{simDept?" \u2014 "+simDept.dn:""}</div>
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
              <h3 style={{fontSize:13,fontWeight:600,margin:0}}>Action Plan ({simFilteredActs.length} recommendations{simDept?" for "+simDept.dn:""})</h3>
              <span style={{fontSize:11,color:T.tm}}>{simActs.filter(function(idx){return simFilteredActs.indexOf(acts[idx])!==-1;}).length} selected</span>
            </div>
            {simFilteredActs.map(function(a){
              var i=acts.indexOf(a);
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
        );
      })()}

      {/* --- COST IMPACT TAB --- */}
      {tab==="Risk & Actions"&&<RiskActionsTab ini={ini} acts={acts} crd={crd} selLoc={selLoc} sSelLoc={sSelLoc}/>}

      {/* â”€â”€â”€ CERT PIPELINE TAB â”€â”€â”€ */}
      {tab==="Cert Pipeline"&&(
        <div>
          {(!ini.certs||ini.certs.length===0)&&(
            <div style={{padding:32,textAlign:"center"}}>
              <div style={{fontSize:32,marginBottom:12,opacity:0.3}}>&#x1F4CB;</div>
              <div style={{fontSize:14,fontWeight:600,color:T.td,marginBottom:6}}>{hCt?"No certificate status data yet":"Compliance not configured"}</div>
              <div style={{fontSize:12,color:T.tm,maxWidth:360,margin:"0 auto",lineHeight:1.5}}>{hCt?"Certificate requirements exist but no status data has been collected yet. Once employees start earning certificates, their progress will appear here.":"Add certificate requirements to areas or assign certificates to employees to start tracking compliance readiness across this initiative."}</div>
            </div>
          )}
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
      {tab==="Mobility"&&(function(){
        var iniFits=FITS.filter(function(f){return f.from===ini.id;});
        var hasAreas=ini.depts.some(function(d){return d.areas;});
        return (
        <div style={{borderRadius:14,border:"1px solid "+T.bd,overflow:"hidden"}}>
          <div style={{padding:"12px 16px",borderBottom:"1px solid "+T.bd}}>
            <h3 style={{fontSize:13,fontWeight:600,margin:0}}>Internal Mobility Suggestions</h3>
            <p style={{fontSize:11,color:T.tm,margin:"2px 0 0"}}>{hasAreas?"Cross-location and cross-area candidates with skill overlap. Shows tradeoff impact per area.":"Cross-location candidates with skill overlap. Shows tradeoff impact."}</p>
          </div>
          {iniFits.length===0&&<div style={{padding:32,textAlign:"center",color:T.td,fontSize:12}}>No mobility suggestions for this initiative yet.</div>}
          {iniFits.map(function(f,fi){
            var initials=f.nm.split(" ").map(function(w){return w[0];}).join("");
            var destLabel=f.loc+(f.area?" \u203A "+f.area:"");
            return (
              <div key={fi} style={{display:"flex",alignItems:"center",gap:14,padding:"14px 16px",borderBottom:"1px solid "+T.bd+"08"}}>
                <div style={{width:36,height:36,borderRadius:18,background:T.ac+"20",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,color:T.ac,flexShrink:0}}>{initials}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:13,fontWeight:500}}>{f.nm}</div>
                  <div style={{fontSize:11,color:T.td,marginTop:1}}>{f.cur}</div>
                  <div style={{fontSize:11,marginTop:2,display:"flex",alignItems:"center",gap:4}}>
                    <span style={{color:T.tm}}>{String.fromCharCode(8594)}</span>
                    <span style={{fontWeight:500,color:T.ac}}>{f.tgt}</span>
                    <span style={{color:T.tm}}>at</span>
                    <span style={{fontWeight:500,color:T.tx}}>{destLabel}</span>
                  </div>
                </div>
                <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:1,flexShrink:0}}>
                  <MiniGauge v={f.mp} sz={36} sw={2}/>
                  <span style={{fontSize:10,color:rc(f.mp,T)}}>{f.mp}%</span>
                </div>
                <div style={{flexShrink:0,width:180}}>
                  {(f.ms.length>0||f.mc.length>0)?(<div>
                    <div style={{fontSize:10,color:T.td,textTransform:"uppercase",marginBottom:3}}>Needs Training</div>
                    <div style={{display:"flex",gap:3,flexWrap:"wrap"}}>{f.ms.map(function(s,si){return <Badge key={si} c={T.am} b={T.amd}>{s}</Badge>;})}{f.mc.map(function(c,ci){return <Badge key={ci} c={T.rd} b={T.rdd}>{c}</Badge>;})}</div>
                  </div>):(<div style={{fontSize:10,color:T.gn,fontWeight:500}}>Ready {String.fromCharCode(10003)} No gaps</div>)}
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
        );
      })()}

      {/* ——— PROGRESS TAB — fixed 4-quarter year grid ——— */}
      {tab==="Progress"&&(function(){
        var hist=(ini.hist||[]).slice();
        /* Determine actual current quarter from calendar */
        var now=new Date();
        var nowQn=Math.ceil((now.getMonth()+1)/3);
        var nowYr=now.getFullYear();
        var nowLabel="Q"+nowQn+" "+nowYr;
        /* Build the current quarter snapshot from live-computed values */
        var curSnap={q:nowLabel,rd:crd,staff:sR,skill:skR!==null?skR:0,cert:cR!==null?cR:0,isCurrent:true};
        /* Check if hist already has an entry for this quarter */
        var existingIdx=-1;
        hist.forEach(function(h,i){if(h.q===nowLabel)existingIdx=i;});
        if(existingIdx>=0){
          /* Replace existing quarter with live data and mark as current */
          hist[existingIdx]=Object.assign({},hist[existingIdx],{rd:crd,staff:sR,skill:skR!==null?skR:hist[existingIdx].skill,cert:cR!==null?cR:hist[existingIdx].cert,isCurrent:true});
        } else {
          /* Append current quarter */
          hist.push(curSnap);
        }
        /* Parse target date for deadline marker */
        var targetQ=ini.td&&ini.td!=="TBD"?ini.td:null;
        /* Collect all years present in hist + target date year */
        var yearsSet={};
        hist.forEach(function(h){var ym=h.q.match(/(\d{4})/);if(ym)yearsSet[ym[1]]=true;});
        if(targetQ){var tym=targetQ.match(/(\d{4})/);if(tym)yearsSet[tym[1]]=true;}
        var years=Object.keys(yearsSet).sort();
        var selYear=progYear||(yearsSet[String(nowYr)]?String(nowYr):(years.length>0?years[years.length-1]:null));
        var showAll=selYear==="All";
        /* Build the 4-quarter grid for each visible year */
        var visibleYears=showAll?years:(selYear?[selYear]:years);
        /* Create a lookup from quarter label to hist entry */
        var histMap={};
        hist.forEach(function(h){histMap[h.q]=h;});

        return (
        <div>
          {/* Year selector — only show when multiple years exist */}
          {years.length>1&&(
            <div style={{display:"flex",justifyContent:"flex-end",marginBottom:12}}>
              <select value={selYear||""} onChange={function(e){sProgYear(e.target.value);}} style={{padding:"6px 12px",borderRadius:8,border:"1px solid "+T.bd,background:T.cd,color:T.tx,fontSize:12,fontFamily:"inherit",cursor:"pointer"}}>
                {years.map(function(y){return <option key={y} value={y}>{y}</option>;})}
                <option value="All">All years</option>
              </select>
            </div>
          )}

          {visibleYears.map(function(yr){
            var quarters=["Q1 "+yr,"Q2 "+yr,"Q3 "+yr,"Q4 "+yr];
            return (
              <div key={yr} style={{marginBottom:showAll?24:0}}>
                {showAll&&<h4 style={{fontSize:13,fontWeight:600,color:T.tm,marginBottom:8}}>{yr}</h4>}
                {/* Snapshot table */}
                <div style={{borderRadius:14,border:"1px solid "+T.bd,overflow:"hidden",marginBottom:14}}>
                  <div style={{padding:"12px 16px",borderBottom:"1px solid "+T.bd,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <h3 style={{fontSize:13,fontWeight:600,margin:0}}>Quarterly Progress{!showAll&&years.length<=1?" "+yr:""}</h3>
                    {/* Single-year selector when only header has room */}
                    {years.length>1&&!showAll&&(
                      <select value={selYear||""} onChange={function(e){sProgYear(e.target.value);}} style={{padding:"4px 10px",borderRadius:6,border:"1px solid "+T.bd,background:T.sf,color:T.tx,fontSize:11,fontFamily:"inherit",cursor:"pointer"}}>
                        {years.map(function(y){return <option key={y} value={y}>{y}</option>;})}
                        <option value="All">All years</option>
                      </select>
                    )}
                  </div>
                  <table style={{width:"100%",borderCollapse:"collapse"}}>
                    <thead><tr style={{borderBottom:"1px solid "+T.bd}}>
                      {["Quarter","Overall","Staffing","Skill","Certification","Change"].map(function(h){return <th key={h} style={{padding:"8px 14px",fontSize:10,color:T.td,textTransform:"uppercase",textAlign:"left"}}>{h}</th>;})}
                    </tr></thead>
                    <tbody>{quarters.map(function(qLabel,qi){
                      var h=histMap[qLabel];
                      var isCur=h&&!!h.isCurrent;
                      var isEmpty=!h;
                      var isTarget=targetQ===qLabel;
                      /* Find previous quarter's data for delta */
                      var prevLabel=qi>0?quarters[qi-1]:null;
                      var prevH=prevLabel?histMap[prevLabel]:null;
                      var delta=(h&&prevH)?h.rd-prevH.rd:0;
                      return (
                        <tr key={qLabel} style={{borderBottom:isTarget?"2px dashed "+T.ac:"1px solid "+T.bd+"08",background:isCur?T.ad:isEmpty?T.sa+"60":"transparent",opacity:isEmpty?0.5:1}}>
                          <td style={{padding:"8px 14px",fontSize:13,fontWeight:600,color:isEmpty?T.td:T.tx}}>
                            {qLabel.replace(" "+yr,"")}
                            {isCur&&<span style={{fontSize:9,marginLeft:6,color:T.ac,fontWeight:700,textTransform:"uppercase",letterSpacing:0.5}}>Current</span>}
                            {isTarget&&<span style={{fontSize:9,marginLeft:6,color:T.am,fontWeight:700,textTransform:"uppercase",letterSpacing:0.5}}>Target</span>}
                          </td>
                          {isEmpty?(
                            <td colSpan={5} style={{padding:"8px 14px",fontSize:11,color:T.td,fontStyle:"italic"}}>Upcoming</td>
                          ):(
                            [
                              <td key="ov" style={{padding:"8px 14px"}}><div style={{display:"flex",alignItems:"center",gap:6}}><div style={{width:50}}><ProgressBar v={h.rd} h={4}/></div><span style={{fontSize:12,fontWeight:600,color:rc(h.rd,T)}}>{h.rd}%</span></div></td>,
                              <td key="st" style={{padding:"8px 14px",fontSize:12,color:rc(h.staff,T)}}>{h.staff}%</td>,
                              <td key="sk" style={{padding:"8px 14px",fontSize:12,color:hSk?rc(h.skill,T):T.td}}>{hSk?h.skill+"%":"-"}</td>,
                              <td key="ct" style={{padding:"8px 14px",fontSize:12,color:hCt?rc(h.cert,T):T.td}}>{hCt?h.cert+"%":"-"}</td>,
                              <td key="dl" style={{padding:"8px 14px",fontSize:12,fontWeight:600,color:delta>0?T.gn:delta<0?T.rd:T.td}}>{prevH?(delta>0?"+"+delta+"%":delta<0?delta+"%":"\u2014"):"\u2014"}</td>
                            ]
                          )}
                        </tr>
                      );
                    })}</tbody>
                  </table>
                </div>
                {/* Bar chart — 4 fixed quarter slots */}
                <div style={{borderRadius:14,border:"1px solid "+T.bd,padding:20,marginBottom:showAll?0:0}}>
                  <h3 style={{fontSize:13,fontWeight:600,margin:"0 0 16px"}}>Readiness Trend</h3>
                  <div style={{display:"flex",alignItems:"flex-end",gap:12,height:120}}>
                    {quarters.map(function(qLabel){
                      var h=histMap[qLabel];
                      var isCur=h&&!!h.isCurrent;
                      var isEmpty=!h;
                      var isTarget=targetQ===qLabel;
                      return (
                        <div key={qLabel} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4,position:"relative"}}>
                          {isEmpty?(
                            <span style={{fontSize:11,color:T.td}}>{"\u2014"}</span>
                          ):(
                            <span style={{fontSize:11,fontWeight:isCur?700:600,color:rc(h.rd,T)}}>{h.rd}%</span>
                          )}
                          <div style={{width:"100%",height:isEmpty?12:Math.max(h.rd*1.1,8),borderRadius:6,background:isEmpty?T.sa:rc(h.rd,T)+(isCur?"40":"30"),position:"relative",border:isCur?"2px solid "+rc(h.rd,T):"none",transition:"height 0.3s ease"}}>
                            {!isEmpty&&<div style={{position:"absolute",bottom:0,left:0,right:0,height:"100%",borderRadius:isCur?4:6,background:rc(h.rd,T),opacity:isCur?0.85:0.6}}/>}
                          </div>
                          <span style={{fontSize:10,fontWeight:isCur?700:400,color:isCur?T.ac:T.td}}>{qLabel.replace(" "+yr,"")}</span>
                          {/* Target deadline marker — dashed line on right edge */}
                          {isTarget&&<div style={{position:"absolute",top:-8,right:-6,bottom:-4,width:0,borderRight:"2px dashed "+T.am,pointerEvents:"none"}}>
                            <span style={{position:"absolute",top:-2,right:4,fontSize:8,color:T.am,fontWeight:700,textTransform:"uppercase",letterSpacing:0.3,whiteSpace:"nowrap"}}>Target</span>
                          </div>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        );
      })()}
    </div>
  );
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
/* â•â•â• WIZARD PAGE (from V1 stable - kept compact) â•â•â• */
/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
