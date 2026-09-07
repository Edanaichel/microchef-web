"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import burger from "./burger-parts.json";

const chapters: Record<
  string,
  { label: string; kicker: string; title: string; body: string; tone: string }
> = {
  "top-bun": {
    label: "Macros",
    kicker: "Setup",
    title: "Start with\nyour numbers.",
    body: "Calories, protein, carbs, fat. Enter them once and every meal Microchef suggests is built to hit them.",
    tone: "38 92% 58%",
  },
  lettuce: {
    label: "Spice shelf",
    kicker: "Setup",
    title: "Photograph\nyour spices.",
    body: "One shot of the cabinet teaches Microchef what you can season with. No typing out a single jar.",
    tone: "78 88% 60%",
  },
  tomato: {
    label: "Saved",
    kicker: "Setup",
    title: "Setup ends\nhere.",
    body: "Macros and spices are stored for good. Everything from now on is one photo.",
    tone: "8 88% 60%",
  },
  pickles: {
    label: "Fridge scan",
    kicker: "Every meal",
    title: "Open the\nfridge.",
    body: "Point the camera at whatever is in there. Half an onion, leftover chicken, three eggs.",
    tone: "96 70% 55%",
  },
  patty: {
    label: "Recognition",
    kicker: "Every meal",
    title: "It reads\nyour food.",
    body: "Microchef identifies what is in the photo and cross-references it against your spice shelf.",
    tone: "22 90% 56%",
  },
  onions: {
    label: "Generation",
    kicker: "Every meal",
    title: "Recipes that\nhit your macros.",
    body: "Every result uses only food you already own and lands inside the targets you set on day one.",
    tone: "32 94% 58%",
  },
  base: {
    label: "Dinner",
    kicker: "Done",
    title: "Dinner,\nfigured out.",
    body: "No meal planning. No grocery run. No macro math. Just cook.",
    tone: "45 90% 60%",
  },
};

const parts = burger.parts.map((part) => ({ ...part, ...chapters[part.name] }));
const COMPRESS = 0.74;

