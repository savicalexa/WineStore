import { useEffect, useState } from "react";
import api from "../lib/api";
import Hero from "../components/Hero";
import ProductCard from "../components/ProductCard";
import type { WineReadDto } from "../types/api";

export default function Home() {
  const [featured, setFeatured] = useState<WineReadDto[]>([]);
  const [bests, setBests] = useState<WineReadDto[]>([]);
  const [fresh, setFresh] = useState<WineReadDto[]>([]);

  useEffect(() => {
    api.get("/api/wines", { params: { page: 1, pageSize: 8, sortBy: "name", sortDir: "asc" } })
      .then(r => setFeatured(r.data.data || []))
      .catch(() => setFeatured([]));

    api.get("/api/wines", { params: { page: 1, pageSize: 8, sortBy: "price", sortDir: "desc" } })
      .then(r => setBests(r.data.data || []))
      .catch(() => setBests([]));

    api.get("/api/wines", { params: { page: 1, pageSize: 8 } })
      .then(r => setFresh(r.data.data || []))
      .catch(() => setFresh([]));
  }, []);

  return (
    <>
      <Hero />

      <div className="section">
        <h2>Editor’s Picks</h2><p>Curated selection of bottles</p>
      </div>
      <div className="grid-5">{featured.map(w => <ProductCard key={w.wineId} w={w} />)}</div>

      <div className="section">
        <h2>Best Sellers</h2><p>Most popular wines</p>
      </div>
      <div className="grid-5">{bests.map(w => <ProductCard key={w.wineId} w={w} />)}</div>

      <div id="new" className="section">
        <h2>Fresh Arrivals</h2><p>New and seasonal picks</p>
      </div>
      <div className="grid-5">{fresh.map(w => <ProductCard key={w.wineId} w={w} />)}</div>
    </>
  );
}
