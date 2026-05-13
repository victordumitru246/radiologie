 "use client";

import AppShell from "@/components/AppShell";
import { supabase } from "@/lib/supabaseClient";
import { RadiologyCase } from "@/lib/types";
import Link from "next/link";
import { useEffect, useState } from "react";

const demoCases = [
  { id: "demo-1", title: "AVC ischémique sylvien", modality: "IRM", anatomical_region: "Neuro", final_diagnosis: "AVC ischémique aigu", educational_score: 5, status: "publie" },
  { id: "demo-2", title: "Embolie pulmonaire", modality: "Scanner", anatomical_region: "Thorax", final_diagnosis: "EP bilatérale", educational_score: 4, status: "publie" },
  { id: "demo-3", title: "Appendicite aiguë", modality: "Scanner", anatomical_region: "Abdomen", final_diagnosis: "Appendicite non compliquée", educational_score: 4, status: "publie" }
];

export default function CasesPage() {
  const [cases, setCases] = useState<any[]>(demoCases);
  const [query, setQuery] = useState("");

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from("radiology_cases").select("*").order("created_at", { ascending: false });
      if (data && data.length > 0) setCases(data);
    }
    load();
  }, []);

  const filtered = cases.filter((c) => `${c.title} ${c.final_diagnosis} ${c.modality}`.toLowerCase().includes(query.toLowerCase()));

  return (
    <AppShell>
      <div className="space-y-5">
        <div className="flex justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold">Dossiers intéressants</h1>
            <p className="text-slate-500">Recherche et consultation des cas.</p>
          </div>
          <Link href="/cases/new" className="h-fit rounded-xl bg-[#0b4f7a] px-4 py-2 text-white">Nouveau dossier</Link>
        </div>

        <input className="w-full rounded-2xl border p-3 bg-white" placeholder="Rechercher par diagnostic, modalité, titre..." value={query} onChange={(e) => setQuery(e.target.value)} />

        <div className="grid md:grid-cols-3 gap-4">
          {filtered.map((c) => (
            <Link href={`/cases/${c.id}`} key={c.id} className="rounded-2xl bg-white p-5 border shadow-sm hover:shadow-md transition">
              <div className="flex justify-between">
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs text-blue-700">{c.modality}</span>
                <span className="text-xs text-slate-500">★ {c.educational_score}</span>
              </div>
              <h2 className="font-bold text-lg mt-4">{c.title}</h2>
              <p className="text-sm text-slate-600 mt-2">{c.final_diagnosis}</p>
              <div className="mt-4 text-xs text-slate-500">{c.anatomical_region} · {c.status}</div>
            </Link>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
