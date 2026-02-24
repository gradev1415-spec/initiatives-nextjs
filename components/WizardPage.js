"use client";
import { useState, useEffect, useRef } from "react";
import { useT } from "@/lib/theme";
import { fD, rc, cc2, cw, pv } from "@/lib/utils";
import { LIBRARY, JOB_PROFILE_SKILLS, ALL_SKILLS, ALL_CERTS, LAYOUT_TEMPLATES } from "@/lib/data";
import Badge from "./Badge";
import ProgressBar from "./ProgressBar";
import Gauge from "./Gauge";
import Overlay from "./Overlay";
import useIsMobile from "@/lib/useIsMobile";

export default function WizardPage(p){
  var T=useT();var mob=useIsMobile();
  var st=useState(p.initStep||1);var step=st[0],sStep=st[1];
  var _n=useState("");var name=_n[0],sName=_n[1];
  var _d=useState("");var desc=_d[0],sDesc=_d[1];
  var _tp=useState("Operational");var type=_tp[0],sType=_tp[1];
  var _proj=useState(false);var isProj=_proj[0],sProj=_proj[1];
  var _sd2=useState([]);var selD=_sd2[0],sSelD=_sd2[1];
  var _dc=useState({});var dCirc=_dc[0],sDCirc=_dc[1];
  var _rsrc=useState("circle");var roleSrc=_rsrc[0],sRoleSrc=_rsrc[1];
  var _rv=useState("");var rev=_rv[0],sRev=_rv[1];
  var _inv=useState("");var inv=_inv[0],sInv=_inv[1];
  var _sq=useState("");var sq=_sq[0],sSq=_sq[1];
  var _tq=useState("");var tq=_tq[0],sTq=_tq[1];
  var _ex=useState({});var exp=_ex[0],sExp=_ex[1];
  var _mnd=useState(false);var mND=_mnd[0],sMND=_mnd[1];
  var _mnc=useState(false);var mNC=_mnc[0],sMNC=_mnc[1];
  var _ndn=useState("");var ndNm=_ndn[0],sNdNm=_ndn[1];
  var _ndp=useState("");var ndPr=_ndp[0],sNdPr=_ndp[1];
  var _ncn=useState("");var ncNm=_ncn[0],sNcNm=_ncn[1];
  var _ncd=useState(null);var ncDp=_ncd[0],sNcDp=_ncd[1];
  var _analyzing=useState(false);var analyzing=_analyzing[0],sAnalyzing=_analyzing[1];
  var _analysisDone=useState(false);var analysisDone=_analysisDone[0],sAnalysisDone=_analysisDone[1];
  var _scanPhase=useState(0);var scanPhase=_scanPhase[0],sScanPhase=_scanPhase[1];
  var _insights=useState([]);var insights=_insights[0],sInsights=_insights[1];
  /* New state for job profile targets */
  var _tgts=useState({});var jpTargets=_tgts[0],sJpTargets=_tgts[1];
  var _tge=useState({});var tgtExp=_tge[0],sTgtExp=_tge[1];
  /* Store Layout state */
  var _ul=useState(null);var useLayout=_ul[0],sUseLayout=_ul[1];
  var _sl=useState(null);var selLayout=_sl[0],sSelLayout=_sl[1];
  var _nln=useState("");var newLayoutName=_nln[0],sNewLayoutName=_nln[1];
  var _nla=useState([]);var newAreas=_nla[0],sNewAreas=_nla[1];
  var _da=useState({});var deptAreas=_da[0],sDeptAreas=_da[1];
  /* Area requirements: keyed by area aid -> {skills:[], certs:[]} */
  var _areq=useState({});var areaReqs=_areq[0],sAreaReqs=_areq[1];
  var _areqExp=useState({});var areaReqExp=_areqExp[0],sAreaReqExp=_areqExp[1];
  /* Roles step: dept expand/collapse — first dept open by default */
  var _rdx=useState({});var roleDeptExp=_rdx[0],sRoleDeptExp=_rdx[1];
  var _pss=useState(null);var presetSavedId=_pss[0],sPresetSavedId=_pss[1];
  var _tps=useState(false);var tgtPresetSaved=_tps[0],sTgtPresetSaved=_tps[1];

  useState(function(){if(document.getElementById("wiz-css"))return;var s=document.createElement("style");s.id="wiz-css";s.textContent="@keyframes wizFadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}@keyframes wizPulse{0%,100%{opacity:1}50%{opacity:0.5}}@keyframes wizSlideIn{from{opacity:0;transform:translateX(-8px)}to{opacity:1;transform:translateX(0)}}@keyframes wizGlow{0%,100%{box-shadow:0 0 0 0 rgba(28,37,63,0)}50%{box-shadow:0 0 12px 2px rgba(28,37,63,0.12)}}@keyframes wizPop{0%{transform:scale(0.5);opacity:0}60%{transform:scale(1.15)}100%{transform:scale(1);opacity:1}}";document.head.appendChild(s);});

  function togExp(id){sExp(function(pr){var n={};for(var k in pr)n[k]=pr[k];n[id]=!pr[id];return n;});}
  function togTgtExp(id){sTgtExp(function(pr){var n={};for(var k in pr)n[k]=pr[k];n[id]=n[id]===undefined?false:!n[id];return n;});}
  function togRoleDeptExp(id){sRoleDeptExp(function(pr){var n={};for(var k in pr)n[k]=pr[k];n[id]=!pr[id];return n;});}
  function togDept(d2){sSelD(function(pr){return pr.find(function(x){return x.id===d2.id;})?pr.filter(function(x){return x.id!==d2.id;}):pr.concat([d2]);});}
  function togRegion(region){
    var allSel=region.ch.every(function(d2){return selD.find(function(x){return x.id===d2.id;});});
    sSelD(function(pr){
      if(allSel){/* Deselect all in region */
        return pr.filter(function(x){return !region.ch.find(function(d2){return d2.id===x.id;});});
      }else{/* Select all in region */
        var merged=pr.slice();
        region.ch.forEach(function(d2){if(!merged.find(function(x){return x.id===d2.id;}))merged.push(d2);});
        return merged;
      }
    });
  }
  /* Layout helpers */
  function getLayoutAreas(){
    if(!selLayout)return [];
    if(selLayout==="new")return newAreas;
    var tmpl=(p.layoutTemplates||[]).find(function(t){return t.id===selLayout;});
    return tmpl?tmpl.areas:[];
  }
  function getDeptActiveAreas(dId){
    var all=getLayoutAreas();
    if(!deptAreas[dId])return all.map(function(a){return a.aid;});
    return deptAreas[dId];
  }
  function togDeptArea(dId,aId){
    sDeptAreas(function(pr){
      var n={};for(var k in pr)n[k]=pr[k];
      var cur=getDeptActiveAreas(dId);
      if(cur.indexOf(aId)>=0){n[dId]=cur.filter(function(x){return x!==aId;});}
      else{n[dId]=cur.concat([aId]);}
      return n;
    });
  }
  function addNewArea(){
    var aid="a_"+Date.now();
    sNewAreas(function(pr){return pr.concat([{aid:aid,anm:""}]);});
  }
  function updAreaName(aid,nm){
    sNewAreas(function(pr){return pr.map(function(a){return a.aid===aid?{aid:a.aid,anm:nm}:a;});});
  }
  function remNewArea(aid){
    sNewAreas(function(pr){return pr.filter(function(a){return a.aid!==aid;});});
  }
  /* Area requirements helpers — skills are {s,lvl} objects, certs are strings */
  function getAreaReqs(aid){return areaReqs[aid]||{skills:[],certs:[]};}
  function addAreaSkill(aid,sk){sAreaReqs(function(pr){var n={};for(var k in pr)n[k]=pr[k];var cur=pr[aid]||{skills:[],certs:[]};if(cur.skills.some(function(x){return x.s===sk;}))return pr;n[aid]={skills:cur.skills.concat([{s:sk,lvl:1}]),certs:cur.certs};return n;});}
  function remAreaSkill(aid,sk){sAreaReqs(function(pr){var n={};for(var k in pr)n[k]=pr[k];var cur=pr[aid]||{skills:[],certs:[]};n[aid]={skills:cur.skills.filter(function(x){return x.s!==sk;}),certs:cur.certs};return n;});}
  function setAreaSkillLvl(aid,sk,lvl){sAreaReqs(function(pr){var n={};for(var k in pr)n[k]=pr[k];var cur=pr[aid]||{skills:[],certs:[]};n[aid]={skills:cur.skills.map(function(x){return x.s===sk?{s:x.s,lvl:lvl}:x;}),certs:cur.certs};return n;});}
  function addAreaCert(aid,ct){sAreaReqs(function(pr){var n={};for(var k in pr)n[k]=pr[k];var cur=pr[aid]||{skills:[],certs:[]};if(cur.certs.indexOf(ct)>=0)return pr;n[aid]={skills:cur.skills,certs:cur.certs.concat([ct])};return n;});}
  function remAreaCert(aid,ct){sAreaReqs(function(pr){var n={};for(var k in pr)n[k]=pr[k];var cur=pr[aid]||{skills:[],certs:[]};n[aid]={skills:cur.skills,certs:cur.certs.filter(function(c){return c!==ct;})};return n;});}
  function togAreaReqExp(aid){sAreaReqExp(function(pr){var n={};for(var k in pr)n[k]=pr[k];n[aid]=!pr[aid];return n;});}
  function loadTemplateReqs(tmplId){
    var tmpl=(p.layoutTemplates||[]).find(function(t){return t.id===tmplId;});
    if(!tmpl)return;
    var reqs={};
    tmpl.areas.forEach(function(a){
      if((a.skillReqs&&a.skillReqs.length>0)||(a.certReqs&&a.certReqs.length>0)){
        reqs[a.aid]={skills:(a.skillReqs||[]).map(function(sk){return typeof sk==="string"?{s:sk,lvl:1}:sk;}),certs:(a.certReqs||[]).map(function(ct){return typeof ct==="string"?ct:ct.c||ct;})};
      }
    });
    sAreaReqs(reqs);
    /* Auto-load role preset if template has one */
    if(tmpl.rolePreset){
      loadRolePreset(tmpl);
    }
  }
  /* Load saved role preset from a template into dCirc for all selected depts */
  function loadRolePreset(tmpl){
    if(!tmpl||!tmpl.rolePreset)return;
    var preset=tmpl.rolePreset;
    sDCirc(function(pr){
      var n={};for(var k in pr)n[k]=pr[k];
      selD.forEach(function(dept){
        var activeAIds=getDeptActiveAreas(dept.id);
        activeAIds.forEach(function(aId){
          var key=dept.id+"__"+aId;
          if(preset[aId]&&preset[aId].length>0&&!(n[key]&&n[key].length>0)){
            n[key]=preset[aId].map(function(r){return {cid:r.cid,cnm:r.cnm,cr:r.cr,rq:r.rq};});
          }
        });
      });
      return n;
    });
  }
  /* Save a specific dept's role config as preset on the selected template */
  function saveRolePreset(dId){
    if(!selLayout||selLayout==="new")return;
    var layoutAreas=getLayoutAreas();
    if(!dId){var fd=selD[0];if(!fd)return;dId=fd.id;}
    var preset={};
    layoutAreas.forEach(function(a){
      var key=dId+"__"+a.aid;
      var roles=dCirc[key]||[];
      if(roles.length>0){
        preset[a.aid]=roles.map(function(r){return {cid:r.cid,cnm:r.cnm,cr:r.cr,rq:r.rq};});
      }
    });
    p.setLT(function(prev){return prev.map(function(t){
      if(t.id===selLayout)return Object.assign({},t,{rolePreset:preset});
      return t;
    });});
    return preset;
  }
  /* Apply saved preset to a specific dept */
  function applyPresetToDept(dId){
    if(!selLayout||selLayout==="new")return;
    var tmpl=(p.layoutTemplates||[]).find(function(t){return t.id===selLayout;});
    if(!tmpl||!tmpl.rolePreset)return;
    var preset=tmpl.rolePreset;
    var activeAIds=getDeptActiveAreas(dId);
    sDCirc(function(pr){
      var n={};for(var k in pr)n[k]=pr[k];
      activeAIds.forEach(function(aId){
        var key=dId+"__"+aId;
        if(preset[aId]&&preset[aId].length>0){
          n[key]=preset[aId].map(function(r){return {cid:r.cid,cnm:r.cnm,cr:r.cr,rq:r.rq};});
        }
      });
      return n;
    });
  }
  /* Apply roles from one dept to all others */
  function applyToAll(srcDeptId){
    var layoutAreas3=getLayoutAreas();
    sDCirc(function(pr){
      var n={};for(var k in pr)n[k]=pr[k];
      if(useLayout&&selLayout&&layoutAreas3.length>0){
        /* Area-based: copy each area's roles from srcDept to all other depts */
        selD.forEach(function(dept){
          if(dept.id===srcDeptId)return;
          var activeAIds=getDeptActiveAreas(dept.id);
          activeAIds.forEach(function(aId){
            var srcKey=srcDeptId+"__"+aId;
            var dstKey=dept.id+"__"+aId;
            if(pr[srcKey]&&pr[srcKey].length>0){
              /* Deep copy roles but keep same structure */
              n[dstKey]=pr[srcKey].map(function(r){return {cid:r.cid,cnm:r.cnm,cr:r.cr,rq:r.rq};});
            }
          });
        });
      }else{
        /* Flat: copy srcDept's roles to all other depts */
        var srcRoles=pr[srcDeptId]||[];
        if(srcRoles.length>0){
          selD.forEach(function(dept){
            if(dept.id===srcDeptId)return;
            n[dept.id]=srcRoles.map(function(r){return {cid:r.cid,cnm:r.cnm,cr:r.cr,rq:r.rq};});
          });
        }
      }
      return n;
    });
  }
  function addC(did,c){sDCirc(function(pr){var n={};for(var k in pr)n[k]=pr[k];var e=pr[did]||[];if(e.find(function(x){return x.cid===c.id;}))return pr;n[did]=e.concat([{cid:c.id,cnm:c.nm,cr:"Essential",rq:1}]);return n;});}
  function remC(did,cid){sDCirc(function(pr){var n={};for(var k in pr)n[k]=pr[k];n[did]=(pr[did]||[]).filter(function(x){return x.cid!==cid;});return n;});}
  function updC(did,cid,f,v){sDCirc(function(pr){var n={};for(var k in pr)n[k]=pr[k];n[did]=(pr[did]||[]).map(function(x){if(x.cid===cid){return {cid:x.cid,cnm:x.cnm,cr:f==="cr"?v:x.cr,rq:f==="rq"?v:x.rq};}return x;});return n;});}
  function doND(){if(!ndNm.trim())return;var id="d_"+Date.now();p.setDT(function(pr){if(ndPr){return pr.map(function(r){return r.id===ndPr?{id:r.id,nm:r.nm,ch:r.ch.concat([{id:id,nm:ndNm.trim(),tp:"Op"}])}:r;});}return pr.concat([{id:id,nm:ndNm.trim(),ch:[]}]);});sMND(false);sNdNm("");sNdPr("");}
  function doNC(){if(!ncNm.trim())return;var id=(roleSrc==="circle"?"c_":"jp_")+Date.now();var nc={id:id,nm:ncNm.trim()};if(roleSrc==="circle"){p.setCL(function(pr){return pr.concat([nc]);});}else{p.setJP(function(pr){return pr.concat([nc]);});}if(ncDp)addC(ncDp,nc);sMNC(false);sNcNm("");sNcDp(null);}
  function calcRd(){var tw=0,fw=0;var keys=Object.keys(dCirc);for(var i=0;i<keys.length;i++){var cs=dCirc[keys[i]];for(var j=0;j<cs.length;j++){var w=cw(cs[j].cr);tw+=cs[j].rq*w;if(!isProj)fw+=Math.min(cs[j].rq,Math.floor(cs[j].rq*0.8))*w;}}return tw>0?Math.round(fw/tw*100):0;}
  function countTotals(){var totalRoles=0,totalPeople=0,essRoles=0,essPeople=0,impRoles=0;var keys=Object.keys(dCirc);for(var i=0;i<keys.length;i++){var cs=dCirc[keys[i]];totalRoles+=cs.length;for(var j=0;j<cs.length;j++){totalPeople+=cs[j].rq;if(cs[j].cr==="Essential"){essRoles++;essPeople+=cs[j].rq;}if(cs[j].cr==="Important")impRoles++;}}return {totalRoles:totalRoles,totalPeople:totalPeople,totalDepts:selD.length,essRoles:essRoles,essPeople:essPeople,impRoles:impRoles};}

  /* ===== Keyboard & autofocus ===== */
  var wizRef=useRef(null);
  useEffect(function(){
    /* Focus first input/select in current step after step change */
    var t=setTimeout(function(){
      if(!wizRef.current)return;
      var el=wizRef.current.querySelector("input:not([type=hidden]),select,textarea");
      if(el&&typeof el.focus==="function"){el.focus();}
    },80);
    return function(){clearTimeout(t);};
  },[step]);

  /* ===== Dynamic stepper ===== */
  var allStps=[{n:1,l:"Basics"},{n:2,l:"Locations"},{n:25,l:"Store Layout"},{n:3,l:"Roles"},{n:4,l:"Define Targets",cond:"jobprofile"},{n:5,l:"Timeline"},{n:6,l:"Analysis"}];
  var stps=allStps.filter(function(s){if(s.cond==="jobprofile")return roleSrc==="jobprofile";return true;});
  /* Remap step numbers for display when circles (no step 4) */
  function stpIdx(sn){for(var i=0;i<stps.length;i++){if(stps[i].n===sn)return i;}return -1;}
  function nxtStep(cur){var idx=stpIdx(cur);return idx<stps.length-1?stps[idx+1].n:null;}
  function prvStep(cur){var idx=stpIdx(cur);return idx>0?stps[idx-1].n:null;}
  function isLast(cur){return stpIdx(cur)===stps.length-1;}
  var analysisN=6;
  var timelineN=5;

  /* ===== Job Profile Targets helpers ===== */
  function getUniqueProfiles(){
    var seen={};var result=[];
    var keys=Object.keys(dCirc);
    for(var i=0;i<keys.length;i++){
      var roles=dCirc[keys[i]]||[];
      for(var j=0;j<roles.length;j++){
        if(!seen[roles[j].cid]){seen[roles[j].cid]=true;result.push({id:roles[j].cid,nm:roles[j].cnm});}
      }
    }
    return result;
  }
  function getProfileHc(pid){
    var total=0;var keys=Object.keys(dCirc);
    for(var i=0;i<keys.length;i++){var roles=dCirc[keys[i]]||[];for(var j=0;j<roles.length;j++){if(roles[j].cid===pid)total+=roles[j].rq;}}
    return total;
  }
  function initTargets(){
    var tgts={};var profiles=getUniqueProfiles();
    for(var i=0;i<profiles.length;i++){
      var pid=profiles[i].id;
      if(jpTargets[pid])continue; /* preserve existing edits */
      var data=JOB_PROFILE_SKILLS[pid];
      if(!data){tgts[pid]={skills:[],certs:[]};continue;}
      var threshold=0.5;
      tgts[pid]={
        skills:data.skills.map(function(sk){return {s:sk.s,on:(sk.have/data.hc)>=threshold,tgtLvl:sk.lvl};}),
        certs:data.certs.map(function(ct){return {c:ct.c,on:(ct.have/data.hc)>=threshold};})
      };
    }
    /* Merge: keep existing edits, add new profiles */
    if(Object.keys(tgts).length>0){
      sJpTargets(function(prev){
        var merged={};for(var k in prev)merged[k]=prev[k];for(var k2 in tgts){if(!merged[k2])merged[k2]=tgts[k2];}
        /* Remove profiles no longer selected */
        var activeIds={};for(var pi=0;pi<profiles.length;pi++)activeIds[profiles[pi].id]=true;
        var cleaned={};for(var ck in merged){if(activeIds[ck])cleaned[ck]=merged[ck];}
        return cleaned;
      });
    }
  }
  function togSkill(pid,sn){sJpTargets(function(pr){var n={};for(var k in pr)n[k]=pr[k];n[pid]={skills:pr[pid].skills.map(function(s){return s.s===sn?{s:s.s,on:!s.on,tgtLvl:s.tgtLvl}:s;}),certs:pr[pid].certs};return n;});}
  function setSkLvl(pid,sn,lvl){sJpTargets(function(pr){var n={};for(var k in pr)n[k]=pr[k];n[pid]={skills:pr[pid].skills.map(function(s){return s.s===sn?{s:s.s,on:s.on,tgtLvl:lvl}:s;}),certs:pr[pid].certs};return n;});}
  function togCert(pid,cn){sJpTargets(function(pr){var n={};for(var k in pr)n[k]=pr[k];n[pid]={skills:pr[pid].skills,certs:pr[pid].certs.map(function(c){return c.c===cn?{c:c.c,on:!c.on}:c;})};return n;});}
  function addSkProf(pid,sn){sJpTargets(function(pr){var n={};for(var k in pr)n[k]=pr[k];var ex=pr[pid].skills;if(ex.some(function(s){return s.s===sn;}))return pr;n[pid]={skills:ex.concat([{s:sn,on:true,tgtLvl:1}]),certs:pr[pid].certs};return n;});}
  function addCtProf(pid,cn){sJpTargets(function(pr){var n={};for(var k in pr)n[k]=pr[k];var ex=pr[pid].certs;if(ex.some(function(c){return c.c===cn;}))return pr;n[pid]={skills:pr[pid].skills,certs:ex.concat([{c:cn,on:true}])};return n;});}
  function remSkProf(pid,sn){sJpTargets(function(pr){var n={};for(var k in pr)n[k]=pr[k];n[pid]={skills:pr[pid].skills.filter(function(s){return s.s!==sn;}),certs:pr[pid].certs};return n;});}
  function remCtProf(pid,cn){sJpTargets(function(pr){var n={};for(var k in pr)n[k]=pr[k];n[pid]={skills:pr[pid].skills,certs:pr[pid].certs.filter(function(c){return c.c!==cn;})};return n;});}
  /* Save current jpTargets as a target preset on the selected layout template */
  function saveTargetPreset(){
    if(!selLayout||selLayout==="new")return;
    var preset={};
    var keys=Object.keys(jpTargets);
    for(var i=0;i<keys.length;i++){
      var pid=keys[i];var tgt=jpTargets[pid];
      if(tgt){preset[pid]={skills:tgt.skills.map(function(s){return {s:s.s,on:s.on,tgtLvl:s.tgtLvl};}),certs:tgt.certs.map(function(c){return {c:c.c,on:c.on};})};}
    }
    p.setLT(function(prev){return prev.map(function(t){
      if(t.id===selLayout)return Object.assign({},t,{targetPreset:preset});
      return t;
    });});
    sTgtPresetSaved(true);
    setTimeout(function(){sTgtPresetSaved(false);},2000);
  }
  /* Apply saved target preset from the selected layout template */
  function applyTargetPreset(){
    if(!selLayout||selLayout==="new")return;
    var tmpl=(p.layoutTemplates||[]).find(function(t){return t.id===selLayout;});
    if(!tmpl||!tmpl.targetPreset)return;
    var preset=tmpl.targetPreset;
    sJpTargets(function(prev){
      var n={};for(var k in prev)n[k]=prev[k];
      var pkeys=Object.keys(preset);
      for(var i=0;i<pkeys.length;i++){
        var pid=pkeys[i];
        if(n[pid]!==undefined){
          n[pid]={skills:preset[pid].skills.map(function(s){return {s:s.s,on:s.on,tgtLvl:s.tgtLvl};}),certs:preset[pid].certs.map(function(c){return {c:c.c,on:c.on};})};
        }
      }
      return n;
    });
  }
  function hasTargetPreset(){
    if(!selLayout||selLayout==="new")return false;
    var tmpl=(p.layoutTemplates||[]).find(function(t){return t.id===selLayout;});
    return tmpl&&tmpl.targetPreset&&Object.keys(tmpl.targetPreset).length>0;
  }

  /* ===== Gap computation for job profiles ===== */
  function computeSkillGaps(){
    var gaps={};var keys=Object.keys(jpTargets);
    for(var i=0;i<keys.length;i++){
      var pid=keys[i];var tgt=jpTargets[pid];var data=JOB_PROFILE_SKILLS[pid];
      if(!tgt||!data)continue;
      var phc=getProfileHc(pid);
      for(var j=0;j<tgt.skills.length;j++){
        var sk=tgt.skills[j];if(!sk.on)continue;
        var dist=null;for(var di=0;di<data.skills.length;di++){if(data.skills[di].s===sk.s){dist=data.skills[di];break;}}
        var haveAtLvl=0;
        if(dist){
          if(dist.lvl>=sk.tgtLvl){haveAtLvl=Math.round(dist.have*(phc/data.hc));}
          else{haveAtLvl=Math.round(dist.have*0.5*(phc/data.hc));}
        }
        var gap=Math.max(0,phc-haveAtLvl);
        if(gap>0){if(!gaps[sk.s])gaps[sk.s]=0;gaps[sk.s]+=gap;}
      }
    }
    return Object.keys(gaps).map(function(s){
      var n=gaps[s];
      return {s:s,n:n};
    }).sort(function(a,b){return b.n-a.n;});
  }
  function computeCertGaps(){
    var gaps={};var keys=Object.keys(jpTargets);
    for(var i=0;i<keys.length;i++){
      var pid=keys[i];var tgt=jpTargets[pid];var data=JOB_PROFILE_SKILLS[pid];
      if(!tgt||!data)continue;
      var phc=getProfileHc(pid);
      for(var j=0;j<tgt.certs.length;j++){
        var ct=tgt.certs[j];if(!ct.on)continue;
        var dist=null;for(var di=0;di<data.certs.length;di++){if(data.certs[di].c===ct.c){dist=data.certs[di];break;}}
        var haveIt=dist?Math.round(dist.have*(phc/data.hc)):0;
        var gap=Math.max(0,phc-haveIt);
        if(gap>0){if(!gaps[ct.c])gaps[ct.c]=0;gaps[ct.c]+=gap;}
      }
    }
    return Object.keys(gaps).map(function(c){
      var n=gaps[c];
      return {c:c,n:n};
    }).sort(function(a,b){return b.n-a.n;});
  }
  function computeSkillRd(){
    var totalN=0,totalM=0;var keys=Object.keys(jpTargets);
    for(var i=0;i<keys.length;i++){
      var pid=keys[i];var tgt=jpTargets[pid];var data=JOB_PROFILE_SKILLS[pid];
      if(!tgt||!data)continue;var phc=getProfileHc(pid);
      for(var j=0;j<tgt.skills.length;j++){
        var sk=tgt.skills[j];if(!sk.on)continue;
        totalN+=phc;
        var dist=null;for(var di=0;di<data.skills.length;di++){if(data.skills[di].s===sk.s){dist=data.skills[di];break;}}
        if(dist){var met=dist.lvl>=sk.tgtLvl?Math.round(dist.have*(phc/data.hc)):Math.round(dist.have*0.5*(phc/data.hc));totalM+=Math.min(met,phc);}
      }
    }
    return totalN>0?Math.round(totalM/totalN*100):100;
  }
  function computeCertRd(){
    var totalN=0,totalM=0;var keys=Object.keys(jpTargets);
    for(var i=0;i<keys.length;i++){
      var pid=keys[i];var tgt=jpTargets[pid];var data=JOB_PROFILE_SKILLS[pid];
      if(!tgt||!data)continue;var phc=getProfileHc(pid);
      for(var j=0;j<tgt.certs.length;j++){
        var ct=tgt.certs[j];if(!ct.on)continue;
        totalN+=phc;
        var dist=null;for(var di=0;di<data.certs.length;di++){if(data.certs[di].c===ct.c){dist=data.certs[di];break;}}
        if(dist){totalM+=Math.min(Math.round(dist.have*(phc/data.hc)),phc);}
      }
    }
    return totalN>0?Math.round(totalM/totalN*100):100;
  }
  function targetSummary(){
    var tsk=0,tct=0;var keys=Object.keys(jpTargets);
    for(var i=0;i<keys.length;i++){
      var t=jpTargets[keys[i]];if(!t)continue;
      for(var j=0;j<t.skills.length;j++){if(t.skills[j].on)tsk++;}
      for(var j2=0;j2<t.certs.length;j2++){if(t.certs[j2].on)tct++;}
    }
    return {skills:tsk,certs:tct};
  }

  function getHint(){
    if(step===1){if(!name.trim())return "Name your initiative to begin workforce analysis.";if(!desc.trim())return "A description helps stakeholders understand the objective.";return "The system will connect "+type.toLowerCase()+" workforce data to this initiative.";}
    if(step===2){if(selD.length===0)return "Select locations to scan their employee records.";return "~"+(selD.length*22)+" employee records across "+selD.length+" location"+(selD.length>1?"s":"")+" will be cross-referenced.";}
    if(step===25){if(useLayout===null)return "Choose how your locations are structured.";if(useLayout===false)return "Uniform structure. Roles will be assigned directly per location.";var la=getLayoutAreas();if(!selLayout)return "Choose a saved layout or create a new one.";if(selLayout==="new"&&la.length===0)return "Add areas to define how your locations are organized.";var reqCount=0;la.forEach(function(a){var r=getAreaReqs(a.aid);reqCount+=r.skills.length+r.certs.length;});return la.length+" area"+(la.length!==1?"s":"")+" ready"+(reqCount>0?" with "+reqCount+" requirement"+(reqCount!==1?"s":"")+". Expand any area to configure.":".");}
    if(step===3){var t=countTotals();if(t.totalPeople===0)return "Add roles to define workforce requirements.";if(roleSrc==="jobprofile")return "Tracking "+t.totalPeople+" positions. Next step: define skill & certificate targets.";return "Tracking "+t.totalPeople+" positions. Estimated readiness: "+calcRd()+"%.";}
    if(step===4&&roleSrc==="jobprofile"){var ts=targetSummary();if(ts.skills===0&&ts.certs===0)return "Select skills and certificates to define what readiness means for each profile.";return ts.skills+" skill"+(ts.skills!==1?"s":"")+" and "+ts.certs+" certificate"+(ts.certs!==1?"s":"")+" targeted. Adjust levels and coverage as needed.";}
    if(step===timelineN){if(!sq&&!tq)return "Set a timeline to enable progress tracking and deadline alerts.";if(sq&&tq&&rev)return "Financial context linked. Opportunity cost will track against readiness.";if(sq&&tq)return "Timeline locked. Quarterly snapshots will track progress.";return "Select both quarters to define the tracking window.";}
    return "";
  }

  function generateInsights(){
    var arr=[];var rd=calcRd();var tots=countTotals();var gapCount=Math.round(tots.totalPeople*0.2);var MDH=String.fromCharCode(8212);
    arr.push({tp:"info",tx:"Scanned "+tots.totalPeople+" positions across "+tots.totalDepts+" location"+(tots.totalDepts>1?"s":"")+" and "+tots.totalRoles+" role type"+(tots.totalRoles>1?"s":"")+"."});
    arr.push({tp:isProj?"warn":"info",tx:isProj?"Projection mode: all "+tots.totalPeople+" positions need filling.":"Cross-referenced "+tots.totalPeople+" positions against employee records. "+gapCount+" gap"+(gapCount!==1?"s":"")+" identified."});
    if(tots.essRoles>0) arr.push({tp:rd<60?"critical":"warn",tx:tots.essPeople+" people across "+tots.essRoles+" Essential role"+(tots.essRoles>1?"s":"")+". 2x weight in readiness."});
    /* Job profile specific insights */
    if(roleSrc==="jobprofile"){
      var skg=computeSkillGaps();var ckg=computeCertGaps();var skRd=computeSkillRd();var ctRd=computeCertRd();
      arr.push({tp:"info",tx:"Job Profile targets defined. Measuring against "+targetSummary().skills+" skill"+(targetSummary().skills!==1?"s":"")+" and "+targetSummary().certs+" certificate"+(targetSummary().certs!==1?"s":"")+"."});
      if(skg.length>0){var largeSk=skg.filter(function(g){return g.n>=10;});arr.push({tp:largeSk.length>0?"critical":"warn",tx:skg.length+" skill gap"+(skg.length!==1?"s":"")+". "+skg.reduce(function(s,g){return s+g.n;},0)+" people need upskilling."});}
      else arr.push({tp:"success",tx:"No skill gaps detected. All positions meet target levels."});
      if(ckg.length>0){arr.push({tp:ckg.some(function(g){return g.n>=10;})?
        "critical":"warn",tx:ckg.length+" certificate gap"+(ckg.length!==1?"s":"")+". "+ckg.reduce(function(s,g){return s+g.n;},0)+" certifications needed."});}
      else arr.push({tp:"success",tx:"All certificate requirements met across targeted profiles."});
      arr.push({tp:skRd>=85?"success":skRd>=60?"warn":"critical",tx:"Skill readiness: "+skRd+"%. Certificate readiness: "+ctRd+"%."});
    } else {
      var skillHits=LIBRARY.filter(function(l){return l.sk;}).length;
      arr.push({tp:"success",tx:"Content library: "+skillHits+" items checked. "+(skillHits>3?Math.floor(skillHits*0.6)+" potential matches":"Limited matches")+" for gaps."});
      if(!isProj) arr.push({tp:rd>=85?"success":"warn",tx:"Compliance: "+(rd>=85?"No critical certificate risks.":"Gaps in "+Math.ceil(gapCount*0.4)+" certificate type"+(Math.ceil(gapCount*0.4)>1?"s":"")+". Review recommended.")});
    }
    if(rev&&pv(rev)>0){var oc=Math.round(pv(rev)*(1-rd/100));arr.push({tp:oc>pv(rev)*0.3?"warn":"info",tx:"Value at stake: "+fD(pv(rev))+". Opportunity cost from gaps: "+fD(oc)+"."});}
    if(inv&&pv(inv)>0&&rev&&pv(rev)>0){var roi=Math.round((pv(rev)-pv(inv))/pv(inv)*100);arr.push({tp:roi>100?"success":"info",tx:"Projected ROI: "+roi+"% ("+fD(pv(inv))+" investment vs "+fD(pv(rev))+" revenue)."});}
    if(rd<60&&!isProj) arr.push({tp:"critical",tx:"Readiness at "+rd+"% "+MDH+" below threshold. Action plan will be generated."});
    else if(rd<85&&!isProj) arr.push({tp:"warn",tx:"Readiness at "+rd+"%. Targeted actions can reach 85%+ within one quarter."});
    else if(!isProj) arr.push({tp:"success",tx:"Strong readiness at "+rd+"%. Minor optimizations available."});
    return arr;
  }
  function runAnalysis(){
    sAnalyzing(true);sAnalysisDone(false);sScanPhase(0);sInsights([]);
    var generated=generateInsights();var seq=[];var tp=6;
    for(var pi=0;pi<tp;pi++){(function(idx){seq.push(function(){sScanPhase(idx+1);});})(pi);}
    for(var ii=0;ii<generated.length;ii++){(function(item){seq.push(function(){sInsights(function(prev){return prev.concat([item]);});});})(generated[ii]);}
    seq.push(function(){sAnalyzing(false);sAnalysisDone(true);});
    var delay=0;for(var si=0;si<seq.length;si++){(function(fn,d){setTimeout(fn,d);})(seq[si],delay);delay+=(si<tp?320:260);}
  }
  function canNext(){
    if(step===1)return name.trim().length>0;
    if(step===2)return selD.length>0;
    if(step===25){if(useLayout===null)return false;if(useLayout===false)return true;if(!selLayout)return false;if(selLayout==="new")return newLayoutName.trim().length>0&&newAreas.filter(function(a){return a.anm.trim();}).length>0;return true;}
    if(step===3){var v2=Object.values(dCirc);for(var i=0;i<v2.length;i++){if(v2[i].length>0)return true;}return false;}
    if(step===4&&roleSrc==="jobprofile"){
      var keys=Object.keys(jpTargets);
      for(var i=0;i<keys.length;i++){var t=jpTargets[keys[i]];if(t&&t.skills.some(function(s){return s.on;}))return true;}
      return false;
    }
    if(step===analysisN)return analysisDone;
    return true;
  }
  function buildRole(dc){var q=isProj?0:Math.floor(dc.rq*0.8);return {cid:dc.cid,cn:dc.cnm,cr:dc.cr,rq:dc.rq,ql:q,gp:Math.max(0,dc.rq-q)};}
  function doComplete(){
    var rd=calcRd();
    var layoutAreas=getLayoutAreas();
    var deps=selD.map(function(dept){
      if(useLayout&&selLayout){
        var active=getDeptActiveAreas(dept.id);
        if(active.length>0){
          var areas=active.map(function(aId){
            var key=dept.id+"__"+aId;
            var dc=dCirc[key]||[];
            var area=layoutAreas.find(function(a){return a.aid===aId;});
            var reqs=getAreaReqs(aId);
            var aObj={aid:aId,anm:area?area.anm:aId,roles:dc.map(buildRole)};
            if(reqs.skills.length>0)aObj.skillReqs=reqs.skills.map(function(sk){return {s:sk.s,lvl:sk.lvl};});
            if(reqs.certs.length>0)aObj.certReqs=reqs.certs;
            return aObj;
          }).filter(function(a){return a.roles.length>0;});
          if(areas.length>0)return {did:dept.id,dn:dept.nm,layout:selLayout,areas:areas};
        }
      }
      return {did:dept.id,dn:dept.nm,roles:(dCirc[dept.id]||[]).map(buildRole)};
    });
    /* Save new layout template */
    if(useLayout&&selLayout==="new"&&newLayoutName.trim()&&newAreas.length>0){
      var validAreas=newAreas.filter(function(a){return a.anm.trim();}).map(function(a){
        var reqs=getAreaReqs(a.aid);
        var aObj={aid:a.aid,anm:a.anm};
        if(reqs.skills.length>0)aObj.skillReqs=reqs.skills.map(function(sk){return {s:sk.s,lvl:sk.lvl};});
        if(reqs.certs.length>0)aObj.certReqs=reqs.certs;
        return aObj;
      });
      if(validAreas.length>0){
        var newTmpl={id:"lt_"+Date.now(),nm:newLayoutName.trim(),areas:validAreas};
        p.setLT(function(prev){return prev.concat([newTmpl]);});
      }
    }
    /* Auto-save role + target presets for existing layout templates */
    if(useLayout&&selLayout&&selLayout!=="new"){saveRolePreset();if(roleSrc==="jobprofile"&&Object.keys(jpTargets).length>0)saveTargetPreset();}
    var sg,cg,skillRdVal,certRdVal;
    if(roleSrc==="jobprofile"){
      sg=computeSkillGaps();cg=computeCertGaps();skillRdVal=isProj?0:computeSkillRd();certRdVal=isProj?0:computeCertRd();
    } else {
      sg=rd<100?[{s:"Gaps detected",n:Math.ceil((100-rd)/10),i:rd<40?"Critical":"High"}]:[];
      cg=rd<100?[{c:"Cert gaps",n:Math.ceil((100-rd)/15),i:rd<40?"Critical":"High"}]:[];
      skillRdVal=isProj?0:Math.floor(rd*0.95);certRdVal=isProj?0:Math.floor(rd*0.85);
    }
    p.onDone({id:"i_"+Date.now(),nm:name.trim(),ds:desc.trim()||"No description.",tp:type,st:isProj?"projection":"active",roleSrc:roleSrc,depts:deps,rev:pv(rev),inv:pv(inv),sd:sq||"TBD",td:tq||"TBD",_skillRd:skillRdVal,_certRd:certRdVal,sg:sg,cg:cg,jpTargets:roleSrc==="jobprofile"?jpTargets:undefined,certs:[],hist:[]});
  }
  function goToStep(n){
    if(n===4&&roleSrc==="jobprofile"){sStep(4);initTargets();}
    else if(n===analysisN&&step!==analysisN){sStep(n);setTimeout(runAnalysis,300);}
    else{sStep(n);if(n!==analysisN){sAnalyzing(false);sAnalysisDone(false);sInsights([]);sScanPhase(0);}}
  }

  var iS={width:"100%",padding:"10px 14px",borderRadius:10,border:"1px solid "+T.bd,background:T.ib,color:T.tx,fontSize:13,fontFamily:"inherit",outline:"none",boxSizing:"border-box",transition:"border-color 0.3s"};
  var qs=["Q1 2025","Q2 2025","Q3 2025","Q4 2025","Q1 2026","Q2 2026"];
  var scanLabels=["Scanning employee records","Cross-referencing skill profiles","Checking certificate compliance","Matching content library","Calculating weighted readiness","Generating insights"];
  var tots=countTotals();
  var CHK=String.fromCharCode(10003);var CROSS=String.fromCharCode(215);var ARROW=String.fromCharCode(8594);
  var TRI_D=String.fromCharCode(9660);var TRI_R=String.fromCharCode(9654);var DOT=String.fromCharCode(8226);var ELLIP=String.fromCharCode(8230);
  var hintText=getHint();

  function handleWizKey(e){
    if(e.key==="Enter"){
      /* Don't intercept Enter inside textareas, selects, or buttons */
      var tag=e.target.tagName;
      if(tag==="TEXTAREA"||tag==="BUTTON"||tag==="SELECT")return;
      /* Don't intercept Enter if inside a modal overlay (new dept / new circle dialogs) */
      if(mND||mNC)return;
      e.preventDefault();
      if(canNext()){
        var nxt=nxtStep(step);
        if(nxt!==null)goToStep(nxt);else doComplete();
      }
    }
  }

  return (
    <div ref={wizRef} onKeyDown={handleWizKey} style={{padding:mob?"16px 12px":"24px 32px",maxWidth:900,margin:"0 auto"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <h1 style={{fontSize:22,fontWeight:700,margin:0}}>Create Initiative</h1>
        <button onClick={p.onClose} style={{background:"none",border:"none",color:T.td,cursor:"pointer",fontSize:18,fontFamily:"inherit"}}>{CROSS}</button>
      </div>
      {/* Stepper */}
      <div style={{display:"flex",alignItems:"center",marginBottom:8}}>
        {stps.map(function(s,idx){var isActive=step===s.n;var isDone=stpIdx(step)>idx;return (
          <div key={s.n} style={{display:"flex",alignItems:"center",flex:idx<stps.length-1?1:0}}>
            <div style={{display:"flex",alignItems:"center",gap:6}}>
              <div style={{width:26,height:26,borderRadius:13,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:600,background:isActive?T.ac:isDone?T.gn:T.sa,color:isActive||isDone?"#FFFFFF":T.td,transition:"all 0.4s ease",animation:isActive?"wizGlow 2.5s ease infinite":"none"}}>{isDone?<span style={{animation:"wizPop 0.3s ease"}}>{CHK}</span>:idx+1}</div>
              {!mob&&<span style={{fontSize:11,fontWeight:isActive?600:400,color:isActive?T.tx:T.td,whiteSpace:"nowrap",transition:"color 0.3s"}}>{s.l}</span>}
            </div>
            {idx<stps.length-1&&<div style={{flex:1,height:2,margin:"0 8px",background:T.bd,position:"relative",overflow:"hidden",borderRadius:1}}><div style={{position:"absolute",top:0,left:0,height:"100%",background:isDone?T.gn:isActive?T.ac:"transparent",width:isDone?"100%":isActive?"50%":"0%",transition:"width 0.6s ease",borderRadius:1}}/></div>}
          </div>
        );})}
      </div>
      {/* Step subtitle — compact, no box */}
      {step!==analysisN&&hintText&&(<div style={{marginBottom:12}}><span style={{fontSize:11,color:T.td,lineHeight:"1.3"}}>{hintText}</span></div>)}
      <div style={{minHeight:340}}>
        {step===1&&(<div style={{display:"flex",flexDirection:"column",gap:18,animation:"wizFadeUp 0.4s ease"}}>
          <div><label style={{fontSize:11,color:T.td,display:"block",marginBottom:6,textTransform:"uppercase"}}>Initiative Name *</label><input value={name} onChange={function(e){sName(e.target.value);}} placeholder="e.g. Helsingor - New Opening" style={iS}/></div>
          <div><label style={{fontSize:11,color:T.td,display:"block",marginBottom:6,textTransform:"uppercase"}}>Description</label><textarea value={desc} onChange={function(e){sDesc(e.target.value);}} placeholder="What is this initiative for?" rows={2} style={{width:"100%",padding:"10px 14px",borderRadius:10,border:"1px solid "+T.bd,background:T.ib,color:T.tx,fontSize:13,fontFamily:"inherit",outline:"none",resize:"vertical",boxSizing:"border-box"}}/></div>
          <div><label style={{fontSize:11,color:T.td,display:"block",marginBottom:8,textTransform:"uppercase"}}>Type</label><div style={{display:"flex",gap:10}}>{["Operational","Administrative"].map(function(t){return (<button key={t} onClick={function(){sType(t);}} style={{flex:1,padding:"12px 16px",borderRadius:12,border:"2px solid "+(type===t?T.ac:T.bd),background:type===t?T.ad:"transparent",color:type===t?T.ac:T.tm,fontSize:13,cursor:"pointer",fontFamily:"inherit",textAlign:"left",transition:"all 0.3s ease"}}><div style={{fontWeight:600,marginBottom:2}}>{t}</div><div style={{fontSize:11,opacity:0.7}}>{t==="Operational"?"Stores, warehouses, locations":"HQ, corporate, back-office"}</div></button>);})}</div></div>
          <label style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer",padding:"10px 14px",borderRadius:10,border:"1px solid "+(isProj?T.pu+"50":T.bd),background:isProj?T.pd:"transparent",transition:"all 0.3s ease"}} onClick={function(){sProj(!isProj);}}><div style={{width:18,height:18,borderRadius:4,border:"2px solid "+(isProj?T.pu:T.bl),background:isProj?T.pu:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all 0.2s"}}>{isProj&&<span style={{color:"white",fontSize:10,fontWeight:700,animation:"wizPop 0.3s ease"}}>{CHK}</span>}</div><div><span style={{fontSize:13,color:isProj?T.pu:T.tm,fontWeight:isProj?600:400}}>This is a projection</span><span style={{fontSize:11,color:T.td,display:"block"}}>Future-state planning, no current employees matched</span></div></label>
        </div>)}
        {step===2&&(<div style={{animation:"wizFadeUp 0.4s ease"}}>
          <div style={{display:"flex",justifyContent:"flex-end",alignItems:"center",marginBottom:12}}><button onClick={function(){sMND(true);}} style={{padding:"5px 12px",borderRadius:8,border:"1px solid "+T.bd,background:"transparent",color:T.tm,fontSize:11,cursor:"pointer",fontFamily:"inherit"}}>+ New Dept</button></div>
          {p.deptTree.map(function(region){
            var allSel=region.ch.length>0&&region.ch.every(function(d2){return selD.find(function(x){return x.id===d2.id;});});
            var someSel=region.ch.some(function(d2){return selD.find(function(x){return x.id===d2.id;});});
            var selCount=region.ch.filter(function(d2){return selD.find(function(x){return x.id===d2.id;});}).length;
            return (<div key={region.id} style={{marginBottom:6}}>
            <div style={{display:"flex",alignItems:"center",gap:8,padding:"8px 14px",cursor:"pointer",borderRadius:8,background:T.sa}}>
              <div onClick={function(e){e.stopPropagation();togRegion(region);}} style={{width:15,height:15,borderRadius:3,border:"1.5px solid "+(allSel?T.ac:someSel?T.ac+"60":T.bl),background:allSel?T.ac:someSel?T.ac+"30":"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all 0.2s",cursor:"pointer"}}>
                {allSel&&<span style={{color:"#FFFFFF",fontSize:9,fontWeight:700}}>{CHK}</span>}
                {someSel&&!allSel&&<span style={{color:"#FFFFFF",fontSize:9,fontWeight:700}}>{String.fromCharCode(8722)}</span>}
              </div>
              <div onClick={function(){togExp(region.id);}} style={{display:"flex",alignItems:"center",gap:8,flex:1}}>
                <span style={{fontSize:10,color:T.td,width:12,textAlign:"center"}}>{exp[region.id]||someSel?TRI_D:TRI_R}</span>
                <span style={{fontSize:13,fontWeight:600,color:T.tx}}>{region.nm}</span>
                <span style={{fontSize:10,color:T.td}}>({region.ch.length})</span>
                {selCount>0&&<span style={{fontSize:10,color:T.ac}}>{selCount} selected</span>}
              </div>
            </div>
            {(exp[region.id]||someSel)&&<div style={{paddingLeft:28}}>{region.ch.map(function(d2,di){var sel=selD.find(function(x){return x.id===d2.id;});return (<div key={d2.id} onClick={function(){togDept(d2);}} style={{display:"flex",alignItems:"center",gap:10,padding:"6px 12px",cursor:"pointer",borderRadius:6,background:sel?T.ad:"transparent",marginBottom:1,transition:"all 0.2s",animation:"wizSlideIn 0.3s ease",animationDelay:(di*40)+"ms",animationFillMode:"backwards"}}><div style={{width:15,height:15,borderRadius:3,border:"1.5px solid "+(sel?T.ac:T.bl),background:sel?T.ac:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all 0.2s"}}>{sel&&<span style={{color:"#FFFFFF",fontSize:9,fontWeight:700,animation:"wizPop 0.2s ease"}}>{CHK}</span>}</div><span style={{fontSize:13,color:sel?T.tx:T.tm}}>{d2.nm}</span></div>);})}</div>}
          </div>);})}
          {selD.length>0&&<div style={{marginTop:10,padding:"8px 14px",borderRadius:8,background:T.ad,fontSize:11,color:T.ac,animation:"wizFadeUp 0.3s ease"}}><span style={{fontWeight:600}}>{selD.length} location{selD.length>1?"s":""}</span>{" "+DOT+" "+selD.map(function(d){return d.nm;}).join(", ")}</div>}
        </div>)}
        {/* ===== Step 25: Store Layout ===== */}
        {step===25&&(<div style={{animation:"wizFadeUp 0.4s ease"}}>
          {/* Decision cards */}
          <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr",gap:14,marginBottom:16}}>
            {(function(){
              var multiSel=useLayout===true;var uniSel=useLayout===false;
              /* Mini diagram: multi-area — 3 stacked sections with labels */
              var multiViz=(<svg width="140" height="110" viewBox="0 0 140 110" fill="none" style={{flexShrink:0}}>
                <rect x="0" y="0" width="140" height="32" rx="6" fill={multiSel?T.ad:T.sa}/>
                <rect x="8" y="8" width="50" height="4" rx="2" fill={multiSel?T.ac:T.bd}/>
                <rect x="8" y="16" width="30" height="3" rx="1.5" fill={multiSel?T.ac+"60":T.bd+"80"}/>
                <rect x="8" y="22" width="38" height="3" rx="1.5" fill={multiSel?T.ac+"40":T.bd+"60"}/>
                <rect x="90" y="8" width="40" height="16" rx="4" fill={multiSel?T.ac+"20":T.sa}/>
                <rect x="96" y="13" width="28" height="3" rx="1.5" fill={multiSel?T.ac+"50":T.bd}/>
                <rect x="0" y="38" width="140" height="32" rx="6" fill={multiSel?T.ad:T.sa}/>
                <rect x="8" y="46" width="42" height="4" rx="2" fill={multiSel?T.ac:T.bd}/>
                <rect x="8" y="54" width="34" height="3" rx="1.5" fill={multiSel?T.ac+"60":T.bd+"80"}/>
                <rect x="8" y="60" width="26" height="3" rx="1.5" fill={multiSel?T.ac+"40":T.bd+"60"}/>
                <rect x="90" y="46" width="40" height="16" rx="4" fill={multiSel?T.ac+"20":T.sa}/>
                <rect x="96" y="51" width="28" height="3" rx="1.5" fill={multiSel?T.ac+"50":T.bd}/>
                <rect x="0" y="76" width="140" height="32" rx="6" fill={multiSel?T.ad:T.sa}/>
                <rect x="8" y="84" width="56" height="4" rx="2" fill={multiSel?T.ac:T.bd}/>
                <rect x="8" y="92" width="28" height="3" rx="1.5" fill={multiSel?T.ac+"60":T.bd+"80"}/>
                <rect x="8" y="98" width="44" height="3" rx="1.5" fill={multiSel?T.ac+"40":T.bd+"60"}/>
                <rect x="90" y="84" width="40" height="16" rx="4" fill={multiSel?T.ac+"20":T.sa}/>
                <rect x="96" y="89" width="28" height="3" rx="1.5" fill={multiSel?T.ac+"50":T.bd}/>
              </svg>);
              /* Mini diagram: uniform — single block with repeated rows */
              var uniViz=(<svg width="140" height="110" viewBox="0 0 140 110" fill="none" style={{flexShrink:0}}>
                <rect x="0" y="0" width="140" height="110" rx="6" fill={uniSel?T.ad:T.sa}/>
                {[14,30,46,62,78].map(function(y,i){return (<g key={i}>
                  <rect x="12" y={y} width="36" height="4" rx="2" fill={uniSel?T.ac:T.bd}/>
                  <rect x="56" y={y} width="28" height="4" rx="2" fill={uniSel?T.ac+"50":T.bd+"80"}/>
                  <rect x="92" y={y} width="36" height="4" rx="2" fill={uniSel?T.ac+"30":T.bd+"60"}/>
                  <rect x="12" y={y+8} width="116" height="1" rx="0.5" fill={uniSel?T.ac+"15":T.bd+"40"}/>
                </g>);})}
              </svg>);
              return [
                <div key="multi" onClick={function(){sUseLayout(true);}} style={{padding:"20px 22px",borderRadius:14,border:"2px solid "+(multiSel?T.ac:T.bd),background:T.sf,cursor:"pointer",transition:"all 0.3s ease",position:"relative",overflow:"hidden",display:"flex",alignItems:"center",gap:20}}>
                  {multiSel&&<div style={{position:"absolute",top:12,right:12,width:24,height:24,borderRadius:12,background:T.ac,display:"flex",alignItems:"center",justifyContent:"center",animation:"wizPop 0.3s ease"}}><span style={{color:"#FFFFFF",fontSize:11,fontWeight:700}}>{CHK}</span></div>}
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:15,fontWeight:700,color:multiSel?T.ac:T.tx,marginBottom:6}}>Divide into Areas</div>
                    <div style={{fontSize:12,color:T.tm,lineHeight:"1.6",marginBottom:10}}>Different sections with their own team structures and requirements.</div>
                    <div style={{display:"flex",flexDirection:"column",gap:4}}>
                      <div style={{display:"flex",alignItems:"center",gap:6,fontSize:11,color:multiSel?T.ac:T.tm}}><span style={{fontSize:9}}>{CHK}</span> Per-area readiness tracking</div>
                      <div style={{display:"flex",alignItems:"center",gap:6,fontSize:11,color:multiSel?T.ac:T.tm}}><span style={{fontSize:9}}>{CHK}</span> Reusable layout templates</div>
                    </div>
                  </div>
                  {multiViz}
                </div>,
                <div key="uni" onClick={function(){sUseLayout(false);sSelLayout(null);}} style={{padding:"20px 22px",borderRadius:14,border:"2px solid "+(uniSel?T.ac:T.bd),background:T.sf,cursor:"pointer",transition:"all 0.3s ease",position:"relative",overflow:"hidden",display:"flex",alignItems:"center",gap:20}}>
                  {uniSel&&<div style={{position:"absolute",top:12,right:12,width:24,height:24,borderRadius:12,background:T.ac,display:"flex",alignItems:"center",justifyContent:"center",animation:"wizPop 0.3s ease"}}><span style={{color:"#FFFFFF",fontSize:11,fontWeight:700}}>{CHK}</span></div>}
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:15,fontWeight:700,color:uniSel?T.ac:T.tx,marginBottom:6}}>Uniform Structure</div>
                    <div style={{fontSize:12,color:T.tm,lineHeight:"1.6",marginBottom:10}}>Same roles everywhere. One setup applies to all locations.</div>
                    <div style={{display:"flex",flexDirection:"column",gap:4}}>
                      <div style={{display:"flex",alignItems:"center",gap:6,fontSize:11,color:uniSel?T.ac:T.tm}}><span style={{fontSize:9}}>{CHK}</span> Quick to configure</div>
                      <div style={{display:"flex",alignItems:"center",gap:6,fontSize:11,color:uniSel?T.ac:T.tm}}><span style={{fontSize:9}}>{CHK}</span> Easy to scale</div>
                    </div>
                  </div>
                  {uniViz}
                </div>
              ];
            })()}
          </div>
          {/* Layout configuration (shown when useLayout is true) */}
          {useLayout&&(function(){
            var templates=(p.layoutTemplates||[]);
            var hasTemplates=templates.length>0;
            return (<div style={{animation:"wizFadeUp 0.3s ease"}}>
              {hasTemplates&&(<div style={{marginBottom:14}}>
                <label style={{fontSize:11,color:T.td,display:"block",marginBottom:8,textTransform:"uppercase"}}>Choose a Layout</label>
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:10}}>
                  {templates.map(function(tmpl){var sel=selLayout===tmpl.id;return (
                    <div key={tmpl.id} onClick={function(){sSelLayout(tmpl.id);loadTemplateReqs(tmpl.id);}} style={{padding:"12px 14px",borderRadius:10,border:"2px solid "+(sel?T.ac:T.bd),background:sel?T.ad:"transparent",cursor:"pointer",transition:"all 0.3s",animation:"wizSlideIn 0.3s ease"}}>
                      <div style={{fontSize:13,fontWeight:600,color:sel?T.ac:T.tx,marginBottom:4}}>{tmpl.nm}</div>
                      <div style={{fontSize:10,color:T.td}}>{tmpl.areas.length} area{tmpl.areas.length!==1?"s":""}{tmpl.rolePreset?" "+DOT+" roles saved":""}</div>
                    </div>
                  );})}
                  <div onClick={function(){sSelLayout("new");}} style={{padding:"12px 14px",borderRadius:10,border:"2px dashed "+(selLayout==="new"?T.ac:T.bd),background:selLayout==="new"?T.ad:"transparent",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",minHeight:60,transition:"all 0.3s"}}>
                    <span style={{fontSize:12,color:selLayout==="new"?T.ac:T.td,fontWeight:500}}>+ Create New Layout</span>
                  </div>
                </div>
              </div>)}
              {(!hasTemplates||selLayout==="new")&&(<div style={{marginBottom:14,padding:14,borderRadius:10,border:"1px solid "+T.bd,background:T.sa+"60",animation:"wizFadeUp 0.3s ease"}}>
                <label style={{fontSize:11,color:T.td,display:"block",marginBottom:6,textTransform:"uppercase"}}>Layout Name *</label>
                <input value={newLayoutName} onChange={function(e){sNewLayoutName(e.target.value);if(!selLayout)sSelLayout("new");}} placeholder="e.g. POWER Standard" style={iS}/>
                <div style={{marginTop:12,marginBottom:6,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <label style={{fontSize:11,color:T.td,textTransform:"uppercase"}}>Areas</label>
                  <button onClick={addNewArea} style={{padding:"4px 10px",borderRadius:6,border:"1px solid "+T.ac+"40",background:T.ad,color:T.ac,fontSize:11,cursor:"pointer",fontFamily:"inherit"}}>+ Add Area</button>
                </div>
                {newAreas.length===0&&<div style={{padding:12,textAlign:"center",color:T.td,fontSize:11,borderRadius:6,border:"1px dashed "+T.bd}}>No areas yet. Click &quot;+ Add Area&quot; to start defining your layout.</div>}
                {newAreas.map(function(area,ai){return (
                  <div key={area.aid} style={{display:"flex",alignItems:"center",gap:8,marginBottom:4,animation:"wizSlideIn 0.25s ease",animationDelay:(ai*40)+"ms",animationFillMode:"backwards"}}>
                    <span style={{fontSize:11,color:T.td,minWidth:20}}>{ai+1}.</span>
                    <input value={area.anm} onChange={function(e){updAreaName(area.aid,e.target.value);}} placeholder="e.g. Radio & TV" style={{flex:1,padding:"6px 10px",borderRadius:6,border:"1px solid "+T.bd,background:T.ib,color:T.tx,fontSize:12,fontFamily:"inherit",outline:"none"}}/>
                    <button onClick={function(){remNewArea(area.aid);}} style={{background:"none",border:"none",color:T.td,cursor:"pointer",fontSize:13,fontFamily:"inherit"}}>{CROSS}</button>
                  </div>
                );})}
              </div>)}
              {/* Areas detail: requirements + per-location customization combined */}
              {selLayout&&getLayoutAreas().length>0&&(<div style={{animation:"wizFadeUp 0.3s ease"}}>
                {/* Area cards — each shows requirements inline + location toggles */}
                {getLayoutAreas().map(function(area,ai){
                  var reqs=getAreaReqs(area.aid);
                  var hasReqs=reqs.skills.length>0||reqs.certs.length>0;
                  var isExp=!!areaReqExp[area.aid];
                  /* Which locations have this area active */
                  var locStatus=selD.map(function(dept){var active=getDeptActiveAreas(dept.id);return {id:dept.id,nm:dept.nm,on:active.indexOf(area.aid)>=0};});
                  var allOn=locStatus.every(function(l){return l.on;});
                  return (<div key={area.aid} style={{marginBottom:8,borderRadius:10,border:"1px solid "+(isExp?T.ac+"40":T.bd),background:isExp?T.ad+"20":"transparent",overflow:"hidden",transition:"all 0.3s",animation:"wizSlideIn 0.25s ease",animationDelay:(ai*40)+"ms",animationFillMode:"backwards"}}>
                    {/* Compact area header */}
                    <div onClick={function(){togAreaReqExp(area.aid);}} style={{padding:"10px 14px",display:"flex",alignItems:"center",gap:10,cursor:"pointer"}}>
                      <span style={{fontSize:10,color:T.td,width:12,textAlign:"center",transition:"transform 0.2s",transform:isExp?"rotate(90deg)":"none"}}>{TRI_R}</span>
                      <span style={{fontSize:13,fontWeight:600,color:isExp?T.ac:T.tx}}>{area.anm}</span>
                      {/* Inline summary pills */}
                      <div style={{display:"flex",alignItems:"center",gap:4,flex:1,flexWrap:"wrap"}}>
                        {hasReqs&&reqs.skills.map(function(sk){return (<span key={sk.s} style={{padding:"1px 6px",borderRadius:4,background:T.ac+"12",fontSize:9,color:T.ac}}>{sk.s} <span style={{opacity:0.6}}>L{sk.lvl}</span></span>);})}
                        {hasReqs&&reqs.certs.map(function(ct){return (<span key={ct} style={{padding:"1px 6px",borderRadius:4,background:T.am+"12",fontSize:9,color:T.am}}>{ct}</span>);})}
                      </div>
                      {!allOn&&<span style={{fontSize:9,color:T.am,padding:"1px 6px",borderRadius:4,background:T.amd}}>{locStatus.filter(function(l){return l.on;}).length}/{selD.length} locations</span>}
                      {!hasReqs&&!isExp&&<span style={{fontSize:10,color:T.td,opacity:0.6}}>click to configure</span>}
                    </div>
                    {/* Expanded: requirements + locations */}
                    {isExp&&(<div style={{padding:"0 14px 14px",borderTop:"1px solid "+T.bd+"20"}}>
                      {/* Requirements row */}
                      <div style={{marginTop:10,marginBottom:10}}>
                        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:8}}>
                          <div style={{display:"flex",alignItems:"center",gap:6,flex:1}}>
                            <span style={{fontSize:10,color:T.td,fontWeight:600}}>REQUIRES</span>
                            <select value="" onChange={function(e){if(e.target.value)addAreaSkill(area.aid,e.target.value);}} style={{padding:"2px 6px",borderRadius:5,border:"1px solid "+T.ac+"30",background:"transparent",color:T.ac,fontSize:10,fontFamily:"inherit",cursor:"pointer"}}>
                              <option value="">+ skill</option>
                              {ALL_SKILLS.filter(function(sk){return !reqs.skills.some(function(x){return x.s===sk;});}).map(function(sk){return <option key={sk} value={sk}>{sk}</option>;})}
                            </select>
                            <select value="" onChange={function(e){if(e.target.value)addAreaCert(area.aid,e.target.value);}} style={{padding:"2px 6px",borderRadius:5,border:"1px solid "+T.am+"30",background:"transparent",color:T.am,fontSize:10,fontFamily:"inherit",cursor:"pointer"}}>
                              <option value="">+ cert</option>
                              {ALL_CERTS.filter(function(ct){return reqs.certs.indexOf(ct)<0;}).map(function(ct){return <option key={ct} value={ct}>{ct}</option>;})}
                            </select>
                          </div>
                        </div>
                        {hasReqs&&(<div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                          {reqs.skills.map(function(sk){return (
                            <div key={sk.s} style={{display:"inline-flex",alignItems:"center",gap:4,padding:"3px 8px",borderRadius:5,background:T.ac+"12",border:"1px solid "+T.ac+"20",fontSize:10,color:T.ac}}>
                              {sk.s}
                              {/* Level pips — click to set level 1-5 */}
                              <div style={{display:"inline-flex",gap:2,marginLeft:2}}>
                                {[1,2,3,4,5].map(function(lv){return (
                                  <div key={lv} onClick={function(e){e.stopPropagation();setAreaSkillLvl(area.aid,sk.s,lv);}} style={{width:5,height:5,borderRadius:3,background:lv<=sk.lvl?T.ac:T.ac+"25",cursor:"pointer",transition:"background 0.2s"}}/>
                                );})}
                              </div>
                              <span onClick={function(e){e.stopPropagation();remAreaSkill(area.aid,sk.s);}} style={{cursor:"pointer",opacity:0.5,fontSize:11}}>{CROSS}</span>
                            </div>
                          );})}
                          {reqs.certs.map(function(ct){return (
                            <div key={ct} style={{display:"inline-flex",alignItems:"center",gap:4,padding:"3px 8px",borderRadius:5,background:T.am+"12",border:"1px solid "+T.am+"20",fontSize:10,color:T.am}}>
                              {ct}
                              <span onClick={function(e){e.stopPropagation();remAreaCert(area.aid,ct);}} style={{cursor:"pointer",opacity:0.5,fontSize:11}}>{CROSS}</span>
                            </div>
                          );})}
                        </div>)}
                        {!hasReqs&&<div style={{fontSize:10,color:T.td,opacity:0.6,fontStyle:"italic"}}>No area-specific requirements yet. Anyone placed here will only need their role skills.</div>}
                      </div>
                      {/* Locations for this area */}
                      {selD.length>1&&(<div style={{paddingTop:8,borderTop:"1px solid "+T.bd+"20"}}>
                        <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}>
                          <span style={{fontSize:10,color:T.td,fontWeight:600}}>ACTIVE IN</span>
                        </div>
                        <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                          {locStatus.map(function(loc){return (
                            <div key={loc.id} onClick={function(){togDeptArea(loc.id,area.aid);}} style={{padding:"4px 10px",borderRadius:6,border:"1px solid "+(loc.on?T.ac+"40":T.bd),background:loc.on?T.ad:"transparent",cursor:"pointer",fontSize:11,color:loc.on?T.ac:T.td,fontWeight:loc.on?500:400,transition:"all 0.2s",display:"flex",alignItems:"center",gap:4}}>
                              <div style={{width:12,height:12,borderRadius:3,border:"1.5px solid "+(loc.on?T.ac:T.bl),background:loc.on?T.ac:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all 0.2s"}}>{loc.on&&<span style={{color:"#FFFFFF",fontSize:7,fontWeight:700}}>{CHK}</span>}</div>
                              {loc.nm}
                            </div>
                          );})}
                        </div>
                      </div>)}
                    </div>)}
                  </div>);
                })}
              </div>)}
            </div>);
          })()}
        </div>)}
        {step===3&&(<div style={{animation:"wizFadeUp 0.4s ease"}}>
          {/* Source toggle + New button */}
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
            <div style={{flex:1}}/>
            <button onClick={function(){sNcDp(null);sMNC(true);}} style={{padding:"5px 12px",borderRadius:8,border:"1px solid "+T.bd,background:"transparent",color:T.tm,fontSize:11,cursor:"pointer",fontFamily:"inherit",flexShrink:0}}>{"+ New "+(roleSrc==="circle"?"Circle":"Profile")}</button>
            <div style={{display:"flex",borderRadius:8,overflow:"hidden",border:"1px solid "+T.bd,flexShrink:0}}>
              {[{k:"circle",l:"Circles"},{k:"jobprofile",l:"Job Profiles"}].map(function(s){var sel=roleSrc===s.k;return (<button key={s.k} onClick={function(){sRoleSrc(s.k);}} style={{padding:"5px 14px",fontSize:11,fontWeight:sel?600:400,background:sel?T.ad:"transparent",color:sel?T.ac:T.td,border:"none",cursor:"pointer",fontFamily:"inherit",transition:"all 0.3s ease"}}>{s.l}</button>);})}
            </div>
          </div>
          {/* Build role slots: either flat (dept-only) or area-aware (dept+area composite keys) */}
          {(function(){
            var roleSlots=[];
            var layoutAreas3=getLayoutAreas();
            if(useLayout&&selLayout&&layoutAreas3.length>0){
              selD.forEach(function(dept){
                var activeAIds=getDeptActiveAreas(dept.id);
                activeAIds.forEach(function(aId){
                  var area=layoutAreas3.find(function(a){return a.aid===aId;});
                  roleSlots.push({key:dept.id+"__"+aId,dId:dept.id,aId:aId,label:dept.nm,areaLabel:area?area.anm:aId});
                });
              });
            }else{
              selD.forEach(function(dept){
                roleSlots.push({key:dept.id,dId:dept.id,aId:null,label:dept.nm,areaLabel:null});
              });
            }
            /* Group by department for visual hierarchy when areas active */
            var deptGroups={};var deptOrder=[];
            roleSlots.forEach(function(slot){
              if(!deptGroups[slot.dId]){deptGroups[slot.dId]=[];deptOrder.push(slot.dId);}
              deptGroups[slot.dId].push(slot);
            });
            var srcList=roleSrc==="circle"?p.circlesList:p.jobProfilesList;
            return deptOrder.map(function(dId,dIdx){
              var slots=deptGroups[dId];
              var deptName=slots[0].label;
              var hasAreas=slots[0].aId!==null;
              /* Check if this dept has any roles configured */
              var deptHasRoles=false;
              var deptTotalPos=0;
              slots.forEach(function(sl){var rs=dCirc[sl.key]||[];if(rs.length>0)deptHasRoles=true;rs.forEach(function(r){deptTotalPos+=r.rq;});});
              var showApply=deptOrder.length>1&&deptHasRoles;
              /* Check if template has a saved preset available */
              var tmplHasPreset=useLayout&&selLayout&&selLayout!=="new"&&(function(){var tmpl=(p.layoutTemplates||[]).find(function(t){return t.id===selLayout;});return tmpl&&tmpl.rolePreset&&Object.keys(tmpl.rolePreset).length>0;})();
              /* Collapse: first dept open by default, rest collapsed */
              var isDeptOpen=roleDeptExp[dId]===undefined?dIdx===0:roleDeptExp[dId];
              return (<div key={dId} style={{marginBottom:8,borderRadius:10,border:"1px solid "+T.bd,overflow:"hidden"}}>
                {/* Dept header — always visible, clickable to expand/collapse */}
                <div onClick={function(){togRoleDeptExp(dId);}} style={{padding:"8px 14px",background:T.sa,display:"flex",alignItems:"center",gap:8,cursor:"pointer",borderBottom:isDeptOpen?"1px solid "+T.bd:"none"}}>
                  <span style={{fontSize:10,color:T.td,width:12,textAlign:"center",transition:"transform 0.2s",transform:isDeptOpen?"rotate(90deg)":"none"}}>{TRI_R}</span>
                  <span style={{fontSize:13,fontWeight:600,flex:1}}>{deptName}</span>
                  {/* Summary badges when collapsed */}
                  {deptTotalPos>0&&<span style={{fontSize:10,color:T.ac,padding:"1px 8px",borderRadius:4,background:T.ad}}>{deptTotalPos} positions</span>}
                  {!deptHasRoles&&<span style={{fontSize:10,color:T.td,opacity:0.6}}>not configured</span>}
                  {/* Apply saved preset to this dept */}
                  {tmplHasPreset&&!deptHasRoles&&<button onClick={function(e){e.stopPropagation();applyPresetToDept(dId);}} style={{padding:"3px 10px",borderRadius:6,border:"1px solid "+T.ac+"40",background:T.ad,color:T.ac,fontSize:10,cursor:"pointer",fontFamily:"inherit",fontWeight:500,transition:"all 0.2s"}}>Apply Preset</button>}
                  {showApply&&<button onClick={function(e){e.stopPropagation();applyToAll(dId);}} style={{padding:"3px 10px",borderRadius:6,border:"1px solid "+T.ac+"40",background:T.ad,color:T.ac,fontSize:10,cursor:"pointer",fontFamily:"inherit",fontWeight:500,transition:"all 0.2s"}}>Apply to all</button>}
                  {useLayout&&selLayout&&selLayout!=="new"&&deptHasRoles&&(function(){var isSaved=presetSavedId===dId;return <button onClick={function(e){e.stopPropagation();saveRolePreset(dId);sPresetSavedId(dId);setTimeout(function(){sPresetSavedId(null);},2000);}} style={{padding:"3px 10px",borderRadius:6,border:"1px solid "+(isSaved?T.gn+"40":T.bd),background:isSaved?T.gd:T.sf,color:isSaved?T.gn:T.tx,fontSize:10,cursor:"pointer",fontFamily:"inherit",fontWeight:500,transition:"all 0.2s"}}>{isSaved?CHK+" Saved":"Save as Preset"}</button>;})()}
                </div>
                {/* Expanded content */}
                {isDeptOpen&&slots.map(function(slot){
                  var roles=dCirc[slot.key]||[];
                  return (<div key={slot.key} style={{borderBottom:hasAreas?"1px solid "+T.bd+"15":"none"}}>
                    <div style={{padding:hasAreas?"6px 14px 6px 28px":"6px 14px",borderBottom:"1px solid "+T.bd,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <div style={{display:"flex",alignItems:"center",gap:8}}>
                        {hasAreas&&<span style={{fontSize:10,color:T.ac}}>{TRI_R}</span>}
                        <span style={{fontSize:hasAreas?12:12,fontWeight:500,color:hasAreas?T.tm:T.tx}}>{hasAreas?slot.areaLabel:slot.label}</span>
                        {roles.length>0&&<span style={{fontSize:10,color:T.ac,animation:"wizFadeUp 0.3s ease"}}>{roles.reduce(function(s,r){return s+r.rq;},0)} positions</span>}
                      </div>
                      <select value="" onChange={function(e){var cid=e.target.value;if(!cid)return;var found=srcList.find(function(x){return x.id===cid;});if(found)addC(slot.key,found);}} style={{padding:"4px 8px",borderRadius:6,border:"1px solid "+(roleSrc==="circle"?T.ac:T.pu)+"40",background:roleSrc==="circle"?T.ad:T.pd,color:roleSrc==="circle"?T.ac:T.pu,fontSize:11,fontFamily:"inherit",cursor:"pointer",minWidth:120}}>
                        <option value="">{"+ Add "+(roleSrc==="circle"?"circle":"profile")+"..."}</option>
                        {srcList.filter(function(c){return !(dCirc[slot.key]||[]).find(function(x){return x.cid===c.id;});}).map(function(c){return (<option key={c.id} value={c.id}>{c.nm}</option>);})}
                      </select>
                    </div>
                    {roles.length===0&&<div style={{padding:8,paddingLeft:hasAreas?28:14,textAlign:"center",color:T.td,fontSize:11}}>{"No "+(roleSrc==="circle"?"circles":"profiles")+" added"}</div>}
                    {roles.map(function(r,ri){return (<div key={r.cid} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 14px",paddingLeft:hasAreas?28:14,borderBottom:"1px solid "+T.bd+"08",animation:"wizSlideIn 0.3s ease",animationDelay:(ri*60)+"ms",animationFillMode:"backwards"}}>
                      <span style={{fontSize:12,fontWeight:500,width:mob?100:180,flexShrink:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.cnm}</span>
                      <select value={r.cr} onChange={function(e){updC(slot.key,r.cid,"cr",e.target.value);}} style={{padding:"3px 6px",borderRadius:6,border:"1px solid "+T.bd,background:T.ib,color:T.tx,fontSize:11,fontFamily:"inherit",width:110,flexShrink:0}}><option>Essential</option><option>Important</option><option>Nice to have</option></select>
                      <span style={{fontSize:10,color:T.td,flexShrink:0}}>Qty:</span>
                      <input type="number" min={1} value={r.rq} onChange={function(e){updC(slot.key,r.cid,"rq",Math.max(1,parseInt(e.target.value)||1));}} style={{width:42,padding:"3px 4px",borderRadius:6,border:"1px solid "+T.bd,background:T.ib,color:T.tx,fontSize:12,textAlign:"center",flexShrink:0}}/>
                      <div style={{flex:1}}/><button onClick={function(){remC(slot.key,r.cid);}} style={{background:"none",border:"none",color:T.td,cursor:"pointer",fontSize:13,fontFamily:"inherit",padding:"2px 6px"}}>{CROSS}</button>
                    </div>);})}
                  </div>);
                })}
              </div>);
            });
          })()}
        </div>)}

        {/* ===== NEW: Define Targets step (job profiles only) ===== */}
        {step===4&&roleSrc==="jobprofile"&&(<div style={{animation:"wizFadeUp 0.4s ease"}}>
          {/* Preset buttons */}
          {useLayout&&selLayout&&selLayout!=="new"&&(
            <div style={{display:"flex",alignItems:"center",justifyContent:"flex-end",gap:8,marginBottom:12}}>
              {hasTargetPreset()&&<button onClick={applyTargetPreset} style={{padding:"5px 14px",borderRadius:8,border:"1px solid "+T.ac+"40",background:T.ad,color:T.ac,fontSize:11,cursor:"pointer",fontFamily:"inherit",fontWeight:500,transition:"all 0.2s"}}>Apply Preset</button>}
              {Object.keys(jpTargets).length>0&&(function(){return <button onClick={saveTargetPreset} style={{padding:"5px 14px",borderRadius:8,border:"1px solid "+(tgtPresetSaved?T.gn+"40":T.bd),background:tgtPresetSaved?T.gd:T.sf,color:tgtPresetSaved?T.gn:T.tx,fontSize:11,cursor:"pointer",fontFamily:"inherit",fontWeight:500,transition:"all 0.2s"}}>{tgtPresetSaved?CHK+" Saved":"Save Preset"}</button>;})()}
            </div>
          )}
          {getUniqueProfiles().map(function(prof,pi){
            var tgt=jpTargets[prof.id];if(!tgt)return null;
            var data=JOB_PROFILE_SKILLS[prof.id];
            var phc=getProfileHc(prof.id);
            var onSk=tgt.skills.filter(function(s){return s.on;}).length;
            var onCt=tgt.certs.filter(function(c){return c.on;}).length;
            var isExpanded=tgtExp[prof.id]!==false;
            return (<div key={prof.id} style={{marginBottom:10,borderRadius:10,border:"1px solid "+T.bd,animation:"wizSlideIn 0.3s ease",animationDelay:(pi*80)+"ms",animationFillMode:"backwards"}}>
              {/* Profile header */}
              <div onClick={function(){togTgtExp(prof.id);}} style={{padding:"10px 14px",display:"flex",alignItems:"center",gap:10,cursor:"pointer",background:T.sa,borderRadius:isExpanded?"10px 10px 0 0":"10px",borderBottom:isExpanded?"1px solid "+T.bd:"none",transition:"all 0.2s"}}>
                <span style={{fontSize:10,color:T.td,width:12,textAlign:"center"}}>{isExpanded?TRI_D:TRI_R}</span>
                <span style={{fontSize:13,fontWeight:600,color:T.tx}}>{prof.nm}</span>
                <Badge c={T.pu} b={T.pd}>{phc} people</Badge>
                <div style={{flex:1}}/>
                <span style={{fontSize:10,color:T.td}}>{onSk} skill{onSk!==1?"s":""}, {onCt} cert{onCt!==1?"s":""}</span>
              </div>
              {isExpanded&&(<div style={{padding:"12px 14px"}}>
                {/* Skills section */}
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
                  <span style={{fontSize:11,fontWeight:600,color:T.tm,textTransform:"uppercase",letterSpacing:0.5}}>Skills</span>
                  <select value="" onChange={function(e){if(e.target.value)addSkProf(prof.id,e.target.value);}} style={{padding:"3px 8px",borderRadius:6,border:"1px solid "+T.ac+"40",background:T.ad,color:T.ac,fontSize:10,fontFamily:"inherit",cursor:"pointer"}}>
                    <option value="">+ Add skill...</option>
                    {ALL_SKILLS.filter(function(sk){return !tgt.skills.some(function(s){return s.s===sk;});}).map(function(sk){return <option key={sk} value={sk}>{sk}</option>;})}
                  </select>
                </div>
                {tgt.skills.length===0&&<div style={{padding:8,textAlign:"center",color:T.td,fontSize:11,borderRadius:6,border:"1px dashed "+T.bd}}>No skills added. Use the dropdown above to add skills.</div>}
                {tgt.skills.map(function(sk,si){
                  var dist=data?data.skills.find(function(x){return x.s===sk.s;}):null;
                  var coverage=dist&&data?Math.round(dist.have/data.hc*100):0;
                  return (<div key={sk.s} style={{display:"flex",alignItems:"center",gap:8,padding:"5px 0",borderBottom:"1px solid "+T.bd+"08",opacity:sk.on?1:0.45,transition:"opacity 0.2s",animation:"wizSlideIn 0.25s ease",animationDelay:(si*40)+"ms",animationFillMode:"backwards"}}>
                    {/* Checkbox */}
                    <div onClick={function(){togSkill(prof.id,sk.s);}} style={{width:16,height:16,borderRadius:3,border:"1.5px solid "+(sk.on?T.ac:T.bl),background:sk.on?T.ac:"transparent",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0,transition:"all 0.2s"}}>{sk.on&&<span style={{color:"#FFFFFF",fontSize:9,fontWeight:700}}>{CHK}</span>}</div>
                    {/* Skill name */}
                    <span style={{fontSize:12,fontWeight:500,minWidth:120,color:sk.on?T.tx:T.td}}>{sk.s}</span>
                    {/* Coverage bar */}
                    <div style={{flex:1,maxWidth:100,display:"flex",alignItems:"center",gap:6}}>
                      <div style={{flex:1}}><ProgressBar v={coverage} h={3}/></div>
                      <span style={{fontSize:9,color:T.td,whiteSpace:"nowrap",minWidth:42}}>{coverage}% have</span>
                    </div>
                    {/* Target level selector */}
                    <div style={{display:"flex",gap:2}}>
                      {[1,2,3,4].map(function(lvl){var sel2=sk.tgtLvl===lvl;return (
                        <button key={lvl} onClick={function(){if(sk.on)setSkLvl(prof.id,sk.s,lvl);}} style={{width:22,height:22,borderRadius:4,border:"1px solid "+(sel2?T.ac:T.bd),background:sel2?T.ac:"transparent",color:sel2?"#FFFFFF":sk.on?T.tm:T.td,fontSize:10,fontWeight:sel2?700:400,cursor:sk.on?"pointer":"default",fontFamily:"inherit",padding:0,transition:"all 0.2s"}}>{lvl}</button>
                      );})}
                    </div>
                    {/* Remove */}
                    <button onClick={function(){remSkProf(prof.id,sk.s);}} style={{background:"none",border:"none",color:T.td,cursor:"pointer",fontSize:12,fontFamily:"inherit",padding:"2px 4px"}}>{CROSS}</button>
                  </div>);
                })}
                {/* Certificates section */}
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:14,marginBottom:8}}>
                  <span style={{fontSize:11,fontWeight:600,color:T.tm,textTransform:"uppercase",letterSpacing:0.5}}>Certificates</span>
                  <select value="" onChange={function(e){if(e.target.value)addCtProf(prof.id,e.target.value);}} style={{padding:"3px 8px",borderRadius:6,border:"1px solid "+T.pu+"40",background:T.pd,color:T.pu,fontSize:10,fontFamily:"inherit",cursor:"pointer"}}>
                    <option value="">+ Add certificate...</option>
                    {ALL_CERTS.filter(function(ct){return !tgt.certs.some(function(c){return c.c===ct;});}).map(function(ct){return <option key={ct} value={ct}>{ct}</option>;})}
                  </select>
                </div>
                {tgt.certs.length===0&&<div style={{padding:8,textAlign:"center",color:T.td,fontSize:11,borderRadius:6,border:"1px dashed "+T.bd}}>No certificates added. Use the dropdown above to add certificates.</div>}
                {tgt.certs.map(function(ct,ci){
                  var dist2=data?data.certs.find(function(x){return x.c===ct.c;}):null;
                  var coverage2=dist2&&data?Math.round(dist2.have/data.hc*100):0;
                  return (<div key={ct.c} style={{display:"flex",alignItems:"center",gap:8,padding:"5px 0",borderBottom:"1px solid "+T.bd+"08",opacity:ct.on?1:0.45,transition:"opacity 0.2s",animation:"wizSlideIn 0.25s ease",animationDelay:(ci*40)+"ms",animationFillMode:"backwards"}}>
                    <div onClick={function(){togCert(prof.id,ct.c);}} style={{width:16,height:16,borderRadius:3,border:"1.5px solid "+(ct.on?T.pu:T.bl),background:ct.on?T.pu:"transparent",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0,transition:"all 0.2s"}}>{ct.on&&<span style={{color:"white",fontSize:9,fontWeight:700}}>{CHK}</span>}</div>
                    <span style={{fontSize:12,fontWeight:500,minWidth:150,color:ct.on?T.tx:T.td}}>{ct.c}</span>
                    <div style={{flex:1,maxWidth:100,display:"flex",alignItems:"center",gap:6}}>
                      <div style={{flex:1}}><ProgressBar v={coverage2} h={3}/></div>
                      <span style={{fontSize:9,color:T.td,whiteSpace:"nowrap",minWidth:42}}>{coverage2}% have</span>
                    </div>
                    <button onClick={function(){remCtProf(prof.id,ct.c);}} style={{background:"none",border:"none",color:T.td,cursor:"pointer",fontSize:12,fontFamily:"inherit",padding:"2px 4px"}}>{CROSS}</button>
                  </div>);
                })}
              </div>)}
            </div>);
          })}
        </div>)}

        {step===timelineN&&(<div style={{animation:"wizFadeUp 0.4s ease"}}>
          <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr",gap:14}}>
            <div><label style={{fontSize:11,color:T.td,display:"block",marginBottom:6,textTransform:"uppercase"}}>Start Quarter</label><select value={sq} onChange={function(e){sSq(e.target.value);}} style={iS}><option value="">Select...</option>{qs.map(function(q){return <option key={q} value={q}>{q}</option>;})}</select></div>
            <div><label style={{fontSize:11,color:T.td,display:"block",marginBottom:6,textTransform:"uppercase"}}>Target Quarter</label><select value={tq} onChange={function(e){sTq(e.target.value);}} style={iS}><option value="">Select...</option>{qs.map(function(q){return <option key={q} value={q}>{q}</option>;})}</select></div>
          </div>
          {sq&&tq&&<div style={{marginTop:10,padding:"8px 14px",borderRadius:8,background:T.ad,fontSize:11,color:T.ac,animation:"wizSlideIn 0.3s ease"}}>{"Timeline: "+sq+" "+ARROW+" "+tq+". Quarterly readiness snapshots enabled."}</div>}
          <div style={{marginTop:18,padding:14,borderRadius:10,border:"1px solid "+T.bd,background:T.sa+"80"}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}><span style={{fontSize:12,fontWeight:600,color:T.tm}}>Financial context</span><span style={{fontSize:10,padding:"2px 8px",borderRadius:4,background:T.amd,color:T.am}}>Optional</span></div>
            <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr",gap:14}}>
              <div><label style={{fontSize:11,color:T.td,display:"block",marginBottom:6,textTransform:"uppercase"}}>Revenue Potential (DKK)</label><input value={rev} onChange={function(e){sRev(e.target.value);}} placeholder="e.g. 16M or 4500K" style={iS}/></div>
              <div><label style={{fontSize:11,color:T.td,display:"block",marginBottom:6,textTransform:"uppercase"}}>Investment Required (DKK)</label><input value={inv} onChange={function(e){sInv(e.target.value);}} placeholder="e.g. 2.5M or 800K" style={iS}/></div>
            </div>
            {(pv(rev)>0||pv(inv)>0)&&(<div style={{marginTop:10,display:"flex",gap:10,animation:"wizFadeUp 0.3s ease"}}>
              {pv(rev)>0&&<div style={{flex:1,padding:"8px 12px",borderRadius:8,background:T.gd,textAlign:"center"}}><div style={{fontSize:10,color:T.gn,textTransform:"uppercase",marginBottom:2}}>Revenue</div><div style={{fontSize:14,fontWeight:700,color:T.gn}}>{fD(pv(rev))}</div></div>}
              {pv(inv)>0&&<div style={{flex:1,padding:"8px 12px",borderRadius:8,background:T.amd,textAlign:"center"}}><div style={{fontSize:10,color:T.am,textTransform:"uppercase",marginBottom:2}}>Investment</div><div style={{fontSize:14,fontWeight:700,color:T.am}}>{fD(pv(inv))}</div></div>}
              {pv(rev)>0&&pv(inv)>0&&<div style={{flex:1,padding:"8px 12px",borderRadius:8,background:T.ad,textAlign:"center"}}><div style={{fontSize:10,color:T.ac,textTransform:"uppercase",marginBottom:2}}>Projected ROI</div><div style={{fontSize:14,fontWeight:700,color:T.ac}}>{Math.round((pv(rev)-pv(inv))/pv(inv)*100)}%</div></div>}
            </div>)}
          </div>
        </div>)}
        {step===analysisN&&(<div style={{animation:"wizFadeUp 0.4s ease"}}>
          <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:14,padding:"10px 14px",borderRadius:10,background:T.sa,border:"1px solid "+T.bd}}>
            <Gauge v={analysisDone?calcRd():0} sz={52} sw={4}/>
            <div style={{flex:1,minWidth:0}}><div style={{fontSize:15,fontWeight:700,marginBottom:4,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{name||"Untitled"}</div><div style={{display:"flex",gap:4,flexWrap:"wrap"}}><Badge c={T.tm}>{type}</Badge><Badge c={T.ac} b={T.ad}>{selD.length} loc.</Badge><Badge c={T.ac} b={T.ad}>{tots.totalPeople} ppl</Badge>{isProj&&<Badge c={T.pu} b={T.pd}>Projection</Badge>}{rev&&<Badge c={T.gn} b={T.gd}>{fD(pv(rev))}</Badge>}{inv&&pv(inv)>0&&<Badge c={T.am} b={T.amd}>{fD(pv(inv))+" inv."}</Badge>}{sq&&tq&&<Badge c={T.tm} b={T.sa}>{sq+" "+ARROW+" "+tq}</Badge>}</div></div>
          </div>
          {(analyzing||analysisDone)&&(<div style={{marginBottom:10}}>
            {!analysisDone?(<div style={{borderRadius:8,border:"1px solid "+T.bd,padding:"8px 12px",position:"relative",overflow:"hidden"}}><div style={{position:"absolute",top:0,left:0,height:2,background:T.ac,width:((scanPhase/6)*100)+"%",transition:"width 0.3s ease"}}/><div style={{fontSize:12,fontWeight:600,marginBottom:4,color:T.ac}}>{"Analyzing workforce"+ELLIP}</div>{scanLabels.map(function(label,i){var done=scanPhase>i;var active=scanPhase===i&&!analysisDone;if(!done&&!active)return null;return (<div key={i} style={{display:"flex",alignItems:"center",gap:6,padding:"2px 0",fontSize:11,color:done?T.gn:T.ac,animation:active?"wizPulse 1s ease infinite":"none"}}><span style={{fontSize:10,animation:done?"wizPop 0.3s ease":"none"}}>{done?CHK:ELLIP}</span><span>{label}</span></div>);})}</div>
            ):(<div style={{display:"flex",alignItems:"center",gap:8,padding:"6px 12px",borderRadius:8,background:T.gd,border:"1px solid "+T.gn+"30",animation:"wizFadeUp 0.3s ease"}}><span style={{color:T.gn,fontSize:12,fontWeight:700,animation:"wizPop 0.4s ease"}}>{CHK}</span><span style={{fontSize:12,color:T.gn,fontWeight:600}}>Analysis complete</span><span style={{fontSize:11,color:T.gn+"90"}}>{DOT+" "+scanLabels.length+" checks passed"}</span></div>)}
          </div>)}
          {insights.length>0&&(<div style={{display:"flex",flexDirection:"column",gap:5,marginBottom:12}}>{insights.map(function(ins,i){var bg=ins.tp==="critical"?T.rdd:ins.tp==="warn"?T.amd:ins.tp==="success"?T.gd:T.ad;var fg=ins.tp==="critical"?T.rd:ins.tp==="warn"?T.am:ins.tp==="success"?T.gn:T.ac;return (<div key={i} style={{padding:"6px 12px",borderRadius:8,background:bg,border:"1px solid "+fg+"20",display:"flex",alignItems:"center",gap:8,animation:"wizSlideIn 0.3s ease"}}><div style={{width:6,height:6,borderRadius:3,background:fg,flexShrink:0}}/><span style={{fontSize:11,color:fg,lineHeight:"1.3"}}>{ins.tx}</span></div>);})}</div>)}
          {analysisDone&&(<div style={{borderRadius:10,border:"1px solid "+T.bd,overflow:"hidden",animation:"wizFadeUp 0.4s ease"}}><div style={{padding:"6px 14px",background:T.sa,borderBottom:"1px solid "+T.bd,fontSize:10,fontWeight:600,color:T.td,textTransform:"uppercase",letterSpacing:0.5}}>Workforce Breakdown</div>{selD.map(function(dept){var cs=dCirc[dept.id]||[];return cs.map(function(dc,di){var have=isProj?0:Math.min(dc.rq,Math.floor(dc.rq*0.8));var pct=dc.rq>0?Math.round(have/dc.rq*100):100;return (<div key={dept.id+dc.cid} style={{display:"flex",alignItems:"center",gap:6,padding:"4px 14px",borderBottom:"1px solid "+T.bd+"08",fontSize:11,animation:"wizSlideIn 0.3s ease",animationDelay:(di*80)+"ms",animationFillMode:"backwards"}}><span style={{color:T.td,width:65,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{dept.nm}</span><span style={{fontWeight:500,width:100}}>{dc.cnm}</span><Badge c={cc2(dc.cr,T)} b={cc2(dc.cr,T)+"15"}>{dc.cr}</Badge><span style={{color:T.tm,width:35}}>{have}/{dc.rq}</span><div style={{flex:1,maxWidth:70}}><ProgressBar v={pct} h={3}/></div><span style={{color:rc(pct,T),width:28,textAlign:"right",fontWeight:600}}>{pct}%</span></div>);});})}</div>)}
          {!analyzing&&!analysisDone&&(<div style={{padding:30,textAlign:"center",borderRadius:10,border:"1px dashed "+T.bd}}><p style={{color:T.td,fontSize:12,margin:0}}>{"Preparing analysis"+ELLIP}</p></div>)}
        </div>)}
      </div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:24,paddingTop:14,borderTop:"1px solid "+T.bd}}>
        <button onClick={function(){var prev=prvStep(step);if(prev!==null)goToStep(prev);else p.onClose();}} style={{padding:"8px 16px",borderRadius:10,border:"1px solid "+T.bd,background:"transparent",color:T.tm,cursor:"pointer",fontSize:12,fontFamily:"inherit",transition:"all 0.2s"}}>{prvStep(step)!==null?"Back":"Cancel"}</button>
        <button disabled={!canNext()} onClick={function(){var nxt=nxtStep(step);if(nxt!==null)goToStep(nxt);else doComplete();}} style={{padding:"8px 22px",borderRadius:10,border:"none",cursor:canNext()?"pointer":"default",background:canNext()?T.ac:T.sa,color:canNext()?"#FFFFFF":T.td,fontSize:13,fontWeight:600,fontFamily:"inherit",opacity:canNext()?1:0.5,transition:"all 0.3s ease",animation:canNext()&&!isLast(step)?"wizGlow 2s ease infinite":"none"}}>{step===analysisN?(analysisDone?"Create Initiative":"Analyzing"+ELLIP):"Continue"}</button>
      </div>
      {mND&&(<Overlay x={function(){sMND(false);}}><h3 style={{fontSize:16,fontWeight:700,margin:"0 0 16px"}}>New Department</h3><div style={{marginBottom:12}}><label style={{fontSize:11,color:T.td,display:"block",marginBottom:4,textTransform:"uppercase"}}>Name *</label><input value={ndNm} onChange={function(e){sNdNm(e.target.value);}} style={iS}/></div><div style={{marginBottom:12}}><label style={{fontSize:11,color:T.td,display:"block",marginBottom:4,textTransform:"uppercase"}}>Parent Region</label><select value={ndPr} onChange={function(e){sNdPr(e.target.value);}} style={iS}><option value="">None (new region)</option>{p.deptTree.map(function(r){return <option key={r.id} value={r.id}>{r.nm}</option>;})}</select></div><div style={{display:"flex",gap:8,justifyContent:"flex-end"}}><button onClick={function(){sMND(false);}} style={{padding:"7px 16px",borderRadius:8,border:"1px solid "+T.bd,background:"transparent",color:T.tm,cursor:"pointer",fontSize:12,fontFamily:"inherit"}}>Cancel</button><button onClick={doND} style={{padding:"7px 16px",borderRadius:8,border:"none",background:T.ac,color:"#FFFFFF",cursor:"pointer",fontSize:12,fontWeight:600,fontFamily:"inherit"}}>Create</button></div></Overlay>)}
      {mNC&&(<Overlay x={function(){sMNC(false);}}><h3 style={{fontSize:16,fontWeight:700,margin:"0 0 16px"}}>{"New "+(roleSrc==="circle"?"Circle":"Job Profile")}</h3><div style={{marginBottom:12}}><label style={{fontSize:11,color:T.td,display:"block",marginBottom:4,textTransform:"uppercase"}}>Name *</label><input value={ncNm} onChange={function(e){sNcNm(e.target.value);}} placeholder={roleSrc==="circle"?"e.g. Crew Trainer":"e.g. Team Leader"} style={iS}/></div><div style={{display:"flex",gap:8,justifyContent:"flex-end"}}><button onClick={function(){sMNC(false);}} style={{padding:"7px 16px",borderRadius:8,border:"1px solid "+T.bd,background:"transparent",color:T.tm,cursor:"pointer",fontSize:12,fontFamily:"inherit"}}>Cancel</button><button onClick={doNC} style={{padding:"7px 16px",borderRadius:8,border:"none",background:T.ac,color:"#FFFFFF",cursor:"pointer",fontSize:12,fontWeight:600,fontFamily:"inherit"}}>Create</button></div></Overlay>)}
    </div>
  );
}
