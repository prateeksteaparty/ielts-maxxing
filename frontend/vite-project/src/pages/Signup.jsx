import { useState } from "react";
import api from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { useTheme } from "../context/ThemeContext";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/auth/signup", form);
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const res = await api.post("/auth/google", { token: credentialResponse.credential });
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch {
      setError("Google signup failed");
    }
  };

  return (
    <div className={`signup-root ${theme}`}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&family=DM+Sans:wght@300;400;500&display=swap');

        * { box-sizing: border-box; }

        .signup-root {
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          transition: background 0.4s, color 0.4s;
        }
        .signup-root.dark  { background: #0c0c10; color: #f0ede8; }
        .signup-root.light { background: #faf8f4; color: #1a1814; }

        /* ── NAV ── */
        .su-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.4rem 3rem;
          border-bottom: 1px solid;
          position: relative;
          z-index: 10;
        }
        .dark  .su-nav { border-color: rgba(255,255,255,0.06); }
        .light .su-nav { border-color: rgba(0,0,0,0.06); }

        .su-logo {
          font-family: 'Playfair Display', serif;
          font-size: 1.1rem;
          font-weight: 700;
          text-decoration: none;
          letter-spacing: -0.01em;
        }
        .dark  .su-logo { color: #f0ede8; }
        .light .su-logo { color: #1a1814; }
        .su-logo span { opacity: 0.38; font-weight: 400; font-style: italic; }

        .su-theme-btn {
          border: none;
          cursor: pointer;
          padding: 0.45rem 1rem;
          border-radius: 100px;
          font-size: 0.82rem;
          font-family: 'DM Sans', sans-serif;
          transition: background 0.2s;
        }
        .dark  .su-theme-btn { background: rgba(255,255,255,0.07); color: #f0ede8; }
        .light .su-theme-btn { background: rgba(0,0,0,0.06);       color: #1a1814; }
        .dark  .su-theme-btn:hover { background: rgba(255,255,255,0.13); }
        .light .su-theme-btn:hover { background: rgba(0,0,0,0.11); }

        /* ── BODY ── */
        .su-body {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 3rem 1.5rem;
          position: relative;
          overflow: hidden;
        }

        .su-orb {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
        }
        .dark  .su-orb-gold { background: radial-gradient(circle, rgba(232,184,109,0.13) 0%, transparent 70%); }
        .light .su-orb-gold { background: radial-gradient(circle, rgba(232,184,109,0.22) 0%, transparent 70%); }
        .dark  .su-orb-purple { background: radial-gradient(circle, rgba(182,141,245,0.09) 0%, transparent 70%); }
        .light .su-orb-purple { background: radial-gradient(circle, rgba(182,141,245,0.15) 0%, transparent 70%); }

        /* ── CARD ── */
        .su-card {
          position: relative;
          z-index: 5;
          width: 100%;
          max-width: 440px;
          border-radius: 20px;
          padding: 2.5rem;
          border: 1px solid;
          backdrop-filter: blur(8px);
          animation: suFadeUp 0.5s ease both;
        }
        .dark  .su-card { background: rgba(255,255,255,0.03); border-color: rgba(255,255,255,0.08); }
        .light .su-card { background: rgba(255,255,255,0.75); border-color: rgba(0,0,0,0.07); box-shadow: 0 8px 40px rgba(0,0,0,0.07); }

        .su-title {
          font-family: 'Playfair Display', serif;
          font-size: 2rem;
          font-weight: 700;
          letter-spacing: -0.02em;
          margin-bottom: 0.3rem;
        }
        .su-sub {
          font-size: 0.87rem;
          font-weight: 300;
          opacity: 0.45;
          margin-bottom: 1.75rem;
        }

        /* ── FIELDS ── */
        .su-field {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
          margin-bottom: 1rem;
        }
        .su-label {
          font-size: 0.72rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          font-weight: 500;
          opacity: 0.45;
        }
        .su-input {
          padding: 0.75rem 1rem;
          border-radius: 10px;
          border: 1px solid;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.93rem;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          width: 100%;
        }
        .dark  .su-input { background: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.1); color: #f0ede8; }
        .light .su-input { background: rgba(0,0,0,0.02);       border-color: rgba(0,0,0,0.1);       color: #1a1814; }
        .su-input:focus { border-color: #e8b86d; box-shadow: 0 0 0 3px rgba(232,184,109,0.15); }
        .su-input::placeholder { opacity: 0.35; }

        /* ── BUTTON ── */
        .su-btn {
          width: 100%;
          padding: 0.85rem;
          border: none;
          border-radius: 10px;
          background: #e8b86d;
          color: #1a1000;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.95rem;
          font-weight: 500;
          cursor: pointer;
          margin-top: 0.4rem;
          transition: transform 0.18s, box-shadow 0.18s, opacity 0.18s;
        }
        .su-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(232,184,109,0.3); }
        .su-btn:disabled { opacity: 0.55; cursor: not-allowed; }

        /* ── DIVIDER ── */
        .su-divider {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin: 1.5rem 0;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          opacity: 0.3;
        }
        .su-divider::before, .su-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: currentColor;
        }

        .su-google { display: flex; justify-content: center; }

        /* ── ERROR ── */
        .su-error {
          font-size: 0.84rem;
          color: #f87171;
          padding: 0.6rem 0.9rem;
          border-radius: 8px;
          background: rgba(248,113,113,0.1);
          border: 1px solid rgba(248,113,113,0.2);
          margin-bottom: 1rem;
        }

        /* ── LINK ROW ── */
        .su-link-row {
          text-align: center;
          margin-top: 1.5rem;
          font-size: 0.84rem;
          opacity: 0.5;
        }
        .su-link-row a { color: #e8b86d; text-decoration: none; opacity: 1; font-weight: 500; }
        .su-link-row a:hover { text-decoration: underline; }

        @keyframes suFadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Nav */}
      <nav className="su-nav">
        <Link to="/" className="su-logo">IELTS Maxxing<span>/ Prateek</span></Link>
        <button className="su-theme-btn" onClick={toggleTheme}>
          {isDark ? "☀ Light" : "☾ Dark"}
        </button>
      </nav>

      {/* Body */}
      <div className="su-body">
        <div className="su-orb su-orb-gold"   style={{ width: 500, height: 500, top: -80,  left: -120 }} />
        <div className="su-orb su-orb-purple"  style={{ width: 350, height: 350, bottom: -60, right: -60 }} />

        <div className="su-card">
          <h1 className="su-title">Start your climb.</h1>
          <p className="su-sub">Create an account and track your path to Band 8.</p>

          {error && <div className="su-error">{error}</div>}

          <form onSubmit={submit}>
            <div className="su-field">
              <label className="su-label">Name</label>
              <input
                className="su-input"
                placeholder="Prateek"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="su-field">
              <label className="su-label">Email</label>
              <input
                className="su-input"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div className="su-field">
              <label className="su-label">Password</label>
              <input
                type="password"
                className="su-input"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>

            <button type="submit" disabled={loading} className="su-btn">
              {loading ? "Creating account..." : "Create Account →"}
            </button>
          </form>

          <div className="su-divider">or</div>

          <div className="su-google">
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={() => setError("Google signup failed")}
            />
          </div>

          <p className="su-link-row">
            Already have an account? <Link to="/signin">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}