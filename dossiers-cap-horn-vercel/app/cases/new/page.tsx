 "use client";

import AppShell from "@/components/AppShell";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewCasePage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    indication: "",
    clinical_context: "",
    final_diagnosis: "",
    differential_diagnosis: "",
    modality: "Scanner",
    anatomical_region: "Neuro",
    educational_score: 4,
    tags: "",
    diagnostic_pitfalls: "",
    key_learning_points: "",
    report_text: "",
    references_text: "",
    status: "brouillon",
    pseudonymized_patient_id: ""
  });

  function update(key: string, value: any) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function save() {
    const { data: userData } = await supabase.auth.getUser();
    const payload = {
      ...form,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      author_id: userData.user?.id || null
    };
    const { data, error } = await supabase.from("radiology_cases").insert(payload).select().single();
    if (error) alert(error.message);
    else router.push(`/cases/${data.id}`);
  }

  return (
    <AppShell>
      <div className="max-w-5xl space-y-5">
        <h1 className="text-3xl font-bold">Nouveau dossier</h1>

        <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 text-sm text-amber-900">
          Ne pas saisir de nom, date de naissance ou donnée directement identifiante. Utiliser uniquement un ID pseudonymisé.
        </div>

        <div className="grid md:grid-cols-2 gap-4 bg-white rounded-2xl p-6 border">
          <input className="rounded-xl border p-3 md:col-span-2" placeholder="Titre" value={form.title} onChange={(e) => update("title", e.target.value)} />
          <textarea className="rounded-xl border p-3" placeholder="Indication" value={form.indication} onChange={(e) => update("indication", e.target.value)} />
          <textarea className="rounded-xl border p-3" placeholder="Contexte clinique" value={form.clinical_context} onChange={(e) => update("clinical_context", e.target.value)} />
          <input className="rounded-xl border p-3" placeholder="Diagnostic final" value={form.final_diagnosis} onChange={(e) => update("final_diagnosis", e.target.value)} />
          <input className="rounded-xl border p-3" placeholder="Diagnostics différentiels" value={form.differential_diagnosis} onChange={(e) => update("differential_diagnosis", e.target.value)} />
          <select className="rounded-xl border p-3" value={form.modality} onChange={(e) => update("modality", e.target.value)}>
            {["Scanner", "IRM", "Radiographie", "Échographie", "TEP", "Mammographie", "Angiographie", "Autre"].map((m) => <option key={m}>{m}</option>)}
          </select>
          <select className="rounded-xl border p-3" value={form.anatomical_region} onChange={(e) => update("anatomical_region", e.target.value)}>
            {["Neuro", "Thorax", "Abdomen", "Pelvis", "Ostéo-articulaire", "Vasculaire", "Sénologie", "Pédiatrie", "Autre"].map((m) => <option key={m}>{m}</option>)}
          </select>
          <input className="rounded-xl border p-3" type="number" min="1" max="5" value={form.educational_score} onChange={(e) => update("educational_score", Number(e.target.value))} />
          <input className="rounded-xl border p-3" placeholder="Tags séparés par des virgules" value={form.tags} onChange={(e) => update("tags", e.target.value)} />
          <textarea className="rounded-xl border p-3" placeholder="Points clés pédagogiques" value={form.key_learning_points} onChange={(e) => update("key_learning_points", e.target.value)} />
          <textarea className="rounded-xl border p-3" placeholder="Pièges diagnostiques" value={form.diagnostic_pitfalls} onChange={(e) => update("diagnostic_pitfalls", e.target.value)} />
          <textarea className="rounded-xl border p-3 md:col-span-2" placeholder="Compte-rendu" value={form.report_text} onChange={(e) => update("report_text", e.target.value)} />
          <input className="rounded-xl border p-3" placeholder="Références" value={form.references_text} onChange={(e) => update("references_text", e.target.value)} />
          <input className="rounded-xl border p-3" placeholder="ID patient pseudonymisé" value={form.pseudonymized_patient_id} onChange={(e) => update("pseudonymized_patient_id", e.target.value)} />
          <select className="rounded-xl border p-3" value={form.status} onChange={(e) => update("status", e.target.value)}>
            <option value="brouillon">Brouillon</option>
            <option value="publie">Publié</option>
            <option value="archive">Archivé</option>
          </select>
        </div>

        <button onClick={save} className="rounded-xl bg-[#0b4f7a] px-5 py-3 text-white">Enregistrer</button>
      </div>
    </AppShell>
  );
}
