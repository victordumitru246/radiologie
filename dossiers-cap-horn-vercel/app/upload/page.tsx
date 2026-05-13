 "use client";

import AppShell from "@/components/AppShell";
import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";

export default function UploadPage() {
  const [cases, setCases] = useState<any[]>([]);
  const [caseId, setCaseId] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    async function loadCases() {
      const { data } = await supabase.from("radiology_cases").select("id,title").order("created_at", { ascending: false });
      setCases(data || []);
      if (data?.[0]) setCaseId(data[0].id);
    }
    loadCases();
  }, []);

  function hasSensitiveName(file: File) {
    const n = file.name.toLowerCase();
    return n.includes("patient") || n.includes("nom") || n.includes("dob") || n.includes("birth") || n.includes("accession");
  }

  async function upload(files: FileList | null) {
    if (!files || files.length === 0) return;
    if (!confirmed) {
      alert("Vous devez confirmer que les fichiers DICOM sont anonymisés.");
      return;
    }
    if (!caseId) {
      alert("Sélectionnez un cas.");
      return;
    }

    const { data: userData } = await supabase.auth.getUser();
    setStatus("Upload en cours...");

    for (const file of Array.from(files)) {
      const metadataWarning = hasSensitiveName(file);
      const path = `${caseId}/${crypto.randomUUID()}-${file.name}`;

      const { error: uploadError } = await supabase.storage.from("dicom-files").upload(path, file, {
        cacheControl: "3600",
        upsert: false
      });

      if (uploadError) {
        alert(uploadError.message);
        continue;
      }

      await supabase.from("dicom_files").insert({
        case_id: caseId,
        file_name: file.name,
        storage_path: path,
        file_size: file.size,
        metadata_warning: metadataWarning,
        uploaded_by: userData.user?.id || null
      });

      await supabase.from("audit_logs").insert({
        action: "upload_dicom",
        entity_type: "radiology_case",
        entity_id: caseId,
        metadata: { file_name: file.name, metadata_warning: metadataWarning }
      });
    }

    setStatus("Upload terminé.");
  }

  return (
    <AppShell>
      <div className="max-w-3xl space-y-5">
        <h1 className="text-3xl font-bold">Upload DICOM</h1>

        <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 text-sm text-amber-900">
          Ne jamais uploader de données patient nominatives. Les fichiers DICOM doivent être anonymisés avant import.
          Ce prototype pédagogique n’est pas destiné à un usage clinique sans hébergement HDS/RGPD.
        </div>

        <div className="rounded-2xl bg-white border p-6 space-y-4">
          <label className="block text-sm font-medium">Associer à un dossier</label>
          <select className="w-full rounded-xl border p-3" value={caseId} onChange={(e) => setCaseId(e.target.value)}>
            <option value="">Sélectionner un cas</option>
            {cases.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
          </select>

          <label className="flex items-start gap-3 text-sm">
            <input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} className="mt-1" />
            <span>Je confirme que les fichiers DICOM sont anonymisés.</span>
          </label>

          <div className="rounded-2xl border-2 border-dashed p-8 text-center">
            <p className="font-medium">Glisser-déposer vos fichiers .dcm ici</p>
            <p className="text-sm text-slate-500 mt-1">Ou sélectionner les fichiers ci-dessous</p>
            <input className="mt-4" type="file" accept=".dcm,application/dicom" multiple onChange={(e) => upload(e.target.files)} />
          </div>

          {status && <div className="text-sm text-blue-700">{status}</div>}
        </div>
      </div>
    </AppShell>
  );
}
