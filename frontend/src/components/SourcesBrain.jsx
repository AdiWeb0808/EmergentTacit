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

  // 6 sources with irregular positions, distinct tube lengths, distinct entry points on the brain
  const brainX = 560;
  const sources = [
    { key: "code",   label: "CODE",     x: 55,  y: 45,  port: 88,  delay: 0,   floatDur: 3.4, floatDelay: 0 },
    { key: "wiki",   label: "WIKI",     x: 235, y: 25,  port: 118, delay: 140, floatDur: 4.2, floatDelay: 0.6 },
    { key: "chat",   label: "CHAT",     x: 90,  y: 145, port: 148, delay: 280, floatDur: 3.8, floatDelay: 1.1 },
    { key: "schema", label: "SCHEMA",   x: 250, y: 175, port: 178, delay: 420, floatDur: 3.2, floatDelay: 0.3 },
    { key: "pdf",    label: "PDF",      x: 65,  y: 290, port: 208, delay: 560, floatDur: 4.0, floatDelay: 0.9 },
    { key: "drive",  label: "DRIVE",    x: 245, y: 315, port: 238, delay: 700, floatDur: 3.6, floatDelay: 0.2 },
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
          {sources.map((s) => (
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
                <text x="30" y="72" className="sb-label" textAnchor="middle">
                  {s.label}
                </text>
              </g>
            </g>
          ))}

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
            {[88, 118, 148, 178, 208, 238].map((py, i) => {
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

            {/* Subtle dome highlights */}
            <path d="M 30 200 L 30 130 Q 30 50 150 50" fill="none" stroke="#7a6a4d" strokeWidth="1" opacity="0.55" />

            {/* 4 amber-lit brain lobes */}
            <path d="M 60 80 Q 90 55 130 65 Q 145 80 130 105 Q 100 120 70 110 Q 55 95 60 80 Z" className="sb-lobe sb-lobe-1" />
            <path d="M 160 60 Q 200 55 230 75 Q 245 100 225 120 Q 190 130 165 115 Q 150 90 160 60 Z" className="sb-lobe sb-lobe-2" />
            <path d="M 60 130 Q 90 125 125 140 Q 140 165 120 190 Q 85 200 60 180 Q 45 155 60 130 Z" className="sb-lobe sb-lobe-3" />
            <path d="M 160 140 Q 200 135 230 150 Q 245 175 225 195 Q 190 205 160 190 Q 145 170 160 140 Z" className="sb-lobe sb-lobe-4" />

            {/* Circuit traces */}
            <g className="sb-traces" stroke="#FFB300" strokeWidth="1" fill="none" opacity="0.55">
              <path d="M 70 90 L 100 90 L 100 110 L 130 110" />
              <path d="M 180 70 L 210 90 L 200 110" />
              <path d="M 75 150 L 105 165 L 130 165" />
              <path d="M 175 155 L 210 170 L 220 180" />
              <path d="M 150 90 L 150 155" strokeDasharray="3 3" />
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
  // A tiny terminal window with syntax bars
  return (
    <g className="sb-glyph">
      <rect x="0" y="0" width="60" height="46" rx="4" fill={G_DARK} stroke={G_STROKE} strokeWidth="1.2" />
      <circle cx="7" cy="7" r="1.6" fill="#7A3324" />
      <circle cx="13" cy="7" r="1.6" fill="#B27D00" />
      <circle cx="19" cy="7" r="1.6" fill="#3a3428" />
      <rect x="6"  y="14" width="16" height="2.5" fill="#FFB300" rx="1" />
      <rect x="24" y="14" width="10" height="2.5" fill="#D8CFB8" rx="1" />
      <rect x="6"  y="20" width="8"  height="2.5" fill="#B27D00" rx="1" />
      <rect x="16" y="20" width="24" height="2.5" fill="#D8CFB8" rx="1" />
      <rect x="6"  y="26" width="30" height="2.5" fill="#D8CFB8" rx="1" opacity="0.7" />
      <rect x="6"  y="32" width="12" height="2.5" fill="#FFB300" rx="1" />
      <rect x="20" y="32" width="14" height="2.5" fill="#D8CFB8" rx="1" opacity="0.6" />
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
  // 3 tiny table rectangles connected by lines
  return (
    <g className="sb-glyph">
      {/* connector lines behind */}
      <path d="M 18 15 L 32 15" stroke={G_STROKE_HOT} strokeWidth="1.2" />
      <path d="M 42 25 L 42 34" stroke={G_STROKE_HOT} strokeWidth="1.2" />
      {/* table 1 */}
      <rect x="0" y="4" width="18" height="22" rx="2" fill={G_DARK} stroke={G_STROKE} strokeWidth="1.1" />
      <line x1="1" y1="10" x2="17" y2="10" stroke={G_STROKE_HOT} strokeWidth="0.8" />
      <line x1="3" y1="14" x2="15" y2="14" stroke="#D8CFB8" strokeWidth="0.8" />
      <line x1="3" y1="18" x2="15" y2="18" stroke="#D8CFB8" strokeWidth="0.8" opacity="0.6" />
      <line x1="3" y1="22" x2="12" y2="22" stroke="#D8CFB8" strokeWidth="0.8" opacity="0.6" />
      {/* table 2 */}
      <rect x="32" y="4" width="20" height="22" rx="2" fill={G_DARK} stroke={G_STROKE} strokeWidth="1.1" />
      <line x1="33" y1="10" x2="51" y2="10" stroke={G_STROKE_HOT} strokeWidth="0.8" />
      <line x1="35" y1="14" x2="49" y2="14" stroke="#D8CFB8" strokeWidth="0.8" />
      <line x1="35" y1="18" x2="49" y2="18" stroke="#D8CFB8" strokeWidth="0.8" opacity="0.6" />
      <line x1="35" y1="22" x2="45" y2="22" stroke="#D8CFB8" strokeWidth="0.8" opacity="0.6" />
      {/* table 3 */}
      <rect x="32" y="32" width="24" height="16" rx="2" fill={G_DARK} stroke={G_STROKE} strokeWidth="1.1" />
      <line x1="33" y1="38" x2="55" y2="38" stroke={G_STROKE_HOT} strokeWidth="0.8" />
      <line x1="35" y1="42" x2="52" y2="42" stroke="#D8CFB8" strokeWidth="0.8" />
    </g>
  );
}

function PdfGlyph() {
  // page with folded corner + a mini bar chart
  return (
    <g className="sb-glyph">
      <path d="M 4 2 L 40 2 L 52 14 L 52 48 Q 52 50 50 50 L 6 50 Q 4 50 4 48 L 4 4 Q 4 2 6 2 Z" fill={G_DARK} stroke={G_STROKE} strokeWidth="1.2" />
      <path d="M 40 2 L 40 14 L 52 14" fill="none" stroke={G_STROKE} strokeWidth="1.2" />
      {/* text lines */}
      <line x1="9"  y1="18" x2="46" y2="18" stroke="#D8CFB8" strokeWidth="1.1" />
      <line x1="9"  y1="22" x2="42" y2="22" stroke="#D8CFB8" strokeWidth="1.1" opacity="0.7" />
      <line x1="9"  y1="26" x2="38" y2="26" stroke="#D8CFB8" strokeWidth="1.1" opacity="0.7" />
      {/* mini bar chart */}
      <line x1="9" y1="46" x2="9" y2="34" stroke={G_STROKE_HOT} strokeWidth="2" />
      <line x1="15" y1="46" x2="15" y2="38" stroke={G_STROKE_HOT} strokeWidth="2" opacity="0.8" />
      <line x1="21" y1="46" x2="21" y2="32" stroke={G_STROKE_HOT} strokeWidth="2" />
      <line x1="27" y1="46" x2="27" y2="40" stroke={G_STROKE_HOT} strokeWidth="2" opacity="0.7" />
      <line x1="33" y1="46" x2="33" y2="34" stroke={G_STROKE_HOT} strokeWidth="2" opacity="0.9" />
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
  // page with lines and a chain-link icon
  return (
    <g className="sb-glyph">
      <rect x="0" y="2" width="46" height="46" rx="3" fill={G_DARK} stroke={G_STROKE} strokeWidth="1.2" />
      {/* title bar */}
      <rect x="4" y="6" width="30" height="4" rx="1" fill={G_STROKE_HOT} />
      {/* body lines */}
      <line x1="4"  y1="16" x2="42" y2="16" stroke="#D8CFB8" strokeWidth="1.1" />
      <line x1="4"  y1="21" x2="38" y2="21" stroke="#D8CFB8" strokeWidth="1.1" opacity="0.75" />
      <line x1="4"  y1="26" x2="42" y2="26" stroke="#D8CFB8" strokeWidth="1.1" opacity="0.6" />
      <line x1="4"  y1="31" x2="30" y2="31" stroke="#D8CFB8" strokeWidth="1.1" opacity="0.7" />
      <line x1="4"  y1="36" x2="34" y2="36" stroke="#D8CFB8" strokeWidth="1.1" opacity="0.55" />
      {/* small link icon */}
      <g transform="translate(48, 6)">
        <path d="M 0 6 A 5 5 0 0 1 5 1 L 8 1" stroke={G_STROKE_HOT} strokeWidth="1.3" fill="none" />
        <path d="M 10 4 A 5 5 0 0 1 15 9 L 15 12" stroke={G_STROKE_HOT} strokeWidth="1.3" fill="none" />
      </g>
    </g>
  );
}
