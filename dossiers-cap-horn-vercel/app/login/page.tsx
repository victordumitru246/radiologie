 "use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function signIn() {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
    else router.push("/dashboard");
  }

  async function signUp() {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) alert(error.message);
    else alert("Compte créé. Vérifiez votre email si la confirmation est activée.");
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-100 p-6">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow">
        <h1 className="text-2xl font-bold">Connexion</h1>
        <p className="text-sm text-slate-500 mt-1">Accès au portail Dossiers Cap Horn</p>

        <div className="mt-6 space-y-3">
          <input className="w-full rounded-xl border p-3" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className="w-full rounded-xl border p-3" placeholder="Mot de passe" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button onClick={signIn} className="w-full rounded-xl bg-[#0b4f7a] p-3 text-white">Se connecter</button>
          <button onClick={signUp} className="w-full rounded-xl border p-3">Créer un compte</button>
        </div>
      </div>
    </main>
  );
}