export default function ExplodedBurger() {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!root.current || !stage.current) return;
    gsap.registerPlugin(ScrollTrigger);

    const context = gsap.context(() => {
      const media = gsap.matchMedia();

      media.add("(min-width: 801px) and (prefers-reduced-motion: no-preference)", () => {
        const layers = gsap.utils.toArray<HTMLElement>(".part");
        const beats = gsap.utils.toArray<HTMLElement>(".beat");
        const ticks = gsap.utils.toArray<HTMLElement>(".rail i");

        // Every layer keeps its exact position from the source photograph, so a
        // fully exploded stack reproduces the original frame. Assembling only
        // pulls the layers back toward the middle.
        const closedOffset = (index: number, height: number) =>
          -(parts[index].center - 0.5) * height * COMPRESS;

        // Frame the stack for whichever layers have separated so far. Without
        // this the spread outgrows the viewport and the burger gets clipped.
        const frame = (chapter: number) => {
          const height = stage.current?.offsetHeight ?? 1;
          let top = Infinity;
          let bottom = -Infinity;

          parts.forEach((part, index) => {
            const offset = index <= chapter ? 0 : closedOffset(index, height);
            top = Math.min(top, part.top * height + offset);
            bottom = Math.max(bottom, (part.top + part.height) * height + offset);
          });

          const box = bottom - top;
          const scale = Math.min(2.1, (window.innerHeight * 0.76) / box);
          const y = (height / 2 - (top + bottom) / 2) * scale;
          return { scale, y };
        };

        gsap.set(layers, { y: (i) => closedOffset(i, stage.current?.offsetHeight ?? 0) });
        gsap.set(stage.current, { ...frame(-1), transformOrigin: "50% 50%" });
        gsap.set(beats, { autoAlpha: 0, y: 34 });
        gsap.set(ticks, { scaleX: 0.35, opacity: 0.3 });

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${window.innerHeight * (parts.length + 1.4)}`,
            pin: ".burger-sticky",
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        timeline
          .to(".hero-copy", { autoAlpha: 0, y: -70, duration: 0.5 }, 0)
          .to(".scroll-cue", { autoAlpha: 0, duration: 0.3 }, 0);

        parts.forEach((part, index) => {
          const at = 0.7 + index;
          const pending = layers.slice(index + 1);
          const revealed = layers.slice(0, index);

          timeline
            .to(layers[index], { y: 0, duration: 0.9, ease: "power3.inOut" }, at)
            .to(
              stage.current,
              {
                scale: () => frame(index).scale,
                y: () => frame(index).y,
                duration: 0.9,
                ease: "power2.inOut",
              },
              at,
            )
            .to(
              ".burger-sticky",
              { "--tone": part.tone, duration: 0.6 } as gsap.TweenVars,
              at,
            )
            .to(layers[index], { filter: "brightness(1.08)", duration: 0.4 }, at)
            .to(ticks[index], { scaleX: 1, opacity: 1, duration: 0.35 }, at);

          if (revealed.length) {
            timeline.to(revealed, { filter: "brightness(0.82)", duration: 0.4 }, at);
          }
          if (pending.length) {
            timeline.to(
              pending,
              { filter: "brightness(0.55) blur(2px)", duration: 0.4 },
              at,
            );
          }

          timeline.fromTo(
            beats[index],
            { autoAlpha: 0, y: 34 },
            { autoAlpha: 1, y: 0, duration: 0.4 },
            at + 0.12,
          );

          if (index < parts.length - 1) {
            timeline
              .to(beats[index], { autoAlpha: 0, y: -30, duration: 0.3 }, at + 0.76)
              .to(ticks[index], { opacity: 0.45, duration: 0.3 }, at + 0.76);
          }
        });

        // Closing frame: the photograph, whole again, everything lit.
        const outro = 0.7 + parts.length;
        timeline
          .to(layers, { filter: "brightness(1) blur(0px)", duration: 0.6 }, outro)
          .to(beats[parts.length - 1], { autoAlpha: 0, y: -30, duration: 0.4 }, outro + 0.3)
          .fromTo(
            ".stage-finale",
            { autoAlpha: 0, y: 30 },
            { autoAlpha: 1, y: 0, duration: 0.5 },
            outro + 0.45,
          );

        // Mouse parallax: each layer drifts at its own rate, which is what sells
        // the depth far more than any single transform does.
        const mid = (parts.length - 1) / 2;
        const onMove = (event: MouseEvent) => {
          const nx = event.clientX / window.innerWidth - 0.5;
          const ny = event.clientY / window.innerHeight - 0.5;
          layers.forEach((layer, index) => {
            gsap.to(layer, {
              x: nx * (index - mid) * 9,
              rotateY: nx * 6,
              rotateX: -ny * 4,
              duration: 0.9,
              ease: "power2.out",
              overwrite: "auto",
            });
          });
        };

        window.addEventListener("mousemove", onMove);
        return () => {
          window.removeEventListener("mousemove", onMove);
          timeline.scrollTrigger?.kill();
          timeline.kill();
        };
      });

      media.add("(max-width: 800px), (prefers-reduced-motion: reduce)", () => {
        gsap.set(".part", { y: 0, clearProps: "filter,transform" });
        gsap.set(".beat", { autoAlpha: 1, y: 0 });
      });
    }, root);

    return () => context.revert();
  }, []);

  return (
    <section ref={root} className="burger-scroll" aria-label="How Microchef works">
      <div className="burger-sticky">
        <div className="light-top" />
        <div className="light-floor" />

        <div className="copy-col">
          <div className="hero-copy">
            <p className="eyebrow">Dinner, without the guesswork</p>
            <h1>
              Your fridge.
              <br />
              <em>Figured out.</em>
            </h1>
            <p className="hero-sub">Your food. Your macros. One photo away.</p>
          </div>

          <div className="beats">
            {parts.map((part, index) => (
              <article className="beat" key={part.name}>
                <span className="ghost-index" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="beat-kicker">
                  {part.kicker} — {part.label}
                </p>
                <h2>
                  {part.title.split("\n").map((line) => (
                    <span key={line}>{line}</span>
                  ))}
                </h2>
                <p className="beat-body">{part.body}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="stage-col">
          <div
            className="burger-stage"
            ref={stage}
            style={{ aspectRatio: burger.aspect }}
            aria-label="Exploded view of a hamburger"
          >
            {parts.map((part) => (
              <div className="part" key={part.name} style={{ top: `${part.top * 100}%` }}>
                <img src={part.file} alt="" draggable={false} />
              </div>
            ))}
          </div>
        </div>

        <div className="rail" aria-hidden="true">
          {parts.map((part) => (
            <i key={part.name} />
          ))}
        </div>

        <p className="stage-finale">
          Seven layers. <em>One photo.</em>
        </p>

        <div className="scroll-cue">
          <span>Scroll</span>
          <i />
        </div>
      </div>
    </section>
  );
}
