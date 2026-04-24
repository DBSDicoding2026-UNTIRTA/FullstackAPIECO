"use client";

export default function GoogleLoginButton() {
  const handleGoogleLogin = (): void => {
    // TODO: hubungkan dengan Google Auth
    // TODO: setelah login valid, simpan user ke database menggunakan Prisma
    window.location.assign("/dashboard");
  };

  return (
    <button
      type="button"
      onClick={handleGoogleLogin}
      className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 transition hover:border-emerald-300 hover:bg-emerald-50"
      aria-label="Lanjutkan dengan Google"
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
        <path
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a6 6 0 0 1-2.21 3.31v2.77h3.57a10.98 10.98 0 0 0 3.28-8.09Z"
          fill="#4285F4"
        />
        <path
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A10.99 10.99 0 0 0 12 23Z"
          fill="#34A853"
        />
        <path
          d="M5.84 14.1A6.58 6.58 0 0 1 5.49 12c0-.73.13-1.43.35-2.09V7.07H2.18A11.03 11.03 0 0 0 1 12c0 1.78.43 3.45 1.18 4.93l3.66-2.83Z"
          fill="#FBBC05"
        />
        <path
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15A10.9 10.9 0 0 0 12 1 10.99 10.99 0 0 0 2.18 7.07l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38Z"
          fill="#EA4335"
        />
      </svg>
      Lanjutkan dengan Google
    </button>
  );
}
