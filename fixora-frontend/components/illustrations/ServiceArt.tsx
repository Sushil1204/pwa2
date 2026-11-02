import type { IllustrationKey } from "@/lib/types";

/**
 * Authored brand illustrations — no stock photography available yet.
 * Flat editorial scenes in DESIGN.md palette (ink, lime, sage,
 * peach, cyan). Replace with commissioned photography when real
 * assets arrive; keep aspect behaviour identical.
 */

const INK = "#0e0f0c";
const PRIMARY = "#9fe870";
const PALE = "#e2f6d5";
const SAGE = "#e8ebe6";
const CANVAS = "#ffffff";
const PEACH = "#ffc091";
const CYAN = "#38c8ff";

/* Hero scene — palette pinned by the approved hero direction */
const HERO_SAGE = "#e3ebd9";
const HERO_INK = "#1a211b";
const GLASS = "#cddbe3";
const GLASS_HIGHLIGHT = "#f2f7f9";
const SOFA_BACK = "#bcd6a8";
const SOFA_BODY = "#f7f5ee";
const CUSHION_GREEN = "#9ed9a0";
const POT_TERRACOTTA = "#c8734f";
const LEAF_GREEN = "#2c6b3f";

type SceneProps = { className?: string };

function Frame({
  children,
  bg = SAGE,
  className,
  fit = "xMidYMid slice",
}: {
  children: React.ReactNode;
  bg?: string;
  className?: string;
  fit?: string;
}) {
  return (
    <svg
      viewBox="0 0 320 200"
      preserveAspectRatio={fit}
      role="img"
      aria-hidden
      className={className}
    >
      <rect width="320" height="200" fill={bg} />
      {children}
    </svg>
  );
}

function Plumbing({ className }: SceneProps) {
  return (
    <Frame bg={PALE} className={className}>
      <rect x="0" y="150" width="320" height="50" fill={SAGE} />
      {/* pipe run */}
      <path
        d="M40 60 H150 a24 24 0 0 1 24 24 V150"
        fill="none"
        stroke={INK}
        strokeWidth="14"
        strokeLinecap="round"
      />
      <path
        d="M40 60 H150 a24 24 0 0 1 24 24 V150"
        fill="none"
        stroke={CANVAS}
        strokeWidth="6"
        strokeLinecap="round"
      />
      {/* joint collar */}
      <rect x="156" y="96" width="30" height="16" rx="4" fill={INK} />
      {/* drop */}
      <path d="M171 128 c10 14 10 22 0 22 s-10-8 0-22z" fill={CYAN} />
      {/* wrench */}
      <g transform="rotate(-28 236 96)">
        <rect x="226" y="40" width="18" height="90" rx="9" fill={INK} />
        <path
          d="M226 40 a18 18 0 1 1 18 -18 l-9 9 -9 -9 z"
          fill={INK}
        />
        <circle cx="235" cy="118" r="7" fill={PRIMARY} />
      </g>
      <circle cx="70" cy="40" r="8" fill={PRIMARY} />
    </Frame>
  );
}

function Electrical({ className }: SceneProps) {
  return (
    <Frame bg={SAGE} className={className}>
      <rect x="0" y="150" width="320" height="50" fill={PALE} />
      {/* wall plate */}
      <rect x="56" y="44" width="120" height="120" rx="16" fill={CANVAS} stroke={INK} strokeWidth="5" />
      <rect x="84" y="76" width="18" height="34" rx="9" fill={INK} />
      <rect x="130" y="76" width="18" height="34" rx="9" fill={INK} />
      <rect x="84" y="126" width="64" height="12" rx="6" fill={SAGE} />
      {/* bolt */}
      <path d="M236 34 l-34 62 h24 l-14 60 46-74 h-26 z" fill={PRIMARY} stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      {/* cable */}
      <path d="M176 140 c40 6 56 -10 70 -34" fill="none" stroke={INK} strokeWidth="8" strokeLinecap="round" />
      <circle cx="70" cy="40" r="7" fill={PEACH} />
    </Frame>
  );
}

