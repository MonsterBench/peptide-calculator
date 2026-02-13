export const AFF_BASE = "https://peptiderestore.com";
export const DISCOUNT = "?discount=DKE4PDRM";
export const IMG = "https://cms.peptiderestore.com/uploads/";
export const SHEET_ENDPOINT = "https://script.google.com/macros/s/AKfycbxgagbrED6ibRPyT6ZAfHAbKQbjhNea26ScZi2qEYGMvGePlWk9METEZW_6j44xKmI/exec";

export interface CatalogEntry {
  path: string;
  img: string;
  desc: string;
  freq: string;
  route: string;
  notes?: string;
  label?: string;
  blend?: boolean;
  capsule?: boolean;
}

export const CATALOG: Record<string, CatalogEntry> = {
  "BPC-157": {
    path: "/peptides/bpc-157", img: `${IMG}BPC_157_a55ce4efb7.png`,
    desc: "Gastric pentadecapeptide studied for tissue repair, gut health, and wound healing.",
    freq: "2x daily", route: "Subcutaneous", notes: "Inject close to area of interest when possible.", capsule: true,
  },
  "CJC-1295 (no DAC)": {
    path: "/peptides/cjc-1295", img: `${IMG}CJC_1295_no_DAC_b09300ab12.png`,
    desc: "Growth hormone releasing hormone analog for pulsatile GH secretion.",
    freq: "1-3x daily", route: "Subcutaneous", notes: "Best before bed and/or morning on empty stomach.",
  },
  "Ipamorelin": {
    path: "/peptides/ipamorelin", img: `${IMG}Ipamorelin_1ee553164c.png`,
    desc: "Selective GH secretagogue — GH release without cortisol/prolactin spike.",
    freq: "2-3x daily", route: "Subcutaneous", notes: "Often paired with CJC-1295 (no DAC) for synergistic effect.",
  },
  "Retatrutide": {
    path: "/peptides/retatrutide", img: `${IMG}7_D7921_DE_ADBB_4_E6_B_A4_B9_B527_C0_E91201_088d1bccfa.PNG`,
    label: "GLP-3 R (Retatrutide)", desc: "Triple agonist (GIP/GLP-1/glucagon) for metabolic optimization.",
    freq: "1x weekly", route: "Subcutaneous", notes: "Titrate up slowly over weeks.",
  },
  "Semaglutide": {
    path: "/peptides/semaglutide", img: `${IMG}2_CCC_009_D_A569_4859_ADE_1_165_D757981_A7_9fd4d617c2.PNG`,
    label: "GLP-1 S (Semaglutide)", desc: "GLP-1 receptor agonist for appetite regulation and metabolic function.",
    freq: "1x weekly", route: "Subcutaneous", notes: "Start low, titrate up every 4 weeks. Same day each week.",
  },
  "TB-500": {
    path: "/peptides/tb-500", img: `${IMG}TB_500_8722d1f5cf.png`,
    desc: "Thymosin Beta-4 fragment for tissue repair, inflammation, and recovery.",
    freq: "2x weekly", route: "Subcutaneous", notes: "Higher loading dose first 4-6 weeks, then maintenance.",
  },
  "Tirzepatide": {
    path: "/peptides/glp-2-t", img: `${IMG}GLP_2_T_3ee9355c8b.png`,
    label: "GLP-2 T (Tirzepatide)", desc: "Dual GIP/GLP-1 agonist for metabolic optimization.",
    freq: "1x weekly", route: "Subcutaneous", notes: "Titrate up slowly. Same day each week.",
  },
  "GHK-Cu": {
    path: "/peptides/ghk-cu", img: `${IMG}GHK_Cu_7198684b09.png`,
    desc: "Copper peptide for skin regeneration, collagen synthesis, and anti-aging.",
    freq: "1x daily", route: "Subcutaneous / Topical", notes: "Can be used topically or injected systemically.",
  },
  "NAD+": {
    path: "/peptides/nad", img: `${IMG}NAD_7be666c7ac.png`,
    desc: "Coenzyme for cellular energy, DNA repair, and longevity.",
    freq: "2-3x weekly", route: "Subcutaneous / IV", notes: "Subcutaneous is most practical for research.",
  },
  "MOTS-c": {
    path: "/peptides/mots-c", img: `${IMG}MOTS_c_27906e9f2e.png`,
    desc: "Mitochondrial peptide for metabolic regulation and exercise physiology.",
    freq: "3-5x weekly", route: "Subcutaneous", notes: "Often administered pre-exercise.",
  },
  "KPV": {
    path: "/peptides/kpv", img: `${IMG}KPV_d200544b70.png`,
    desc: "Anti-inflammatory tripeptide for gut health and immune modulation.",
    freq: "1-2x daily", route: "Subcutaneous / Oral", notes: "Oral route studied for direct GI benefits.", capsule: true,
  },
  "DSIP": {
    path: "/peptides/dsip", img: `${IMG}DSIP_bf4e6eb69a.png`,
    desc: "Delta sleep-inducing peptide for sleep regulation and stress response.",
    freq: "1x daily (evening)", route: "Subcutaneous", notes: "Administer 30-60 min before desired sleep.",
  },
  "Thymosin Alpha-1": {
    path: "/peptides/thymosin-alpha-1", img: `${IMG}Thymosin_Alpha_1_907bbe6794.png`,
    desc: "Immune-modulating peptide for T-cell function and immune support.",
    freq: "2-3x weekly", route: "Subcutaneous", notes: "Well-studied immune peptide used in clinical research worldwide.",
  },
  "Sermorelin": {
    path: "/peptides/sermorelin", img: `${IMG}Sermorelin_dd1d738519.png`,
    desc: "GHRH analog for growth hormone stimulation.",
    freq: "1x daily (evening)", route: "Subcutaneous", notes: "Best before bed to align with natural GH pulse.",
  },
  "Melanotan II": {
    path: "/peptides/melanotan-ii", img: `${IMG}Melanotan_2_95e04e1625.png`,
    desc: "Melanocortin receptor agonist for pigmentation research.",
    freq: "Every other day", route: "Subcutaneous", notes: "Low starting dose. Loading phase then maintenance.",
  },
  "BPC-157 + TB-500 (Wolverine Blend)": {
    path: "/peptides/bpc-157-tb-500-wolverine-blend", img: `${IMG}BPC_157_plus_TB_500_4cd2698556.png`,
    desc: "Synergistic tissue repair blend — two of the most studied healing peptides.", blend: true,
    freq: "Daily or 5x weekly", route: "Subcutaneous", notes: "Inject near area of interest.",
  },
  "BPC-157 + TB-500 + GHK-Cu (Glow Blend)": {
    path: "/peptides/bpc-157-tb-500-ghk-cu-glow-blend", img: `${IMG}BPC_157_plus_TB_500_plus_GHK_Cu_07f838de84.png`,
    desc: "Repair + skin rejuvenation with copper peptide for collagen support.", blend: true,
    freq: "Daily or 5x weekly", route: "Subcutaneous", notes: "Healing and anti-aging in one vial.",
  },
  "BPC-157 + TB-500 + KPV + GHK-Cu (Klow Blend)": {
    path: "/peptides/klow-blend", img: `${IMG}KLOW_f5c805d83f.png`,
    desc: "Comprehensive 4-peptide blend for repair, inflammation, gut, and skin.", blend: true,
    freq: "Daily or 5x weekly", route: "Subcutaneous", notes: "Most comprehensive blend available.",
  },
  "CJC-1295 (no DAC) + Ipamorelin (Blend)": {
    path: "/peptides/cjc-1295-no-dac-ipamorelin-blend", img: `${IMG}CJC_1295_plus_IPAMORELIN_497cb0b851.png`,
    desc: "The gold-standard GH blend — synergistic growth hormone release.", blend: true,
    freq: "1-2x daily", route: "Subcutaneous", notes: "Most popular GH blend. Best before bed and/or morning.",
  },
  "CJC-1295 (no DAC) + Ipamorelin + GHRP-2 (Blend)": {
    path: "/peptides/cjc-1295-no-dac-ipamorelin-ghrp-2-blend", img: `${IMG}CJC_plus_IPA_plus_GHRP_2_ea90324c5c.png`,
    desc: "Triple GH blend for maximized growth hormone secretion.", blend: true,
    freq: "1-2x daily", route: "Subcutaneous", notes: "Most aggressive GH stack in a single vial.",
  },
  "Sermorelin + Ipamorelin (Blend)": {
    path: "/peptides/sermorelin-ipamorelin-blend", img: `${IMG}Sermorelin_plus_Ipamorelin_4f70c1edb4.png`,
    desc: "Dual GHRH/GHS blend for balanced growth hormone optimization.", blend: true,
    freq: "1x daily (evening)", route: "Subcutaneous", notes: "Gentle starting point for GH research.",
  },
};

