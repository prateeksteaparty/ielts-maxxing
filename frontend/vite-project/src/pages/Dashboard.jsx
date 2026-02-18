import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useTheme } from "../context/ThemeContext";
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, ReferenceLine, CartesianGrid,
} from "recharts";

const SKILL_META = {
  reading:   { icon: "📖", color: "#e8b86d", label: "Reading" },
  listening: { icon: "🎧", color: "#7eb8f7", label: "Listening" },
  writing:   { icon: "✍️", color: "#b68df5", label: "Writing" },
  speaking:  { icon: "🎤", color: "#6debb0", label: "Speaking" },
};

const roundIELTS = (score) => Math.floor(score * 2) / 2;

const CustomTooltip = ({ active, payload, label, isDark }) => {
  if (active && payload && payload.length) {
    const point = payload[0]?.payload || {};
    return (
      <div style={{
        background: isDark ? "rgba(16,16,22,0.97)" : "rgba(255,255,255,0.97)",
        border: `1px solid rgba(232,184,109,0.3)`,
        borderRadius: 12, padding: "0.85rem 1.1rem",
        boxShadow: "0 12px 32px rgba(0,0,0,0.25)",
        fontFamily: "'DM Sans', sans-serif",
        minWidth: 170,
      }}>
        <p style={{ fontSize: "0.7rem", opacity: 0.45, marginBottom: "0.6rem", letterSpacing: "0.08em", textTransform: "uppercase", color: isDark ? "#f0ede8" : "#1a1814" }}>
          Test #{label}
        </p>
        {Object.entries(SKILL_META).map(([, meta]) => (
          point[meta.label] != null && (
            <div key={meta.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", marginBottom: "0.25rem" }}>
              <span style={{ fontSize: "0.78rem", color: meta.color }}>{meta.icon} {meta.label}</span>
              <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "0.95rem", color: meta.color }}>
                {point[meta.label].toFixed(1)}
              </span>
            </div>
          )
        ))}
        {point.overall != null && (
          <div style={{ borderTop: "1px solid rgba(232,184,109,0.2)", marginTop: "0.5rem", paddingTop: "0.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "0.82rem", color: "#e8b86d", fontWeight: 500 }}>⭐ Overall</span>
            <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1.2rem", color: "#e8b86d" }}>
              {point.overall.toFixed(1)}
            </span>
          </div>
        )}
      </div>
    );
  }
  return null;
};

function AnimatedNumber({ value }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (!value) return;
    const target = parseFloat(value);
    const steps = 40;
    const increment = target / steps;
    let current = 0, step = 0;
    const timer = setInterval(() => {
      step++;
      current = Math.min(current + increment, target);
      setDisplay(current);
      if (step >= steps) clearInterval(timer);
    }, 800 / steps);
    return () => clearInterval(timer);
  }, [value]);
  return <>{display > 0 ? display.toFixed(1) : "—"}</>;
}

