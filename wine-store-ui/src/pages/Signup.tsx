import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../lib/api";

export default function Signup() {
  const nav = useNavigate();
  const [name, setName]   = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass]   = useState("");
  const [pass2, setPass2] = useState("");
  const [terms, setTerms] = useState(false);
  const [err, setErr]     = useState<string | null>(null);

  const canSubmit = name && email && pass && pass2 && pass === pass2 && terms;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    if (!canSubmit) return;

    try {
      const [firstName, ...rest] = name.trim().split(" ");
      const lastName = rest.join(" ") || "-";

      await api.post("/api/users", {
        firstName,
        lastName,
        email,
        password: pass,
        role: "Customer"
      });

      nav("/login");
    } catch (ex: any) {
      setErr(ex?.response?.data?.message || "Registration failed.");
    }
  }

  return (
    <section className="auth-wrap brand-auth">
      <div className="auth-right brand-grad">
        <div className="auth-right-inner">
          <h2>Welcome!</h2>
          <p>Create an account to start ordering today.</p>
          <p style={{ opacity: .9 }}>Exclusive offers, faster checkout, saved addresses.</p>
          <Link to="/login" className="btn-ghost" style={{ marginTop: 12 }}>I already have an account</Link>
        </div>
      </div>

      <div className="auth-left">
        <div className="auth-card">
          <h1>Sign Up</h1>

          <form onSubmit={onSubmit} className="auth-form" autoComplete="on">
            <label className="input-row light">
              <span className="input-label">Full name</span>
              <input
                type="text"
                placeholder="Ana Enchanté"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </label>

            <label className="input-row light">
              <span className="input-label">Email</span>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>

            <label className="input-row light">
              <span className="input-label">Password</span>
              <input
                type="password"
                placeholder="••••••••"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                required
              />
            </label>

            <label className="input-row light">
              <span className="input-label">Confirm password</span>
              <input
                type="password"
                placeholder="••••••••"
                value={pass2}
                onChange={(e) => setPass2(e.target.value)}
                required
              />
            </label>

            <div className="form-row" style={{ justifyContent: "flex-start" }}>
              <label className="remember">
                <input
                  type="checkbox"
                  checked={terms}
                  onChange={(e) => setTerms(e.target.checked)}
                />
                <span>I accept the Terms & Privacy</span>
              </label>
            </div>

            <div className="form-row" style={{ marginTop: 12 }}>
              <button type="submit" className="btn-primary" disabled={!canSubmit}>
                Create account
              </button>
            </div>

            {err && <small style={{ color: "var(--danger, #c00)" }}>{err}</small>}
          </form>
        </div>
      </div>
    </section>
  );
}
