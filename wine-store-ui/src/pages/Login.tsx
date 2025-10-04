import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext"; // ovo ćemo napraviti za token i user info

export default function Login() {
  const { login, user } = useAuth();
  const nav = useNavigate();
  const loc = useLocation() as any;

  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [remember, setRemember] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    try {
      await login(email, pass);

      const isAdmin = (r?: string) => !!r && r.trim().toLowerCase() === "admin";
      const raw = localStorage.getItem("auth_user");
      const u = user; 
      if (isAdmin(u?.role)) {
        nav("/admin", { replace: true });
      } else {
        nav(loc.state?.from?.pathname || "/account", { replace: true });
      }


      if (u?.role === "Admin") {
        nav("/admin", { replace: true });
      } else {
        nav(loc.state?.from?.pathname || "/account", { replace: true });
      }
    } catch (ex: any) {
      setErr(ex?.response?.data?.message || "Invalid credentials.");
    }
  }

  return (
    <section className="auth-wrap brand-auth">
      <div className="auth-left">
        <div className="auth-card">
          <h1>Sign In</h1>

          <form onSubmit={onSubmit} className="auth-form" autoComplete="on">
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

            <div className="form-row">
              <label className="remember">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                <span>Remember me</span>
              </label>

              <button type="submit" className="btn-primary">
                Login
              </button>
            </div>

            {err && <small style={{ color: "var(--danger, #c00)" }}>{err}</small>}
          </form>
        </div>
      </div>

      <div className="auth-right brand-grad">
        <div className="auth-right-inner">
          <h2>New here?</h2>
          <p>Create an account to start ordering today!</p>
          <Link to="/signup" className="btn-ghost">Register</Link>
        </div>
      </div>
    </section>
  );
}