export default function Dashboard() {
  const [data, setData]               = useState(null);
  const [trendData, setTrendData]     = useState([]);
  const [targetInput, setTargetInput] = useState("");
  const [editingTarget, setEditingTarget] = useState(false);
  const [savingTarget, setSavingTarget]   = useState(false);
  const [targetError, setTargetError]     = useState("");
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  const loadDashboard = async () => {
    const res = await api.get("/dashboard");
    setData(res.data);
    setTargetInput(res.data.targetBand || 8.0);
  };

  const loadTrendData = async () => {
    const skills = ["reading", "listening", "writing", "speaking"];
    const allTests = {};

    await Promise.all(skills.map(async (skill) => {
      try {
        const res = await api.get(`/tests/${skill}`);
        allTests[skill] = [...res.data].reverse();
      } catch {
        allTests[skill] = [];
      }
    }));

    const maxLen = Math.max(...skills.map(s => allTests[s].length), 0);
    const points = [];

    for (let i = 0; i < maxLen; i++) {
      const point = { test: i + 1 };
      const presentScores = [];

      skills.forEach(skill => {
        const t = allTests[skill][i];
        if (t) {
          point[SKILL_META[skill].label] = t.bandScore;
          presentScores.push(t.bandScore);
        }
      });

      if (presentScores.length === 4) {
        point.overall = roundIELTS(presentScores.reduce((a, b) => a + b, 0) / 4);
      }

      points.push(point);
    }

    setTrendData(points);
  };

  useEffect(() => {
    loadDashboard();
    loadTrendData();
  }, []);

  const saveTarget = async () => {
    const val = parseFloat(targetInput);
    if (isNaN(val) || val < 0 || val > 9 || val * 2 !== Math.floor(val * 2)) {
      setTargetError("Must be 0–9 in 0.5 steps");
      return;
    }
    setSavingTarget(true);
    setTargetError("");
    try {
      await api.patch("/auth/target", { targetBand: val });
      await loadDashboard();
      setEditingTarget(false);
    } catch {
      setTargetError("Failed to save");
    } finally {
      setSavingTarget(false);
    }
  };

  const makeMiniTooltip = (meta) => ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div style={{
        background: isDark ? "rgba(16,16,22,0.97)" : "rgba(255,255,255,0.97)",
        border: `1px solid ${meta.color}55`,
        borderRadius: 8, padding: "0.5rem 0.75rem",
        fontFamily: "'DM Sans', sans-serif",
        boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
      }}>
        <p style={{ fontSize: "0.68rem", opacity: 0.4, marginBottom: "0.2rem", color: isDark ? "#f0ede8" : "#1a1814" }}>Test #{label}</p>
        <p style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1.1rem", color: meta.color, margin: 0 }}>
          {payload[0].value?.toFixed(1)}
        </p>
      </div>
    );
  };

  return (
    <div className={`dash-root ${theme}`}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; }

        .dash-root { font-family: 'DM Sans', sans-serif; min-height: 100vh; transition: background 0.4s, color 0.4s; }
        .dash-root.dark  { background: #0c0c10; color: #f0ede8; }
        .dash-root.light { background: #eeebe5; color: #1a1814; }

        /* NAV */
        .dash-nav { display: flex; justify-content: space-between; align-items: center; padding: 1.2rem 2.5rem; border-bottom: 1px solid; position: sticky; top: 0; z-index: 20; backdrop-filter: blur(18px); }
        .dark  .dash-nav { border-color: rgba(255,255,255,0.07); background: rgba(12,12,16,0.88); }
        .light .dash-nav { border-color: rgba(0,0,0,0.12); background: rgba(238,235,229,0.92); }
        .nav-logo { font-family: 'Playfair Display', serif; font-size: 1.15rem; font-weight: 700; letter-spacing: -0.01em; }
        .nav-logo span { opacity: 0.45; font-weight: 400; font-style: italic; }
        .nav-right { display: flex; gap: 0.6rem; align-items: center; }
        .nav-btn { padding: 0.42rem 1rem; border-radius: 100px; border: 1px solid; font-family: 'DM Sans', sans-serif; font-size: 0.8rem; cursor: pointer; transition: all 0.2s; }
        .nav-btn:hover { transform: translateY(-1px); }
        .dark  .nav-btn.ghost { background: transparent; border-color: rgba(255,255,255,0.15); color: #f0ede8; }
        .light .nav-btn.ghost { background: rgba(255,255,255,0.7); border-color: rgba(0,0,0,0.18); color: #1a1814; }
        .dark  .nav-btn.ghost:hover { background: rgba(255,255,255,0.06); }
        .light .nav-btn.ghost:hover { background: white; }
        .nav-btn.primary { background: #e8b86d; border-color: #e8b86d; color: #1a1000; font-weight: 500; }
        .nav-btn.primary:hover { box-shadow: 0 4px 16px rgba(232,184,109,0.4); }
        .nav-btn.danger { background: transparent; border-color: rgba(248,113,113,0.4); color: #e55555; }
        .light .nav-btn.danger { border-color: rgba(220,60,60,0.35); color: #c94040; }
        .nav-btn.danger:hover { background: rgba(248,113,113,0.08); }

        /* BODY */
        .dash-body { max-width: 1200px; margin: 0 auto; padding: 2rem 2.5rem 4rem; display: flex; flex-direction: column; gap: 2rem; }

        /* GREETING */
        .greeting { animation: fadeUp 0.5s ease both; }
        .greeting-eyebrow { 
  font-size: 0.78rem; 
  letter-spacing: 0.15em; 
  text-transform: uppercase; 
  opacity: 0.45; 
  margin-bottom: 0.6rem; 
  font-weight: 500; 
}
.greeting-name { 
  display: block;
  font-family: 'Playfair Display', serif;
  font-size: clamp(2.2rem, 5vw, 3.5rem);
  font-weight: 900;
  letter-spacing: -0.03em;
  line-height: 1;
  color: #e8b86d;
  opacity: 1;
  text-transform: none;
  margin: 0.3rem 0 0.5rem;
}
        .greeting-title { font-family: 'Playfair Display', serif; font-size: clamp(1.8rem, 4vw, 2.8rem); font-weight: 900; letter-spacing: -0.03em; line-height: 1.05; }
        .greeting-title em { font-style: italic; opacity: 0.4; }

        /* HERO ROW */
        .hero-row { display: grid; grid-template-columns: 1fr 2fr; gap: 1.25rem; animation: fadeUp 0.55s ease 0.08s both; }
        @media (max-width: 700px) { .hero-row { grid-template-columns: 1fr; } }

        /* OVERALL CARD */
        .overall-card { border-radius: 20px; border: 1px solid; padding: 1.75rem; display: flex; flex-direction: column; gap: 1rem; position: relative; overflow: hidden; }
        .dark  .overall-card { background: rgba(232,184,109,0.07); border-color: rgba(232,184,109,0.2); }
        .light .overall-card { background: #fdf6e8; border-color: rgba(200,155,60,0.45); box-shadow: 0 4px 24px rgba(180,130,30,0.15); }
        .overall-label { font-size: 0.72rem; letter-spacing: 0.15em; text-transform: uppercase; color: #c8963c; font-weight: 600; }
        .light .overall-label { color: #a87820; }
        .overall-number { font-family: 'Playfair Display', serif; font-size: 5rem; font-weight: 900; color: #e8b86d; line-height: 1; letter-spacing: -0.04em; margin: 0; }
        .light .overall-number { color: #c8822a; }
        .overall-glow { position: absolute; width: 200px; height: 200px; border-radius: 50%; background: radial-gradient(circle, rgba(232,184,109,0.2) 0%, transparent 70%); right: -40px; bottom: -40px; pointer-events: none; }
        .gap-pill { display: inline-flex; align-items: center; gap: 0.4rem; font-size: 0.78rem; padding: 0.25rem 0.7rem; border-radius: 100px; font-weight: 500; }
        .gap-pill.needs { background: rgba(248,113,113,0.12); color: #e04040; border: 1px solid rgba(220,60,60,0.25); }
        .gap-pill.good  { background: rgba(40,180,110,0.12); color: #1d9e60; border: 1px solid rgba(40,180,110,0.25); }

        /* TARGET SECTION */
        .target-section { margin-top: auto; border-top: 1px solid rgba(200,150,60,0.25); padding-top: 1rem; }
        .target-label-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; }
        .target-label { font-size: 0.7rem; letter-spacing: 0.12em; text-transform: uppercase; color: #e8b86d; font-weight: 600; }
        .light .target-label { color: #a87820; }
        .target-edit-btn { font-size: 0.72rem; padding: 0.18rem 0.6rem; border-radius: 6px; border: 1px solid rgba(200,150,60,0.4); background: rgba(232,184,109,0.15); color: #a87820; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: background 0.2s; }
        .target-edit-btn:hover { background: rgba(232,184,109,0.28); }
        .target-value { font-family: 'Playfair Display', serif; font-size: 1.6rem; font-weight: 700; color: #e8b86d; line-height: 1; }
        .light .target-value { color: #b87c18; }
        .target-edit-row { display: flex; gap: 0.4rem; align-items: center; flex-wrap: wrap; }
        .target-input { width: 70px; padding: 0.4rem 0.6rem; border-radius: 8px; border: 1px solid #c89040; background: rgba(232,184,109,0.15); color: #a87820; font-family: 'DM Sans', sans-serif; font-size: 1rem; outline: none; text-align: center; font-weight: 600; }
        .target-save-btn { padding: 0.38rem 0.9rem; border-radius: 8px; border: none; background: #e8b86d; color: #1a1000; font-size: 0.82rem; font-family: 'DM Sans', sans-serif; cursor: pointer; font-weight: 500; transition: opacity 0.2s, box-shadow 0.2s; }
        .target-save-btn:hover { box-shadow: 0 4px 12px rgba(232,184,109,0.4); }
        .target-save-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .target-cancel-btn { padding: 0.38rem 0.6rem; border-radius: 8px; border: 1px solid rgba(0,0,0,0.15); background: transparent; color: inherit; font-size: 0.82rem; font-family: 'DM Sans', sans-serif; cursor: pointer; opacity: 0.5; }
        .target-cancel-btn:hover { opacity: 0.85; }
        .target-err { font-size: 0.72rem; color: #c94040; margin-top: 0.25rem; }

        /* SKILL GRID */
        .skill-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; }
        @media (max-width: 500px) { .skill-grid { grid-template-columns: 1fr; } }
        .skill-card { border-radius: 16px; border: 1px solid; padding: 1.25rem 1.4rem; transition: transform 0.18s; position: relative; overflow: hidden; }
        .skill-card:hover { transform: translateY(-2px); }
        .dark  .skill-card { background: rgba(255,255,255,0.03); border-color: rgba(255,255,255,0.08); }
        .light .skill-card { background: #ffffff; border-color: rgba(0,0,0,0.13); box-shadow: 0 2px 16px rgba(0,0,0,0.08); }
        .skill-card.on-target.dark  { border-color: rgba(109,235,176,0.25); background: rgba(109,235,176,0.05); }
        .skill-card.on-target.light { border-color: rgba(30,160,100,0.35); background: rgba(30,160,100,0.05); }
        .skill-icon-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; }
        .skill-icon { font-size: 1.1rem; }
        .skill-status-dot { width: 7px; height: 7px; border-radius: 50%; }
        .skill-name { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.12em; font-weight: 600; opacity: 0.5; margin-bottom: 0.25rem; }
        .skill-band { font-family: 'Playfair Display', serif; font-size: 2.2rem; font-weight: 700; letter-spacing: -0.03em; line-height: 1; }
        .skill-verdict { font-size: 0.75rem; margin-top: 0.4rem; font-weight: 500; }
        .skill-bg-number { position: absolute; right: -8px; bottom: -12px; font-family: 'Playfair Display', serif; font-size: 5rem; font-weight: 900; opacity: 0.04; line-height: 1; pointer-events: none; user-select: none; }

        /* CHART CARDS */
        .chart-section-title { font-family: 'Playfair Display', serif; font-size: 1.3rem; font-weight: 700; margin: 0 0 0.2rem; }
        .chart-section-sub   { font-size: 0.8rem; opacity: 0.5; font-weight: 400; margin: 0 0 1.25rem; }
        .charts-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.25rem; margin-bottom: 1.25rem; }
        @media (max-width: 600px) { .charts-grid { grid-template-columns: 1fr; } }

        .chart-card { border-radius: 18px; border: 1px solid; padding: 1.25rem 1.4rem; animation: fadeUp 0.4s ease both; }
        .dark  .chart-card { background: rgba(255,255,255,0.02); border-color: rgba(255,255,255,0.07); }
        .light .chart-card { background: #ffffff; border-color: rgba(0,0,0,0.13); box-shadow: 0 4px 20px rgba(0,0,0,0.08); }

        .chart-card-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.85rem; }
        .chart-card-label  { font-size: 0.68rem; letter-spacing: 0.12em; text-transform: uppercase; font-weight: 700; margin: 0 0 0.1rem; }
        .chart-card-latest { font-family: 'Playfair Display', serif; font-size: 1.4rem; font-weight: 700; line-height: 1; }
        .chart-empty { display: flex; align-items: center; justify-content: center; opacity: 0.4; font-size: 0.82rem; font-weight: 400; }

        /* LOADING */
        .loading-screen { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1rem; }
        .loading-pulse { width: 48px; height: 48px; border-radius: 50%; border: 3px solid transparent; border-top-color: #e8b86d; animation: spin 0.8s linear infinite; }
        .loading-text { font-family: 'Playfair Display', serif; font-size: 1.1rem; opacity: 0.4; font-style: italic; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .skill-card:nth-child(1) { animation-delay: 0.12s; }
        .skill-card:nth-child(2) { animation-delay: 0.18s; }
        .skill-card:nth-child(3) { animation-delay: 0.24s; }
        .skill-card:nth-child(4) { animation-delay: 0.30s; }
        .chart-card:nth-child(1) { animation-delay: 0.1s; }
        .chart-card:nth-child(2) { animation-delay: 0.16s; }
        .chart-card:nth-child(3) { animation-delay: 0.22s; }
        .chart-card:nth-child(4) { animation-delay: 0.28s; }
      `}</style>

      {!data && (
        <div className={`loading-screen ${theme}`}>
          <div className="loading-pulse" />
          <p className="loading-text">Loading your dashboard…</p>
        </div>
      )}

      {data && (
        <>
          <nav className="dash-nav">
            <div className="nav-logo">IELTS Maxxing <span>/ by Prateek</span></div>
            <div className="nav-right">
              <button className="nav-btn ghost" onClick={toggleTheme}>{isDark ? "☀ Light" : "☾ Dark"}</button>
              <button className="nav-btn primary" onClick={() => navigate("/mocks")}>+ Add Mock</button>
              <button className="nav-btn danger" onClick={() => { localStorage.removeItem("token"); navigate("/signin"); }}>Logout</button>
            </div>
          </nav>

          <div className="dash-body">

            {/* Greeting */}
            <div className="greeting">
  <p className="greeting-eyebrow">Welcome</p>
  <span className="greeting-name">{data.name || data.email?.split("@")[0]}</span>
  <h1 className="greeting-title">Records<br /><em>below.</em></h1>
</div>

            {/* Hero Row */}
            <div className="hero-row">
              <div className="overall-card">
                <div>
                  <p className="overall-label">Overall Band</p>
                  <p className="overall-number"><AnimatedNumber value={data.overallBand} /></p>
                  {data.overallBand > 0 && (
                    <span className={`gap-pill ${Math.max(0, (data.targetBand || 8) - data.overallBand) > 0 ? "needs" : "good"}`}>
                      {Math.max(0, (data.targetBand || 8) - data.overallBand) > 0
                        ? `↑ ${Math.max(0, (data.targetBand || 8) - data.overallBand).toFixed(1)} to Band ${data.targetBand || 8}`
                        : "✓ Target reached!"}
                    </span>
                  )}
                </div>
                <div className="target-section">
                  <div className="target-label-row">
                    <span className="target-label">🎯 Dream Band</span>
                    {!editingTarget && (
                      <button className="target-edit-btn" onClick={() => setEditingTarget(true)}>Edit</button>
                    )}
                  </div>
                  {!editingTarget ? (
                    <p className="target-value">{data.targetBand || 8.0}</p>
                  ) : (
                    <div>
                      <div className="target-edit-row">
                        <input className="target-input" type="number" min="0" max="9" step="0.5"
                          value={targetInput} onChange={(e) => setTargetInput(e.target.value)}
                          autoFocus onKeyDown={(e) => e.key === "Enter" && saveTarget()} />
                        <button className="target-save-btn" onClick={saveTarget} disabled={savingTarget}>
                          {savingTarget ? "Saving…" : "Save"}
                        </button>
                        <button className="target-cancel-btn" onClick={() => { setEditingTarget(false); setTargetError(""); }}>✕</button>
                      </div>
                      {targetError && <p className="target-err">{targetError}</p>}
                    </div>
                  )}
                </div>
                <div className="overall-glow" />
              </div>

              {/* Skill Cards */}
              <div className="skill-grid">
                {Object.entries(data.averages).map(([skill, band]) => {
                  const meta = SKILL_META[skill] || { icon: "📝", color: "#e8b86d", label: skill };
                  const target = data.targetBand || 8;
                  const onTarget = band >= target;
                  const gapToTarget = band ? Math.max(0, target - band).toFixed(1) : null;
                  return (
                    <div key={skill} className={`skill-card ${onTarget ? "on-target" : ""} ${theme}`}>
                      <div className="skill-icon-row">
                        <span className="skill-icon">{meta.icon}</span>
                        <span className="skill-status-dot"
                          style={{ background: onTarget ? (isDark ? "#6debb0" : "#22c57a") : isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.18)" }} />
                      </div>
                      <p className="skill-name">{meta.label}</p>
                      <p className="skill-band" style={{ color: meta.color }}>{band ? band.toFixed(1) : "—"}</p>
                      <p className="skill-verdict" style={{ color: onTarget ? (isDark ? "#6debb0" : "#1d9e60") : isDark ? "rgba(240,237,232,0.4)" : "rgba(26,24,20,0.45)" }}>
                        {onTarget ? "✓ On target" : gapToTarget ? `↑ ${gapToTarget} to go` : "No tests yet"}
                      </p>
                      <div className="skill-bg-number" style={{ color: meta.color }}>{band ? band.toFixed(0) : "?"}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── PROGRESS CHARTS ── */}
            <div>
              <h2 className="chart-section-title">Progress Over Time</h2>
              <p className="chart-section-sub">Each point = your Nth test for that section</p>

              <div className="charts-grid">
                {Object.entries(SKILL_META).map(([skill, meta]) => {
                  const skillData = trendData.map(p => ({ test: p.test, score: p[meta.label] ?? null }));
                  const hasData = skillData.some(p => p.score != null);
                  const latest = hasData ? skillData.filter(p => p.score != null).slice(-1)[0]?.score : null;

                  return (
                    <div key={skill} className="chart-card">
                      <div className="chart-card-header">
                        <p className="chart-card-label" style={{ color: meta.color }}>{meta.icon} {meta.label}</p>
                        {latest != null && (
                          <span className="chart-card-latest" style={{ color: meta.color }}>{latest.toFixed(1)}</span>
                        )}
                      </div>
                      {!hasData ? (
                        <div className="chart-empty" style={{ height: 130 }}>No tests yet</div>
                      ) : (
                        <div style={{ width: "100%", height: 130 }}>
                          <ResponsiveContainer>
                            <LineChart data={skillData} margin={{ top: 5, right: 8, left: -28, bottom: 0 }}>
                              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.1)"} vertical={false} />
                              <XAxis dataKey="test" axisLine={false} tickLine={false}
                                tick={{ fontSize: 9, fill: isDark ? "rgba(240,237,232,0.3)" : "rgba(26,24,20,0.5)", fontFamily: "'DM Sans', sans-serif" }} />
                              <YAxis domain={[0, 9]} ticks={[0, 3, 6, 9]} axisLine={false} tickLine={false}
                                tick={{ fontSize: 9, fill: isDark ? "rgba(240,237,232,0.3)" : "rgba(26,24,20,0.5)", fontFamily: "'DM Sans', sans-serif" }} />
                              <ReferenceLine y={data.targetBand || 8} stroke="#f87171" strokeDasharray="4 3" strokeWidth={1} strokeOpacity={0.5} />
                              <Tooltip content={makeMiniTooltip(meta)} />
                              <Line type="linear" dataKey="score" stroke={meta.color} strokeWidth={2.5}
                                dot={{ fill: meta.color, stroke: isDark ? "#0c0c10" : "#fff", strokeWidth: 1.5, r: 4 }}
                                activeDot={{ r: 6, fill: meta.color, stroke: isDark ? "#0c0c10" : "#fff", strokeWidth: 1.5 }}
                                connectNulls={false} />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Overall chart — full width */}
              <div className="chart-card">
                <div className="chart-card-header">
                  <div>
                    <p className="chart-card-label" style={{ color: "#e8b86d" }}>⭐ Overall Band</p>
                    <p style={{ fontSize: "0.74rem", opacity: 0.32, fontWeight: 300, margin: "0.15rem 0 0" }}>
                      IELTS-rounded avg · only shown when all 4 sections are present
                    </p>
                  </div>
                  {trendData.some(p => p.overall != null) && (
                    <span className="chart-card-latest" style={{ color: "#e8b86d", fontSize: "1.5rem" }}>
                      {trendData.filter(p => p.overall != null).slice(-1)[0]?.overall?.toFixed(1)}
                    </span>
                  )}
                </div>

                {!trendData.some(p => p.overall != null) ? (
                  <div className="chart-empty" style={{ height: 160, flexDirection: "column", gap: "0.4rem", display: "flex" }}>
                    <span style={{ fontSize: "1.4rem" }}>📈</span>
                    <span>Add all 4 sections for the same test number to see overall trend</span>
                  </div>
                ) : (
                  <div style={{ width: "100%", height: 200 }}>
                    <ResponsiveContainer>
                      <LineChart data={trendData} margin={{ top: 5, right: 12, left: -28, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.1)"} vertical={false} />
                        <XAxis dataKey="test" axisLine={false} tickLine={false}
                          tick={{ fontSize: 10, fill: isDark ? "rgba(240,237,232,0.35)" : "rgba(26,24,20,0.5)", fontFamily: "'DM Sans', sans-serif" }} />
                        <YAxis domain={[0, 9]} ticks={[0, 3, 6, 9]} axisLine={false} tickLine={false}
                          tick={{ fontSize: 10, fill: isDark ? "rgba(240,237,232,0.35)" : "rgba(26,24,20,0.5)", fontFamily: "'DM Sans', sans-serif" }} />
                        <ReferenceLine y={data.targetBand || 8} stroke="#f87171" strokeDasharray="6 4" strokeWidth={1.5} strokeOpacity={0.6}
                          label={{ value: `Target ${data.targetBand || 8}`, position: "insideTopRight", fontSize: 10, fill: "#f87171", opacity: 0.7 }} />
                        <Tooltip content={<CustomTooltip isDark={isDark} />} />
                        <Line type="linear" dataKey="overall" stroke="#e8b86d" strokeWidth={3}
                          dot={{ fill: "#e8b86d", stroke: isDark ? "#0c0c10" : "#fff", strokeWidth: 2, r: 6 }}
                          activeDot={{ r: 8, fill: "#e8b86d", stroke: isDark ? "#0c0c10" : "#fff", strokeWidth: 2 }}
                          connectNulls={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            </div>

          </div>
        </>
      )}
    </div>
  );
}