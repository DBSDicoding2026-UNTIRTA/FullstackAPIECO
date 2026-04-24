import type { ReactNode } from "react";

interface ContainerProps {
  readonly children: ReactNode;
  readonly className?: string;
}

export default function Container({ children, className }: ContainerProps) {
  const classes = className
    ? `mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`
    : "mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8";

  return <div className={classes}>{children}</div>;
}
