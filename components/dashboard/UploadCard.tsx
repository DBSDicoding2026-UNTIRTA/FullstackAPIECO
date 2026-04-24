export default function UploadCard() {
  return (
    <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Upload Sampah</h2>
      <p className="mt-2 text-sm text-slate-600">
        Fitur upload akan terhubung ke analisis AI pada tahap berikutnya.
      </p>
      <button
        type="button"
        className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-linear-to-r from-emerald-600 to-lime-500 px-4 py-3 text-sm font-semibold text-white opacity-95"
      >
        Upload Foto Sampah
      </button>
    </section>
  );
}
