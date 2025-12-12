export default function AdminDashboard() {
    return (
      <div className="admin-dashboard">
        <h1>WebOnDay Admin Panel</h1>
  
        <ul>
          <li><a href="/admin/orders">Gestione Ordini</a></li>
          <li><a href="/admin/activity">Registro Attività</a></li>
          <li><a href="/admin/users">Utenti Registrati</a></li>
          <li><a href="/admin/products">Prodotti</a></li>
        </ul>
      </div>
    );
  }
  