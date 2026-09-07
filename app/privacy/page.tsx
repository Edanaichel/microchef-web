import type { Metadata } from "next";
import "./privacy.css";

export const metadata: Metadata = {
  title: "Privacy Policy — Microchef",
  description:
    "How Featherweight Labs LLC handles the data you share with Microchef.",
};

export default function PrivacyPage() {
  return (
    <div className="legal">
      <header className="legal-bar">
        <a className="legal-brand" href="/cinema">
          <img src="/images/logo.webp" alt="" />
          Microchef
        </a>
        <a href="/cinema">Back to the film</a>
      </header>

      <main className="legal-main">
        <p className="legal-kicker">Legal</p>
        <h1>Privacy Policy</h1>
        <p className="legal-updated">Last updated September 6, 2026</p>

        <p>
          Microchef is made by Featherweight Labs LLC. This page explains what we
          collect, why we collect it, and who can see it. If you use the app, you
          agree to what follows.
        </p>

        <h2>What we collect</h2>
        <p>
          To write you a recipe, Microchef needs a picture of your kitchen —
          spices, equipment, and what is in the fridge — plus the goal you pick
          (cut, maintain, or bulk) and any ingredients or cuisines you add or
          take away. We also keep the account details you give us when you sign
          up, and the meals you generate so the app can remember your kitchen
          and your streak.
        </p>

        <h2>How we protect it</h2>
        <p>
          Your photos and account data are stored securely and used to run
          Microchef — generating recipes, tracking macros, unlocking themes, and
          keeping the product working. We do not sell your personal information.
          We do not hand your fridge photos to advertisers. Access inside
          Featherweight Labs is limited to people who need it to operate or
          improve the app.
        </p>

        <h2>Coaches</h2>
        <p>
          If you join with a coach&apos;s code, that coach can see what you eat
          through their own account — the meals you generate, the macros on
          those meals, and the activity tied to your profile. That is the point
          of the code: you are inviting them in. If you do not want a coach to
          see your food, do not enter their code. You can leave a coach
          relationship from the app, and their view of new meals stops when you
          do.
        </p>

        <h2>Macros are estimates</h2>
        <p>
          The numbers Microchef shows you — calories, protein, carbs, fat, and
          anything nearby — are estimates generated from photographs and recipe
          data. They are not laboratory measurements. By using the app you
          understand that these figures can be wrong, sometimes by a lot, and
          that Microchef is not medical care, nutrition counseling, or
          professional health advice. If you have a medical condition, a
          prescribed diet, or questions about what you should eat, talk to a
          qualified professional. Do not treat the app as one.
        </p>

        <h2>What we do not promise</h2>
        <ul>
          <li>We do not diagnose, treat, or manage any health condition.</li>
          <li>We do not guarantee results for cutting, maintaining, or bulking.</li>
          <li>We do not replace a doctor, dietitian, or licensed coach.</li>
        </ul>

        <h2>Keeping an account</h2>
        <p>
          You can ask us to delete your account and the data attached to it.
          Some records may stay for a limited time where we are required to keep
          them — for example to finish a transaction, fight abuse, or meet the
          law. Recipe history a coach already saw while you were connected to
          them is their record of that period; new meals are not shared after
          you disconnect.
        </p>

        <h2>Children</h2>
        <p>
          Microchef is not directed at children under 13, and we do not
          knowingly collect personal information from them.
        </p>

        <h2>Changes</h2>
        <p>
          If this policy changes in a way that matters, we will update this
          page and the date at the top. Continued use of the app after an update
          means you accept the revised policy.
        </p>

        <h2>Contact</h2>
        <p>
          Questions about your data can be sent to the operator of Microchef at
          the company below.
        </p>

        <p className="legal-company">
          Featherweight Labs LLC
          <span>Operator of Microchef</span>
        </p>
      </main>
    </div>
  );
}
