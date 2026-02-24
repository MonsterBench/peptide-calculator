import { useState } from 'preact/compat';

// ─── Types ────────────────────────────────────────────────────────────────────

interface InjectionSite {
  id: string;
  label: string;
  absorptionSpeed: 'fastest' | 'fast' | 'moderate';
  beginnerFriendly: boolean;
  bodyRegion: 'front' | 'back' | 'both';
  description: string;
  tips: string[];
  avoidIf: string[];
  frontHotspot?: { cx: number; cy: number; rx: number; ry: number };
  backHotspot?: { cx: number; cy: number; rx: number; ry: number };
}

interface TechniqueStep {
  icon: string;
  title: string;
  detail: string;
}

interface RotationEntry {
  siteId: string;
  timestamp: number;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const INJECTION_SITES: InjectionSite[] = [
  {
    id: 'abdomen',
    label: 'Abdomen',
    absorptionSpeed: 'fastest',
    beginnerFriendly: true,
    bodyRegion: 'front',
    description:
      'The peri-umbilical area (around the navel) is the most commonly used subcutaneous injection site. The subcutaneous fat layer here is typically generous and consistent, making it ideal for beginners.',
    tips: [
      'Stay at least 2 inches (5 cm) away from the navel in any direction',
      'Use a clock-face pattern to rotate — 12 sites around the navel',
      'Pinch a 1–2 inch skin fold to ensure you are injecting into fat, not muscle',
      'The love-handle region extending to the flanks is also valid and often less sensitive',
    ],
    avoidIf: [
      'Active abdominal scarring or recent surgery site',
      'Visible bruising from a recent injection at that spot',
    ],
    frontHotspot: { cx: 130, cy: 185, rx: 26, ry: 18 },
  },
  {
    id: 'upper-arm',
    label: 'Upper Outer Arms',
    absorptionSpeed: 'fast',
    beginnerFriendly: false,
    bodyRegion: 'both',
    description:
      'The lateral (outer) aspect of the upper arm, roughly halfway between the shoulder and elbow. Good absorption but requires a helper or wall-pinch technique for self-injection.',
    tips: [
      'Use the outer-posterior portion — avoid the deltoid muscle belly',
      'Let the arm hang relaxed; do not flex the muscle during injection',
      'A helper makes this site significantly easier to reach',
      'Alternate left and right arm with each injection',
    ],
    avoidIf: [
      'Very lean arms with minimal subcutaneous fat',
      'Injecting alone without a mirror or wall to brace against',
    ],
    frontHotspot: { cx: 66, cy: 132, rx: 12, ry: 16 },
    backHotspot: { cx: 194, cy: 132, rx: 12, ry: 16 },
  },
  {
    id: 'thigh',
    label: 'Anterior Thighs',
    absorptionSpeed: 'fast',
    beginnerFriendly: true,
    bodyRegion: 'front',
    description:
      'The anterior-lateral (front-outer) surface of the thigh, on the upper-to-middle third. Easy to visualize and self-administer while seated — a great beginner option.',
    tips: [
      'Target the outer third of the thigh, not the inner or posterior surface',
      'Sit with the muscle relaxed — do not inject into a tensed thigh',
      'The middle-upper third has the most predictable fat depth',
      'Alternate left and right thigh with each injection',
    ],
    avoidIf: [
      'Varicose veins visible at the target area',
      'Known lipodystrophy from prior overuse of this site',
    ],
    frontHotspot: { cx: 99, cy: 258, rx: 13, ry: 20 },
  },
  {
    id: 'buttocks',
    label: 'Buttocks / Upper Hip',
    absorptionSpeed: 'moderate',
    beginnerFriendly: false,
    bodyRegion: 'back',
    description:
      'The upper-outer quadrant of the buttock (ventrogluteal region) or the hip flank. Good for larger injection volumes. Slowest absorption — ideal for weekly peptides where sustained release is acceptable.',
    tips: [
      'Target the upper-outer quadrant only — avoid the inner buttock and sciatic nerve area',
      'The flank/love-handle extension is easier to self-inject without a helper',
      'Pinch firmly — this region typically has a thick fat layer',
      'Ideal for weekly injections (GLP-1 peptides like Semaglutide, Tirzepatide)',
    ],
    avoidIf: [
      'Cannot safely reach or visualize the target area',
      'Active skin irritation or lesions in the area',
    ],
    backHotspot: { cx: 100, cy: 248, rx: 20, ry: 16 },
  },
];

const BACK_SITES = INJECTION_SITES.filter(
  (s) => s.bodyRegion === 'back' || s.bodyRegion === 'both'
);
const FRONT_SITES = INJECTION_SITES.filter(
  (s) => s.bodyRegion === 'front' || s.bodyRegion === 'both'
);

const TECHNIQUE_STEPS: TechniqueStep[] = [
  {
    icon: '🧼',
    title: 'Wash hands',
    detail:
      'Wash thoroughly with soap and water for at least 20 seconds. Dry with a clean paper towel — not a cloth towel.',
  },
  {
    icon: '🧪',
    title: 'Prepare the syringe',
    detail:
      'Draw the calculated volume from your reconstituted vial using a fresh 29–31G insulin syringe. Tap and expel any air bubbles before withdrawing from the vial.',
  },
  {
    icon: '🧴',
    title: 'Swab & let dry',
    detail:
      'Wipe the injection site with an alcohol swab in a circular motion. Allow it to dry fully for 10–15 seconds — injecting through wet alcohol stings and introduces risk.',
  },
  {
    icon: '🤏',
    title: 'Pinch a skin fold',
    detail:
      'Use your non-dominant hand to pinch 1–2 inches of skin and fat firmly. This lifts the subcutaneous layer away from the muscle beneath.',
  },
  {
    icon: '💉',
    title: 'Insert at 90°',
    detail:
      'With a short 29–31G needle (4–8 mm), insert straight in at 90° in one smooth, confident motion. Very lean individuals may prefer 45° to avoid hitting muscle.',
  },
  {
    icon: '⏩',
    title: 'Depress slowly',
    detail:
      'Push the plunger steadily and slowly over 3–5 seconds. Rapid injection increases discomfort and tissue trauma — go slow.',
  },
  {
    icon: '⏱️',
    title: 'Wait 6 seconds',
    detail:
      'After fully depressing the plunger, hold the needle in place for 6 seconds before withdrawing. This prevents the solution from tracking back out through the needle tract.',
  },
  {
    icon: '↩️',
    title: 'Withdraw smoothly',
    detail:
      'Pull straight out in one smooth motion at the same angle you entered. Release the skin pinch immediately after the needle clears the skin.',
  },
  {
    icon: '🩹',
    title: 'Apply light pressure',
    detail:
      'Press gently with a dry cotton ball or gauze pad for 10–15 seconds. Do not rub — rubbing can cause bruising and spread the peptide unevenly.',
  },
  {
    icon: '🗑️',
    title: 'Dispose safely',
    detail:
      'Cap using the one-hand scoop method, then place immediately in a sharps container. Never reach over the open needle tip. Never share needles.',
  },
];

const ABSORPTION_META: Record<
  InjectionSite['absorptionSpeed'],
  { label: string; cssClass: string }
> = {
  fastest: { label: 'Fastest absorption', cssClass: 'badge-fastest' },
  fast: { label: 'Fast absorption', cssClass: 'badge-fast' },
  moderate: { label: 'Moderate absorption', cssClass: 'badge-moderate' },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function relativeTime(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 2) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return 'Yesterday';
  return `${days} days ago`;
}

function loadRotationLog(): RotationEntry[] {
  try {
    return JSON.parse(localStorage.getItem('injection_rotation') || '[]');
  } catch {
    return [];
  }
}

function saveRotationLog(log: RotationEntry[]): void {
  try {
    localStorage.setItem('injection_rotation', JSON.stringify(log.slice(-30)));
  } catch {
    // ignore
  }
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function BodySVG({
  showBack,
  selectedSite,
  onSelect,
}: {
  showBack: boolean;
  selectedSite: string | null;
  onSelect: (id: string) => void;
}) {
  const visibleSites = showBack ? BACK_SITES : FRONT_SITES;

  return (
    <svg
      viewBox="0 0 260 380"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Body diagram for injection site selection"
      style={{ width: '100%', maxWidth: 220, display: 'block', margin: '0 auto' }}
    >
      {/* ── Figure silhouette ── */}
      <g fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.18)" strokeWidth="1.2">
        {/* Head */}
        <ellipse cx="130" cy="38" rx="20" ry="24" />
        {/* Neck */}
        <rect x="123" y="60" width="14" height="14" rx="4" />
        {/* Torso — narrow waist, slight hip flare */}
        <path d="M92,74 Q76,84 74,108 Q72,132 102,152 Q98,176 100,204 L160,204 Q162,176 158,152 Q188,132 186,108 Q184,84 168,74 Z" />
        {/* Left arm */}
        <path d="M92,74 Q74,86 68,108 L60,162 Q66,166 72,164 L78,112 Q82,96 92,82 Z" />
        {/* Right arm */}
        <path d="M168,74 Q186,86 192,108 L200,162 Q194,166 188,164 L182,112 Q178,96 168,82 Z" />
        {/* Left thigh + lower leg */}
        <path d="M100,204 L91,290 Q91,296 103,297 L108,204 Z" />
        <path d="M91,290 Q91,336 97,350 Q103,356 107,351 Q109,336 103,297 Q97,296 91,290 Z" />
        {/* Right thigh + lower leg */}
        <path d="M160,204 L169,290 Q169,296 157,297 L152,204 Z" />
        <path d="M169,290 Q169,336 163,350 Q157,356 153,351 Q151,336 157,297 Q163,296 169,290 Z" />
        {/* Left foot */}
        <ellipse cx="99" cy="358" rx="11" ry="5" />
        {/* Right foot */}
        <ellipse cx="161" cy="358" rx="11" ry="5" />
      </g>

      {/* ── Belly button (front only) ── */}
      {!showBack && (
        <circle cx="130" cy="175" r="3" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.2)" strokeWidth="0.8" />
      )}

      {/* ── Injection site hotspots ── */}
      {visibleSites.map((site) => {
        const spot = showBack ? site.backHotspot : site.frontHotspot;
        if (!spot) return null;
        const isActive = selectedSite === site.id;
        return (
          <ellipse
            key={`${site.id}-${showBack ? 'back' : 'front'}`}
            cx={spot.cx}
            cy={spot.cy}
            rx={spot.rx}
            ry={spot.ry}
            className={`hotspot-zone${isActive ? ' active' : ''}`}
            fill={
              isActive
                ? 'rgba(139,92,246,0.45)'
                : 'rgba(139,92,246,0.15)'
            }
            stroke={
              isActive
                ? '#a78bfa'
                : 'rgba(139,92,246,0.5)'
            }
            strokeWidth={isActive ? 2 : 1.5}
            strokeDasharray={isActive ? undefined : '4,3'}
            style={
              isActive
                ? { filter: 'drop-shadow(0 0 6px rgba(139,92,246,0.7))' }
                : undefined
            }
            role="button"
            aria-label={site.label}
            tabIndex={0}
            onClick={() => onSelect(site.id)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') onSelect(site.id);
            }}
          />
        );
      })}