function Appliances({ className }: SceneProps) {
  return (
    <Frame bg={SAGE} className={className}>
      <rect x="0" y="158" width="320" height="42" fill={PALE} />
      {/* fridge */}
      <rect x="44" y="30" width="94" height="130" rx="14" fill={CANVAS} stroke={INK} strokeWidth="5" />
      <line x1="44" y1="88" x2="138" y2="88" stroke={INK} strokeWidth="5" />
      <rect x="118" y="52" width="8" height="24" rx="4" fill={INK} />
      <rect x="118" y="102" width="8" height="34" rx="4" fill={INK} />
      {/* washer */}
      <rect x="168" y="64" width="110" height="96" rx="14" fill={PRIMARY} stroke={INK} strokeWidth="5" />
      <circle cx="223" cy="118" r="30" fill={CANVAS} stroke={INK} strokeWidth="5" />
      <path d="M203 118 a20 20 0 0 1 40 0" fill="none" stroke={CYAN} strokeWidth="6" strokeLinecap="round" />
      <circle cx="186" cy="82" r="6" fill={INK} />
      <rect x="204" y="76" width="44" height="10" rx="5" fill={INK} />
      <circle cx="70" cy="46" r="7" fill={PEACH} />
    </Frame>
  );
}

function Ac({ className }: SceneProps) {
  return (
    <Frame bg={PALE} className={className}>
      <rect x="0" y="150" width="320" height="50" fill={SAGE} />
      {/* unit */}
      <rect x="52" y="36" width="216" height="74" rx="18" fill={CANVAS} stroke={INK} strokeWidth="5" />
      <rect x="70" y="88" width="180" height="10" rx="5" fill={SAGE} />
      <circle cx="92" cy="58" r="7" fill={PRIMARY} />
      <rect x="114" y="52" width="90" height="12" rx="6" fill={INK} opacity="0.85" />
      {/* airflow */}
      <path d="M84 132 c18 -14 36 14 54 0 s36 14 54 0 s36 14 54 0" fill="none" stroke={CYAN} strokeWidth="7" strokeLinecap="round" />
      <path d="M100 162 c18 -14 36 14 54 0 s36 14 54 0" fill="none" stroke={CYAN} strokeWidth="7" strokeLinecap="round" opacity="0.55" />
      {/* snowflake */}
      <g stroke={INK} strokeWidth="4" strokeLinecap="round">
        <line x1="264" y1="140" x2="264" y2="172" />
        <line x1="250" y1="148" x2="278" y2="164" />
        <line x1="278" y1="148" x2="250" y2="164" />
      </g>
    </Frame>
  );
}

function Cleaning({ className }: SceneProps) {
  return (
    <Frame bg={SAGE} className={className}>
      <rect x="0" y="154" width="320" height="46" fill={PALE} />
      {/* bottle */}
      <rect x="70" y="70" width="74" height="90" rx="14" fill={PRIMARY} stroke={INK} strokeWidth="5" />
      <rect x="88" y="44" width="38" height="30" rx="6" fill={INK} />
      <path d="M126 52 h34 l14 14 h-48 z" fill={INK} />
      <rect x="84" y="104" width="46" height="30" rx="6" fill={CANVAS} />
      <path d="M92 119 h30" stroke={INK} strokeWidth="5" strokeLinecap="round" />
      {/* spray */}
      <path d="M176 70 c12 -8 22 -8 34 -2" fill="none" stroke={CYAN} strokeWidth="5" strokeLinecap="round" />
      <circle cx="224" cy="58" r="9" fill={CYAN} />
      <circle cx="248" cy="80" r="13" fill={CANVAS} stroke={INK} strokeWidth="4" />
      <circle cx="276" cy="52" r="8" fill={PEACH} />
      <circle cx="236" cy="120" r="16" fill={CANVAS} stroke={INK} strokeWidth="4" />
      <path d="M268 140 l8 -14 8 14 14 8 -14 8 -8 14 -8 -14 -14 -8 z" fill={PRIMARY} stroke={INK} strokeWidth="3" strokeLinejoin="round" />
    </Frame>
  );
}

