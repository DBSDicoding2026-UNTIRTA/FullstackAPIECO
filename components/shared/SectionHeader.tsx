interface SectionHeaderProps {
  readonly title: string;
  readonly description: string;
  readonly align?: "left" | "center";
}

export default function SectionHeader({
  title,
  description,
  align = "center",
}: SectionHeaderProps) {
  const alignmentClass = align === "left" ? "text-left" : "text-center";

  return (
    <header className={`${alignmentClass} mb-10 sm:mb-12`}>
      <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">{title}</h2>
      <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-600 sm:text-base">
        {description}
      </p>
    </header>
  );
}
