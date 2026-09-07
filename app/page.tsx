import AppDemo from "@/components/AppDemo";
import ExplodedBurger from "@/components/ExplodedBurger";

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h13M13 6l6 6-6 6" />
    </svg>
  );
}

export default function Home() {
  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#" aria-label="Microchef home">
          <img className="brand-mark" src="/images/logo.webp" alt="" />
          <span>MICROCHEF</span>
        </a>
        <a className="header-cta" href="#download">
          Get the app <ArrowIcon />
        </a>
      </header>

      <ExplodedBurger />

      <section className="manifesto">
        <p className="manifesto-label">A smarter kind of hungry</p>
        <p className="manifesto-copy">
          You already bought the ingredients.
          <br />
          <em>Now turn them into dinner.</em>
        </p>
        <div className="manifesto-foot">
          <span>Built around what you have</span>
          <span>Built for where you&apos;re going</span>
        </div>
      </section>

      <AppDemo />

      <section className="download-section" id="download">
        <div className="download-rings" aria-hidden="true">
          <i /><i /><i />
        </div>
        <p className="eyebrow">Your next meal is already in there</p>
        <h2>
          Open your fridge.
          <br />
          <em>Meet your chef.</em>
        </h2>
        <a className="app-store-button" href="#" aria-label="Download Microchef on the App Store">
          <span className="apple" aria-hidden="true">●</span>
          <span><small>Download on the</small>App Store</span>
        </a>
        <p className="launch-note">Available for iPhone</p>
      </section>

      <footer>
        <a className="brand footer-brand" href="#">
          <img className="brand-mark" src="/images/logo.webp" alt="" />
          <span>MICROCHEF</span>
        </a>
        <p>Food you have. Goals you chose.</p>
        <nav aria-label="Legal">
          <a href="/privacy">Privacy</a>
          <span>© 2026 Featherweight Labs LLC</span>
        </nav>
      </footer>
    </main>
  );
}
