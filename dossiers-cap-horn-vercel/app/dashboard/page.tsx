import AppShell from "@/components/AppShell";
import Link from "next/link";

export default function DashboardPage() {
  const cards = [
    ["Cas enregistrés", "5"],
    ["Cas publiés", "4"],
    ["DICOM uploadés", "0"],
    ["Score moyen", "4.4"]
  ];

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-slate-500">Vue d’ensemble des cas radiologiques pédagogiques.</p>
        </div>

        <div className="grid md:grid-cols-4 gap-4">
          {cards.map(([label, value]) => (
            <div key={label} className="rounded-2xl bg-white p-5 shadow-sm border">
              <div className="text-sm text-slate-500">{label}</div>
              <div className="text-3xl font-bold mt-2">{value}</div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl bg-white p-6 border shadow-sm">
          <h2 className="font-bold text-lg">Actions rapides</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/cases/new" className="rounded-xl bg-[#0b4f7a] px-4 py-2 text-white">Créer un cas</Link>
            <Link href="/upload" className="rounded-xl border px-4 py-2">Uploader un DICOM</Link>
            <Link href="/cases" className="rounded-xl border px-4 py-2">Voir les cas</Link>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
