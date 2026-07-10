import { useEffect, useRef, useState } from "react";
import "@/App.css";
import heroBrain from "@/assets/hero-brain.png";
import pillarBooks from "@/assets/pillar-1-final.png";
import pillarBlocks from "@/assets/pillar-2-final.png";
import pillarAgents from "@/assets/pillar-3-final.png";
import SourcesBrain from "@/components/SourcesBrain";

const BOOT_LINES = [
  "YOUR ORGANIZATION AI — BOOTING",
  "----------------------------------",
  "COLLABORATION ENABLED........... OK",
  "NO HALLUCINATION........... OK",
  "INFINITE SKILLS........... OK",
];

const Icon = ({ children }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    {children}
  </svg>
);

function Landing() {
  const [clock, setClock] = useState("00:00:00");
  const [bootHidden, setBootHidden] = useState(false);
  const [bootHtml, setBootHtml] = useState('<span class="cursor"></span>');
  const installRef = useRef(null);
  const [installInView, setInstallInView] = useState(false);

  // Clock
  useEffect(() => {
    const tick = () => setClock(new Date().toTimeString().slice(0, 8));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // Boot animation
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setBootHidden(true);
      return;
    }
    let out = "";
    let li = 0;
    let ci = 0;
    let timeoutId;
    const step = () => {
      if (li >= BOOT_LINES.length) {
        setBootHtml(out + '<span class="cursor"></span>');
        timeoutId = setTimeout(() => setBootHidden(true), 550);
        return;
      }
      const line = BOOT_LINES[li];
      if (ci <= line.length) {
        setBootHtml(out + line.slice(0, ci) + '<span class="cursor"></span>');
        ci += 1;
        timeoutId = setTimeout(step, line.length ? 16 : 60);
      } else {
        out += line + "\n";
        li += 1;
        ci = 0;
        timeoutId = setTimeout(step, 90);
      }
    };
    step();
    return () => clearTimeout(timeoutId);
  }, []);

  // Install progress via IntersectionObserver
  useEffect(() => {
    if (!installRef.current) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setInstallInView(true);
        });
      },
      { threshold: 0.4 }
    );
    obs.observe(installRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <div
        id="boot"
        aria-hidden="true"
        className={bootHidden ? "hidden" : ""}
        data-testid="boot-screen"
      >
        <div id="boot-lines" dangerouslySetInnerHTML={{ __html: bootHtml }} />
      </div>

      <div className="desktop">
        <div className="menubar" data-testid="menubar">
          <div className="logo">
            ◧ TACIT<span className="logo-os">OS</span>
          </div>
          <nav>
            <a href="#pillars" data-testid="nav-platform">PLATFORM</a>
            <a href="#sources" data-testid="nav-sources">SOURCES</a>
            <a href="#cost" data-testid="nav-cost">COST</a>
            <a href="#ownership" data-testid="nav-ownership">OWNERSHIP</a>
          </nav>
          <div className="status">
            <span className="dot" />
            <span id="clock" data-testid="clock">{clock}</span>
          </div>
        </div>

        <div className="desktop-area">
          {/* HERO */}
          <section className="window" id="hero" data-testid="hero">
            <div className="titlebar">
              <div className="tlights"><span /><span /><span /></div>
              <div className="filename">hero.app — running</div>
            </div>
            <div className="window-body">
              <div className="hero-grid">
                <div>
                  <h1 className="hero-h1">Org AI.<br />Built like never before.</h1>
                  <p className="hero-sub">
                    Tribal knowledge, connected with your tools to make teams 10x more effective.
                  </p>
                  <div className="cta-row">
                    <a className="btn solid" href="#install" data-testid="hero-cta-primary">TALK TO US</a>
                    <a className="btn" href="#pillars" data-testid="hero-cta-secondary">SEE HOW IT RUNS</a>
                  </div>
                </div>
                <div className="hero-image" data-testid="hero-image">
                  <img
                    src={heroBrain}
                    alt="Retro brass robotic brain machine with handwritten notes, code, and chat bubbles flowing into intake ports"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* TAGLINE */}
          <div className="tagline-row" data-testid="tagline-row">
            <span className="item">
              <Icon>
                <rect x="5" y="10" width="14" height="10" rx="2" />
                <path d="M8 10V7a4 4 0 0 1 8 0v3" />
              </Icon>
              SCOPED
            </span>
            <span className="sep">·</span>
            <span className="item">
              <Icon>
                <circle cx="12" cy="13" r="8" />
                <path d="M12 13 15 9M9 3h6" />
              </Icon>
              METERED
            </span>
            <span className="sep">·</span>
            <span className="item">
              <Icon>
                <path d="M6 3h9l4 4v14H6z" />
                <path d="M9 10h7M9 14h7M9 18h4" />
              </Icon>
              AUDITED
            </span>
            <span className="sep">·</span>
            <span className="item">
              <Icon>
                <path d="M12 3v7" />
                <circle cx="12" cy="14" r="7" />
              </Icon>
              REVOCABLE
            </span>
            <span className="sep">—</span>
            <span>every action, every time</span>
          </div>

          {/* PROBLEM */}
          <section className="window" id="problem" data-testid="problem">
            <div className="titlebar">
              <div className="tlights"><span /><span /><span /></div>
              <div className="filename">problem.txt</div>
            </div>
            <div className="window-body">
              <h3 className="section-h3">Stop losing what your best people already know.</h3>
              <div className="tight-lines" style={{ fontSize: "14.5px" }}>
                <p>The answer already exists. It's just buried in a Slack thread from four months ago that nobody can find.</p>
                <p>Your best people are bottlenecks, not because they're slow — because they're the only ones who remember why.</p>
                <p>Every "let's write a doc for this" plan quietly dies, because nobody has time to keep docs current.</p>
                <p>Every new tool your team wants means a new vendor, a new integration, a new wait.</p>
              </div>
            </div>
          </section>

          {/* CHAT SILOS */}
          <section className="window" id="cost" data-testid="cost">
            <div className="titlebar">
              <div className="tlights"><span /><span /><span /></div>
              <div className="filename">chat_silos.log</div>
            </div>
            <div className="window-body">
              <h3 className="section-h3">Stop chatting with AI alone.</h3>
              <p className="chat-p-1">
                Every private chat is a dead end — the answer dies there unless someone retypes it, from memory, for the next person.
              </p>
              <p className="chat-p-2">
                The interface shifts from one-on-one to one shared across everyone. Every question answered becomes part of the organization's cumulative knowledge, not a private exchange — and that compounds fast. It cuts the other way too: when something's wrong, the fix applies everywhere at once, so bad information stops riding along into the next ten decisions.
              </p>
              <p className="lead-tiny" style={{ marginTop: "16px" }}>
                ONE SHARED LAYER. ONE VERIFIED ANSWER. ASKED ONCE.
              </p>
            </div>
          </section>

          {/* PILLARS */}
          <div id="pillars" className="pillars" data-testid="pillars">
            <div className="window pillar">
              <div className="titlebar">
                <div className="tlights"><span /><span /><span /></div>
                <div className="filename">ambient_capture.app</div>
              </div>
              <div className="window-body">
                <div className="pillar-image" data-testid="pillar-1-image">
                  <img
                    src={pillarBooks}
                    alt="Open books and notebooks with chat bubbles, docs, meetings, team chats, and data warehouse sources feeding into them — ambient knowledge capture"
                  />
                </div>
                <p className="kicker">Not just chat.</p>
                <h3>Ambient Knowledge Capture</h3>
                <p>Connects the docs you've already written, your code repos, your databases, and ongoing chat — turning all of it into knowledge everyone can use.</p>
              </div>
            </div>

            <div className="window pillar">
              <div className="titlebar">
                <div className="tlights"><span /><span /><span /></div>
                <div className="filename">skill_builder.app</div>
              </div>
              <div className="window-body">
                <div className="pillar-image">
                  <img
                    src={pillarBlocks}
                    alt="Modular blueprint cubes stacking and expanding with amber highlights on paper — modular skill acquisition"
                  />
                </div>
                <p className="kicker">No vendor roadmap. No ceiling.</p>
                <h3>Infinitely Scalable Skills</h3>
                <p>Ask for something new — it builds the capability, live in minutes.</p>
              </div>
            </div>

            <div className="window pillar">
              <div className="titlebar">
                <div className="tlights"><span /><span /><span /></div>
                <div className="filename">agent_layer.app</div>
              </div>
              <div className="window-body">
                <div className="pillar-image">
                  <img
                    src={pillarAgents}
                    alt="Specialist agents — Geo-Planner, Key Architect, Data Analyst, Systems Eng, Robotics Spec — emerging from a shared mainframe portal"
                  />
                </div>
                <p className="kicker">One platform. Many specialists.</p>
                <h3>Specialist Agents, On Demand</h3>
                <p>Agents emerge from the same core — none starting from zero.</p>
              </div>
            </div>
          </div>

          <p className="compound-line">
            It remembers everything <span className="hl">worth remembering</span>, learns to do anything <span className="hl">worth doing</span>, and turns both into as many specialists as your team needs — automatically.
          </p>

          {/* SOURCES */}
          <section className="window window--feature" id="sources" data-testid="sources">
            <div className="titlebar">
              <div className="tlights"><span /><span /><span /></div>
              <div className="filename">sources.cfg</div>
            </div>
            <div className="window-body">
              <SourcesBrain />
            </div>
          </section>

          {/* SPECS */}
          <section className="window window--feature" id="specs" data-testid="specs">
            <div className="titlebar">
              <div className="tlights"><span /><span /><span /></div>
              <div className="filename">specs.sys</div>
            </div>
            <div className="window-body">
              <h3 className="section-h3" style={{ fontSize: "22px", marginBottom: "16px" }}>
                Bounded at every edge.
              </h3>
              <div className="spec-row"><span className="k">DEPLOYMENT</span><span>OWN YOUR OS</span></div>
              <div className="spec-row"><span className="k">MODEL</span><span>BUILT ON CLAUDE</span></div>
              <div className="spec-row"><span className="k">CREDENTIALS</span><span>1PASSWORD — NEVER ON PLATFORM</span></div>
              <div className="spec-row"><span className="k">OVERSIGHT</span><span>HUMAN-APPROVED, EVERY TIME</span></div>
              <p className="who">Built for 100–500 person, Slack-native teams.</p>
            </div>
          </section>

          {/* SPEND */}
          <section className="window" id="spend" data-testid="spend">
            <div className="titlebar">
              <div className="tlights"><span /><span /><span /></div>
              <div className="filename">spend_ledger.log</div>
            </div>
            <div className="window-body">
              <p className="lead-tiny">MOST AI TOOLS BILL LIKE A PHONE PLAN</p>
              <p className="sales-point" style={{ fontSize: "clamp(18px,2.6vw,24px)", marginTop: "4px" }}>
                TacitOS runs your spend as <span className="hl">one shared pool.</span>
              </p>
              <p className="sub-note">
                Cap your AI cost with one hard ceiling — not a dozen forgotten seats quietly billing in the background.
              </p>

              <p className="ledger-caption">// PER-SEAT PRICING</p>
              <div className="ledger-line"><span className="lbl">SEAT 1</span><span className="ledger-track"><span className="ledger-fill dim" style={{ width: "55%" }} /></span></div>
              <div className="ledger-line"><span className="lbl">SEAT 2</span><span className="ledger-track"><span className="ledger-fill dim" style={{ width: "30%" }} /></span></div>
              <div className="ledger-line"><span className="lbl">SEAT 3</span><span className="ledger-track"><span className="ledger-fill brick" style={{ width: "100%" }} /></span></div>
              <div className="ledger-line"><span className="lbl">SEAT 4</span><span className="ledger-track"><span className="ledger-fill dim" style={{ width: "8%" }} /></span></div>
              <p className="ledger-note">overrun / idle / idle / idle</p>

              <p className="ledger-caption">// TACITOS — SHARED POOL</p>
              <div className="ledger-line"><span className="lbl">ORG BUDGET</span><span className="ledger-track"><span className="ledger-fill amber" style={{ width: "100%" }} /></span></div>
              <p className="ledger-note">$100 in · $100 working · zero idle · never runs over</p>
            </div>
          </section>

          {/* OWNERSHIP */}
          <section className="window window--feature" id="ownership" data-testid="ownership">
            <div className="titlebar">
              <div className="tlights"><span /><span /><span /></div>
              <div className="filename">not_a_saas.cfg</div>
            </div>
            <div className="window-body">
              <h2>This isn't a SaaS.<br />It's yours.</h2>
              <p className="sub">
                Runs inside your own stack — not ours. Nothing about your team's knowledge sits on a server we control.
              </p>
              <div className="yours-grid">
                <div className="yours-card">1PASSWORD<span className="y">YOURS</span></div>
                <div className="yours-card">CLOUD API<span className="y">YOURS</span></div>
                <div className="yours-card">DATABASE<span className="y">YOURS</span></div>
                <div className="yours-card">GIT REPO<span className="y">YOURS</span></div>
              </div>
              <p className="foot-note">Not our servers. Your stack, your way.</p>
            </div>
          </section>

          {/* INSTALL */}
          <section
            className={`window ${installInView ? "in-view" : ""}`}
            id="install"
            ref={installRef}
            data-testid="install"
          >
            <div className="titlebar">
              <div className="tlights"><span /><span /><span /></div>
              <div className="filename">talk.to.us</div>
            </div>
            <div className="window-body">
              <h3>Ready when you are.</h3>
              <p className="install-lead">Faster to set up than the doc you were about to give up on.</p>
              <div className="progress"><div className="fill" /></div>
              <a className="btn solid" href="mailto:hello@kaliper.ai" data-testid="install-cta">TALK TO US →</a>
              <p className="install-sub">or reply to this page. we'll take it from here.</p>
            </div>
          </section>
        </div>

        <div className="taskbar" data-testid="taskbar">
          <span>© KALIPER — TACITOS</span>
          <span id="taskbar-clock">SYSTEM ONLINE</span>
        </div>
      </div>
    </>
  );
}

function App() {
  return <Landing />;
}

export default App;
