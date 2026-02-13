import { useState, useCallback, useMemo, useEffect, useRef } from 'preact/compat';
import {
  CATALOG, STACKS, GOALS, PRESETS, TITRATIONS, CALC_MAP, CALC_NAMES, DEFAULTS, FAQS,
  TIME_LABELS, TIME_ICONS, PEPTIDE_COLORS, DAY_NAMES,
} from './data';
import {
  aff, encodeState, decodeState, decodeFinderHash, encodeFinderHash,
  sendEmail, freqToDays, freqToMonthly, copyToClipboard,
  type CalcState,
} from './utils';

// ── Shared Components ──

function DisclaimerBanner() {
  return (
    <div className="disclaimer-bar rounded-xl px-4 py-3 text-center">
      <p className="text-red-300 font-bold text-xs uppercase tracking-widest">For Research Use Only — Not for Human Consumption</p>
      <p className="text-red-400/60 text-xs mt-1">Intended solely for laboratory and research purposes.</p>
    </div>
  );
}

function ProductCard({ name, compact, showImg = true }: { name: string; compact?: boolean; showImg?: boolean }) {
  const p = CATALOG[name];
  if (!p) return null;
  return (
    <a href={aff(p.path)} target="_blank" rel="noopener noreferrer"
      className="block glass card-hover rounded-xl p-3 group cursor-pointer">
      <div className="flex items-start gap-3">
        {showImg && <img src={p.img} alt={p.label || name} className="product-img shrink-0" loading="lazy" />}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-gray-100 font-semibold text-sm group-hover:text-white transition-colors">{p.label || name}</p>
            {p.blend && <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full stack-badge text-purple-300">Blend</span>}
          </div>
          {!compact && <p className="text-gray-300 text-xs mt-1 leading-relaxed">{p.desc}</p>}
          {!compact && (
            <div className="flex items-center gap-3 mt-1.5">
              <span className="text-[10px] text-gray-300 uppercase tracking-wide">{p.freq}</span>
              <span className="text-gray-400">|</span>
              <span className="text-[10px] text-gray-300 uppercase tracking-wide">{p.route}</span>
            </div>
          )}
        </div>
        <span className="shrink-0 text-xs shop-btn text-white px-3 py-1.5 rounded-lg font-medium whitespace-nowrap">5% off &rarr;</span>
      </div>
    </a>
  );
}

function StackCard({ stack }: { stack: typeof STACKS[number] }) {
  const blendProduct = 'blend' in stack && stack.blend ? CATALOG[stack.blend as string] : null;
  return (
    <div className="glass rounded-xl p-4 space-y-2">
      <span className="text-xs font-bold uppercase tracking-wider gradient-text">{stack.name}</span>
      <p className="text-gray-300 text-xs leading-relaxed">{stack.why}</p>
      <div className="flex flex-wrap gap-1.5 pt-1">
        {stack.peptides.map((pp) => (
          <span key={pp} className="text-[10px] px-2 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300">{pp}</span>
        ))}
      </div>
      {blendProduct && (
        <a href={aff(blendProduct.path)} target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 shop-btn text-white text-xs font-medium px-3 py-1.5 rounded-lg mt-1">
          {blendProduct.img && <img src={blendProduct.img} alt="" className="w-5 h-5 rounded object-contain" />}
          Shop as blend — 5% off &rarr;
        </a>
      )}
    </div>
  );
}

// ── Syringe Visual ──

function SyringeVisual({ units }: { units: number }) {
  const clamped = Math.min(Math.max(units, 0), 100);
  const overMax = units > 100;
  const fillPct = clamped / 100;
  const barX = 50, barW = 220, barY = 18, barH = 24;
  const fillW = fillPct * barW;

  return (
    <div className="glass rounded-xl p-4 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400 uppercase tracking-wide font-bold">Syringe Draw</span>
        <span className={`font-bold text-lg ${overMax ? "text-red-400" : ""}`} style={overMax ? {} : { background: "linear-gradient(135deg,#34d399,#38bdf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          {units.toFixed(1)} units
        </span>
      </div>
      <svg viewBox="0 0 320 56" className="w-full" role="img" aria-label={`Syringe showing ${units.toFixed(1)} units`}>
        <defs>
          <linearGradient id="syringeFill" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={overMax ? "#ef4444" : "#34d399"} />
            <stop offset="100%" stopColor={overMax ? "#f87171" : "#38bdf8"} />
          </linearGradient>
        </defs>
        <rect x={barX - 30} y={barY + 4} width={10} height={barH - 8} rx={2} fill="rgba(255,255,255,0.2)" />
        <rect x={barX - 20} y={barY + 8} width={20 + barW - fillW} height={barH - 16} rx={1} fill="rgba(255,255,255,0.1)" />
        <rect x={barX} y={barY} width={barW} height={barH} rx={3} fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.15)" strokeWidth={1} />
        <rect x={barX + barW - fillW} y={barY} width={fillW} height={barH} rx={3} fill="url(#syringeFill)" opacity={0.5} className="syringe-fill" />
        {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map(tick => {
          const x = barX + (tick / 100) * barW;
          const major = tick % 50 === 0;
          return (
            <g key={tick}>
              <line x1={x} y1={barY} x2={x} y2={barY + (major ? 8 : 5)} stroke="rgba(255,255,255,0.25)" strokeWidth={major ? 1 : 0.5} />
              {major && <text x={x} y={barY + barH + 12} textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="7" fontFamily="Inter, sans-serif">{tick}u</text>}
            </g>
          );
        })}
        {clamped > 0 && (
          <line x1={barX + barW - fillW} y1={barY - 3} x2={barX + barW - fillW} y2={barY + barH + 3} stroke={overMax ? "#ef4444" : "#34d399"} strokeWidth={1.5} strokeDasharray="3,2" />
        )}
        <rect x={barX + barW} y={barY + 6} width={12} height={barH - 12} rx={1} fill="rgba(255,255,255,0.12)" />
        <line x1={barX + barW + 12} y1={barY + barH / 2} x2={barX + barW + 40} y2={barY + barH / 2} stroke="rgba(255,255,255,0.3)" strokeWidth={1.5} />
        <line x1={barX + barW + 40} y1={barY + barH / 2} x2={barX + barW + 48} y2={barY + barH / 2} stroke="rgba(255,255,255,0.15)" strokeWidth={0.7} />
      </svg>
      {overMax && (
        <p className="text-red-400 text-[10px] font-medium text-center">
          Exceeds 100-unit (1 mL) syringe capacity. Consider using a larger syringe or adjusting reconstitution volume.
        </p>
      )}
    </div>
  );
}

// ── FAQ ──

function FAQItem({ faq }: { faq: { q: string; a: string } }) {
  const [open, setOpen] = useState(false);
  return (
    <button onClick={() => setOpen(!open)} className="w-full text-left glass rounded-xl overflow-hidden transition-all">
      <div className="flex items-center justify-between p-3.5">
        <span className="text-sm font-medium text-gray-200 pr-4">{faq.q}</span>
        <span className={`text-gray-400 text-xs transition-transform duration-200 shrink-0 ${open ? "rotate-180" : ""}`}>{"\u25BC"}</span>
      </div>
      <div className={`faq-answer ${open ? "open" : ""}`} style={{ maxHeight: open ? "200px" : "0", padding: open ? "0 14px 14px" : "0 14px" }}>
        <p className="text-gray-300 text-xs leading-relaxed">{faq.a}</p>
      </div>
    </button>
  );
}

function FAQSection() {
  return (
    <div className="space-y-3">
      <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider text-center">Frequently Asked Questions</h3>
      <div className="space-y-2">
        {FAQS.map((faq, i) => <FAQItem key={i} faq={faq} />)}
      </div>
    </div>
  );
}

// ── Exit Intent Modal ──

function ExitIntentModal({ show, onClose, emailCaptured }: { show: boolean; onClose: () => void; emailCaptured: boolean }) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!show || emailCaptured) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    sendEmail(email.trim(), { source: "exit_intent" });
    setSubmitted(true);
    setTimeout(onClose, 2000);
  };

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-card glass-strong rounded-2xl p-6 mx-4 max-w-sm w-full space-y-4 relative">
        {submitted ? (
          <div className="text-center space-y-3 py-4">
            <div className="success-check text-4xl">{"\u2705"}</div>
            <p className="text-lg font-bold text-gray-100">You're in!</p>
            <p className="text-gray-300 text-sm">Check your inbox for your personalized protocol guide.</p>
          </div>
        ) : (
          <>
            <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-300 text-lg">&times;</button>
            <div className="text-center space-y-2">
              <p className="text-2xl">{"\u{1F9EC}"}</p>
              <h3 className="text-lg font-bold text-gray-100">Wait — Don't Miss Out</h3>
              <p className="text-gray-300 text-sm leading-relaxed">Get your <span className="text-purple-300 font-semibold">free personalized peptide protocol</span> plus 5% off your first order.</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input type="email" required placeholder="you@email.com" value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full input-glass rounded-lg px-3 py-3 text-sm text-gray-100 placeholder-gray-400" autoFocus />
              <button type="submit" className="w-full pill-active text-white font-bold py-3 rounded-lg text-sm">
                Get My Free Protocol
              </button>
            </form>
            <p className="text-[10px] text-gray-500 text-center">No spam. Unsubscribe anytime.</p>
          </>
        )}
      </div>
    </div>
  );
}

