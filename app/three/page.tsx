import dynamic from "next/dynamic";
import "./three.css";

const BurgerScene = dynamic(() => import("@/components/three/BurgerScene"));

export const metadata = {
  title: "Microchef — 3D concept",
};

export default function ThreePage() {
  return (
    <main className="three-page">
      <header className="site-header">
        <a className="brand" href="/" aria-label="Microchef home">
          <span className="brand-mark">M</span>
          <span>MICROCHEF</span>
        </a>
        <a className="header-cta" href="/">
          Photo version
        </a>
      </header>

      <section className="three-hero">
        <p className="eyebrow">Concept — real 3D, placeholder model</p>
        <h1>
          Your fridge.
          <br />
          <em>Figured out.</em>
        </h1>
        <p className="hero-sub">Scroll to take it apart.</p>
      </section>

      <BurgerScene />

      <section className="three-outro">
        <p>
          Every layer above is a separate mesh named exactly as the modelling
          brief specifies. A delivered <code>burger.glb</code> replaces the
          placeholder geometry without touching the camera, lighting or scroll
          choreography.
        </p>
      </section>
    </main>
  );
}
