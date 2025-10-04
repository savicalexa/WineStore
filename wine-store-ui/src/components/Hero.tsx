import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";   // dodaj ovo

import home1 from "../images/home1.jpg";
import home2 from "../images/home2.jpg";

const SLIDES = [
  { img: home1, title: "LOYALTY PROGRAM" },
  { img: home2, title: "SHOP VARIOUS WINES" },
];

export default function Hero() {
  const [i, setI] = useState(0);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    timer.current = window.setInterval(
      () => setI(s => (s + 1) % SLIDES.length),
      5000
    );
    return () => { if (timer.current) clearInterval(timer.current); };
  }, []);

  return (
    <section className="hero full-bleed hero--slider">
      <div className="hero-track">
        {SLIDES.map((s, idx) => (
          <div
            key={idx}
            className={`hero-slide ${idx === i ? "is-active" : ""}`}
          >
            <img src={s.img} alt="" className="hero-img" />
          </div>
        ))}
      </div>

      <div className="hero-content">
        <h1>
          <Link to="/" className="hero-link">{SLIDES[i].title}</Link>
        </h1>
      </div>
    </section>
  );
}
