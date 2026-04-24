import Link from "next/link";

import { LANDING_CTA_CONTENT } from "@/data/landing";

import Container from "@/components/shared/Container";

export default function CtaSection() {
  return (
    <section className="py-14 sm:py-20">
      <Container>
        <article className="rounded-3xl bg-linear-to-r from-emerald-600 to-lime-500 p-8 text-center text-white sm:p-10">
          <h2 className="text-2xl font-bold sm:text-3xl">{LANDING_CTA_CONTENT.title}</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-emerald-50 sm:text-base">
            {LANDING_CTA_CONTENT.description}
          </p>
          <Link
            href="/login"
            className="mt-6 inline-flex rounded-xl bg-white px-6 py-3 text-sm font-semibold text-emerald-700 transition hover:opacity-90"
          >
            {LANDING_CTA_CONTENT.buttonText}
          </Link>
        </article>
      </Container>
    </section>
  );
}
