import { cw } from "./utils";

/* ═══════════════════════════════════════════════════════════════
   READINESS ENGINE — Adaptive Composite Workforce Readiness
   ═══════════════════════════════════════════════════════════════

   FORMULA
   ───────
   Composite = weighted sum of ACTIVE pillars only.
   Pillars are only measured when relevant data exists.

   Base weights (when all 3 active):
     40% Staffing + 35% Capability + 25% Compliance

   Adaptive redistribution (proportional):
     Staff + Skill only    → 53% Staffing + 47% Capability
     Staff + Cert only     → 62% Staffing + 38% Compliance
     Staff only            → 100% Staffing

   PILLAR ACTIVATION
   ─────────────────
   Staffing:    always active (roles always exist)
   Capability:  active when ANY skill requirement or skill gap exists
                (area skillReqs[], initiative sg[])
   Compliance:  active when ANY cert requirement, cert held, or cert gap exists
                (area certReqs[], initiative certs[], initiative cg[])

   PILLAR 1 — Staffing  (are the right people in place?)
     For each role:  qualified / required, weighted by role criticality
     Criticality weights: Essential = 2, Important = 1, Nice to have = 0.5

   PILLAR 2 — Capability  (do staff have the required skills at target levels?)
     Initiative level: derived from skill gap data (sg[]).
       Each skill gap represents people who haven't met the skill target.
       All skill gaps weigh equally — criticality comes from the role, not the skill.
       Readiness = 1 − average gap fraction across all gaps.
     Area level: derived from area skillReqs and staff fill.
       If area has staff gaps, proportional skills are uncovered.
       All skill requirements are equal — no per-skill criticality.

   PILLAR 3 — Compliance  (do staff hold required valid certificates?)
     Initiative level: from certs[] data → valid / total
       All cert gaps weigh equally — criticality comes from the role.
     Area level: derived from certReqs count and cert coverage data.
       All cert requirements are equal — no per-cert criticality.

   WEIGHT PHILOSOPHY
   ─────────────────
   Only ROLES carry criticality (Essential / Important / Nice to have).
   Skills and certificates are simply requirements of those roles.
   The role criticality drives the staffing pillar; skills and certs
   measure whether staff meet the requirements, without separate weights.

   Staffing  = 40%   (essential foundation — can't deliver without people)
   Capability = 35%  (skills at target level — quality of workforce)
   Compliance = 25%  (certifications valid — regulatory / standard adherence)
   ═══════════════════════════════════════════════════════════════ */

var W_STAFF = 0.40;
var W_SKILL = 0.35;
var W_CERT  = 0.25;

/* ─── PILLAR DETECTION: does data exist to measure this pillar? ─── */

/* Initiative has skill data if any area has skillReqs OR any sg[] entries exist */
export function hasSkillData(ini) {
  if ((ini.sg || []).length > 0) return true;
  var found = false;
  ini.depts.forEach(function(d) {
    if (d.areas) {
      d.areas.forEach(function(a) {
        if ((a.skillReqs || []).length > 0) found = true;
      });
    }
  });
  return found;
}

/* Initiative has cert data if any area has certReqs, or certs[] held, or cg[] gaps */
export function hasCertData(ini) {
  if ((ini.certs || []).length > 0) return true;
  if ((ini.cg || []).length > 0) return true;
  var found = false;
  ini.depts.forEach(function(d) {
    if (d.areas) {
      d.areas.forEach(function(a) {
        if ((a.certReqs || []).length > 0) found = true;
      });
    }
  });
  return found;
}

/* Compute adaptive weights: redistribute inactive pillar weight proportionally */
function adaptiveWeights(hasSkill, hasCert) {
  if (hasSkill && hasCert) return { ws: W_STAFF, wk: W_SKILL, wc: W_CERT };
  if (hasSkill && !hasCert) {
    var t1 = W_STAFF + W_SKILL;
    return { ws: W_STAFF / t1, wk: W_SKILL / t1, wc: 0 };
  }
  if (!hasSkill && hasCert) {
    var t2 = W_STAFF + W_CERT;
    return { ws: W_STAFF / t2, wk: 0, wc: W_CERT / t2 };
  }
  return { ws: 1, wk: 0, wc: 0 };
}

/* NOTE: iw() (impact weight for skill/cert gaps) has been removed.
   Skills and certs no longer carry independent criticality.
   All weight derives from role criticality via the staffing pillar. */

/* ─── UTILITY: collect all roles from initiative ─── */
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

/* ─── PILLAR 1: STAFFING ─── */

/* Weighted staff readiness (by role criticality) */
export function wRd(roles) {
  var tw = 0, fw = 0;
  roles.forEach(function(r) { var w = cw(r.cr); tw += r.rq * w; fw += r.ql * w; });
  return tw > 0 ? Math.round(fw / tw * 100) : 100;
}

/* Simple staff readiness (unweighted ratio) */
export function staffRd(roles) {
  var tr = 0, tq = 0;
  roles.forEach(function(r) { tr += r.rq; tq += r.ql; });
  return tr > 0 ? Math.round(tq / tr * 100) : 100;
}

