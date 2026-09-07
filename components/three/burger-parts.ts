// The single source of truth for the 3D stack.
//
// `mesh` matches the mesh names requested in the modelling brief. When a real
// GLB arrives, nothing here changes except that each entry resolves to a mesh
// from the file instead of placeholder geometry.
export type PartName =
  | "top_bun"
  | "lettuce"
  | "tomato"
  | "pickles"
  | "cheese"
  | "patty"
  | "onions"
  | "sauce"
  | "bottom_bun";

export type Part = {
  mesh: PartName;
  thickness: number;
  label: string;
  kicker: string;
  title: string;
  body: string;
};

// Ordered top of the burger down, which is also the order they separate in.
export const parts: Part[] = [
  {
    mesh: "top_bun",
    thickness: 0.46,
    label: "Macros",
    kicker: "Setup",
    title: "Start with your numbers.",
    body: "Calories, protein, carbs, fat. Enter them once and every meal Microchef suggests is built to hit them.",
  },
  {
    mesh: "lettuce",
    thickness: 0.13,
    label: "Spice shelf",
    kicker: "Setup",
    title: "Photograph your spices.",
    body: "One shot of the cabinet teaches Microchef what you can season with. No typing out a single jar.",
  },
  {
    mesh: "tomato",
    thickness: 0.14,
    label: "Saved",
    kicker: "Setup",
    title: "Setup ends here.",
    body: "Macros and spices are stored for good. Everything from now on is one photo.",
  },
  {
    mesh: "pickles",
    thickness: 0.09,
    label: "Fridge scan",
    kicker: "Every meal",
    title: "Open the fridge.",
    body: "Point the camera at whatever is in there. Half an onion, leftover chicken, three eggs.",
  },
  {
    mesh: "cheese",
    thickness: 0.06,
    label: "Recognition",
    kicker: "Every meal",
    title: "It reads your food.",
    body: "Microchef identifies what is in the photo and cross-references it against your spice shelf.",
  },
  {
    mesh: "patty",
    thickness: 0.36,
    label: "Matching",
    kicker: "Every meal",
    title: "Matched to your targets.",
    body: "Only meals that fit the macros you set on day one, built from food you already own.",
  },
  {
    mesh: "onions",
    thickness: 0.12,
    label: "Generation",
    kicker: "Every meal",
    title: "Recipes in seconds.",
    body: "No meal planning, no grocery run, no macro math. The recipe is ready before you close the door.",
  },
  {
    mesh: "sauce",
    thickness: 0.08,
    label: "Zero waste",
    kicker: "Result",
    title: "Nothing goes bad.",
    body: "The food you already bought becomes the food you actually cook.",
  },
  {
    mesh: "bottom_bun",
    thickness: 0.3,
    label: "Dinner",
    kicker: "Done",
    title: "Dinner, figured out.",
    body: "Open Microchef. Snap. Cook.",
  },
];

// Breathing room between layers in the closed burger.
export const GAP = 0.045;

// How far apart separated layers float once they lift off the stack.
export const SPREAD = 0.78;
