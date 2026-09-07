# Microchef Showcase

A cinematic, scroll-driven product site for Microchef.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Replace the placeholders

### Logo

The temporary circular `M` mark appears in `app/page.tsx`. Replace the contents
of `.brand` with your own image or SVG. Put the final asset in `public/brand/`.

### Generate-tab video

Export a portrait iPhone recording as:

`public/video/microchef-demo.mp4`

The video will automatically replace the designed placeholder when it can play.
Use an H.264 MP4 without an audio track for the smallest, most compatible file.

### App Store link

Replace the `href="#"` on `.app-store-button` in `app/page.tsx` with the final
App Store URL.

## The cinema cut (homepage)

The site opens on the cinematic cut at `http://localhost:3000`. Styles live in
`app/cinema/cinema.css`; the experience is in `components/cinema/`. `/cinema`
redirects home.

- **Logo** — the mark in `.cin-mark` (loader and header in `CinemaExperience.tsx`).
  Asset: `public/images/logo.webp`.
- **Generate-tab screenshot** — replace `.cin-slot` in the Service act with the
  real image. The frame is sized for a 1179 × 2556 portrait screenshot.
- **App Store link** — the `href="#"` on `.cin-cta`.
- **Score** — synthesised in `components/cinema/score.ts`, so there is no audio
  file to ship. It stays silent until the viewer presses the sound toggle.
- **Stills** — `public/images/cinema/`. Each still has a matching `-blur.webp`
  used as the low-resolution backdrop while the full frame decodes.

To review the layout frame by frame, run `next dev`, then:

```bash
npm install --no-save puppeteer-core
node scripts/shoot-cinema.mjs 1440 900
```

## Burger artwork

The custom artwork lives at
`public/images/burger/microchef-exploded-burger.png`. The page masks the single
composition into independent layers to keep the ingredients visually consistent
while allowing each one to move during the scroll sequence.
