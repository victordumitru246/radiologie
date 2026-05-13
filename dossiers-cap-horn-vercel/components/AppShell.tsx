 "use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, FilePlus, FolderOpen, Search, Shield, BarChart3, Settings, UploadCloud } from "lucide-react";

const links = [
  { href: "/dashboard", label: "Dashboard", icon: Activity },
  { href: "/cases", label: "Dossiers intéressants", icon: FolderOpen },
  { href: "/cases/new", label: "Nouveau dossier", icon: FilePlus },
  { href: "/upload", label: "Upload DICOM", icon: UploadCloud },
  { href: "/search", label: "Recherche avancée", icon: Search },
  { href: "/audit", label: "Logs / Audit", icon: Shield },
  { href: "/stats", label: "Statistiques", icon: BarChart3 },
  { href: "/settings", label: "Paramètres", icon: Settings }
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex bg-slate-100">
      <aside className="w-72 bg-[#0b4f7a] text-white p-5 hidden md:block">
        <div className="mb-8">
          <div className="text-2xl font-bold">Dossiers Cap Horn</div>
          <div className="text-sm text-blue-100 mt-1">Cas radiologiques pédagogiques</div>
        </div>
        <nav className="space-y-2">
          {links.map((link) => {
            const Icon = link.icon;
            const active = pathname === link.href;
            return (
              <Link key={link.href} href={link.href} className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm ${active ? "bg-white text-[#0b4f7a]" : "hover:bg-blue-700"}`}>
                <Icon size={18} />
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-8 rounded-xl bg-blue-900/40 p-4 text-xs leading-relaxed">
          Ne jamais uploader de données patient nominatives. Prototype pédagogique non HDS.
        </div>
      </aside>

      <main className="flex-1">
        <header className="bg-white border-b px-6 py-4 flex items-center justify-between">
          <div>
            <div className="font-semibold text-slate-800">Portail sécurisé</div>
            <div className="text-xs text-slate-500">DICOM anonymisés uniquement</div>
          </div>
          <Link href="/cases/new" className="rounded-xl bg-[#0b4f7a] px-4 py-2 text-white text-sm">Nouveau dossier</Link>
        </header>
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
