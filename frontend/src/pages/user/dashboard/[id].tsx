// pages/user/dashboard/[id].tsx
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
