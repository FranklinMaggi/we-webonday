// pages/user/dashboard/[id].tsx
// ======================================================
// FE || pages/user/dashboard/[id].tsx
// ======================================================
//
// AI-SUPERCOMMENT — USER DASHBOARD DETAIL
//
// RUOLO:
// - Vista dettaglio contestuale (ordine / progetto / risorsa)
//
// STATO ATTUALE:
// - Placeholder intenzionale
//
// INVARIANTI:
// - NON carica dati automaticamente
// - La logica dipende dal tipo di ID
//
// TODO:
// - Switch per tipo entità (order /product/ project)
// ======================================================

import { useParams } from "react-router-dom";

export default function UserDashboardDetail() {
  const { id } = useParams();

  return (
    <>
      <h1>Dettaglio</h1>
      <p>ID: {id}</p>

      {/* qui decidi cosa caricare */}
    </>
  );
}
