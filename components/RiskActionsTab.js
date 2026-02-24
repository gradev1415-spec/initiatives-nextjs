"use client";
import { useState } from "react";
import { useT } from "@/lib/theme";
import { fmt, fD, rc, cc2, cw } from "@/lib/utils";
import { allRoles, wRd, staffRd, skillRd, certRd, deptRd } from "@/lib/readiness";
import { genActions, matchContent } from "@/lib/actions";
import { LIBRARY, FITS } from "@/lib/data";
import Badge from "./Badge";
import ProgressBar from "./ProgressBar";
import Gauge from "./Gauge";
import MiniGauge from "./MiniGauge";
import TabBar from "./TabBar";
import Overlay from "./Overlay";
import useIsMobile from "@/lib/useIsMobile";

export default function RiskActionsTab(p){
  var T=useT();var mob=useIsMobile();
  var ini=p.ini,acts=p.acts,crd=p.crd,selLoc=p.selLoc,sSelLoc=p.sSelLoc;

  /* Location-aware filtering */
  var hasAreas=ini.depts.some(function(d){return d.areas;});
  var areaDepts=ini.depts.filter(function(d){return d.areas;});
  var riskDept=(function(){
    if(!hasAreas)return null;
    var locId=selLoc||areaDepts[0]&&areaDepts[0].did;
    return areaDepts.find(function(d){return d.did===locId;})||areaDepts[0]||null;
  })();

  /* === RISK FORECAST DATA === */
  var ar;
  if(riskDept&&riskDept.areas){
    ar=[];
    riskDept.areas.forEach(function(a){
      (a.roles||[]).forEach(function(r){ar.push({cn:r.cn,cr:r.cr,rq:r.rq,ql:r.ql,gp:r.gp,area:a.anm});});
    });
  }else{
    ar=allRoles(ini);
  }
  var totalRequired=0,totalGaps=0;
  var essentialGaps=[],importantGaps=[];
  ar.forEach(function(r){
    totalRequired+=r.rq;totalGaps+=r.gp;
    if(r.gp>0&&r.cr==="Essential") essentialGaps.push(r);
    if(r.gp>0&&r.cr==="Important") importantGaps.push(r);
  });

  /* Cert expiry forecast */
  var te30=0,te60=0,te90=0,totalCerts=0,validNow=0;
  (ini.certs||[]).forEach(function(c){
    te30+=c.exp30||0;te60+=c.exp60||0;
    totalCerts+=c.total;validNow+=c.valid;
  });
  te90=Math.round(te60*1.4);
  var certPctNow=totalCerts>0?Math.round(validNow/totalCerts*100):100;
  var certPct30=totalCerts>0?Math.round((validNow-te30)/totalCerts*100):100;
  var certPct60=totalCerts>0?Math.round((validNow-te30-te60)/totalCerts*100):100;
  var certPct90=totalCerts>0?Math.round((validNow-te30-te60-te90)/totalCerts*100):100;

  /* Skill gaps sorted by people affected (largest first) */
  var sortedSkillGaps=(ini.sg||[]).slice().sort(function(a,b){
    return b.n-a.n;
  });

  /* Content matches for quick wins */
  var quickWins=[];
  (ini.sg||[]).forEach(function(g){
    var found=LIBRARY.filter(function(l){return l.sk===g.s;});
    if(found.length>0) quickWins.push({gap:g.s,n:g.n,content:found[0],type:"skill"});
  });
  (ini.cg||[]).forEach(function(g){
    if(g.c==="All certs")return;
    var found=LIBRARY.filter(function(l){return l.ct&&(l.ct.indexOf(g.c.split(" ")[0])!==-1||l.ct===g.c);});
    if(found.length>0) quickWins.push({gap:g.c,n:g.n,content:found[0],type:"cert"});
  });

  /* Content gaps — no matching content exists */
  var contentGaps=[];
  (ini.sg||[]).forEach(function(g){
    var found=LIBRARY.filter(function(l){return l.sk===g.s;});
    if(found.length===0) contentGaps.push({gap:g.s,n:g.n});
  });

  /* Overall risk level */
  var riskScore=0;
  riskScore+=essentialGaps.reduce(function(s,r){return s+r.gp*3;},0);
  riskScore+=importantGaps.reduce(function(s,r){return s+r.gp;},0);
  riskScore+=te30*2;
  riskScore+=sortedSkillGaps.filter(function(g){return g.n>=10;}).length*3;
  var riskLevel=riskScore>=10?"Critical":riskScore>=5?"High":riskScore>=2?"Medium":"Low";
  var riskColor=riskLevel==="Critical"?T.rd:riskLevel==="High"?T.am:riskLevel==="Medium"?T.ac:T.gn;

  return (
    <div>
      {/* Location selector for area-based */}
      {hasAreas&&areaDepts.length>0&&(
        <div style={{marginBottom:14,display:"flex",alignItems:"center",gap:12}}>
          <div style={{position:"relative",flex:1,maxWidth:320}}>
            <select value={riskDept?riskDept.did:""} onChange={function(e){sSelLoc(e.target.value);}} style={{width:"100%",padding:"10px 36px 10px 14px",borderRadius:10,border:"1px solid "+T.bd,background:T.sf,color:T.tx,fontSize:14,fontWeight:600,appearance:"none",WebkitAppearance:"none",cursor:"pointer",outline:"none",letterSpacing:0.3}}>
              {areaDepts.map(function(d){
                var dr=deptRd(d);
                return <option key={d.did} value={d.did}>{d.dn+" "+String.fromCharCode(183)+" "+dr+"% ready"}</option>;
              })}
            </select>
            <div style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",pointerEvents:"none",fontSize:10,color:T.tm}}>{String.fromCharCode(9660)}</div>
          </div>
        </div>
      )}
      {/* Risk level banner */}
      <div style={{padding:mob?12:16,borderRadius:14,border:"1px solid "+riskColor+"30",background:riskColor+"10",marginBottom:16,display:"flex",alignItems:mob?"flex-start":"center",gap:mob?12:16,flexWrap:mob?"wrap":"nowrap"}}>
        <div style={{width:56,height:56,borderRadius:14,background:riskColor+"20",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
          <span style={{fontSize:24}}>{riskLevel==="Critical"?"!!":riskLevel==="High"?"!":riskLevel==="Medium"?"~":"OK"}</span>
        </div>
        <div style={{flex:1}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
            <span style={{fontSize:16,fontWeight:700,color:riskColor}}>{riskLevel} Risk</span>
            <Badge c={riskColor} b={riskColor+"15"}>Score: {riskScore}</Badge>
          </div>
          <div style={{fontSize:12,color:T.tm}}>
            {riskLevel==="Critical"?"Multiple Essential roles unfilled and certificates expiring. Immediate action required.":
             riskLevel==="High"?"Significant gaps in staffing or certifications need attention within 30 days.":
             riskLevel==="Medium"?"Some gaps exist but no immediate operational threat. Monitor and plan.":
             "Readiness is on track. Continue monitoring certificate renewals."}
          </div>
        </div>
        <div style={{textAlign:"center",flexShrink:0}}>
          <div style={{fontSize:10,color:T.td,textTransform:"uppercase"}}>Current Readiness</div>
          <div style={{fontSize:24,fontWeight:700,color:rc(crd,T)}}>{crd}%</div>
        </div>
      </div>

      {/* === RISK FORECAST SECTION === */}
      <div style={{marginBottom:8}}>
        <h3 style={{fontSize:14,fontWeight:700,margin:"0 0 12px"}}>Risk Forecast</h3>
      </div>

      <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr",gap:14,marginBottom:20}}>
        {/* Cert expiry timeline */}
        <div style={{borderRadius:14,border:"1px solid "+T.bd,overflow:"hidden"}}>
          <div style={{padding:"12px 16px",borderBottom:"1px solid "+T.bd}}>
            <h4 style={{fontSize:13,fontWeight:600,margin:0}}>Certificate Expiry Forecast</h4>
            <p style={{fontSize:10,color:T.tm,margin:"2px 0 0"}}>Predicted certification readiness if no action taken</p>
          </div>
          {totalCerts===0?(
            <div style={{padding:20,textAlign:"center",color:T.td,fontSize:12}}>No certificate data available</div>
          ):(
            <div style={{padding:16}}>
              <div style={{display:"flex",gap:8,marginBottom:16}}>
                {[{l:"Now",v:certPctNow,exp:0},{l:"30 days",v:certPct30,exp:te30},{l:"60 days",v:certPct60,exp:te60},{l:"90 days",v:certPct90,exp:te90}].map(function(p2,i){
                  var barH=Math.max(Math.round(p2.v*0.6),3);
                  return (
                    <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:0}}>
                      <span style={{fontSize:11,fontWeight:700,color:rc(p2.v,T),marginBottom:4}}>{p2.v}%</span>
                      <div style={{width:"100%",height:60,display:"flex",alignItems:"flex-end"}}>
                        <div style={{width:"100%",height:barH,borderRadius:4,background:rc(p2.v,T),opacity:0.45}}/>
                      </div>
                      <span style={{fontSize:9,color:T.td,marginTop:4}}>{p2.l}</span>
                      {p2.exp>0?<span style={{fontSize:9,color:T.am}}>-{p2.exp}</span>:<span style={{fontSize:9,color:"transparent"}}>-</span>}
                    </div>
                  );
                })}
              </div>
              {te30>0&&(
                <div style={{padding:10,borderRadius:8,background:T.amd,border:"1px solid "+T.am+"30",fontSize:11,color:T.am}}>
                  {te30} certificate{te30>1?"s":""} expiring within 30 days. Certification readiness will drop from {certPctNow}% to {certPct30}%.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Essential role exposure */}
        <div style={{borderRadius:14,border:"1px solid "+T.bd,overflow:"hidden"}}>
          <div style={{padding:"12px 16px",borderBottom:"1px solid "+T.bd}}>
            <h4 style={{fontSize:13,fontWeight:600,margin:0}}>Staffing Exposure{riskDept?" \u2014 "+riskDept.dn:""}</h4>
            <p style={{fontSize:10,color:T.tm,margin:"2px 0 0"}}>Unfilled positions by criticality</p>
          </div>
          {totalGaps===0?(
            <div style={{padding:20,textAlign:"center",color:T.gn,fontSize:12}}>All positions filled</div>
          ):(
            <div>
              {essentialGaps.length>0&&(
                <div style={{padding:"8px 16px",background:T.rdd,borderBottom:"1px solid "+T.rd+"15"}}>
                  <div style={{fontSize:10,fontWeight:700,color:T.rd,textTransform:"uppercase",marginBottom:6}}>Essential — Immediate risk</div>
                  {essentialGaps.map(function(r,i){
                    var pct=r.rq>0?Math.round(r.ql/r.rq*100):100;
                    return (
                      <div key={i} style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                        <span style={{fontSize:12,fontWeight:500,flex:1}}>{r.cn}{r.area?<span style={{fontSize:10,color:T.tm,fontWeight:400,marginLeft:4}}>{r.area}</span>:null}</span>
                        <span style={{fontSize:11,color:T.rd,fontWeight:600}}>{r.gp} missing</span>
                        <span style={{fontSize:10,color:T.td}}>{r.ql}/{r.rq}</span>
                        <div style={{width:40}}><ProgressBar v={pct} h={3}/></div>
                      </div>
                    );
                  })}
                </div>
              )}
              {importantGaps.length>0&&(
                <div style={{padding:"8px 16px",background:T.amd+"60",borderBottom:"1px solid "+T.am+"15"}}>
                  <div style={{fontSize:10,fontWeight:700,color:T.am,textTransform:"uppercase",marginBottom:6}}>Important — Plan within 30 days</div>
                  {importantGaps.map(function(r,i){
                    var pct=r.rq>0?Math.round(r.ql/r.rq*100):100;
                    return (
                      <div key={i} style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                        <span style={{fontSize:12,fontWeight:500,flex:1}}>{r.cn}{r.area?<span style={{fontSize:10,color:T.tm,fontWeight:400,marginLeft:4}}>{r.area}</span>:null}</span>
                        <span style={{fontSize:11,color:T.am,fontWeight:600}}>{r.gp} missing</span>
                        <span style={{fontSize:10,color:T.td}}>{r.ql}/{r.rq}</span>
                        <div style={{width:40}}><ProgressBar v={pct} h={3}/></div>
                      </div>
                    );
                  })}
                </div>
              )}
              <div style={{padding:10,fontSize:11,color:T.tm}}>
                Total: {totalGaps} unfilled position{totalGaps>1?"s":""} across {essentialGaps.length+importantGaps.length} role{(essentialGaps.length+importantGaps.length)>1?"s":""}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Skill Gap Exposure */}
      {sortedSkillGaps.length>0&&(
        <div style={{borderRadius:14,border:"1px solid "+T.bd,overflow:"hidden",marginBottom:20}}>
          <div style={{padding:"12px 16px",borderBottom:"1px solid "+T.bd}}>
            <h4 style={{fontSize:13,fontWeight:600,margin:0}}>Skill Gap Exposure ({sortedSkillGaps.length})</h4>
            <p style={{fontSize:10,color:T.tm,margin:"2px 0 0"}}>Skills not meeting target levels, ranked by people affected</p>
          </div>
          {sortedSkillGaps.map(function(g,i){
            var hasContent=LIBRARY.some(function(l){return l.sk===g.s;});
            var sevClr=g.n>=10?T.rd:g.n>=5?T.am:T.ac;
            return (
              <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 16px",borderBottom:"1px solid "+T.bd+"08"}}>
                <div style={{width:22,height:22,borderRadius:6,background:sevClr+"20",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:sevClr,flexShrink:0}}>{i+1}</div>
                <span style={{fontSize:12,fontWeight:500,flex:1}}>{g.s}</span>
                <span style={{fontSize:11,fontWeight:600,color:sevClr}}>{g.n} people</span>
                <Badge c={hasContent?T.gn:T.am} b={hasContent?T.gd:T.amd}>{hasContent?"Content available":"No content"}</Badge>
              </div>
            );
          })}
        </div>
      )}

      {/* === PROACTIVE ACTIONS SECTION === */}
      <div style={{marginBottom:8,marginTop:28,paddingTop:20,borderTop:"1px solid "+T.bd}}>
        <h3 style={{fontSize:14,fontWeight:700,margin:"0 0 4px"}}>Proactive Actions</h3>
        <p style={{fontSize:12,color:T.tm,margin:"0 0 12px"}}>Recommended next steps to close gaps, ranked by readiness impact</p>
      </div>

      {/* Quick wins — content already exists */}
      {quickWins.length>0&&(
        <div style={{borderRadius:14,border:"1px solid "+T.gn+"30",background:T.gd,overflow:"hidden",marginBottom:14}}>
          <div style={{padding:"12px 16px",borderBottom:"1px solid "+T.gn+"20"}}>
            <h4 style={{fontSize:13,fontWeight:600,margin:0,color:T.gn}}>Quick Wins — Assign Existing Content</h4>
            <p style={{fontSize:10,color:T.tm,margin:"2px 0 0"}}>These gaps can be closed using content already in your library</p>
          </div>
          {quickWins.map(function(w,i){
            var wClr=w.n>=10?T.rd:w.n>=5?T.am:T.ac;
            return (
              <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 16px",borderBottom:"1px solid "+T.gn+"10"}}>
                <div style={{width:28,height:28,borderRadius:7,background:w.type==="skill"?T.ac+"20":T.pu+"20",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,color:w.type==="skill"?T.ac:T.pu,flexShrink:0}}>{w.type==="skill"?"S":"C"}</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:12,fontWeight:500}}>Assign "{w.content.nm}" to {w.n} people</div>
                  <div style={{fontSize:10,color:T.tm}}>Closes {w.type} gap: {w.gap} | Duration: {w.content.dur}</div>
                </div>
                <span style={{fontSize:12,fontWeight:600,color:wClr}}>{w.n} ppl</span>
              </div>
            );
          })}
        </div>
      )}

      {/* Hiring actions */}
      {acts.filter(function(a){return a.tp==="hire";}).length>0&&(
        <div style={{borderRadius:14,border:"1px solid "+T.bd,overflow:"hidden",marginBottom:14}}>
          <div style={{padding:"12px 16px",borderBottom:"1px solid "+T.bd}}>
            <h4 style={{fontSize:13,fontWeight:600,margin:0}}>Hiring Needed</h4>
          </div>
          {acts.filter(function(a){return a.tp==="hire";}).map(function(a,i){
            return (
              <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 16px",borderBottom:"1px solid "+T.bd+"08"}}>
                <div style={{width:28,height:28,borderRadius:7,background:T.pu+"20",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,color:T.pu,flexShrink:0}}>H</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:12,fontWeight:500}}>{a.desc}</div>
                  <div style={{fontSize:10,color:T.tm}}>Criticality: {a.cr}</div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontSize:13,fontWeight:700,color:T.gn}}>+{a.lift}%</div>
                  <div style={{fontSize:9,color:T.td}}>readiness lift</div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Content gaps — need creation */}
      {contentGaps.length>0&&(
        <div style={{borderRadius:14,border:"1px solid "+T.am+"40",background:T.amd,overflow:"hidden"}}>
          <div style={{padding:"12px 16px",borderBottom:"1px solid "+T.am+"20"}}>
            <h4 style={{fontSize:13,fontWeight:600,margin:0,color:T.am}}>Content Gaps — Creation Needed</h4>
            <p style={{fontSize:10,color:T.tm,margin:"2px 0 0"}}>No existing learning content matches these skill requirements</p>
          </div>
          {contentGaps.map(function(g,i){
            return (
              <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 16px",borderBottom:"1px solid "+T.am+"10"}}>
                <div style={{width:28,height:28,borderRadius:7,background:T.am+"20",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,color:T.am}}>!</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:12,fontWeight:500}}>{g.gap}</div>
                  <div style={{fontSize:10,color:T.tm}}>{g.n} people need this skill — no content available to assign</div>
                </div>
                <span style={{fontSize:12,fontWeight:600,color:T.am}}>{g.n} ppl</span>
              </div>
            );
          })}
        </div>
      )}

      {/* All clear state */}
      {totalGaps===0&&sortedSkillGaps.length===0&&te30===0&&(
        <div style={{padding:32,textAlign:"center",borderRadius:14,border:"1px solid "+T.gn+"30",background:T.gd}}>
          <div style={{fontSize:18,fontWeight:700,color:T.gn,marginBottom:4}}>All Clear</div>
          <div style={{fontSize:12,color:T.tm}}>No immediate risks detected. All positions filled, no expiring certificates, and no critical skill gaps.</div>
        </div>
      )}
    </div>
  );
}


/* â•â•â• DETAIL PAGE â•â•â• */
/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
