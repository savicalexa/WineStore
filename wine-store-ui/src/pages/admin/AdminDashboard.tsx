// src/pages/admin/AdminDashboard.tsx
import { useEffect, useMemo, useState } from "react";
import { adminApi } from "../../services/admin";
import type { AdminWine } from "../../services/admin"; // type-only import
import "../../app.css";

type Tab = "wines" | "wineries" | "categories" | "orders";

export default function AdminDashboard() {
  const [tab, setTab] = useState<Tab>("wines");

  const [wines, setWines] = useState<AdminWine[]>([]);
  const [wineries, setWineries] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // add wine modal
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState<{ name: string; price: string; year: string; categoryId: string; wineryId: string }>({
    name: "",
    price: "",
    year: "",
    categoryId: "",
    wineryId: "",
  });

  async function load() {
    setLoading(true);
    setErr(null);
    try {
      const [w, c, wi] = await Promise.all([
        adminApi.listWines(),
        adminApi.listCategories(),
        adminApi.listWineries(),
      ]);
      setWines(w);
      setCategories(c);
      setWineries(wi);
      // orders ucitaj samo kad se otvori tab
    } catch (e: any) {
      setErr(e?.response?.data?.message || e?.message || "Failed to load admin data.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  useEffect(() => {
    if (tab === "orders") {
      (async () => {
        setLoading(true);
        try {
          const o = await adminApi.listOrders();
          setOrders(o);
        } catch (e: any) {
          setErr(e?.response?.data?.message || e?.message || "Failed to load orders.");
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [tab]);

  async function handleCreateWine(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    try {
      await adminApi.createWine({
        name: form.name.trim(),
        price: Number(form.price),
        year: form.year ? Number(form.year) : undefined,
        categoryId: Number(form.categoryId),
        wineryId: Number(form.wineryId),
      });
      setShowAdd(false);
      setForm({ name: "", price: "", year: "", categoryId: "", wineryId: "" });
      const list = await adminApi.listWines();
      setWines(list);
    } catch (e: any) {
      setErr(e?.response?.data?.message || e?.message || "Failed to create wine.");
    }
  }

  const title = useMemo(() => tab[0].toUpperCase() + tab.slice(1), [tab]);

  return (
    <section className="container-wide" style={{ padding: "2rem 0" }}>
      <h1>Admin</h1>

      <div className="tabs" style={{ display: "flex", gap: 12, marginBottom: 16 }}>
        {(["wines", "wineries", "categories", "orders"] as Tab[]).map((t) => (
          <button
            key={t}
            className={tab === t ? "active" : ""}
            onClick={() => setTab(t)}
            style={{ padding: ".5rem .9rem", borderRadius: ".75rem", border: "1px solid #e8e8e8" }}
          >
            {t[0].toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {err && <div style={{ color: "var(--danger,#a00)", marginBottom: 12 }}>{err}</div>}
      {loading ? <p>Loading…</p> : null}

      {/* WINES */}
      {tab === "wines" && (
        <article className="card" style={{ padding: 0 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.8rem 1rem" }}>
            <h3 style={{ margin: 0 }}>Wines</h3>
            <button className="btn-primary" onClick={() => setShowAdd(true)}>Add wine</button>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Year</th>
                  <th>Price</th>
                  <th>Category</th>
                  <th>Winery</th>
                </tr>
              </thead>
              <tbody>
                {wines.length === 0 ? (
                  <tr><td colSpan={5} style={{ padding: "1rem", color: "#666" }}>No wines</td></tr>
                ) : wines.map((w) => (
                  <tr key={w.wineId}>
                    <td>{w.name}</td>
                    <td>{w.year ?? "—"}</td>
                    <td>{w.price}</td>
                    <td>{w.category?.name ?? "—"}</td>
                    <td>{w.winery?.name ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {showAdd && (
            <div
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,.45)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 50,
              }}
              onClick={() => setShowAdd(false)}
            >
              <form
                onSubmit={handleCreateWine}
                onClick={(e) => e.stopPropagation()}
                style={{
                  background: "#fff",
                  padding: "1.25rem",
                  borderRadius: "1rem",
                  display: "grid",
                  gap: "0.75rem",
                  minWidth: 360,
                  boxShadow: "0 10px 30px rgba(16,24,40,.15)",
                }}
              >
                <h3 style={{ margin: 0 }}>Add wine</h3>

                <input
                  placeholder="Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
                <input
                  placeholder="Year (optional)"
                  type="number"
                  min={1900}
                  max={new Date().getFullYear() + 1}
                  value={form.year}
                  onChange={(e) => setForm({ ...form, year: e.target.value })}
                />
                <input
                  placeholder="Price (RSD)"
                  type="number"
                  step="0.01"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  required
                />

                <select
                  value={form.categoryId}
                  onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                  required
                >
                  <option value="">Select category</option>
                  {categories.map((c) => (
                    <option key={c.categoryId} value={c.categoryId}>
                      {c.name}
                    </option>
                  ))}
                </select>

                <select
                  value={form.wineryId}
                  onChange={(e) => setForm({ ...form, wineryId: e.target.value })}
                  required
                >
                  <option value="">Select winery</option>
                  {wineries.map((wi) => (
                    <option key={wi.wineryId} value={wi.wineryId}>
                      {wi.name}
                    </option>
                  ))}
                </select>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
                  <button type="button" onClick={() => setShowAdd(false)}>Cancel</button>
                  <button type="submit" className="btn-primary">Save</button>
                </div>
              </form>
            </div>
          )}
        </article>
      )}

      {/* WINERIES */}
      {tab === "wineries" && (
        <article className="card" style={{ padding: 0 }}>
          <div style={{ padding: "0.8rem 1rem" }}><h3 style={{ margin: 0 }}>Wineries</h3></div>
          <div style={{ overflowX: "auto" }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Country</th>
                </tr>
              </thead>
              <tbody>
                {wineries.length === 0 ? (
                  <tr><td colSpan={3} style={{ padding: "1rem", color: "#666" }}>No wineries</td></tr>
                ) : wineries.map((w: any) => (
                  <tr key={w.wineryId}>
                    <td>{w.wineryId}</td>
                    <td>{w.name}</td>
                    <td>{w.country ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
      )}

      {/* CATEGORIES */}
      {tab === "categories" && (
        <article className="card" style={{ padding: 0 }}>
          <div style={{ padding: "0.8rem 1rem" }}><h3 style={{ margin: 0 }}>Categories</h3></div>
          <div style={{ overflowX: "auto" }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {categories.length === 0 ? (
                  <tr><td colSpan={3} style={{ padding: "1rem", color: "#666" }}>No categories</td></tr>
                ) : categories.map((c: any) => (
                  <tr key={c.categoryId}>
                    <td>{c.categoryId}</td>
                    <td>{c.name}</td>
                    <td>{c.description ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
      )}

      {/* ORDERS */}
      {tab === "orders" && (
        <article className="card" style={{ padding: 0 }}>
          <div style={{ padding: "0.8rem 1rem" }}><h3 style={{ margin: 0 }}>Orders</h3></div>
          <div style={{ overflowX: "auto" }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>User</th>
                  <th>Status</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr><td colSpan={4} style={{ padding: "1rem", color: "#666" }}>No orders</td></tr>
                ) : orders.map((o: any) => (
                  <tr key={o.orderId}>
                    <td>{o.orderId}</td>
                    <td>{o.user?.email ?? o.userEmail ?? "—"}</td>
                    <td>{o.status}</td>
                    <td>{o.totalAmount ?? o.total ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
      )}
    </section>
  );
}
