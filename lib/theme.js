"use client";
import { createContext, useContext } from "react";

export const ThemeCtx = createContext();
export function useT() { return useContext(ThemeCtx); }

export const TH = {
  dark: { bg:"#0B0F1A", sf:"#111827", sa:"#1A2235", cd:"#151D2E", bd:"#1E293B", bl:"#2A3A52", tx:"#F1F5F9", tm:"#94A3B8", td:"#64748B", ac:"#22D3EE", ad:"rgba(34,211,238,0.12)", ag:"rgba(34,211,238,0.25)", gn:"#34D399", gd:"rgba(52,211,153,0.12)", am:"#FBBF24", amd:"rgba(251,191,36,0.12)", rd:"#F87171", rdd:"rgba(248,113,113,0.12)", pu:"#A78BFA", pd:"rgba(167,139,250,0.12)", sh:"rgba(0,0,0,0.3)", ib:"#1A2235" },
  light: { bg:"#F5F7FA", sf:"#FFFFFF", sa:"#F0F2F5", cd:"#FFFFFF", bd:"#E2E8F0", bl:"#CBD5E1", tx:"#0F172A", tm:"#475569", td:"#94A3B8", ac:"#0891B2", ad:"rgba(8,145,178,0.08)", ag:"rgba(8,145,178,0.2)", gn:"#059669", gd:"rgba(5,150,105,0.08)", am:"#D97706", amd:"rgba(217,119,6,0.08)", rd:"#DC2626", rdd:"rgba(220,38,38,0.08)", pu:"#7C3AED", pd:"rgba(124,58,237,0.08)", sh:"rgba(0,0,0,0.06)", ib:"#FFFFFF" }
};
