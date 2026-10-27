export const PageHero = ({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) => (
  <section className="border-b border-Input_border bg-Secondary/70">
    <div className="container py-10 md:py-14">
      {eyebrow ? (
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-Primary_app">
          {eyebrow}
        </p>
      ) : null}
      <h1 className="text-3xl font-bold text-blackColor md:text-4xl">{title}</h1>
      {description ? (
        <p className="mt-3 max-w-2xl text-base text-Navbar_Color">{description}</p>
      ) : null}
    </div>
  </section>
);
