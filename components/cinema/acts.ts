export type Act = {
  id: string;
  numeral: string;
  label: string;
  title: string;
  body: string;
  image?: string;
  /** Drives the per-act colour grade on the vignette. */
  tone: "gold" | "copper" | "red" | "bone";
  caption?: string;
};

export const acts: Act[] = [
  {
    id: "mise",
    numeral: "I",
    label: "Mise en place",
    title: "Photograph your spice shelf. Once.",
    body: "Every jar, every blend, every half-used bag of chilli flakes — read in a single frame and remembered for good. You will never type an ingredient list again.",
    image: "spices",
    tone: "copper",
    caption: "Setup — one time only",
  },
  {
    id: "arsenal",
    numeral: "II",
    label: "The arsenal",
    title: "Then show it what you cook with.",
    body: "Cast iron, grill, food processor, Ninja Creami, one sad saucepan. Microchef only writes recipes your kitchen can actually execute.",
    image: "tools",
    tone: "gold",
    caption: "Setup — one time only",
  },
  {
    id: "brief",
    numeral: "III",
    label: "The brief",
    title: "Cut. Maintain. Bulk.",
    body: "Choose the goal before you shoot a single ingredient. Everything that follows is engineered to land inside those numbers.",
    image: "brief",
    tone: "red",
    caption: "Before the photograph",
  },
  {
    id: "reveal",
    numeral: "IV",
    label: "The reveal",
    title: "Open the fridge.",
    body: "One photograph. Microchef reads what is on every shelf, in every drawer, behind the milk — and cross-references it against your spices, your tools and your macros.",
    image: "fridge",
    tone: "gold",
    caption: "The only step you repeat",
  },
  {
    id: "cut",
    numeral: "V",
    label: "The director's cut",
    title: "Add. Remove. Choose a cuisine.",
    body: "Saving the salmon for tomorrow? Craving Thai instead of Italian? Adjust the scene before a single line of the recipe is written. Optional — skip it and Microchef decides.",
    image: "select",
    tone: "copper",
    caption: "Optional",
  },
  {
    id: "service",
    numeral: "VI",
    label: "Service",
    title: "Dinner, with the numbers attached.",
    body: "A complete recipe built from what you already own, with the macros printed on the plate. Then you do the only part Microchef cannot: you cook it.",
    image: "dish",
    tone: "red",
    caption: "Result",
  },
];
