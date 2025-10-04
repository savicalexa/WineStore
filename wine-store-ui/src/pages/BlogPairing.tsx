import blog4 from "../assets/blog4.jpg";
import blog5 from "../assets/blog5.jpg";
import blog6 from "../assets/blog6.jpg";

export default function BlogPairing() {
  return (
    <article className="blog container-wide">
      <header className="blog-hero">
        <h1>Food & Wine Pairing: How to Tame Flavors</h1>
        <p className="lede">
          Pairing wine and food is a game of balance – intensity, acidity, salt, and texture must
          meet in the middle. These are practical guidelines that actually work in the real world.
        </p>
      </header>

      <section className="blog-grid">
        {/* 1 */}
        <figure className="blog-media">
          <img className="blog-img" src={blog4} alt="White wine with fish and citrus flavors" />
          <figcaption>Freshness and citrus – the best friends of seafood.</figcaption>
        </figure>
        <div className="blog-copy">
          <h2>The Intensity Rule</h2>
          <p>
            Light dishes → light wines; rich dishes → wines with more structure. If the plate is creamy
            and full, look for a wine with body and texture; if the dish is delicate, choose freshness
            and acidity.
          </p>
          <p>
            Examples: grilled white fish → Sauvignon Blanc/Vermentino; buttery chicken → lightly oaked
            Chardonnay; red meat → Cabernet Sauvignon/Syrah.
          </p>
        </div>

        {/* 2 */}
        <div className="blog-copy">
          <h2>Acidity & Salt</h2>
          <p>
            Acidity lifts a dish, while salt softens bitterness and tannins. That’s why mineral-driven
            whites work so well with oysters and raw seafood, while tannic reds demand juiciness and fat.
          </p>
          <p className="note">
            Trick: a few drops of lemon can ruin a red wine – avoid acidity with tannins.
          </p>
        </div>
        <figure className="blog-media">
          <img className="blog-img" src={blog5} alt="Red wine with steak" />
          <figcaption>Tannins love protein – a classic that rarely fails.</figcaption>
        </figure>

        {/* 3 */}
        <figure className="blog-media">
          <img className="blog-img" src={blog6} alt="Dessert with a glass of sweet wine" />
          <figcaption>Dessert must always be less sweet than the wine – never the other way around.</figcaption>
        </figure>
        <div className="blog-copy">
          <h2>Spice & Sweetness</h2>
          <p>
            Spicy food calls for lower alcohol and a touch of sweetness (Riesling/Off-dry Chenin). For
            desserts – the wine must always be at least a shade sweeter than the bite.
          </p>
          <p>
            Always taste sip → bite → sip – only then you discover the true balance.
          </p>
        </div>
      </section>
    </article>
  );
}
