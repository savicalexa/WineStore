import { useCart } from "../store/cart";

type ProductCardProps = {
  w: {
    wineId: number;
    name: string;
    price: number;
    imageUrl?: string | null;
    year?: number | null;
    wineryName?: string;
    categoryName?: string;
  };
};

export default function ProductCard({ w }: ProductCardProps) {
  const { add } = useCart();

  const subtitle =
    [w.wineryName, w.categoryName].filter(Boolean).join(" • ") ||
    (w.year ? String(w.year) : "—");

  const imgSrc = w.imageUrl || "/placeholder-bottle.png";

  return (
    <article className="card product-card">
      <div className="thumb">
        <img
          src={imgSrc}
          alt={w.name}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          loading="lazy"
        />
      </div>

      <h3 className="title">{w.name}</h3>

      <div className="meta">{subtitle}</div>

      <div className="badges">
        {/* ako budeš slao bedževe sa BE, ostaje podrška */}
        {/* {w.badges?.map((b: string) => (
          <span key={b} className="badge">{b}</span>
        ))} */}
      </div>

      <div className="actions">
        <div className="price">
          {Number(w.price).toFixed(2)}
          <span className="currency"> €</span>
        </div>

        <button
          className="add-btn"
          onClick={() => add({ wineId: w.wineId, name: w.name, price: w.price })}
          aria-label={`Dodaj ${w.name} u korpu`}
        >
          ADD
        </button>
      </div>
    </article>
  );
}
