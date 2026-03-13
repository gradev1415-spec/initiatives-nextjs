"use client";
import { useState, useContext } from "react";
import { ThemeCtx } from "@/lib/theme";
import { ALL_SKILLS, ALL_CERTS } from "@/lib/data";

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

  function startEdit(cs){
    sEditId(cs.id);
    sDraft({nm:cs.nm,desc:cs.desc||"",skillReqs:cs.skillReqs.map(function(s){return {s:s.s,lvl:s.lvl};}),certReqs:cs.certReqs.map(function(c){return {c:c.c};})});
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
      return {id:cs.id,nm:draft.nm,desc:draft.desc,skillReqs:draft.skillReqs,certReqs:draft.certReqs};
    });});
    sEditId(null);sDraft(null);sShowConfirm(false);
    if(p.onToast)p.onToast("Capability set updated");
  }

  function startAdd(){
    sAdding(true);
    var newId="cs_"+Date.now();
    sEditId(newId);
    sDraft({nm:"",desc:"",skillReqs:[],certReqs:[],_isNew:true,_newId:newId});
  }
  function saveNew(){
    if(!draft.nm.trim())return;
    var newCs={id:draft._newId,nm:draft.nm.trim(),desc:draft.desc,skillReqs:draft.skillReqs,certReqs:draft.certReqs};
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
  var lvlLabels=["","Basic","Intermediate","Proficient","Advanced","Expert"];

  return (
    <div style={{maxWidth:900,margin:"0 auto",padding:"32px 24px"}}>
      {/* Header */}
      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:24}}>
        <button onClick={p.onBack} style={{padding:"6px 14px",borderRadius:8,border:"1px solid "+T.bd,background:T.sf,cursor:"pointer",color:T.tx,fontSize:12,fontFamily:"inherit"}}>Back</button>
        <div>
          <h1 style={{fontSize:22,fontWeight:700,margin:0}}>Capability Sets</h1>
          <p style={{fontSize:12,color:T.td,margin:"2px 0 0"}}>Define reusable skill and certification requirements per function. Changes cascade to all initiatives using a set.</p>
        </div>
      </div>

      {/* Cards */}
      {p.capSets.map(function(cs){
        var usage=getUsage(cs.id,p.initiatives);
        var isEditing=editId===cs.id&&!draft._isNew;

        return (
          <div key={cs.id} style={{border:"1px solid "+T.bd,borderRadius:12,padding:16,marginBottom:12,background:T.sf}}>
            {isEditing ? (
              /* ——— Edit mode ——— */
              <div>
                <div style={{display:"flex",gap:12,marginBottom:12}}>
                  <div style={{flex:1}}>
                    <label style={{fontSize:10,color:T.td,fontWeight:600,display:"block",marginBottom:3}}>NAME</label>
                    <input value={draft.nm} onChange={function(e){sDraft(function(d){return Object.assign({},d,{nm:e.target.value});});}} style={{width:"100%",padding:"6px 10px",borderRadius:6,border:"1px solid "+T.bd,background:T.bg,color:T.tx,fontSize:13,fontFamily:"inherit",boxSizing:"border-box"}} />
                  </div>
                  <div style={{flex:2}}>
                    <label style={{fontSize:10,color:T.td,fontWeight:600,display:"block",marginBottom:3}}>DESCRIPTION</label>
                    <input value={draft.desc} onChange={function(e){sDraft(function(d){return Object.assign({},d,{desc:e.target.value});});}} style={{width:"100%",padding:"6px 10px",borderRadius:6,border:"1px solid "+T.bd,background:T.bg,color:T.tx,fontSize:13,fontFamily:"inherit",boxSizing:"border-box"}} />
                  </div>
                </div>

                {/* Skills */}
                <div style={{marginBottom:12}}>
                  <label style={{fontSize:10,color:T.td,fontWeight:600,display:"block",marginBottom:6}}>SKILLS</label>
                  <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:8}}>
                    {draft.skillReqs.map(function(sk){
                      return (
                        <div key={sk.s} style={{display:"flex",alignItems:"center",gap:4,padding:"4px 8px",borderRadius:6,background:T.ac+"14",border:"1px solid "+T.ac+"30",fontSize:11}}>
                          <span style={{color:T.tx}}>{sk.s}</span>
                          <span style={{display:"inline-flex",gap:2,marginLeft:4}}>
                            {[1,2,3,4,5].map(function(l){
                              return <span key={l} onClick={function(){setSkillLvl(sk.s,l);}} style={{width:8,height:8,borderRadius:4,background:l<=sk.lvl?lvlColors[sk.lvl]:(T.bd),cursor:"pointer"}} />;
                            })}
                          </span>
                          <span style={{fontSize:9,color:T.td,marginLeft:2}}>L{sk.lvl}</span>
                          <span onClick={function(){remSkill(sk.s);}} style={{cursor:"pointer",color:T.td,fontSize:13,marginLeft:2,lineHeight:1}}>x</span>
                        </div>
                      );
                    })}
                  </div>
                  <select value="" onChange={function(e){addSkill(e.target.value);}} style={{padding:"4px 8px",borderRadius:6,border:"1px solid "+T.bd,background:T.bg,color:T.td,fontSize:11,fontFamily:"inherit"}}>
                    <option value="">+ Add skill...</option>
                    {ALL_SKILLS.filter(function(s){return !draft.skillReqs.some(function(sk){return sk.s===s;});}).map(function(s){return <option key={s} value={s}>{s}</option>;})}
                  </select>
                </div>

                {/* Certs */}
                <div style={{marginBottom:12}}>
                  <label style={{fontSize:10,color:T.td,fontWeight:600,display:"block",marginBottom:6}}>CERTIFICATIONS</label>
                  <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:8}}>
                    {draft.certReqs.map(function(ct){
                      return (
                        <div key={ct.c} style={{display:"flex",alignItems:"center",gap:4,padding:"4px 8px",borderRadius:6,background:"#9F7AEA14",border:"1px solid #9F7AEA30",fontSize:11}}>
                          <span style={{color:T.tx}}>{ct.c}</span>
                          <span onClick={function(){remCert(ct.c);}} style={{cursor:"pointer",color:T.td,fontSize:13,lineHeight:1}}>x</span>
                        </div>
                      );
                    })}
                  </div>
                  <select value="" onChange={function(e){addCert(e.target.value);}} style={{padding:"4px 8px",borderRadius:6,border:"1px solid "+T.bd,background:T.bg,color:T.td,fontSize:11,fontFamily:"inherit"}}>
                    <option value="">+ Add certification...</option>
                    {ALL_CERTS.filter(function(c){return !draft.certReqs.some(function(ct){return ct.c===c;});}).map(function(c){return <option key={c} value={c}>{c}</option>;})}
                  </select>
                </div>

                {/* Usage info */}
                {usage.length>0&&(
                  <div style={{padding:"8px 12px",borderRadius:8,background:T.am+"10",border:"1px solid "+T.am+"25",marginBottom:12,fontSize:11,color:T.td}}>
                    <span style={{fontWeight:600,color:T.am}}>Used by {usage.length} area{usage.length!==1?"s":""}:</span>{" "}
                    {usage.map(function(u,i){return (i>0?", ":"")+u.iniNm+" ("+u.areaNm+")";}).join("")}
                  </div>
                )}

                {/* Confirm cascade dialog */}
                {showConfirm&&(
                  <div style={{padding:"12px 16px",borderRadius:8,background:T.am+"12",border:"1px solid "+T.am+"30",marginBottom:12}}>
                    <div style={{fontSize:12,fontWeight:600,color:T.am,marginBottom:6}}>Cascading Change</div>
                    <div style={{fontSize:11,color:T.tx,marginBottom:8}}>
                      This change will affect <strong>{usage.length}</strong> area{usage.length!==1?"s":""} across <strong>{[...new Set(usage.map(function(u){return u.iniId;}))].length}</strong> initiative{[...new Set(usage.map(function(u){return u.iniId;}))].length!==1?"s":""}. Readiness scores will be recalculated.
                    </div>
                    <div style={{display:"flex",gap:8}}>
                      <button onClick={doSave} style={{padding:"6px 16px",borderRadius:6,border:"none",background:T.ac,color:"#FFF",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Confirm & Save</button>
                      <button onClick={function(){sShowConfirm(false);}} style={{padding:"6px 16px",borderRadius:6,border:"1px solid "+T.bd,background:T.bg,color:T.tx,fontSize:11,cursor:"pointer",fontFamily:"inherit"}}>Cancel</button>
                    </div>
                  </div>
                )}

                {/* Action buttons */}
                {!showConfirm&&(
                  <div style={{display:"flex",gap:8}}>
                    <button onClick={trySave} style={{padding:"6px 16px",borderRadius:6,border:"none",background:T.ac,color:"#FFF",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Save</button>
                    <button onClick={cancelEdit} style={{padding:"6px 16px",borderRadius:6,border:"1px solid "+T.bd,background:T.bg,color:T.tx,fontSize:11,cursor:"pointer",fontFamily:"inherit"}}>Cancel</button>
                  </div>
                )}
              </div>
            ) : (
              /* ——— View mode ——— */
              <div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                  <div>
                    <div style={{fontSize:14,fontWeight:600,marginBottom:2}}>{cs.nm}</div>
                    {cs.desc&&<div style={{fontSize:11,color:T.td,marginBottom:8}}>{cs.desc}</div>}
                  </div>
                  <div style={{display:"flex",gap:6}}>
                    <button onClick={function(){startEdit(cs);}} style={{padding:"4px 12px",borderRadius:6,border:"1px solid "+T.bd,background:T.bg,cursor:"pointer",color:T.tx,fontSize:11,fontFamily:"inherit"}}>Edit</button>
                    <button onClick={function(){deleteSet(cs.id);}} style={{padding:"4px 12px",borderRadius:6,border:"1px solid "+(usage.length>0?T.bd:T.rd+"40"),background:T.bg,cursor:usage.length>0?"not-allowed":"pointer",color:usage.length>0?T.td:T.rd,fontSize:11,fontFamily:"inherit",opacity:usage.length>0?0.5:1}} title={usage.length>0?"In use by "+usage.length+" area(s)":""}>Delete</button>
                  </div>
                </div>

                <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:6}}>
                  {cs.skillReqs.map(function(sk){
                    return (
                      <span key={sk.s} style={{display:"inline-flex",alignItems:"center",gap:4,padding:"3px 8px",borderRadius:5,background:T.ac+"12",fontSize:10,color:T.tx}}>
                        {sk.s}
                        <span style={{display:"inline-flex",gap:1}}>
                          {[1,2,3,4,5].map(function(l){return <span key={l} style={{width:5,height:5,borderRadius:3,background:l<=sk.lvl?lvlColors[sk.lvl]:T.bd}} />;})}
                        </span>
                        <span style={{fontSize:9,color:T.td}}>L{sk.lvl}</span>
                      </span>
                    );
                  })}
                  {cs.certReqs.map(function(ct){
                    return <span key={ct.c} style={{padding:"3px 8px",borderRadius:5,background:"#9F7AEA14",fontSize:10,color:T.tx}}>{ct.c}</span>;
                  })}
                </div>

                <div style={{fontSize:10,color:T.td}}>
                  {usage.length>0?"Used by "+usage.length+" area"+(usage.length!==1?"s":"")+" in "+[...new Set(usage.map(function(u){return u.iniNm;}))].length+" initiative"+(([...new Set(usage.map(function(u){return u.iniNm;}))].length!==1)?"s":""):"Not in use"}
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Add New Set */}
      {adding&&editId&&draft&&draft._isNew ? (
        <div style={{border:"1px solid "+T.ac+"40",borderRadius:12,padding:16,marginBottom:12,background:T.sf}}>
          <div style={{display:"flex",gap:12,marginBottom:12}}>
            <div style={{flex:1}}>
              <label style={{fontSize:10,color:T.td,fontWeight:600,display:"block",marginBottom:3}}>NAME</label>
              <input value={draft.nm} onChange={function(e){sDraft(function(d){return Object.assign({},d,{nm:e.target.value});});}} placeholder="e.g. Beauty & Wellness" style={{width:"100%",padding:"6px 10px",borderRadius:6,border:"1px solid "+T.bd,background:T.bg,color:T.tx,fontSize:13,fontFamily:"inherit",boxSizing:"border-box"}} />
            </div>
            <div style={{flex:2}}>
              <label style={{fontSize:10,color:T.td,fontWeight:600,display:"block",marginBottom:3}}>DESCRIPTION</label>
              <input value={draft.desc} onChange={function(e){sDraft(function(d){return Object.assign({},d,{desc:e.target.value});});}} placeholder="What this capability set covers..." style={{width:"100%",padding:"6px 10px",borderRadius:6,border:"1px solid "+T.bd,background:T.bg,color:T.tx,fontSize:13,fontFamily:"inherit",boxSizing:"border-box"}} />
            </div>
          </div>
          {/* Skills */}
          <div style={{marginBottom:12}}>
            <label style={{fontSize:10,color:T.td,fontWeight:600,display:"block",marginBottom:6}}>SKILLS</label>
            <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:8}}>
              {draft.skillReqs.map(function(sk){
                return (
                  <div key={sk.s} style={{display:"flex",alignItems:"center",gap:4,padding:"4px 8px",borderRadius:6,background:T.ac+"14",border:"1px solid "+T.ac+"30",fontSize:11}}>
                    <span style={{color:T.tx}}>{sk.s}</span>
                    <span style={{display:"inline-flex",gap:2,marginLeft:4}}>
                      {[1,2,3,4,5].map(function(l){return <span key={l} onClick={function(){setSkillLvl(sk.s,l);}} style={{width:8,height:8,borderRadius:4,background:l<=sk.lvl?lvlColors[sk.lvl]:T.bd,cursor:"pointer"}} />;})}
                    </span>
                    <span style={{fontSize:9,color:T.td,marginLeft:2}}>L{sk.lvl}</span>
                    <span onClick={function(){remSkill(sk.s);}} style={{cursor:"pointer",color:T.td,fontSize:13,marginLeft:2,lineHeight:1}}>x</span>
                  </div>
                );
              })}
            </div>
            <select value="" onChange={function(e){addSkill(e.target.value);}} style={{padding:"4px 8px",borderRadius:6,border:"1px solid "+T.bd,background:T.bg,color:T.td,fontSize:11,fontFamily:"inherit"}}>
              <option value="">+ Add skill...</option>
              {ALL_SKILLS.filter(function(s){return !draft.skillReqs.some(function(sk){return sk.s===s;});}).map(function(s){return <option key={s} value={s}>{s}</option>;})}
            </select>
          </div>
          {/* Certs */}
          <div style={{marginBottom:12}}>
            <label style={{fontSize:10,color:T.td,fontWeight:600,display:"block",marginBottom:6}}>CERTIFICATIONS</label>
            <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:8}}>
              {draft.certReqs.map(function(ct){
                return (
                  <div key={ct.c} style={{display:"flex",alignItems:"center",gap:4,padding:"4px 8px",borderRadius:6,background:"#9F7AEA14",border:"1px solid #9F7AEA30",fontSize:11}}>
                    <span style={{color:T.tx}}>{ct.c}</span>
                    <span onClick={function(){remCert(ct.c);}} style={{cursor:"pointer",color:T.td,fontSize:13,lineHeight:1}}>x</span>
                  </div>
                );
              })}
            </div>
            <select value="" onChange={function(e){addCert(e.target.value);}} style={{padding:"4px 8px",borderRadius:6,border:"1px solid "+T.bd,background:T.bg,color:T.td,fontSize:11,fontFamily:"inherit"}}>
              <option value="">+ Add certification...</option>
              {ALL_CERTS.filter(function(c){return !draft.certReqs.some(function(ct){return ct.c===c;});}).map(function(c){return <option key={c} value={c}>{c}</option>;})}
            </select>
          </div>
          <div style={{display:"flex",gap:8}}>
            <button onClick={saveNew} disabled={!draft.nm.trim()} style={{padding:"6px 16px",borderRadius:6,border:"none",background:draft.nm.trim()?T.ac:"#AAA",color:"#FFF",fontSize:11,fontWeight:600,cursor:draft.nm.trim()?"pointer":"not-allowed",fontFamily:"inherit"}}>Create</button>
            <button onClick={cancelAdd} style={{padding:"6px 16px",borderRadius:6,border:"1px solid "+T.bd,background:T.bg,color:T.tx,fontSize:11,cursor:"pointer",fontFamily:"inherit"}}>Cancel</button>
          </div>
        </div>
      ) : (
        !adding&&<button onClick={startAdd} style={{padding:"10px 20px",borderRadius:8,border:"1px dashed "+T.bd,background:"transparent",cursor:"pointer",color:T.td,fontSize:12,fontFamily:"inherit",width:"100%"}}>+ Add New Capability Set</button>
      )}
    </div>
  );
}