export const STACKS = [
  { name: "Tissue Repair Stack", peptides: ["BPC-157","TB-500"], blend: "BPC-157 + TB-500 (Wolverine Blend)",
    why: "BPC-157 repairs from inside out, TB-500 promotes cell migration. Complementary healing pathways." },
  { name: "Growth Hormone Stack", peptides: ["CJC-1295 (no DAC)","Ipamorelin"], blend: "CJC-1295 (no DAC) + Ipamorelin (Blend)",
    why: "CJC-1295 extends GH release while Ipamorelin amplifies the pulse. Synergistic effect." },
  { name: "Total Recovery Stack", peptides: ["BPC-157","TB-500","GHK-Cu"], blend: "BPC-157 + TB-500 + GHK-Cu (Glow Blend)",
    why: "Full spectrum: tissue repair, anti-inflammation, and collagen synthesis." },
  { name: "Metabolic + Gut Protection", peptides: ["Semaglutide","BPC-157"],
    why: "GLP-1 agonists can cause GI effects. BPC-157 studied for gastroprotective properties." },
  { name: "Anti-Aging Stack", peptides: ["GHK-Cu","NAD+"],
    why: "GHK-Cu regenerates skin/collagen, NAD+ supports cellular energy and DNA repair." },
  { name: "Immune + Gut Health", peptides: ["Thymosin Alpha-1","KPV","BPC-157"],
    why: "Systemic immunity + gut inflammation reduction + GI lining repair." },
];