/* ─── PILLAR 2: CAPABILITY (skill readiness) ─── */

/* Initiative-level skill readiness from skill gaps data.
   Logic: each sg entry = N people with an unmet skill.
   All skill gaps weigh equally — no per-skill criticality.
   We compute: for each gap, what fraction of staff is affected (n / totalStaff).
   Average across all gaps, then readiness = 1 - average gap fraction.
   Scaled by staff fill rate (skills only realized by present staff). */
export function skillRd(ini) {
  var sg = ini.sg || [];
  var roles = allRoles(ini);
  var totalReq = 0, totalQual = 0;
  roles.forEach(function(r) { totalReq += r.rq; totalQual += r.ql; });
  var fillRate = totalReq > 0 ? totalQual / totalReq : 0;

  if (sg.length === 0) {
    var base = ini._skillRd !== undefined ? ini._skillRd : 100;
    /* Scale by fill rate — skills are only realized by present staff */
    return Math.round(base * fillRate);
  }
  if (totalReq === 0) return 0;

  /* For each skill gap: compute gap fraction = people affected / total staff.
     All gaps have equal weight (w=1). Average across all gaps. */
  var gapSum = 0;
  sg.forEach(function(g) {
    gapSum += Math.min(1, g.n / totalReq);
  });

  var avgGapFraction = gapSum / sg.length;
  var theoretical = Math.max(0, Math.min(100, Math.round((1 - avgGapFraction) * 100)));
  /* Scale by fill rate — you can't be capability-ready without staff */
  return Math.round(theoretical * fillRate);
}

/* ─── PILLAR 3: COMPLIANCE (certification readiness) ─── */

/* Initiative-level cert readiness from certs[] data (valid/total).
   Cert gaps (cg[]) apply equal penalty — no per-cert criticality. */
export function certRd(ini) {
  var roles = allRoles(ini);
  var totalReq = 0, totalQual = 0;
  roles.forEach(function(r) { totalReq += r.rq; totalQual += r.ql; });
  var fillRate = totalReq > 0 ? totalQual / totalReq : 0;

  var certs = ini.certs || [];
  if (certs.length === 0) {
    /* No cert data: if there are cert gaps defined, readiness is 0 (no certs issued).
       Otherwise use fallback scaled by fill rate. */
    var hasCertGaps = (ini.cg || []).length > 0;
    if (hasCertGaps) return 0;
    var base = ini._certRd !== undefined ? ini._certRd : 100;
    return Math.round(base * fillRate);
  }
  var totalCerts = 0, validCerts = 0;
  certs.forEach(function(c) {
    totalCerts += c.total;
    validCerts += c.valid;
  });
  if (totalCerts === 0) return Math.round(100 * fillRate);

  /* Base cert readiness from valid/total ratio */
  var basePct = validCerts / totalCerts;

  /* If we have cert gaps (cg), apply equal-weight penalty per gap */
  var cg = ini.cg || [];
  if (cg.length > 0) {
    var totalGapPeople = 0;
    cg.forEach(function(g) {
      if (g.c === "All certs") return;
      totalGapPeople += g.n;
    });
    /* Factor gaps into the equation: gaps drag down the cert readiness further */
    var gapPenalty = totalCerts > 0 ? Math.min(0.3, (totalGapPeople / totalCerts) * 0.15) : 0;
    basePct = Math.max(0, basePct - gapPenalty);
  }

  /* Scale by fill rate — compliance only realized by present staff */
  return Math.max(0, Math.min(100, Math.round(basePct * fillRate * 100)));
}

/* ─── COMPOSITE: Initiative-level readiness (adaptive) ─── */

export function iRd(ini) {
  var stf = wRd(allRoles(ini));
  var hs = hasSkillData(ini);
  var hc = hasCertData(ini);
  var w = adaptiveWeights(hs, hc);
  var sk = hs ? skillRd(ini) : 0;
  var ct = hc ? certRd(ini) : 0;
  return Math.round(stf * w.ws + sk * w.wk + ct * w.wc);
}

/* ─── DEPARTMENT-LEVEL ─── */

function deptAllRoles(dept) {
  if (dept.areas) {
    var r = [];
    dept.areas.forEach(function(a) { r = r.concat(a.roles || []); });
    return r;
  }
  return dept.roles || [];
}

/* Department composite readiness.
   For area-based depts: aggregates area readiness.
   For flat depts: uses staff readiness as primary (no area skill/cert data). */
export function deptRd(dept) {
  if (dept.areas && dept.areas.length > 0) {
    /* Weighted average of area readiness by staff count */
    var totalWeight = 0, weightedSum = 0;
    dept.areas.forEach(function(a) {
      var aRoles = a.roles || [];
      var weight = 0;
      aRoles.forEach(function(r) { weight += r.rq * cw(r.cr); });
      if (weight === 0) weight = 1;
      weightedSum += areaRd(a) * weight;
      totalWeight += weight;
    });
    return totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 0;
  }
  /* Flat dept — only staff readiness available */
  return wRd(dept.roles || []);
}

