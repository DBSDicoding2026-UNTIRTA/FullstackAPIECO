"use client";

import { type ReactNode, useEffect, useRef } from "react";
import gsap from "gsap";

interface DashboardAnimatedWrapperProps {
  readonly children: ReactNode;
}

export default function DashboardAnimatedWrapper({
  children,
}: DashboardAnimatedWrapperProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!wrapperRef.current) return;

    const items = gsap.utils.toArray<HTMLElement>(
      wrapperRef.current.querySelectorAll("[data-dashboard-animate]"),
    );

    if (items.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.from(items, {
        opacity: 0,
        y: 16,
        stagger: 0.06,
        duration: 0.5,
        ease: "power2.out",
      });
    }, wrapperRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return <div ref={wrapperRef}>{children}</div>;
}
