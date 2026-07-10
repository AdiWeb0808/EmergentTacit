import { useEffect, useRef, useState } from "react";

/**
 * SourcesBrain — 6 floating icon artifacts flowing into a robotic brain.
 * Icons idle-float; on scroll into view, brass tubes fill with amber, packets travel,
 * brain lobes light up in sequence, ONLINE flips, caption reveals.
 * Respects prefers-reduced-motion.
 */
export default function SourcesBrain() {
  const rootRef = useRef(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      setActive(true);
      return;
    }
    if (!rootRef.current) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setActive(true);
            io.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );
    io.observe(rootRef.current);
    return () => io.disconnect();
  }, []);

  // 6 sources with irregular positions. Ports stack from the chassis base upward for visual grounding.
  const brainX = 560;
  const sources = [
    { key: "code",   label: "CODE",     x: 55,  y: 45,  port: 200, delay: 0,   floatDur: 3.4, floatDelay: 0 },
    { key: "wiki",   label: "WIKI",     x: 235, y: 25,  port: 225, delay: 140, floatDur: 4.2, floatDelay: 0.6 },
    { key: "chat",   label: "CHAT",     x: 90,  y: 145, port: 250, delay: 280, floatDur: 3.8, floatDelay: 1.1 },
    { key: "schema", label: "SCHEMA",   x: 250, y: 175, port: 275, delay: 420, floatDur: 3.2, floatDelay: 0.3 },
    { key: "pdf",    label: "PDF",      x: 65,  y: 290, port: 300, delay: 560, floatDur: 4.0, floatDelay: 0.9 },
    { key: "drive",  label: "DRIVE",    x: 245, y: 315, port: 325, delay: 700, floatDur: 3.6, floatDelay: 0.2 },
  ];

  return (
    <div ref={rootRef} className={`sb-root ${active ? "is-active" : ""}`}>
      <p className="lead-tiny sb-eyebrow">NOT JUST CHAT — LIVE PIPELINE</p>

      <div className="sb-stage">
        <svg viewBox="0 0 900 460" className="sb-svg" role="img" aria-label="Six knowledge sources flowing into a central robotic brain">
          <defs>
            <radialGradient id="sb-brain-glow" cx="50%" cy="50%" r="55%">
              <stop offset="0%" stopColor="#FFB300" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#FFB300" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="sb-chassis" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3a3428" />
              <stop offset="100%" stopColor="#1a1710" />
            </linearGradient>
          </defs>

          {/* Tubes — drawn FIRST so icons render on top */}
          {sources.map((s) => {
            const startX = s.x + 55;   // right edge of the icon glyph
            const startY = s.y + 26;
            const endX = brainX + 4;
            const endY = s.port;
            // Vary curvature — different control points per source
            const midX = startX + (endX - startX) * 0.55;
            const c1 = { x: startX + 40 + (s.delay % 30), y: startY };
            const c2 = { x: midX + 20,                    y: endY };
            const d = `M ${startX} ${startY} C ${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${endX} ${endY}`;
            return (
              <g key={`pipe-${s.key}`} className="sb-pipe-group">
                <path d={d} className="sb-pipe-base" />
                <path d={d} className="sb-pipe-fill" style={{ transitionDelay: `${s.delay}ms` }} />
                <circle
                  r="4.5"
                  className="sb-packet"
                  style={{
                    animationDelay: `${s.delay}ms`,
                    offsetPath: `path('${d}')`,
                    WebkitOffsetPath: `path('${d}')`,
                  }}
                />
              </g>
            );
          })}

          {/* Floating source icons */}
          {sources.map((s) => {
            // WIKI sits at the top, so put its label ABOVE the icon to avoid crossing its own tube.
            const labelY = s.key === "wiki" ? -4 : 58;
            return (
              <g key={s.key} transform={`translate(${s.x}, ${s.y})`}>
                <g
                  className={`sb-source sb-src-${s.key}`}
                  style={{
                    animationDuration: `${s.floatDur}s`,
                    animationDelay: `${s.floatDelay}s`,
                    ["--send-delay"]: `${s.delay}ms`,
                  }}
                >
                  <SourceGlyph type={s.key} />
                  <text x="30" y={labelY} className="sb-label" textAnchor="middle">
                    {s.label}
                  </text>
                </g>
              </g>
            );
          })}

          {/* Robotic brain / mainframe — UNCHANGED bulb */}
          <g transform={`translate(${brainX}, 60)`} className="sb-brain">
            <ellipse cx="150" cy="150" rx="170" ry="130" fill="url(#sb-brain-glow)" />

            {/* Chassis base */}
            <rect x="20" y="220" width="290" height="80" rx="6" fill="url(#sb-chassis)" stroke="#5a4d38" strokeWidth="2" />
            <rect x="35" y="240" width="60" height="42" rx="3" fill="#0f0d09" stroke="#B27D00" strokeWidth="1" />
            <circle cx="115" cy="261" r="6" fill="#0f0d09" stroke="#B27D00" strokeWidth="1" />
            <circle cx="115" cy="261" r="2" fill="#FFB300" className="sb-blink" />
            <circle cx="135" cy="261" r="6" fill="#0f0d09" stroke="#B27D00" strokeWidth="1" />
            <circle cx="135" cy="261" r="2" fill="#B27D00" />
            {[0, 1, 2, 3, 4, 5, 6].map((i) => (
              <line key={i} x1={160} x2={290} y1={244 + i * 7} y2={244 + i * 7} stroke="#2A2013" strokeWidth="1.2" />
            ))}

            {/* Six intake ports on the left side of the chassis */}
            {[200, 225, 250, 275, 300, 325].map((py, i) => {
              const localY = py - 60; // translate context is at (brainX, 60)
              return (
                <g key={i}>
                  <rect x="-6" y={localY - 8} width="18" height="16" rx="2" fill="#2A2013" stroke="#B27D00" strokeWidth="1.1" />
                  <circle cx="3" cy={localY} r="3.5" fill="#0f0d09" stroke="#FFB300" strokeWidth="1" />
                </g>
              );
            })}

            {/* Dome */}
            <path d="M 20 220 L 20 130 Q 20 40 150 40 Q 280 40 280 130 L 280 220 Z" fill="url(#sb-chassis)" stroke="#5a4d38" strokeWidth="2" />

            {/* 4 amber-lit brain lobes */}
            <path d="M 60 80 Q 90 55 130 65 Q 145 80 130 105 Q 100 120 70 110 Q 55 95 60 80 Z" className="sb-lobe sb-lobe-1" />
            <path d="M 160 60 Q 200 55 230 75 Q 245 100 225 120 Q 190 130 165 115 Q 150 90 160 60 Z" className="sb-lobe sb-lobe-2" />
            <path d="M 60 130 Q 90 125 125 140 Q 140 165 120 190 Q 85 200 60 180 Q 45 155 60 130 Z" className="sb-lobe sb-lobe-3" />
            <path d="M 160 140 Q 200 135 230 150 Q 245 175 225 195 Q 190 205 160 190 Q 145 170 160 140 Z" className="sb-lobe sb-lobe-4" />

            {/* Circuit traces (kept dim + subtle, no vertical divider) */}
            <g className="sb-traces" stroke="#FFB300" strokeWidth="1" fill="none" opacity="0.55">
              <path d="M 70 90 L 100 90 L 100 110 L 130 110" />
              <path d="M 180 70 L 210 90 L 200 110" />
              <path d="M 75 150 L 105 165 L 130 165" />
              <path d="M 175 155 L 210 170 L 220 180" />
            </g>

            {/* ONLINE indicator */}
            <g transform="translate(210, 250)" className="sb-online">
              <circle cx="0" cy="0" r="5" className="sb-online-dot" />
              <text x="10" y="4" fill="#B27D00" fontFamily="'VT323', monospace" fontSize="14" className="sb-online-text">ONLINE</text>
            </g>
          </g>
        </svg>
      </div>

      <p className="sales-point sb-caption">
        <span className="hl">One comprehensive knowledge layer.</span>
      </p>
      <p className="sub-note">
        A zero-hallucination system builds specialist agents directly on top of it.
      </p>
    </div>
  );
}