      {/* ── Back-view spine indicator ── */}
      {showBack && (
        <line
          x1="130" y1="80" x2="130" y2="200"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="1.5"
          strokeDasharray="3,4"
        />
      )}
    </svg>
  );
}

function SiteInfoCard({
  site,
  onLog,
}: {
  site: InjectionSite;
  onLog: () => void;
}) {
  const meta = ABSORPTION_META[site.absorptionSpeed];
  return (
    <div className="glass rounded-xl p-4 mt-4 fade-in space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="gradient-text text-base font-bold">{site.label}</h3>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${meta.cssClass}`}>
          {meta.label}
        </span>
        {site.beginnerFriendly && (
          <span className="text-xs px-2 py-0.5 rounded-full font-medium"
            style={{ background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.3)', color: '#34d399' }}>
            ✓ Beginner-friendly
          </span>
        )}
      </div>

      <p className="text-gray-300 text-xs leading-relaxed">{site.description}</p>

      <div>
        <p className="text-gray-400 text-[11px] font-semibold uppercase tracking-wider mb-1.5">Tips</p>
        <ul className="space-y-1">
          {site.tips.map((tip, i) => (
            <li key={i} className="flex gap-2 text-xs text-gray-300 leading-relaxed">
              <span className="text-emerald-400 mt-0.5 flex-shrink-0">✓</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>

      {site.avoidIf.length > 0 && (
        <div>
          <p className="text-gray-400 text-[11px] font-semibold uppercase tracking-wider mb-1.5">Avoid if</p>
          <ul className="space-y-1">
            {site.avoidIf.map((note, i) => (
              <li key={i} className="flex gap-2 text-xs text-red-300/80 leading-relaxed">
                <span className="flex-shrink-0">⚠</span>
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
        onClick={onLog}
        className="pill-active text-white text-xs font-semibold px-4 py-2 rounded-lg w-full mt-1"
      >
        Log this site →
      </button>
    </div>
  );
}

function TechniqueSection() {
  return (
    <div className="glass-strong rounded-2xl p-5 shadow-2xl space-y-4">
      <div>
        <h2 className="gradient-text text-lg font-bold">Injection Technique</h2>
        <p className="text-gray-400 text-xs mt-1">
          Follow these steps in order for every subcutaneous injection. Use a fresh 29–31G insulin syringe (4–8 mm needle length).
        </p>
      </div>

      <div className="space-y-2">
        {TECHNIQUE_STEPS.map((step, i) => (
          <div key={i} className="glass rounded-xl p-3 flex gap-3 items-start">
            <div
              className="flex-shrink-0 flex items-center justify-center rounded-full text-white text-[11px] font-bold pill-active"
              style={{ width: 24, height: 24, minWidth: 24 }}
            >
              {i + 1}
            </div>
            <div className="flex gap-2 items-start flex-1 min-w-0">
              <span className="text-base flex-shrink-0">{step.icon}</span>
              <div>
                <p className="text-gray-100 text-sm font-semibold leading-tight">{step.title}</p>
                <p className="text-gray-400 text-xs leading-relaxed mt-0.5">{step.detail}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <p className="text-red-400/80 text-[11px] leading-relaxed pt-1 border-t border-red-400/10">
        ⚠ For educational and informational purposes only. Consult a licensed healthcare provider before performing any injections.
      </p>
    </div>
  );
}

function RotationSection({
  rotationLog,
  onLog,
  onClear,
}: {
  rotationLog: RotationEntry[];
  onLog: (siteId: string) => void;
  onClear: () => void;
}) {
  const lastFive = [...rotationLog].reverse().slice(0, 5);

  return (
    <div className="glass-strong rounded-2xl p-5 shadow-2xl space-y-4">
      <div>
        <h2 className="gradient-text text-lg font-bold">Why Rotation Matters</h2>
        <p className="text-gray-400 text-xs mt-1 leading-relaxed">
          Repeatedly injecting the same spot causes <span className="text-gray-200 font-medium">lipodystrophy</span> — a hardening or indentation of the subcutaneous fat tissue. This impairs absorption and can cause lumpy, uneven results over time.
        </p>
        <p className="text-gray-400 text-xs mt-2 leading-relaxed">
          Rotating between all four sites (and different spots within each site) keeps tissue healthy and ensures consistent absorption every injection.
        </p>
      </div>

      <div>
        <p className="text-gray-400 text-[11px] font-semibold uppercase tracking-wider mb-2">Log injection site</p>
        <div className="grid grid-cols-2 gap-2">
          {INJECTION_SITES.map((site) => (
            <button
              key={site.id}
              onClick={() => onLog(site.id)}
              className="pill-track text-gray-200 hover:text-white text-xs font-medium py-2.5 px-3 rounded-lg transition-all text-left"
            >
              <span className="block text-gray-100 font-semibold text-[11px] leading-tight">{site.label}</span>
              <span className={`text-[10px] ${ABSORPTION_META[site.absorptionSpeed].cssClass} bg-transparent border-0 p-0`}>
                {ABSORPTION_META[site.absorptionSpeed].label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {lastFive.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-400 text-[11px] font-semibold uppercase tracking-wider">Recent log</p>
            <button
              onClick={onClear}
              className="text-[11px] text-gray-500 hover:text-red-400 transition-colors"
            >
              Clear log
            </button>
          </div>
          <div className="space-y-1.5">
            {lastFive.map((entry, i) => {
              const site = INJECTION_SITES.find((s) => s.id === entry.siteId);
              return (
                <div key={i} className="glass rounded-lg px-3 py-2 flex items-center justify-between">
                  <span className="text-gray-200 text-xs font-medium">{site?.label ?? entry.siteId}</span>
                  <span className="text-gray-500 text-[11px]">{relativeTime(entry.timestamp)}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {lastFive.length === 0 && (
        <p className="text-gray-600 text-xs text-center py-2">
          No entries yet — log your first injection site above.
        </p>
      )}
    </div>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────

export default function InjectionGuide() {
  const [selectedSite, setSelectedSite] = useState<string | null>(null);
  const [showBack, setShowBack] = useState(false);
  const [rotationLog, setRotationLog] = useState<RotationEntry[]>(loadRotationLog);
  const [logToast, setLogToast] = useState<string | null>(null);

  function handleSelectSite(id: string) {
    setSelectedSite((prev) => (prev === id ? null : id));
    // switch view if the site is only visible on the other side
    const site = INJECTION_SITES.find((s) => s.id === id);
    if (site?.bodyRegion === 'back' && !showBack) setShowBack(true);
    if (site?.bodyRegion === 'front' && showBack) setShowBack(false);
  }

  function handleLogSite(siteId: string) {
    const entry: RotationEntry = { siteId, timestamp: Date.now() };
    const next = [...rotationLog, entry];
    setRotationLog(next);
    saveRotationLog(next);
    const site = INJECTION_SITES.find((s) => s.id === siteId);
    setLogToast(`Logged: ${site?.label ?? siteId}`);
    setTimeout(() => setLogToast(null), 2500);
  }

  function handleClear() {
    setRotationLog([]);
    try { localStorage.removeItem('injection_rotation'); } catch { /* ignore */ }
  }

  const activeSite = INJECTION_SITES.find((s) => s.id === selectedSite) ?? null;

  return (
    <div className="space-y-5">
      {/* Toast */}
      {logToast && (
        <div
          className="fixed top-4 right-4 z-50 glass-strong rounded-xl px-4 py-2.5 text-xs text-emerald-400 font-semibold fade-in shadow-xl"
          style={{ pointerEvents: 'none' }}
        >
          ✓ {logToast}
        </div>
      )}

      {/* Section header */}
      <div>
        <h2 className="gradient-text text-xl font-bold">Injection Site Guide</h2>
        <p className="text-gray-400 text-xs mt-1">
          Learn where to inject, how to rotate sites, and proper subcutaneous technique.
        </p>
      </div>

      {/* ── Body Diagram Section ── */}
      <div className="glass-strong rounded-2xl p-5 shadow-2xl space-y-4">
        <div>
          <h3 className="text-gray-100 text-base font-bold">Injection Sites</h3>
          <p className="text-gray-400 text-xs mt-0.5">
            Tap a highlighted zone to learn about that site.
          </p>
        </div>

        {/* Front / Back toggle */}
        <div className="flex gap-1 glass rounded-xl p-1 max-w-xs mx-auto">
          <button
            onClick={() => setShowBack(false)}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${!showBack ? 'pill-active text-white' : 'pill-track text-gray-200 hover:text-white'}`}
          >
            Front view
          </button>
          <button
            onClick={() => setShowBack(true)}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${showBack ? 'pill-active text-white' : 'pill-track text-gray-200 hover:text-white'}`}
          >
            Back view
          </button>
        </div>

        {/* SVG diagram */}
        <BodySVG
          showBack={showBack}
          selectedSite={selectedSite}
          onSelect={handleSelectSite}
        />

        {/* Site legend dots */}
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5 text-[11px]">
          {(showBack ? BACK_SITES : FRONT_SITES).map((site) => (
            <button
              key={site.id}
              onClick={() => handleSelectSite(site.id)}
              className={`flex items-center gap-1.5 transition-colors ${selectedSite === site.id ? 'text-purple-300' : 'text-gray-400 hover:text-gray-200'}`}
            >
              <span
                className="inline-block rounded-full"
                style={{
                  width: 8,
                  height: 8,
                  background: selectedSite === site.id
                    ? 'rgba(139,92,246,0.9)'
                    : 'rgba(139,92,246,0.4)',
                }}
              />
              {site.label}
            </button>
          ))}
        </div>

        {/* Absorption comparison */}
        <div className="glass rounded-xl p-3">
          <p className="text-gray-400 text-[11px] font-semibold uppercase tracking-wider mb-2">Absorption speed comparison</p>
          <div className="space-y-1.5">
            {INJECTION_SITES.map((site) => (
              <div key={site.id} className="flex items-center justify-between text-xs">
                <span className="text-gray-300">{site.label}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${ABSORPTION_META[site.absorptionSpeed].cssClass}`}>
                  {ABSORPTION_META[site.absorptionSpeed].label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Site info card */}
        {activeSite && (
          <SiteInfoCard
            site={activeSite}
            onLog={() => handleLogSite(activeSite.id)}
          />
        )}
      </div>

      {/* ── Technique Section ── */}
      <TechniqueSection />

      {/* ── Rotation Tracker Section ── */}
      <RotationSection
        rotationLog={rotationLog}
        onLog={handleLogSite}
        onClear={handleClear}
      />
    </div>
  );
}
