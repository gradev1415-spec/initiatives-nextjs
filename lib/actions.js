import { cw } from "./utils";
import { allRoles, wRd } from "./readiness";
import { LIBRARY } from "./data";

export function genActions(ini){
  var acts=[];var ar=allRoles(ini);var rd=wRd(ar);
  ar.forEach(function(r){
    if(r.gp>0) acts.push({tp:"hire",desc:"Hire "+r.gp+" "+r.cn+(r.gp>1?"s":""),role:r.cn,cr:r.cr,n:r.gp,lift:Math.round(r.gp*cw(r.cr)*100/(ar.reduce(function(s,x){return s+x.rq*cw(x.cr);},0)||1)*100)/100});
  });
  ini.sg.forEach(function(g){
    var match=LIBRARY.filter(function(l){return l.sk===g.s;});
    if(match.length>0) acts.push({tp:"train",desc:"Assign '"+match[0].nm+"' to "+g.n+" people",skill:g.s,n:g.n,content:match[0].nm,lift:Math.round(g.n*1.5*10)/10});
    else acts.push({tp:"create",desc:"Create content for '"+g.s+"' (no matching content)",skill:g.s,n:g.n,lift:Math.round(g.n*1.2*10)/10});
  });
  ini.cg.forEach(function(g){
    if(g.c==="All certs")return;
    var match=LIBRARY.filter(function(l){return l.ct&&l.ct.indexOf(g.c.replace(" L"," Level "))!==-1||l.ct===g.c;});
    if(match.length>0) acts.push({tp:"recert",desc:"Recertify "+g.n+" people via '"+match[0].nm+"'",cert:g.c,n:g.n,content:match[0].nm,lift:Math.round(g.n*1.8*10)/10});
    else acts.push({tp:"recert",desc:"Schedule recertification for '"+g.c+"' ("+g.n+" people)",cert:g.c,n:g.n,lift:Math.round(g.n*1.5*10)/10});
  });
  acts.sort(function(a,b){return b.lift-a.lift;});
  return acts;
}

export function matchContent(ini){
  var matches=[];
  ini.sg.forEach(function(g){
    var found=LIBRARY.filter(function(l){return l.sk===g.s;});
    found.forEach(function(l){matches.push({type:"skill",gap:g.s,n:g.n,content:l});});
    if(found.length===0) matches.push({type:"content_gap",gap:g.s,n:g.n,content:null});
  });
  ini.cg.forEach(function(g){
    if(g.c==="All certs")return;
    var found=LIBRARY.filter(function(l){return l.ct&&(l.ct.indexOf(g.c.split(" ")[0])!==-1||l.ct===g.c);});
    found.forEach(function(l){matches.push({type:"cert",gap:g.c,n:g.n,content:l});});
  });
  return matches;
}


/* â•â•â• REPORT PAGE (inline printable C-level PDF report) â•â•â• */