/* --------------------------- ICON GLYPHS --------------------------- */
function SourceGlyph({ type }) {
  switch (type) {
    case "code":   return <CodeGlyph />;
    case "chat":   return <ChatGlyph />;
    case "schema": return <SchemaGlyph />;
    case "pdf":    return <PdfGlyph />;
    case "drive":  return <DriveGlyph />;
    case "wiki":   return <WikiGlyph />;
    default:       return null;
  }
}

const G_STROKE = "#B27D00";
const G_STROKE_HOT = "#FFB300";
const G_DARK = "#0f0d09";

function CodeGlyph() {
  // A tiny terminal window with a clear ">_" prompt and { } brackets — unmistakably code
  return (
    <g className="sb-glyph">
      <rect x="0" y="0" width="60" height="46" rx="4" fill={G_DARK} stroke={G_STROKE} strokeWidth="1.2" />
      <circle cx="7" cy="7" r="1.6" fill="#7A3324" />
      <circle cx="13" cy="7" r="1.6" fill="#B27D00" />
      <circle cx="19" cy="7" r="1.6" fill="#3a3428" />
      {/* Prompt: ">" then blinking underscore look */}
      <text x="5"  y="21" fontFamily="'JetBrains Mono', 'Courier New', monospace" fontSize="7" fontWeight="700" fill="#FFB300">&gt;_</text>
      {/* Curly braces line — instantly reads as code */}
      <text x="15" y="21" fontFamily="'JetBrains Mono', 'Courier New', monospace" fontSize="7" fill="#D8CFB8">fn()</text>
      <text x="35" y="21" fontFamily="'JetBrains Mono', 'Courier New', monospace" fontSize="7" fill="#FFB300">{"{"}</text>
      {/* Indented line with syntax bars */}
      <rect x="10" y="26" width="2" height="2" fill="#B27D00" />
      <rect x="14" y="26" width="14" height="2" fill="#FFB300" rx="0.5" />
      <rect x="30" y="26" width="8"  height="2" fill="#D8CFB8" rx="0.5" opacity="0.75" />
      <rect x="10" y="31" width="2" height="2" fill="#B27D00" />
      <rect x="14" y="31" width="8"  height="2" fill="#D8CFB8" rx="0.5" />
      <rect x="24" y="31" width="18" height="2" fill="#FFB300" rx="0.5" opacity="0.85" />
      {/* Closing brace */}
      <text x="6" y="41" fontFamily="'JetBrains Mono', 'Courier New', monospace" fontSize="7" fill="#FFB300">{"}"}</text>
    </g>
  );
}

