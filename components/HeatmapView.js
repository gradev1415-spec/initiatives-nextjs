"use client";
import { useT } from "@/lib/theme";
import { rc, cc2, forEachRole } from "@/lib/utils";
import { allRoles, wRd } from "@/lib/readiness";
import Badge from "./Badge";

export default function HeatmapView(p){
  var T=useT();
  var roleMap={};var locList=[];
  p.ini.forEach(function(it){
    it.depts.forEach(function(d){
      if(!locList.find(function(x){return x.dn===d.dn;}))locList.push({dn:d.dn,ini:it.nm});
      forEachRole([d],function(r){
        roleMap[r.cn]=roleMap[r.cn]||{};
        var pct=r.rq>0?Math.round(r.ql/r.rq*100):100;
        roleMap[r.cn][d.dn]=pct;
      });
    });
  });
  var roles=Object.keys(roleMap);
  return (
    <div style={{borderRadius:14,border:"1px solid "+T.bd,overflow:"auto"}}>
      <div style={{padding:"14px 20px",borderBottom:"1px solid "+T.bd}}><h3 style={{fontSize:14,fontWeight:600,margin:0}}>Readiness Heatmap</h3><p style={{fontSize:11,color:T.tm,margin:"4px 0 0"}}>Roles x Locations - color = readiness %</p></div>
      <div style={{overflowX:"auto",padding:12}}>
        <table style={{borderCollapse:"collapse",minWidth:"100%"}}>
          <thead><tr>
            <th style={{padding:"8px 12px",fontSize:10,color:T.td,textAlign:"left",position:"sticky",left:0,background:T.cd,zIndex:1}}>Role</th>
            {locList.map(function(l){return <th key={l.dn} style={{padding:"8px 10px",fontSize:10,color:T.td,textAlign:"center",whiteSpace:"nowrap"}}>{l.dn}</th>;})}
          </tr></thead>
          <tbody>{roles.map(function(role){
            return (
              <tr key={role}>
                <td style={{padding:"8px 12px",fontSize:12,fontWeight:500,whiteSpace:"nowrap",position:"sticky",left:0,background:T.cd,zIndex:1}}>{role}</td>
                {locList.map(function(l){
                  var v=roleMap[role][l.dn];
                  if(v===undefined) return <td key={l.dn} style={{padding:"6px 10px",textAlign:"center"}}><span style={{fontSize:10,color:T.td}}>-</span></td>;
                  var bg=v>=85?T.gd:v>=60?T.amd:T.rdd;
                  var fg=v>=85?T.gn:v>=60?T.am:T.rd;
                  return <td key={l.dn} style={{padding:"6px 10px",textAlign:"center"}}><div style={{display:"inline-flex",alignItems:"center",justifyContent:"center",width:44,height:28,borderRadius:6,background:bg,color:fg,fontSize:12,fontWeight:600}}>{v}%</div></td>;
                })}
              </tr>
            );
          })}</tbody>
        </table>
      </div>
    </div>
  );
}

/* â•â•â• PORTFOLIO DASHBOARD â•â•â• */
