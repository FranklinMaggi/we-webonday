import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { requireAdminToken } from "../../../utils/admin";

export default function AdminOrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    if (!id) return;

    const token = requireAdminToken();

    fetch(`${import.meta.env.VITE_API_URL}/api/admin/orders/get?id=${id}`, {
      headers: {
        "x-admin-token": token,
      },
    })
      .then((res) => res.json())
      .then((out) => {
        if (out.ok) setOrder(out.order);
        else window.location.href = "/admin/login";
      });
  }, [id]);

  if (!order) return <p>Caricamento...</p>;

  return (
    <div className="order-details">
      <h1>Ordine {order.id}</h1>
      <p><strong>Email:</strong> {order.email}</p>
      <p><strong>Azienda:</strong> {order.businessName ?? "Privato"}</p>
      <p><strong>P.IVA:</strong> {order.piva ?? "-"}</p>
      <p><strong>Totale:</strong> € {order.total.toFixed(2)}</p>
      <p><strong>Stato:</strong> {order.status}</p>
      <p><strong>Creato il:</strong> {new Date(order.createdAt).toLocaleString()}</p>

      <h2>Prodotti</h2>
      <ul>
        {order.items.map((item: any, index: number) => (
          <li key={index}>
            <strong>{item.title}</strong> — € {item.total.toFixed(2)}
            {item.options.length > 0 && (
              <ul>
                {item.options.map((opt: any) => (
                  <li key={opt.id}>
                    {opt.label} — € {opt.price.toFixed(2)}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>

      <button onClick={() => window.history.back()}>Indietro</button>
    </div>
  );
}