export const GOALS = [
  { id:"tissue-repair", label:"Tissue Repair & Recovery", icon:"\u{1F9EC}", desc:"Wound healing, muscle, tendon, ligament",
    peptides:["BPC-157","TB-500","BPC-157 + TB-500 (Wolverine Blend)","BPC-157 + TB-500 + GHK-Cu (Glow Blend)"] },
  { id:"gut-health", label:"Gut Health & Inflammation", icon:"\u{1F52C}", desc:"GI repair, intestinal lining, inflammation",
    peptides:["BPC-157","KPV","BPC-157 + TB-500 + KPV + GHK-Cu (Klow Blend)"] },
  { id:"growth-hormone", label:"Growth Hormone", icon:"\u{1F4C8}", desc:"GH secretion, body composition, anti-aging",
    peptides:["CJC-1295 (no DAC) + Ipamorelin (Blend)","CJC-1295 (no DAC)","Ipamorelin","Sermorelin","CJC-1295 (no DAC) + Ipamorelin + GHRP-2 (Blend)","Sermorelin + Ipamorelin (Blend)"] },
  { id:"weight", label:"Weight & Metabolic", icon:"\u2696\uFE0F", desc:"Appetite, metabolic optimization",
    peptides:["Semaglutide","Tirzepatide","Retatrutide","MOTS-c"] },
  { id:"skin", label:"Skin & Anti-Aging", icon:"\u2728", desc:"Collagen, skin regeneration, longevity",
    peptides:["GHK-Cu","BPC-157 + TB-500 + GHK-Cu (Glow Blend)","NAD+"] },
  { id:"sleep", label:"Sleep & Stress", icon:"\u{1F319}", desc:"Sleep quality, circadian rhythm",
    peptides:["DSIP"] },
  { id:"immune", label:"Immune Support", icon:"\u{1F6E1}\uFE0F", desc:"Immune modulation, T-cell function",
    peptides:["Thymosin Alpha-1","KPV"] },
  { id:"performance", label:"Performance & Energy", icon:"\u26A1", desc:"Exercise physiology, mitochondria",
    peptides:["MOTS-c","NAD+","CJC-1295 (no DAC) + Ipamorelin (Blend)","Ipamorelin"] },
];

export const PRESETS: Record<string, { vialMg: number; waterMl: number; doseMcg: number }> = {
  "BPC-157":                           { vialMg:5,  waterMl:2,   doseMcg:250  },
  "CJC-1295 (with DAC)":               { vialMg:2,  waterMl:2,   doseMcg:1000 },
  "CJC-1295 (no DAC / Mod GRF 1-29)":  { vialMg:2,  waterMl:2,   doseMcg:100  },
  "Ipamorelin":                         { vialMg:5,  waterMl:2.5, doseMcg:200  },
  "Retatrutide":                        { vialMg:10, waterMl:3,   doseMcg:1000 },
  "Semaglutide (research analog)":      { vialMg:5,  waterMl:2.5, doseMcg:250  },
  "TB-500 (Thymosin Beta-4)":           { vialMg:5,  waterMl:2,   doseMcg:2500 },
  "Tirzepatide (research analog)":      { vialMg:10, waterMl:3,   doseMcg:2500 },
};

