"use client";
import { createContext, useContext } from "react";

export const ThemeCtx = createContext();
export function useT() { return useContext(ThemeCtx); }

export const TH = {
  dark: {
    bg:"#0E1018", sf:"#161822", sa:"#1E202C", cd:"#1A1C26", bd:"#2C2E3C", bl:"#3E4054",
    tx:"#F0EEF2", tm:"#9498A6", td:"#6A6E7E",
    ac:"#73A6FF", ad:"rgba(115,166,255,0.12)", ag:"rgba(115,166,255,0.24)",
    gn:"#66DDB5", gd:"rgba(102,221,181,0.12)",
    am:"#FAD461", amd:"rgba(250,212,97,0.12)",
    rd:"#D08E86", rdd:"rgba(208,142,134,0.12)",
    pu:"#8A94B8", pd:"rgba(138,148,184,0.12)",
    sh:"rgba(0,0,0,0.4)", ib:"#1E202C"
  },
  light: {
    bg:"#F8F8FB", sf:"#FFFFFF", sa:"#F0F0F0", cd:"#FFFFFF", bd:"#D8D8D8", bl:"#E8E8E8",
    tx:"#141414", tm:"#686868", td:"#A0A0A0",
    ac:"#03024E", ad:"#EAF1FF", ag:"rgba(3,2,78,0.12)",
    gn:"#6BAC54", gd:"#DDF6D5",
    am:"#E4A24E", amd:"#FDF3E3",
    rd:"#DD614D", rdd:"#FBE7E4",
    pu:"#4A5068", pd:"rgba(74,80,104,0.06)",
    sh:"rgba(0,0,0,0.08)", ib:"#FFFFFF"
  }
};
