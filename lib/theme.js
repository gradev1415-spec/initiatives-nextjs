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
    bg:"#FAFAFA", sf:"#FFFFFF", sa:"#F3F3F5", cd:"#FFFFFF", bd:"#E1E3E6", bl:"#CED1D6",
    tx:"#1c253f", tm:"#797C91", td:"#A0A3B0",
    ac:"#1c253f", ad:"#EEF4FC", ag:"rgba(28,37,63,0.12)",
    gn:"#34B77A", gd:"#E4F9F0",
    am:"#E4A24E", amd:"#FDF3E3",
    rd:"#E07A6E", rdd:"rgba(224,122,110,0.06)",
    pu:"#4A5068", pd:"rgba(74,80,104,0.06)",
    sh:"rgba(0,0,0,0.03)", ib:"#FFFFFF"
  }
};
