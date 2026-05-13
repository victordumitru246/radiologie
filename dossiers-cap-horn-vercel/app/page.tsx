import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center p-6">
      <div className="max-w-3xl rounded-3xl bg-white p-10 shadow-xl">
        <div className="text-sm font-semibold text-blue-700 mb-2">Prototype pédagogique sécurisé</div>
        <h1 className="text-4xl font-bold text-slate-900">Dossiers Cap Horn</h1>
        <p className="mt-4 text-slate-600">
          Bibliothèque de cas radiologiques anonymisés avec upload DICOM privé et viewer intégré.
        </p>
        <div className="mt-6 rounded-2xl bg-amber-50 border border-amber-200 p-4 text-sm text-amber-900">
          Ne jamais uploader de données patient nominatives. Les fichiers DICOM doivent être anonymisés avant import.
          Ce prototype n’est pas destiné à un usage clinique sans hébergement HDS/RGPD.
        </div>
        <div className="mt-8 flex gap-3">
          <Link href="/login" className="rounded-xl bg-[#0b4f7a] px-5 py-3 text-white">Connexion</Link>
          <Link href="/dashboard" className="rounded-xl border px-5 py-3 text-slate-700">Voir le prototype</Link>
        </div>
      </div>
    </main>
  );
}
