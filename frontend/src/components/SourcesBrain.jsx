import { useEffect, useRef, useState } from "react";

/**
 * SourcesBrain
 * Full-width dark band. 4 labeled source nodes on the left (Docs/Code/Databases/Chat)
 * → SVG pipes curve into a central robotic brain on the right.
 * On scroll into view:
 *  1. Each pipe fills with an amber packet (staggered)
 *  2. Each brain lobe lights up as its packet arrives
 *  3. After all 4 arrive, brain pulses and ONLINE flips to amber
 * Respects prefers-reduced-motion.
 */
export default function SourcesBrain() {
  const rootRef = useRef(null);
  const [active, setActive] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
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
      { threshold: 0.35 }
    );
    io.observe(rootRef.current);
    return () => io.disconnect();
  }, []);

  const sources = [
    { key: "docs", label: "DOCS", y: 60, delay: 0 },
    { key: "code", label: "CODE", y: 160, delay: 220 },
    { key: "db", label: "DATABASES", y: 260, delay: 440 },
    { key: "chat", label: "CHAT", y: 360, delay: 660 },
  ];

  // Pipe endpoints on the brain casing (roughly the 4 intake ports on the left of the brain unit)
  const brainX = 560;
  const brainPorts = { docs: 155, code: 195, db: 235, chat: 275 };

  return (
    <div ref={rootRef} className={`sb-root ${active ? "is-active" : ""}`}>
      <p className="lead-tiny sb-eyebrow">NOT JUST CHAT — LIVE PIPELINE</p>

      <div className="sb-stage">
        <svg
          viewBox="0 0 900 460"
          className="sb-svg"
          role="img"
          aria-label="Four knowledge sources flowing into a central robotic brain"
        >
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

          {/* Source nodes on the left */}
          {sources.map((s, i) => (
            <g key={s.key} className="sb-node" transform={`translate(20, ${s.y - 26})`}>
              <rect
                x="0"
                y="0"
                width="130"
                height="52"
                rx="4"
                fill="#1f1c15"
                stroke="#B27D00"
                strokeWidth="1.5"
              />
              <SourceIcon type={s.key} />
              <text
                x="55"
                y="32"
                fill="#D8CFB8"
                fontFamily="'VT323', monospace"
                fontSize="17"
                letterSpacing="0.05em"
              >
                {s.label}
              </text>
              {/* Sending indicator dot */}
              <circle
                cx="122"
                cy="26"
                r="3"
                fill="#FFB300"
                className="sb-send-dot"
                style={{ animationDelay: `${s.delay}ms` }}
              />
            </g>
          ))}

          {/* Pipes */}
          {sources.map((s) => {
            const startX = 150;
            const startY = s.y;
            const endX = brainX + 6;
            const endY = brainPorts[s.key];
            const cx1 = 320;
            const cx2 = 440;
            const d = `M ${startX} ${startY} C ${cx1} ${startY}, ${cx2} ${endY}, ${endX} ${endY}`;
            return (
              <g key={`pipe-${s.key}`} className="sb-pipe-group">
                {/* Base pipe */}
                <path d={d} className="sb-pipe-base" />
                {/* Animated amber fill */}
                <path
                  d={d}
                  className="sb-pipe-fill"
                  style={{ transitionDelay: `${s.delay}ms` }}
                />
                {/* Traveling packet */}
                <circle r="5" className="sb-packet" style={{ animationDelay: `${s.delay}ms`, offsetPath: `path('${d}')`, WebkitOffsetPath: `path('${d}')` }} />
              </g>
            );
          })}

          {/* Brain / mainframe unit */}
          <g transform={`translate(${brainX}, 60)`} className="sb-brain">
            {/* Glow behind brain */}
            <ellipse cx="150" cy="150" rx="170" ry="130" fill="url(#sb-brain-glow)" className="sb-glow" />

            {/* Chassis base */}
            <rect x="20" y="220" width="290" height="80" rx="6" fill="url(#sb-chassis)" stroke="#2A2013" strokeWidth="2" />
            <rect x="35" y="240" width="60" height="42" rx="3" fill="#0f0d09" stroke="#B27D00" strokeWidth="1" />
            {/* Chassis vents / dials */}
            <circle cx="115" cy="261" r="6" fill="#0f0d09" stroke="#B27D00" strokeWidth="1" />
            <circle cx="115" cy="261" r="2" fill="#FFB300" className="sb-blink" />
            <circle cx="135" cy="261" r="6" fill="#0f0d09" stroke="#B27D00" strokeWidth="1" />
            <circle cx="135" cy="261" r="2" fill="#B27D00" />
            {/* Vent grille */}
            {[0, 1, 2, 3, 4, 5, 6].map((i) => (
              <line
                key={i}
                x1={160}
                x2={290}
                y1={244 + i * 7}
                y2={244 + i * 7}
                stroke="#2A2013"
                strokeWidth="1.2"
              />
            ))}

            {/* Intake ports (left side) */}
            {[95, 135, 175, 215].map((py, i) => (
              <g key={i}>
                <rect x="-6" y={py - 10} width="18" height="20" rx="2" fill="#2A2013" stroke="#B27D00" strokeWidth="1.2" />
                <circle cx="3" cy={py} r="4" fill="#0f0d09" stroke="#FFB300" strokeWidth="1" />
              </g>
            ))}

            {/* Brain dome (chassis) */}
            <path
              d="M 20 220 L 20 130 Q 20 40 150 40 Q 280 40 280 130 L 280 220 Z"
              fill="url(#sb-chassis)"
              stroke="#2A2013"
              strokeWidth="2"
            />

            {/* Brain lobes — 4 amber-lit regions */}
            {/* Lobe 1: top-left (docs) */}
            <path
              d="M 60 80 Q 90 55 130 65 Q 145 80 130 105 Q 100 120 70 110 Q 55 95 60 80 Z"
              className="sb-lobe sb-lobe-docs"
              data-lobe="docs"
            />
            {/* Lobe 2: top-right (code) */}
            <path
              d="M 160 60 Q 200 55 230 75 Q 245 100 225 120 Q 190 130 165 115 Q 150 90 160 60 Z"
              className="sb-lobe sb-lobe-code"
              data-lobe="code"
            />
            {/* Lobe 3: bottom-left (db) */}
            <path
              d="M 60 130 Q 90 125 125 140 Q 140 165 120 190 Q 85 200 60 180 Q 45 155 60 130 Z"
              className="sb-lobe sb-lobe-db"
              data-lobe="db"
            />
            {/* Lobe 4: bottom-right (chat) */}
            <path
              d="M 160 140 Q 200 135 230 150 Q 245 175 225 195 Q 190 205 160 190 Q 145 170 160 140 Z"
              className="sb-lobe sb-lobe-chat"
              data-lobe="chat"
            />

            {/* Circuit traces overlay */}
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
              <text x="10" y="4" fill="#B27D00" fontFamily="'VT323', monospace" fontSize="14" className="sb-online-text">
                ONLINE
              </text>
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

function SourceIcon({ type }) {
  const common = { fill: "none", stroke: "#FFB300", strokeWidth: 1.6, transform: "translate(12, 14)" };
  if (type === "docs") {
    return (
      <g {...common}>
        <path d="M0 0h13l5 5v18H0z" />
        <path d="M4 8h10M4 13h10M4 18h6" />
      </g>
    );
  }
  if (type === "code") {
    return (
      <g {...common}>
        <path d="M6 2 -2 12l8 10M16 2l8 10-8 10" />
      </g>
    );
  }
  if (type === "db") {
    return (
      <g {...common}>
        <ellipse cx="11" cy="4" rx="10" ry="3.5" />
        <path d="M1 4v15c0 2 4.5 3.5 10 3.5s10-1.5 10-3.5V4" />
        <path d="M1 11.5c0 2 4.5 3.5 10 3.5s10-1.5 10-3.5" />
      </g>
    );
  }
  // chat
  return (
    <g {...common}>
      <path d="M-1 2h22v14H6l-5 5z" />
    </g>
  );
}
