import AppShell from "@/components/AppShell";

export default function SettingsPage() {
  return (
    <AppShell>
      <h1 className="text-3xl font-bold">Paramètres</h1>
      <div className="mt-5 rounded-2xl bg-white border p-6 text-slate-600">
        Paramètres du compte et préférences d’affichage.
      </div>
    </AppShell>
  );
}
