import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../store/cart";
import { useMemo, useState, useEffect, useRef } from "react";

/** Minimalne inline SVG ikone (stroke = currentColor) */
const IconWine = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M8 3h8v3a6 6 0 0 1-6 6v6h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6 3h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
  </svg>
);
const IconCheese = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M3 12l9-6 9 6-9 6-9-6z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
    <circle cx="9" cy="12" r="1" fill="currentColor"/>
    <circle cx="12" cy="10" r="1" fill="currentColor"/>
    <circle cx="15" cy="13" r="1" fill="currentColor"/>
  </svg>
);
const IconGrapes = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <circle cx="8" cy="12" r="2" stroke="currentColor" strokeWidth="1.6"/>
    <circle cx="12" cy="10" r="2" stroke="currentColor" strokeWidth="1.6"/>
    <circle cx="12" cy="14" r="2" stroke="currentColor" strokeWidth="1.6"/>
    <circle cx="16" cy="12" r="2" stroke="currentColor" strokeWidth="1.6"/>
    <path d="M12 6c1-2 2.5-3 4-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
  </svg>
);
const IconPin = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M12 21s7-7 7-11a7 7 0 1 0-14 0c0 4 7 11 7 11z" stroke="currentColor" strokeWidth="1.6"/>
    <circle cx="12" cy="10" r="2" stroke="currentColor" strokeWidth="1.6"/>
  </svg>
);
const IconShield = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7l8-4z" stroke="currentColor" strokeWidth="1.6"/>
    <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IconAa = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M4 18l6-14 6 14M6.5 12h7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IconUser = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="8" r="3" stroke="currentColor" strokeWidth="1.6"/>
    <path d="M5 20c1.5-3 4.5-5 7-5s5.5 2 7 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
  </svg>
);

/** Mali badge */
function NewBadge() {
  return <span className="pill-badge">New</span>;
}

function NavItem({
  to, icon, label, trailing
}: { to: string; icon: React.ReactNode; label: string; trailing?: React.ReactNode }) {
  return (
    <Link to={to} className="nav-item">
      <span className="icon">{icon}</span>
      <span>{label}</span>
      {trailing}
    </Link>
  );
}

/** Ship-to dropdown */
type Country = {
  code: "RS" | "HR" | "BA" | "SI" | "ME" | "MK";
  name: string;
  flag: string; // emoji (može kasnije SVG)
};
const COUNTRIES: Country[] = [
  { code: "RS", name: "Serbia", flag: "🇷🇸" },
  { code: "HR", name: "Croatia", flag: "🇭🇷" },
  { code: "BA", name: "Bosnia & Herzegovina", flag: "🇧🇦" },
  { code: "SI", name: "Slovenia", flag: "🇸🇮" },
  { code: "ME", name: "Montenegro", flag: "🇲🇪" },
  { code: "MK", name: "North Macedonia", flag: "🇲🇰" },
];

function ShipTo({
  value, onChange,
}: { value: Country; onChange: (c: Country) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <div className="shipto" ref={ref}>
      <button
        className="ghost small shipto-btn"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen(o => !o)}
      >
        <span className="shipto-flag">{value.flag}</span>
        <span className="hide-sm">Ship to</span>
      </button>

      {open && (
        <div className="shipto-menu" role="listbox">
          {COUNTRIES.map(c => (
            <button
              key={c.code}
              className={`shipto-item ${c.code === value.code ? "is-selected" : ""}`}
              role="option"
              aria-selected={c.code === value.code}
              onClick={() => { onChange(c); setOpen(false); }}
            >
              <span className="shipto-flag">{c.flag}</span>
              <span>{c.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Header() {
  const nav = useNavigate();
  const { items } = useCart();
  const count = useMemo(() => items.reduce((s, i) => s + i.qty, 0), [items]);
  const [query, setQuery] = useState("");

  // ship-to state sa localStorage
  const [country, setCountry] = useState<Country>(COUNTRIES[0]);
  useEffect(() => {
    const raw = localStorage.getItem("shipTo");
    const found = COUNTRIES.find(c => c.code === raw);
    if (found) setCountry(found);
  }, []);
  useEffect(() => {
    localStorage.setItem("shipTo", country.code);
  }, [country]);

  const goSearch = () => {
    const q = query.trim();
    if (!q) return;
    nav(`/wines?q=${encodeURIComponent(q)}`);
  };

  return (
    <header className="header full-bleed">
      {/* Gornja traka */}
      <div className="container-wide topbar">
        <Link to="/" className="brand vivino">
          ENCHANTÉ <span className="brand-flag">{country.flag}</span>
        </Link>

        <div className="search-wrap">
          <input
            className="search"
            placeholder="Search any wine"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && goSearch()}
          />
        </div>

        <div className="topbar-right">
          {/* Ship to dropdown */}
          <ShipTo value={country} onChange={setCountry} />

         

          <Link to="/login" className="ghost small"><IconUser /></Link>
          <button className="secondary outline small" onClick={() => nav("/cart")}>
            Cart {count > 0 && <span className="badge">{count}</span>}
          </button>
        </div>
      </div>

      {/* Donja traka (ikonisani meni) */}
      <div className="container-wide menubar">
        <nav className="menu">
          <NavItem to="/wines" icon={<IconWine />} label="Wines" />
          <NavItem to="/pairing" icon={<IconCheese />} label="Pairings" />
          <NavItem to="/grapes" icon={<IconGrapes />} label="Grapes" />
          <NavItem to="/regions" icon={<IconPin />} label="Regions" />
          <NavItem to="/blog" icon={<IconShield />} label="Premium" />
          <NavItem to="/blog" icon={<IconShield />} label="Wineries" trailing={<NewBadge />} />
        </nav>
      </div>
    </header>
  );
}
