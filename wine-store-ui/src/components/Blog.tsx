import blog1 from "../assets/blog1.jpg";
import blog2 from "../assets/blog2.jpg";
import blog3 from "../assets/blog3.jpg";

export default function BlogWine() {
  return (
    <article className="blog container-wide">
      {/* Title */}
      <header className="blog-hero">
        <h1>Château d’Esclans: Elegance and the History of Provence</h1>
        <p className="lede">
          In the heart of Provence, among pine trees and the scent of sea salt, a story was born
          that shaped the modern rosé. Today, Château d’Esclans is synonymous with refined style,
          terroir, and the unmistakable signature of southern France.
        </p>
      </header>

      {/* Two-column layout: alternating image/text */}
      <section className="blog-grid">
        {/* block 1: image left, text right */}
        <figure className="blog-media">
          <img className="blog-img" src={blog1} alt="Château d’Esclans – courtyard and wine glasses" />
          <figcaption>Provence in a glass – elegant style and delicate notes of red fruit.</figcaption>
        </figure>
        <div className="blog-copy">
          <h2>A Terroir That Speaks</h2>
          <p>
            Sunny days, mild winters, and the Mediterranean climate create conditions in which grapes
            reach full ripeness and aromatic intensity. The soil is diverse – from sandy and limestone deposits
            to gravelly slopes – giving the wine structure and minerality.
          </p>
          <p>
            The vineyards are dominated by <em>Grenache</em>, skillfully blended with varieties such as
            <em> Syrah</em>, <em>Cinsault</em>, and <em>Tibouren</em>. This blend ensures a distinctive salmon color,
            silky tannins, and a refreshing finish.
          </p>
        </div>

        {/* block 2: text left, image right */}
        <div className="blog-copy">
          <h2>The Style of Rosé Wine</h2>
          <p>
            Modern Provençal rosé does not seek weight – it seeks precision. Cold maceration preserves
            delicate aromas of strawberry, raspberry, and white flowers, while gentle pressing ensures
            crystal clarity and impeccable brilliance in the glass.
          </p>
          <p>
            Serve at 8–10 °C in a white wine glass, paired with light tapas, seafood, or Mediterranean salads.
            Perfect as an aperitif – but also as a wine to accompany the entire summer menu.
          </p>
        </div>
        <figure className="blog-media">
          <img className="blog-img" src={blog2} alt="Rosé bottle with Mediterranean snacks" />
          <figcaption>Light bites and rosé – a pairing that never fails.</figcaption>
        </figure>

        {/* block 3: image left, text right */}
        <figure className="blog-media">
          <img className="blog-img" src={blog3} alt="Bottles of rosé wine in the vineyards of Provence" />
          <figcaption>Harmony of fruit, freshness, and minerality.</figcaption>
        </figure>
        <div className="blog-copy">
          <h2>Why Is It Special?</h2>
          <p>
            The blend of tradition and a modern oenological approach has earned Château d’Esclans wines
            the status of an icon. Attention to detail – from the vineyards to the label – creates an
            experience that goes beyond the season.
          </p>
          <p className="note">
            Note: enjoying rosé wines is not reserved only for summer – their versatility and vibrancy
            make them an excellent choice year-round.
          </p>
        </div>
      </section>
    </article>
  );
}
