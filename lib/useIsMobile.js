"use client";
import { useState, useEffect } from "react";

export default function useIsMobile(breakpoint) {
  var bp = breakpoint || 768;
  var _s = useState(false);
  var isMobile = _s[0], set = _s[1];
  useEffect(function() {
    function check() { set(window.innerWidth < bp); }
    check();
    window.addEventListener("resize", check);
    return function() { window.removeEventListener("resize", check); };
  }, [bp]);
  return isMobile;
}
