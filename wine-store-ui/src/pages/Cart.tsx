import { useCart } from "../store/cart";
import { useNavigate, Link } from "react-router-dom";
import { useMemo } from "react";

const CURRENCY = "€"; // promeni u "RSD" ako želiš

export default function Cart() {
  const { items, remove, setQty, clear } = useCart();
  const nav = useNavigate();

  const total = useMemo(
    () => items.reduce((s, i) => s + i.price * i.qty, 0),
    [items]
  );

  if (items.length === 0) {
    return (
      <section className="container-wide">
        <div className="cart-empty">
          <h1 className="brand">Your cart is empty</h1>
          <p>Discover our curated selection and add your favorites.</p>
          <Link to="/wines" className="btn-primary">Browse wines</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="container-wide cart-wrap">
      <h1 className="brand cart-title">Cart</h1>

      <div className="cart-table" role="table" aria-label="Shopping cart">
        <div className="cart-thead" role="rowgroup">
          <div className="cart-tr" role="row">
            <div className="cart-th" role="columnheader">Wine</div>
            <div className="cart-th qty" role="columnheader">Qty</div>
            <div className="cart-th price" role="columnheader">Price</div>
            <div className="cart-th actions" role="columnheader" />
          </div>
        </div>

        <div className="cart-tbody" role="rowgroup">
          {items.map((i) => (
            <div className="cart-tr" role="row" key={i.wineId}>
              <div className="cart-td">
                <div className="cart-name">{i.name}</div>
              </div>

              <div className="cart-td qty">
                <div className="qty-control" aria-label={`Quantity for ${i.name}`}>
                  <button
                    className="qty-btn"
                    onClick={() => setQty(i.wineId, Math.max(1, i.qty - 1))}
                    aria-label="Decrease"
                  >
                    −
                  </button>
                  <input
                    inputMode="numeric"
                    value={i.qty}
                    onChange={(e) =>
                      setQty(i.wineId, Math.max(1, Number(e.target.value) || 1))
                    }
                    aria-label="Quantity"
                  />
                  <button
                    className="qty-btn"
                    onClick={() => setQty(i.wineId, i.qty + 1)}
                    aria-label="Increase"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="cart-td price">
                <strong>{i.price.toFixed(2)}</strong>
                <span className="currency"> {CURRENCY}</span>
              </div>

              <div className="cart-td actions">
                <button className="btn-ghost danger" onClick={() => remove(i.wineId)}>
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="cart-footer">
        <button className="btn-ghost" onClick={clear}>Clear cart</button>

        <div className="cart-summary">
          <div className="cart-total">
            <span>Total:</span>
            <strong>{total.toFixed(2)}</strong>
            <span className="currency"> {CURRENCY}</span>
          </div>
          <button className="btn-primary large" onClick={() => nav("/checkout")}>
            Proceed to checkout
          </button>
        </div>
      </div>
    </section>
  );
}
