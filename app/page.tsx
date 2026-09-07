import type { Metadata } from "next";
import CinemaExperience from "@/components/cinema/CinemaExperience";
import "lenis/dist/lenis.css";
import "./cinema/cinema.css";

export const metadata: Metadata = {
  title: "Microchef — Everything you need is already in there.",
  description:
    "Photograph your spices, your equipment and your fridge. Microchef writes dinner around your macros.",
};

export default function Home() {
  return <CinemaExperience />;
}
