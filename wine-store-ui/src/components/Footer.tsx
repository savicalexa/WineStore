// src/components/Footer.tsx
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer full-bleed footer-compact">
      <div className="container-wide footer-top">
        <div className="feature">
          <div className="icon" aria-hidden>🎁</div>
          <div>
            <h4>
              <Link to="/" className="feature-link">Gift Cards</Link>
            </h4>
            <p>The perfect gift for weddings, birthdays, anniversaries, or employee rewards.</p>
          </div>
        </div>
        <div className="feature">
          <div className="icon" aria-hidden>⭐</div>
          <div>
            <h4>
              <Link to="/" className="feature-link">Loyalty Cards</Link>
            </h4>
            <p>Our loyalty program rewards the trust of our customers with exclusive benefits.</p>
          </div>
        </div>
        <div className="feature">
          <div className="icon" aria-hidden>✉️</div>
          <div>
            <h4>Newsletter</h4>
            <div className="newsletter">
              <input placeholder="Enter your email" />
              
                <Link to="/login" className="feature-link"><button className="subscribe-btn">Subscribe</button></Link>
              
            </div>
          </div>
        </div>
      </div>

      <div className="container-wide footer-main">
        <div className="footer-col">
          <h5>Wine Store Belgrade</h5>
          <p><strong>Address:</strong> Bulevar Oslobođenja 117, Belgrade</p>
          <p><strong>Retail:</strong> 060 56 777 41</p>
          <p><strong>Wholesale:</strong> 060 56 777 49</p>
          <p><strong>Online:</strong> 060 56 777 92</p>
          <p><strong>Email:</strong> info@winestore.com</p>
          <p><strong>Opening hours:</strong></p>
          <p>Mon – Fri: 09h – 21h</p>
          <p>Sat: 10h – 21h</p>
          <p>Sun: 10h – 17h</p>
        </div>

        <div className="footer-col">
          <h5>Information</h5>
          <ul>
            <li><Link to="/">About us</Link></li>
            <li><Link to="/blog">Blog</Link></li>
            <li><Link to="/wines">Wine & Pleasure</Link></li>
            <li><Link to="/wineries">Tasting room</Link></li>
            <li><Link to="/wineries">Wine equipment rental</Link></li>
            <li><Link to="/wines">Wine list</Link></li>
            <li><Link to="/">Careers</Link></li>
            <li><Link to="/">Contact</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h5>Help with Shopping</h5>
          <ul>
            <li><Link to="/wines">Wines</Link></li>
            <li><Link to="/pairing">Pairings</Link></li>
            <li><Link to="/grapes">Grapes</Link></li>
            <li><Link to="/regions">Regions</Link></li>
            <li><Link to="/premium">Premium</Link></li>
            <li><Link to="/wineries">Wineries</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h5>Customer Service</h5>
          <ul>
             <li><Link to="/login">Log in</Link></li>
            <li><Link to="/signup">Sign up</Link></li>
          </ul>
        </div>
      </div>

      <div className="container-wide footer-bottom">
        <small>.         © {new Date().getFullYear()} ENCHANTE</small>
        <small>info@enchante +381 612078292    .</small> 
      </div>
    </footer>
  );
}