function ChatGlyph() {
  return (
    <g className="sb-glyph">
      <path
        d="M 4 6 L 56 6 Q 60 6 60 10 L 60 34 Q 60 38 56 38 L 28 38 L 18 46 L 20 38 L 4 38 Q 0 38 0 34 L 0 10 Q 0 6 4 6 Z"
        fill={G_DARK}
        stroke={G_STROKE}
        strokeWidth="1.2"
      />
      <circle cx="12" cy="18" r="4" fill={G_STROKE_HOT} />
      <path d="M 20 16 L 50 16" stroke="#D8CFB8" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M 20 22 L 42 22" stroke="#D8CFB8" strokeWidth="1.4" strokeLinecap="round" opacity="0.75" />
      <path d="M 8 30 L 46 30" stroke="#D8CFB8" strokeWidth="1.4" strokeLinecap="round" opacity="0.55" />
    </g>
  );
}

function SchemaGlyph() {
  // A database cylinder connected to a small linked table — unmistakably a DB schema
  return (
    <g className="sb-glyph">
      {/* Database cylinder */}
      <g>
        {/* body */}
        <path d="M 0 8 L 0 32 Q 0 40 14 40 Q 28 40 28 32 L 28 8 Z" fill={G_DARK} stroke={G_STROKE} strokeWidth="1.2" />
        {/* top ellipse */}
        <ellipse cx="14" cy="8" rx="14" ry="4" fill={G_DARK} stroke={G_STROKE} strokeWidth="1.2" />
        {/* stripes */}
        <path d="M 0 16 Q 14 22 28 16" fill="none" stroke={G_STROKE} strokeWidth="0.9" opacity="0.75" />
        <path d="M 0 24 Q 14 30 28 24" fill="none" stroke={G_STROKE} strokeWidth="0.9" opacity="0.55" />
        {/* amber dot indicator */}
        <circle cx="14" cy="8" r="1.6" fill={G_STROKE_HOT} />
      </g>
      {/* connector */}
      <path d="M 28 22 L 38 22" stroke={G_STROKE_HOT} strokeWidth="1.3" />
      <circle cx="28" cy="22" r="1.4" fill={G_STROKE_HOT} />
      <circle cx="38" cy="22" r="1.4" fill={G_STROKE_HOT} />
      {/* Linked table */}
      <rect x="38" y="10" width="22" height="26" rx="2" fill={G_DARK} stroke={G_STROKE} strokeWidth="1.1" />
      <line x1="39" y1="16" x2="59" y2="16" stroke={G_STROKE_HOT} strokeWidth="0.9" />
      <line x1="41" y1="20" x2="57" y2="20" stroke="#D8CFB8" strokeWidth="0.9" />
      <line x1="41" y1="24" x2="57" y2="24" stroke="#D8CFB8" strokeWidth="0.9" opacity="0.65" />
      <line x1="41" y1="28" x2="52" y2="28" stroke="#D8CFB8" strokeWidth="0.9" opacity="0.65" />
      <line x1="41" y1="32" x2="55" y2="32" stroke="#D8CFB8" strokeWidth="0.9" opacity="0.55" />
    </g>
  );
}