export const TITRATIONS: Record<string, { unit: string; freq: string; weeks: { week: string; dose: string }[] }> = {
  "Semaglutide (research analog)": {
    unit: "mg", freq: "1x weekly",
    weeks: [
      { week: "1-4", dose: "0.25 mg" },
      { week: "5-8", dose: "0.5 mg" },
      { week: "9-12", dose: "1.0 mg" },
      { week: "13-16", dose: "1.7 mg" },
      { week: "17+", dose: "2.4 mg" },
    ],
  },
  "Tirzepatide (research analog)": {
    unit: "mg", freq: "1x weekly",
    weeks: [
      { week: "1-4", dose: "2.5 mg" },
      { week: "5-8", dose: "5.0 mg" },
      { week: "9-12", dose: "7.5 mg" },
      { week: "13-16", dose: "10.0 mg" },
      { week: "17-20", dose: "12.5 mg" },
      { week: "21+", dose: "15.0 mg" },
    ],
  },
  "Retatrutide": {
    unit: "mg", freq: "1x weekly",
    weeks: [
      { week: "1-4", dose: "1.0 mg" },
      { week: "5-8", dose: "2.0 mg" },
      { week: "9-12", dose: "4.0 mg" },
      { week: "13-16", dose: "8.0 mg" },
      { week: "17+", dose: "12.0 mg" },
    ],
  },
};

export const CALC_MAP: Record<string, string> = {
  "BPC-157":"BPC-157",
  "CJC-1295 (no DAC / Mod GRF 1-29)":"CJC-1295 (no DAC)",
  "Ipamorelin":"Ipamorelin",
  "Retatrutide":"Retatrutide",
  "Semaglutide (research analog)":"Semaglutide",
  "TB-500 (Thymosin Beta-4)":"TB-500",
  "Tirzepatide (research analog)":"Tirzepatide",
};

export const CALC_NAMES = [...Object.keys(PRESETS), "Other"];

export const DEFAULTS = {
  peptide: "BPC-157",
  customPeptide: "",
  vialMg: 5,
  waterMl: 2,
  doseMode: "flat" as "flat" | "perkg",
  doseMcg: 250,
  doseMcgPerKg: 5,
  bodyWeightKg: 80,
};

export const FAQS = [
  { q: "What is bacteriostatic water?", a: "Bacteriostatic water is sterile water containing 0.9% benzyl alcohol to prevent bacterial growth. It's the standard solvent for reconstituting lyophilized (freeze-dried) peptides in research settings." },
  { q: "What syringe should I use?", a: "U-100 insulin syringes are standard for peptide research. 1 mL = 100 units. For most doses, 0.5 mL (50-unit) or 1 mL (100-unit) syringes work well. Use the smallest syringe that fits your dose volume for best accuracy." },
  { q: "How do I store reconstituted peptides?", a: "Refrigerate at 2\u20138\u00B0C (36\u201346\u00B0F). Most reconstituted peptides remain stable for 3\u20134 weeks when refrigerated. Never freeze reconstituted solutions. Protect from light and avoid repeated temperature fluctuations." },
  { q: "How do I reconstitute a peptide vial?", a: "1) Wipe both vial tops with alcohol swabs. 2) Draw the desired volume of bacteriostatic water. 3) Inject slowly into the peptide vial, aiming the stream at the glass wall \u2014 not directly onto the powder. 4) Gently swirl until fully dissolved. Never shake." },
  { q: "What does 'units' mean on an insulin syringe?", a: "On a U-100 syringe, 100 units = 1 mL. So 10 units = 0.1 mL, 50 units = 0.5 mL, and so on. This calculator automatically converts your peptide dose into both mL and syringe units for convenience." },
  { q: "Can I mix peptides in the same syringe?", a: "Some peptides are commonly combined (like CJC-1295 and Ipamorelin), which is why pre-made blends exist. Mixing arbitrary peptides in a syringe may cause degradation or interactions. When possible, use pre-made blends or inject separately." },
];

export const TIME_LABELS: Record<string, string> = { morning: "Morning", afternoon: "Afternoon", evening: "Evening", "before-bed": "Before Bed" };
export const TIME_ICONS: Record<string, string> = { morning: "\u2600\uFE0F", afternoon: "\u{1F324}\uFE0F", evening: "\u{1F305}", "before-bed": "\u{1F319}" };

export const PEPTIDE_COLORS = ["#a78bfa","#38bdf8","#34d399","#f59e0b","#f472b6","#fb923c","#22d3ee","#a3e635"];
export const DAY_NAMES = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
