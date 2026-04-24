import { HOW_IT_WORKS_HEADER, HOW_IT_WORKS_ITEMS } from "@/data/landing";
import type { HowItWorksItem } from "@/types";

import Container from "@/components/shared/Container";
import SectionHeader from "@/components/shared/SectionHeader";

const accentClassMap: Record<HowItWorksItem["accent"], string> = {
  emerald: "border-emerald-200 bg-emerald-50",
  sky: "border-sky-200 bg-sky-50",
  amber: "border-amber-200 bg-amber-50",
  violet: "border-violet-200 bg-violet-50",
};

export default function HowItWorksSection() {
  return (
    <section id="cara-kerja" className="border-y border-slate-100 bg-white py-14 sm:py-20">
      <Container>
        <SectionHeader
          title={HOW_IT_WORKS_HEADER.title}
          description={HOW_IT_WORKS_HEADER.description}
        />

        <ol className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {HOW_IT_WORKS_ITEMS.map((item) => (
            <li
              key={item.id}
              className={`rounded-2xl border p-5 ${accentClassMap[item.accent]}`}
            >
              <p className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">
                {item.step}
              </p>
              <h3 className="mt-4 text-base font-semibold text-slate-900">{item.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{item.description}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