function PdfGlyph() {
  // Page with folded corner + bold red "PDF" badge + bar chart — unmistakably a PDF
  return (
    <g className="sb-glyph">
      <path d="M 4 2 L 40 2 L 52 14 L 52 48 Q 52 50 50 50 L 6 50 Q 4 50 4 48 L 4 4 Q 4 2 6 2 Z" fill={G_DARK} stroke={G_STROKE} strokeWidth="1.2" />
      <path d="M 40 2 L 40 14 L 52 14" fill="none" stroke={G_STROKE} strokeWidth="1.2" />
      {/* Prominent brick-red PDF badge */}
      <rect x="7" y="14" width="20" height="10" rx="1.5" fill="#7A3324" stroke="#7A3324" />
      <text x="17" y="22" textAnchor="middle" fontFamily="'JetBrains Mono', 'Courier New', monospace" fontSize="7" fontWeight="700" fill="#F1EAD6">PDF</text>
      {/* body text lines */}
      <line x1="30" y1="18" x2="48" y2="18" stroke="#D8CFB8" strokeWidth="1" opacity="0.85" />
      <line x1="30" y1="22" x2="46" y2="22" stroke="#D8CFB8" strokeWidth="1" opacity="0.65" />
      <line x1="9"  y1="30" x2="48" y2="30" stroke="#D8CFB8" strokeWidth="1" opacity="0.7" />
      <line x1="9"  y1="33.5" x2="42" y2="33.5" stroke="#D8CFB8" strokeWidth="1" opacity="0.55" />
      {/* mini bar chart */}
      <line x1="10" y1="46" x2="10" y2="40" stroke={G_STROKE_HOT} strokeWidth="2" />
      <line x1="16" y1="46" x2="16" y2="42" stroke={G_STROKE_HOT} strokeWidth="2" opacity="0.8" />
      <line x1="22" y1="46" x2="22" y2="38" stroke={G_STROKE_HOT} strokeWidth="2" />
      <line x1="28" y1="46" x2="28" y2="43" stroke={G_STROKE_HOT} strokeWidth="2" opacity="0.7" />
      <line x1="34" y1="46" x2="34" y2="40" stroke={G_STROKE_HOT} strokeWidth="2" opacity="0.9" />
      <line x1="40" y1="46" x2="40" y2="42" stroke={G_STROKE_HOT} strokeWidth="2" opacity="0.75" />
      <line x1="46" y1="46" x2="46" y2="39" stroke={G_STROKE_HOT} strokeWidth="2" />
    </g>
  );
}

