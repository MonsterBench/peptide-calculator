import { AFF_BASE, DISCOUNT, SHEET_ENDPOINT, DEFAULTS } from './data';

export const aff = (path: string) => `${AFF_BASE}${path}${DISCOUNT}`;

export interface CalcState {
  peptide: string;
  customPeptide: string;
  vialMg: number;
  waterMl: number;
  doseMode: "flat" | "perkg";
  doseMcg: number;
  doseMcgPerKg: number;
  bodyWeightKg: number;
}

export function encodeState(s: CalcState): string {
  try {
    return btoa(JSON.stringify({ p: s.peptide, v: s.vialMg, w: s.waterMl, m: s.doseMode, d: s.doseMcg, dk: s.doseMcgPerKg, bw: s.bodyWeightKg, cp: s.customPeptide }));
  } catch {
    return "";
  }
}

export function decodeState(h: string): CalcState | null {
  try {
    const d = JSON.parse(atob(h));
    return {
      peptide: d.p || DEFAULTS.peptide,
      customPeptide: d.cp || "",
      vialMg: d.v || DEFAULTS.vialMg,
      waterMl: d.w || DEFAULTS.waterMl,
      doseMode: d.m || DEFAULTS.doseMode,
      doseMcg: d.d || DEFAULTS.doseMcg,
      doseMcgPerKg: d.dk || DEFAULTS.doseMcgPerKg,
      bodyWeightKg: d.bw || DEFAULTS.bodyWeightKg,
    };
  } catch {
    return null;
  }
}

export function decodeFinderHash(h: string) {
  try {
    const d = JSON.parse(atob(h));
    return { goals: d.g || [], experience: d.e || "any", adminPref: d.a || "any" };
  } catch {
    return null;
  }
}

export function encodeFinderHash(goals: string[], experience: string, adminPref: string): string {
  try {
    return btoa(JSON.stringify({ g: goals, e: experience, a: adminPref }));
  } catch {
    return "";
  }
}

export function sendEmail(email: string, extra: Record<string, string> = {}) {
  try { localStorage.setItem("peptide_hub_email", email); } catch {}
  if (SHEET_ENDPOINT) {
    try {
      fetch(SHEET_ENDPOINT, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), timestamp: new Date().toISOString(), ...extra }),
      });
    } catch {}
  }
}

export function freqToDays(freq: string): number[] {
  if (!freq) return [1, 2, 3, 4, 5, 6, 0];
  const f = freq.toLowerCase();
  if (f.includes("daily") || f.includes("1x daily") || f.includes("1-2x daily")) return [0, 1, 2, 3, 4, 5, 6];
  if (f.includes("2x daily") || f.includes("2-3x daily") || f.includes("3-5x")) return [0, 1, 2, 3, 4, 5, 6];
  if (f.includes("5x weekly")) return [1, 2, 3, 4, 5];
  if (f.includes("3x weekly")) return [1, 3, 5];
  if (f.includes("2x weekly") || f.includes("twice")) return [1, 4];
  if (f.includes("1x weekly") || f.includes("weekly")) return [1];
  if (f.includes("every other day")) return [1, 3, 5, 0];
  return [1, 2, 3, 4, 5, 6, 0];
}

export function freqToMonthly(freq: string): number {
  if (!freq) return 30;
  const f = freq.toLowerCase();
  if (f.includes("weekly") && !f.includes("2") && !f.includes("3") && !f.includes("4") && !f.includes("5")) return 4.3;
  if (f.includes("2x weekly") || f.includes("twice weekly")) return 8.6;
  if (f.includes("3x weekly") || f.includes("3-5x")) return 17;
  if (f.includes("every other day")) return 15;
  if (f.includes("2x daily") || f.includes("2-3x daily")) return 75;
  if (f.includes("daily") || f.includes("1x daily")) return 30;
  return 30;
}

export async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const t = document.createElement("textarea");
    t.value = text;
    document.body.appendChild(t);
    t.select();
    document.execCommand("copy");
    document.body.removeChild(t);
  }
}
