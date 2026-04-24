import Link from "next/link";

interface AppLogoProps {
  readonly href?: string;
}

export default function AppLogo({ href = "/" }: AppLogoProps) {
  return (
    <Link href={href} className="inline-flex items-center gap-2">
      <span className="text-2xl" aria-hidden>
        🌿
      </span>
      <span className="bg-linear-to-r from-emerald-600 to-lime-600 bg-clip-text text-lg font-extrabold tracking-tight text-transparent sm:text-xl">
        Pilah Yuk!!
      </span>
    </Link>
  );
}
