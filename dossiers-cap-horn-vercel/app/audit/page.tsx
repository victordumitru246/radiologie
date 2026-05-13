 "use client";

import AppShell from "@/components/AppShell";
import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";

export default function AuditPage() {
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from("audit_logs").select("*").order("created_at", { ascending: false }).limit(50);
      setLogs(data || []);
    }
    load();
  }, []);

  return (
    <AppShell>
      <h1 className="text-3xl font-bold">Logs / Audit</h1>
      <div className="mt-5 rounded-2xl bg-white border overflow-hidden">
        {logs.length === 0 && <div className="p-6 text-sm text-slate-500">Aucun log pour le moment.</div>}
        {logs.map((log) => (
          <div key={log.id} className="border-b p-4 text-sm">
            <div className="font-semibold">{log.action}</div>
            <div className="text-slate-500">{log.entity_type} · {log.created_at}</div>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
