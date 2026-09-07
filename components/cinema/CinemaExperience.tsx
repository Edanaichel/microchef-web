"use client";

import { useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { acts } from "./acts";
import { entries } from "./dex";
import { score } from "./score";

/** Words are wrapped so each one can be masked and pushed up independently. */
function Title({ text, className }: { text: string; className: string }) {
  return (
    <h2 className={className}>
      {text.split(" ").map((word, index) => (
        <span className="word" key={`${word}-${index}`}>
          <span className="word__inner">{word}</span>
        </span>
      ))}
    </h2>
  );
}

const still = (name: string) => `/images/cinema/${name}.webp`;
const blur = (name: string) => `/images/cinema/${name}-blur.webp`;

export default function CinemaExperience() {
  const root = useRef<HTMLDivElement>(null);
  const counter = useRef<HTMLSpanElement>(null);
  const [chapter, setChapter] = useState(0);
  const [sound, setSound] = useState(false);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const lenis = new Lenis({ duration: 1.2, smoothWheel: !reduced });
    lenis.on("scroll", ScrollTrigger.update);
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    const reveal = () => {
      if (!root.current) return;
      root.current.classList.remove("is-booting");
      gsap.set(".cin-bar", { clearProps: "height" });
      gsap.set(".cin-hud, .cin-scroll, .cin-chapter, .cin-progress", { opacity: 1 });
      lenis.start();
      ScrollTrigger.refresh();
    };

    const ctx = gsap.context(() => {
      // --- Cold open -----------------------------------------------------
      // The two curtain halves retract into the permanent letterbox bars, so
      // the loader never "disappears" — it becomes the frame.
      root.current?.classList.add("is-booting");
      lenis.stop();
      const open = gsap.timeline({ onComplete: reveal });
      const tally = { value: 0 };
      const barHeight = Math.min(50, Math.max(16, window.innerHeight * 0.034));

      open
        .set(".cin-bar", { height: "50vh" })
        .to(".cin-preload__inner", { opacity: 1, duration: 0.7, ease: "power2.out" })
        .to(
          tally,
          {
            value: 100,
            duration: 1.7,
            ease: "power2.inOut",
            onUpdate: () => {
              if (counter.current) {
                counter.current.textContent = String(Math.round(tally.value)).padStart(3, "0");
              }
            },
          },
          0.1
        )
        .to(".cin-preload__line span", { scaleX: 1, duration: 1.7, ease: "power2.inOut" }, 0.1)
        .to(".cin-preload__inner", { opacity: 0, duration: 0.5, ease: "power2.in" }, "+=0.15")
        .to(".cin-bar", { height: barHeight, duration: 1.5, ease: "expo.inOut" }, "-=0.1")
        .from(".cin-hero__media img", { scale: 1.35, duration: 2.4, ease: "expo.out" }, "<")
        .from(
          ".cin-hero .word__inner",
          { yPercent: 120, duration: 1.4, stagger: 0.07, ease: "expo.out" },
          "<0.25"
        )
        .from(
          ".cin-hero__kicker, .cin-hero__sub",
          { opacity: 0, y: 14, duration: 1, stagger: 0.1, ease: "power2.out" },
          "<0.3"
        )
        .to(
          ".cin-hud, .cin-scroll, .cin-chapter, .cin-progress",
          { opacity: 1, duration: 1, stagger: 0.08, ease: "power2.out" },
          "<0.2"
        );

      if (reduced) open.progress(1);

      // --- Per-act staging ------------------------------------------------
      gsap.utils.toArray<HTMLElement>(".cin-act").forEach((section) => {
        const index = Number(section.dataset.index);
        const media = section.querySelector(".cin-act__media");
        const image = section.querySelector(".cin-act__media img");

        ScrollTrigger.create({
          trigger: section,
          start: "top 65%",
          onEnter: () => {
            if (Number.isFinite(index)) setChapter(index);
            score.impact(section.dataset.tone === "gold" ? 1 : 0.7);
          },
          onEnterBack: () => {
            if (Number.isFinite(index)) setChapter(index);
          },
        });

        if (reduced) return;

        gsap
          .timeline({ scrollTrigger: { trigger: section, start: "top 72%" } })
          .from(section.querySelectorAll(".word__inner"), {
            yPercent: 120,
            duration: 1.15,
            stagger: 0.055,
            ease: "expo.out",
          })
          .from(
            section.querySelectorAll(".cin-act__label, .cin-act__body, .cin-card, .cin-slot, .cin-entry"),
            { opacity: 0, y: 26, duration: 0.9, stagger: 0.09, ease: "power3.out" },
            0.15
          );

        if (media) {
          gsap.from(media, {
            clipPath: "inset(14% 18% 14% 18%)",
            duration: 1.6,
            ease: "expo.out",
            scrollTrigger: { trigger: section, start: "top 80%" },
          });
        }

        // Slow drift keeps every frame alive without pinning anything.
        if (image) {
          gsap.fromTo(
            image,
            { yPercent: -7, scale: 1.14 },
            {
              yPercent: 7,
              scale: 1,
              ease: "none",
              scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: true },
            }
          );
        }
      });

      // The grade shifts with whichever act owns the viewport.
      gsap.utils.toArray<HTMLElement>("[data-tone]").forEach((section) => {
        ScrollTrigger.create({
          trigger: section,
          start: "top 60%",
          end: "bottom 40%",
          onToggle: ({ isActive }) => {
            if (isActive && root.current) {
              root.current.dataset.tone = section.dataset.tone ?? "gold";
            }
          },
        });
      });

      if (!reduced) {
        gsap.to(".cin-progress span", {
          scaleX: 1,
          ease: "none",
          scrollTrigger: { trigger: document.body, start: "top top", end: "bottom bottom", scrub: 0.4 },
        });
      }
    }, root);

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    const failsafe = window.setTimeout(reveal, 6000);

    return () => {
      window.clearTimeout(failsafe);
      window.removeEventListener("load", refresh);
      ctx.revert();
      gsap.ticker.remove(raf);
      lenis.destroy();
      score.dispose();
    };
  }, []);

  const toggleSound = async () => setSound(await score.toggle());

  return (
    <div className="cin" ref={root} data-tone="gold">
      <div className="cin-bar cin-bar--top" />
      <div className="cin-bar cin-bar--bottom" />
      <div className="cin-grain" aria-hidden />
      <div className="cin-vignette" aria-hidden />

      <div className="cin-preload" aria-hidden>
        <div className="cin-preload__inner">
          <div className="cin-mark cin-mark--lg">
            <img src="/images/logo.webp" alt="" />
          </div>
          <p className="cin-preload__name">Microchef</p>
          <div className="cin-preload__line">
            <span />
          </div>
          <span className="cin-preload__count" ref={counter}>
            000
          </span>
        </div>
      </div>

      <header className="cin-hud">
        <div className="cin-hud__left">
          <div className="cin-mark">
            <img src="/images/logo.webp" alt="" />
          </div>
          <span>Microchef</span>
        </div>
        <button
          type="button"
          className="cin-sound"
          onClick={toggleSound}
          aria-pressed={sound}
          data-on={sound}
        >
          <span className="cin-sound__bars" aria-hidden>
            <i />
            <i />
            <i />
            <i />
          </span>
          {sound ? "Sound on" : "Sound off"}
        </button>
      </header>

      <main>
        <section className="cin-hero" data-tone="gold">
          <div className="cin-hero__media">
            <img
              src={still("kitchen")}
              alt=""
              fetchPriority="high"
              style={{ backgroundImage: `url(${blur("kitchen")})` }}
            />
          </div>
          <div className="cin-hero__copy">
            <p className="cin-hero__kicker">A Microchef feature</p>
            <Title className="cin-hero__title" text="Everything you need is already in there." />
            <p className="cin-hero__sub">
              An AI cook that reads your spice rack, your equipment and your fridge — then writes
              dinner around your macros.
            </p>
          </div>
          <div className="cin-scroll">
            <span>Scroll</span>
            <i />
          </div>
        </section>

        {acts.map((act, index) => (
          <section
            key={act.id}
            className={`cin-act cin-act--${act.image ? "still" : "type"}`}
            data-index={index + 1}
            data-tone={act.tone}
            id={act.id}
          >
            {act.image && (
              <div className="cin-act__media">
                <img
                  src={still(act.image)}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  style={{ backgroundImage: `url(${blur(act.image)})` }}
                />
              </div>
            )}

            <div className="cin-act__inner">
              <p className="cin-act__label">
                <span className="cin-act__numeral">{act.numeral}</span>
                {act.label}
                {act.caption && <em>{act.caption}</em>}
              </p>
              <Title className="cin-act__title" text={act.title} />
              <p className="cin-act__body">{act.body}</p>

              {act.cards && (
                <div className="cin-cards">
                  {act.cards.map((card) => (
                    <article className="cin-card" key={card.key}>
                      <h3>{card.key}</h3>
                      <p className="cin-card__heading">{card.heading}</p>
                      <p className="cin-card__note">{card.note}</p>
                    </article>
                  ))}
                </div>
              )}

              {act.id === "service" && (
                // Swap this for the real generate-tab screenshot when it lands.
                <div className="cin-slot">
                  <div className="cin-slot__phone">
                    <span>Generate tab</span>
                    <p>Screenshot slot — 1179 × 2556</p>
                  </div>
                </div>
              )}
            </div>
            <span className="cin-act__ghost" aria-hidden>
              {String(index + 1).padStart(2, "0")}
            </span>
          </section>
        ))}

        <section className="cin-credits" data-tone="bone">
          <p className="cin-act__label">Now showing</p>
          <Title className="cin-credits__title" text="Microchef" />
          <p className="cin-act__body">
            Your kitchen, already stocked. Set it up once, then eat off a photograph.
          </p>
          <a className="cin-cta" href="#" data-store>
            <span>Download on the App Store</span>
          </a>
          <dl className="cin-credits__roll">
            <div>
              <dt>Starring</dt>
              <dd>Whatever is in your fridge</dd>
            </div>
            <div>
              <dt>Directed by</dt>
              <dd>Your macros</dd>
            </div>
            <div>
              <dt>Runtime</dt>
              <dd>One photograph</dd>
            </div>
            <div>
              <dt>Rated</dt>
              <dd>Cut · Maintain · Bulk</dd>
            </div>
          </dl>
        </section>

        <section className="cin-sting" data-tone="red">
          <p className="cin-act__label">After the credits</p>
          <Title className="cin-sting__title" text="Cook to unlock." />
          <p className="cin-act__body">
            Every meal you actually make earns something back — new themes, new looks, a reason to
            keep the streak alive. Microchef is a game you can eat.
          </p>
          <ul className="cin-themes">
            {["Midnight Oil", "Masterchef", "Original", "Multi-Cultural", "???"].map((theme) => (
              <li key={theme} data-locked={theme === "???"}>
                {theme}
              </li>
            ))}
          </ul>
        </section>

        <section className="cin-act cin-act--still cin-dex" data-tone="gold" id="microdex">
          <div className="cin-act__media">
            <img
              src={still("microdex")}
              alt=""
              loading="lazy"
              decoding="async"
              style={{ backgroundImage: `url(${blur("microdex")})` }}
            />
          </div>
          <div className="cin-act__inner">
            <p className="cin-act__label">
              <span className="cin-act__numeral">VII</span>
              The Microdex
              <em>Your kitchen, catalogued</em>
            </p>
            <Title className="cin-act__title" text="A scrapbook you eat through." />
            <p className="cin-act__body">
              Every ingredient you actually cook with gets a page — when you first used it, what
              it became, how many times it came back. A living catalog of your kitchen, filled in
              by eating. The blanks are the point.
            </p>
            <ol className="cin-dex__grid">
              {entries.map((entry) => (
                <li
                  className="cin-entry"
                  key={entry.no}
                  data-locked={entry.locked ? "true" : "false"}
                >
                  <span className="cin-entry__no">{entry.no}</span>
                  <strong>{entry.name}</strong>
                  <em>{entry.note}</em>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </main>

      <footer className="cin-foot">
        <span>© {new Date().getFullYear()} Featherweight Labs LLC</span>
        <a href="/privacy">Privacy</a>
      </footer>

      <div className="cin-chapter" aria-hidden>
        <span>{String(chapter).padStart(2, "0")}</span>
        <i />
        <span>{String(acts.length).padStart(2, "0")}</span>
      </div>
      <div className="cin-progress" aria-hidden>
        <span />
      </div>
    </div>
  );
}
