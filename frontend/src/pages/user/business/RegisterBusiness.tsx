// ======================================================
// FE || pages/user/business/RegisterBusiness.tsx
// ======================================================
// BUSINESS — REGISTRAZIONE GUIDATA (MVP)
//
// RUOLO:
// - Creare utente + business base
// - Avviare flusso di attivazione business
//
// RESPONSABILITÀ:
// - Raccolta dati minimi
// - Sequenza: register user → create business → upload menu
//
// NON FA:
// - NON gestisce errori avanzati
// - NON valida business rules
// - NON è UI definitiva
//
// NOTE:
// - File volutamente semplice (bootstrap)
// - Flusso verrà raffinato in dashboard admin/business
// ======================================================

import { useState } from "react";

export default function RegisterBusiness() {
  const [email, setEmail] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  async function submit() {
    if (!file || !email) return alert("Completa i campi");

    // 1. register user
    const userRes = await fetch("/api/user/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        email,
        password: "temporary123",
        businessName: "My Business",
        piva: "TEMP",
      }),
    });
   
  const { ok } = await userRes.json();
  if (!ok) {
    alert("Errore registrazione utente");
    return;
  }
    // 2. create business
    const bRes = await fetch("/api/business/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
       
        name: "Business",
        address: "-",
        phone: "-",
      }),
    });
    const { business } = await bRes.json();

    // 3. upload menu
    const fd = new FormData();
    fd.append("file", file);

    await fetch(
      `/api/business/menu/upload?businessId=${business.id}`,
      {
        method: "POST",
        body: fd,
        credentials: "include",
      }
    );

    alert("Business attivato");
  }

  return (
    <div>
      <h1>Registra Business</h1>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input type="file" accept="application/pdf" onChange={onFile} />

      {preview && (
        <iframe
          src={preview}
          style={{ width: "100%", height: 400 }}
        />
      )}

      <button onClick={submit}>Invia</button>
    </div>
  );
}
