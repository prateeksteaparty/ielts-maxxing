import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useTheme } from "../context/ThemeContext";

const SKILLS = ["reading", "listening", "writing", "speaking"];
const SKILL_META = {
  reading:   { icon: "📖", color: "#e8b86d", label: "Reading" },
  listening: { icon: "🎧", color: "#7eb8f7", label: "Listening" },
  writing:   { icon: "✍️", color: "#b68df5", label: "Writing" },
  speaking:  { icon: "🎤", color: "#6debb0", label: "Speaking" },
};

const roundIELTS = (score) => Math.floor(score * 2) / 2;

export default function Mocks() {
  const [tab, setTab]             = useState("individual");
  const [skill, setSkill]         = useState("reading");
  const [tests, setTests]         = useState([]);
  const [fullMocks, setFullMocks] = useState([]);
  const [error, setError]         = useState("");
  const [success, setSuccess]     = useState(false);
  const [deletingId, setDeletingId] = useState(null); // id currently being deleted
  const [confirmId, setConfirmId]   = useState(null); // id awaiting confirm

  const [form, setForm] = useState({ bandScore: "", testDate: "", mistakes: "", mockName: "", mockLink: "" });
  const [fullForm, setFullForm] = useState({
    mockName: "", mockLink: "", testDate: "", mistakes: "",
    reading: "", listening: "", writing: "", speaking: "",
  });

  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  const loadTests = async () => {
    try {
      const res = await api.get(`/tests/${skill}`);
      setTests(res.data);
    } catch { setError("Failed to load tests"); }
  };

  const loadFullMocks = async () => {
    try {
      const res = await api.get("/tests/full");
      setFullMocks(res.data);
    } catch { setError("Failed to load full mocks"); }
  };

  useEffect(() => { loadTests(); }, [skill]);
  useEffect(() => { loadFullMocks(); }, []);

  const isValidBand = (v) => {
    const n = Number(v);
    return !isNaN(n) && n >= 0 && n <= 9 && n * 2 === Math.floor(n * 2);
  };

  const submitIndividual = async (e) => {
    e.preventDefault();
    setError(""); setSuccess(false);
    if (!form.testDate || !isValidBand(form.bandScore)) {
      setError("Band must be 0–9 in 0.5 steps and date is required.");
      return;
    }
    try {
      await api.post("/tests", { ...form, bandScore: Number(form.bandScore), skill });
      setForm({ bandScore: "", testDate: "", mistakes: "", mockName: "", mockLink: "" });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      loadTests();
    } catch { setError("Failed to add test."); }
  };

  const submitFull = async (e) => {
    e.preventDefault();
    setError(""); setSuccess(false);
    const { reading, listening, writing, speaking, testDate } = fullForm;
    if (!testDate) { setError("Date is required."); return; }
    if (![reading, listening, writing, speaking].every(isValidBand)) {
      setError("All 4 band scores must be 0–9 in 0.5 steps.");
      return;
    }
    try {
      await api.post("/tests", {
        skill: "full", testDate,
        mockName: fullForm.mockName, mockLink: fullForm.mockLink, mistakes: fullForm.mistakes,
        fullScores: {
          reading: Number(reading), listening: Number(listening),
          writing: Number(writing), speaking: Number(speaking),
        },
      });
      setFullForm({ mockName: "", mockLink: "", testDate: "", mistakes: "", reading: "", listening: "", writing: "", speaking: "" });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      loadFullMocks();
    } catch { setError("Failed to add full mock."); }
  };

  const handleDelete = async (id, isFull = false) => {
    if (confirmId !== id) {
      setConfirmId(id); // first click → show confirm
      return;
    }
    // second click → actually delete
    setDeletingId(id);
    setConfirmId(null);
    try {
      await api.delete(`/tests/${id}`);
      if (isFull) {
        setFullMocks(prev => prev.filter(t => t._id !== id));
      } else {
        setTests(prev => prev.filter(t => t._id !== id));
      }
    } catch {
      setError("Failed to delete.");
    } finally {
      setDeletingId(null);
    }
  };

  const meta = SKILL_META[skill];

  return (
    <div className={`mocks-root ${theme}`}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; }

        .mocks-root { font-family: 'DM Sans', sans-serif; min-height: 100vh; transition: background 0.4s, color 0.4s; }
        .mocks-root.dark  { background: #0c0c10; color: #f0ede8; }
        .mocks-root.light { background: #eeebe5; color: #1a1814; }

        .mocks-nav { display: flex; justify-content: space-between; align-items: center; padding: 1.25rem 2.5rem; border-bottom: 1px solid; position: sticky; top: 0; z-index: 20; backdrop-filter: blur(16px); }
        .dark  .mocks-nav { border-color: rgba(255,255,255,0.07); background: rgba(12,12,16,0.85); }
        .light .mocks-nav { border-color: rgba(0,0,0,0.12); background: rgba(238,235,229,0.92); }
        .nav-left { display: flex; align-items: center; gap: 1rem; }
        .back-btn { border: 1px solid; background: transparent; padding: 0.4rem 0.9rem; border-radius: 100px; font-size: 0.82rem; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: background 0.2s; }
        .dark  .back-btn { border-color: rgba(255,255,255,0.15); color: #f0ede8; }
        .light .back-btn { border-color: rgba(0,0,0,0.2); color: #1a1814; background: rgba(255,255,255,0.6); }
        .dark  .back-btn:hover { background: rgba(255,255,255,0.07); }
        .light .back-btn:hover { background: white; }
        .nav-title { font-family: 'Playfair Display', serif; font-size: 1.2rem; font-weight: 700; }
        .theme-btn { border: none; cursor: pointer; padding: 0.4rem 0.9rem; border-radius: 100px; font-size: 0.82rem; font-family: 'DM Sans', sans-serif; transition: background 0.2s; }
        .dark  .theme-btn { background: rgba(255,255,255,0.07); color: #f0ede8; }
        .light .theme-btn { background: rgba(0,0,0,0.09); color: #1a1814; }

        .top-tabs { display: flex; max-width: 1100px; margin: 1.75rem auto 0; padding: 0 2rem; }
        .top-tab { padding: 0.6rem 1.6rem; border: 1px solid; font-size: 0.88rem; font-weight: 500; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.2s; }
        .top-tab:first-child { border-radius: 10px 0 0 10px; }
        .top-tab:last-child  { border-radius: 0 10px 10px 0; border-left: none; }
        .dark  .top-tab { background: rgba(255,255,255,0.03); border-color: rgba(255,255,255,0.1); color: rgba(240,237,232,0.5); }
        .light .top-tab { background: rgba(255,255,255,0.6); border-color: rgba(0,0,0,0.15); color: rgba(26,24,20,0.55); }
        .top-tab.active-ind  { background: rgba(232,184,109,0.2); border-color: rgba(200,150,50,0.55); color: #a87820; }
        .top-tab.active-full { background: rgba(220,80,80,0.12); border-color: rgba(200,60,60,0.45); color: #c43030; }

        .mocks-body { display: grid; grid-template-columns: 1fr 1.4fr; gap: 2rem; max-width: 1100px; margin: 1.5rem auto 0; padding: 0 2rem 3rem; }
        @media (max-width: 700px) { .mocks-body { grid-template-columns: 1fr; } }

        .left-panel { display: flex; flex-direction: column; gap: 1.5rem; }
        .skill-tabs { display: flex; gap: 0.5rem; flex-wrap: wrap; }
        .skill-tab { padding: 0.5rem 1.1rem; border-radius: 100px; border: 1px solid transparent; font-size: 0.85rem; font-weight: 500; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.2s; }
        .dark  .skill-tab { background: rgba(255,255,255,0.04); color: rgba(240,237,232,0.5); }
        .light .skill-tab { background: rgba(255,255,255,0.7); border-color: rgba(0,0,0,0.12); color: rgba(26,24,20,0.6); }
        .light .skill-tab:hover { background: white; }

        .form-card { border-radius: 18px; border: 1px solid; padding: 1.75rem; }
        .dark  .form-card { background: rgba(255,255,255,0.03); border-color: rgba(255,255,255,0.08); }
        .light .form-card { background: white; border-color: rgba(0,0,0,0.13); box-shadow: 0 4px 24px rgba(0,0,0,0.09); }
        .form-heading { font-family: 'Playfair Display', serif; font-size: 1.4rem; font-weight: 700; margin-bottom: 0.25rem; }
        .form-sub { font-size: 0.83rem; opacity: 0.55; margin-bottom: 1.5rem; font-weight: 400; }

        .score-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 1rem; }
        .score-cell { border-radius: 12px; border: 1px solid; padding: 0.85rem; }
        .dark  .score-cell { background: rgba(255,255,255,0.03); border-color: rgba(255,255,255,0.08); }
        .light .score-cell { background: #f7f5f2; border-color: rgba(0,0,0,0.13); }
        .score-cell-label { font-size: 0.7rem; letter-spacing: 0.1em; text-transform: uppercase; font-weight: 600; margin-bottom: 0.4rem; opacity: 0.75; }
        .score-cell-input { width: 100%; background: transparent; border: none; outline: none; font-family: 'Playfair Display', serif; font-size: 1.8rem; font-weight: 700; color: inherit; padding: 0; }
        .score-cell-input::placeholder { opacity: 0.25; }

        .overall-preview { border-radius: 12px; padding: 0.9rem 1.1rem; display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; background: rgba(220,80,80,0.08); border: 1px solid rgba(200,60,60,0.3); }
        .overall-preview-label { font-size: 0.78rem; opacity: 0.7; }
        .overall-preview-value { font-family: 'Playfair Display', serif; font-size: 1.5rem; font-weight: 700; color: #c43030; }
        .dark .overall-preview-value { color: #f87171; }

        .field { display: flex; flex-direction: column; gap: 0.3rem; margin-bottom: 1rem; }
        .field-label { font-size: 0.73rem; letter-spacing: 0.1em; text-transform: uppercase; font-weight: 600; opacity: 0.55; }
        .field-input { padding: 0.7rem 0.9rem; border-radius: 10px; border: 1px solid; font-family: 'DM Sans', sans-serif; font-size: 0.92rem; outline: none; transition: border-color 0.2s; width: 100%; }
        .dark  .field-input { background: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.1); color: #f0ede8; }
        .light .field-input { background: #f7f5f2; border-color: rgba(0,0,0,0.15); color: #1a1814; }
        .field-input::placeholder { opacity: 0.4; }
        .field-textarea { resize: vertical; min-height: 75px; }
        .link-input-wrap { position: relative; }
        .link-input-wrap .field-input { padding-left: 2rem; }
        .link-icon { position: absolute; left: 0.7rem; top: 50%; transform: translateY(-50%); font-size: 0.85rem; opacity: 0.45; pointer-events: none; }

        .submit-btn { width: 100%; padding: 0.8rem; border: none; border-radius: 10px; font-family: 'DM Sans', sans-serif; font-size: 0.95rem; font-weight: 600; cursor: pointer; color: #0c0c10; transition: transform 0.18s, box-shadow 0.18s; margin-top: 0.25rem; }
        .submit-btn:hover { transform: translateY(-1px); }

        .alert { padding: 0.6rem 0.9rem; border-radius: 9px; font-size: 0.84rem; margin-bottom: 1rem; }
        .alert-error   { background: rgba(220,60,60,0.1); border: 1px solid rgba(200,60,60,0.3); color: #c03030; }
        .dark .alert-error { color: #f87171; }
        .alert-success { background: rgba(30,160,100,0.1); border: 1px solid rgba(30,160,100,0.3); color: #1a8a58; }
        .dark .alert-success { color: #6debb0; }

        .right-panel { display: flex; flex-direction: column; gap: 1rem; }
        .tests-heading { display: flex; align-items: baseline; gap: 0.75rem; margin-bottom: 0.5rem; }
        .tests-heading h2 { font-family: 'Playfair Display', serif; font-size: 1.3rem; font-weight: 700; margin: 0; }
        .tests-count { font-size: 0.8rem; padding: 0.2rem 0.6rem; border-radius: 100px; font-weight: 600; }

        .empty-state { border: 1px dashed; border-radius: 14px; padding: 2.5rem; text-align: center; font-size: 0.9rem; font-weight: 400; }
        .dark  .empty-state { border-color: rgba(255,255,255,0.1); color: rgba(240,237,232,0.4); }
        .light .empty-state { border-color: rgba(0,0,0,0.18); color: rgba(26,24,20,0.5); }

        /* Individual test card */
        .test-card { border-radius: 14px; border: 1px solid; padding: 1.1rem 1.3rem; display: flex; align-items: flex-start; gap: 1rem; transition: transform 0.15s; animation: slideIn 0.3s ease both; position: relative; }
        .test-card:hover { transform: translateX(4px); }
        .dark  .test-card { background: rgba(255,255,255,0.03); border-color: rgba(255,255,255,0.08); }
        .light .test-card { background: white; border-color: rgba(0,0,0,0.13); box-shadow: 0 2px 16px rgba(0,0,0,0.08); }
        .band-badge { flex-shrink: 0; width: 52px; height: 52px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-family: 'Playfair Display', serif; font-size: 1.1rem; font-weight: 700; color: #0c0c10; }
        .test-info { flex: 1; min-width: 0; }
        .test-top-row { display: flex; justify-content: space-between; align-items: flex-start; gap: 0.5rem; }
        .test-date { font-size: 0.75rem; opacity: 0.5; margin-bottom: 0.15rem; text-transform: uppercase; letter-spacing: 0.06em; font-weight: 500; }
        .test-name { font-weight: 600; font-size: 0.93rem; margin: 0 0 0.1rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .test-link { display: inline-flex; align-items: center; gap: 0.3rem; font-size: 0.75rem; font-weight: 600; text-decoration: none; padding: 0.18rem 0.55rem; border-radius: 6px; border: 1px solid; transition: background 0.2s; white-space: nowrap; flex-shrink: 0; }
        .test-link:hover { opacity: 0.8; }
        .test-notes { font-size: 0.85rem; font-weight: 400; opacity: 0.6; margin-top: 0.35rem; line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }

        /* Full mock card */
        .full-card { border-radius: 16px; border: 1px solid; padding: 1.2rem 1.4rem; animation: slideIn 0.3s ease both; transition: transform 0.15s; position: relative; }
        .full-card:hover { transform: translateX(4px); }
        .dark  .full-card { background: rgba(255,255,255,0.03); border-color: rgba(255,255,255,0.08); }
        .light .full-card { background: white; border-color: rgba(0,0,0,0.13); box-shadow: 0 2px 16px rgba(0,0,0,0.08); }
        .full-card-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.9rem; }
        .full-card-title { font-weight: 600; font-size: 0.95rem; }
        .full-card-date { font-size: 0.75rem; opacity: 0.5; margin-top: 0.1rem; text-transform: uppercase; letter-spacing: 0.06em; font-weight: 500; }
        .full-card-overall { font-family: 'Playfair Display', serif; font-size: 1.6rem; font-weight: 700; line-height: 1; }
        .dark  .full-card-overall { color: #f87171; }
        .light .full-card-overall { color: #c43030; }
        .full-card-overall-label { font-size: 0.68rem; opacity: 0.55; text-transform: uppercase; letter-spacing: 0.08em; text-align: right; font-weight: 600; }
        .score-chips { display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 0.5rem; }
        .score-chip { display: flex; align-items: center; gap: 0.3rem; padding: 0.25rem 0.65rem; border-radius: 8px; font-size: 0.8rem; font-weight: 600; }
        .full-card-notes { font-size: 0.82rem; font-weight: 400; opacity: 0.6; margin-top: 0.4rem; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }

        /* Delete button */
        .delete-btn {
          border: 1px solid; background: transparent; border-radius: 7px;
          padding: 0.22rem 0.6rem; font-size: 0.72rem; font-weight: 500;
          cursor: pointer; font-family: 'DM Sans', sans-serif;
          transition: all 0.18s; flex-shrink: 0;
        }
        .delete-btn.idle { border-color: rgba(200,60,60,0.25); color: rgba(180,50,50,0.55); }
        .delete-btn.idle:hover { background: rgba(200,60,60,0.08); border-color: rgba(200,60,60,0.5); color: #c03030; }
        .dark .delete-btn.idle { border-color: rgba(248,113,113,0.2); color: rgba(248,113,113,0.45); }
        .dark .delete-btn.idle:hover { background: rgba(248,113,113,0.1); border-color: rgba(248,113,113,0.5); color: #f87171; }
        .delete-btn.confirm { border-color: #c03030; color: #c03030; background: rgba(200,60,60,0.1); animation: pulse 0.4s ease; }
        .dark .delete-btn.confirm { border-color: #f87171; color: #f87171; background: rgba(248,113,113,0.12); }
        .delete-btn.loading { border-color: rgba(200,60,60,0.15); color: rgba(180,50,50,0.35); cursor: not-allowed; }

        .card-actions { display: flex; justify-content: space-between; align-items: center; margin-top: 0.65rem; padding-top: 0.55rem; border-top: 1px solid; }
        .dark  .card-actions { border-color: rgba(255,255,255,0.06); }
        .light .card-actions { border-color: rgba(0,0,0,0.09); }

        @keyframes slideIn { from { opacity: 0; transform: translateX(16px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.05); } }
      `}</style>

      <nav className="mocks-nav">
        <div className="nav-left">
          <button className="back-btn" onClick={() => navigate("/dashboard")}>← Dashboard</button>
          <span className="nav-title">Mock Tests</span>
        </div>
        <button className="theme-btn" onClick={toggleTheme}>{isDark ? "☀ Light" : "☾ Dark"}</button>
      </nav>

      <div className="top-tabs">
        <button className={`top-tab ${tab === "individual" ? "active-ind" : ""}`}
          onClick={() => { setTab("individual"); setError(""); setSuccess(false); setConfirmId(null); }}>
          📝 Individual Skill
        </button>
        <button className={`top-tab ${tab === "full" ? "active-full" : ""}`}
          onClick={() => { setTab("full"); setError(""); setSuccess(false); setConfirmId(null); }}>
          🏆 Full Length Mock
        </button>
      </div>

      <div className="mocks-body">

        {/* ── INDIVIDUAL TAB ── */}
        {tab === "individual" && (
          <>
            <div className="left-panel">
              <div className="skill-tabs">
                {SKILLS.map((s) => {
                  const m = SKILL_META[s];
                  const active = s === skill;
                  return (
                    <button key={s} className={`skill-tab${active ? " active" : ""}`} onClick={() => setSkill(s)}
                      style={active ? { background: m.color + "22", borderColor: m.color + "66", color: m.color } : {}}>
                      {m.icon} {m.label}
                    </button>
                  );
                })}
              </div>

              <div className="form-card">
                <h2 className="form-heading">Log a {meta.label} Test</h2>
                <p className="form-sub">These results feed directly into your dashboard analytics.</p>
                {error   && <div className="alert alert-error">{error}</div>}
                {success && <div className="alert alert-success">✓ Test added successfully!</div>}
                <form onSubmit={submitIndividual}>
                  <div className="field">
                    <label className="field-label">Mock Name</label>
                    <input className="field-input" placeholder="e.g. Cambridge 18 Test 2"
                      value={form.mockName} onChange={(e) => setForm({ ...form, mockName: e.target.value })}
                      onFocus={(e) => e.target.style.borderColor = meta.color}
                      onBlur={(e) => e.target.style.borderColor = ""} />
                  </div>
                  <div className="field">
                    <label className="field-label">Mock Link <span style={{ opacity: 0.5, textTransform: "none", letterSpacing: 0 }}>(optional)</span></label>
                    <div className="link-input-wrap">
                      <span className="link-icon">🔗</span>
                      <input className="field-input" placeholder="https://..."
                        value={form.mockLink} onChange={(e) => setForm({ ...form, mockLink: e.target.value })}
                        onFocus={(e) => e.target.style.borderColor = meta.color}
                        onBlur={(e) => e.target.style.borderColor = ""} />
                    </div>
                  </div>
                  <div className="field">
                    <label className="field-label">Band Score</label>
                    <input className="field-input" placeholder="e.g. 6.5"
                      value={form.bandScore} onChange={(e) => setForm({ ...form, bandScore: e.target.value })}
                      onFocus={(e) => e.target.style.borderColor = meta.color}
                      onBlur={(e) => e.target.style.borderColor = ""} />
                  </div>
                  <div className="field">
                    <label className="field-label">Test Date</label>
                    <input type="date" className="field-input"
                      value={form.testDate} onChange={(e) => setForm({ ...form, testDate: e.target.value })}
                      onFocus={(e) => e.target.style.borderColor = meta.color}
                      onBlur={(e) => e.target.style.borderColor = ""} />
                  </div>
                  <div className="field">
                    <label className="field-label">Mistakes / Notes</label>
                    <textarea className="field-input field-textarea" placeholder="What went wrong? What to fix next time..."
                      value={form.mistakes} onChange={(e) => setForm({ ...form, mistakes: e.target.value })}
                      onFocus={(e) => e.target.style.borderColor = meta.color}
                      onBlur={(e) => e.target.style.borderColor = ""} />
                  </div>
                  <button type="submit" className="submit-btn"
                    style={{ background: meta.color, boxShadow: `0 6px 20px ${meta.color}44` }}>
                    Add {meta.label} Test →
                  </button>
                </form>
              </div>
            </div>

            <div className="right-panel">
              <div className="tests-heading">
                <h2>History</h2>
                <span className="tests-count" style={{ background: meta.color + "22", color: meta.color }}>
                  {tests.length} test{tests.length !== 1 ? "s" : ""}
                </span>
              </div>
              {tests.length === 0 ? (
                <div className="empty-state">No {meta.label.toLowerCase()} tests logged yet.<br />Add your first one →</div>
              ) : (
                tests.map((t, i) => (
                  <div key={t._id} className="test-card" style={{ animationDelay: `${i * 0.05}s` }}>
                    <div className="band-badge" style={{ background: meta.color }}>{t.bandScore}</div>
                    <div className="test-info">
                      <div className="test-top-row">
                        <div style={{ minWidth: 0 }}>
                          <p className="test-date">
                            {new Date(t.testDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                          </p>
                          <p className="test-name">{t.mockName ? `${meta.icon} ${t.mockName}` : `${meta.icon} Band ${t.bandScore}`}</p>
                        </div>
                      </div>
                      {t.mistakes && <p className="test-notes">{t.mistakes}</p>}
                      {/* Bottom action row: Open link + Delete */}
                      <div className="card-actions">
                        {t.mockLink ? (
                          <a href={t.mockLink} target="_blank" rel="noopener noreferrer" className="test-link"
                            style={{ color: meta.color, borderColor: meta.color + "44", background: meta.color + "11" }}>
                            Open ↗
                          </a>
                        ) : <span />}
                        <button
                          className={`delete-btn ${deletingId === t._id ? "loading" : confirmId === t._id ? "confirm" : "idle"}`}
                          onClick={() => handleDelete(t._id, false)}
                          disabled={deletingId === t._id}
                        >
                          {deletingId === t._id ? "…" : confirmId === t._id ? "Sure? Click again" : "Delete"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {/* ── FULL MOCK TAB ── */}
        {tab === "full" && (
          <>
            <div className="left-panel">
              <div className="form-card">
                <h2 className="form-heading">🏆 Full Length Mock</h2>
                <p className="form-sub">Enter all 4 section scores — overall is calculated automatically.</p>
                {error   && <div className="alert alert-error">{error}</div>}
                {success && <div className="alert alert-success">✓ Full mock added!</div>}
                <form onSubmit={submitFull}>
                  <div className="field">
                    <label className="field-label">Mock Name</label>
                    <input className="field-input" placeholder="e.g. Cambridge 18 Test 1"
                      value={fullForm.mockName} onChange={(e) => setFullForm({ ...fullForm, mockName: e.target.value })}
                      onFocus={(e) => e.target.style.borderColor = "#f87171"}
                      onBlur={(e) => e.target.style.borderColor = ""} />
                  </div>
                  <div className="field">
                    <label className="field-label">Mock Link <span style={{ opacity: 0.5, textTransform: "none", letterSpacing: 0 }}>(optional)</span></label>
                    <div className="link-input-wrap">
                      <span className="link-icon">🔗</span>
                      <input className="field-input" placeholder="https://..."
                        value={fullForm.mockLink} onChange={(e) => setFullForm({ ...fullForm, mockLink: e.target.value })}
                        onFocus={(e) => e.target.style.borderColor = "#f87171"}
                        onBlur={(e) => e.target.style.borderColor = ""} />
                    </div>
                  </div>
                  <div className="field">
                    <label className="field-label">Test Date</label>
                    <input type="date" className="field-input"
                      value={fullForm.testDate} onChange={(e) => setFullForm({ ...fullForm, testDate: e.target.value })}
                      onFocus={(e) => e.target.style.borderColor = "#f87171"}
                      onBlur={(e) => e.target.style.borderColor = ""} />
                  </div>
                  <div className="score-grid">
                    {SKILLS.map((s) => {
                      const m = SKILL_META[s];
                      return (
                        <div key={s} className="score-cell" style={{ borderColor: fullForm[s] && isValidBand(fullForm[s]) ? m.color + "66" : "" }}>
                          <div className="score-cell-label" style={{ color: m.color }}>{m.icon} {m.label}</div>
                          <input className="score-cell-input" style={{ color: m.color }}
                            placeholder="—" type="number" min="0" max="9" step="0.5"
                            value={fullForm[s]} onChange={(e) => setFullForm({ ...fullForm, [s]: e.target.value })} />
                        </div>
                      );
                    })}
                  </div>
                  {(() => {
                    const scores = SKILLS.map(s => Number(fullForm[s])).filter(n => !isNaN(n) && n > 0);
                    if (scores.length === 4) {
                      const overall = roundIELTS(scores.reduce((a, b) => a + b, 0) / 4);
                      return (
                        <div className="overall-preview">
                          <span className="overall-preview-label">Predicted Overall Band</span>
                          <span className="overall-preview-value">{overall.toFixed(1)}</span>
                        </div>
                      );
                    }
                    return null;
                  })()}
                  <div className="field">
                    <label className="field-label">Mistakes / Notes</label>
                    <textarea className="field-input field-textarea" placeholder="What went wrong across sections?"
                      value={fullForm.mistakes} onChange={(e) => setFullForm({ ...fullForm, mistakes: e.target.value })}
                      onFocus={(e) => e.target.style.borderColor = "#f87171"}
                      onBlur={(e) => e.target.style.borderColor = ""} />
                  </div>
                  <button type="submit" className="submit-btn"
                    style={{ background: "#f87171", boxShadow: "0 6px 20px rgba(248,113,113,0.35)" }}>
                    Save Full Mock →
                  </button>
                </form>
              </div>
            </div>

            <div className="right-panel">
              <div className="tests-heading">
                <h2>Full Mock History</h2>
                <span className="tests-count" style={{ background: "rgba(248,113,113,0.15)", color: "#f87171" }}>
                  {fullMocks.length} mock{fullMocks.length !== 1 ? "s" : ""}
                </span>
              </div>
              {fullMocks.length === 0 ? (
                <div className="empty-state">No full mocks logged yet.<br />Add your first one →</div>
              ) : (
                fullMocks.map((t, i) => (
                  <div key={t._id} className="full-card" style={{ animationDelay: `${i * 0.05}s` }}>
                    <div className="full-card-header">
                      <div>
                        <p className="full-card-date">
                          {new Date(t.testDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                        </p>
                        <p className="full-card-title">🏆 {t.mockName || "Full Mock"}</p>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <p className="full-card-overall-label">Overall</p>
                        <p className="full-card-overall">{t.bandScore?.toFixed(1)}</p>
                      </div>
                    </div>
                    {t.fullScores && (
                      <div className="score-chips">
                        {SKILLS.map((s) => {
                          const m = SKILL_META[s];
                          return t.fullScores[s] != null ? (
                            <span key={s} className="score-chip"
                              style={{ background: m.color + "18", color: m.color, border: `1px solid ${m.color}33` }}>
                              {m.icon} {t.fullScores[s].toFixed(1)}
                            </span>
                          ) : null;
                        })}
                      </div>
                    )}
                    {t.mistakes && <p className="full-card-notes">{t.mistakes}</p>}
                    {/* Bottom action row: Open link + Delete */}
                    <div className="card-actions">
                      {t.mockLink ? (
                        <a href={t.mockLink} target="_blank" rel="noopener noreferrer" className="test-link"
                          style={{ color: "#f87171", borderColor: "rgba(248,113,113,0.3)", background: "rgba(248,113,113,0.08)" }}>
                          Open ↗
                        </a>
                      ) : <span />}
                      <button
                        className={`delete-btn ${deletingId === t._id ? "loading" : confirmId === t._id ? "confirm" : "idle"}`}
                        onClick={() => handleDelete(t._id, true)}
                        disabled={deletingId === t._id}
                      >
                        {deletingId === t._id ? "…" : confirmId === t._id ? "Sure? Click again" : "Delete"}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}