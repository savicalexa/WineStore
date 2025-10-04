import blog5 from "../assets/blog5.jpg";
import blog7 from "../assets/blog7.jpg";
import blog8 from "../assets/blog8.jpg";

export default function BlogGrapes() {
  return (
    <article className="blog container-wide">
      <header className="blog-hero">
        <h1>The Most Important Grape Varieties: From Character to Glass</h1>
        <p className="lede">
          Every variety carries its own aromatic map and texture. Discover the classics shaping wine
          styles around the world.
        </p>
      </header>

      <section className="blog-grid">
        {/* 1 */}
        <figure className="blog-media">
          <img className="blog-img" src={blog5} alt="Sauvignon Blanc grapes and a glass of white wine" />
          <figcaption>Sauvignon Blanc – citrus, elderflower, and lively acidity.</figcaption>
        </figure>
        <div className="blog-copy">
          <h2>Sauvignon Blanc</h2>
          <p>
            Green citrus, grassy notes, sometimes elderflower and gooseberry. New Zealand brings bolder
            profiles, while the Loire Valley offers a more elegant, mineral expression.
          </p>
          <p>Pairing: goat cheese, lemony fish, spring salads.</p>
        </div>

        {/* 2 */}
        <div className="blog-copy">
          <h2>Pinot Noir</h2>
          <p>
            Red fruit (cherry, strawberry), fine acidity, and discreet tannins. Burgundy is the benchmark,
            but excellent examples can be found in Oregon and Central Otago.
          </p>
          <p className="note">Sensitive in the vineyard, brilliant in the glass when the vintage succeeds.</p>
        </div>
        <figure className="blog-media">
          <img className="blog-img" src={blog7} alt="Pinot Noir glass with fine dining" />
          <figcaption>Delicacy over power – the secret of Pinot Noir.</figcaption>
        </figure>

        {/* 3 */}
        <figure className="blog-media">
          <img className="blog-img" src={blog8} alt="Grenache grapes in the sun" />
          <figcaption>Grenache – the foundation of modern Provençal rosé.</figcaption>
        </figure>
        <div className="blog-copy">
          <h2>Grenache (Garnacha)</h2>
          <p>
            Warm spices, ripe red fruit, and juiciness. In red wines it adds body, in rosé wines – salmon
            color and softness.
          </p>
          <p>Often blended with Syrah and Mourvèdre (GSM) – the Mediterranean signature.</p>
        </div>
      </section>
    </article>
  );
}
