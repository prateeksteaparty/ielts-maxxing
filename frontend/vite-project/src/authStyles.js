/* Shared auth page CSS injected as a string — import via <style> tag in each auth component */
export const authStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&family=DM+Sans:wght@300;400;500&display=swap');

  .auth-root {
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    transition: background 0.4s ease, color 0.4s ease;
  }
  .auth-root.dark  { background: #0c0c10; color: #f0ede8; }
  .auth-root.light { background: #faf8f4; color: #1a1814; }

  /* nav */
  .auth-nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem 3rem;
    border-bottom: 1px solid;
  }
  .dark .auth-nav  { border-color: rgba(255,255,255,0.06); }
  .light .auth-nav { border-color: rgba(0,0,0,0.06); }
  .auth-logo {
    font-family: 'Playfair Display', serif;
    font-size: 1.1rem;
    font-weight: 700;
    text-decoration: none;
  }
  .dark  .auth-logo { color: #f0ede8; }
  .light .auth-logo { color: #1a1814; }
  .auth-logo span { opacity: 0.4; font-weight: 400; }
  .theme-toggle-btn {
    border: none;
    cursor: pointer;
    padding: 0.45rem 1rem;
    border-radius: 100px;
    font-size: 0.82rem;
    font-family: 'DM Sans', sans-serif;
    transition: background 0.2s;
  }
  .dark  .theme-toggle-btn { background: rgba(255,255,255,0.07); color: #f0ede8; }
  .light .theme-toggle-btn { background: rgba(0,0,0,0.06); color: #1a1814; }
  .dark  .theme-toggle-btn:hover { background: rgba(255,255,255,0.13); }
  .light .theme-toggle-btn:hover { background: rgba(0,0,0,0.11); }

  /* layout */
  .auth-body {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 3rem 1.5rem;
    position: relative;
  }

  .auth-orb {
    position: absolute;
    border-radius: 50%;
    pointer-events: none;
  }
  .dark  .auth-orb-gold { background: radial-gradient(circle, rgba(232,184,109,0.14) 0%, transparent 70%); }
  .light .auth-orb-gold { background: radial-gradient(circle, rgba(232,184,109,0.22) 0%, transparent 70%); }
  .dark  .auth-orb-blue { background: radial-gradient(circle, rgba(126,184,247,0.10) 0%, transparent 70%); }
  .light .auth-orb-blue { background: radial-gradient(circle, rgba(126,184,247,0.16) 0%, transparent 70%); }

  /* card */
  .auth-card {
    position: relative;
    z-index: 5;
    width: 100%;
    max-width: 440px;
    border-radius: 20px;
    padding: 2.5rem;
    border: 1px solid;
    backdrop-filter: blur(8px);
  }
  .dark  .auth-card { background: rgba(255,255,255,0.03); border-color: rgba(255,255,255,0.08); }
  .light .auth-card { background: rgba(255,255,255,0.7); border-color: rgba(0,0,0,0.07); box-shadow: 0 8px 40px rgba(0,0,0,0.06); }

  .auth-title {
    font-family: 'Playfair Display', serif;
    font-size: 2rem;
    font-weight: 700;
    letter-spacing: -0.02em;
    margin-bottom: 0.4rem;
  }
  .auth-sub {
    font-size: 0.88rem;
    opacity: 0.45;
    margin-bottom: 2rem;
    font-weight: 300;
  }

  /* inputs */
  .auth-field {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    margin-bottom: 1rem;
  }
  .auth-label {
    font-size: 0.78rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    font-weight: 500;
    opacity: 0.5;
  }
  .auth-input {
    padding: 0.75rem 1rem;
    border-radius: 10px;
    border: 1px solid;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.95rem;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
    width: 100%;
    box-sizing: border-box;
  }
  .dark  .auth-input { background: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.1); color: #f0ede8; }
  .light .auth-input { background: rgba(0,0,0,0.03); border-color: rgba(0,0,0,0.12); color: #1a1814; }
  .auth-input:focus { border-color: #e8b86d; box-shadow: 0 0 0 3px rgba(232,184,109,0.15); }
  .auth-input::placeholder { opacity: 0.4; }

  /* button */
  .auth-btn-primary {
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
    margin-top: 0.5rem;
    transition: transform 0.18s, box-shadow 0.18s, opacity 0.18s;
  }
  .auth-btn-primary:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(232,184,109,0.3); }
  .auth-btn-primary:disabled { opacity: 0.55; cursor: not-allowed; }

  /* divider */
  .auth-divider {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin: 1.5rem 0;
    font-size: 0.78rem;
    opacity: 0.35;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }
  .auth-divider::before, .auth-divider::after {
    content: '';
    flex: 1;
    height: 1px;
    background: currentColor;
  }

  /* google wrapper */
  .auth-google { display: flex; justify-content: center; }

  /* error */
  .auth-error {
    font-size: 0.85rem;
    color: #f87171;
    margin-bottom: 1rem;
    padding: 0.6rem 0.9rem;
    border-radius: 8px;
    background: rgba(248,113,113,0.1);
    border: 1px solid rgba(248,113,113,0.2);
  }

  /* link row */
  .auth-link-row {
    text-align: center;
    margin-top: 1.5rem;
    font-size: 0.85rem;
    opacity: 0.5;
  }
  .auth-link-row a {
    color: #e8b86d;
    text-decoration: none;
    opacity: 1;
    font-weight: 500;
  }
  .auth-link-row a:hover { text-decoration: underline; }

  @keyframes authFadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .auth-card { animation: authFadeIn 0.5s ease both; }
`;