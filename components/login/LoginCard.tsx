import Link from "next/link";

import { LOGIN_BENEFITS } from "@/data/landing";

import AppLogo from "@/components/shared/AppLogo";
import GoogleLoginButton from "@/components/login/GoogleLoginButton";

export default function LoginCard() {
  return (
    <section className="w-full max-w-md rounded-3xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
      <header className="text-center">
        <div className="mx-auto inline-flex">
          <AppLogo href="/" />
        </div>
        <h1 className="mt-6 text-2xl font-bold text-slate-900">Selamat Datang Kembali 👋</h1>
        <p className="mt-2 text-sm text-slate-600">
          Masuk untuk melanjutkan misi daur ulangmu hari ini.
        </p>
      </header>

      <div className="mt-6">
        <GoogleLoginButton />
      </div>

      <div className="my-6 h-px bg-slate-200" />

      <ul className="space-y-2" aria-label="Keuntungan menggunakan Pilah Yuk!!">
        {LOGIN_BENEFITS.map((benefit) => (
          <li key={benefit.id} className="flex items-start gap-2 text-sm text-slate-600">
            <span className="mt-0.5 text-emerald-600" aria-hidden>
              ✓
            </span>
            <span>{benefit.text}</span>
          </li>
        ))}
      </ul>

      <footer className="mt-6 text-center text-xs text-slate-500">
        <p>
          Dengan masuk, Anda menyetujui Ketentuan Layanan dan Kebijakan Privasi.
        </p>
        <Link href="/" className="mt-3 inline-flex text-sm font-medium text-emerald-700 hover:underline">
          Kembali ke Beranda
        </Link>
      </footer>
    </section>
  );
}
