import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import {
  acceptAdminConfiguration,
  rejectAdminConfiguration,
} from "@src/admin/adminApi/admin.configuration.api";
import { API_BASE } from "@src/shared/lib/config";
import { adminFetch } from "@admin/adminApi";

/* ======================================================
   TYPES (MINIMI, ALLINEATI AL BE)
====================================================== */
type AdminConfigurationDetailResponse = {
  ok: true;
  configuration: {
    id: string;
    status: string;
    createdAt: string;
    updatedAt?: string;
  };
  owner: any | null;
  business: any | null;
};



export default function AdminConfigurationDetail() {
  /* =========================
     ROUTING
  ========================= */
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  /* =========================
     STATE
  ========================= */
  const [data, setData] =
    useState<AdminConfigurationDetailResponse | null>(null);

  const [loading, setLoading] = useState(true);
  const [reason, setReason] = useState("");

  /* =========================
     FETCH CONFIGURATION
  ========================= */
  useEffect(() => {
    if (!id) return;

    let alive = true;

    adminFetch<AdminConfigurationDetailResponse>(
      `/api/admin/configuration?id=${id}`
    )
      .then((res) => {
        if (alive) setData(res);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [id]);

  /* =========================
     EARLY RETURNS
  ========================= */
  if (loading) return <p>Caricamento…</p>;
  if (!data) return <p>Configurazione non trovata</p>;

  const { configuration, owner, business } = data;

  /* =========================
     ACTIONS
  ========================= */
  async function accept() {
    if (!id) return;

    await acceptAdminConfiguration(id);
    navigate("/admin/configurations", { replace: true });
  }

  async function reject() {
    if (!id) return;

    await rejectAdminConfiguration(id, reason);
    navigate("/admin/configurations", { replace: true });
  }
  async function openAdminDocument(
    target: "owner" | "business",
    doc: string
  ) {
    const res = await fetch(
      `${API_BASE}/api/admin/configuration/view-documents?configurationId=${configuration.id}&target=${target}&doc=${doc}`,
      {
        headers: {
          "x-admin-token": sessionStorage.getItem("ADMIN_TOKEN")!,
        },
      }
    );
  
    if (!res.ok) {
      alert("Errore caricamento documento");
      return;
    }
  
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
  
    window.open(url, "_blank");
  }
  /* =========================
     RENDER
  ========================= */
  return (
    <section className="admin-page">
      <h1>Configurazione {configuration.id}</h1>

      <p>
        <strong>Stato:</strong> {configuration.status}
      </p>

      <p>
        <strong>Creata il:</strong>{" "}
        {new Date(configuration.createdAt).toLocaleString()}
      </p>

      <hr />

      {/* =====================
         OWNER
      ====================== */}
      <h3>Owner</h3>
      <pre>{JSON.stringify(owner, null, 2)}</pre>

      <hr />

      {/* =====================
         BUSINESS
      ====================== */}
      <h3>Business</h3>
      <pre>{JSON.stringify(business, null, 2)}</pre>

      <hr />

      {/* =====================
         DOCUMENTI
      ====================== */}
      <h3>Documenti Owner</h3>

      <div style={{ display: "flex", gap: 12 }}>
  <button onClick={() => openAdminDocument("owner", "front")}>
    📄 Owner – Documento fronte
  </button>

  <button onClick={() => openAdminDocument("owner", "back")}>
    📄 Owner – Documento retro
  </button>

  <button onClick={() => openAdminDocument("business", "certificate")}>
    🏢 Business – Visura
  </button>
</div>
      <hr />

      {/* =====================
         AZIONI ADMIN
      ====================== */}
    
        <>
          <button onClick={accept}>✅ Accetta</button>

          <div style={{ marginTop: 16 }}>
            <textarea
              placeholder="Motivo rifiuto (opzionale)"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              style={{ width: "100%" }}
            />

            <button
              style={{ marginTop: 8 }}
              onClick={reject}
            >
              ❌ Rifiuta
            </button>
          </div>
        </>
      

      <hr />

      <button onClick={() => navigate("/admin/configurations")}>
        ← Torna alla lista
      </button>
    </section>
  );
}
