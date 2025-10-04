// src/pages/Account.tsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";

type Me = {
  userId: number | string;
  email: string;
  name?: string;
  role?: string;
};

type OrderItem = {
  orderItemId: number;
  wineId: number;
  quantity: number;
  unitPrice: number;
  // backend često vraća i ugnježden Wine:
  wine?: { wineId: number; name: string; price?: number };
  // ponekad backend vraća i "subtotal" (computed kolona); fallback računamo:
  subtotal?: number;
};

type Order = {
  orderId: number;
  userId: number;
  orderDate: string;          // ISO
  status: string;             // Pending/Paid/...
  totalAmount?: number;       // može da postoji iz baze/DTO-a
  shippingAddress?: string;
  billingAddress?: string;
  orderItems?: OrderItem[];
  user?: { userId: number; email: string; firstName?: string; lastName?: string };
};

function formatMoney(n?: number) {
  if (n == null) return "—";
  return new Intl.NumberFormat("sr-RS", { style: "currency", currency: "RSD", maximumFractionDigits: 0 }).format(n);
}
function formatDate(iso?: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("sr-RS", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" });
}

export default function Account() {
  const nav = useNavigate();
  const [me, setMe] = useState<Me | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        // Identitet (moraš imati token u Authorization header-u -> axios interceptor)
        const meRes = await api.get<Me>("/api/Auth/me");
        if (!mounted) return;
        setMe(meRes.data);

        // Sve porudžbine (DTO iz backend-a već sadrži User i OrderItems)
        const oRes = await api.get<{ data?: Order[] } | Order[]>("/api/Orders");
        if (!mounted) return;

        const all = Array.isArray(oRes.data) ? oRes.data : (oRes.data?.data ?? []);
        // prikaži samo moje narudžbine
        const mine = all.filter(o => String(o.userId ?? o.user?.userId) === String(meRes.data.userId));

        setOrders(mine);
      } catch (e: any) {
        console.error("ACCOUNT ERROR", e?.response || e);
        if (e?.response?.status === 401) {
          // nisi ulogovan → na login
          nav("/login", { replace: true });
          return;
        }
        setErr(e?.response?.data?.message || e?.message || "Failed to load account.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [nav]);

  const totalSpent = useMemo(() => {
    return orders.reduce((sum, o) => {
      const t = o.totalAmount ?? (o.orderItems ?? []).reduce((s, it) => s + (it.subtotal ?? it.quantity * it.unitPrice), 0);
      return sum + t;
    }, 0);
  }, [orders]);

  if (loading) {
    return (
      <section className="container-wide" style={{ padding: "2rem 0" }}>
        <div className="card" style={{ padding: "1.25rem" }}>Loading your account…</div>
      </section>
    );
  }
  if (err) {
    return (
      <section className="container-wide" style={{ padding: "2rem 0" }}>
        <div className="card" style={{ padding: "1.25rem", borderLeft: "4px solid var(--danger,#c00)" }}>{err}</div>
      </section>
    );
  }

  return (
    <section className="container-wide" style={{ padding: "2rem 0" }}>
      {/* Header */}
      <header style={{ marginBottom: "1.25rem" }}>
        <h1 style={{ margin: 0, fontFamily: "Playfair Display, serif" }}>My Account</h1>
        <p style={{ margin: "0.25rem 0 0", color: "#666" }}>
          Welcome{me?.name ? `, ${me.name}` : ""}. Here are your details and orders.
        </p>
      </header>

      {/* Grid: profile + summary */}
      <div className="grid" style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "1rem", marginBottom: "1rem" }}>
        <article className="card" style={{ padding: "1rem" }}>
          <h3 style={{ marginTop: 0 }}>Profile</h3>
          <div style={{ lineHeight: 1.8 }}>
            <div><strong>Email:</strong> {me?.email}</div>
            <div><strong>Name:</strong> {me?.name || "—"}</div>
            <div><strong>Role:</strong> {me?.role || "Customer"}</div>
          </div>
        </article>

        <article className="card" style={{ padding: "1rem" }}>
          <h3 style={{ marginTop: 0 }}>Summary</h3>
          <div style={{ lineHeight: 1.8 }}>
            <div><strong>Orders:</strong> {orders.length}</div>
            <div><strong>Total spent:</strong> {formatMoney(totalSpent)}</div>
          </div>
        </article>
      </div>

      {/* Orders list */}
      <article className="card" style={{ padding: "1rem" }}>
        <h3 style={{ marginTop: 0 }}>My Orders</h3>

        {orders.length === 0 ? (
          <p style={{ color: "#666", marginBottom: 0 }}>You have no orders yet.</p>
        ) : (
          <div className="orders-table" style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ textAlign: "left", borderBottom: "1px solid #eee" }}>
                  <th style={{ padding: "0.5rem" }}>#</th>
                  <th style={{ padding: "0.5rem" }}>Date</th>
                  <th style={{ padding: "0.5rem" }}>Status</th>
                  <th style={{ padding: "0.5rem" }}>Items</th>
                  <th style={{ padding: "0.5rem", textAlign: "right" }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {orders
                  .sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime())
                  .map((o) => {
                    const total = o.totalAmount ?? (o.orderItems ?? []).reduce((s, it) => s + (it.subtotal ?? it.quantity * it.unitPrice), 0);
                    const itemsTxt = (o.orderItems ?? [])
                      .map(it => `${it.wine?.name ?? `Wine #${it.wineId}`} × ${it.quantity}`)
                      .join(", ");

                    return (
                      <tr key={o.orderId} style={{ borderBottom: "1px solid #f0f0f0" }}>
                        <td style={{ padding: "0.6rem 0.5rem" }}><strong>#{o.orderId}</strong></td>
                        <td style={{ padding: "0.6rem 0.5rem" }}>{formatDate(o.orderDate)}</td>
                        <td style={{ padding: "0.6rem 0.5rem" }}>
                          <span className="badge" style={{ fontSize: 12 }}>
                            {o.status}
                          </span>
                        </td>
                        <td style={{ padding: "0.6rem 0.5rem", color: "#555" }}>{itemsTxt || "—"}</td>
                        <td style={{ padding: "0.6rem 0.5rem", textAlign: "right" }}>
                          <strong>{formatMoney(total)}</strong>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        )}
      </article>
    </section>
  );
}
