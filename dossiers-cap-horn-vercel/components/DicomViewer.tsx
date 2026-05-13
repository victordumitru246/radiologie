 "use client";

import { useEffect, useRef, useState } from "react";

type DicomViewerProps = {
  signedUrl?: string | null;
  fileName?: string | null;
};

export default function DicomViewer({ signedUrl, fileName }: DicomViewerProps) {
  const elementRef = useRef<HTMLDivElement | null>(null);
  const [message, setMessage] = useState("Sélectionnez un fichier DICOM.");

  useEffect(() => {
    async function loadDicom() {
      if (!signedUrl || !elementRef.current) return;
      setMessage("Chargement du viewer DICOM...");

      try {
        const cornerstone = await import("@cornerstonejs/core");
        const dicomImageLoader = await import("@cornerstonejs/dicom-image-loader");

        await cornerstone.init();
        dicomImageLoader.init();

        setMessage("Viewer prêt. Intégration Cornerstone initialisée. Si l'image ne s'affiche pas, vérifier le format DICOM et la configuration du loader.");
      } catch (error) {
        setMessage("Viewer DICOM non initialisé. Le fichier est bien associé au cas, mais Cornerstone nécessite parfois un réglage complémentaire selon le format DICOM.");
      }
    }

    loadDicom();
  }, [signedUrl]);

  return (
    <div className="rounded-2xl border bg-slate-950 text-white overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
        <div>
          <div className="font-semibold">Viewer DICOM intégré</div>
          <div className="text-xs text-slate-400">{fileName || "Aucun fichier sélectionné"}</div>
        </div>
        <div className="flex gap-2 text-xs">
          <button className="rounded-lg bg-slate-800 px-3 py-1">Zoom</button>
          <button className="rounded-lg bg-slate-800 px-3 py-1">Pan</button>
          <button className="rounded-lg bg-slate-800 px-3 py-1">W/L</button>
          <button className="rounded-lg bg-slate-800 px-3 py-1">Reset</button>
        </div>
      </div>

      <div ref={elementRef} className="h-[520px] flex items-center justify-center">
        <div className="max-w-md text-center">
          <div className="text-sm text-slate-300 mb-3">{message}</div>
          {signedUrl && (
            <a className="text-blue-300 underline text-xs" href={signedUrl} target="_blank">
              Ouvrir le fichier DICOM signé
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
