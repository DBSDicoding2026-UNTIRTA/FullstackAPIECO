import { FEATURE_ITEMS, FEATURES_HEADER } from "@/data/landing";

import Container from "@/components/shared/Container";
import SectionHeader from "@/components/shared/SectionHeader";

export default function FeaturesSection() {
  return (
    <section className="py-14 sm:py-20" aria-labelledby="fitur-title">
      <Container>
        <SectionHeader title={FEATURES_HEADER.title} description={FEATURES_HEADER.description} />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURE_ITEMS.map((feature) => (
            <article
              key={feature.id}
              className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5"
            >
              <p className="text-3xl" aria-hidden>
                {feature.icon}
              </p>
              <h3 className="mt-3 text-base font-semibold text-slate-900">{feature.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{feature.description}</p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