export function deptStaff(dept) { return staffRd(deptAllRoles(dept)); }

/* ─── AREA-LEVEL ─── */

/* Area staff readiness */
export function areaStaff(area) { return staffRd(area.roles || []); }

/* Area skill readiness — derived from staffing fill and skill requirements.
   Logic: skills can only be covered by qualified staff. If the area has
   staff gaps, those represent uncovered skill slots.
   All skill requirements are equal — no per-skill criticality.
   Criticality comes only from the roles (via the staffing pillar).
   All skill levels are treated equally — level 5 is no harder to
   achieve than level 2 (they represent different knowledge, not difficulty). */
export function areaSkillRd(area) {
  var roles = area.roles || [];
  var reqs = area.skillReqs || [];
  if (reqs.length === 0) return staffRd(roles);

  /* Base: staff fill rate */
  var totalReq = 0, totalFill = 0;
  roles.forEach(function(r) { totalReq += r.rq; totalFill += r.ql; });
  if (totalReq === 0) return 0;

  var fillRate = Math.min(1, totalFill / totalReq);

  /* All skill requirements weigh equally (w=1 each).
     Coverage = staff fill rate (if you have the people, skills are met). */
  return Math.max(0, Math.min(100, Math.round(fillRate * 100)));
}

/* Area cert readiness — derived from cert requirements and staff fill.
   If area has no cert requirements, returns 100% (compliant).
   Otherwise, certs require both staff presence AND valid certification.
   All cert requirements are equal — no per-cert criticality.
   Coverage equals staff fill — if staff are in place, certs are met. */
export function areaCertRd(area) {
  var roles = area.roles || [];
  var certs = area.certReqs || [];
  if (certs.length === 0) return 100; /* No cert requirements = fully compliant */

  /* Base: staff fill rate */
  var totalReq = 0, totalFill = 0;
  roles.forEach(function(r) { totalReq += r.rq; totalFill += r.ql; });
  if (totalReq === 0) return 0;

  var fillRate = Math.min(1, totalFill / totalReq);

  /* All cert requirements weigh equally (w=1 each).
     Coverage = staff fill rate (present staff = certs met). */
  return Math.max(0, Math.min(100, Math.round(fillRate * 100)));
}

/* ─── PORTFOLIO AGGREGATES: provable KPIs across all initiatives ─── */

/* Roles filled vs required across all initiatives */
export function portfolioRoles(inis) {
  var filled = 0, required = 0;
  inis.forEach(function(ini) {
    ini.depts.forEach(function(d) {
      if (d.areas) {
        d.areas.forEach(function(a) {
          (a.roles || []).forEach(function(r) { required += r.rq; filled += r.ql; });
        });
      } else {
        (d.roles || []).forEach(function(r) { required += r.rq; filled += r.ql; });
      }
    });
  });
  return { filled: filled, required: required };
}

/* Skills & certs coverage across all initiatives.
   Each skill/cert requirement on an area = 1 requirement slot per required role.
   (e.g., area with 3 required roles and 2 skillReqs = 6 requirement-slots.)
   Gaps come from sg[] and cg[] (people with unmet requirements).
   Both numbers are in "people × requirement" units for consistent framing. */
export function portfolioCoverage(inis) {
  var totalSlots = 0, gapPeople = 0;
  inis.forEach(function(ini) {
    /* Area-level: each requirement × roles required in that area */
    ini.depts.forEach(function(d) {
      if (d.areas) {
        d.areas.forEach(function(a) {
          var aRq = 0;
          (a.roles || []).forEach(function(r) { aRq += r.rq; });
          totalSlots += (a.skillReqs || []).length * aRq;
          totalSlots += (a.certReqs || []).length * aRq;
        });
      }
    });
    /* Skill gaps — people with unmet requirements */
    (ini.sg || []).forEach(function(g) { gapPeople += g.n; });
    /* Cert gaps — people with unmet certifications */
    (ini.cg || []).forEach(function(g) { gapPeople += g.n; });
  });
  var covered = Math.max(0, totalSlots - gapPeople);
  return { covered: covered, total: totalSlots, gaps: gapPeople };
}

/* Top priorities: large skill/cert gaps across all initiatives (5+ people affected) */
export function portfolioPriorities(inis) {
  var count = 0;
  inis.forEach(function(ini) {
    (ini.sg || []).forEach(function(g) {
      if (g.n >= 5) count += 1;
    });
    (ini.cg || []).forEach(function(g) {
      if (g.n >= 5) count += 1;
    });
  });
  return count;
}

/* Area composite readiness (adaptive) */
export function areaRd(area) {
  var stf = wRd(area.roles || []);
  var hs = (area.skillReqs || []).length > 0;
  var hc = (area.certReqs || []).length > 0;
  var w = adaptiveWeights(hs, hc);
  var sk = hs ? areaSkillRd(area) : 0;
  var ct = hc ? areaCertRd(area) : 0;
  return Math.round(stf * w.ws + sk * w.wk + ct * w.wc);
}
