import { useState } from "react";
import type { FormEvent } from "react";
import { useCart } from "../store/cart";
import api from "../lib/api"; // our axios instance

export default function Checkout() {
  const { items, clear } = useCart();
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const total = items.reduce((s, i) => s + i.price * i.qty, 0);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (items.length === 0) return;
    setLoading(true); setMsg(null);

    const fd = new FormData(e.currentTarget);
    const fullName = String(fd.get("name") || "");
    const [firstName, ...rest] = fullName.trim().split(" ");
    const lastName = rest.join(" ") || "-";

    try {
      // 1) (demo) create user if needed OR use an existing user id
      // For now we will assume demo user with id=1 exists.
      const userId = 1;

      // 2) create order with items (backend: POST /api/orders)
      const orderPayload = {
        userId,
        shippingAddress: String(fd.get("address") || ""),
        billingAddress: null,
        items: items.map(i => ({
          wineId: i.wineId,
          quantity: i.qty,
          unitPrice: i.price
        }))
      };

      const res = await api.post("/api/orders", orderPayload);

      // 3) (optional) create a payment on the backend or redirect to Stripe later
      // await api.post("/api/payments", { orderId: res.data.orderId, amount: total, currency: "EUR", paymentMethod: "CreditCard" });

      setMsg("Order placed successfully.");
      clear();
    } catch (err: any) {
      setMsg(err?.response?.data?.message || "Error while placing order.");
    } finally {
      setLoading(false);
    }
  }

  if (items.length === 0) return <p>Your cart is empty.</p>;

  return (
    <section>
      <h2 className="brand" style={{ fontSize: "1.5rem" }}>Checkout</h2>
      <form onSubmit={onSubmit} style={{ display: "grid", gap: "0.75rem", maxWidth: 520 }}>
        <label>Full name<input name="name" required placeholder="John Doe" /></label>
        <label>Email<input type="email" name="email" required placeholder="you@example.com" /></label>
        <label>Address<textarea name="address" rows={3} required placeholder="Street, City, Country" /></label>
        <small>Total: <strong>{total.toFixed(2)} €</strong></small>
        <button className="contrast" disabled={loading}>{loading ? "Submitting…" : "Pay"}</button>
        {msg && <small>{msg}</small>}
      </form>
    </section>
  );
}
