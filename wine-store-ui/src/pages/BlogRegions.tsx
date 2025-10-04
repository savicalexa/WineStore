import blog6 from "../assets/blog6.jpg";
import blog8 from "../assets/blog8.jpg";
import blog9 from "../assets/blog9.jpg";

export default function BlogRegions() {
  return (
    <article className="blog container-wide">
      <header className="blog-hero">
        <h1>Wine Regions: A Journey Through Terroir</h1>
        <p className="lede">
          Climate, soil, and tradition shape the style of wine. Three regions worth exploring –
          different in every way, each brilliant in its own right.
        </p>
      </header>

      <section className="blog-grid">
        {/* 1 */}
        <figure className="blog-media">
          <img className="blog-img" src={blog6} alt="Bordeaux – château and glasses of red wine" />
          <figcaption>Bordeaux – home of blends based on Cabernet Sauvignon and Merlot.</figcaption>
        </figure>
        <div className="blog-copy">
          <h2>Bordeaux, France</h2>
          <p>
            The Left Bank leans towards powerful Cabernet, the Right Bank towards softer Merlot. In
            white wines, Sauvignon Blanc and Sémillon dominate for classic “Bordeaux Blanc” expressions.
          </p>
          <p>Style: structure, tannin, and aging potential.</p>
        </div>

        {/* 2 */}
        <div className="blog-copy">
          <h2>Tuscany, Italy</h2>
          <p>
            Chianti Classico and Brunello di Montalcino – different faces of the Sangiovese grape.
            Cherry, spice, firm acidity, and aristocratic elegance.
          </p>
          <p className="note">
            Super Tuscans combine French varieties with Tuscan terroir – a modern classic.
          </p>
        </div>
        <figure className="blog-media">
          <img className="blog-img" src={blog8} alt="Tuscan landscape with vineyards" />
          <figcaption>Rolling hills and stony soils – the school of Sangiovese.</figcaption>
        </figure>

        {/* 3 */}
        <figure className="blog-media">
          <img className="blog-img" src={blog9} alt="New World – vineyards and the ocean" />
          <figcaption>New Zealand Sauvignon and Chilean Cabernet – pure New World styles.</figcaption>
        </figure>
        <div className="blog-copy">
          <h2>The New World</h2>
          <p>
            Australia, New Zealand, Chile, Argentina, and California – more direct fruit expression,
            clear ripeness, and stylistic purity. Ideal for those who enjoy a “louder” aromatic profile.
          </p>
          <p>
            The diversity of microclimates gives these wines individuality despite a shared signature.
          </p>
        </div>
      </section>
    </article>
  );
}
