// RUOLO:
// - Layout UI dell’area user (routing-level)
// - Fornisce struttura visiva comune alle pagine figlie
//
// INVARIANTI:
// - Footer sempre visibile
// - Nessuna logica di dominio
// - Nessun accesso a store o auth


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
