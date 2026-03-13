"use client";
import { useState, useContext, useMemo } from "react";
import { ThemeCtx } from "@/lib/theme";
import { ALL_SKILLS, ALL_CERTS, matchCapSet, totalWorkforce } from "@/lib/data";
import MiniGauge from "@/components/MiniGauge";
import { rc } from "@/lib/utils";

function useT(){return useContext(ThemeCtx);}

/* Compute which initiatives/areas use a given capability set */
function getUsage(csId,initiatives){
  var uses=[];
  (initiatives||[]).forEach(function(ini){
    (ini.depts||[]).forEach(function(d){
      (d.areas||[]).forEach(function(a){
        if(a.capSetId===csId) uses.push({iniId:ini.id,iniNm:ini.nm,deptNm:d.dn,areaNm:a.anm});
      });
    });
  });
  return uses;
}

export default function CapabilitySetsPage(p){
  var T=useT();
  var _ed=useState(null); var editId=_ed[0],sEditId=_ed[1];
  var _dr=useState(null); var draft=_dr[0],sDraft=_dr[1];
  var _cf=useState(false); var showConfirm=_cf[0],sShowConfirm=_cf[1];
  var _adding=useState(false); var adding=_adding[0],sAdding=_adding[1];
  var _sel=useState(null); var selSet=_sel[0],sSelSet=_sel[1];
  var _collapsed=useState({}); var collapsed=_collapsed[0],sCollapsed=_collapsed[1];
  var _addLane=useState(false); var addingLane=_addLane[0],sAddingLane=_addLane[1];
  var _lnDraft=useState(""); var laneDraft=_lnDraft[0],sLaneDraft=_lnDraft[1];

  /* Compute match data for all sets */
  var matchData=useMemo(function(){
    var m={};
    p.capSets.forEach(function(cs){m[cs.id]=matchCapSet(cs,p.jpSkills);});
    return m;
  },[p.capSets,p.jpSkills]);
  var totalWf=useMemo(function(){return totalWorkforce(p.jpSkills);},[p.jpSkills]);

  /* Group sets by lane */
  var laneGroups=useMemo(function(){
    var groups=[];
    (p.lanes||[]).forEach(function(lane){
      var sets=p.capSets.filter(function(cs){return cs.lane===lane.id;});
      if(sets.length>0){
        var avgRd=Math.round(sets.reduce(function(a,cs){return a+(matchData[cs.id]?matchData[cs.id].readiness:0);},0)/sets.length);
        var totalPool=sets.reduce(function(a,cs){return a+(matchData[cs.id]?matchData[cs.id].pool:0);},0);
        var totalReqHc=sets.reduce(function(a,cs){return a+(cs.reqHc||0);},0);
        var totalFullMatch=sets.reduce(function(a,cs){return a+(matchData[cs.id]?matchData[cs.id].fullMatch:0);},0);
        groups.push({lane:lane,sets:sets,avgRd:avgRd,totalPool:totalPool,totalReqHc:totalReqHc,totalFullMatch:totalFullMatch});
      }
    });
    /* Uncategorized lane for sets without a lane */
    var uncategorized=p.capSets.filter(function(cs){return !cs.lane||!(p.lanes||[]).some(function(ln){return ln.id===cs.lane;});});
    if(uncategorized.length>0){
      var avgRd=Math.round(uncategorized.reduce(function(a,cs){return a+(matchData[cs.id]?matchData[cs.id].readiness:0);},0)/uncategorized.length);
      groups.push({lane:{id:"_uncat",nm:"Uncategorized",clr:T.td},sets:uncategorized,avgRd:avgRd,totalPool:0,totalReqHc:0,totalFullMatch:0});
    }
    return groups;
  },[p.capSets,p.lanes,matchData,T.td]);

  var laneColors=["#3182CE","#9F7AEA","#DD6B20","#38A169","#E53E3E","#D69E2E","#319795","#B83280"];

  function toggleLane(lnId){sCollapsed(function(prev){var n={};for(var k in prev)n[k]=prev[k];n[lnId]=!prev[lnId];return n;});}

  function startEdit(cs){
    sEditId(cs.id);
    sDraft({nm:cs.nm,desc:cs.desc||"",lane:cs.lane||"",reqHc:cs.reqHc||0,skillReqs:cs.skillReqs.map(function(s){return {s:s.s,lvl:s.lvl};}),certReqs:cs.certReqs.map(function(c){return {c:c.c};})});
  }
  function cancelEdit(){sEditId(null);sDraft(null);sShowConfirm(false);}

  function trySave(){
    var usage=getUsage(editId,p.initiatives);
    if(usage.length>0){sShowConfirm(true);return;}
    doSave();
  }
  function doSave(){
    p.setCS(function(prev){return prev.map(function(cs){
      if(cs.id!==editId)return cs;
      return {id:cs.id,nm:draft.nm,desc:draft.desc,lane:draft.lane,reqHc:draft.reqHc,skillReqs:draft.skillReqs,certReqs:draft.certReqs};
    });});
    sEditId(null);sDraft(null);sShowConfirm(false);
    if(p.onToast)p.onToast("Capability set updated");
  }

  function startAdd(laneId){
    sAdding(true);
    var newId="cs_"+Date.now();
    sEditId(newId);
    sDraft({nm:"",desc:"",lane:laneId||"",reqHc:0,skillReqs:[],certReqs:[],_isNew:true,_newId:newId});
  }
  function saveNew(){
    if(!draft.nm.trim())return;
    var newCs={id:draft._newId,nm:draft.nm.trim(),desc:draft.desc,lane:draft.lane,reqHc:draft.reqHc,skillReqs:draft.skillReqs,certReqs:draft.certReqs};
    p.setCS(function(prev){return prev.concat([newCs]);});
    sEditId(null);sDraft(null);sAdding(false);
    if(p.onToast)p.onToast("Capability set created");
  }
  function cancelAdd(){sEditId(null);sDraft(null);sAdding(false);}

  function deleteSet(csId){
    var usage=getUsage(csId,p.initiatives);
    if(usage.length>0){if(p.onToast)p.onToast("Cannot delete: set is used by "+usage.length+" area(s)");return;}
    p.setCS(function(prev){return prev.filter(function(cs){return cs.id!==csId;});});
    if(p.onToast)p.onToast("Capability set deleted");
  }

  function addLane(){
    if(!laneDraft.trim())return;
    var newLane={id:"ln_"+Date.now(),nm:laneDraft.trim(),clr:laneColors[(p.lanes||[]).length%laneColors.length]};
    p.setLanes(function(prev){return prev.concat([newLane]);});
    sLaneDraft("");sAddingLane(false);
    if(p.onToast)p.onToast("Swimlane created");
  }

  /* Draft mutation helpers */
  function addSkill(sk){
    if(!sk||draft.skillReqs.some(function(s){return s.s===sk;}))return;
    sDraft(function(d){return Object.assign({},d,{skillReqs:d.skillReqs.concat([{s:sk,lvl:3}])});});
  }
  function remSkill(sk){sDraft(function(d){return Object.assign({},d,{skillReqs:d.skillReqs.filter(function(s){return s.s!==sk;})});});}
  function setSkillLvl(sk,lvl){sDraft(function(d){return Object.assign({},d,{skillReqs:d.skillReqs.map(function(s){return s.s===sk?{s:s.s,lvl:lvl}:s;})});});}
  function addCert(ct){
    if(!ct||draft.certReqs.some(function(c){return c.c===ct;}))return;
    sDraft(function(d){return Object.assign({},d,{certReqs:d.certReqs.concat([{c:ct}])});});
  }
  function remCert(ct){sDraft(function(d){return Object.assign({},d,{certReqs:d.certReqs.filter(function(c){return c.c!==ct;})});});}

  var lvlColors=["",T.rd||"#E53E3E",T.am||"#DD6B20",T.yl||"#D69E2E",T.ac||"#3182CE",T.gn||"#38A169"];

  /* ——— Shared: render a set card ——— */
  function renderCard(cs){
    var usage=getUsage(cs.id,p.initiatives);
    var isEditing=editId===cs.id&&!draft._isNew;
    var md=matchData[cs.id]||{readiness:0,pool:0,fullMatch:0};
    var fillPct=cs.reqHc?Math.min(100,Math.round(md.fullMatch/cs.reqHc*100)):0;

    return (
      <div key={cs.id} style={{border:"1px solid "+T.bd,borderRadius:10,padding:14,marginBottom:8,background:T.sf,cursor:isEditing?undefined:"pointer"}} onClick={isEditing?undefined:function(){sSelSet(cs.id);}}>
        {isEditing ? renderEditMode(cs,usage) : (
          <div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
              <div style={{flex:1}}>
                <div style={{fontSize:13,fontWeight:600,marginBottom:1}}>{cs.nm}</div>
                {cs.desc&&<div style={{fontSize:10,color:T.td,marginBottom:6}}>{cs.desc}</div>}
              </div>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <div style={{textAlign:"center"}}>
                  <MiniGauge v={md.readiness} sz={30} sw={2.5} />
                  <div style={{fontSize:8,color:T.td,marginTop:1}}>{md.readiness}%</div>
                </div>
                <div style={{textAlign:"right",fontSize:9,color:T.td,lineHeight:"14px",minWidth:55}}>
                  <div>Pool: <span style={{fontWeight:600,color:T.tx}}>{md.pool}</span></div>
                  <div>Full: <span style={{fontWeight:600,color:T.gn}}>{md.fullMatch}</span>{cs.reqHc?<span style={{color:T.td}}>/{cs.reqHc}</span>:null}</div>
                </div>
                <div style={{display:"flex",gap:4}} onClick={function(e){e.stopPropagation();}}>
                  <button onClick={function(){startEdit(cs);}} style={{padding:"3px 10px",borderRadius:5,border:"1px solid "+T.bd,background:T.bg,cursor:"pointer",color:T.tx,fontSize:10,fontFamily:"inherit"}}>Edit</button>
                  <button onClick={function(){deleteSet(cs.id);}} style={{padding:"3px 10px",borderRadius:5,border:"1px solid "+(usage.length>0?T.bd:T.rd+"40"),background:T.bg,cursor:usage.length>0?"not-allowed":"pointer",color:usage.length>0?T.td:T.rd,fontSize:10,fontFamily:"inherit",opacity:usage.length>0?0.5:1}}>Del</button>
                </div>
              </div>
            </div>

            <div style={{display:"flex",flexWrap:"wrap",gap:4,marginBottom:4}}>
              {cs.skillReqs.map(function(sk){
                return (
                  <span key={sk.s} style={{display:"inline-flex",alignItems:"center",gap:3,padding:"2px 6px",borderRadius:4,background:T.ac+"12",fontSize:9,color:T.tx}}>
                    {sk.s}
                    <span style={{display:"inline-flex",gap:1}}>
                      {[1,2,3,4,5].map(function(l){return <span key={l} style={{width:4,height:4,borderRadius:2,background:l<=sk.lvl?lvlColors[sk.lvl]:T.bd}} />;})}
                    </span>
                  </span>
                );
              })}
              {cs.certReqs.map(function(ct){
                return <span key={ct.c} style={{padding:"2px 6px",borderRadius:4,background:"#9F7AEA12",fontSize:9,color:T.tx}}>{ct.c}</span>;
              })}
            </div>

            {/* Fill bar when reqHc is set */}
            {cs.reqHc>0&&(
              <div style={{display:"flex",alignItems:"center",gap:6,marginTop:4}}>
                <span style={{flex:1,height:4,borderRadius:2,background:T.bd+"40",overflow:"hidden"}}>
                  <span style={{display:"block",height:"100%",width:fillPct+"%",borderRadius:2,background:rc(fillPct,T),transition:"width 0.3s"}} />
                </span>
                <span style={{fontSize:9,color:T.td,whiteSpace:"nowrap"}}>{md.fullMatch}/{cs.reqHc} filled</span>
              </div>
            )}

            <div style={{fontSize:9,color:T.td,marginTop:4}}>
              {usage.length>0?"Used by "+usage.length+" area"+(usage.length!==1?"s":""):"Not in use"}
            </div>
          </div>
        )}
      </div>
    );
  }

  /* ——— Shared: render edit mode ——— */
  function renderEditMode(cs,usage){
    return (
      <div onClick={function(e){e.stopPropagation();}}>
        <div style={{display:"flex",gap:10,marginBottom:10}}>
          <div style={{flex:1}}>
            <label style={{fontSize:9,color:T.td,fontWeight:600,display:"block",marginBottom:2}}>NAME</label>
            <input value={draft.nm} onChange={function(e){sDraft(function(d){return Object.assign({},d,{nm:e.target.value});});}} style={{width:"100%",padding:"5px 8px",borderRadius:5,border:"1px solid "+T.bd,background:T.bg,color:T.tx,fontSize:12,fontFamily:"inherit",boxSizing:"border-box"}} />
          </div>
          <div style={{flex:2}}>
            <label style={{fontSize:9,color:T.td,fontWeight:600,display:"block",marginBottom:2}}>DESCRIPTION</label>
            <input value={draft.desc} onChange={function(e){sDraft(function(d){return Object.assign({},d,{desc:e.target.value});});}} style={{width:"100%",padding:"5px 8px",borderRadius:5,border:"1px solid "+T.bd,background:T.bg,color:T.tx,fontSize:12,fontFamily:"inherit",boxSizing:"border-box"}} />
          </div>
        </div>

        <div style={{display:"flex",gap:10,marginBottom:10}}>
          <div style={{width:120}}>
            <label style={{fontSize:9,color:T.td,fontWeight:600,display:"block",marginBottom:2}}>REQUIRED PEOPLE</label>
            <input type="number" min="0" value={draft.reqHc||""} onChange={function(e){sDraft(function(d){return Object.assign({},d,{reqHc:parseInt(e.target.value)||0});});}} placeholder="0" style={{width:"100%",padding:"5px 8px",borderRadius:5,border:"1px solid "+T.bd,background:T.bg,color:T.tx,fontSize:12,fontFamily:"inherit",boxSizing:"border-box"}} />
          </div>
          <div style={{width:160}}>
            <label style={{fontSize:9,color:T.td,fontWeight:600,display:"block",marginBottom:2}}>SWIMLANE</label>
            <select value={draft.lane||""} onChange={function(e){sDraft(function(d){return Object.assign({},d,{lane:e.target.value});});}} style={{width:"100%",padding:"5px 8px",borderRadius:5,border:"1px solid "+T.bd,background:T.bg,color:T.tx,fontSize:12,fontFamily:"inherit",boxSizing:"border-box"}}>
              <option value="">None</option>
              {(p.lanes||[]).map(function(ln){return <option key={ln.id} value={ln.id}>{ln.nm}</option>;})}
            </select>
          </div>
        </div>

        {/* Skills */}
        <div style={{marginBottom:10}}>
          <label style={{fontSize:9,color:T.td,fontWeight:600,display:"block",marginBottom:4}}>SKILLS</label>
          <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:6}}>
            {draft.skillReqs.map(function(sk){
              return (
                <div key={sk.s} style={{display:"flex",alignItems:"center",gap:3,padding:"3px 7px",borderRadius:5,background:T.ac+"14",border:"1px solid "+T.ac+"30",fontSize:10}}>
                  <span style={{color:T.tx}}>{sk.s}</span>
                  <span style={{display:"inline-flex",gap:2,marginLeft:3}}>
                    {[1,2,3,4,5].map(function(l){
                      return <span key={l} onClick={function(){setSkillLvl(sk.s,l);}} style={{width:7,height:7,borderRadius:4,background:l<=sk.lvl?lvlColors[sk.lvl]:T.bd,cursor:"pointer"}} />;
                    })}
                  </span>
                  <span style={{fontSize:8,color:T.td,marginLeft:2}}>L{sk.lvl}</span>
                  <span onClick={function(){remSkill(sk.s);}} style={{cursor:"pointer",color:T.td,fontSize:12,marginLeft:2,lineHeight:1}}>x</span>
                </div>
              );
            })}
          </div>
          <select value="" onChange={function(e){addSkill(e.target.value);}} style={{padding:"3px 7px",borderRadius:5,border:"1px solid "+T.bd,background:T.bg,color:T.td,fontSize:10,fontFamily:"inherit"}}>
            <option value="">+ Add skill...</option>
            {ALL_SKILLS.filter(function(s){return !draft.skillReqs.some(function(sk){return sk.s===s;});}).map(function(s){return <option key={s} value={s}>{s}</option>;})}
          </select>
        </div>

        {/* Certs */}
        <div style={{marginBottom:10}}>
          <label style={{fontSize:9,color:T.td,fontWeight:600,display:"block",marginBottom:4}}>CERTIFICATIONS</label>
          <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:6}}>
            {draft.certReqs.map(function(ct){
              return (
                <div key={ct.c} style={{display:"flex",alignItems:"center",gap:3,padding:"3px 7px",borderRadius:5,background:"#9F7AEA14",border:"1px solid #9F7AEA30",fontSize:10}}>
                  <span style={{color:T.tx}}>{ct.c}</span>
                  <span onClick={function(){remCert(ct.c);}} style={{cursor:"pointer",color:T.td,fontSize:12,lineHeight:1}}>x</span>
                </div>
              );
            })}
          </div>
          <select value="" onChange={function(e){addCert(e.target.value);}} style={{padding:"3px 7px",borderRadius:5,border:"1px solid "+T.bd,background:T.bg,color:T.td,fontSize:10,fontFamily:"inherit"}}>
            <option value="">+ Add certification...</option>
            {ALL_CERTS.filter(function(c){return !draft.certReqs.some(function(ct){return ct.c===c;});}).map(function(c){return <option key={c} value={c}>{c}</option>;})}
          </select>
        </div>

        {/* Usage info */}
        {usage&&usage.length>0&&(
          <div style={{padding:"6px 10px",borderRadius:6,background:T.am+"10",border:"1px solid "+T.am+"25",marginBottom:10,fontSize:10,color:T.td}}>
            <span style={{fontWeight:600,color:T.am}}>Used by {usage.length} area{usage.length!==1?"s":""}:</span>{" "}
            {usage.map(function(u,i){return (i>0?", ":"")+u.iniNm+" ("+u.areaNm+")";}).join("")}
          </div>
        )}

        {/* Confirm cascade dialog */}
        {showConfirm&&(
          <div style={{padding:"10px 14px",borderRadius:6,background:T.am+"12",border:"1px solid "+T.am+"30",marginBottom:10}}>
            <div style={{fontSize:11,fontWeight:600,color:T.am,marginBottom:4}}>Cascading Change</div>
            <div style={{fontSize:10,color:T.tx,marginBottom:6}}>
              This will affect <strong>{usage.length}</strong> area{usage.length!==1?"s":""}. Readiness scores will be recalculated.
            </div>
            <div style={{display:"flex",gap:6}}>
              <button onClick={doSave} style={{padding:"5px 14px",borderRadius:5,border:"none",background:T.ac,color:"#FFF",fontSize:10,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Confirm & Save</button>
              <button onClick={function(){sShowConfirm(false);}} style={{padding:"5px 14px",borderRadius:5,border:"1px solid "+T.bd,background:T.bg,color:T.tx,fontSize:10,cursor:"pointer",fontFamily:"inherit"}}>Cancel</button>
            </div>
          </div>
        )}

        {/* Action buttons */}
        {!showConfirm&&(
          <div style={{display:"flex",gap:6}}>
            <button onClick={trySave} style={{padding:"5px 14px",borderRadius:5,border:"none",background:T.ac,color:"#FFF",fontSize:10,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Save</button>
            <button onClick={cancelEdit} style={{padding:"5px 14px",borderRadius:5,border:"1px solid "+T.bd,background:T.bg,color:T.tx,fontSize:10,cursor:"pointer",fontFamily:"inherit"}}>Cancel</button>
          </div>
        )}
      </div>
    );
  }

  /* ——— Shared: render the add-new form ——— */
  function renderAddForm(){
    return (
      <div style={{border:"1px solid "+T.ac+"40",borderRadius:10,padding:14,marginBottom:8,background:T.sf}}>
        {renderEditMode(null,[])}
        <div style={{display:"flex",gap:6,marginTop:10}}>
          <button onClick={saveNew} disabled={!draft.nm.trim()} style={{padding:"5px 14px",borderRadius:5,border:"none",background:draft.nm.trim()?T.ac:"#AAA",color:"#FFF",fontSize:10,fontWeight:600,cursor:draft.nm.trim()?"pointer":"not-allowed",fontFamily:"inherit"}}>Create</button>
          <button onClick={cancelAdd} style={{padding:"5px 14px",borderRadius:5,border:"1px solid "+T.bd,background:T.bg,color:T.tx,fontSize:10,cursor:"pointer",fontFamily:"inherit"}}>Cancel</button>
        </div>
      </div>
    );
  }

  /* ——— Detail sub-view ——— */
  if(selSet){
    var cs=p.capSets.find(function(c){return c.id===selSet;});
    if(!cs){sSelSet(null);return null;}
    var md=matchData[cs.id]||{readiness:0,pool:0,fullMatch:0,total:totalWf,skills:[],certs:[]};
    var usage=getUsage(cs.id,p.initiatives);
    var fillPct=cs.reqHc?Math.min(100,Math.round(md.fullMatch/cs.reqHc*100)):null;
    var lane=(p.lanes||[]).find(function(ln){return ln.id===cs.lane;});

    return (
      <div style={{maxWidth:900,margin:"0 auto",padding:"32px 24px"}}>
        {/* Header */}
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:24}}>
          <button onClick={function(){sSelSet(null);}} style={{padding:"6px 14px",borderRadius:8,border:"1px solid "+T.bd,background:T.sf,cursor:"pointer",color:T.tx,fontSize:12,fontFamily:"inherit"}}>Back</button>
          <div style={{flex:1}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <h1 style={{fontSize:22,fontWeight:700,margin:0}}>{cs.nm}</h1>
              {lane&&<span style={{padding:"2px 8px",borderRadius:4,background:lane.clr+"18",color:lane.clr,fontSize:10,fontWeight:600}}>{lane.nm}</span>}
            </div>
            {cs.desc&&<p style={{fontSize:12,color:T.td,margin:"2px 0 0"}}>{cs.desc}</p>}
          </div>
          <MiniGauge v={md.readiness} sz={56} sw={4} />
        </div>

        {/* KPI row */}
        <div style={{display:"grid",gridTemplateColumns:cs.reqHc?"repeat(4,1fr)":"repeat(3,1fr)",gap:12,marginBottom:24}}>
          <div style={{padding:"16px",borderRadius:10,border:"1px solid "+T.bd,background:T.sf}}>
            <div style={{fontSize:10,color:T.td,fontWeight:600,marginBottom:4,textTransform:"uppercase",letterSpacing:"0.5px"}}>Set Readiness</div>
            <div style={{fontSize:28,fontWeight:700,color:rc(md.readiness,T)}}>{md.readiness}%</div>
            <div style={{fontSize:10,color:T.td,marginTop:2}}>Weighted skill + cert coverage</div>
          </div>
          <div style={{padding:"16px",borderRadius:10,border:"1px solid "+T.bd,background:T.sf}}>
            <div style={{fontSize:10,color:T.td,fontWeight:600,marginBottom:4,textTransform:"uppercase",letterSpacing:"0.5px"}}>Workforce Pool</div>
            <div style={{fontSize:28,fontWeight:700,color:T.ac}}>{md.pool}</div>
            <div style={{fontSize:10,color:T.td,marginTop:2}}>of {totalWf} have at least 1 match</div>
          </div>
          <div style={{padding:"16px",borderRadius:10,border:"1px solid "+T.bd,background:T.sf}}>
            <div style={{fontSize:10,color:T.td,fontWeight:600,marginBottom:4,textTransform:"uppercase",letterSpacing:"0.5px"}}>Full Matches</div>
            <div style={{fontSize:28,fontWeight:700,color:T.gn}}>{md.fullMatch}</div>
            <div style={{fontSize:10,color:T.td,marginTop:2}}>of {totalWf} meet all requirements</div>
          </div>
          {cs.reqHc>0&&(
            <div style={{padding:"16px",borderRadius:10,border:"1px solid "+T.bd,background:T.sf}}>
              <div style={{fontSize:10,color:T.td,fontWeight:600,marginBottom:4,textTransform:"uppercase",letterSpacing:"0.5px"}}>Staffing</div>
              <div style={{fontSize:28,fontWeight:700,color:rc(fillPct,T)}}>{md.fullMatch}<span style={{fontSize:16,fontWeight:400,color:T.td}}>/{cs.reqHc}</span></div>
              <div style={{marginTop:4,height:5,borderRadius:3,background:T.bd+"40",overflow:"hidden"}}>
                <div style={{height:"100%",width:fillPct+"%",borderRadius:3,background:rc(fillPct,T),transition:"width 0.3s"}} />
              </div>
            </div>
          )}
        </div>

        {/* Skills table */}
        <div style={{marginBottom:24}}>
          <h3 style={{fontSize:13,fontWeight:600,margin:"0 0 10px",color:T.tx}}>Skills Breakdown</h3>
          <div style={{border:"1px solid "+T.bd,borderRadius:10,overflow:"hidden",background:T.sf}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 100px 80px 80px 1fr",gap:0,padding:"8px 14px",background:T.bg,borderBottom:"1px solid "+T.bd,fontSize:10,fontWeight:600,color:T.td,textTransform:"uppercase",letterSpacing:"0.5px"}}>
              <span>Skill</span><span>Required</span><span style={{textAlign:"right"}}>Qualified</span><span style={{textAlign:"right"}}>Total</span><span style={{paddingLeft:12}}>Coverage</span>
            </div>
            {md.skills.map(function(sk){
              var barClr=rc(sk.pct,T);
              return (
                <div key={sk.s} style={{display:"grid",gridTemplateColumns:"1fr 100px 80px 80px 1fr",gap:0,padding:"10px 14px",borderBottom:"1px solid "+T.bd+"60",fontSize:12,alignItems:"center"}}>
                  <span style={{fontWeight:500,color:T.tx}}>{sk.s}</span>
                  <span style={{display:"flex",alignItems:"center",gap:4}}>
                    <span style={{display:"inline-flex",gap:2}}>
                      {[1,2,3,4,5].map(function(l){return <span key={l} style={{width:6,height:6,borderRadius:3,background:l<=sk.reqLvl?lvlColors[sk.reqLvl]:T.bd}} />;})}
                    </span>
                    <span style={{fontSize:10,color:T.td}}>L{sk.reqLvl}</span>
                  </span>
                  <span style={{textAlign:"right",fontWeight:600,color:T.tx}}>{sk.have}</span>
                  <span style={{textAlign:"right",color:T.td}}>{sk.total}</span>
                  <span style={{paddingLeft:12,display:"flex",alignItems:"center",gap:8}}>
                    <span style={{flex:1,height:6,borderRadius:3,background:T.bd+"40",overflow:"hidden"}}>
                      <span style={{display:"block",height:"100%",width:Math.min(sk.pct,100)+"%",borderRadius:3,background:barClr,transition:"width 0.3s"}} />
                    </span>
                    <span style={{fontSize:11,fontWeight:600,color:barClr,minWidth:32,textAlign:"right"}}>{sk.pct}%</span>
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Certs table */}
        {md.certs.length>0&&(
          <div style={{marginBottom:24}}>
            <h3 style={{fontSize:13,fontWeight:600,margin:"0 0 10px",color:T.tx}}>Certifications Breakdown</h3>
            <div style={{border:"1px solid "+T.bd,borderRadius:10,overflow:"hidden",background:T.sf}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 80px 80px 1fr",gap:0,padding:"8px 14px",background:T.bg,borderBottom:"1px solid "+T.bd,fontSize:10,fontWeight:600,color:T.td,textTransform:"uppercase",letterSpacing:"0.5px"}}>
                <span>Certification</span><span style={{textAlign:"right"}}>Holders</span><span style={{textAlign:"right"}}>Total</span><span style={{paddingLeft:12}}>Coverage</span>
              </div>
              {md.certs.map(function(ct){
                var barClr=rc(ct.pct,T);
                return (
                  <div key={ct.c} style={{display:"grid",gridTemplateColumns:"1fr 80px 80px 1fr",gap:0,padding:"10px 14px",borderBottom:"1px solid "+T.bd+"60",fontSize:12,alignItems:"center"}}>
                    <span style={{fontWeight:500,color:T.tx}}>{ct.c}</span>
                    <span style={{textAlign:"right",fontWeight:600,color:T.tx}}>{ct.have}</span>
                    <span style={{textAlign:"right",color:T.td}}>{ct.total}</span>
                    <span style={{paddingLeft:12,display:"flex",alignItems:"center",gap:8}}>
                      <span style={{flex:1,height:6,borderRadius:3,background:T.bd+"40",overflow:"hidden"}}>
                        <span style={{display:"block",height:"100%",width:Math.min(ct.pct,100)+"%",borderRadius:3,background:barClr,transition:"width 0.3s"}} />
                      </span>
                      <span style={{fontSize:11,fontWeight:600,color:barClr,minWidth:32,textAlign:"right"}}>{ct.pct}%</span>
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Used in Initiatives */}
        <div>
          <h3 style={{fontSize:13,fontWeight:600,margin:"0 0 10px",color:T.tx}}>Used in Initiatives</h3>
          {usage.length>0?(
            <div style={{border:"1px solid "+T.bd,borderRadius:10,overflow:"hidden",background:T.sf}}>
              {usage.map(function(u,i){
                return (
                  <div key={i} style={{padding:"10px 14px",borderBottom:i<usage.length-1?"1px solid "+T.bd+"60":"none",fontSize:12,display:"flex",justifyContent:"space-between"}}>
                    <span style={{fontWeight:500,color:T.tx}}>{u.iniNm}</span>
                    <span style={{color:T.td}}>{u.areaNm} ({u.deptNm})</span>
                  </div>
                );
              })}
            </div>
          ):(
            <div style={{padding:"16px",borderRadius:10,border:"1px solid "+T.bd,background:T.sf,fontSize:12,color:T.td,textAlign:"center"}}>Not used in any initiative</div>
          )}
        </div>
      </div>
    );
  }

  /* ——— List view with swimlanes ——— */
  return (
    <div style={{maxWidth:900,margin:"0 auto",padding:"32px 24px"}}>
      {/* Header */}
      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:24}}>
        <button onClick={p.onBack} style={{padding:"6px 14px",borderRadius:8,border:"1px solid "+T.bd,background:T.sf,cursor:"pointer",color:T.tx,fontSize:12,fontFamily:"inherit"}}>Back</button>
        <div style={{flex:1}}>
          <h1 style={{fontSize:22,fontWeight:700,margin:0}}>Capability Sets</h1>
          <p style={{fontSize:12,color:T.td,margin:"2px 0 0"}}>Reusable skill and certification requirements per function, grouped by swimlane.</p>
        </div>
        <button onClick={function(){startAdd("");}} style={{padding:"7px 16px",borderRadius:8,border:"none",background:T.ac,color:"#FFF",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>+ New Set</button>
      </div>

      {/* Add new form at top when adding without a specific lane */}
      {adding&&editId&&draft&&draft._isNew&&!draft.lane&&renderAddForm()}

      {/* Swimlanes */}
      {laneGroups.map(function(group){
        var ln=group.lane;
        var isCollapsed=collapsed[ln.id];
        var fillPct=group.totalReqHc?Math.min(100,Math.round(group.totalFullMatch/group.totalReqHc*100)):0;

        return (
          <div key={ln.id} style={{marginBottom:16}}>
            {/* Lane header */}
            <div onClick={function(){toggleLane(ln.id);}} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",borderRadius:isCollapsed?"10px":"10px 10px 0 0",background:T.sf,border:"1px solid "+T.bd,borderBottom:isCollapsed?"1px solid "+T.bd:"none",cursor:"pointer",userSelect:"none"}}>
              <span style={{fontSize:14,color:T.td,transform:isCollapsed?"rotate(-90deg)":"rotate(0deg)",transition:"transform 0.15s",display:"inline-block"}}>&#9660;</span>
              <span style={{width:4,height:20,borderRadius:2,background:ln.clr||T.ac,flexShrink:0}} />
              <span style={{fontSize:14,fontWeight:600,color:T.tx,flex:1}}>{ln.nm}</span>
              <span style={{fontSize:10,color:T.td,marginRight:4}}>{group.sets.length} set{group.sets.length!==1?"s":""}</span>
              <MiniGauge v={group.avgRd} sz={24} sw={2} />
              <span style={{fontSize:11,fontWeight:600,color:rc(group.avgRd,T),minWidth:30}}>{group.avgRd}%</span>
              {group.totalReqHc>0&&(
                <span style={{fontSize:10,color:T.td}}>{group.totalFullMatch}/{group.totalReqHc} filled</span>
              )}
            </div>

            {/* Lane content */}
            {!isCollapsed&&(
              <div style={{border:"1px solid "+T.bd,borderTop:"none",borderRadius:"0 0 10px 10px",padding:"10px 10px 4px",background:T.bg}}>
                {group.sets.map(function(cs){return renderCard(cs);})}

                {/* Add new within this lane */}
                {adding&&editId&&draft&&draft._isNew&&draft.lane===ln.id&&renderAddForm()}

                <button onClick={function(){startAdd(ln.id);}} style={{padding:"6px 14px",borderRadius:6,border:"1px dashed "+T.bd,background:"transparent",cursor:"pointer",color:T.td,fontSize:10,fontFamily:"inherit",width:"100%",marginBottom:6}}>+ Add to {ln.nm}</button>
              </div>
            )}
          </div>
        );
      })}

      {/* Add new swimlane */}
      {addingLane?(
        <div style={{display:"flex",gap:8,alignItems:"center",marginTop:8}}>
          <input value={laneDraft} onChange={function(e){sLaneDraft(e.target.value);}} placeholder="Swimlane name..." autoFocus style={{flex:1,padding:"6px 10px",borderRadius:6,border:"1px solid "+T.bd,background:T.sf,color:T.tx,fontSize:12,fontFamily:"inherit"}} onKeyDown={function(e){if(e.key==="Enter")addLane();if(e.key==="Escape"){sAddingLane(false);sLaneDraft("");}}} />
          <button onClick={addLane} disabled={!laneDraft.trim()} style={{padding:"6px 14px",borderRadius:6,border:"none",background:laneDraft.trim()?T.ac:"#AAA",color:"#FFF",fontSize:11,fontWeight:600,cursor:laneDraft.trim()?"pointer":"not-allowed",fontFamily:"inherit"}}>Create</button>
          <button onClick={function(){sAddingLane(false);sLaneDraft("");}} style={{padding:"6px 14px",borderRadius:6,border:"1px solid "+T.bd,background:T.bg,color:T.tx,fontSize:11,cursor:"pointer",fontFamily:"inherit"}}>Cancel</button>
        </div>
      ):(
        <button onClick={function(){sAddingLane(true);}} style={{padding:"8px 16px",borderRadius:8,border:"1px dashed "+T.bd,background:"transparent",cursor:"pointer",color:T.td,fontSize:11,fontFamily:"inherit",width:"100%",marginTop:4}}>+ Add Swimlane</button>
      )}
    </div>
  );
}
