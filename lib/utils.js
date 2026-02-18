export function fmt(n) {
  if (n >= 1e6) return (n / 1e6).toFixed(1).replace(/\.0$/, "") + "M";
  if (n >= 1e3) return (n / 1e3).toFixed(0) + "K";
  return String(n);
}

export function fD(n) { return fmt(n) + " DKK"; }

export function rc(r, T) { return r > 100 ? T.ac : r >= 85 ? T.gn : r >= 60 ? T.am : T.rd; }

export function cc2(c, T) { return c === "Essential" ? T.rd : c === "Important" ? T.am : T.td; }

export function cw(cr) { return cr === "Essential" ? 2 : cr === "Important" ? 1 : 0.5; }

export function ic2(i, T) { return i === "Critical" ? T.rd : i === "High" ? T.am : i === "Medium" ? T.ac : T.td; }

export function pv(s) {
  if (!s) return 0;
  var v = s.trim().toUpperCase().replace(/[^0-9.MK]/g, "");
  if (v.endsWith("M")) return parseFloat(v) * 1e6;
  if (v.endsWith("K")) return parseFloat(v) * 1e3;
  return parseFloat(v) || 0;
}
