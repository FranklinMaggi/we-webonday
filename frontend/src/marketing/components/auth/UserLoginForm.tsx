                import { useState } from "react";
                import { useNavigate } from "react-router-dom";
                import { apiFetch } from "@shared/lib/api";
                import { useAuthStore } from "@shared/lib/store/auth.store";
                import { userAuthClasses as cls } from "@src/user/auth/auth.classes";
                import { API_BASE } from "@src/shared/lib/config";
                type Props = {
                redirect: string;
                context?: "solution" | "generic";
                };

                export function UserLoginForm({ redirect, context = "generic" }: Props) {
                const fetchUser = useAuthStore(s => s.fetchUser);
                        const navigate =useNavigate();
                const [email, setEmail] = useState("");
                const [password, setPassword] = useState("");
                const [loading, setLoading] = useState(false);
                const [errorMsg, setErrorMsg] = useState<string | null>(null);
                const [legalAccepted, setLegalAccepted] = useState(false); 
                const [showLegalWarning, setShowLegalWarning] = useState(false);
                async function login() {
                if (loading) return;
                setLoading(true);
                setErrorMsg(null);

                try {
                    await apiFetch("/api/user/login", {
                    method: "POST",
                    credentials: "include",
                    body: JSON.stringify({ email, password }),
                    });

                    await fetchUser();
                    navigate(redirect, { replace: true });
                } catch {
                    setErrorMsg("Email o password non validi");
                } finally {
                    setLoading(false);
                }
                }

                async function register() {
                if (loading) return;
                setLoading(true);
                setErrorMsg(null);

                try {
                    await apiFetch("/api/user/register", {
                    method: "POST",
                    credentials: "include",
                    body: JSON.stringify({ email, password }),
                    });

                    await fetchUser();
                    navigate(redirect, { replace: true });
                } catch {
                    setErrorMsg("Registrazione fallita. Email già in uso?");
                } finally {
                    setLoading(false);
                }
                }

                function googleLogin() {
                    const url = new URL(`${API_BASE}/api/user/google/auth`);
                    url.searchParams.set("redirect", redirect);
                    window.location.href = url.toString();
                  }

                return (
                <>
                {context === "solution" && (
                <label className="auth-legal">
                <input
            type="checkbox"
            checked={legalAccepted}
            onChange={(e) => {
                setLegalAccepted(e.target.checked);
                if (e.target.checked) setShowLegalWarning(false);
            }}
        />
                <span>
                    Dichiaro di aver letto e accettato la{" "}
                    <a
                    href="/policy/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    >
                    Privacy Policy
                    </a>{" "}
                    e i{" "}
                    <a
                    href="/policy/terms"
                    target="_blank"
                    rel="noopener noreferrer"
                    >
                    Termini e Condizioni
                    </a>{" "}
                    di WebOnDay.
                </span>
                </label>
                )}
                {context === "solution" && showLegalWarning && !legalAccepted && (
        <p className="auth-legal-warning">
            Devi accettare Privacy Policy e Termini e Condizioni per continuare.
        </p>
        )}
                    <button
        className={cls.googleBtn}
        onClick={() => {
        if (context === "solution" && !legalAccepted) {
            setShowLegalWarning(true);
            return;
        }
        googleLogin();
        }}
        disabled={loading}
        >
        Accedi con Google
        </button>
        <div className={cls.divider}>oppure</div>

        <div className={cls.form}>
        <input
            className={cls.input}
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
        />

        <input
            className={cls.input}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
        />

        {errorMsg && (
            <p className={cls.error}>{errorMsg}</p>
        )}

    <button
    className={cls.primaryBtn}
    onClick={() => {
        if (context === "solution" && !legalAccepted) {
        setShowLegalWarning(true);
        return;
        }
        login();
    }}
    disabled={loading}>
    Accedi
    </button>

    <button
className={cls.secondaryBtn}
onClick={() => {
if (context === "solution" && !legalAccepted) {
setShowLegalWarning(true);
return;
}
register();
}}
disabled={loading}
>
Registrati
</button>
        </div>
    </>
    );
    }