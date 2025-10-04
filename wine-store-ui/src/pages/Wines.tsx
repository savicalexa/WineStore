import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import api from "../lib/api";

type WineReadDto = {
  wineId: number;
  name: string;
  price: number;
  imageUrl?: string | null;
  year?: number | null;
  wineryName?: string | null;
  categoryName?: string | null;
};

type Paged<T> = {
  total: number;
  page: number;
  pageSize: number;
  data: T[];
};

const SORTS = [
  { v: "price_asc",  label: "Cena ↑",  by: "price", dir: "asc"  },
  { v: "price_desc", label: "Cena ↓",  by: "price", dir: "desc" },
  { v: "name_asc",   label: "Naziv A–Z", by: "name",  dir: "asc"  },
  { v: "name_desc",  label: "Naziv Z–A", by: "name",  dir: "desc" }
];

export default function Wines() {
  const [params, setParams] = useSearchParams();
  const [items, setItems] = useState<WineReadDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const page = Number(params.get("page") || 1);
  const q    = params.get("q") || "";
  const sort = params.get("sort") || "price_asc";
  const min  = params.get("min") || "";
  const max  = params.get("max") || "";

  function setParam(key: string, value: string) {
    const p = new URLSearchParams(params);
    value ? p.set(key, value) : p.delete(key);
    if (key !== "page") p.set("page", "1");
    setParams(p, { replace: true });
  }

  useEffect(() => {
    // sigurniji fetch sa loading/err
    const run = async () => {
      setLoading(true); setErr(null);
      try {
        const cfg = SORTS.find(s => s.v === sort) || SORTS[0];
        const { data } = await api.get<Paged<WineReadDto>>("/api/wines", {
          params: {
            q,
            sortBy: cfg.by,
            sortDir: cfg.dir,
            page,
            pageSize: 20,
            minPrice: min || undefined,
            maxPrice: max || undefined
          }
        });
        setItems(data?.data ?? []);
        setTotal(data?.total ?? 0);
      } catch (ex: any) {
        setErr(ex?.response?.data?.message || "Error.");
        setItems([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [q, sort, page, min, max]);

  const pages = Math.max(1, Math.ceil(total / 20));
  const summary = useMemo(() => {
    const chips: string[] = [];
    if (q) chips.push(`“${q}”`);
    if (min || max) chips.push(`Cena ${min || 0}–${max || "∞"}`);
    return chips;
  }, [q, min, max]);

  return (
    <section className="container-wide catalog">
      {/* Sidebar filteri */}
      <aside className="filter-card">
        <div className="filter-group">
          <strong>Search</strong>
          <input
            value={q}
            onChange={e => setParam("q", e.target.value)}
            placeholder="Naziv, region, sorta..."
          />
        </div>

        <div className="filter-group">
          <strong>Price (€)</strong>
          <div className="price-row">
            <input
              type="number"
              placeholder="min"
              value={min}
              onChange={e => setParam("min", e.target.value)}
            />
            <input
              type="number"
              placeholder="max"
              value={max}
              onChange={e => setParam("max", e.target.value)}
            />
          </div>
        </div>

        {/* ovde možeš dodati filtere: boja, tip, zemlja... */}
      </aside>

      {/* Main */}
      <main>
        <div className="catalog-head">
          <div className="chips">
            {summary.length ? summary.map((s, i) => <span key={i} className="chip active">{s}</span>) : <span className="chip muted">No filter</span>}
          </div>
          <select
            className="sort-select"
            value={sort}
            onChange={e => setParam("sort", e.target.value)}
          >
            {SORTS.map(s => <option key={s.v} value={s.v}>{s.label}</option>)}
          </select>
        </div>

        {/* Stanja: loading / error / empty / data */}
        {loading && (
          <div className="grid-cards">
            {Array.from({length:8}).map((_,i)=>(
              <div key={i} className="card skeleton" />
            ))}
          </div>
        )}

        {err && !loading && (
          <div className="empty-state">
            <p>{err}</p>
          </div>
        )}

        {!err && !loading && items.length === 0 && (
          <div className="empty-state">
            <h3>No results</h3>
            <p>Try different filters</p>
          </div>
        )}

        {!err && !loading && items.length > 0 && (
          <div className="grid-cards">
            {items.map(w => (
              <ProductCard
                key={w.wineId}
                w={{
                  wineId: w.wineId,
                  name: w.name || "Untitled wine",
                  price: Number(w.price) || 0,
                  imageUrl: w.imageUrl,
                  year: w.year,
                  wineryName: w.wineryName || undefined,
                  categoryName: w.categoryName || undefined
                }}
              />
            ))}
          </div>
        )}

        {/* Paginacija */}
        <nav className="pager" aria-label="pagination">
          <button
            onClick={() => setParam("page", String(Math.max(1, page - 1)))}
            disabled={page <= 1 || loading}
          >
            Prev
          </button>
          <span>Page {page} / {pages}</span>
          <button
            onClick={() => setParam("page", String(Math.min(pages, page + 1)))}
            disabled={page >= pages || loading}
          >
            Next
          </button>
        </nav>
      </main>
    </section>
  );
}
