import AppShell from "@/components/AppShell";

export default function StatsPage() {
  return (
    <AppShell>
      <h1 className="text-3xl font-bold">Statistiques</h1>
      <div className="mt-5 rounded-2xl bg-white border p-6 text-slate-600">
        Statistiques des cas par modalité, région anatomique et score pédagogique.
      </div>
    </AppShell>
  );
}
