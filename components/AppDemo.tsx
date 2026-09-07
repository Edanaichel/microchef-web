"use client";

import { useEffect, useRef, useState } from "react";

export default function AppDemo() {
  const section = useRef<HTMLElement>(null);
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    const node = section.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && node.classList.add("is-visible"),
      { threshold: 0.2 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="demo-section" ref={section}>
      <div className="demo-copy">
        <p className="eyebrow">From shelf to something incredible</p>
        <h2>
          Snap it.
          <br />
          <em>Cook it.</em>
        </h2>
        <p>
          No inventory lists. No macro math. Just open the fridge and let
          Microchef connect the dots.
        </p>
        <div className="metric-row" aria-label="Product benefits">
          <span><strong>1</strong> photo</span>
          <span><strong>0</strong> guesswork</span>
          <span><strong>∞</strong> ideas</span>
        </div>
      </div>

      <div className="phone-wrap">
        <div className="phone-aura" />
        <div className="phone">
          <div className="phone-top"><i /></div>
          <div className="phone-screen">
            <video
              className={videoReady ? "is-ready" : ""}
              src="/video/microchef-demo.mp4"
              autoPlay
              muted
              loop
              playsInline
              poster="/video/demo-poster.svg"
              onCanPlay={() => setVideoReady(true)}
              aria-label="Microchef Generate tab demonstration"
            />
            <div className="demo-fallback">
              <span className="mini-logo">M</span>
              <p>GENERATE</p>
              <div className="scan-frame">
                <span />
                <b>Drop your demo video here</b>
                <small>public/video/microchef-demo.mp4</small>
              </div>
              <button>Scan my fridge</button>
            </div>
          </div>
        </div>
        <p className="phone-caption">The Generate tab / your video goes here</p>
      </div>
    </section>
  );
}
