import { useState } from "react";
import api from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { useTheme } from "../context/ThemeContext";

export default function Signin() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await api.post("/auth/signin", form);
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Signin failed");
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const res = await api.post("/auth/google", { token: credentialResponse.credential });
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch {
      setError("Google login failed");
    }
  };

  return (
    <div className={`signin-root ${theme}`}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&family=DM+Sans:wght@300;400;500&display=swap');

        * { box-sizing: border-box; }

        .signin-root {
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          transition: background 0.4s, color 0.4s;
        }
        .signin-root.dark  { background: #0c0c10; color: #f0ede8; }
        .signin-root.light { background: #faf8f4; color: #1a1814; }

        .si-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.4rem 3rem;
          border-bottom: 1px solid;
          position: relative;
          z-index: 10;
        }
        .dark  .si-nav { border-color: rgba(255,255,255,0.06); }
        .light .si-nav { border-color: rgba(0,0,0,0.06); }

        .si-logo {
          font-family: 'Playfair Display', serif;
          font-size: 1.1rem;
          font-weight: 700;
          text-decoration: none;
          letter-spacing: -0.01em;
        }
        .dark  .si-logo { color: #f0ede8; }
        .light .si-logo { color: #1a1814; }
        .si-logo span { opacity: 0.38; font-weight: 400; font-style: italic; }

        .si-theme-btn {
          border: none;
          cursor: pointer;
          padding: 0.45rem 1rem;
          border-radius: 100px;
          font-size: 0.82rem;
          font-family: 'DM Sans', sans-serif;
          transition: background 0.2s;
        }
        .dark  .si-theme-btn { background: rgba(255,255,255,0.07); color: #f0ede8; }
        .light .si-theme-btn { background: rgba(0,0,0,0.06);       color: #1a1814; }
        .dark  .si-theme-btn:hover { background: rgba(255,255,255,0.13); }
        .light .si-theme-btn:hover { background: rgba(0,0,0,0.11); }

        .si-body {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 3rem 1.5rem;
          position: relative;
          overflow: hidden;
        }

        .si-orb {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
        }
        .dark  .si-orb-gold { background: radial-gradient(circle, rgba(232,184,109,0.13) 0%, transparent 70%); }
        .light .si-orb-gold { background: radial-gradient(circle, rgba(232,184,109,0.22) 0%, transparent 70%); }
        .dark  .si-orb-blue { background: radial-gradient(circle, rgba(126,184,247,0.10) 0%, transparent 70%); }
        .light .si-orb-blue { background: radial-gradient(circle, rgba(126,184,247,0.16) 0%, transparent 70%); }

        .si-card {
          position: relative;
          z-index: 5;
          width: 100%;
          max-width: 440px;
          border-radius: 20px;
          padding: 2.5rem;
          border: 1px solid;
          backdrop-filter: blur(8px);
          animation: siFadeUp 0.5s ease both;
        }
        .dark  .si-card { background: rgba(255,255,255,0.03); border-color: rgba(255,255,255,0.08); }
        .light .si-card { background: rgba(255,255,255,0.75); border-color: rgba(0,0,0,0.07); box-shadow: 0 8px 40px rgba(0,0,0,0.07); }

        .si-title {
          font-family: 'Playfair Display', serif;
          font-size: 2rem;
          font-weight: 700;
          letter-spacing: -0.02em;
          margin-bottom: 0.3rem;
        }
        .si-sub {
          font-size: 0.87rem;
          font-weight: 300;
          opacity: 0.45;
          margin-bottom: 1.75rem;
        }

        .si-field {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
          margin-bottom: 1rem;
        }
        .si-label {
          font-size: 0.72rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          font-weight: 500;
          opacity: 0.45;
        }
        .si-input {
          padding: 0.75rem 1rem;
          border-radius: 10px;
          border: 1px solid;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.93rem;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          width: 100%;
        }
        .dark  .si-input { background: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.1); color: #f0ede8; }
        .light .si-input { background: rgba(0,0,0,0.02);       border-color: rgba(0,0,0,0.1);       color: #1a1814; }
        .si-input:focus { border-color: #e8b86d; box-shadow: 0 0 0 3px rgba(232,184,109,0.15); }
        .si-input::placeholder { opacity: 0.35; }

        .si-btn {
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
          transition: transform 0.18s, box-shadow 0.18s;
        }
        .si-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(232,184,109,0.3); }

        .si-divider {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin: 1.5rem 0;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          opacity: 0.3;
        }
        .si-divider::before, .si-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: currentColor;
        }

        .si-google { display: flex; justify-content: center; }

        .si-error {
          font-size: 0.84rem;
          color: #f87171;
          padding: 0.6rem 0.9rem;
          border-radius: 8px;
          background: rgba(248,113,113,0.1);
          border: 1px solid rgba(248,113,113,0.2);
          margin-bottom: 1rem;
        }

        .si-link-row {
          text-align: center;
          margin-top: 1.5rem;
          font-size: 0.84rem;
          opacity: 0.5;
        }
        .si-link-row a { color: #e8b86d; text-decoration: none; opacity: 1; font-weight: 500; }
        .si-link-row a:hover { text-decoration: underline; }

        @keyframes siFadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <nav className="si-nav">
        <Link to="/" className="si-logo">IELTS Maxxing<span>/ Prateek</span></Link>
        <button className="si-theme-btn" onClick={toggleTheme}>
          {isDark ? "☀ Light" : "☾ Dark"}
        </button>
      </nav>

      <div className="si-body">
        <div className="si-orb si-orb-gold" style={{ width: 500, height: 500, top: -100, right: -100 }} />
        <div className="si-orb si-orb-blue" style={{ width: 350, height: 350, bottom: -50, left: -80 }} />

        <div className="si-card">
          <h1 className="si-title">Welcome back.</h1>
          <p className="si-sub">Sign in to continue your prep journey.</p>

          {error && <div className="si-error">{error}</div>}

          <form onSubmit={submit}>
            <div className="si-field">
              <label className="si-label">Email</label>
              <input
                className="si-input"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div className="si-field">
              <label className="si-label">Password</label>
              <input
                type="password"
                className="si-input"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>
            <button type="submit" className="si-btn">Sign In →</button>
          </form>

          <div className="si-divider">or</div>

          <div className="si-google">
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={() => setError("Google login failed")}
            />
          </div>

          <p className="si-link-row">
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}