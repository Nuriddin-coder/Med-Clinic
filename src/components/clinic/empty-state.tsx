export const EmptyState = ({ title, hint }: { title: string; hint?: string }) => (
  <div className="rounded-2xl border border-dashed border-Input_border bg-white px-6 py-14 text-center">
    <p className="text-lg font-semibold text-blackColor">{title}</p>
    {hint ? <p className="mt-2 text-sm text-Navbar_Color">{hint}</p> : null}
  </div>
);