// ── Weekly Calendar ──

function WeeklyCalendar({ entries }: { entries: { id: number; peptide: string; timeOfDay: string }[] }) {
  if (entries.length === 0) return null;
  const colorMap: Record<number, string> = {};
  entries.forEach((e, i) => { colorMap[e.id] = PEPTIDE_COLORS[i % PEPTIDE_COLORS.length]; });

  const dayEntries = DAY_NAMES.map((_, dayIdx) =>
    entries.filter(e => {
      const cat = CATALOG[e.peptide];
      return cat && freqToDays(cat.freq).includes(dayIdx);
    })
  );

  return (
    <div className="glass-strong rounded-2xl p-5 space-y-3 fade-in">
      <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider">Weekly View</h3>
      <div className="grid grid-cols-7 gap-1">
        {DAY_NAMES.map(d => (
          <div key={d} className="text-center text-[10px] text-gray-400 font-semibold pb-1">{d}</div>
        ))}
        {dayEntries.map((dayList, dayIdx) => (
          <div key={dayIdx} className="glass rounded-lg p-1 min-h-[48px] flex flex-col gap-0.5 items-center justify-center">
            {dayList.length === 0 ? (
              <span className="text-gray-600 text-[8px]">&mdash;</span>
            ) : dayList.map(e => (
              <div key={e.id} className="cal-dot" style={{ background: colorMap[e.id] + "30", border: `1px solid ${colorMap[e.id]}50` }} title={CATALOG[e.peptide]?.label || e.peptide}>
                <span style={{ color: colorMap[e.id] }}>{(CATALOG[e.peptide]?.label || e.peptide).substring(0, 2)}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {entries.map(e => (
          <div key={e.id} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: colorMap[e.id] }}></div>
            <span className="text-[10px] text-gray-300">{CATALOG[e.peptide]?.label || e.peptide}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Protocol Builder ──

function ProtocolBuilder({ emailCaptured, onRequestEmail }: { emailCaptured: boolean; onRequestEmail: () => void }) {
  const [entries, setEntries] = useState<{ id: number; peptide: string; timeOfDay: string }[]>(() => {
    try { const saved = localStorage.getItem("peptide_protocol"); return saved ? JSON.parse(saved) : []; } catch { return []; }
  });
  useEffect(() => {
    try { localStorage.setItem("peptide_protocol", JSON.stringify(entries)); } catch {}
  }, [entries]);
  const [addPeptide, setAddPeptide] = useState("");
  const [copied, setCopied] = useState(false);
  const [searchFilter, setSearchFilter] = useState("");
  const catalogKeys = Object.keys(CATALOG);
  const filteredKeys = searchFilter ? catalogKeys.filter(k => (CATALOG[k].label || k).toLowerCase().includes(searchFilter.toLowerCase())) : catalogKeys;

  const addEntry = () => {
    if (!addPeptide || !CATALOG[addPeptide]) return;
    const cat = CATALOG[addPeptide];
    const suggestedTime = cat.freq?.includes("evening") || cat.freq?.includes("bed") ? "before-bed"
      : cat.freq?.includes("morning") ? "morning" : "morning";
    setEntries(prev => [...prev, { id: Date.now(), peptide: addPeptide, timeOfDay: suggestedTime }]);
    setAddPeptide("");
  };

  const removeEntry = (id: number) => setEntries(prev => prev.filter(e => e.id !== id));
  const updateTime = (id: number, time: string) => setEntries(prev => prev.map(e => e.id === id ? { ...e, timeOfDay: time } : e));

  const schedule = useMemo(() => {
    const s: Record<string, typeof entries> = { morning: [], afternoon: [], evening: [], "before-bed": [] };
    entries.forEach(e => { if (s[e.timeOfDay]) s[e.timeOfDay].push(e); });
    return s;
  }, [entries]);

  const hasEntries = entries.length > 0;
  const scheduleText = Object.entries(schedule)
    .filter(([, items]) => items.length > 0)
    .map(([time, items]) => `${TIME_ICONS[time]} ${TIME_LABELS[time]}:\n${items.map(e => `  - ${CATALOG[e.peptide]?.label || e.peptide} (${CATALOG[e.peptide]?.freq}, ${CATALOG[e.peptide]?.route})`).join("\n")}`)
    .join("\n\n");
  const fullProtocol = `--- My Peptide Research Protocol ---\nFOR RESEARCH USE ONLY\n\n${scheduleText}\n\nAll peptides from Peptide Restore (5% off): ${aff("")}\n\nDISCLAIMER: Research use only.`;

  const copyProtocol = async () => {
    await copyToClipboard(fullProtocol);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-5 fade-in">
      <div className="text-center space-y-1">
        <h2 className="text-lg font-bold text-gray-100">Build Your Protocol</h2>
        <p className="text-gray-300 text-xs">Add peptides and schedule them throughout your day</p>
      </div>

      <div className="glass-strong rounded-2xl p-5 space-y-4">
        <div className="space-y-2">
          <input type="text" placeholder="Search peptides..." value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full input-glass rounded-lg px-3 py-2 text-gray-100 text-sm placeholder-gray-400" />
          <select value={addPeptide} onChange={(e) => setAddPeptide(e.target.value)}
            className="w-full input-glass rounded-lg px-3 py-2.5 text-gray-100 text-sm appearance-none cursor-pointer">
            <option value="">Select a peptide to add...</option>
            {filteredKeys.map(k => <option key={k} value={k}>{CATALOG[k].label || k}</option>)}
          </select>
          <button onClick={addEntry} disabled={!addPeptide}
            className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-all ${addPeptide ? "pill-active text-white" : "glass text-gray-400 cursor-not-allowed"}`}>
            + Add Peptide
          </button>
        </div>

        {entries.length === 0 ? (
          <div className="glass rounded-xl p-8 text-center">
            <p className="text-gray-400 text-sm">No peptides added yet</p>
            <p className="text-gray-500 text-xs mt-1">Select a peptide above to start building your protocol</p>
          </div>
        ) : (
          <div className="space-y-2">
            {entries.map(entry => {
              const cat = CATALOG[entry.peptide];
              return (
                <div key={entry.id} className="glass rounded-xl p-3 fade-in">
                  <div className="flex items-start gap-3">
                    <img src={cat.img} alt="" className="w-10 h-10 rounded object-contain bg-white/5 shrink-0" />
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-semibold text-gray-100 truncate">{cat.label || entry.peptide}</p>
                        <button onClick={() => removeEntry(entry.id)} className="text-red-400/70 hover:text-red-400 text-xs shrink-0 transition-colors font-medium">&times; Remove</button>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-gray-300">
                        <span>{cat.freq}</span><span className="text-gray-400">|</span><span>{cat.route}</span>
                      </div>
                      <div className="flex gap-1">
                        {Object.entries(TIME_LABELS).map(([k, label]) => (
                          <button key={k} onClick={() => updateTime(entry.id, k)}
                            className={`flex-1 py-2 rounded-md text-xs font-medium transition-all ${entry.timeOfDay === k ? "pill-active text-white" : "pill-track text-white/70 hover:text-white"}`}>
                            {TIME_ICONS[k]} {label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {hasEntries && (
        <div className="glass-strong rounded-2xl p-5 space-y-4 fade-in">
          <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider">Daily Schedule</h3>
          {Object.entries(schedule).filter(([, items]) => items.length > 0).map(([time, items]) => (
            <div key={time} className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm">{TIME_ICONS[time]}</span>
                <span className="text-xs font-semibold text-gray-200">{TIME_LABELS[time]}</span>
              </div>
              <div className="space-y-1 ml-6">
                {items.map(e => {
                  const cat = CATALOG[e.peptide];
                  return (
                    <a key={e.id} href={aff(cat.path)} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 glass rounded-lg p-2 group hover:border-white/20 transition-all">
                      <img src={cat.img} alt="" className="w-7 h-7 rounded object-contain bg-white/5" />
                      <span className="text-xs text-gray-300 group-hover:text-white flex-1">{cat.label || e.peptide}</span>
                      <span className="text-[10px] text-gray-300">{cat.freq}</span>
                    </a>
                  );
                })}
              </div>
            </div>
          ))}

          <div className="space-y-2 pt-2">
            <button onClick={() => {
              const unique = [...new Set(entries.map(e => e.peptide))];
              unique.forEach((p, i) => {
                const cat = CATALOG[p];
                if (cat) setTimeout(() => window.open(aff(cat.path), "_blank"), i * 300);
              });
            }}
              className="w-full shop-btn text-white font-semibold py-2.5 rounded-xl text-xs">
              Shop This Protocol — 5% Off Each
            </button>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={copyProtocol}
                className="glass hover:bg-white/10 text-gray-300 hover:text-white font-medium py-2.5 rounded-xl transition-all text-xs">
                {copied ? "\u2713 Copied!" : "Copy Protocol"}
              </button>
              <a href={aff("")} target="_blank" rel="noopener noreferrer"
                className="block text-center glass hover:bg-white/10 text-gray-300 hover:text-white font-medium py-2.5 rounded-xl text-xs">
                Browse All
              </a>
            </div>
          </div>
        </div>
      )}

      {hasEntries && <WeeklyCalendar entries={entries} />}
    </div>
  );
}

// ── Peptide Finder ──

function PeptideFinder({ emailCaptured, onEmailSubmit }: { emailCaptured: boolean; onEmailSubmit: (email: string) => void }) {
  const initFinder = typeof window !== 'undefined' && window.location.hash.startsWith("#find=") ? decodeFinderHash(window.location.hash.slice(6)) : null;
  const [goals, setGoals] = useState<string[]>(initFinder?.goals || []);
  const [experience, setExperience] = useState(initFinder?.experience || "any");
  const [adminPref, setAdminPref] = useState(initFinder?.adminPref || "any");
  const [email, setEmail] = useState("");
  const [showStacks, setShowStacks] = useState(false);
  const [justUnlocked, setJustUnlocked] = useState(false);
  const [shareMsg, setShareMsg] = useState("");

  const toggleGoal = (id: string) => setGoals((prev) => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const recommendations = useMemo(() => {
    if (goals.length === 0) return [];
    const counts: Record<string, number> = {};
    const goalMap: Record<string, string[]> = {};
    goals.forEach((id) => {
      const g = GOALS.find(x => x.id === id);
      if (!g) return;
      g.peptides.forEach((p) => { counts[p] = (counts[p] || 0) + 1; if (!goalMap[p]) goalMap[p] = []; goalMap[p].push(g.label); });
    });
    let results = Object.entries(counts).map(([n, c]) => ({ name: n, count: c, goals: goalMap[n], product: CATALOG[n] })).filter(r => r.product);
    if (experience === "new") results.sort((a, b) => { if (a.product.blend && !b.product.blend) return 1; if (!a.product.blend && b.product.blend) return -1; return b.count - a.count; });
    else if (experience === "experienced") results.sort((a, b) => { if (a.product.blend && !b.product.blend) return -1; if (!a.product.blend && b.product.blend) return 1; return b.count - a.count; });
    else results.sort((a, b) => b.count - a.count);
    if (adminPref === "capsule") results = results.filter(r => r.product.capsule);
    return results;
  }, [goals, experience, adminPref]);

  const relevantStacks = useMemo(() => {
    if (goals.length === 0) return [];
    const all = new Set<string>();
    goals.forEach((id) => { const g = GOALS.find(x => x.id === id); if (g) g.peptides.forEach(p => all.add(p)); });
    return STACKS.filter(s => s.peptides.some(p => all.has(p)));
  }, [goals]);

  const [submitting, setSubmitting] = useState(false);
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitting(true);
    sendEmail(email.trim(), {
      goals: goals.map(id => GOALS.find(g => g.id === id)?.label).filter(Boolean).join(", "),
      experience,
      adminPref,
      source: "finder_gate",
    });
    setSubmitting(false);
    setJustUnlocked(true);
    setTimeout(() => setJustUnlocked(false), 3000);
    onEmailSubmit(email.trim());
  };

  const FREE_PREVIEW = 2;

  return (
    <div className="space-y-5 fade-in">
      <div className="text-center space-y-1">
        <h2 className="text-lg font-bold text-gray-100">What are you researching?</h2>
        <p className="text-gray-300 text-xs">Select your research areas for personalized recommendations</p>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {GOALS.map((g) => {
          const active = goals.includes(g.id);
          return (
            <button key={g.id} onClick={() => toggleGoal(g.id)}
              className={`text-left p-3 rounded-xl border transition-all card-hover ${active ? "goal-selected" : "glass border-white/5 hover:border-white/15"}`}>
              <div className="text-base mb-0.5">{g.icon}</div>
              <p className={`text-xs font-semibold ${active ? "text-purple-300" : "text-gray-200"}`}>{g.label}</p>
              <p className="text-[10px] text-gray-300 mt-0.5 leading-tight">{g.desc}</p>
            </button>
          );
        })}
      </div>

      {goals.length > 0 && (
        <div className="space-y-3 fade-in">
          <div className="space-y-2">
            <label className="block text-xs font-medium text-gray-400 uppercase tracking-wide">Experience Level</label>
            <div className="flex gap-1.5">
              {[{ id: "new", label: "New to Peptides" }, { id: "experienced", label: "Experienced" }, { id: "any", label: "Show All" }].map((opt) => (
                <button key={opt.id} onClick={() => setExperience(opt.id)}
                  className={`flex-1 py-2 px-2 rounded-lg text-xs font-medium transition-all ${experience === opt.id ? "pill-active text-white" : "pill-track text-gray-200 hover:text-white"}`}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-medium text-gray-400 uppercase tracking-wide">Administration</label>
            <div className="flex gap-1.5">
              {[{ id: "any", label: "Any" }, { id: "injectable", label: "Injectable" }, { id: "capsule", label: "Capsule / Oral" }].map((opt) => (
                <button key={opt.id} onClick={() => setAdminPref(opt.id)}
                  className={`flex-1 py-2 px-2 rounded-lg text-xs font-medium transition-all ${adminPref === opt.id ? "pill-active text-white" : "pill-track text-gray-200 hover:text-white"}`}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {recommendations.length > 0 && (
        <div className="space-y-3 fade-in">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider">Recommended for You</h3>
            <span className="text-[10px] text-emerald-400 font-medium">5% off all products</span>
          </div>
          <div className="space-y-2">
            {recommendations.slice(0, FREE_PREVIEW).map(({ name, count, goals: g }) => (
              <div key={name} className="fade-in">
                <ProductCard name={name} />
                {count > 1 && <p className="text-[10px] text-purple-400/80 mt-1 ml-14">Matches {count} goals: {g.join(", ")}</p>}
              </div>
            ))}
          </div>

          {recommendations.length > FREE_PREVIEW && !emailCaptured && (
            <div className="glass-strong rounded-xl p-5 space-y-3 text-center fade-in">
              <div className="space-y-1">
                <p className="text-sm font-bold text-gray-100">+{recommendations.length - FREE_PREVIEW} more recommendations</p>
                <p className="text-xs text-gray-300">Enter your email to unlock your full personalized protocol, stack suggestions, and dosing guide.</p>
              </div>
              <form onSubmit={handleEmailSubmit} className="flex flex-col sm:flex-row gap-2">
                <input type="email" required placeholder="you@email.com" value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 input-glass rounded-lg px-3 py-2.5 text-sm text-gray-100 placeholder-gray-400" />
                <button type="submit" disabled={submitting}
                  className="pill-active text-white font-semibold px-5 py-2.5 rounded-lg text-sm whitespace-nowrap">
                  {submitting ? "Unlocking..." : "Unlock All"}
                </button>
              </form>
              <p className="text-[10px] text-gray-500">No spam. Unsubscribe anytime.</p>
            </div>
          )}

          {justUnlocked && (
            <div className="glass-strong rounded-xl p-4 text-center fade-in space-y-2" style={{ borderColor: "rgba(52,211,153,.3)" }}>
              <div className="success-check text-3xl">{"\u2705"}</div>
              <p className="text-sm font-bold text-emerald-300">Protocol Unlocked!</p>
              <p className="text-xs text-gray-300">Here are all your personalized recommendations. Shop any product for 5% off.</p>
            </div>
          )}

          {emailCaptured && recommendations.length > FREE_PREVIEW && (
            <div className="space-y-2 fade-in">
              {recommendations.slice(FREE_PREVIEW).map(({ name, count, goals: g }) => (
                <div key={name}>
                  <ProductCard name={name} />
                  {count > 1 && <p className="text-[10px] text-purple-400/80 mt-1 ml-14">Matches {count} goals: {g.join(", ")}</p>}
                </div>
              ))}
            </div>
          )}

          {relevantStacks.length > 0 && (emailCaptured || recommendations.length <= FREE_PREVIEW) && (
            <div className="space-y-3">
              <button onClick={() => setShowStacks(!showStacks)}
                className="flex items-center gap-2 text-xs font-bold text-gray-300 uppercase tracking-wider hover:text-white transition-colors">
                <span>{showStacks ? "\u25BC" : "\u25B6"}</span>Synergistic Stacks ({relevantStacks.length})
              </button>
              {showStacks && (
                <div className="space-y-2 fade-in">
                  {relevantStacks.map((s) => <StackCard key={s.name} stack={s} />)}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {goals.length > 0 && (
        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => { setGoals([]); setExperience("any"); setAdminPref("any"); setShowStacks(false); setShareMsg(""); }}
            className="glass hover:bg-white/10 text-gray-300 hover:text-gray-100 font-medium py-2 rounded-xl transition-all text-xs">
            Clear All
          </button>
          <button onClick={async () => {
            const url = `${location.origin}/calculator#find=${encodeFinderHash(goals, experience, adminPref)}`;
            await copyToClipboard(url);
            setShareMsg("Link copied!"); setTimeout(() => setShareMsg(""), 2000);
          }}
            className="glass hover:bg-white/10 text-gray-300 hover:text-white font-medium py-2 rounded-xl transition-all text-xs">
            {shareMsg || "Share Results"}
          </button>
        </div>
      )}
    </div>
  );
}

// ── Calculator Tab ──

function NumberInput({ label, value, onChange, unit, min, step }: { label: string; value: number; onChange: (v: number) => void; unit?: string; min?: number; step?: number | string }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-medium text-gray-400 uppercase tracking-wide">{label}</label>
      <div className="relative">
        <input type="number" value={value} onChange={(e) => onChange(parseFloat(e.target.value) || 0)} min={min || 0} step={step || "any"}
          className="w-full input-glass rounded-lg px-3 py-2.5 pr-14 text-gray-100" />
        {unit && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-medium">{unit}</span>}
      </div>
    </div>
  );
}

function UnitConverter() {
  const [open, setOpen] = useState(false);
  const [lbs, setLbs] = useState(176);
  const [mg, setMg] = useState(5);
  return (
    <div className="glass rounded-xl overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-3.5">
        <span className="text-xs font-medium text-gray-300">Unit Converter</span>
        <span className={`text-gray-400 text-xs transition-transform duration-200 ${open ? "rotate-180" : ""}`}>{"\u25BC"}</span>
      </button>
      {open && (
        <div className="px-3.5 pb-3.5 space-y-3 fade-in">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] text-gray-400 uppercase font-medium">Pounds</label>
              <input type="number" value={lbs} onChange={(e) => setLbs(parseFloat(e.target.value) || 0)}
                className="w-full input-glass rounded-lg px-3 py-2 text-gray-100 text-sm" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-gray-400 uppercase font-medium">Kilograms</label>
              <div className="input-glass rounded-lg px-3 py-2 text-gray-200 text-sm font-medium">{(lbs * 0.453592).toFixed(1)}</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] text-gray-400 uppercase font-medium">Milligrams</label>
              <input type="number" value={mg} onChange={(e) => setMg(parseFloat(e.target.value) || 0)}
                className="w-full input-glass rounded-lg px-3 py-2 text-gray-100 text-sm" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-gray-400 uppercase font-medium">Micrograms</label>
              <div className="input-glass rounded-lg px-3 py-2 text-gray-200 text-sm font-medium">{(mg * 1000).toLocaleString()}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CalcTab() {
  const initHash = typeof window !== 'undefined' && window.location.hash.startsWith("#calc=") ? decodeState(window.location.hash.slice(6)) : null;
  const [state, setState] = useState<CalcState>(initHash || { ...DEFAULTS });
  const [vialPrice, setVialPrice] = useState(0);
  const onChange = useCallback((k: string, v: any) => setState(p => ({ ...p, [k]: v })), []);
  const onSelect = useCallback((name: string) => {
    const pr = PRESETS[name]; if (pr) setState(p => ({ ...p, peptide: name, vialMg: pr.vialMg, waterMl: pr.waterMl, doseMcg: pr.doseMcg, doseMode: "flat" }));
    else setState(p => ({ ...p, peptide: name }));
  }, []);
  const reset = () => { setState({ ...DEFAULTS }); setVialPrice(0); window.history.replaceState(null, "", window.location.pathname); };

  const catKey = CALC_MAP[state.peptide];
  const product = catKey ? CATALOG[catKey] : null;

  const totalMcg = state.vialMg * 1000;
  const conc = state.waterMl > 0 ? totalMcg / state.waterMl : 0;
  const dose = state.doseMode === "flat" ? state.doseMcg : state.doseMcgPerKg * state.bodyWeightKg;
  const vol = conc > 0 ? dose / conc : 0;
  const units = vol * 100;
  const doses = dose > 0 ? totalMcg / dose : 0;
  const pName = state.peptide === "Other" ? state.customPeptide || "Custom Peptide" : state.peptide;
  const valid = state.vialMg > 0 && state.waterMl > 0 && dose > 0;
  const costPerDose = vialPrice > 0 && doses > 0 ? vialPrice / doses : 0;
  const catKey2 = CALC_MAP[state.peptide];
  const monthlyDoses = catKey2 && CATALOG[catKey2] ? freqToMonthly(CATALOG[catKey2].freq) : 30;
  const monthlyCost = costPerDose > 0 ? costPerDose * monthlyDoses : 0;

  const instructions = [
    `Reconstitute the ${state.vialMg} mg vial of ${pName} with ${state.waterMl} mL of bacteriostatic water.`,
    `Resulting concentration: ${conc.toFixed(1)} mcg/mL.`,
    `For a ${dose.toFixed(1)} mcg dose, draw ${vol.toFixed(4)} mL (${units.toFixed(1)} units on a U-100 insulin syringe).`,
    `This vial provides approximately ${Math.floor(doses)} doses at this dosage.`,
  ];
  const fullText = [`--- ${pName} Reconstitution ---`, "FOR RESEARCH USE ONLY", "", ...instructions.map((s, i) => `${i + 1}. ${s}`), "", "Safety: Aseptic technique. Store at 2-8\u00B0C.", "", "DISCLAIMER: Research use only."].join("\n");

  const [copied, setCopied] = useState(false);
  const [shareMsg, setShareMsg] = useState("");

  const Row = ({ label, value }: { label: string; value: string }) => (
    <div className="flex justify-between items-center py-2"><span className="text-gray-400 text-xs">{label}</span><span className="num-highlight font-bold text-lg">{value}</span></div>
  );

  return (
    <div className="space-y-4 fade-in">
      <div className="glass-strong rounded-2xl p-5 space-y-5 shadow-2xl">
        <div className="space-y-3">
          <label className="block text-xs font-medium text-gray-400 uppercase tracking-wide">Peptide</label>
          <select value={state.peptide} onChange={(e) => onSelect(e.target.value)}
            className="w-full input-glass rounded-lg px-3 py-2.5 text-gray-100 appearance-none cursor-pointer">
            {CALC_NAMES.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
          {state.peptide === "Other" && (
            <input type="text" placeholder="Enter peptide name" value={state.customPeptide}
              onChange={(e) => onChange("customPeptide", e.target.value)}
              className="w-full input-glass rounded-lg px-3 py-2.5 text-gray-100 placeholder-gray-400" />
          )}
          {PRESETS[state.peptide] && (
            <p className="text-[10px] text-gray-400">Recommended: {PRESETS[state.peptide].vialMg} mg vial + {PRESETS[state.peptide].waterMl} mL bac water, typical dose {PRESETS[state.peptide].doseMcg} mcg</p>
          )}
          {product && (
            <div className="glass rounded-lg p-3 space-y-2">
              <div className="flex items-center gap-3">
                <img src={product.img} alt="" className="w-10 h-10 rounded object-contain bg-white/5" />
                <div className="flex-1 grid grid-cols-2 gap-1">
                  <div><p className="text-[10px] text-gray-400 uppercase">Frequency</p><p className="text-xs text-gray-200 font-medium">{product.freq}</p></div>
                  <div><p className="text-[10px] text-gray-400 uppercase">Route</p><p className="text-xs text-gray-200 font-medium">{product.route}</p></div>
                </div>
              </div>
              {product.notes && <p className="text-[10px] text-gray-300">{product.notes}</p>}
              <a href={aff(product.path)} target="_blank" rel="noopener noreferrer"
                className="block w-full text-center shop-btn text-white text-xs font-semibold px-4 py-2 rounded-lg">
                Shop {product.label || catKey} — 5% Off
              </a>
            </div>
          )}
        </div>
        <div className="border-t border-white/5" />
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider">Vial & Reconstitution</h3>
          <div className="grid grid-cols-2 gap-3">
            <NumberInput label="Vial Amount" value={state.vialMg} onChange={(v) => onChange("vialMg", v)} unit="mg" min={0.1} step={0.5} />
            <NumberInput label="Bac Water" value={state.waterMl} onChange={(v) => onChange("waterMl", v)} unit="mL" min={0.1} step={0.5} />
          </div>
          <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider pt-1">Dose</h3>
          <div className="flex gap-1.5">
            <button onClick={() => onChange("doseMode", "flat")} className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${state.doseMode === "flat" ? "pill-active text-white" : "pill-track text-gray-200 hover:text-white"}`}>Flat Dose (mcg)</button>
            <button onClick={() => onChange("doseMode", "perkg")} className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${state.doseMode === "perkg" ? "pill-active text-white" : "pill-track text-gray-200 hover:text-white"}`}>Per Body Weight</button>
          </div>
          {state.doseMode === "flat"
            ? <NumberInput label="Dose" value={state.doseMcg} onChange={(v) => onChange("doseMcg", v)} unit="mcg" min={1} step={10} />
            : <div className="grid grid-cols-2 gap-3">
              <NumberInput label="Dose/kg" value={state.doseMcgPerKg} onChange={(v) => onChange("doseMcgPerKg", v)} unit="mcg/kg" min={0.1} step={0.5} />
              <NumberInput label="Body Weight" value={state.bodyWeightKg} onChange={(v) => onChange("bodyWeightKg", v)} unit="kg" min={1} step={1} />
            </div>
          }
          <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider pt-1">Cost (Optional)</h3>
          <NumberInput label="Vial Price" value={vialPrice} onChange={setVialPrice} unit="$" min={0} step={1} />
        </div>
      </div>

      <div className="glass-strong rounded-2xl p-5 shadow-2xl space-y-4">
        <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider">Results</h3>
        {!valid ? (
          <div className="glass rounded-xl p-6 text-gray-400 text-center text-sm">Enter valid values above.</div>
        ) : (
          <>
            <div className="glass rounded-xl p-4 divide-y divide-white/5">
              <Row label="Concentration" value={`${conc.toFixed(1)} mcg/mL`} />
              <Row label="Effective Dose" value={`${dose.toFixed(1)} mcg`} />
              <Row label="Volume per Dose" value={`${vol.toFixed(4)} mL`} />
              <Row label="Syringe Draw (U-100)" value={`${units.toFixed(1)} units`} />
              <Row label="Doses per Vial" value={`~${Math.floor(doses)}`} />
              {costPerDose > 0 && (
                <>
                  <Row label="Cost per Dose" value={`$${costPerDose.toFixed(2)}`} />
                  <Row label="Est. Monthly Cost" value={`$${monthlyCost.toFixed(2)}`} />
                </>
              )}
            </div>

            <SyringeVisual units={units} />

            {TITRATIONS[state.peptide] && (
              <div className="glass rounded-xl p-4 space-y-2">
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Titration Schedule</h4>
                <p className="text-[10px] text-gray-300">Typical titration — {TITRATIONS[state.peptide].freq}</p>
                <div className="space-y-1">
                  {TITRATIONS[state.peptide].weeks.map((w, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-[10px] text-gray-400 w-16 shrink-0">Wk {w.week}</span>
                      <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${((i + 1) / TITRATIONS[state.peptide].weeks.length) * 100}%`, background: "linear-gradient(90deg,#7c3aed,#2563eb)" }}></div>
                      </div>
                      <span className="text-xs font-semibold text-gray-200 w-16 text-right">{w.dose}</span>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-yellow-400/80 mt-1">Titrate only under research protocol guidance. Individual responses vary.</p>
              </div>
            )}

            <div className="glass rounded-xl p-4 space-y-2">
              <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Step-by-Step</h4>
              <ol className="space-y-1.5">
                {instructions.map((s, i) => (
                  <li key={i} className="text-gray-300 text-xs flex gap-2">
                    <span className="num-highlight font-bold shrink-0">{i + 1}.</span><span>{s}</span>
                  </li>
                ))}
              </ol>
            </div>
            <div className="disclaimer-bar rounded-xl p-3">
              <p className="text-red-400/80 text-[10px] font-medium">Safety: Aseptic technique. Store at 2-8 °C. Use within recommended timeframe.</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={async () => { await copyToClipboard(fullText); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                className="glass hover:bg-white/10 text-gray-300 hover:text-white font-medium py-2.5 rounded-xl transition-all text-xs">
                {copied ? "\u2713 Copied!" : "Copy Instructions"}
              </button>
              <button onClick={async () => { const u = `${location.origin}/calculator#calc=${encodeState(state)}`; await copyToClipboard(u); setShareMsg("Link copied!"); setTimeout(() => setShareMsg(""), 2000); }}
                className="glass hover:bg-white/10 text-gray-300 hover:text-white font-medium py-2.5 rounded-xl transition-all text-xs">
                {shareMsg || "Share Calculation"}
              </button>
            </div>
          </>
        )}
      </div>
      <button onClick={reset} className="w-full glass hover:bg-white/10 text-gray-400 hover:text-gray-100 font-medium py-2.5 rounded-xl transition-all text-sm">Reset to Defaults</button>

      <UnitConverter />
    </div>
  );
}

// ── Compare Tab ──

function CompareTab() {
  const catalogKeys = Object.keys(CATALOG);
  const [selected, setSelected] = useState(["", "", ""]);
  const [compareSearch, setCompareSearch] = useState("");

  const updateSel = (idx: number, val: string) => setSelected(prev => { const n = [...prev]; n[idx] = val; return n; });
  const activeItems = selected.filter(s => s && CATALOG[s]);
  const filteredCompare = compareSearch ? catalogKeys.filter(k => (CATALOG[k].label || k).toLowerCase().includes(compareSearch.toLowerCase())) : catalogKeys;

  return (
    <div className="space-y-5 fade-in">
      <div className="text-center space-y-1">
        <h2 className="text-lg font-bold text-gray-100">Compare Peptides</h2>
        <p className="text-gray-300 text-xs">Select up to 3 peptides to compare side-by-side</p>
      </div>

      <div className="glass-strong rounded-2xl p-5 space-y-3">
        <input type="text" placeholder="Search peptides..." value={compareSearch}
          onChange={(e) => setCompareSearch(e.target.value)}
          className="w-full input-glass rounded-lg px-3 py-2 text-gray-100 text-sm placeholder-gray-400" />
        {[0, 1, 2].map(i => (
          <select key={i} value={selected[i]} onChange={(e) => updateSel(i, e.target.value)}
            className="w-full input-glass rounded-lg px-3 py-2.5 text-gray-100 text-sm appearance-none cursor-pointer">
            <option value="">{i === 0 ? "Select first peptide..." : i === 1 ? "Select second peptide..." : "Select third peptide (optional)..."}</option>
            {filteredCompare.map(k => <option key={k} value={k}>{CATALOG[k].label || k}</option>)}
          </select>
        ))}
      </div>

      {activeItems.length >= 2 && (
        <div className="space-y-3 fade-in">
          <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${activeItems.length}, 1fr)` }}>
            {activeItems.map(name => {
              const p = CATALOG[name];
              return (
                <div key={name} className="glass-strong rounded-xl p-3 text-center space-y-2">
                  <img src={p.img} alt="" className="w-12 h-12 mx-auto rounded object-contain bg-white/5" />
                  <p className="text-xs font-bold text-gray-100">{p.label || name}</p>
                  {p.blend && <span className="text-[9px] font-semibold uppercase px-2 py-0.5 rounded-full stack-badge text-purple-300 inline-block">Blend</span>}
                </div>
              );
            })}
          </div>

          {[
            { label: "Frequency", key: "freq" as const },
            { label: "Route", key: "route" as const },
            { label: "Description", key: "desc" as const },
            { label: "Notes", key: "notes" as const },
          ].map(row => (
            <div key={row.label} className="glass rounded-xl p-3 space-y-2">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{row.label}</p>
              <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${activeItems.length}, 1fr)` }}>
                {activeItems.map(name => (
                  <p key={name} className="text-xs text-gray-200 leading-relaxed">{CATALOG[name][row.key] || "\u2014"}</p>
                ))}
              </div>
            </div>
          ))}

          <div className="glass rounded-xl p-3 space-y-2">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Capsule Available</p>
            <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${activeItems.length}, 1fr)` }}>
              {activeItems.map(name => (
                <p key={name} className={`text-xs font-medium ${CATALOG[name].capsule ? "text-emerald-400" : "text-gray-500"}`}>
                  {CATALOG[name].capsule ? "Yes" : "No"}
                </p>
              ))}
            </div>
          </div>

          <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${activeItems.length}, 1fr)` }}>
            {activeItems.map(name => (
              <a key={name} href={aff(CATALOG[name].path)} target="_blank" rel="noopener noreferrer"
                className="block text-center shop-btn text-white text-xs font-semibold px-3 py-2.5 rounded-xl">
                Shop — 5% Off
              </a>
            ))}
          </div>
        </div>
      )}

      {activeItems.length < 2 && activeItems.length > 0 && (
        <div className="glass rounded-xl p-6 text-gray-400 text-center text-sm">Select at least 2 peptides to compare.</div>
      )}
    </div>
  );
}

// ── Main App ──

export default function App() {
  const initTab = typeof window !== 'undefined' && window.location.hash.startsWith("#calc=") ? "calculator" : typeof window !== 'undefined' && window.location.hash.startsWith("#find=") ? "finder" : "finder";
  const [tab, setTab] = useState(initTab);
  const [emailCaptured, setEmailCaptured] = useState(() => {
    try { return !!localStorage.getItem("peptide_hub_email"); } catch { return false; }
  });
  const [showExitIntent, setShowExitIntent] = useState(false);
  const exitShown = useRef(false);

  const handleEmailCaptured = (email: string) => {
    setEmailCaptured(true);
    exitShown.current = true;
  };

  useEffect(() => {
    if (emailCaptured) return;
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !exitShown.current) {
        exitShown.current = true;
        setShowExitIntent(true);
      }
    };
    document.addEventListener("mouseleave", handleMouseLeave);
    const timer = setTimeout(() => {
      if (!exitShown.current) {
        exitShown.current = true;
        setShowExitIntent(true);
      }
    }, 60000);
    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
      clearTimeout(timer);
    };
  }, [emailCaptured]);

  const TAB_TITLES: Record<string, string> = { finder: "Find Peptides", calculator: "Reconstitution Calculator", protocol: "Protocol Builder", compare: "Compare Peptides" };
  useEffect(() => {
    document.title = `${TAB_TITLES[tab] || "Peptide Research Hub"} \u2014 PepTalk Peptides`;
  }, [tab]);

  const [showSticky, setShowSticky] = useState(false);
  useEffect(() => {
    const onScroll = () => setShowSticky(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const TABS = [
    { id: "finder", label: "Find" },
    { id: "calculator", label: "Calculate" },
    { id: "protocol", label: "Protocol" },
    { id: "compare", label: "Compare" },
  ];

  return (
    <div className="max-w-lg mx-auto px-4 py-8 space-y-6">
      <ExitIntentModal show={showExitIntent} onClose={() => setShowExitIntent(false)} emailCaptured={emailCaptured} />

      <header className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold gradient-text tracking-tight">Peptide Research Hub</h1>
        <p className="text-gray-300 text-sm">Find the right peptides &middot; Calculate dosing &middot; 5% off</p>
        <div className="flex items-center justify-center gap-2 pt-1">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 pulse-dot"></span>
          <span className="text-gray-400 text-[11px]">Trusted by <span className="text-emerald-400 font-semibold">2,000+</span> researchers</span>
        </div>
      </header>

      <DisclaimerBanner />

      <div className="flex gap-1 glass rounded-xl p-1">
        {TABS.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${tab === t.id ? "pill-active text-white" : "text-gray-300 hover:text-white"}`}>
            {t.label}
          </button>
        ))}
      </div>

      <div key={tab} className="tab-content">
        {tab === "finder" && (
          <div className="glass-strong rounded-2xl p-5 shadow-2xl">
            <PeptideFinder emailCaptured={emailCaptured} onEmailSubmit={handleEmailCaptured} />
          </div>
        )}
        {tab === "calculator" && <CalcTab />}
        {tab === "protocol" && (
          <div className="glass-strong rounded-2xl p-5 shadow-2xl">
            <ProtocolBuilder emailCaptured={emailCaptured} onRequestEmail={() => setShowExitIntent(true)} />
          </div>
        )}
        {tab === "compare" && (
          <div className="glass-strong rounded-2xl p-5 shadow-2xl">
            <CompareTab />
          </div>
        )}
      </div>

      <a href={aff("")} target="_blank" rel="noopener noreferrer" className="block glass card-hover rounded-2xl p-5 text-center group">
        <p className="text-lg font-bold gradient-text group-hover:opacity-90 transition-opacity">Shop All Peptides</p>
        <p className="text-gray-300 text-xs mt-1">Peptide Restore &middot; Get 5% off your entire order</p>
      </a>

      <FAQSection />

      <DisclaimerBanner />
      <footer className="text-center text-gray-500 text-[10px] pb-16 space-y-1">
        <p>Research tool only. Verify all calculations independently.</p>
        <p>All peptides sold for research purposes only.</p>
        <p className="pt-1 text-gray-600">Last updated: February 2026</p>
      </footer>

      <div className={`sticky-bar ${showSticky ? "visible" : ""}`}>
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-semibold text-gray-200 truncate">5% off all peptides</p>
            <p className="text-[10px] text-gray-400">Code applied automatically</p>
          </div>
          <a href={aff("")} target="_blank" rel="noopener noreferrer"
            className="shrink-0 shop-btn text-white text-xs font-bold px-5 py-2.5 rounded-xl">
            Shop Now &rarr;
          </a>
        </div>
      </div>
    </div>
  );
}
