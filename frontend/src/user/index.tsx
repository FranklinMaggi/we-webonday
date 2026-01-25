// ======================================================
// FE || pages/user/layout/UserLayout.tsx
// ======================================================
//
// AI-SUPERCOMMENT — USER AREA LAYOUT
//
// RUOLO:
// - Layout persistente area cliente
// - Garantisce continuità visiva post-login
//
// INVARIANTI:
// - Navbar sempre visibile
// - Footer sempre visibile
// - Nessuna logica business
//
// ======================================================

import { Outlet } from "react-router-dom";

import Footer from "../marketing/components/footer/Footer";

export default function UserLayout() {
  return (
    <>
      <main className="user-area">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
