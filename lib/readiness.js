import { cw } from "./utils";

export function allRoles(ini) {
  var r = [];
  ini.depts.forEach(function(d) {
    if (d.areas) {
      d.areas.forEach(function(a) { r = r.concat(a.roles || []); });
    } else {
      r = r.concat(d.roles || []);
    }
  });
  return r;
}

export function wRd(roles) {
  var tw = 0, fw = 0;
  roles.forEach(function(r) { var w = cw(r.cr); tw += r.rq * w; fw += r.ql * w; });
  return tw > 0 ? Math.round(fw / tw * 100) : 0;
}

export function staffRd(roles) {
  var tr = 0, tq = 0;
  roles.forEach(function(r) { tr += r.rq; tq += r.ql; });
  return tr > 0 ? Math.round(tq / tr * 100) : 0;
}

function deptAllRoles(dept) {
  if (dept.areas) {
    var r = [];
    dept.areas.forEach(function(a) { r = r.concat(a.roles || []); });
    return r;
  }
  return dept.roles || [];
}

export function deptRd(dept) { return wRd(deptAllRoles(dept)); }

export function deptStaff(dept) { return staffRd(deptAllRoles(dept)); }

/* Area readiness — composite of staff, skill, and cert readiness
   Staff = weighted role fill (wRd).
   Skill = simulated from staff fill modulated by requirement complexity.
   Cert  = simulated from staff fill modulated by cert count.
   Composite = 50% staff + 30% skill + 20% cert (same weights as overall). */
export function areaSkillRd(area) {
  var roles = area.roles || [];
  var sR = staffRd(roles);
  var reqs = area.skillReqs || [];
  if (reqs.length === 0) return sR;
  /* Higher skill levels and more requirements make skill readiness lag behind staffing */
  var avgLvl = reqs.reduce(function(s, r) { return s + (r.lvl || 1); }, 0) / reqs.length;
  var penalty = Math.min(25, (avgLvl - 1) * 8 + (reqs.length - 1) * 3);
  return Math.max(0, Math.min(100, Math.round(sR - penalty * (sR / 100))));
}

export function areaCertRd(area) {
  var roles = area.roles || [];
  var sR = staffRd(roles);
  var certs = area.certReqs || [];
  if (certs.length === 0) return sR;
  /* More cert requirements means cert readiness lags more */
  var penalty = Math.min(20, certs.length * 8);
  return Math.max(0, Math.min(100, Math.round(sR - penalty * (sR / 100))));
}

export function areaRd(area) {
  var stf = wRd(area.roles || []);
  var sk = areaSkillRd(area);
  var ct = areaCertRd(area);
  return Math.round(stf * 0.5 + sk * 0.3 + ct * 0.2);
}

export function areaStaff(area) { return staffRd(area.roles || []); }

export function skillRd(ini) {
  var total = 0, met = 0;
  (ini.ppl || []).forEach(function(p) {
    (p.skills || []).forEach(function(s) { total++; if (s.cur >= s.tgt) met++; });
  });
  return total > 0 ? Math.round(met / total * 100) : ini._skillRd || Math.min(100, wRd(allRoles(ini)) + Math.floor(Math.random() * 5));
}

export function certRd(ini) {
  var total = 0, valid = 0;
  (ini.ppl || []).forEach(function(p) {
    (p.certs || []).forEach(function(c) { total++; if (c.st === "Valid") valid++; });
  });
  return total > 0 ? Math.round(valid / total * 100) : ini._certRd || Math.max(0, wRd(allRoles(ini)) - Math.floor(Math.random() * 10));
}

export function iRd(ini) { return wRd(allRoles(ini)); }
