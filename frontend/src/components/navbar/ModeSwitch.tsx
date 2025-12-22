import { useNavigate } from "react-router-dom";
import { useUserMode } from "../../lib/userModeStore";
import { getMyBusiness } from "../../lib/businessApi";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { useState } from "react";

export default function ModeSwitch() {
  const { mode, setMode } = useUserMode();
  const { user } = useCurrentUser();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  if (!user) return null;
  const userId = user.id;

  async function toggle() {
    if (loading) return;
    setLoading(true);

    try {
      if (mode === "client") {
        // 👉 passo a Partner
        setMode("partner");

        const res = await getMyBusiness(userId);

        if (res?.business) {
          navigate("/user/business/dashboard");
        } else {
          navigate("/user/business/register");
        }
      } else {
        // 👉 ritorno Cliente
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
