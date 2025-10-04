import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const nav = useNavigate();
  const { login } = useAuth();
  const [email,setEmail] = useState(""); const [pass,setPass] = useState("");
  const [err,setErr] = useState<string|null>(null); const [loading,setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent){
    e.preventDefault(); setErr(null); setLoading(true);
    try{
      await login(email, pass);
      const auth = JSON.parse(localStorage.getItem("auth") || "null");
      if (auth?.user?.role === "Admin") nav("/admin", { replace:true });
      else nav("/", { replace:true });
    } catch(ex:any){
      console.error("LOGIN ERROR", ex?.response || ex);
      setErr(ex?.response?.data?.message || ex?.message || "Login failed.");
    } finally { setLoading(false); }
  }

  return (
    <section className="auth-wrap brand-auth">
      <div className="auth-left">
        <div className="auth-card">
          <h1>Sign In</h1>
          <form onSubmit={onSubmit} className="auth-form" autoComplete="on">
            <label className="input-row light">
              <span className="input-label">Email</span>
              <input type="email" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)} required />
            </label>
            <label className="input-row light">
              <span className="input-label">Password</span>
              <input type="password" placeholder="••••••••" value={pass} onChange={e=>setPass(e.target.value)} required />
            </label>
            <div className="form-row">
              <div />
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? "Signing in…" : "Login"}
              </button>
            </div>
            {err && <small style={{ color: "var(--danger,#c00)" }}>{err}</small>}
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
