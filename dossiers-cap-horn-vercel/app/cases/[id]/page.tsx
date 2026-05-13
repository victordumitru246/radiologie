 "use client";

import AppShell from "@/components/AppShell";
import DicomViewer from "@/components/DicomViewer";
import { supabase } from "@/lib/supabaseClient";
import { DicomFile, RadiologyCase } from "@/lib/types";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function CaseDetailPage() {
  const params = useParams();
  const id = String(params.id);
  const [caseData, setCaseData] = useState<RadiologyCase | null>(null);
  const [files, setFiles] = useState<DicomFile[]>([]);
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const [showDiagnosis, setShowDiagnosis] = useState(false);

  useEffect(() => {
    async function load() {
      if (id.startsWith("demo")) {
        setCaseData({
          id, title: "Cas démo", indication: "Déficit neurologique brutal", clinical_context: "Patient pseudonymisé", final_diagnosis: "AVC ischémique aigu", differential_diagnosis: "Migraine, crise comitiale", modality: "IRM", anatomical_region: "Neuro", educational_score: 5, tags: ["urgence", "neuro"], diagnostic_pitfalls: "Ne pas méconnaître une séquence de diffusion positive.", key_learning_points: "Restriction de diffusion en territoire sylvien.", report_text: "", references_text: "", status: "publie", pseudonymized_patient_id: "PSEUDO-001", author_id: null, created_at: "", updated_at: ""
        });
        return;
      }

      const { data } = await supabase.from("radiology_cases").select("*").eq("id", id).single();
      setCaseData(data);
      const { data: dicoms } = await supabase.from("dicom_files").select("*").eq("case_id", id).order("created_at", { ascending: false });
      setFiles(dicoms || []);
    }
    load();
  }, [id]);

  async function openFile(file: DicomFile) {
    const { data, error } = await supabase.storage.from("dicom-files").createSignedUrl(file.storage_path, 60 * 10);
    if (error) alert(error.message);
    else {
      setSelectedUrl(data.signedUrl);
      setSelectedName(file.file_name);
      await supabase.from("audit_logs").insert({ action: "view_dicom", entity_type: "dicom_file", entity_id: file.id, metadata: { file_name: file.file_name } });
    }
  }

  if (!caseData) return <AppShell><div>Chargement...</div></AppShell>;

  return (
    <AppShell>
      <div className="grid xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-4">
          <DicomViewer signedUrl={selectedUrl} fileName={selectedName} />

          <div className="rounded-2xl bg-white border p-5">
            <h2 className="font-bold mb-3">Fichiers DICOM associés</h2>
            {files.length === 0 && <p className="text-sm text-slate-500">Aucun DICOM uploadé pour ce cas.</p>}
            <div className="space-y-2">
              {files.map((f) => (
                <button key={f.id} onClick={() => openFile(f)} className="w-full text-left rounded-xl border p-3 hover:bg-slate-50">
                  <div className="font-medium">{f.file_name}</div>
                  <div className="text-xs text-slate-500">{Math.round((f.file_size || 0) / 1024)} Ko · {f.metadata_warning ? "Alerte métadonnées" : "OK"}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl bg-white border p-6">
            <div className="flex gap-2 mb-3">
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs text-blue-700">{caseData.modality}</span>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs">{caseData.status}</span>
            </div>
            <h1 className="text-2xl font-bold">{caseData.title}</h1>
            <p className="text-sm text-slate-500 mt-2">{caseData.anatomical_region} · Score {caseData.educational_score}/5</p>

            <div className="mt-5 space-y-4 text-sm">
              <section>
                <h3 className="font-semibold">Indication</h3>
                <p className="text-slate-600">{caseData.indication}</p>
              </section>
              <section>
                <h3 className="font-semibold">Contexte clinique</h3>
                <p className="text-slate-600">{caseData.clinical_context}</p>
              </section>
              <section>
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Diagnostic final</h3>
                  <button className="text-blue-700 text-xs" onClick={() => setShowDiagnosis(!showDiagnosis)}>
                    {showDiagnosis ? "Masquer" : "Révéler"}
                  </button>
                </div>
                <p className="text-slate-600">{showDiagnosis ? caseData.final_diagnosis : "Diagnostic masqué - mode entraînement"}</p>
              </section>
              <section>
                <h3 className="font-semibold">Points clés</h3>
                <p className="text-slate-600">{caseData.key_learning_points}</p>
              </section>
              <section>
                <h3 className="font-semibold">Pièges</h3>
                <p className="text-slate-600">{caseData.diagnostic_pitfalls}</p>
              </section>
            </div>
          </div>
        </aside>
      </div>
    </AppShell>
  );
}