function Painting({ className }: SceneProps) {
  return (
    <Frame bg={PALE} className={className}>
      <rect x="0" y="150" width="320" height="50" fill={SAGE} />
      {/* wall stripe */}
      <rect x="40" y="34" width="240" height="116" rx="10" fill={CANVAS} stroke={INK} strokeWidth="5" />
      <path d="M45 90 h230 v55 h-230 z" fill={PRIMARY} />
      {/* roller */}
      <rect x="128" y="52" width="96" height="40" rx="8" fill={INK} />
      <rect x="134" y="58" width="84" height="28" rx="5" fill={PEACH} />
      <path d="M176 92 v28 h-8" fill="none" stroke={INK} strokeWidth="7" strokeLinecap="round" />
      <rect x="150" y="118" width="44" height="34" rx="8" fill={INK} />
      {/* bucket */}
      <path d="M56 118 h56 l-8 40 h-40 z" fill={CYAN} stroke={INK} strokeWidth="5" strokeLinejoin="round" />
      <rect x="50" y="110" width="68" height="14" rx="7" fill={INK} />
    </Frame>
  );
}

function Hero({ className }: SceneProps) {
  return (
    <Frame bg={HERO_SAGE} className={className} fit="xMidYMid meet">
      {/* window — upper right, four panes with glass reflection */}
      <rect x="196" y="10" width="104" height="80" rx="8" fill={GLASS} />
      <g
        stroke={GLASS_HIGHLIGHT}
        strokeWidth="7"
        strokeLinecap="round"
        opacity="0.8"
      >
        <line x1="206" y1="42" x2="236" y2="18" />
        <line x1="258" y1="42" x2="288" y2="18" />
        <line x1="206" y1="82" x2="236" y2="58" />
        <line x1="258" y1="82" x2="288" y2="58" />
      </g>
      <rect
        x="196"
        y="10"
        width="104"
        height="80"
        rx="8"
        fill="none"
        stroke={HERO_INK}
        strokeWidth="6"
      />
      <line x1="248" y1="10" x2="248" y2="90" stroke={HERO_INK} strokeWidth="6" />
      <line x1="196" y1="50" x2="300" y2="50" stroke={HERO_INK} strokeWidth="6" />

      {/* sofa — lower left */}
      <rect
        x="24"
        y="86"
        width="158"
        height="54"
        rx="16"
        fill={SOFA_BACK}
        stroke={HERO_INK}
        strokeWidth="6"
      />
      <rect
        x="16"
        y="132"
        width="176"
        height="42"
        rx="14"
        fill={SOFA_BODY}
        stroke={HERO_INK}
        strokeWidth="6"
      />
      <rect
        x="34"
        y="112"
        width="72"
        height="36"
        rx="10"
        fill={CUSHION_GREEN}
        stroke={HERO_INK}
        strokeWidth="5"
      />
      <rect
        x="112"
        y="112"
        width="72"
        height="36"
        rx="10"
        fill={PEACH}
        stroke={HERO_INK}
        strokeWidth="5"
      />
      <rect x="32" y="172" width="13" height="14" rx="4" fill={HERO_INK} />
      <rect x="162" y="172" width="13" height="14" rx="4" fill={HERO_INK} />

      {/* potted plant — lower right */}
      <path
        d="M269 140 C254 133 245 122 247 110 C261 117 271 128 269 140 Z"
        fill={LEAF_GREEN}
        stroke={HERO_INK}
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path
        d="M269 140 C262 124 266 110 275 102 C284 116 280 132 269 140 Z"
        fill={LEAF_GREEN}
        stroke={HERO_INK}
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path
        d="M269 140 C283 134 296 126 304 114 C291 108 276 120 269 140 Z"
        fill={LEAF_GREEN}
        stroke={HERO_INK}
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path
        d="M246 138 H296 L289 176 H253 Z"
        fill={POT_TERRACOTTA}
        stroke={HERO_INK}
        strokeWidth="6"
        strokeLinejoin="round"
      />
      <rect
        x="242"
        y="130"
        width="58"
        height="14"
        rx="5"
        fill={POT_TERRACOTTA}
        stroke={HERO_INK}
        strokeWidth="6"
      />
    </Frame>
  );
}

const scenes: Record<IllustrationKey, (props: SceneProps) => React.JSX.Element> = {
  plumbing: Plumbing,
  electrical: Electrical,
  appliances: Appliances,
  ac: Ac,
  cleaning: Cleaning,
  painting: Painting,
  hero: Hero,
};

export function ServiceArt({
  variant,
  className = "",
}: {
  variant: IllustrationKey;
  className?: string;
}) {
  const Scene = scenes[variant] ?? Plumbing;
  return <Scene className={className} />;
}

export function CategoryGlyph({ variant }: { variant: IllustrationKey }) {
  return <ServiceArt variant={variant} className="h-full w-full" />;
}
