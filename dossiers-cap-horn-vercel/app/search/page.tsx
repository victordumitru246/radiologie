import AppShell from "@/components/AppShell";

export default function SearchPage() {
  return (
    <AppShell>
      <h1 className="text-3xl font-bold">Recherche avancée</h1>
      <div className="mt-5 rounded-2xl bg-white border p-6 grid md:grid-cols-3 gap-4">
        <input className="rounded-xl border p-3" placeholder="Diagnostic" />
        <input className="rounded-xl border p-3" placeholder="Indication" />
        <select className="rounded-xl border p-3"><option>Modalité</option><option>IRM</option><option>Scanner</option></select>
        <select className="rounded-xl border p-3"><option>Région</option><option>Neuro</option><option>Thorax</option></select>
        <input className="rounded-xl border p-3" placeholder="Tags" />
        <button className="rounded-xl bg-[#0b4f7a] p-3 text-white">Rechercher</button>
      </div>
    </AppShell>
  );
}
