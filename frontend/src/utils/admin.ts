export function getAdminToken(): string | null {
    return sessionStorage.getItem("ADMIN_TOKEN");
  }
  
  export function requireAdminToken(): string {
    const token = sessionStorage.getItem("ADMIN_TOKEN");
    if (!token) {
      window.location.href = "/admin/login";
      throw new Error("Missing admin token");
    }
    return token;
  }
  