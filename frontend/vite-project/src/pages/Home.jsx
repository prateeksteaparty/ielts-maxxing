import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const skills = [
  { label: "Reading", icon: "📖", color: "var(--accent-reading)" },
  { label: "Listening", icon: "🎧", color: "var(--accent-listening)" },
  { label: "Writing", icon: "✍️", color: "var(--accent-writing)" },
  { label: "Speaking", icon: "🎤", color: "var(--accent-speaking)" },
];

export default function Home() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={`home-root ${theme}`}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Sans:wght@300;400;500&display=swap');

        :root {
          --accent-reading: #e8b86d;
          --accent-listening: #7eb8f7;
          --accent-writing: #b68df5;
          --accent-speaking: #6debb0;
        }

        .home-root {
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          transition: background 0.4s ease, color 0.4s ease;
          overflow: hidden;
          position: relative;
        }

        /* ─── DARK THEME ─── */
        .home-root.dark {
          background: #0c0c10;
          color: #f0ede8;
        }
        .home-root.dark .card { background: rgba(255,255,255,0.04); border-color: rgba(255,255,255,0.08); }
        .home-root.dark .nav { border-bottom-color: rgba(255,255,255,0.06); }
        .home-root.dark .theme-btn { background: rgba(255,255,255,0.07); color: #f0ede8; }
        .home-root.dark .theme-btn:hover { background: rgba(255,255,255,0.13); }
        .home-root.dark .sub { color: #9a9490; }
        .home-root.dark .btn-outline { border-color: rgba(255,255,255,0.2); color: #f0ede8; }
        .home-root.dark .btn-outline:hover { background: rgba(255,255,255,0.07); }
        .home-root.dark .orb1 { background: radial-gradient(circle, rgba(232,184,109,0.12) 0%, transparent 70%); }
        .home-root.dark .orb2 { background: radial-gradient(circle, rgba(126,184,247,0.10) 0%, transparent 70%); }
        .home-root.dark .orb3 { background: radial-gradient(circle, rgba(182,141,245,0.08) 0%, transparent 70%); }

        /* ─── LIGHT THEME ─── */
        .home-root.light {
          background: #faf8f4;
          color: #1a1814;
        }
        .home-root.light .card { background: rgba(0,0,0,0.03); border-color: rgba(0,0,0,0.08); }
        .home-root.light .nav { border-bottom-color: rgba(0,0,0,0.06); }
        .home-root.light .theme-btn { background: rgba(0,0,0,0.06); color: #1a1814; }
        .home-root.light .theme-btn:hover { background: rgba(0,0,0,0.11); }
        .home-root.light .sub { color: #7a7470; }
        .home-root.light .btn-outline { border-color: rgba(0,0,0,0.18); color: #1a1814; }
        .home-root.light .btn-outline:hover { background: rgba(0,0,0,0.05); }
        .home-root.light .orb1 { background: radial-gradient(circle, rgba(232,184,109,0.18) 0%, transparent 70%); }
        .home-root.light .orb2 { background: radial-gradient(circle, rgba(126,184,247,0.14) 0%, transparent 70%); }
        .home-root.light .orb3 { background: radial-gradient(circle, rgba(182,141,245,0.12) 0%, transparent 70%); }

        /* ─── ORBS ─── */
        .orb { position: absolute; border-radius: 50%; pointer-events: none; }
        .orb1 { width: 600px; height: 600px; top: -200px; right: -100px; }
        .orb2 { width: 400px; height: 400px; bottom: 50px; left: -100px; }
        .orb3 { width: 300px; height: 300px; top: 40%; left: 40%; }

        /* ─── NAV ─── */
        .nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem 3rem;
          border-bottom: 1px solid;
          position: relative;
          z-index: 10;
        }
        .logo {
          font-family: 'Playfair Display', serif;
          font-size: 1.25rem;
          font-weight: 700;
          letter-spacing: -0.02em;
        }
        .logo span { opacity: 0.4; font-weight: 400; }
        .theme-btn {
          border: none;
          cursor: pointer;
          padding: 0.5rem 1rem;
          border-radius: 100px;
          font-size: 0.85rem;
          font-family: 'DM Sans', sans-serif;
          transition: background 0.2s;
        }

        /* ─── HERO ─── */
        .hero {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 5rem 2rem 3rem;
          position: relative;
          z-index: 5;
          text-align: center;
        }
        .eyebrow {
          font-size: 0.75rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          opacity: 0.45;
          margin-bottom: 1.5rem;
          font-weight: 500;
        }
        .headline {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2.8rem, 7vw, 5.5rem);
          font-weight: 900;
          line-height: 1.0;
          letter-spacing: -0.03em;
          margin-bottom: 1.5rem;
          max-width: 14ch;
        }
        .headline em {
          font-style: italic;
          opacity: 0.45;
        }
        .sub {
          font-size: 1.1rem;
          line-height: 1.6;
          max-width: 40ch;
          font-weight: 300;
          margin-bottom: 3rem;
        }
        .btn-group { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
        .btn-primary {
          padding: 0.85rem 2rem;
          border-radius: 100px;
          border: none;
          background: #e8b86d;
          color: #1a1000;
          font-family: 'DM Sans', sans-serif;
          font-weight: 500;
          font-size: 0.95rem;
          cursor: pointer;
          text-decoration: none;
          transition: transform 0.2s, box-shadow 0.2s;
          display: inline-block;
        }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(232,184,109,0.35); }
        .btn-outline {
          padding: 0.85rem 2rem;
          border-radius: 100px;
          border: 1px solid;
          background: transparent;
          font-family: 'DM Sans', sans-serif;
          font-weight: 400;
          font-size: 0.95rem;
          cursor: pointer;
          text-decoration: none;
          transition: background 0.2s;
          display: inline-block;
        }

        /* ─── SKILL CHIPS ─── */
        .skill-row {
          display: flex;
          gap: 0.75rem;
          justify-content: center;
          flex-wrap: wrap;
          margin-top: 4rem;
          padding: 0 2rem;
          position: relative;
          z-index: 5;
        }
        .skill-chip {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.6rem 1.2rem;
          border-radius: 100px;
          border: 1px solid;
          font-size: 0.85rem;
          font-weight: 500;
        }
        .skill-chip .dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
        }

        /* ─── FOOTER ─── */
        .footer {
          text-align: center;
          padding: 2rem;
          font-size: 0.75rem;
          opacity: 0.3;
          position: relative;
          z-index: 5;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .hero > * {
          animation: fadeUp 0.7s ease both;
        }
        .hero > *:nth-child(1) { animation-delay: 0.05s; }
        .hero > *:nth-child(2) { animation-delay: 0.15s; }
        .hero > *:nth-child(3) { animation-delay: 0.25s; }
        .hero > *:nth-child(4) { animation-delay: 0.35s; }
      `}</style>

      {/* Background orbs */}
      <div className="orb orb1" />
      <div className="orb orb2" />
      <div className="orb orb3" />


      {/* Nav */}
      <nav className="nav">
        <div className="logo">IELTS Maxxing<span>/ Prateek</span></div>
        <button className="theme-btn" onClick={toggleTheme}>
          {theme === "dark" ? "☀ Light" : "☾ Dark"}
        </button>
      </nav>

      {/* Hero */}
      <main className="hero">
        <p className="eyebrow">Band 8 or Bust</p>
        <h1 className="headline">
          Your IELTS <em>command</em> centre.
        </h1>
        <p className="sub">
          Track mocks, analyse mistakes, and watch your band score climb — across Reading, Listening, Writing, and Speaking.
        </p>
        <div className="btn-group">
          <Link to="/signup" className="btn-primary">Get Started →</Link>
          <Link to="/signin" className="btn-outline">Sign In</Link>
        </div>
      </main>

      {/* Skill chips */}
      <div className="skill-row">
        {skills.map((s) => (
          <div
            key={s.label}
            className="skill-chip"
            style={{ borderColor: s.color + "55", color: s.color }}
          >
            <span className="dot" style={{ background: s.color }} />
            {s.label}
          </div>
        ))}
      </div>

      <footer className="footer">© {new Date().getFullYear()} IELTS Maxxing — Prateek</footer>
    </div>
  );
}