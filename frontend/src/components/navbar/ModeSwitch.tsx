import { useNavigate } from "react-router-dom";
import { useUserMode } from "../../lib/userModeStore";
import { getMyBusiness } from "../../lib/businessApi";
import { useEffect, useState } from "react";
import { useAuthStore } from "../../store/auth.store";

export default function ModeSwitch() {
  // ✅ HOOKS SOLO QUI, dentro il componente
  const user = useAuthStore((s) => s.user);

  const { mode, setMode } = useUserMode();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      setMode("client");
    }
  }, [user, setMode]);

  if (!user) return null;

  const userId = user.id;

  async function toggle() {
    if (loading) return;
    setLoading(true);

    try {
      if (mode === "client") {
        setMode("partner");

        const res = await getMyBusiness(userId);

        if (res?.business) {
          navigate("/user/business/dashboard");
        } else {
          navigate("/user/business/register");
        }
      } else {
        setMode("client");
        navigate("/");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className={`mode-switch ${mode}`}
      onClick={toggle}
      role="switch"
      aria-checked={mode === "partner"}
      title="Cambia modalità Cliente / Partner"
    >
      <span className={`label left ${mode === "client" ? "active" : ""}`}>
        ☕ Cliente
      </span>

      <div className="switch-track">
        <div className="switch-thumb" />
      </div>

      <span className={`label right ${mode === "partner" ? "active" : ""}`}>
        Partner ☕️
      </span>
    </div>
  );
}
