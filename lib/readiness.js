import { cw } from "./utils";

export function allRoles(ini) {
  var r = [];
  ini.depts.forEach(function(d) { r = r.concat(d.roles); });
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

export function deptRd(dept) {
  return wRd(dept.roles || []);
}

export function deptStaff(dept) {
  return staffRd(dept.roles || []);
}

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
