import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { fetchAdminSolutions } from "../../../lib/adminApi/solutions";
import type { AdminSolution } from "../../../dto/solution";

/* =========================
   STATUS BADGE
========================= */
function StatusBadge({ status }: { status: AdminSolution["status"] }) {
  return (
    <span className={`badge badge-${status.toLowerCase()}`}>
      {status}
    </span>
  );
}

export default function AdminSolutionsList() {
  const [solutions, setSolutions] = useState<AdminSolution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAdminSolutions()
      .then((res) => {
        if (!res.ok) setError("FAILED_TO_LOAD_SOLUTIONS");
        else setSolutions(res.solutions);
      })
      .catch(() => setError("FAILED_TO_LOAD_SOLUTIONS"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading solutions…</p>;
  if (error) return <p>Error: {error}</p>;
  if (solutions.length === 0) return <p>No solutions found.</p>;

  return (
    <div>
      <h1>Admin · Solutions</h1>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Status</th>
            <th />
          </tr>
        </thead>

        <tbody>
          {solutions.map((s) => (
            <tr key={s.id}>
              <td>{s.name}</td>

              <td>
                <StatusBadge status={s.status} />
              </td>

              <td>
                <Link to={`/admin/solutions/${s.id}`}>
                  Edit
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
