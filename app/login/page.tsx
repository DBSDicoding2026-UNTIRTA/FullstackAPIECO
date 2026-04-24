import LoginCard from "@/components/login/LoginCard";

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-linear-to-br from-white via-emerald-50 to-lime-50 p-4">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-20 right-0 h-64 w-64 rounded-full bg-emerald-200/50 blur-3xl" />
        <div className="absolute -bottom-20 left-0 h-64 w-64 rounded-full bg-lime-200/50 blur-3xl" />
      </div>
      <LoginCard />
    </main>
  );
}