function DriveGlyph() {
  // cloud with folder tree
  return (
    <g className="sb-glyph">
      {/* cloud */}
      <path
        d="M 14 18 Q 6 18 6 12 Q 6 4 16 4 Q 22 -2 32 4 Q 44 2 46 12 Q 52 12 52 18 Q 52 24 46 24 L 14 24 Q 14 24 14 18 Z"
        fill={G_DARK}
        stroke={G_STROKE}
        strokeWidth="1.2"
      />
      {/* plug */}
      <line x1="29" y1="24" x2="29" y2="30" stroke={G_STROKE_HOT} strokeWidth="1.3" />
      <circle cx="29" cy="32" r="2" fill={G_STROKE_HOT} />
      {/* branch lines */}
      <path d="M 29 32 L 14 40 M 29 32 L 29 40 M 29 32 L 44 40" stroke={G_STROKE} strokeWidth="1" fill="none" />
      {/* three tiny folders */}
      {[10, 25, 40].map((fx, i) => (
        <g key={i}>
          <path
            d={`M ${fx} 40 L ${fx + 3} 40 L ${fx + 4.5} 42 L ${fx + 8} 42 L ${fx + 8} 48 L ${fx} 48 Z`}
            fill={G_DARK}
            stroke={G_STROKE_HOT}
            strokeWidth="1"
          />
        </g>
      ))}
    </g>
  );
}

function WikiGlyph() {
  // An open book with a bookmark ribbon and a "W" wiki mark — clearly a book, not a page
  return (
    <g className="sb-glyph">
      {/* Book spine shadow */}
      <path d="M 30 6 L 30 46" stroke={G_STROKE} strokeWidth="1.2" />
      {/* Left page */}
      <path d="M 4 8 Q 4 6 6 6 L 30 6 L 30 46 L 6 46 Q 4 46 4 44 L 4 8 Z" fill={G_DARK} stroke={G_STROKE} strokeWidth="1.2" />
      {/* Right page */}
      <path d="M 30 6 L 54 6 Q 56 6 56 8 L 56 44 Q 56 46 54 46 L 30 46 Z" fill={G_DARK} stroke={G_STROKE} strokeWidth="1.2" />
      {/* "W" wiki mark on left page in amber */}
      <text x="17" y="21" textAnchor="middle" fontFamily="'JetBrains Mono', 'Courier New', monospace" fontSize="10" fontWeight="700" fill={G_STROKE_HOT}>W</text>
      {/* text lines on left page under W */}
      <line x1="8" y1="27" x2="27" y2="27" stroke="#D8CFB8" strokeWidth="0.9" opacity="0.75" />
      <line x1="8" y1="31" x2="24" y2="31" stroke="#D8CFB8" strokeWidth="0.9" opacity="0.55" />
      <line x1="8" y1="35" x2="27" y2="35" stroke="#D8CFB8" strokeWidth="0.9" opacity="0.5" />
      <line x1="8" y1="39" x2="20" y2="39" stroke="#D8CFB8" strokeWidth="0.9" opacity="0.5" />
      {/* text lines on right page */}
      <line x1="33" y1="14" x2="53" y2="14" stroke="#D8CFB8" strokeWidth="0.9" opacity="0.75" />
      <line x1="33" y1="18" x2="50" y2="18" stroke="#D8CFB8" strokeWidth="0.9" opacity="0.55" />
      <line x1="33" y1="22" x2="53" y2="22" stroke="#D8CFB8" strokeWidth="0.9" opacity="0.55" />
      <line x1="33" y1="26" x2="47" y2="26" stroke="#D8CFB8" strokeWidth="0.9" opacity="0.45" />
      <line x1="33" y1="34" x2="53" y2="34" stroke="#D8CFB8" strokeWidth="0.9" opacity="0.55" />
      <line x1="33" y1="38" x2="49" y2="38" stroke="#D8CFB8" strokeWidth="0.9" opacity="0.45" />
      {/* Bookmark ribbon hanging down from top */}
      <path d="M 44 6 L 44 20 L 47 17 L 50 20 L 50 6 Z" fill="#7A3324" stroke="#7A3324" strokeWidth="0.8" />
    </g>
  );
}
