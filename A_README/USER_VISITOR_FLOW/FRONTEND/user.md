francescomaggi@MacBook-Pro marketing % cd '/Users/francescomaggi/Documents/GitHub/We-WebOnDay/frontend/src/user'
francescomaggi@MacBook-Pro user % aidump
AI_DUMP_V1
ROOT: /Users/francescomaggi/Documents/GitHub/We-WebOnDay/frontend/src/user
DATE: 2026-01-31T11:10:21Z
INCLUDE_EXT: js,ts,css,tsx,html,json,toml
EXCLUDE_DIRS: .wrangler,node_modules,dist,build,coverage,.next,.cache,.git,frontend/public

=== FILE: auth/auth.classes.ts
LANG: ts
SIZE:      812 bytes
----------------------------------------
// ======================================================
// FE || pages/user/auth/auth.classes.ts
// ======================================================
// USER AUTH — CLASS REGISTRY
// ======================================================

export const userAuthClasses = {
    /** PAGE */
    page: "user-auth-page",
  
    /** CARD */
    card: "user-auth-card",
    title: "user-auth-title",
    subtitle: "user-auth-subtitle",
  
    /** ACTIONS */
    googleBtn: "user-auth-google-btn",
    primaryBtn: "user-auth-btn user-auth-btn--primary",
    secondaryBtn: "user-auth-btn user-auth-btn--secondary",
  
    /** FORM */
    form: "user-auth-form",
    input: "user-auth-input",
    divider: "user-auth-divider",
  
    /** STATES */
    error: "user-auth-error",
    hint: "user-auth-hint",
  };
  

=== FILE: auth/index.tsx
LANG: tsx
SIZE:     3566 bytes
----------------------------------------
// ======================================================
// FE || pages/user/auth/index.tsx
// ======================================================

import { useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../shared/lib/store/auth.store";
import { apiFetch } from "../../shared/lib/api";
import { userAuthClasses as cls } from "./auth.classes";

export default function UserLoginPage() {
  const fetchUser = useAuthStore((s) => s.fetchUser);
  const navigate = useNavigate();
  const location = useLocation();

  const redirect = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get("redirect") || "/user/dashboard";
  }, [location.search]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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
    const url = new URL("/api/user/google/auth", window.location.origin);
    url.searchParams.set("redirect", redirect);
    window.location.href = url.toString();
  }

  return (
    <main className={cls.page}>
      <div className={cls.card}>
        <h1 className={cls.title}>Area Cliente</h1>
        <p className={cls.subtitle}>
          Accedi o crea il tuo account WebOnDay
        </p>

        <button
          className={cls.googleBtn}
          onClick={googleLogin}
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
            onClick={login}
            disabled={loading}
          >
            Accedi
          </button>

          <button
            className={cls.secondaryBtn}
            onClick={register}
            disabled={loading}
          >
            Registrati
          </button>
        </div>

        <p className={cls.hint}>
          L’accesso crea automaticamente una sessione sicura
        </p>
      </div>
    </main>
  );
}


=== FILE: components/cart/CartSticker.tsx
LANG: tsx
SIZE:     2976 bytes
----------------------------------------
// ======================================================
// FE || CartSticker — FLOW ORCHESTRATOR (v5)
// ======================================================
//
// RUOLO:
// - Entry point del flusso di acquisto
// - NON mostra pricing
// - NON gestisce items
//
// INVARIANTI:
// - Slot unico
// - Dopo createConfiguration → cart irrilevante
// ======================================================

import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { cartStore } from "../../../shared/lib/cart/cart.store";
import { useAuthStore } from "../../../shared/lib/store/auth.store";
import { uiBus } from "../../../shared/lib/ui/uiBus";

export default function CartSticker() {
  const [hasCart, setHasCart] = useState(
    Boolean(cartStore.getState().item)
  );
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();

  /* ======================================================
     SYNC STORE → LOCAL STATE
  ====================================================== */
  useEffect(() => {
    return cartStore.subscribe((s) =>
      setHasCart(Boolean(s.item))
    );
  }, []);

  /* ======================================================
     UI BUS
  ====================================================== */
  useEffect(() => {
    const off = uiBus.on("cart:toggle", () =>
      setOpen((v) => !v)
    );
    return () => off();
  }, []);

  /* ======================================================
     FLOW
  ====================================================== */
  const proceed = () => {
    if (!hasCart) return;

    // 🚫 guard: già nel configurator
    if (location.pathname.startsWith("/user/configurator")) {
      console.warn("[CART] already in configurator");
      return;
    }

    if (!user) {
      navigate("/user/login?redirect=/user");
      return;
    }

    navigate("/user/checkout");
  };

  /* ======================================================
     RENDER
  ====================================================== */
  return (
    <div className={`cart-sticker ${open ? "is-open" : ""}`}>
      <button
        className="cart-sticker__toggle"
        onClick={() => uiBus.emit("cart:toggle")}
      >
        <span className="cart-sticker__badge">
          {hasCart ? 1 : 0}
        </span>
        <span className="cart-sticker__label">
          Progetto
        </span>
      </button>

      {open && (
        <section className="cart-sticker__panel">
          {!hasCart ? (
            <p>Nessun progetto selezionato.</p>
          ) : (
            <>
              <p>Hai un progetto in corso.</p>

              <button
                className="wd-btn wd-btn--primary wd-btn--block"
                onClick={proceed}
              >
                Continua
              </button>
            </>
          )}
        </section>
      )}
    </div>
  );
}


=== FILE: components/hooks/useMyBusinessDrafts.ts
LANG: ts
SIZE:     3399 bytes
----------------------------------------
// ======================================================
// FE || HOOK || useMyBusinesses (STABLE + PARALLEL + ANTI-LOOP)
// File: src/user/pages/dashboard/configurator/api/useMyBusinessDrafts.ts
// ======================================================
//
// PERCHÉ:
// - Prima: N+1 chiamate sequenziali per ogni READY configuration
// - Dopo createBusinessDraft / createOwnerDraft può re-run spesso
// - Risultato: “fetch infiniti” percepiti + UI lenta
//
// FIX:
// - Dipendenza su signature stabile (ids READY)
// - Fetch in parallelo (Promise.all)
// - Guard anti re-run se signature non cambia
// ======================================================

import { useEffect, useMemo, useRef, useState } from "react";
import { apiFetch } from "@shared/lib/api";
import { useMyConfigurations } from "../../configurator/base_configuration/configuration/useMyConfigurations";

type BusinessVM = {
  configurationId: string;
  businessName: string;
  complete: boolean;
};

export function useMyBusinesses() {
  const { items: configurations = [], loading: cfgLoading } =
    useMyConfigurations();

  const [completed, setCompleted] = useState<BusinessVM[]>([]);
  const [inProgress, setInProgress] = useState<BusinessVM[]>([]);
  const [loading, setLoading] = useState(true);

  // signature stabile: se gli id READY non cambiano, non rifare fetch
  const readyIdsSignature = useMemo(() => {
    const ids = configurations
      .filter((c) => c.status === "CONFIGURATION_IN_PROGRESS")
      .map((c) => c.id)
      .sort();
    return ids.join("|");
  }, [configurations]);

  const lastSigRef = useRef<string>("");

  useEffect(() => {
    if (cfgLoading) return;

    // se non ci sono READY, reset pulito
    if (!readyIdsSignature) {
      setCompleted([]);
      setInProgress([]);
      setLoading(false);
      lastSigRef.current = "";
      return;
    }

    // anti re-run inutile
    if (lastSigRef.current === readyIdsSignature) return;
    lastSigRef.current = readyIdsSignature;

    let alive = true;
    setLoading(true);

    const readyConfigs = configurations.filter((c) => c.status === "CONFIGURATION_IN_PROGRESS");

    (async () => {
      try {
        const responses = await Promise.all(
          readyConfigs.map(async (c) => {
            const res = await apiFetch<{
              ok: boolean;
              draft?: any;
            }>(`/api/business/get-base-draft?configurationId=${c.id}`);

            if (res?.ok && res.draft) {
              const businessName =
                res.draft.businessName ??
                c.prefill?.businessName ??
                "Attività";

              return {
                configurationId: c.id,
                businessName,
                complete: Boolean(res.draft.complete),
              } as BusinessVM;
            }

            return null;
          })
        );

        if (!alive) return;

        const results = responses.filter(Boolean) as BusinessVM[];
        setCompleted(results.filter((b) => b.complete));
        setInProgress(results.filter((b) => !b.complete));
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [cfgLoading, readyIdsSignature, configurations]);

  return {
    completed,
    inProgress,
    loading,
    hasCompleted: completed.length > 0,
    hasInProgress: inProgress.length > 0,
  };
}


=== FILE: components/payments/PaypalButton.tsx
LANG: tsx
SIZE:     2271 bytes
----------------------------------------
// ======================================================
// FE || components/payments/PaypalButton.tsx
// ======================================================
//
// AI-SUPERCOMMENT — PAYPAL INTEGRATION
//
// RUOLO:
// - Mount SDK PayPal
// - Avvio pagamento su orderId
//
// INVARIANTI:
// - orderId già creato (BE source of truth)
// - Nessuna logica prezzi
//
// RISCHI:
// - SDK esterno
// - Side-effects globali (window.paypal)
// ======================================================
import { useEffect, useRef } from "react";
import { API_BASE } from "../../../shared/lib/config";
type Props = {
  orderId: string; // ID ordine interno (KV)
};

declare global {
  interface Window {
    paypal: any;
  }
}

export default function PaypalButton({ orderId }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.paypal || !ref.current) return;

    window.paypal.Buttons({
      style: {
        layout: "vertical",
        color: "gold",
        shape: "pill",
        label: "paypal",
      },

      // 1️⃣ crea ordine PayPal
      createOrder: async () => {
        const res = await fetch(`${API_BASE}/api/payment/paypal/create-order`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId }),
        });

        const data = await res.json();
        if (!data.paypalOrderId) {
          throw new Error("Errore creazione ordine PayPal");
        }

        return data.paypalOrderId;
      },

      // 2️⃣ capture = SOLDI
      onApprove: async () => {
        const res = await fetch(`${API_BASE}/api/payment/paypal/capture-order`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId }),
        });

        const data = await res.json();

        if (data.paymentStatus === "paid") {
          alert("Pagamento completato ✅");
          // qui puoi redirect / thank you page
        } else {
          alert("Pagamento non completato");
        }
      },

      onError: (err: any) => {
        console.error("PayPal error:", err);
        alert("Errore PayPal");
      },
    }).render(ref.current);
  }, [orderId]);

  return <div ref={ref} />;
}


=== FILE: configurator/ConfiguratorLayout.tsx
LANG: tsx
SIZE:     2177 bytes
----------------------------------------
// ======================================================
// FE || components/layouts/ConfiguratorLayout.tsx
// ======================================================
//
// AI-SUPERCOMMENT — CONFIGURATOR LAYOUT (CANONICAL)
//
// RUOLO:
// - Layout condiviso per il configuratore
// - Guard auth HARD
// - NON crea configuration
// - NON decide flussi
//
// INVARIANTE CRITICA:
// - MAI perdere l'URL corrente (configurator/:id)
// - Il redirect al login DEVE preservare :id
//
// USATO DA:
// - /user/configurator
// - /user/configurator/:id
// ======================================================

import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../../shared/lib/store/auth.store";

export default function ConfiguratorLayout() {
  const user = useAuthStore((s) => s.user);
  const ready = useAuthStore((s) => s.ready);

  const location = useLocation();

  /* ======================================================
     AUTH GUARD — HARD
     ❗ PRESERVA SEMPRE L’URL CORRENTE
  ====================================================== */
  useEffect(() => {
    if (ready && !user) {
      const redirect = encodeURIComponent(
        location.pathname + location.search
      );

      window.location.href =
        `/user/login?redirect=${redirect}`;
    }
  }, [ready, user, location]);

  /* ======================================================
     LOADING / BLOCK
  ====================================================== */
  if (!ready) {
    return <p>Caricamento…</p>;
  }

  if (!user) {
    // redirect già in corso
    return null;
  }

  /* ======================================================
     LAYOUT
  ====================================================== */
  return (
    <section className="configurator-page">
      <header className="configuration-header">
        <h1>Configura il tuo progetto</h1>
        <p style={{ opacity: 0.7 }}>
          Completa le informazioni per preparare la preview
          del tuo progetto WebOnDay.
        </p>
      </header>

      <div className="configuration-body">
        <Outlet />
      </div>
    </section>
  );
}


=== FILE: configurator/[id].tsx
LANG: tsx
SIZE:     2643 bytes
----------------------------------------
// ======================================================
// FE || Configurator Entry — CANONICAL & MINIMAL
// ======================================================
//
// RUOLO:
// - Carica una Configuration ESISTENTE (BASE)
// - Inizializza lo store FE (Zustand)
// - Avvia il wizard UI
//
// INVARIANTI:
// - Nessuna creazione Configuration
// - Backend = source of truth
// - Senza configurationId → redirect
//
// ======================================================

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
  getConfigurationForConfigurator,
} from "./base_configuration/configuration/configuration.user.api";

import { useConfigurationSetupStore }from "@shared/domain/user/configurator/configurationSetup.store"
import ConfigurationSetupPage from "./base_configuration/configuration/ConfigurationSetupPage";

export default function ConfigurationEntryPage() {
  const { id: configurationId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { setField, reset } = useConfigurationSetupStore();
  const [loading, setLoading] = useState(true);

  /* ======================================================
     INIT — LOAD CONFIGURATION BASE
  ====================================================== */
  useEffect(() => {
    if (!configurationId) {
      navigate("/user/dashboard", { replace: true });
      return;
    }

    // 🔁 evita stati fantasma
    reset();

    getConfigurationForConfigurator(configurationId)
      .then((res) => {
        const cfg = res.configuration;

        if (!cfg) {
          navigate("/user/dashboard", { replace: true });
          return;
        }

        // ==========================================
        // 🔑 STORE INIT — BASE FIELDS ONLY
        // ==========================================
        setField("configurationId", cfg.id);
        setField("solutionId", cfg.solutionId);
        setField("productId", cfg.productId);
        

        // ⚠️ Prefill UX opzionale (NON dominio)
        if (cfg.prefill?.businessName) {
          setField("businessName", cfg.prefill.businessName);
        }





        
      })
      .catch(() => {
        navigate("/user/dashboard", { replace: true });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [configurationId, navigate, reset, setField]);

  /* ======================================================
     UI GUARD
  ====================================================== */
  if (loading) {
    return <p>Preparazione configurazione…</p>;
  }

  return <ConfigurationSetupPage />;
}


=== FILE: configurator/api/Business.store-model.ts
LANG: ts
SIZE:     1424 bytes
----------------------------------------
/**
 * ======================================================
 * FE || BusinessStoreModel
 * ======================================================
 *
 * RUOLO:
 * - Stato FE dell’attività business dell’utente
 *
 * USATO DA:
 * - Zustand store
 * - Dashboard user / business
 *
 * ORIGINE:
 * - Backend (via userApi)
 *
 * NOTE:
 * - Rappresenta stato persistente FE
 * - NON è una view
 * ======================================================
 */


export interface BusinessDTO {
    id: string;
    ownerUserId: string;
  
    name: string;
    address: string;
    phone: string;
    openingHours?: string | null;
  
    menuPdfUrl: string | null;
  
    referralToken: string;
    referredBy: string | null;
  
    status: "draft" | "active" | "suspended";
    createdAt: string;
  }
  /* AI-SUPERCOMMENT
 * RUOLO:
 * - Stato Business lato FE
 * - openingHours = verità FE allineata al BE
 */

export type TimeRange = { from: string; to: string };

export type OpeningHours = {
  monday: TimeRange[];
  tuesday: TimeRange[];
  wednesday: TimeRange[];
  thursday: TimeRange[];
  friday: TimeRange[];
  saturday: TimeRange[];
  sunday: TimeRange[];
};

export type BusinessState = {
  openingHours: OpeningHours;
  loading: boolean;
  error?: string;
};

export const emptyOpeningHours: OpeningHours = {
  monday: [],
  tuesday: [],
  wednesday: [],
  thursday: [],
  friday: [],
  saturday: [],
  sunday: [],
};


=== FILE: configurator/api/business.api.ts
LANG: ts
SIZE:      520 bytes
----------------------------------------
/* AI-SUPERCOMMENT
 * RUOLO:
 * - Client FE per Business OpeningHours
 */

import {type OpeningHours } from "./Business.store-model";

export async function updateBusinessOpeningHours(
  businessId: string,
  openingHours: OpeningHours
): Promise<void> {
  const res = await fetch(`/api/business/${businessId}/opening-hours`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(openingHours),
  });

  if (!res.ok) {
    throw new Error("Errore salvataggio orari");
  }
}



=== FILE: configurator/api/business.user.api.ts
LANG: ts
SIZE:     3970 bytes
----------------------------------------
// ======================================================
// FE || lib/userApi/business.user.api.ts
// ======================================================
//
// AI-SUPERCOMMENT — BUSINESS DOMAIN (USER SIDE)
//
// Backend = source of truth
// Questo layer:
// - normalizza
// - protegge la UI da null
// ======================================================

import { apiFetch } from "../../../shared/lib/api";

/* ======================================================
   TYPES
====================================================== */

export type BusinessSummaryDTO = {
  businessId: string;
  publicId: string;
  name: string;
  status: "draft" | "pending" | "active" | "suspended";
  createdAt: string;
};

export type CreateBusinessPayload = {
  name: string;
  address: string;
  phone?: string;
  openingHours?: Record<string, string>;

  solutionId: string;
  productId: string;
  optionIds: string[];
};

/* ======================================================
   API — USER BUSINESS
====================================================== */
/**
 * ======================================================
 * API — LIST MY BUSINESSES (USER)
 * GET /api/business
 *
 * RUOLO:
 * - Recupera tutti i business associati all’utente loggato
 *
 * BACKEND CONTRACT (SOURCE OF TRUTH):
 * {
 *   ok: true,
 *   items: BusinessSummaryDTO[]
 * }
 * ======================================================
 */

export async function listMyBusinesses(): Promise<{
  ok: true;
  items: BusinessSummaryDTO[];
}> {
  const res = await apiFetch<{
    ok: true;
    items: BusinessSummaryDTO[];
  }>("/api/business", {
    method: "GET",
  });

  // SAFETY GUARD — apiFetch non dovrebbe mai tornare null,
  // ma questa guardia evita crash silenziosi
  if (!res) {
    throw new Error("API /api/business returned null response");
  }

  return res;
}

/**
 * POST /api/business/create
 */
export async function createBusiness(
  payload: CreateBusinessPayload
): Promise<{
  ok: true;
  businessId: string;
  status: "draft";
}> {
  const res = await apiFetch<{
    ok: boolean;
    businessId: string;
    status: "draft";
  }>("/api/business/create", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (!res) {
    throw new Error("API /api/business/create returned null");
  }

  return res as {
    ok: true;
    businessId: string;
    status: "draft";
  };
}

/**
 * POST /api/business/menu/upload
 */
export async function uploadBusinessMenu(
  businessId: string,
  file: File
): Promise<{
  ok: true;
  businessId: string;
  menuPdfUrl: string;
  status: "pending";
}> {
  const form = new FormData();
  form.append("file", file);

  const res = await apiFetch<{
    ok: boolean;
    businessId: string;
    menuPdfUrl: string;
    status: "pending";
  }>(`/api/business/menu/upload?businessId=${businessId}`, {
    method: "POST",
    body: form,
    headers: {},
  });

  if (!res) {
    throw new Error("API /api/business/menu/upload returned null");
  }

  return res as {
    ok: true;
    businessId: string;
    menuPdfUrl: string;
    status: "pending";
  };
}
/* ======================================================
   GET BUSINESS (DETAIL — USER)
   GET /api/business/:id
====================================================== */

/* ======================================================
   GET BUSINESS (DETAIL — USER)
   GET /api/business/:id
====================================================== */
export async function getBusiness(
  businessId: string
): Promise<{
  ok: boolean;
  business: {
    id: string;
    name: string;
    status: string;
    address: string;
    phone: string;
  };
}> {
  const res = await apiFetch<{
    ok: boolean;
    business: {
      id: string;
      name: string;
      status: string;
      address: string;
      phone: string;
    };
  }>(`/api/business/${businessId}`);

  if (!res) {
    throw new Error("Invalid response from GET /api/business/:id");
  }

  return res;
}



=== FILE: configurator/base_configuration/business/BusinessForm.tsx
LANG: tsx
SIZE:    13244 bytes
----------------------------------------
// ======================================================
// FE || BusinessForm.tsx
// ======================================================
//
// RUOLO (CANONICAL):
// - Raccolta dati Business (FE only)
// - Applica seed da Solution (READ ONLY):
//   • descriptionTags
//   • serviceTags
//   • openingHours
//
// PRINCIPI:
// - Backend = source of truth per Solution
// - FE Store = source of truth per Business draft
//
// INVARIANTI:
// - ❌ Nessun fetch extra
// - ❌ Nessuna AI
// ======================================================

import { useEffect } from "react";
import type { OpeningHoursFE } from "@shared/domain/business/openingHours.types";
import { useConfigurationSetupStore } from "@shared/domain/user/configurator/configurationSetup.store";
import { useAuthStore } from "@shared/lib/store/auth.store";
import { OpeningHoursDay } from "./OpeningHoursDay";
import { apiFetch } from "@shared/lib/api";
import type { SolutionSeed } from "@shared/domain/business/buseinssRead.types";
import { isOpeningHoursEmpty } from "@shared/domain/business/openingHours.utils";
import { useCityAutocomplete } from "@shared/lib/geo/useCityAutocomplete";

/* ======================================================
   TYPES
====================================================== */

type BusinessFormProps = {
  onComplete: () => void;
  solutionSeed: SolutionSeed | null;
};

/* ======================================================
   COSTANTI
====================================================== */

const DAYS = [
  ["monday", "Lunedì"],
  ["tuesday", "Martedì"],
  ["wednesday", "Mercoledì"],
  ["thursday", "Giovedì"],
  ["friday", "Venerdì"],
  ["saturday", "Sabato"],
  ["sunday", "Domenica"],
] as const;

/* ======================================================
   UTILS
====================================================== */

function toggleTag(list: string[] = [], tag: string): string[] {
  return list.includes(tag)
    ? list.filter((t) => t !== tag)
    : [...list, tag];
}

/* ======================================================
   COMPONENT
====================================================== */

export default function BusinessForm({
  onComplete,
  solutionSeed,
}: BusinessFormProps) {
  const { data, setField } = useConfigurationSetupStore();
  const user = useAuthStore((s) => s.user);

  const { suggestions, hasSuggestions } = useCityAutocomplete(
    data.businessAddress?.city ?? ""
  );

  /* ======================================================
     PREFILL EMAIL (AUTH → STORE)
  ====================================================== */

  useEffect(() => {
    if (user?.email && !data.email) {
      setField("email", user.email);
    }
  }, [user?.email, data.email, setField]);

  /* ======================================================
     PREFILL OPENING HOURS FROM SOLUTION (SAFE)
  ====================================================== */

  useEffect(() => {
    if (
      solutionSeed?.openingHours &&
      isOpeningHoursEmpty(data.openingHours)
    ) {
      setField("openingHours", solutionSeed.openingHours);
    }
  }, [solutionSeed, data.openingHours, setField]);

  /* ======================================================
     HELPERS
  ====================================================== */

  function hasAtLeastOneOpeningRange(
    openingHours: OpeningHoursFE
  ): boolean {
    return Object.values(openingHours).some(
      (ranges) => ranges.length > 0
    );
  }

  /* ======================================================
     SUBMIT — UPSERT BUSINESS DRAFT
  ====================================================== */
  console.log("[DEBUG][BUSINESS_ADDRESS]", data.businessAddress);
  async function handleSubmit() {
    console.group("[BUSINESS_FORM][SUBMIT]");
    console.log("STORE SNAPSHOT", data);

    /* =========================
       VALIDAZIONI FE
    ========================= */

    if (!data.businessName?.trim()) {
      alert("Inserisci il nome dell’attività");
      console.groupEnd();
      return;
    }

    if (!data.email?.trim()) {
      alert("Completa il campo Email");
      console.groupEnd();
      return;
    }

    if (!data.privacy?.accepted) {
      alert("Devi accettare il trattamento dei dati");
      console.groupEnd();
      return;
    }

    if (!hasAtLeastOneOpeningRange(data.openingHours)) {
      alert("Inserisci almeno un orario di apertura");
      console.groupEnd();
      return;
    }

    const a = data.businessAddress;

    if (!a?.street?.trim()) {
      alert("Completa il campo Indirizzo (via)");
      console.groupEnd();
      return;
    }

    if (!a?.number?.trim()) {
      alert("Completa il campo Numero civico");
      console.groupEnd();
      return;
    }

    if (!a?.city?.trim()) {
      alert("Completa il campo Città");
      console.groupEnd();
      return;
    }

    if (!data.phone?.trim()) {
      const proceed = confirm(
        "Non hai inserito un numero di telefono. Vuoi continuare?"
      );
      if (!proceed) {
        console.groupEnd();
        return;
      }
    }

    /* =========================
       MAP FE → BE (CANONICAL)
    ========================= */

    const payload = {
      configurationId: data.configurationId,
      solutionId: data.solutionId,
      productId: data.productId,

      businessName: data.businessName,
      openingHours: data.openingHours,

      contact: {
        mail: data.email,
        phoneNumber: data.phone,
      },

      address: {
        street: a.street,
        number: a.number,
        city: a.city,
        province: a.province,
        region: a.region,
        zip: a.zip,
        country: a.country,
      },

      businessDescriptionTags: data.businessDescriptionTags,
      businessServiceTags: data.businessServiceTags,

      privacy: {
        accepted: true,
        acceptedAt: data.privacy.acceptedAt,
        policyVersion: data.privacy.policyVersion,
      },
    };

    console.log("PAYLOAD → BE", payload);

    try {
      const res = await apiFetch<{
        ok: true;
        businessDraftId: string;
      }>("/api/business/create-draft", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (!res?.businessDraftId) {
        throw new Error("BUSINESS_DRAFT_UPSERT_FAILED");
      }

      setField("businessDraftId", res.businessDraftId);
      console.groupEnd();
      onComplete();
    } catch (err) {
      console.error("[BUSINESS_FORM][ERROR]", err);
      alert("Errore nel salvataggio del business");
      console.groupEnd();
    }
  }

  /* ======================================================
     RENDER
  ====================================================== */

  return (
    <div className="step">
      <h2>Configuriamo il tuo business</h2>

      {/* ================= ANAGRAFICA ================= */}

      <input
        placeholder="Nome attività"
        value={data.businessName}
        onChange={(e) =>
          setField("businessName", e.target.value)
        }
      />

      <input placeholder="Email" value={data.email} disabled />

      <input
        placeholder="Telefono"
        value={data.phone ?? ""}
        onChange={(e) => setField("phone", e.target.value)}
      />

      {/* ================= PRIVACY ================= */}

      <label>
        <input
          type="checkbox"
          checked={data.privacy.accepted}
          onChange={(e) =>
            setField("privacy", {
              accepted: e.target.checked,
              acceptedAt: e.target.checked
                ? new Date().toISOString()
                : "",
              policyVersion: "v1",
            })
          }
        />
        Accetto il trattamento dei dati personali
      </label>

      {/* ================= INDIRIZZO ================= */}
      <fieldset className="business-address">
  <legend>Indirizzo dell’attività</legend>

  {/* VIA */}
  <div className="form-field">
    <label htmlFor="business-address-street">Via / Indirizzo *</label>
    <input
      id="business-address-street"
      className="input-address-street"
      placeholder="Es. Via Roma"
      value={data.businessAddress?.street ?? ""}
      onChange={(e) =>
        setField("businessAddress", {
          ...data.businessAddress,
          street: e.target.value,
        })
      }
    />
  </div>

  {/* NUMERO CIVICO */}
  <div className="form-field">
    <label htmlFor="business-address-number">Numero civico *</label>
    <input
      id="business-address-number"
      className="input-address-number"
      placeholder="Es. 12"
      value={data.businessAddress?.number ?? ""}
      onChange={(e) =>
        setField("businessAddress", {
          ...data.businessAddress,
          number: e.target.value,
        })
      }
    />
  </div>

  {/* CITTÀ + AUTOCOMPLETE */}
  <div className="form-field city-autocomplete">
    <label htmlFor="business-address-city">
      Città *
      <span className="hint"> (suggerimenti automatici)</span>
    </label>

    <input
      id="business-address-city"
      className="input-address-city"
      placeholder="Inizia a scrivere…"
      value={data.businessAddress?.city ?? ""}
      onChange={(e) =>
        setField("businessAddress", {
          ...data.businessAddress,
          city: e.target.value,
        })
      }
    />

    {hasSuggestions && (
      <ul className="autocomplete-list">
        {suggestions.map((c) => (
          <li
            key={`${c.city}-${c.province}`}
            className="autocomplete-item"
            onClick={() =>
              setField("businessAddress", {
                ...data.businessAddress,
                city: c.city,
                province: c.province,
                region: c.region,   // FE-only
                country: c.state,   // FE-only
              })
            }
          >
            <strong>{c.city}</strong>
            <span className="meta">
              {c.province} · {c.region}
            </span>
          </li>
        ))}
      </ul>
    )}
  </div>

  {/* PROVINCIA */}
  <div className="form-field">
    <label htmlFor="business-address-province">Provincia</label>
    <input
      id="business-address-province"
      className="input-address-province"
      placeholder="Es. BA"
      value={data.businessAddress?.province ?? ""}
      onChange={(e) =>
        setField("businessAddress", {
          ...data.businessAddress,
          province: e.target.value.toUpperCase(),
        })
      }
    />
  </div>

  {/* CAP */}
  <div className="form-field">
    <label htmlFor="business-address-zip">CAP</label>
    <input
      id="business-address-zip"
      className="input-address-zip"
      placeholder="Es. 70100"
      value={data.businessAddress?.zip ?? ""}
      onChange={(e) =>
        setField("businessAddress", {
          ...data.businessAddress,
          zip: e.target.value,
        })
      }
    />
  </div>
</fieldset>

      {/* ================= TAG ================= */}

      {solutionSeed?.descriptionTags?.length ? (
        <>
          <h4>Descrizione attività</h4>
          <div className="tag-pills">
            {solutionSeed.descriptionTags.map((tag) => (
              <button
                key={tag}
                type="button"
                className={
                  data.businessDescriptionTags.includes(tag)
                    ? "pill active"
                    : "pill"
                }
                onClick={() =>
                  setField(
                    "businessDescriptionTags",
                    toggleTag(
                      data.businessDescriptionTags,
                      tag
                    )
                  )
                }
              >
                {tag}
              </button>
            ))}
          </div>
        </>
      ) : null}

      {solutionSeed?.serviceTags?.length ? (
        <>
          <h4>Servizi offerti</h4>
          <div className="tag-pills">
            {solutionSeed.serviceTags.map((tag) => (
              <button
                key={tag}
                type="button"
                className={
                  data.businessServiceTags.includes(tag)
                    ? "pill active"
                    : "pill"
                }
                onClick={() =>
                  setField(
                    "businessServiceTags",
                    toggleTag(
                      data.businessServiceTags,
                      tag
                    )
                  )
                }
              >
                {tag}
              </button>
            ))}
          </div>
        </>
      ) : null}

      {/* ================= ORARI ================= */}

      <h3>Orari di apertura</h3>

      {DAYS.map(([dayKey, label]) => (
        <OpeningHoursDay
          key={dayKey}
          dayKey={dayKey}
          dayLabel={label}
          value={data.openingHours[dayKey]}
          onChange={(value) =>
            setField("openingHours", {
              ...data.openingHours,
              [dayKey]: value,
            })
          }
        />
      ))}

      <div className="actions">
        <button onClick={handleSubmit}>Continua</button>
      </div>
    </div>
  );
}


=== FILE: configurator/base_configuration/business/DataTransferObject/input/business.draft.input.dto.ts
LANG: ts
SIZE:     1096 bytes
----------------------------------------
/* ======================================================
   DOMAIN || BUSINESS || DRAFT INPUT DTO (CANONICAL)
======================================================

RUOLO:
- DTO canonico per CREAZIONE / UPDATE BusinessDraft
- Usato da:
  - FE (BusinessForm)
  - POST /api/business/create-draft
  - POST /api/business/update-draft

INVARIANTI:
- Dominio = TimeRange (NO stringhe, NO legacy)
- businessDraftId NON richiesto in create
- Backend = source of truth
====================================================== */

import type { OpeningHoursFE } from "@shared/domain/business/openingHours.types";
export interface BusinessDraftInputDTO {
   configurationId: string;
 
   businessName: string;
   solutionId: string;
   productId: string;
 
   openingHours: OpeningHoursFE;
 
   contact: {
     mail: string;
     phoneNumber?: string;
     pec?: string;
   };
 
   address?: {
     street?: string;
     number?: string;
     city?: string;
     province?: string;
     zip?: string;
   };
 
   businessDescriptionTags: string[];
   businessServiceTags: string[];
 
   verified: false;
 }
 

=== FILE: configurator/base_configuration/business/DataTransferObject/output/business.draft.read.dto.ts
LANG: ts
SIZE:     1300 bytes
----------------------------------------
// ======================================================
// BE || DTO || BusinessDraftBaseReadDTO (READ)
// ======================================================
//
// RUOLO:
// - DTO READ per BusinessDraft
// - Usato per:
//   • Prefill Step Business (FE)
//   • Sync stato BE → FE
//
// SOURCE OF TRUTH:
// - BusinessDraftSchema (DOMAIN)
// ======================================================

import { type OpeningHoursFE } from "@shared/domain/business/openingHours.types";
// ⬆️ oppure importa dal punto canonico dove è definito

export type BusinessDraftBaseReadDTO = {
  businessDraftId: string;

  businessName: string;
  solutionId: string;
  productId: string;

  /* =====================
     DOMAIN — CANONICAL
  ====================== */
  openingHours: OpeningHoursFE;

  /* =====================
     CONTACT
  ====================== */
  
  contact: {
   mail: string;
   phoneNumber?: string;
   pec?: string;
 };
 address?: {
   street?: string;
   number?: string;
   city?: string;
   province?: string;
   zip?: string;
 };


  /* =====================
     CLASSIFICATION
  ====================== */
  businessDescriptionTags: string[];
  businessServiceTags: string[];

  /* =====================
     STATUS
  ====================== */
  verified: false;
};


=== FILE: configurator/base_configuration/business/OpeningHoursDay.tsx
LANG: tsx
SIZE:     3964 bytes
----------------------------------------
// ======================================================
// FE || components/OpeningHoursDay.tsx
// ======================================================
//
// RUOLO:
// - Gestisce orari di apertura per UN singolo giorno
// - Basato su TimeRange[] (NO stringhe)
//
// SOURCE OF TRUTH:
// - configurationSetup.store (OpeningHoursFE)
//
// SUPPORTA:
// - Chiuso        → []
// - H24           → [{ 00:00 → 23:59 }]
// - Orario unico  → [{ from, to }]
// - Doppio turno  → [{ from, to }, { from, to }]
//
// ======================================================

import type { TimeRangeFE } from "@shared/domain/business/openingHours.types";

type OpeningHoursDayProps = {
  dayKey: string;
  dayLabel: string;
  value: TimeRangeFE[];
  onChange: (value: TimeRangeFE[]) => void;
  disabled?: boolean;
};

const HOURS = Array.from({ length: 24 }, (_, i) =>
  String(i).padStart(2, "0")
);
const MINUTES = ["00", "15", "30", "45"];

export function OpeningHoursDay({
  dayLabel,
  value,
  onChange,
  disabled = false,
}: OpeningHoursDayProps) {
  const ranges = value ?? [];

  /* ======================================================
     PRESET ACTIONS
  ====================================================== */

  function setClosed() {
    onChange([]);
  }

  function setH24() {
    onChange([{ from: "00:00", to: "23:59" }]);
  }

  function setSingle() {
    onChange([{ from: "09:00", to: "18:00" }]);
  }

  function setSplit() {
    onChange([
      { from: "09:00", to: "13:00" },
      { from: "16:00", to: "20:00" },
    ]);
  }

  /* ======================================================
     UPDATE RANGE
  ====================================================== */

  function updateRange(
    index: number,
    patch: Partial<TimeRangeFE>
  ) {
    const next = [...ranges];
    next[index] = { ...next[index], ...patch };
    onChange(next);
  }

  /* ======================================================
     RENDER
  ====================================================== */

  return (
    <div className="opening-day">
      <strong>{dayLabel}</strong>

      {/* ================= PRESET ================= */}
      <div className="opening-presets">
        <button type="button" onClick={setClosed} disabled={disabled}>
          Chiuso
        </button>

        <button type="button" onClick={setH24} disabled={disabled}>
          H24
        </button>

        <button type="button" onClick={setSingle} disabled={disabled}>
          Orario unico
        </button>

        <button type="button" onClick={setSplit} disabled={disabled}>
          Doppio turno
        </button>
      </div>

      {/* ================= RANGE EDIT ================= */}
      {ranges.map((r, idx) => (
        <div key={idx} className="time-range">
          <TimeSelect
            value={r.from}
            onChange={(v) =>
              updateRange(idx, { from: v })
            }
          />
          <span> — </span>
          <TimeSelect
            value={r.to}
            onChange={(v) =>
              updateRange(idx, { to: v })
            }
          />
        </div>
      ))}
    </div>
  );
}

/* ======================================================
   SUB — TIME SELECT
====================================================== */

function TimeSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [h, m] = value.split(":");

  return (
    <>
      <select
        value={h}
        onChange={(e) =>
          onChange(`${e.target.value}:${m}`)
        }
      >
        {HOURS.map((x) => (
          <option key={x} value={x}>
            {x}
          </option>
        ))}
      </select>

      :

      <select
        value={m}
        onChange={(e) =>
          onChange(`${h}:${e.target.value}`)
        }
      >
        {MINUTES.map((x) => (
          <option key={x} value={x}>
            {x}
          </option>
        ))}
      </select>
    </>
  );
}


=== FILE: configurator/base_configuration/business/StepBusinessInfo.tsx
LANG: tsx
SIZE:     6257 bytes
----------------------------------------
// ======================================================
// FE || STEP — BUSINESS INFO (CANONICAL)
// ======================================================
//
// RUOLO:
// - Carica dati READ-ONLY da Solution
// - Carica BusinessDraft (se esiste)
// - Prefilla COMPLETAMENTE lo store FE
//
// SOURCE OF TRUTH:
// - BusinessDraft (BE) → vince sempre
// - Solution (BE) → seed iniziale
//
// NOTE:
// - openingHours arriva GIÀ strutturato dal BE
// - NON esiste più openingHoursDefault
// ======================================================

import { useEffect, useState } from "react";
import { isOpeningHoursEmpty } from "@shared/domain/business/openingHours.utils";
import { apiFetch } from "@shared/lib/api";
import { getSolutionById } from "@src/marketing/pages/buyflow/api/publiApi/solutions/solutions.public.api";
import { useConfigurationSetupStore } from "@shared/domain/user/configurator/configurationSetup.store";
import BusinessForm from "./BusinessForm";

import type {
  SolutionSeed,
  BusinessDraftReadDTO,
} from "@shared/domain/business/buseinssRead.types";

/* ======================================================
   COMPONENT
====================================================== */

export default function StepBusinessInfo({
  onNext,
}: {
  onNext: () => void;
}) {
  const { data, setField } = useConfigurationSetupStore();

  const [seed, setSeed] = useState<SolutionSeed | null>(null);
  const [loading, setLoading] = useState(true);

  /* ======================================================
     HARD GUARD — CONFIG MINIMA
  ====================================================== */

  if (!data.solutionId || !data.productId) {
    console.error("[STEP_BUSINESS][GUARD_FAIL]", {
      solutionId: data.solutionId,
      productId: data.productId,
    });

    return (
      <div className="step-error">
        <h2>Configurazione incompleta</h2>
      </div>
    );
  }

  /* ======================================================
     BOOTSTRAP
     1) Load Solution (seed)
     2) Load BusinessDraft (override)
  ====================================================== */

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      try {
        console.group("[STEP_BUSINESS][BOOTSTRAP][START]");
        console.log("CTX", {
          solutionId: data.solutionId,
          configurationId: data.configurationId,
        });

        /* =========================
           1️⃣ LOAD SOLUTION (READ ONLY)
        ========================= */

        const solution = await getSolutionById(data.solutionId);

        if (cancelled) return;

        const nextSeed: SolutionSeed = {
          descriptionTags: solution.descriptionTags ?? [],
          serviceTags: solution.serviceTags ?? [],
          openingHours: solution.openingHours ?? null,
        };

        console.log("[STEP_BUSINESS][SOLUTION][SEED]", nextSeed);
        setSeed(nextSeed);

        // 👉 Prefill openingHours SOLO se lo store è vuoto
        if (
          nextSeed.openingHours &&
          isOpeningHoursEmpty(data.openingHours)
        ) {
          console.log(
            "[STEP_BUSINESS][OPENING_HOURS][PREFILL_FROM_SOLUTION]",
            nextSeed.openingHours
          );
          setField("openingHours", nextSeed.openingHours);
        }

        /* =========================
           2️⃣ LOAD BUSINESS DRAFT (BE WINS)
        ========================= */

        if (!data.configurationId) return;

        const res = await apiFetch<{
          ok: boolean;
          draft?: BusinessDraftReadDTO;
        }>(
          `/api/business/get-base-draft?configurationId=${data.configurationId}`,
          { method: "GET" }
        );

        if (cancelled || !res?.draft) return;

        const d = res.draft;

        console.log("[STEP_BUSINESS][DRAFT][RAW]", d);

        /* =========================
           APPLY DRAFT → STORE
        ========================= */

        setField("businessDraftId", d.businessDraftId);
        setField("businessName", d.businessName);

        // CONTACT
        if (d.contact?.mail) {
          setField("email", d.contact.mail);
        }

        if (d.contact?.phoneNumber) {
          setField("phone", d.contact.phoneNumber);
        }

        // ADDRESS (CANONICAL OBJECT)
        if (d.address ) {
          setField("businessAddress", {
            street: d.address.street ?? "",
            number: d.address.number ?? "",
            city: d.address.city ?? "",
            province: d.address.province ?? "",
            zip: d.address.zip ?? "",
            region: "",
            country: "Italia",
          });
        }

        // TAGS
        setField(
          "businessDescriptionTags",
          d.businessDescriptionTags ?? []
        );

        setField(
          "businessServiceTags",
          d.businessServiceTags ?? []
        );

        // PRIVACY
        if (d.privacy) {
          setField("privacy", {
            accepted: d.privacy.accepted,
            acceptedAt: d.privacy.acceptedAt,
            policyVersion: d.privacy.policyVersion,
          });
        }

        // OPENING HOURS (BE OVERRIDE TOTALE)
        if (d.openingHours) {
          console.log(
            "[STEP_BUSINESS][OPENING_HOURS][PREFILL_FROM_DRAFT]",
            d.openingHours
          );
          setField("openingHours", d.openingHours);
        }

        console.groupEnd();
      } catch (err) {
        console.error("[STEP_BUSINESS][BOOTSTRAP][ERROR]", err);
      } finally {
        if (!cancelled) {
          console.log("[STEP_BUSINESS][BOOTSTRAP][DONE]");
          setLoading(false);
        }
      }
    }

    bootstrap();

    return () => {
      cancelled = true;
    };
  }, [data.solutionId, data.configurationId, setField]);

  /* ======================================================
     UI GUARD
  ====================================================== */

  if (loading) {
    return <div className="step">Caricamento dati business…</div>;
  }

  /* ======================================================
     RENDER
  ====================================================== */

  return (
    <BusinessForm
      solutionSeed={seed}
      onComplete={onNext}
    />
  );
}


=== FILE: configurator/base_configuration/business/StepContent.tsx
LANG: tsx
SIZE:     1154 bytes
----------------------------------------
import { useConfigurationSetupStore }from "@shared/domain/user/configurator/configurationSetup.store"
import { OpeningHoursDay } from "./OpeningHoursDay";


import {
  DAYS_ORDER, 
} from "@shared/domain/business/openingHours.types";
import { DAY_LABELS } from "@shared/domain/business/openingHours.constants";

export default function StepContent({ onNext, onBack }: any) {
  const { data, setField } = useConfigurationSetupStore();

  return (
    <div className="step">
      <h2>Contenuti del sito</h2>

      {/* … testi e visibility invariati … */}

      <h3>Orari di apertura</h3>

      { DAYS_ORDER.map((dayKey) => (
        <OpeningHoursDay
          key={dayKey}
          dayKey={dayKey}
          dayLabel={DAY_LABELS[dayKey] ?? []}
          value={data.openingHours?.[dayKey] ?? []}
          onChange={(value) =>
            setField("openingHours", {
              ...data.openingHours,
              [dayKey]: value,
            })
          }
        />
      ))}

      <div className="actions">
        <button onClick={onBack}>Indietro</button>
        <button onClick={onNext}>Continua</button>
      </div>
    </div>
  );
}


=== FILE: configurator/base_configuration/business/business/configuration.draft.complete.ts
LANG: ts
SIZE:     1966 bytes
----------------------------------------
// ======================================================
// FE || domains/business/api/configuration.api.ts
// ======================================================
//
// AI-SUPERCOMMENT — CONFIGURATION API
//
// RUOLO:
// - Orchestrazione Configuration (FE → BE)
//
// INVARIANTI:
// - Session cookie obbligatorio
// - FE NON passa ownerId
// - FE NON passa business data
// ======================================================

import { apiFetch } from "../../../../../shared/lib/api";

/* ======================================================
   INPUT DTO
====================================================== */

export interface AttachOwnerToConfigurationInputDTO {
  configurationId: string;
}

/* ======================================================
   POST — ATTACH OWNER
   POST /api/business/configuration/attach-owner
====================================================== */
export async function attachOwnerToConfiguration(
  payload: AttachOwnerToConfigurationInputDTO
): Promise<
  | { ok: true; configurationId?: string; status?: string }
  | { ok: false; error: string }
> {
  try {
    const res = await apiFetch<{
      ok: boolean;
      configurationId?: string;
      status?: string;
      error?: string;
    }>("/api/business/configuration/attach-owner", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    // ❌ NON essere più rigidi del backend
    if (!res) {
      return { ok: false, error: "EMPTY_RESPONSE" };
    }

    if (res.ok === false) {
      return {
        ok: false,
        error: res.error ?? "CONFIGURATION_ATTACH_OWNER_FAILED",
      };
    }

    // ✅ OK è OK, anche se mancano campi opzionali
    return {
      ok: true,
      configurationId: res.configurationId,
      status: res.status,
    };
  } catch (err) {
    console.error(
      "[CONFIGURATION_API][ATTACH_OWNER][ERROR]",
      err
    );
    return {
      ok: false,
      error: "NETWORK_ERROR",
    };
  }
}


=== FILE: configurator/base_configuration/business/business/useMyOwnerDraft.ts
LANG: ts
SIZE:     2288 bytes
----------------------------------------
// ======================================================
// FE || HOOK || useMyOwnerDraft
// ======================================================
//
// RUOLO:
// - Legge OwnerDraft legato a una Configuration
// - Espone SOLO dati FE-safe
//
// INVARIANTI:
// - configurationId obbligatorio
// - Backend = source of truth
// - Idempotente
// ======================================================

import { useEffect, useState } from "react";
import { apiFetch } from "../../../../../shared/lib/api";

/* ======================================================
   DTO — RESPONSE
====================================================== */
export type OwnerDraftReadResponse = {
  ok: true;
  ownerDraft: {
    id: string;
    firstName: string;
    lastName: string;
    birthDate?: string;
    contact?: {
      secondaryMail?: string;
    };
    privacy: {
      accepted: boolean;
      acceptedAt: string;
      policyVersion: string;
    };
    complete: boolean;
  };
};

/* ======================================================
   HOOK
====================================================== */
export function useMyOwnerDraft(configurationId?: string) {
  const [data, setData] =
    useState<OwnerDraftReadResponse["ownerDraft"] | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!configurationId) {
      setData(null);
      setLoading(false);
      return;
    }

    let alive = true;
    setLoading(true);
    setError(null);

    (async () => {
      try {
        const res = await apiFetch<OwnerDraftReadResponse>(
          `/api/business/owner-draft?configurationId=${configurationId}`,
          { method: "GET" }
        );

        if (!alive) return;

        if (res?.ok && res.ownerDraft) {
          setData(res.ownerDraft);
        } else {
          setData(null);
        }
      } catch (err) {
        if (!alive) return;
        setError("OWNER_DRAFT_FETCH_FAILED");
        setData(null);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [configurationId]);

  return {
    data,
    loading,
    error,
    isComplete: data?.complete === true,
    hasDraft: !!data,
  };
}


=== FILE: configurator/base_configuration/business/business/useMyProfile.ts
LANG: ts
SIZE:        0 bytes
----------------------------------------


=== FILE: configurator/base_configuration/configuration/ConfigurationConfiguratorDTO.ts
LANG: ts
SIZE:      269 bytes
----------------------------------------

export type ConfigurationConfiguratorDTO = {
  id: string;

  solutionId: string;
  productId: string;
  optionIds?: string[];

  status?: string;

  createdAt?: string;
  updatedAt?: string;

  // opzionale: prefill UX
  prefill?: {
    businessName?: string;
  };
};

=== FILE: configurator/base_configuration/configuration/ConfigurationSetupPage.tsx
LANG: tsx
SIZE:     5247 bytes
----------------------------------------
// ======================================================
// FE || pages/user/configurator/setup/ConfigurationSetupPage.tsx
// ======================================================
//
// AI-SUPERCOMMENT — CONFIGURATION WIZARD (UI ONLY)
//
// RUOLO:
// - Orchestratore UI del wizard di configurazione
// - Gestisce SOLO:
//   • step corrente
//   • navigazione avanti / indietro
//   • rendering degli step
//
// COSA FA:
// - Legge dati minimi dallo store Zustand
// - Renderizza lo step corretto
//
// COSA NON FA:
// - ❌ NON fa fetch
// - ❌ NON inizializza dati business
// - ❌ NON persiste nulla
// - ❌ NON conosce logiche degli step
//
// SOURCE OF TRUTH:
// - configurationSetupStore (Zustand)
//
// ======================================================

import { useState } from "react";
import { useConfigurationSetupStore }from "@shared/domain/user/configurator/configurationSetup.store"
//import StepProductIntro from "./steps/StepProductIntro";
import StepBusinessInfo from "../business/StepBusinessInfo";
import StepOwnerInfo from "../../owner/StepOwnerInfo";
import StepCommitConfiguration from "./StepCommitConfiguration";
import StepComplete from "./StepComplete";
//import StepDesign from "./steps/StepDesign";
//import StepLayoutGenerator from "./steps/StepLayoutGenerator";
//import StepReview from "./steps/StepReview";

/* =========================
   STEPS ORDER (CANONICAL)
========================= */
const STEPS = [
  { key: "business", label: "Business" },
  { key: "owner", label: "Titolare" },
  { key: "commit", label: "Conferma" },
  {key: "complete", label: "Completato" }
] as const;



type StepKey = (typeof STEPS)[number]["key"];

export default function ConfigurationSetupPage() {
  /* =========================
     STATE — SOLO UI
  ========================= */
  const [stepIndex, setStepIndex] = useState(0);
  const [maxReachedStep, setMaxReachedStep] = useState(0);
  const { data } = useConfigurationSetupStore();
  console.log("[SETUP_PAGE] init", {
    configurationId: data.configurationId,
    solutionId: data.solutionId,
    productId: data.productId,
  });
  /* =========================
     GUARD — STATO MINIMO
     (FAIL FAST, ADHD-SAFE)
  ========================= */
  if (!data.solutionId || !data.productId) {
    return (
      
      <div className="configuration-error">
        <h2>Configurazione non inizializzata</h2>
        <p>
          Torna alla selezione del prodotto e riprova.
        </p>
      </div>
    );
  }

  /* =========================
     NAVIGATION
  ========================= */
  const next = () =>
  {
    setStepIndex((i) => {
      const nextIndex = Math.min(i + 1, STEPS.length - 1);
      setMaxReachedStep((m) => Math.max(m, nextIndex));
      return nextIndex;
    });
  };

  const back = () =>
    setStepIndex((i) =>
      Math.max(i - 1, 0)
    );
   
    const goToStep = (index: number) => {
      if (index <= maxReachedStep) {
        setStepIndex(index);
      }
    };
    
    const progress =
    ((stepIndex + 1) / STEPS.length) * 100;

  const currentStep: StepKey = STEPS[stepIndex].key;
 
/* =========================
     UI
  ========================= */
  return (
    <div className="configuration-setup">

      {/* =========================
         PROGRESS BAR + LABELS
      ========================= */}
      <div className="wizard-progress">
        <div className="wizard-progress-bar">
          <div
            className="wizard-progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="wizard-steps">
          {STEPS.map((step, index) => {
            const isActive = index === stepIndex;
            const isClickable = index <= maxReachedStep;

            return (
              <button
                key={step.key}
                type="button"
                className={`wizard-step
                  ${isActive ? "active" : ""}
                  ${isClickable ? "clickable" : "disabled"}
                `}
                onClick={() => goToStep(index)}
                disabled={!isClickable}
              >
                <span className="wizard-step-index">
                  {index + 1}
                </span>
                <span className="wizard-step-label">
                  {step.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* =========================
         STEP RENDER
      ========================= */}
      {(() => {
        switch (currentStep) {
          case "business":
            return <StepBusinessInfo onNext={next} />;
        
          case "owner":
            return (
              <StepOwnerInfo
              
                onBack={back}
                onNext={next}
              />
            );
        
          case "commit":
            return (
              <StepCommitConfiguration
                onBack={back}
                onNext={next}
              />
            );
            case "complete":
            return (
              <StepComplete
             
              />
            );
        
          default:
            return null;
        }
        
      })()}
    </div>
  );
}


=== FILE: configurator/base_configuration/configuration/StepCommitConfiguration.tsx
LANG: tsx
SIZE:     2259 bytes
----------------------------------------
// ======================================================
// FE || STEP — COMMIT CONFIGURATION (CANONICAL)
// ======================================================
//
// RUOLO:
// - Punto finale del configurator
// - Collega Owner + Business alla Configuration
// - Backend = source of truth
//
// FLOW:
// 1. OwnerDraft ✅
// 2. BusinessDraft ✅
// 3. attachOwnerToConfiguration (COMMIT)
// ======================================================


import { useState } from "react";
import { attachOwnerToConfiguration } from "../business/business/configuration.draft.complete";
import { useConfigurationSetupStore }from "@shared/domain/user/configurator/configurationSetup.store"
export default function StepCommitConfiguration({
  onBack,
  onNext, 
}: {
  onBack: () => void;
  onNext: ()=> void;
}) {
  const { data } = useConfigurationSetupStore();

  const configurationId = data.configurationId;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCommit() {
    if (!configurationId) return;

    setLoading(true);
    setError(null);

    try {
      /* =====================
         COMMIT (BACKEND)
         - OwnerDraft completo
         - BusinessDraft completo
         - Attach + state advance
      ====================== */
      const res = await attachOwnerToConfiguration({
        configurationId,
    
      });

      if (!res || res.ok === false) {
        throw new Error(res?.error ?? "ATTACH_OWNER_FAILED");
      }
      
      // 🔒 non fidarti di campi opzionali
      onNext();
      
  } catch (e) {
    console.error("[STEP_COMMIT][ERROR]", e);
    setError("Errore nel salvataggio finale");
  } finally {
    setLoading(false);
  }
}

  return (
    <div className="step">
      <h2>Conferma configurazione</h2>

      <p>
        Stiamo per finalizzare la configurazione del tuo business.
      </p>

      {error && <p className="error">{error}</p>}

      <div className="actions">
        <button onClick={onBack} disabled={loading}>
          Indietro
        </button>

        <button onClick={handleCommit} disabled={loading}>
          {loading ? "Salvataggio…" : "Conferma"}
        </button>
      </div>
    </div>
  );
}


=== FILE: configurator/base_configuration/configuration/StepComplete.tsx
LANG: tsx
SIZE:     1762 bytes
----------------------------------------
// ======================================================
// FE || STEP || StepComplete
// ======================================================
//
// RUOLO:
// - Chiusura configurazione guidata
// - Redirect al Business SENZA hard reload
//
// PERCHÉ:
// - window.location.href distrugge React + Zustand
// - causa fetch infiniti e sidebar incoerente
//
// ======================================================

import { useNavigate } from "react-router-dom";
import { useConfigurationSetupStore }from "@shared/domain/user/configurator/configurationSetup.store"
export default function StepComplete() {
  const navigate = useNavigate();
  const { data } = useConfigurationSetupStore();

  const configurationId = data.configurationId;

  // SAFETY: se manca ID non navighiamo
  if (!configurationId) {
    return (
      <div className="step step-complete">
        <h2>Configurazione completata</h2>
        <p>Stiamo finalizzando il tuo business…</p>
      </div>
    );
  }

  return (
    <div className="step step-complete">
      <h2>Configurazione completata 🎉</h2>

      <p>Il tuo business è stato configurato correttamente.</p>

      <p>
        Da ora in poi lo troverai nella sezione{" "}
        <strong>Business</strong>.
      </p>

      <p className="note">
        La configurazione non è più modificabile finché il sito
        non viene rimesso in modalità modifica.
      </p>

      <div className="actions">
        <button
          className="wd-btn-primary"
          onClick={() => {
            navigate(
              `/user/dashboard/business/${configurationId}`,
              { replace: true }
            );
          }}
        >
          Vai al tuo business →
        </button>
      </div>
    </div>
  );
}


=== FILE: configurator/base_configuration/configuration/StepProductIntro.tsx
LANG: tsx
SIZE:     1960 bytes
----------------------------------------
// ======================================================
// FE || CONFIGURATOR — PRODUCT INTRO
// ======================================================
//
// RUOLO:
// - Schermata di contesto iniziale
// - Conferma visiva di cosa stiamo configurando
//
// COSA FA:
// - Mostra solution, prodotto e servizi selezionati
// - Rafforza fiducia e chiarezza
//
// COSA NON FA:
// - NON modifica store
// - NON fa fetch
// - NON richiede input
// ======================================================

import { useConfigurationSetupStore }from "@shared/domain/user/configurator/configurationSetup.store"
type StepProductIntroProps = {
  onNext: () => void;
};

export default function StepProductIntro({ onNext }: StepProductIntroProps) {
  const { data } = useConfigurationSetupStore();

  return (
    <div className="step">
      <h2>Configurazione del tuo progetto</h2>

      <p style={{ opacity: 0.7 }}>
        Stiamo per configurare il tuo prodotto partendo dalle
        informazioni che hai già scelto.
      </p>

      <div
        style={{
          background: "#f7f7f7",
          borderRadius: 8,
          padding: 16,
          marginTop: 12,
        }}
      >
        <p>
          <strong>Attività:</strong>{" "}
          {data.businessName || "Da definire"}
        </p>

        <p>
          <strong>Soluzione:</strong>{" "}
          {data.solutionId ?? "—"}
        </p>

        <p>
          <strong>Prodotto:</strong>{" "}
          {data.productId ?? "—"}
        </p>

        {data.optionIds?.length ? (
          <p>
            <strong>Servizi aggiuntivi:</strong>{" "}
            {data.optionIds.join(", ")}
          </p>
        ) : (
          <p style={{ opacity: 0.6 }}>
            Nessun servizio aggiuntivo selezionato
          </p>
        )}
      </div>

      <div className="actions">
        <button onClick={onNext}>
          Iniziamo la configurazione
        </button>
      </div>
    </div>
  );
}


=== FILE: configurator/base_configuration/configuration/configuration.user.api.ts
LANG: ts
SIZE:     4768 bytes
----------------------------------------
/**
 * ======================================================
 * FE || CONFIGURATION USER API (CANONICAL)
 * ======================================================
 *
 * RUOLO:
 * - Bridge FE ⇄ BE per la persistenza della Configuration
 * - Usato da:
 *   • configurator (wizard)
 *   • workspace / dashboard
 *
 * DOMINIO:
 * - Configuration = workspace persistente (BE)
 * - Configurator = draft FE temporaneo (Zustand)
 *
 * SOURCE OF TRUTH:
 * - Backend
 *
 * INVARIANTI:
 * - configurationId è SEMPRE fornito dal backend
 * - FE non crea Configuration
 * - FE invia payload parziali (draft)
 *
 * NOTE ARCHITETTURALI:
 * - Questo file NON contiene logica di dominio
 * - Nessuna validazione FE
 * - Nessuna interpretazione dei dati
 *
 * FUTURO:
 * - descriptionTags / solutionTags verranno gestiti
 *   da endpoint dedicati o merge BE
 * ======================================================
 */

import { apiFetch } from "../../../../shared/lib/api/client";
import {type ConfigurationConfiguratorDTO } from "./ConfigurationConfiguratorDTO";
/* ======================================================
   UPDATE CONFIGURATION (DRAFT SAVE)
   ====================================================== */

/**
 * PUT /api/configuration/:configurationId
 *
 * Salva aggiornamenti parziali della configuration.
 *
 * USO:
 * - StepReview
 * - Handoff configurator → workspace
 *
 * NOTE:
 * - payload è intenzionalmente `unknown`
 * - validazione e merge sono responsabilità BE
 */
export async function updateConfiguration(
  configurationId: string,
  payload: unknown
): Promise<{ ok: true }> {
  const res = await apiFetch<{ ok: true }>(
    `/api/configuration/${configurationId}`,
    {
      method: "PUT",
      body: JSON.stringify(payload),
    }
  );

  if (!res) {
    throw new Error("Invalid configuration update response");
  }

  return res;
}

/* ======================================================
   UPSERT FROM BUSINESS (BUYFLOW BRIDGE)
   ====================================================== */

/**
 * POST /api/configuration/from-business
 *
 * Crea o aggiorna una configuration partendo da un Business.
 *
 * USO:
 * - flusso buyflow
 * - post creazione business
 *
 * NOTE:
 * - Non usato direttamente dal configurator
 * - Backend decide se creare o aggiornare
 */
export async function upsertConfigurationFromBusiness(input: {
  businessId: string;
  productId: string;
  optionIds: string[];

  /**
   * FUTURO:
   * - verranno persistiti come parte del dominio Business
   * - o come metadata Configuration
   */
  businessDescriptionTags?: string[];
  businessServiceTags?: string[];
}) {
  return apiFetch<{
    ok: true;
    configurationId: string;
  }>("/api/configuration/from-business", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

/* ======================================================
   LIST USER CONFIGURATIONS
   ====================================================== */

/**
 * GET /api/configuration
 *
 * Lista delle configuration dell’utente.
 *
 * USO:
 * - dashboard
 * - workspace index
 *
 * NOTE:
 * - Usa ConfigurationConfiguratorDTO per coerenza FE
 */
export async function listMyConfigurations(): Promise<{
  ok: true;
  items: ConfigurationConfiguratorDTO[];
}> {
  const res = await apiFetch<{
    ok: true;
    items: ConfigurationConfiguratorDTO[];
  }>("/api/configurations/list", {
    method: "GET",
  });

  if (!res) {
    throw new Error("API /api/configuration returned null");
  }

  return res;
}

/* ======================================================
   LOAD CONFIGURATION (CONFIGURATOR / WORKSPACE)
   ====================================================== */

/**
 * GET /api/configuration/:id
 *
 * Carica una configuration esistente.
 *
 * USO:
 * - entry point configurator
 * - workspace
 *
 * NOTE:
 * - DTO minimo
 * - campi extra ignorati dal FE
 */
export async function getConfigurationForConfigurator(
  configurationId: string
): Promise<{
  ok: true;
  configuration: ConfigurationConfiguratorDTO;
}> {
  const res = await apiFetch<{
    ok: true;
    configuration: ConfigurationConfiguratorDTO;
  }>(`/api/configuration/${configurationId}`, {
    method: "GET",
    cache: "no-store",
  });

  if (!res) {
    throw new Error("Configuration not found");
  }

  return res;
}

/* ======================================================
   FUTURE EXTENSIONS (DOCUMENTATE)
   ====================================================== */

/**
 * TODO (NON IMPLEMENTATO):
 *
 * - Persistenza esplicita:
 *   • solutionDescriptionTags
 *   • solutionServiceTags
 *
 * Possibili strade:
 * 1) endpoint dedicato (/configuration/:id/tags)
 * 2) merge automatico lato BE
 * 3) migrazione nel dominio Business
 *
 * Decisione rimandata volutamente.
 */


=== FILE: configurator/base_configuration/configuration/pre-configuration.store.ts
LANG: ts
SIZE:     1302 bytes
----------------------------------------
// ======================================================
// FE || STORE — PreConfiguration (PreLogin Safe)
// ======================================================
//
// RUOLO:
// - Conservare dati minimi raccolti pre-login
// - Trasporto atomico verso PostLogin
//
// INVARIANTI:
// - FE only
// - Persistente (localStorage)
// - Consumato UNA SOLA VOLTA
//
// ======================================================

import { create } from "zustand";
import { persist } from "zustand/middleware";

type PreConfigPayload = {
  businessName: string;
  solutionId: string;
  productId: string;
};

interface PreConfigurationState {
  payload: PreConfigPayload | null;

  setPreConfig: (data: PreConfigPayload) => void;
  consume: () => PreConfigPayload | null;
}

export const usePreConfigurationStore = create<PreConfigurationState>()(
  persist(
    (set, get) => ({
      payload: null,

      setPreConfig: (data) =>
        set({
          payload: {
            businessName: data.businessName.trim(),
            solutionId: data.solutionId,
            productId: data.productId,
          },
        }),

      consume: () => {
        const snapshot = get().payload;
        set({ payload: null });
        return snapshot;
      },
    }),
    {
      name: "wod-pre-config",
    }
  )
);


=== FILE: configurator/base_configuration/configuration/solutions.user.api.ts
LANG: ts
SIZE:      594 bytes
----------------------------------------
import { apiFetch } from "../../../../shared/lib/api";
import { type SolutionConfiguratorSeedApiModel } from "../../../../shared/lib/apiModels/public/SolutionConfiguratorSeed.api-model";


export type GetSolutionPublicResponse = {
  ok: true;
  solution: SolutionConfiguratorSeedApiModel;
};

export async function getSolutionById(
  solutionId: string
): Promise<GetSolutionPublicResponse> {
  const res = await apiFetch<GetSolutionPublicResponse>(
    `/api/solutions/public/${solutionId}`
  );

  if (!res || !res.ok) {
    throw new Error("INVALID_SOLUTION_RESPONSE");
  }

  return res;
}


=== FILE: configurator/base_configuration/configuration/useActiveProducts.ts
LANG: ts
SIZE:     1812 bytes
----------------------------------------
import { useEffect, useState } from "react";
import { apiFetch } from "../../../../shared/lib/api";

/**
 * ======================================================
 * FE || HOOK || ACTIVE PRODUCTS WITH OPTIONS
 * ======================================================
 *
 * RUOLO:
 * - Carica TUTTI i prodotti pubblici attivi
 * - Con opzioni già risolte
 *
 * SOURCE OF TRUTH:
 * - BE → GET /api/products/with-options
 *
 * INVARIANTI:
 * - Nessuna auth
 * - Nessuna dipendenza da Solution
 * ======================================================
 */

// ======================================================
// FE || DTO || ProductWithOptions
// ======================================================

export type ProductOptionDTO = {
  id: string;
  name: string;
  price: number;
  type: "one_time" | "monthly" | "yearly";
};

export type ProductWithOptionsDTO = {
  id: string;
  name: string;
  description?: string;
  nameKey?: string;
  descriptionKey?: string;
  status: "ACTIVE";
  configuration: unknown;
  startupFee?: number;
  pricing?: unknown;
  options: ProductOptionDTO[];
};

export function useActiveProductsWithOptions() {
  const [products, setProducts] = useState<ProductWithOptionsDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiFetch<{
      ok: true;
      products: ProductWithOptionsDTO[];
    }>("/api/products/with-options")
      .then((res) => {
        if (!res?.ok) {
          throw new Error("INVALID_RESPONSE");
        }
        setProducts(res.products);
      })
      .catch(() => {
        setError("Errore caricamento prodotti");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return {
    products,
    loading,
    error,
  };
}


=== FILE: configurator/base_configuration/configuration/useMyConfigurations.ts
LANG: ts
SIZE:     2411 bytes
----------------------------------------
// ======================================================
// FE || HOOK || useMyConfigurations (DEDUPED + CACHED)
// File: src/user/pages/dashboard/configurator/api/useMyConfigurations.ts
// ======================================================
//
// PERCHÉ:
// - Evita fetch duplicati (Sidebar, Dashboard, Workspace…)
// - Stabilizza rendering dopo createBusinessDraft / createOwnerDraft
//
// STRATEGIA:
// - cache in modulo (in-memory) + inflight promise condivisa
// - TTL breve (es. 15s) per evitare staleness
// - nessun file nuovo
// ======================================================

import { useEffect, useState } from "react";
import { listMyConfigurations } from "./configuration.user.api";
import {type ConfigurationConfiguratorDTO } from "./ConfigurationConfiguratorDTO";
type CacheState = {
  ts: number;
  items: ConfigurationConfiguratorDTO[];
};

const TTL_MS = 15_000;

// cache in memoria (per tab)
let cache: CacheState | null = null;

// promessa in flight condivisa (dedupe)
let inflight:
  | Promise<{ ok: boolean; items?: ConfigurationConfiguratorDTO[] }>
  | null = null;

async function loadOnce() {
  // 1) cache hit
  if (cache && Date.now() - cache.ts < TTL_MS) {
    return { ok: true, items: cache.items };
  }

  // 2) dedupe
  if (inflight) return inflight;

  inflight = listMyConfigurations()
    .then((res) => {
      if (res?.ok) {
        cache = {
          ts: Date.now(),
          items: res.items ?? [],
        };
      }
      return res;
    })
    .finally(() => {
      inflight = null;
    });

  return inflight;
}

export function useMyConfigurations() {
  const [items, setItems] = useState<ConfigurationConfiguratorDTO[]>(
    cache?.items ?? []
  );
  const [loading, setLoading] = useState(!cache);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;

    setLoading(!cache);
    setError(null);

    loadOnce()
      .then((res) => {
        if (!alive) return;

        if (!res?.ok) {
          setError("Errore caricamento configurazioni");
          return;
        }
        setItems(res.items ?? []);
      })
      .catch(() => {
        if (!alive) return;
        setError("Errore di rete");
      })
      .finally(() => {
        if (!alive) return;
        setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, []);

  return { items, loading, error };
}


=== FILE: configurator/index.tsx
LANG: tsx
SIZE:     5093 bytes
----------------------------------------
// ======================================================
// FE || pages/user/dashboard/configurator/index.tsx
// ======================================================
//
// AI-SUPERCOMMENT — CONFIGURATION WORKSPACE LIST
//
// RUOLO:
// - Lista di TUTTE le configurazioni dell’utente
// - Punto di ingresso ESPLICITO al workspace
//
// SOURCE OF TRUTH:
// - Backend → GET /api/configuration
//
// FA:
// - Fetch configurazioni utente
// - Mostra stato e metadati
// - Permette selezione manuale
//
// NON FA:
// - NON crea configurazioni
// - NON fa redirect automatici
// - NON contiene logica wizard
//
// ======================================================

import { useEffect, useState } from "react";
import { useNavigate,useParams } from "react-router-dom";

import { listMyConfigurations } from "./base_configuration/configuration/configuration.user.api";
import type { ConfigurationConfiguratorDTO } from "./base_configuration/configuration/ConfigurationConfiguratorDTO";
import { getConfigurationForConfigurator } from "./base_configuration/configuration/configuration.user.api";
import { useConfigurationSetupStore } from "@shared/domain/user/configurator/configurationSetup.store";
import { getWdStatusClass } from "@shared/utils/statusUi";




export default function ListConfigurationIndex() {
  const navigate = useNavigate();

  const [items, setItems] = useState<ConfigurationConfiguratorDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { id: configurationId } = useParams<{ id: string }>();

  const { setField, reset } = useConfigurationSetupStore();


  /* =========================
     LOAD CONFIGURATIONS
  ========================= */
  useEffect(() => {
    listMyConfigurations()
      .then((res) => {
        if (res.ok) {
          setItems(res.items ?? []);
        } else {
          setError("Errore caricamento configurazioni");
        }
      })
      .catch(() => {
        setError("Errore di rete");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

useEffect(() => {
    if (!configurationId) {
   
      return;
    }
    getConfigurationForConfigurator(configurationId)
      .then((res) => {
        const cfg = res.configuration;

        if (!cfg) {
          navigate("/user/dashboard", { replace: true });
          return;
        }

        // ==========================================
        // 🔑 STORE INIT — BASE FIELDS ONLY
        // ==========================================*/
        setField("configurationId", cfg.id);
        setField("solutionId", cfg.solutionId);
        setField("productId", cfg.productId);
     

        // prefill UX (non obbligatorio)
        setField(
          "businessName",
          cfg.prefill?.businessName ?? ""
        );
      })
      .catch(() => {
        navigate("/user/dashboard", { replace: true });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [configurationId, navigate, reset, setField]);
  /* =========================
     UI STATES
  ========================= */
  if (loading) return <p>Caricamento configurazioni…</p>;
  if (error) return <p className="error">{error}</p>;

  if (items.length === 0) {
    return (
      <section className="workspace-empty">
        <h2>Nessuna configurazione</h2>
        <p>
          Non hai ancora iniziato nessuna configurazione.
        </p>

        <button
          className="user-cta primary"
          onClick={() => navigate("/solution")}
        >
          Inizia da una soluzione
        </button>
      </section>
    );
  }

  /* =========================
     RENDER LIST
  ========================= */
  return (
    <section className="workspace-list">
      <header className="workspace-header">
        <h1>Le tue configurazioni</h1>
        <p>
          Seleziona una configurazione per continuare il lavoro
        </p>
      </header>

      <div className="workspace-grid">
        {items.map((config) => (
          <div
            key={config.id}
            className="workspace-card"
            onClick={() =>
              navigate(`/user/dashboard/configurator/${config.id}`)
            }
          >
            <div className="workspace-card__header">
            <h3>
            {config.prefill?.businessName || "Nuova attività"}
             </h3>

             <span className={getWdStatusClass(config.status)}>
                {config.status}
              </span>
            </div>

            <div className="workspace-card__body">
              <p>
                <strong>Solution:</strong>{" "}
                {config.solutionId}
              </p>

              <p>
                <strong>Ultimo aggiornamento:</strong>{" "}
                {}
              </p>
            </div>

            <div className="workspace-card__footer">
              <span className="workspace-cta">
                Apri workspace →
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
 //DEPRECATED 

=== FILE: configurator/owner/OwnerForm.tsx
LANG: tsx
SIZE:     6219 bytes
----------------------------------------
// ======================================================
// FE || OWNER FORM (CANONICAL, STORE-DRIVEN)
// ======================================================
import { useConfigurationSetupStore } from "@shared/domain/user/configurator/configurationSetup.store";
import { apiFetch } from "../../../shared/lib/api";
import { useCityAutocomplete } from "@shared/lib/geo/useCityAutocomplete";

export default function OwnerForm({

  onBack,
  onComplete,
}: {
  onBack: () => void;
  onComplete: () => void;
}) {
  const { data, setField } = useConfigurationSetupStore();
const { suggestions, hasSuggestions } =
  useCityAutocomplete(data.ownerAddress?.city ?? "");
  
  
  
  
  
  async function handleSubmit() {
    if (!data.ownerFirstName?.trim()) {
      alert("Inserisci il nome");
      return;
    }

    if (!data.ownerLastName?.trim()) {
      alert("Inserisci il cognome");
      return;
    }

    if (!data.ownerPrivacy.accepted) {
      alert("Devi accettare la privacy");
      return;
    }
    if (
      !data.ownerAddress?.street?.trim() ||
      !data.ownerAddress?.number?.trim() ||
      !data.ownerAddress?.city?.trim()
    ) {
      alert("Completa indirizzo, numero civico e città");
      return;
    }
    const payload = {
      
      configurationId: data.configurationId,
    
      firstName: data.ownerFirstName,
      lastName: data.ownerLastName,
      birthDate: data.ownerBirthDate || undefined,
    
      address: data.ownerAddress &&
        Object.values(data.ownerAddress).some(Boolean)
          ? data.ownerAddress
          : undefined,
    
      contact: {
        secondaryMail: data.ownerSecondaryMail || undefined,
        phoneNumber: data.ownerPhone || undefined,
      },
    
      privacy: {
        ...data.ownerPrivacy,
        subject: "owner",
        source: "owner-form",
      },
    };
    

    await apiFetch("/api/owner/create-draft", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    onComplete();
  }

  return (
    <div className="step">
      <h2>Dati del titolare</h2>

      <input
        placeholder="Nome"
        value={data.ownerFirstName}
        onChange={(e) =>
          setField("ownerFirstName", e.target.value)
        }
      />

      <input
        placeholder="Cognome"
        value={data.ownerLastName}
        onChange={(e) =>
          setField("ownerLastName", e.target.value)
        }
      />

      <input
        type="date"
        value={data.ownerBirthDate ?? ""}
        onChange={(e) =>
          setField("ownerBirthDate", e.target.value)
        }
      />

      <input
        placeholder="Email secondaria (opzionale)"
        value={data.ownerSecondaryMail ?? ""}
        onChange={(e) =>
          setField("ownerSecondaryMail", e.target.value)
        }
      />
  <input
  placeholder="Telefono"
  value={data.ownerPhone ?? ""}
  onChange={(e) =>
    setField("ownerPhone", e.target.value)
  }
/>

{/* ================= INDIRIZZO TITOLARE ================= */}
<div className="address-block owner-address">

  <label className="field">
    <span>Via / Indirizzo *</span>
    <input
      value={data.ownerAddress?.street ?? ""}
      onChange={(e) =>
        setField("ownerAddress", {
          ...data.ownerAddress,
          street: e.target.value,
        })
      }
    />
  </label>

  <label className="field">
    <span>Numero civico *</span>
    <input
      value={data.ownerAddress?.number ?? ""}
      onChange={(e) =>
        setField("ownerAddress", {
          ...data.ownerAddress,
          number: e.target.value,
        })
      }
    />
  </label>

  {/* === CITTÀ CON AUTOCOMPLETE === */}
  <label className="field city-autocomplete">
    <span>Città *</span>
    <input
      value={data.ownerAddress?.city ?? ""}
      onChange={(e) =>
        setField("ownerAddress", {
          ...data.ownerAddress,
          city: e.target.value,
        })
      }
    />

    {hasSuggestions && (
      <ul className="autocomplete-list">
        {suggestions.map((c) => (
          <li
            key={c.city}
            onClick={() => {
              setField("ownerAddress", {
                ...data.ownerAddress,
                city: c.city,
                province: c.province,
                region: c.region,   // FE-only
                country: c.state,   // FE-only
              });
            }}
          >
            <strong>{c.city}</strong>
            <span>
              {c.province} – {c.region}
            </span>
          </li>
        ))}
      </ul>
    )}
  </label>

  <label className="field">
    <span>Provincia</span>
    <input
      value={data.ownerAddress?.province ?? ""}
      onChange={(e) =>
        setField("ownerAddress", {
          ...data.ownerAddress,
          province: e.target.value,
        })
      }
    />
  </label>

  <label className="field">
    <span>Regione</span>
    <input
      value={data.ownerAddress?.region ?? ""}
      onChange={(e) =>
        setField("ownerAddress", {
          ...data.ownerAddress,
          region: e.target.value,
        })
      }
    />
  </label>

  <label className="field">
    <span>CAP</span>
    <input
      value={data.ownerAddress?.zip ?? ""}
      onChange={(e) =>
        setField("ownerAddress", {
          ...data.ownerAddress,
          zip: e.target.value,
        })
      }
    />
  </label>

  <label className="field">
    <span>Stato</span>
    <input
      value={data.ownerAddress?.country ?? "Italia"}
      onChange={(e) =>
        setField("ownerAddress", {
          ...data.ownerAddress,
          country: e.target.value,
        })
      }
    />
  </label>
</div>


      {/* PRIVACY */}
      <label>
      <input
  type="checkbox"
  checked={data.ownerPrivacy?.accepted ?? false}
  onChange={(e) =>
    setField("ownerPrivacy", {
      accepted: e.target.checked,
      acceptedAt: e.target.checked
        ? new Date().toISOString()
        : "",
      policyVersion: "v1",
    })
  }
/>
        Accetto il trattamento dei dati personali
      </label>

      <div className="actions">
        <button onClick={onBack}>Indietro</button>
        <button onClick={handleSubmit}>Continua</button>
      </div>
    </div>
  );
}


=== FILE: configurator/owner/StepOwnerInfo.tsx
LANG: tsx
SIZE:     2312 bytes
----------------------------------------
// ======================================================
// FE || STEP — OWNER INFO (CANONICAL)
// ======================================================

import { useEffect, useState } from "react";
import { apiFetch } from "../../../shared/lib/api";
import { useConfigurationSetupStore } from "@shared/domain/user/configurator/configurationSetup.store";

import OwnerForm from "./OwnerForm";
import type { OwnerDraftReadDTO } from "@shared/domain/owner/owner.read.types";

export default function StepOwnerInfo({
  onBack,
  onNext,
}: {
  onBack: () => void;
  onNext: () => void;
}) {
  const { setField } = useConfigurationSetupStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadOwner() {
      try {
        const res = await apiFetch<{
          ok: boolean;
          owner?: OwnerDraftReadDTO;
        }>("/api/owner/get-draft");

        if (!cancelled && res?.owner) {
          const o = res.owner;
        
          setField("ownerFirstName", o.firstName ?? "");
          setField("ownerLastName", o.lastName ?? "");
          setField("ownerBirthDate", o.birthDate ?? undefined);
          setField(
            "ownerSecondaryMail",
            o.contact?.secondaryMail ?? ""
          );
        
          if (o.address) {
            setField("ownerAddress", {
              street: o.address.street ?? "",
              number:o.address.number ?? "",
              city: o.address.city ?? "",
              province: o.address.province ?? "",
              region: o.address.region ?? "", 
              zip: o.address.zip ?? "",
              country: o.address.country ?? "",
            });
          }
        
          if (o.privacy) {
            setField("ownerPrivacy", {
              accepted: o.privacy.accepted,
              acceptedAt: o.privacy.acceptedAt,
              policyVersion: o.privacy.policyVersion,
            });
          }
        }
        
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadOwner();
    return () => {
      cancelled = true;
    };
  }, [setField]);

  if (loading) {
    return <div className="step">Caricamento titolare…</div>;
  }

  return (
    <OwnerForm
      onBack={onBack}
      onComplete={onNext}
    />
  );
}


=== FILE: configurator/owner/business.owner.api.ts
LANG: ts
SIZE:     2468 bytes
----------------------------------------
// ======================================================
// FE || DOMAIN || OWNER || OWNER DRAFT API
// ======================================================
//
// RUOLO:
// - Layer FE → BE per OwnerDraft
// - Create / Update / Read OwnerDraft
//
// INVARIANTI:
// - FE NON conferma owner
// - FE NON gestisce KYC
// - Session cookie obbligatorio
//
// SOURCE OF TRUTH:
// - OwnerDraftSchema (BE)
// ======================================================

import { apiFetch } from "@shared/lib/api";
import type { OwnerDraftReadDTO } from "@shared/domain/owner/owner.read.types";

/* ======================================================
   INPUT DTO (FE → BE)
====================================================== */

export interface OwnerDraftInputDTO {
  firstName?: string;
  lastName?: string;
  birthDate?: string; // ISO yyyy-mm-dd

  address?: {
    street?: string;
    city?: string;
    number?:string; 
    province?: string;
    zip?: string;
    country?: string;
  };

  contact?: {
    secondaryMail?: string;
    phoneNumber?: string;
  };

  source?: "google" | "manual";
}

/* ======================================================
   CREATE / UPDATE OWNER DRAFT
   POST /api/owner/create-draft
====================================================== */

export async function upsertOwnerDraft(
  payload: OwnerDraftInputDTO
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const res = await apiFetch<{ ok: boolean; error?: string }>(
      "/api/owner/create-draft",
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    );

    if (!res?.ok) {
      return {
        ok: false,
        error: res?.error ?? "OWNER_DRAFT_UPSERT_FAILED",
      };
    }

    return { ok: true };
  } catch (err) {
    console.error("[OWNER_DRAFT_API][UPSERT][ERROR]", err);
    return { ok: false, error: "NETWORK_ERROR" };
  }
}

/* ======================================================
   GET OWNER DRAFT
   GET /api/owner/get-draft
====================================================== */

export async function getMyOwnerDraft(): Promise<OwnerDraftReadDTO | null> {
  try {
    const res = await apiFetch<{
      ok: boolean;
      owner?: OwnerDraftReadDTO;
    }>("/api/owner/get-draft", {
      method: "GET",
    });

    if (!res?.ok || !res.owner) {
      return null;
    }

    return res.owner;
  } catch (err) {
    console.error("[OWNER_DRAFT_API][GET][ERROR]", err);
    return null;
  }
}


=== FILE: configurator/reviewSection.tsx
LANG: tsx
SIZE:      928 bytes
----------------------------------------
// ======================================================
// FE || dashboard/configuration/ReviewSection.tsx
// ======================================================
//
// AI-SUPERCOMMENT — CONFIGURATION REVIEW
//
// RUOLO:
// - Visualizzare stato corrente configurazione
// - Nessun editing
//
// INVARIANTI:
// - Backend = source of truth
// - Nessuna mutazione
//
// NOTE:
// - Editing avviene nelle singole form
// ======================================================
import type { ConfigurationConfiguratorDTO } from "@user/configurator/base_configuration/configuration/ConfigurationConfiguratorDTO";
//DEPRECATED

export default function ReviewSection({
    configuration,
  }: {
    configuration: ConfigurationConfiguratorDTO;
  }) {
    return (
      <section>
        <h2>Riepilogo configurazione</h2>
  
        <pre>
          {JSON.stringify(configuration, null, 2)}
        </pre>
      </section>
    );
  }

=== FILE: google/useAddressAssistant.ts
LANG: ts
SIZE:     1119 bytes
----------------------------------------
// ======================================================
// FE || lib/google/hooks/useAddressAssistant.ts
// ======================================================
//
// ADDRESS ASSISTANT — NOOP (STANDBY)
//
// RUOLO:
// - Interfaccia FE per autocomplete indirizzi
// - Attualmente DISATTIVATA (mock)
//
// NOTE:
// - Nessuna chiamata API
// - Nessuna side effect
// - Pronta per Google Places / OSM
// ======================================================

export type AddressSuggestion = {
    label: string;
    placeId: string;
  
    address: {
      street: string;
      city: string;
      state: string;
      zip: string;
    };
  };
  
  export function useAddressAssistant() {
    /**
     * search
     * @param query string inserita dall’utente
     * @returns lista suggerimenti (attualmente vuota)
     *
     * FUTURO:
     * - Google Places
     * - OpenStreetMap
     */
    const search = async (
      _query: string
    ): Promise<AddressSuggestion[]> => {
      // 🔮 FUTURO: Google Places / OSM
      // ⛔ ORA: noop (build-safe)
      return [];
    };
  
    return { search };
  }
  

=== FILE: index.tsx
LANG: tsx
SIZE:      724 bytes
----------------------------------------
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


=== FILE: pages/PostLoginHandoff.tsx
LANG: tsx
SIZE:     4088 bytes
----------------------------------------
// ======================================================
// FE || PostLoginHandoff
// ======================================================
//
// RUOLO:
// - Punto UNICO di creazione Configuration post-login
// - Ponte atomico pre-login → post-login
//
// INVARIANTI:
// - CREA solo se user autenticato
// - Consuma PreConfiguration UNA SOLA VOLTA
// - Redirect deterministico
//
// ======================================================

import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { useAuthStore } from "@shared/lib/store/auth.store";
import { usePreConfigurationStore } from
  "../configurator/base_configuration/configuration/pre-configuration.store";
import { useConfigurationSetupStore } from "@shared/domain/user/configurator/configurationSetup.store";
import { apiFetch } from "@shared/lib/api";

export default function PostLoginHandoff() {
  const navigate = useNavigate();
  const executed = useRef(false); // 🔒 anti double-run

  const { user, ready } = useAuthStore();
  const consumePreConfig = usePreConfigurationStore(
    (s) => s.consume
  );

  const { data, setField } = useConfigurationSetupStore();

  useEffect(() => {
    console.log("[POST_LOGIN][1] effect start", {
      ready,
      user,
      configurationId: data.configurationId,
    });

    // =========================
    // GUARDIE CANONICHE
    // =========================
    if (!ready) {
      console.log("[POST_LOGIN][2] auth not ready");
      return;
    }

    if (!user) {
      console.log("[POST_LOGIN][3] no user");
      navigate("/user/login", { replace: true });
      return;
    }

    if (data.configurationId) {
      console.log("[POST_LOGIN][4] configuration already exists");
      navigate(
        `/user/dashboard/configurator/${data.configurationId}`,
        { replace: true }
      );
      return;
    }

    if (executed.current) {
      console.log("[POST_LOGIN][5] already executed");
      return;
    }

    // =========================
    // CONSUMO PRE-CONFIG
    // =========================
    const pre = consumePreConfig();

    console.log("[POST_LOGIN][6] consumed pre-config", pre);

    if (!pre) {
      console.warn("[POST_LOGIN][7] missing pre-config");
      navigate("/solution", { replace: true });
      return;
    }

    const { solutionId, productId, businessName } = pre;

    if (!solutionId || !productId || !businessName) {
      console.error("[POST_LOGIN][8] invalid pre-config", pre);
      navigate("/solution", { replace: true });
      return;
    }

    executed.current = true;

    async function createConfiguration() {
      try {
        const payload = {
          solutionId,
          productId,
          businessName,
        };

        console.log(
          "[POST_LOGIN][9] POST /api/configuration/base",
          payload
        );

        const res = await apiFetch<{
          ok: true;
          configurationId: string;
        }>("/api/configuration/base", {
          method: "POST",
          body: JSON.stringify(payload),
        });

        console.log("[POST_LOGIN][10] response", res);

        if (!res?.ok || !res.configurationId) {
          throw new Error("CREATE_CONFIGURATION_FAILED");
        }

        // =========================
        // STORE CANONICO
        // =========================
        setField("configurationId", res.configurationId);
        setField("solutionId", solutionId);
        setField("productId", productId);
        setField("businessName", businessName);

        console.log(
          "[POST_LOGIN][11] redirect workspace",
          res.configurationId
        );

        navigate(
          `/user/dashboard/configurator/${res.configurationId}`,
          { replace: true }
        );
      } catch (err) {
        console.error("[POST_LOGIN][ERR]", err);
        navigate("/user/dashboard", { replace: true });
      }
    }

    createConfiguration();
  }, [
    ready,
    user,
    data.configurationId,
    consumePreConfig,
    setField,
    navigate,
  ]);

  return null; // headless
}


=== FILE: pages/checkout/checkout/CheckoutPolicyModal.tsx
LANG: tsx
SIZE:     2571 bytes
----------------------------------------
// ======================================================
// FE || components/checkout/CheckoutPolicyModal.tsx
// ======================================================
//
// AI-SUPERCOMMENT
//
// RUOLO:
// - Mostra Policy Checkout
// - Richiede accettazione esplicita
// - BLOCCA pagamento se non accettata
//
// INVARIANTI:
// - Scope = checkout
// - Versione = latest
// - Stato persistente via BE
//
// ======================================================
// ⚠️ FUORI DOMINIO BUYFLOW BASE
// Questo componente appartiene al flusso CHECKOUT
import { useEffect, useState } from "react";

type CheckoutPolicy = {
  version: string;
  title: string;
  content: {
    sections: {
      id: string;
      title: string;
      text: string;
    }[];
  };
};

export function CheckoutPolicyModal({
  onAccepted,
}: {
  onAccepted: () => void;
}) {
  const [policy, setPolicy] = useState<CheckoutPolicy | null>(null);
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(
      `${import.meta.env.VITE_API_URL}/api/policy/version/latest?scope=checkout`,
      { credentials: "include" }
    )
      .then((r) => r.json())
      .then(setPolicy)
      .finally(() => setLoading(false));
  }, []);

  async function acceptPolicy() {
    if (!policy) return;

    await fetch(
      `${import.meta.env.VITE_API_URL}/api/policy/accept`,
      {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scope: "checkout",
          policyVersion: policy.version,
        }),
      }
    );

    onAccepted();
  }

  if (loading || !policy) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{policy.title}</h2>

        <div className="policy-content">
          {policy.content.sections.map((s) => (
            <section key={s.id}>
              <h4>{s.title}</h4>
              <p>{s.text}</p>
            </section>
          ))}
        </div>

        <label style={{ marginTop: 20, display: "block" }}>
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
          />{" "}
          Dichiaro di aver letto e accettato i Termini di Acquisto
        </label>

        <button
          disabled={!checked}
          onClick={acceptPolicy}
          style={{ marginTop: 20 }}
        >
          Conferma e continua
        </button>
      </div>
    </div>
  );
}


=== FILE: pages/dashboard/Dashboard.container.tsx
LANG: tsx
SIZE:     1132 bytes
----------------------------------------
// ======================================================
// FE || USER DASHBOARD || CONTAINER
// ======================================================
//
// RUOLO:
// - Fetch configurazioni utente
// - Normalizza stato UI (loading / error / empty)
// - Espone ViewModel alla View
//
// SOURCE OF TRUTH:
// - listMyConfigurations()
//
// ======================================================
import { useNavigate } from "react-router-dom";
import { useMyConfigurations } from "../../configurator/base_configuration/configuration/useMyConfigurations";
import type { ConfigurationConfiguratorDTO } from "../../configurator/base_configuration/configuration/ConfigurationConfiguratorDTO";

export type DashboardVM = {
  configs: ConfigurationConfiguratorDTO[];
  loading: boolean;
  error: string | null;
  onOpenConfig: (id: string) => void;
};

export function useDashboardContainer(): DashboardVM {
  const navigate = useNavigate();
  const { items: configs, loading, error } = useMyConfigurations();

  return {
    configs,
    loading,
    error,
    onOpenConfig: (id) => navigate(`/user/dashboard/configurator/${id}`),
  };
}


=== FILE: pages/dashboard/Dashboard.view.tsx
LANG: tsx
SIZE:     2656 bytes
----------------------------------------
// ======================================================
// FE || USER DASHBOARD || VIEW
// ======================================================
//
// RUOLO:
// - Rendering puro Dashboard
// - Nessuna logica di fetch
// - Usa solo ViewModel
// - i18n tramite chiavi
//
// ======================================================

import { getWdStatusClass } from "@shared/utils/statusUi";
import { t } from "@shared/aiTranslateGenerator/translateFe/helper/i18n";
import type { DashboardVM } from "./Dashboard.container";
import { dashboardClasses } from "./dashboard.classes";

export function DashboardView({
  configs,
  loading,
  error,
  onOpenConfig,
}: DashboardVM) {
  if (loading) {
    return <p>{t("dashboard.loading")}</p>;
  }

  if (error) {
    return (
      <p className={dashboardClasses.error}>
        {t(error)}
      </p>
    );
  }

  return (
    <section className={dashboardClasses.root}>
      <header className={dashboardClasses.header}>
        <h1>{t("dashboard.title")}</h1>
        <p>{t("dashboard.subtitle")}</p>
      </header>

      <section className={dashboardClasses.list}>
        {configs.length === 0 ? (
          <div className={dashboardClasses.empty}>
            <h2>{t("dashboard.empty.title")}</h2>
            <p>{t("dashboard.empty.text")}</p>

            <button
              className={dashboardClasses.cta}
              onClick={() => onOpenConfig("new")}
            >
              {t("dashboard.cta.start")}
            </button>
          </div>
        ) : (
          configs.map((cfg) => (
            <div
              key={cfg.id}
              className={dashboardClasses.card}
              onClick={() => onOpenConfig(cfg.id)}
              role="button"
              tabIndex={0}
            >
              <div className={dashboardClasses.cardHeader}>
                <h2>
                  {cfg.prefill?.businessName ??
                    t("dashboard.config.default")}
                </h2>

                <span
                  className={getWdStatusClass(cfg.status)}
                >
                  {cfg.status}
                </span>
              </div>

              <div className={dashboardClasses.meta}>
                <span>
                  <strong>Solution:</strong>{" "}
                  {cfg.solutionId}
                </span>
                <span>
                  <strong>Product:</strong>{" "}
                  {cfg.productId}
                </span>
              </div>

              <div
                className={dashboardClasses.divider}
              />
            </div>
          ))
        )}
      </section>
    </section>
  );
}


=== FILE: pages/dashboard/UserDashboardShell.tsx
LANG: tsx
SIZE:      744 bytes
----------------------------------------
// ======================================================
// FE || USER DASHBOARD || SHELL
// ======================================================
//
// RUOLO:
// - Layout strutturale dashboard
// - Sidebar a sinistra
// - Contenuto a destra
//
// INVARIANTE:
// - Layout orizzontale (flex)
// ======================================================

import { Outlet } from "react-router-dom";
import SidebarContainer from "../../sidebar/Sidebar.container";

export default function UserDashboardShell() {
  return (
    <div className="dashboard-shell">
      <aside className="dashboard-sidebar-wrap">
        <SidebarContainer />
      </aside>

      <main className="dashboard-content">
        <Outlet />
      </main>
    </div>
  );
}


=== FILE: pages/dashboard/business/index.tsx
LANG: tsx
SIZE:     3327 bytes
----------------------------------------
// ======================================================
// FE || pages/user/dashboard/business/index.tsx
// ======================================================
//
// AI-SUPERCOMMENT — USER BUSINESS LIST (CANONICAL)
//
// RUOLO:
// - Elenco attività dell’utente
// - HUB di navigazione (NON editor)
//
// INVARIANTE CRITICA:
// - Ogni editing porta SEMPRE a:
//   /user/configurator/:configurationId
//
// NOTE:
// - businessId ≠ configurationId
// - configurationId NON è garantito dal BE (per ora)
//
// ======================================================

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listMyBusinesses } from "@user/configurator/api/business.user.api";

/* =========================
   VIEW MODEL (FE)
========================= */
type BusinessSummaryVM = {
  businessId: string;
  name: string;
  status: string;
  createdAt: string;
  configurationId: string;
};

export default function UserBusinessDashboard() {
  const navigate = useNavigate();

  const [items, setItems] = useState<BusinessSummaryVM[]>([]);
  const [loading, setLoading] = useState(true);

  /* =====================
     LOAD BUSINESSES
  ====================== */
  useEffect(() => {
    listMyBusinesses()
      .then((res) => {
        if (!res?.ok || !Array.isArray(res.items)) {
          setItems([]);
          return;
        }

        /**
         * 🔧 MAPPING DIFENSIVO (PROVVISORIO)
         *
         * FINCHÉ IL BE NON ESPONE configurationId:
         * - proviamo a ricavarlo
         * - oppure SKIPPIAMO l’editing
         */
        const mapped: BusinessSummaryVM[] = res.items
          .filter((b: any) => b.configurationId) // ← se NON c’è, niente editing
          .map((b: any) => ({
            businessId: b.businessId,
            name: b.name,
            status: b.status,
            createdAt: b.createdAt,
            configurationId: b.configurationId,
          }));

        setItems(mapped);
      })
      .finally(() => setLoading(false));
  }, []);

  /* =====================
     UI STATES
  ====================== */
  if (loading) return <p>Caricamento…</p>;
  if (items.length === 0)
    return <p>Nessuna attività modificabile.</p>;

  /* =====================
     HANDLERS
  ====================== */
  function goToConfigurator(configurationId: string) {
    navigate(`/user/dashboard/configurator/${configurationId}`)
  }

  function goToBusinessView(businessId: string) {
    navigate(`/user/dashboard/business/${businessId}`);
  }

  /* =====================
     RENDER
  ====================== */
  return (
    <section>
      <h2>Le tue attività</h2>

      {items.map((b) => (
        <div key={b.businessId} className="card">
          <h3>{b.name}</h3>
          <p>Stato: {b.status}</p>

          <div className="actions">
            {/* === EDITING → CONFIGURATOR === */}
            <button
              onClick={() => goToConfigurator(b.configurationId)}
            >
              ✏️ Modifica sito
            </button>

            {/* === VISTA PASSIVA === */}
            <button
              onClick={() => goToBusinessView(b.businessId)}
            >
              👁 Visualizza
            </button>
          </div>
        </div>
      ))}
    </section>
  );
}


=== FILE: pages/dashboard/dashboard.classes.ts
LANG: ts
SIZE:      556 bytes
----------------------------------------
/* ======================================================
   FE || USER DASHBOARD || CLASSES
   ====================================================== */

   export const dashboardClasses = {
    root: "dashboard",
    header: "dashboard-header",
  
    list: "dashboard-configurations",
    card: "configuration-section",
    cardHeader: "configuration-section__header",
  
    meta: "configuration-section__meta",
    divider: "configuration-divider",
  
    empty: "workspace-empty",
    cta: "user-cta primary",
  
    error: "dashboard-error",
  };
  

=== FILE: pages/dashboard/index.tsx
LANG: tsx
SIZE:      519 bytes
----------------------------------------
// ======================================================
// FE || USER DASHBOARD || INDEX
// ======================================================
//
// RUOLO:
// - Entry point Dashboard
// - Collega Container → View
//
// ======================================================

import { useDashboardContainer } from "./Dashboard.container";
import { DashboardView } from "./Dashboard.view";

export default function UserDashboardHome() {
  const vm = useDashboardContainer();
  return <DashboardView {...vm} />;
}


=== FILE: pages/index.tsx
LANG: tsx
SIZE:     3324 bytes
----------------------------------------
// ======================================================
// FE || pages/user/dashboard/business/index.tsx
// ======================================================
//
// AI-SUPERCOMMENT — USER BUSINESS LIST (CANONICAL)
//
// RUOLO:
// - Elenco attività dell’utente
// - HUB di navigazione (NON editor)
//
// INVARIANTE CRITICA:
// - Ogni editing porta SEMPRE a:
//   /user/configurator/:configurationId
//
// NOTE:
// - businessId ≠ configurationId
// - configurationId NON è garantito dal BE (per ora)
//
// ======================================================

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listMyBusinesses } from "../configurator/api/business.user.api";

/* =========================
   VIEW MODEL (FE)
========================= */
type BusinessSummaryVM = {
  businessId: string;
  name: string;
  status: string;
  createdAt: string;
  configurationId: string;
};

export default function UserBusinessDashboard() {
  const navigate = useNavigate();

  const [items, setItems] = useState<BusinessSummaryVM[]>([]);
  const [loading, setLoading] = useState(true);

  /* =====================
     LOAD BUSINESSES
  ====================== */
  useEffect(() => {
    listMyBusinesses()
      .then((res) => {
        if (!res?.ok || !Array.isArray(res.items)) {
          setItems([]);
          return;
        }

        /**
         * 🔧 MAPPING DIFENSIVO (PROVVISORIO)
         *
         * FINCHÉ IL BE NON ESPONE configurationId:
         * - proviamo a ricavarlo
         * - oppure SKIPPIAMO l’editing
         */
        const mapped: BusinessSummaryVM[] = res.items
          .filter((b: any) => b.configurationId) // ← se NON c’è, niente editing
          .map((b: any) => ({
            businessId: b.businessId,
            name: b.name,
            status: b.status,
            createdAt: b.createdAt,
            configurationId: b.configurationId,
          }));

        setItems(mapped);
      })
      .finally(() => setLoading(false));
  }, []);

  /* =====================
     UI STATES
  ====================== */
  if (loading) return <p>Caricamento…</p>;
  if (items.length === 0)
    return <p>Nessuna attività modificabile.</p>;

  /* =====================
     HANDLERS
  ====================== */
  function goToConfigurator(configurationId: string) {
    navigate(`/user/dashboard/configurator/${configurationId}`)
  }

  function goToBusinessView(businessId: string) {
    navigate(`/user/dashboard/business/${businessId}`);
  }

  /* =====================
     RENDER
  ====================== */
  return (
    <section>
      <h2>Le tue attività</h2>

      {items.map((b) => (
        <div key={b.businessId} className="card">
          <h3>{b.name}</h3>
          <p>Stato: {b.status}</p>

          <div className="actions">
            {/* === EDITING → CONFIGURATOR === */}
            <button
              onClick={() => goToConfigurator(b.configurationId)}
            >
              ✏️ Modifica sito
            </button>

            {/* === VISTA PASSIVA === */}
            <button
              onClick={() => goToBusinessView(b.businessId)}
            >
              👁 Visualizza
            </button>
          </div>
        </div>
      ))}
    </section>
  );
}


=== FILE: pages/setup/MainLayout.tsx
LANG: tsx
SIZE:     1144 bytes
----------------------------------------
import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "../../../marketing/components/navbar/Navbar";
import Footer from "../../../marketing/components/footer/Footer";
import WhatsAppButton from "../../../marketing/components/whatsapp/WhatsAppButton";
import { CookieBanner } from "../../../shared/cookie/CookieBanner";
import CartSticker from "../../components/cart/CartSticker";
import { setDocumentTitle } from "../../../shared/utils/seo";


/**
 * Props del layout principale dell'app
 */
interface MainLayoutProps {
  icon?: string;
  baseTitle?: string;
  suffix?: string;
}

export function MainLayout({
  icon = "☕",
  baseTitle = "WebOnDay",
  suffix = "Espresso digitale",
}: MainLayoutProps) {
  useEffect(() => {
    setDocumentTitle({ icon, title: baseTitle, suffix });
  }, [icon, baseTitle, suffix]);

  return (
    <div className="app-layout">
      <Navbar />

      <main className="site-content">
        <Outlet />
      </main>

      {/* Componenti flottanti globali */}
      <WhatsAppButton />
      <CookieBanner />
      <CartSticker />

      <Footer />
    </div>
  );
}


=== FILE: pages/solution/ExploreSolutionsCTA.tsx
LANG: tsx
SIZE:      449 bytes
----------------------------------------
/**
 * AI-SUPERCOMMENT
 *
 * RUOLO:
 * - Sezione dashboard (presentazionale)
 *
 * INVARIANTI:
 * - Nessun fetch
 * - Nessuna side-effect
 *
 * EVOLUZIONE FUTURA:
 * - Collegamento a API dedicate
 */
import { Link } from "react-router-dom";

export default function ExploreSolutionsCTA() {
  return (
    <section>
      <Link to="/solution" className="user-cta primary">
        Esplora le soluzioni disponibili
      </Link>
    </section>
  );
}


=== FILE: pages/you/account/Account.container.ts
LANG: ts
SIZE:      586 bytes
----------------------------------------
// ======================================================
// FE || USER DASHBOARD || ACCOUNT — CONTAINER
// ======================================================

import { useAuthStore } from
  "@shared/lib/store/auth.store";

export type AccountVM = {
  userId: string;
  email: string;
  provider: "password" | "google" | "unknown";
};

export function useAccountContainer(): AccountVM | null {
  const user = useAuthStore((s) => s.user);
  if (!user) return null;

  return {
    userId: user.id,
    email: user.email,
    provider: "unknown", // finché BE non lo espone
  };
}


=== FILE: pages/you/account/Account.view.tsx
LANG: tsx
SIZE:     1310 bytes
----------------------------------------
// ======================================================
// FE || USER DASHBOARD || ACCOUNT — VIEW
// ======================================================
//
// RUOLO:
// - Rendering dati tecnici account
// - Nessuna fetch
// - Nessuna mutazione
// ======================================================

import { t } from "@shared/aiTranslateGenerator";

import { accountClasses } from "./account.classes";
import type {AccountVM} from "./Account.container"

interface Props {
    account: AccountVM | null;
  }
  
  export function AccountView({ account }: Props) {
    if (!account) {
      return (
        <section className={accountClasses.root}>
          <p>{t("account.not_logged")}</p>
        </section>
      );
    }
  
    return (
      <section className={accountClasses.root}>
        <header className={accountClasses.header}>
          <h1>{t("account.title")}</h1>
          <p>{t("account.subtitle")}</p>
        </header>
  
        <div className={accountClasses.row}>
  <span className={accountClasses.label}>
    {t("account.email.primary")}
  </span>
  <span>{account.email}</span>
</div>

<div className={accountClasses.row}>
  <span className={accountClasses.label}>
    {t("account.provider")}
  </span>
  <span>{account.provider}</span>
</div>

      </section>
    );
  }
  

=== FILE: pages/you/account/account.classes.ts
LANG: ts
SIZE:      414 bytes
----------------------------------------
/* ======================================================
   FE || USER DASHBOARD || ACCOUNT — CLASSES
====================================================== */

export const accountClasses = {
    root: "user-dashboard",
    header: "user-dashboard__header",
  
    card: "user-dashboard__card",
  
    row: "user-dashboard__row",
    label: "user-dashboard__label",
  
    hint: "user-dashboard__hint",
  };
  

=== FILE: pages/you/account/index.tsx
LANG: tsx
SIZE:      395 bytes
----------------------------------------
// ======================================================
// FE || USER DASHBOARD || ACCOUNT — INDEX
// ======================================================

import { useAccountContainer } from "./Account.container";
import { AccountView } from "./Account.view";

export default function AccountPage() {
  const account = useAccountContainer();
  return <AccountView account={account} />;
}


=== FILE: pages/you/business/[id].tsx
LANG: tsx
SIZE:     3830 bytes
----------------------------------------
// ======================================================
// FE || pages/user/dashboard/business/[id].tsx
// ======================================================

import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiFetch } from "../../../../shared/lib/api";
import type { BusinessDraftReadDTO } from "@src/shared/domain/business/buseinssRead.types";
import type { OpeningHoursFE, DayKey } from "@src/shared/domain/business/openingHours.types";
import { DAYS_ORDER, DAY_LABELS, EMPTY_OPENING_HOURS } from "@src/shared/domain/business/openingHours.constants";


export default function UserBusinessDetail() {
  const { id: configurationId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [business, setBusiness] =
    useState<BusinessDraftReadDTO | null>(null);

  const [loading, setLoading] = useState(true);

  /* =====================
     LOAD BUSINESS DRAFT
  ====================== */
  useEffect(() => {
    if (!configurationId) return;

    setLoading(true);

    apiFetch<{ ok: boolean; draft?: BusinessDraftReadDTO }>(
      `/api/business/get-base-draft?configurationId=${configurationId}`
    )
      .then((res) => {
        if (res?.ok && res.draft) {
          setBusiness(res.draft);
        } else {
          setBusiness(null);
        }
      })
      .finally(() => setLoading(false));
  }, [configurationId]);

  /* =====================
     UI STATES
  ====================== */
  if (!configurationId) return <p>ID mancante</p>;
  if (loading) return <p>Caricamento…</p>;
  if (!business) return <p>Attività non trovata</p>;

  /* =====================
     SAFE ACCESS
  ====================== */
  const address = business.address ?? {};
  const contact = business.contact ?? {};
  const opening: OpeningHoursFE =
  (business.openingHours as OpeningHoursFE) ?? EMPTY_OPENING_HOURS;

  /* =====================
     RENDER
  ====================== */
  return (
    <main className="business-page">
      {/* HEADER */}
      <header className="business-page__header">
        <h1>{business.businessName}</h1>

      
      </header>

      <hr />

      {/* INDIRIZZO */}
      <section>
        <h2>Indirizzo</h2>
        <p>
          {address.street ?? "—"} {address.number ?? ""}
        </p>
        <p>
          {address.zip ?? ""} {address.city ?? ""}{" "}
          {address.province ?? ""}
        </p>
      </section>

      {/* CONTATTI */}
      <section>
        <h2>Contatti</h2>
        <p>
          <strong>Telefono:</strong>{" "}
          {contact.phoneNumber ?? "—"}
        </p>
        <p>
          <strong>Email:</strong> {contact.mail ?? "—"}
        </p>
      </section>

      {/* ORARI */}
      <section>
  <h2>Orari di apertura</h2>

  {DAYS_ORDER.every((day) => opening[day].length === 0) ? (
    <p>Orari non disponibili</p>
  ) : (
    <ul>
      {DAYS_ORDER.map((day: DayKey) => {
        const slots = opening[day];

        return (
          <li key={day}>
            <strong>{DAY_LABELS[day]}:</strong>{" "}
            {slots.length > 0
              ? slots.map((s, i) => (
                  <span key={i}>
                    {s.from}–{s.to}
                    {i < slots.length - 1 ? ", " : ""}
                  </span>
                ))
              : "Chiuso"}
          </li>
        );
      })}
    </ul>
  )}
</section>

      <hr />

      {/* ACTIONS */}
      <button
        onClick={async () => {
          await apiFetch("/api/business/reopen-draft", {
            method: "POST",
            body: JSON.stringify({ configurationId }),
          });

          navigate(
            `/user/dashboard/configurator/${configurationId}`
          );
        }}
      >
        ✏️ Modifica informazioni
      </button>
    </main>
  );
}


=== FILE: pages/you/checkout/index.tsx
LANG: tsx
SIZE:     2861 bytes
----------------------------------------
// ======================================================
// FE || pages/user/checkout/index.tsx
// ======================================================
//
// AI-SUPERCOMMENT — CHECKOUT ENTRY (ROUTE / PARAM ALIGNMENT)
//
// STATO ATTUALE (INTENZIONALE):
// ------------------------------------------------------
// Questo componente legge:
//   const { configurationId } = useParams<{ configurationId: string }>();
//
// Tuttavia, il router espone attualmente:
//   path: "checkout"
//
// Quindi:
// - configurationId NON è garantito dalla route
// - Il flusso funziona solo se configurationId
//   arriva da redirect controllato o contesto esterno
//
// ------------------------------------------------------
// DECISIONE ARCHITETTURALE:
// - ❌ NON modificare ora la route
// - ❌ NON cambiare la firma del componente
// - ❌ NON introdurre fallback impliciti
//
// ------------------------------------------------------
// MOTIVO:
// - La scelta corretta dipende dal dominio Orders
// - Checkout è una FASE, non una risorsa autonoma
//
// ------------------------------------------------------
// STEP FUTURO DEDICATO (ORDERS):
// - Valutare una delle seguenti:
//   A) /user/checkout/:configurationId
//   B) /user/checkout + configurationId via store
//
// FINO AD ALLORA:
// - Questo file è BLOCCATO STRUTTURALMENTE
// - Qualsiasi refactor qui è VIETATO
//
// ======================================================

import { useParams } from "react-router-dom";

import CartReview from "./steps/CartReview";
import { useAuthStore } from "../../../../shared/lib/store/auth.store";
import BusinessForm from "../../../configurator/base_configuration/business/BusinessForm";
import { useCheckout } from "./useCheckout";
import { useEffect ,useState } from "react";
export default function CheckoutPage() {
  const { user, ready } = useAuthStore();
  const { configurationId } = useParams<{ configurationId: string }>();

  const checkout = useCheckout(configurationId ?? "");

  useEffect(() => {
    if (ready && !user) {
      window.location.href =
        "/user/login?redirect=/user/checkout";
    }
  }, [ready, user]);

  if (!ready) return <p>Caricamento…</p>;
  if (!user) return null;
  if (!configurationId) return <p>Configurazione mancante</p>;

  const [businessDone, setBusinessDone] = useState(false);

  if (!businessDone) {
    return (
      <BusinessForm
      solutionSeed={null}
        onComplete={() => setBusinessDone(true)}
      />
    );
  }
  if (checkout.loading) {
    return <p>Preparazione checkout…</p>;
  }
  
  if (!checkout.configuration || !checkout.pricing) {
    return <p>Dati checkout non disponibili</p>;
  }
  return (
    <CartReview
    submitOrder={checkout.submitCheckout}
    configuration={checkout.configuration}
    pricing={checkout.pricing}
    loading={checkout.loading}
  />
  
  );
  
}


=== FILE: pages/you/checkout/steps/CartReview.tsx
LANG: tsx
SIZE:     4743 bytes
----------------------------------------
// ======================================================
// FE || Checkout — CartReview (FINAL, CLEAN)
// ======================================================
//
// RUOLO:
// - Riepilogo finale ordine
// - Accettazione policy
// - Avvio pagamento PayPal
//
// SOURCE OF TRUTH:
// - configuration + pricing (BE)
//
// ======================================================

import { useEffect, useState } from "react";
import { eur } from "../../../../../shared/utils/format";
import PaymentPaypal from "./PaymentPaypal";
import { fetchLatestPolicy } from "../../../../../shared/lib/userApi/policy.user.api";

interface PricingLine {
  label: string;
  amount: number;
  type: "startup" | "monthly" | "yearly";
}

interface Pricing {
  startupTotal: number;
  yearlyTotal: number;
  monthlyTotal: number;
  lines: PricingLine[];
}

interface Configuration {
  solutionName: string;
  productName: string;
}

interface Props {
  submitOrder: (policyVersion: string) => Promise<string>;
  configuration: Configuration;
  pricing: Pricing;
  loading?: boolean;
}

export default function CartReview({
  submitOrder,
  configuration,
  pricing,
  loading = false,
}: Props) {
  const [policyVersion, setPolicyVersion] = useState<string>();
  const [accepted, setAccepted] = useState(false);
  const [orderId, setOrderId] = useState<string>();
  const [error, setError] = useState<string>();
  const [paying, setPaying] = useState(false);

  /* =========================
     LOAD POLICY
  ========================= */
  useEffect(() => {
    fetchLatestPolicy("checkout")
      .then((p) => setPolicyVersion(p.version))
      .catch(() =>
        setError("Impossibile caricare la policy")
      );
  }, []);

  /* =========================
     CREATE ORDER
  ========================= */
  async function acceptAndPay() {
    if (!policyVersion) return;

    try {
      setPaying(true);
      setError(undefined);

      const oid = await submitOrder(policyVersion);

      setOrderId(oid);
      setAccepted(true);
    } catch (e: any) {
      setError(e.message ?? "Errore checkout");
    } finally {
      setPaying(false);
    }
  }

  if (loading) return <p>Preparazione checkout…</p>;
  if (!configuration || !pricing)
    return <p>Dati checkout non disponibili</p>;

  /* =========================
     RENDER
  ========================= */
  return (
    <div className="checkout-page">
      <section className="checkout-card">
        <h2 className="checkout-title">Checkout</h2>

        {/* CONFIGURATION */}
        <ul className="checkout-list">
          <li className="checkout-item">
            <strong>{configuration.solutionName}</strong>
            <span>{configuration.productName}</span>
          </li>

          {pricing.lines.map((l, i) => (
            <li key={i} className="checkout-item">
              <span>{l.label}</span>
              <span>
                {eur.format(l.amount)}
                {l.type === "monthly" && " / mese"}
                {l.type === "yearly" && " / anno"}
              </span>
            </li>
          ))}
        </ul>

        {/* PAY NOW */}
        <div className="checkout-total">
          Da pagare ora{" "}
          <strong>
            {eur.format(pricing.startupTotal)}
          </strong>
        </div>

        {/* RECURRING NOTE */}
        {(pricing.yearlyTotal > 0 ||
          pricing.monthlyTotal > 0) && (
          <p className="checkout-note">
            I canoni ricorrenti non vengono addebitati ora.
            <br />
            Annuale:{" "}
            {eur.format(pricing.yearlyTotal)} / anno
            — Mensile:{" "}
            {eur.format(pricing.monthlyTotal)} / mese
          </p>
        )}

        {!accepted && (
          <div className="checkout-action">
            <p className="checkout-policy">
              Procedendo accetti i{" "}
              <a
                href="/terms"
                target="_blank"
                rel="noopener noreferrer"
              >
                Termini e la Privacy Policy
              </a>{" "}
              (versione {policyVersion ?? "…"}).
            </p>

            {error && (
              <p className="checkout-error">{error}</p>
            )}

            <button
              onClick={acceptAndPay}
              disabled={paying || !policyVersion}
              className="checkout-pay-btn"
            >
              {paying
                ? "Preparazione pagamento…"
                : "Paga con PayPal"}
            </button>
          </div>
        )}

        {accepted && orderId && (
          <div className="checkout-paypal">
            <PaymentPaypal state={{ orderId }} />
          </div>
        )}
      </section>
    </div>
  );
}


=== FILE: pages/you/checkout/steps/PaymentPaypal.tsx
LANG: tsx
SIZE:     3787 bytes
----------------------------------------
// ======================================================
// FE || pages/user/checkout/steps/PaymentPaypal.tsx
// ======================================================
// PAYMENT — PAYPAL INTEGRATION
//
// RUOLO:
// - Avvio e gestione pagamento PayPal
//
// RESPONSABILITÀ:
// - Load SDK
// - Create order PayPal
// - Capture pagamento
//
// NON FA:
// - NON crea ordini interni
// - NON calcola importi
//
// NOTE:
// - Backend resta source of truth
// ======================================================

import { useEffect, useRef } from "react";
import {
  loadPaypalSdk,
  mountPaypalButtons,
} from "../../../../../shared/lib/payments/paypal";

interface Props {
  state: {
    orderId?: string;
  };
}

export default function PaymentPaypal({ state }: Props) {
  const mountedRef = useRef(false);

  useEffect(() => {
    if (!state.orderId) return;
    if (mountedRef.current) return; // evita doppio mount (React StrictMode)

    mountedRef.current = true;
    let cancelled = false;

    async function initPaypal() {
      try {
        /* =========================
           1) Load PayPal SDK
        ========================= */
        await loadPaypalSdk(import.meta.env.VITE_PAYPAL_CLIENT_ID);

        if (cancelled) return;

        /* =========================
           2) Mount PayPal Buttons
        ========================= */
        mountPaypalButtons("#paypal-buttons", {
          style: {
            layout: "vertical",
            color: "gold",
            shape: "pill",
            label: "paypal",
          },

          /* ===== CREATE PAYPAL ORDER ===== */
          createOrder: async () => {
            const res = await fetch( `${import.meta.env.VITE_API_URL}/api/payment/paypal/create-order`, {
              method: "POST",
          
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                orderId: state.orderId,
              }),
            });

            if (!res.ok) {
              throw new Error("PayPal create-order HTTP error");
            }

            const out = await res.json();
            if (!out.ok || !out.paypalOrderId) {
              throw new Error("Create PayPal order failed");
            }

            return out.paypalOrderId;
          },

          /* ===== CAPTURE = SOLDI ===== */
          onApprove: async () => {
            const res = await fetch( `${import.meta.env.VITE_API_URL}/api/payment/paypal/capture-order`, {
              method: "POST",
             
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                orderId: state.orderId,
              }),
            });

            if (!res.ok) {
              throw new Error("PayPal capture HTTP error");
            }

            const out = await res.json();
            if (!out.ok || out.paymentStatus !== "paid") {
              throw new Error("PayPal capture failed");
            }

            /* ===== SUCCESS ===== */
            window.location.href = "/user/dashboard";
          },

          onError: (err: unknown) => {
            console.error("PayPal error:", err);
            alert("Errore durante il pagamento. Riprova.");
          },
        });
      } catch (err) {
        console.error("PayPal init error:", err);
      }
    }

    initPaypal();

    return () => {
      cancelled = true;
    };
  }, [state.orderId]);

  /* =========================
     RENDER
  ========================= */

  if (!state.orderId) {
    return <p>Ordine non pronto…</p>;
  }

  return (
    <section>
      <h2>Pagamento</h2>
      <p>Completa il pagamento con PayPal</p>

      <div id="paypal-buttons" />
    </section>
  );
}


=== FILE: pages/you/checkout/types.ts
LANG: ts
SIZE:      255 bytes
----------------------------------------
export type CheckoutStep =
  | "cart"
  | "user"
  | "policy"
  | "payment";

  export interface CheckoutState {
    step: CheckoutStep;
    email: string;
    orderId?: string;
    policyVersion?: string;
    loading: boolean;
    error?: string;
  }
  


=== FILE: pages/you/checkout/useCheckout.ts
LANG: ts
SIZE:     3094 bytes
----------------------------------------
// ======================================================
// FE || pages/user/checkout/useCheckout.ts
// ======================================================
//
// CHECKOUT HOOK — CONFIGURATION-FIRST
//
// RUOLO:
// - Carica dati checkout da Configuration
// - Crea ordine (post policy)
//
// SOURCE OF TRUTH:
// - Backend
//
// ======================================================

import { useEffect, useState } from "react";
import { apiFetch } from "../../../../shared/lib/api";

/* =========================
   TYPES
========================= */
export interface PricingLine {
  label: string;
  amount: number;
  type: "startup" | "monthly" | "yearly";
}

export interface Pricing {
  startupTotal: number;
  yearlyTotal: number;
  monthlyTotal: number;
  lines: PricingLine[];
}

export interface Configuration {
  solutionName: string;
  productName: string;
}

type CheckoutDataResponse =
  | {
      ok: true;
      configuration: Configuration;
      pricing: Pricing;
    }
  | { ok: false; error: string };

type CreateOrderResponse =
  | { ok: true; orderId: string }
  | { ok: false; error: string };

/* =========================
   HOOK
========================= */
export function useCheckout(configurationId: string) {
  const [configuration, setConfiguration] =
    useState<Configuration | null>(null);
  const [pricing, setPricing] = useState<Pricing | null>(null);

  const [orderId, setOrderId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* =========================
     LOAD CHECKOUT DATA
  ========================= */
  useEffect(() => {
    if (!configurationId) return;

    setLoading(true);

    apiFetch<CheckoutDataResponse>(
      "/api/checkout/from-configuration",
      {
        method: "POST",
        body: JSON.stringify({ configurationId }),
      }
    )
      .then((res) => {
        if (!res || !res.ok) {
          throw new Error(
            res?.error ?? "Errore caricamento checkout"
          );
        }

        setConfiguration(res.configuration);
        setPricing(res.pricing);
      })
      .catch((err: any) => {
        setError(err.message ?? "Errore checkout");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [configurationId]);

  /* =========================
     SUBMIT CHECKOUT
  ========================= */
  async function submitCheckout(
    policyVersion: string
  ): Promise<string> {
    if (!configurationId) {
      throw new Error("ConfigurationId mancante");
    }

    const res = await apiFetch<CreateOrderResponse>(
      "/api/order/from-configuration",
      {
        method: "POST",
        body: JSON.stringify({
          configurationId,
          policyVersion,
        }),
      }
    );

    if (!res || !res.ok) {
      throw new Error(
        res?.error ?? "Errore creazione ordine"
      );
    }

    setOrderId(res.orderId);
    return res.orderId;
  }

  return {
    configuration,
    pricing,
    orderId,
    loading,
    error,
    submitCheckout,
  };
}


=== FILE: pages/you/hard-driver/You.container.tsx
LANG: tsx
SIZE:     4725 bytes
----------------------------------------
// ======================================================
// AI-SUPERCOMMENT — YOU CONTAINER
// ======================================================
//
// RUOLO (CHE COSA FA):
// - È il layer di ORCHESTRAZIONE della pagina YOU
// - Punto di aggregazione USER → CONFIGURATION → (BUSINESS opzionale)
// - Trasforma dati grezzi in ViewModel pronti per la View
//
// SOURCE OF TRUTH:
// - CONFIGURATION è la base (useMyConfigurations)
// - BUSINESS è un ARRICCHIMENTO opzionale (best-effort)
//
// COSA FA ESATTAMENTE:
// 1. Carica TUTTE le configuration dell’utente (non terminali)
// 2. Per ciascuna configuration:
//    - prova a caricare il business draft
//    - se ESISTE → arricchisce con preview anagrafica
//    - se NON esiste → restituisce comunque la configuration
// 3. Garantisce che la pagina YOU non sia MAI vuota
//
// COSA **NON** DEVE FARE:
// - NON decide flussi di navigazione
// - NON filtra per stati commerciali
// - NON crea o muta business
// - NON dipende da sidebar o routing
//
// INVARIANTI CRITICI:
// - YOU è CONFIGURATION-CENTRIC
// - L’assenza del business NON è un errore
// - Business.status è derivato, non persistito
// - Qualsiasi failure di fetch business è SILENZIOSA
//
// ⚠️ ATTENZIONE FUTURA:
// - Qualsiasi refactor che renda YOU business-centrico
//   rompe il flusso user → workspace → preview
// ======================================================
import { useEffect, useState } from "react";
import { useMyConfigurations } from
  "../../../configurator/base_configuration/configuration/useMyConfigurations";
import { apiFetch } from "@shared/lib/api";

/* ======================================================
   VIEW MODELS
====================================================== */

export interface ProductOptionVM {
  id: string;
  label: string;
  price: number;
  description: string;
}

export type BusinessWithPlanVM = {
  configurationId: string;
  businessName: string;
  status: "ACTIVE" | "DRAFT";

  preview?: {
    address?: {
      street?: string;
      city?: string;
      province?: string;
      zip?: string;
    };
    phoneNumber?: string;
    mail?: string;
    openingHours?: Record<
      string,
      { from: string; to: string }[]
    >;
  };
};

export type YouDashboardVM = {
  configurations: any[];
  businesses: BusinessWithPlanVM[];
};

/* ======================================================
   CONTAINER
====================================================== */

export function useYouDashboardContainer(): YouDashboardVM {
  /* ❗ HOOKS SEMPRE IN ALTO, SEMPRE LINEARI */
  const { items: configurations = [] } = useMyConfigurations();

  const [businesses, setBusinesses] =
    useState<BusinessWithPlanVM[]>([]);

  /* =========================
     LOAD BUSINESS PREVIEW
  ========================= */
/* =========================
   LOAD BUSINESS PREVIEW (OPTIONAL)
   PERCHÉ:
   - YOU è configuration-centric
   - Business è un arricchimento
========================= */
useEffect(() => {
  let cancelled = false;

  async function loadBusinesses() {
    // 🔑 TUTTE le configuration non terminali
    const activeConfigs = configurations.filter(
      (c) =>
        c.status !== "CANCELLED" &&
        c.status !== "ARCHIVED"
    );

    const results = await Promise.all(
      activeConfigs.map(async (c) => {
        try {
          const res = await apiFetch<{
            ok: boolean;
            draft?: any;
          }>(
            `/api/business/get-base-draft?configurationId=${c.id}`
          );

          // ❗ Se NON esiste business → mostriamo comunque la configuration
          if (!res?.ok || !res.draft) {
            return {
              configurationId: c.id,
              businessName:
                c.prefill?.businessName ?? "Attività",
              status: "DRAFT",
            } as BusinessWithPlanVM;
          }

          const d = res.draft;

          return {
            configurationId: c.id,
            businessName:
              d.businessName ??
              c.prefill?.businessName ??
              "Attività",
            status: d.complete ? "ACTIVE" : "DRAFT",
            preview: {
              address: d.contact?.address,
              phoneNumber: d.contact?.phoneNumber,
              mail: d.contact?.mail,
              openingHours: d.openingHours,
            },
          } as BusinessWithPlanVM;
        } catch {
          return null;
        }
      })
    );

    if (!cancelled) {
      setBusinesses(
        results.filter(Boolean) as BusinessWithPlanVM[]
      );
    }
  }

  loadBusinesses();

  return () => {
    cancelled = true;
  };
}, [configurations]);
  return {
    configurations,
    businesses,
  };
}


=== FILE: pages/you/hard-driver/You.view.tsx
LANG: tsx
SIZE:     5585 bytes
----------------------------------------
// ======================================================
// AI-SUPERCOMMENT — YOU VIEW
// ======================================================
//
// RUOLO (CHE COSA FA):
// - Renderizzazione PURA della pagina YOU
// - Consuma esclusivamente il ViewModel
// - Nessuna logica di dominio
//
// RESPONSABILITÀ:
// - Mostrare:
//   • elenco configuration/business
//   • stato derivato
//   • preview anagrafica (se presente)
// - Gestire CTA di upgrade
//
// COSA **NON** DEVE FARE:
// - NON chiamare API
// - NON filtrare stati
// - NON interpretare status di dominio
// - NON costruire dati mancanti
//
// INVARIANTI UI:
// - Deve funzionare anche con preview parziale o assente
// - Fallback visivi ("—") sono OBBLIGATORI
// - Nessun errore visivo se preview undefined
//
// NOTA ARCHITETTURALE:
// - Questa View è intenzionalmente “stupida”
// - Ogni logica va nel Container
//
// ⚠️ NON AGGIUNGERE:
// - useEffect
// - useState
// - chiamate API
// ======================================================
import { t } from "@src/shared/aiTranslateGenerator";
import { getWdStatusClass } from "@src/shared/utils/statusUi";
import type { YouDashboardVM } from "./You.container";
import { youClasses } from "./you.classes";
import { useNavigate } from "react-router-dom";

export function YouDashboardView({
  configurations,
  businesses,
}: YouDashboardVM) {
  const navigate = useNavigate();

  const totalConfigs = configurations.length;
  const activeBusinesses =
  businesses.filter(
    (b) => b.status === "ACTIVE"
  ).length;
  
  return (
    <section className={youClasses.root}>
      {/* ================= HEADER ================= */}
      <header className={youClasses.header}>
        <h1>{t("you.title")}</h1>

        <p className={youClasses.subtitle}>
          Business attivi: {activeBusinesses} / {totalConfigs}
        </p>

        <button
          className="wd-btn wd-btn--secondary"
          onClick={() =>
            navigate("/user/dashboard/you/upgrade/")
          }
        >
          🚀 Upgrade Business
        </button>
      </header>

      {/* ================= BUSINESS LIST ================= */}
      <section className={youClasses.section}>
        <h2>I tuoi Business</h2>

        {businesses.length === 0 ? (
          <p>{t("you.business.empty")}</p>
        ) : (
          businesses.map((b) => (
            <div
              key={b.configurationId}
              className={youClasses.businessRow}
            >
              {/* ================= BUSINESS CARD ================= */}
              <div className={youClasses.card}>
                <header className={youClasses.cardHeader}>
                  <h3>{b.businessName}</h3>

                  <span
  className={getWdStatusClass(
    b.status === "ACTIVE"
      ? "ACTIVE"
      : "DRAFT"
  )}
>
                  </span>
                </header>

                <div className={youClasses.meta}>
                  <strong>Stato</strong>
                  <p className={youClasses.planMuted}>
                    Business configurato
                  </p>
                </div>

                {/* ---------- CTA ---------- */}
                <div className={youClasses.cardActions}>
                  <button
                    className="wd-btn wd-btn--secondary"
                    onClick={() =>
                      navigate(
                        `/user/dashboard/you/upgrade/${b.configurationId}`
                      )
                    }
                  >
                    🚀 Upgrade Business
                  </button>
                </div>
              </div>

              {/* ================= BUSINESS PREVIEW ================= */}
              <aside className={youClasses.preview}>
                <h4 className={youClasses.previewTitle}>
                  Anteprima anagrafica
                </h4>

                <div className={youClasses.previewBlock}>
                  <strong>Indirizzo</strong>
                  <p>
                    {b.preview?.address?.street ?? "—"}
                  </p>
                  <p>
                    {b.preview?.address?.zip ?? ""}{" "}
                    {b.preview?.address?.city ?? ""}{" "}
                    {b.preview?.address?.province ?? ""}
                  </p>
                </div>

                <div className={youClasses.previewBlock}>
                  <strong>Contatti</strong>
                  <p>
                    📞 {b.preview?.phoneNumber ?? "—"}
                  </p>
                  <p>
                    ✉️ {b.preview?.mail ?? "—"}
                  </p>
                </div>

                <div className={youClasses.previewBlock}>
                  <strong>Orari</strong>

                  {b.preview?.openingHours ? (
                    Object.entries(
                      b.preview.openingHours
                    ).map(([day, slots]) => (
                      <p key={day}>
                        {day}:{" "}
                        {slots.length
                          ? slots
                              .map(
                                (s) =>
                                  `${s.from}–${s.to}`
                              )
                              .join(", ")
                          : "Chiuso"}
                      </p>
                    ))
                  ) : (
                    <p>Non disponibili</p>
                  )}
                </div>
              </aside>
            </div>
          ))
        )}
      </section>
    </section>
  );
}


=== FILE: pages/you/hard-driver/index.tsx
LANG: tsx
SIZE:      882 bytes
----------------------------------------
// ======================================================
// AI-SUPERCOMMENT — YOU PAGE INDEX
// ======================================================
//
// RUOLO:
// - Entry point della route /user/dashboard/you
// - Collega Container → View
//
// RESPONSABILITÀ:
// - Nessuna logica
// - Nessuna trasformazione dati
//
// INVARIANTI:
// - Deve rimanere un file “thin”
// - Serve solo a mantenere separazione
//   tra routing e dominio
//
// ⚠️ NON:
// - aggiungere hook
// - aggiungere logica
// - aggiungere condizioni
// ==========================================================================================================

import { useYouDashboardContainer } from "./You.container";
import { YouDashboardView } from "./You.view";

export default function YouDashboardPage() {
  const vm = useYouDashboardContainer();
  return <YouDashboardView {...vm} />;
}


=== FILE: pages/you/hard-driver/you.classes.ts
LANG: ts
SIZE:     1061 bytes
----------------------------------------
// ======================================================
// AI-SUPERCOMMENT — YOU CLASSES
// ======================================================
//
// RUOLO:
// - Mappa semantica classi CSS per la pagina YOU
// - Single source of truth per naming UI
//
// RESPONSABILITÀ:
// - Fornire nomi coerenti e leggibili
// - Evitare stringhe hardcoded nella View
//
// INVARIANTI:
// - Nessuna logica
// - Nessuna dipendenza da stato
//
// ⚠️ LINEE GUIDA:
// - Aggiungere classi SOLO se usate
// - NON commentare con logica di dominio
// ======================================================
   export const youClasses = {
    root: "you-root",
  header: "you-header",
  subtitle: "you-subtitle",
  section: "you-section",

  businessRow: "you-business-row",

  card: "you-card",
  cardHeader: "you-card-header",
  meta: "you-meta",
  planMuted: "you-plan-muted",
  optionsHint: "you-options-hint",
  cardActions: "you-card-actions",

  preview: "you-preview",
  previewTitle: "you-preview-title",
  previewBlock: "you-preview-block",// 👈 AGGIUNTA
  };
  

=== FILE: pages/you/orders/UserOrders.tsx
LANG: tsx
SIZE:      366 bytes
----------------------------------------
/**
 * AI-SUPERCOMMENT
 *
 * RUOLO:
 * - Sezione dashboard (presentazionale)
 *
 * INVARIANTI:
 * - Nessun fetch
 * - Nessuna side-effect
 *
 * EVOLUZIONE FUTURA:
 * - Collegamento a API dedicate
 */
export default function UserOrders() {
    return (
      <section>
        <h2>I tuoi ordini</h2>
        <p>Nessun ordine ancora.</p>
      </section>
    );
  }
  

=== FILE: pages/you/orders/index.tsx
LANG: tsx
SIZE:      654 bytes
----------------------------------------
// ======================================================
// FE || pages/user/dashboard/[id]/payments/index.tsx
// ======================================================
//
// AI-SUPERCOMMENT — USER PAYMENTS AREA (PLACEHOLDER)
//
// RUOLO:
// - Entry point sezione pagamenti utente
//
// SOURCE OF TRUTH:
// - Backend (orders / payments)
//
// COSA FA:
// - NIENTE (placeholder)
//
// COSA NON FA:
// - NON effettua fetch
// - NON mostra dati
//
// INVARIANTI:
// - Accessibile solo da dashboard autenticata
//Backend = source of truth


// NOTE:
// - Implementazione futura
//Nessun fetch ora
// ======================================================


=== FILE: pages/you/orders/payments/completed.tsx
LANG: tsx
SIZE:      611 bytes
----------------------------------------
// ======================================================
// FE || pages/user/dashboard/[id]/payments/index.tsx
// ======================================================
//
// AI-SUPERCOMMENT — USER PAYMENTS AREA (PLACEHOLDER)
//
// RUOLO:
// - Entry point sezione pagamenti utente
//
// SOURCE OF TRUTH:
// - Backend (orders / payments)
//
// COSA FA:
// - NIENTE (placeholder)
//
// COSA NON FA:
// - NON effettua fetch
// - NON mostra dati
//
// INVARIANTI:
// - Accessibile solo da dashboard autenticata
//
// NOTE:
// - Implementazione futura
//
// ======================================================


=== FILE: pages/you/orders/payments/index.tsx
LANG: tsx
SIZE:      611 bytes
----------------------------------------
// ======================================================
// FE || pages/user/dashboard/[id]/payments/index.tsx
// ======================================================
//
// AI-SUPERCOMMENT — USER PAYMENTS AREA (PLACEHOLDER)
//
// RUOLO:
// - Entry point sezione pagamenti utente
//
// SOURCE OF TRUTH:
// - Backend (orders / payments)
//
// COSA FA:
// - NIENTE (placeholder)
//
// COSA NON FA:
// - NON effettua fetch
// - NON mostra dati
//
// INVARIANTI:
// - Accessibile solo da dashboard autenticata
//
// NOTE:
// - Implementazione futura
//
// ======================================================


=== FILE: pages/you/orders/payments/pending.tsx
LANG: tsx
SIZE:      611 bytes
----------------------------------------
// ======================================================
// FE || pages/user/dashboard/[id]/payments/index.tsx
// ======================================================
//
// AI-SUPERCOMMENT — USER PAYMENTS AREA (PLACEHOLDER)
//
// RUOLO:
// - Entry point sezione pagamenti utente
//
// SOURCE OF TRUTH:
// - Backend (orders / payments)
//
// COSA FA:
// - NIENTE (placeholder)
//
// COSA NON FA:
// - NON effettua fetch
// - NON mostra dati
//
// INVARIANTI:
// - Accessibile solo da dashboard autenticata
//
// NOTE:
// - Implementazione futura
//
// ======================================================


=== FILE: pages/you/profile/DataTransferObject/configuration-read.type.ts
LANG: ts
SIZE:      614 bytes
----------------------------------------
// ======================================================
// FE || CONFIGURATION || READ DTO
// ======================================================
//
// RUOLO:
// - Stato di avanzamento verifica
// - SOURCE OF TRUTH per ProfileView
//
// ======================================================

export type ConfigurationReadDTO = {
    id: string;
  
    status:
      | "CONFIGURATION_IN_PROGRESS"
      | "BUSINESS_READY"
      | "CONFIGURATION_READY"
      | "ACCEPTED"
      | "REJECTED";
  
    ownerVerified: boolean;
    businessVerified: boolean;
  
    createdAt: string;
    updatedAt: string;
  };
  

=== FILE: pages/you/profile/OptionSelector.tsx
LANG: tsx
SIZE:     3374 bytes
----------------------------------------
// FE || components/catalog/OptionSelector.tsx
// ======================================================
// OPTION SELECTOR — MONTHLY ONLY (ALIGNED WITH ProductOptionDTO)
// ======================================================
//
// AI-SUPERCOMMENT
//
// RUOLO:
// - Consentire la selezione di servizi aggiuntivi (option)
// - Comunicare in modo esplicito il costo mensile
//
// DOMINIO (CHIUSO):
// - Le option sono SEMPRE:
//   - ricorrenti
//   - mensili
// - Il campo `type` del DTO NON viene interpretato
//
// ASSUNZIONI:
// - ProductOptionDTO è già normalizzato
// - opt.label ESISTE sempre
// - opt.price ESISTE sempre
//
// NON FA:
// - calcoli
// - logica carrello
// - interpretazione dominio
//
// ======================================================
// ⚠️ NON USATO NEL BUYFLOW BASE
// Questo componente appartiene alla Configuration ESTESA

import type { ProductOptionVM } from "@shared/lib/viewModels/product/Product.view-model";
import { eur } from "@shared/utils/format";
import { t } from "@shared/aiTranslateGenerator";
interface Props {
  options: ProductOptionVM[];
  selected: string[];
  onChange: (selected: string[]) => void;
}

export default function OptionSelector({
  options,
  selected,
  onChange,
}: Props) {
  /* =========================
     TOGGLE OPTION
  ========================= */
  const toggle = (id: string) => {
    onChange(
      selected.includes(id)
        ? selected.filter((x) => x !== id)
        : [...selected, id]
    );
  };

  /* =========================
     RENDER
  ========================= */
  return (
    <div className="option-selector wd-card">
      {/* ================= HEADER ================= */}
      <div className="card__header">
        <h4 className="card__title">
          {t("option.product.title.monthly_addons")}
        </h4>
      </div>

      {/* ================= LIST ================= */}
      <div
        className="option-list"
        role="group"
        aria-label={t("option.product.aria.group")}
      >
        {options.map((opt) => {
          const checked = selected.includes(opt.id);
        
          return (
            <label
              key={opt.id}
              className={`option-item ${checked ? "is-checked" : ""}`}
            >
              <input
                type="checkbox"
                className="option-item__checkbox"
                checked={checked}
                onChange={() => toggle(opt.id)}
                aria-label={t(
                  "option.product.aria.option_monthly",
                  {
                    label: opt.label,
                    price: eur.format(opt.price),
                  }
                )}
              />

              <span className="option-item__box" aria-hidden="true" />

              <span className="option-item__content">
                {/* LABEL SERVIZIO */}
                <span className="option-label">
                  {opt.label}
                </span>

                {/* PREZZO MENSILE */}
                <span className="option-price">
                  {t(
                    "option.product.label.price_monthly",
                    {
                      price: eur.format(opt.price),
                    }
                  )}
                </span>
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}


=== FILE: pages/you/profile/Profile.container.ts
LANG: ts
SIZE:     1635 bytes
----------------------------------------
import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "@src/shared/lib/api";

import type { OwnerDraftReadDTO } from
  "@src/shared/domain/owner/owner.read.types";

import type { ConfigurationReadDTO } from "./DataTransferObject/configuration-read.type";
import { useConfigurationSetupStore } from
  "@src/shared/domain/user/configurator/configurationSetup.store";

export function useProfileContainer() {
  const [user, setUser] =
    useState<OwnerDraftReadDTO | null>(null);

  const [configuration, setConfiguration] =
    useState<ConfigurationReadDTO | null>(null);

  const { setField } = useConfigurationSetupStore();

  const loadProfile = useCallback(async () => {
    /* ================= OWNER ================= */
    const ownerRes = await apiFetch<{
      ok: boolean;
      owner?: OwnerDraftReadDTO;
    }>("/api/owner/get-draft");

    if (!ownerRes?.owner) {
      setUser(null);
      setConfiguration(null);
      return;
    }

    const owner = ownerRes.owner;
    setUser(owner);

    if (owner.configurationId) {
      setField("configurationId", owner.configurationId);

      /* ================= CONFIGURATION READ ================= */
      const cfgRes = await apiFetch<{
        ok: boolean;
        configuration?: ConfigurationReadDTO;
      }>(
        `/api/configuration/${owner.configurationId}`
      );

      setConfiguration(cfgRes?.configuration ?? null);
    } else {
      setConfiguration(null);
    }
  }, [setField]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  return {
    user,
    configuration,
    reloadProfile: loadProfile,
  };
}


=== FILE: pages/you/profile/Profile.view.tsx
LANG: tsx
SIZE:     4853 bytes
----------------------------------------
// ======================================================
// FE || USER DASHBOARD || PROFILE — VIEW
// ======================================================

import { useEffect, useState } from "react";
import { t } from "@shared/aiTranslateGenerator";
import { profileClasses } from "./profile.classes";
import type { OwnerDraftReadDTO } from
  "@shared/domain/owner/owner.read.types";
import { useConfigurationSetupStore } from
  "@src/shared/domain/user/configurator/configurationSetup.store";

import {
  OwnerVerificationStep1,
  OwnerVerificationStep2,
} from "./verification";
import type { ConfigurationReadDTO } from "./DataTransferObject/configuration-read.type";

/* ======================================================
   VIEW
====================================================== */

export function ProfileView({
  user,
  reloadProfile,
  configuration, 
}: {
  user: OwnerDraftReadDTO | null;
  configuration: ConfigurationReadDTO |null; 
  reloadProfile: () => Promise<void>;
}) {
  const [showVerification, setShowVerification] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);

  /* =====================
     STORE (OWNER DRAFT)
  ====================== */
  const { data, setField } = useConfigurationSetupStore();

  /* =====================
     PREFILL STORE FROM READ MODEL
  ====================== */
  useEffect(() => {
    if (!user) return;

    setField("ownerFirstName", user.firstName ?? "");
    setField("ownerLastName", user.lastName ?? "");
    setField("ownerBirthDate", user.birthDate ?? "");
    setField(
      "ownerSecondaryMail",
      user.contact?.secondaryMail ?? ""
    );
    setField("ownerPhone", user.contact?.phoneNumber ?? "");

    if (user.address) {
      setField("ownerAddress", {
        street: user.address.street ?? "",
        number: user.address.number ?? "",
        city: user.address.city ?? "",
        province: user.address.province ?? "",
        region: user.address.region ?? "",
        zip: user.address.zip ?? "",
        country: user.address.country ?? "Italia",
      });
    }

    if (user.privacy) {
      setField("ownerPrivacy", {
        accepted: user.privacy.accepted === true,
        acceptedAt: user.privacy.acceptedAt ?? "",
        policyVersion: user.privacy.policyVersion ?? "v1",
      });
    }
  }, [user, setField]);

  /* =====================
     HARD GUARD
  ====================== */
  if (!user) {
    return (
      <section className={profileClasses.root}>
        <p>{t("profile.not_available")}</p>
      </section>
    );
  }
  const status = configuration?.status;

  const canStartVerification =
  status === "CONFIGURATION_IN_PROGRESS" ||
  status === "REJECTED";

/**
 * Step 2 DEVE essere possibile
 * finché la configuration NON è locked
 */
const canUploadBusinessDocs =
  status === "CONFIGURATION_IN_PROGRESS" ||
  status === "REJECTED";

  
  const isLocked =
    status === "CONFIGURATION_READY" ||
    status === "ACCEPTED";
  
  
  
  /* =====================
     RENDER
  ====================== */
  return (
    <section className={profileClasses.root}>
      {/* HEADER */}
      <header className={profileClasses.header}>
        <h1>{t("profile.title")}</h1>
        <p>{t("profile.subtitle")}</p>
      </header>

      <div className={profileClasses.card}>
  <h3>Stato profilo</h3>

  <div className={profileClasses.row}>
    <span className={profileClasses.label}>
      Stato verifica
    </span>

    <span className={profileClasses.value}>
      {status === "CONFIGURATION_IN_PROGRESS" &&
        "Profilo da verificare"}

      {status === "BUSINESS_READY" &&
        "Carica visura camerale"}

      {status === "CONFIGURATION_READY" &&
        "Documenti in verifica"}

      {status === "ACCEPTED" && "Profilo verificato"}

      {status === "REJECTED" &&
        "Verifica respinta — ricarica documenti"}
    </span>
  </div>

  {canStartVerification && (
    <button
      className="wd-btn wd-btn--primary wd-btn--sm"
      onClick={() => {
        setStep(1);
        setShowVerification(true);
      }}
    >
      Avvia verifica
    </button>
  )}

  {status === "CONFIGURATION_READY" && (
    <p className={profileClasses.verifyHint}>
      Stiamo verificando i tuoi documenti.
    </p>
  )}
</div>


      {/* VERIFICATION FLOW */}
      {showVerification && !isLocked && (
  <div className={profileClasses.card}>
    {step === 1 && canStartVerification && (
      <OwnerVerificationStep1
        data={data}
        setField={setField}
        onComplete={async () => {
       
          setStep(2);
        }}
      />
    )}

{step === 2 &&
  canUploadBusinessDocs &&
  data.configurationId &&
  data.ownerStepCompleted && (
    <OwnerVerificationStep2
      configurationId={data.configurationId}
      onCompleted={reloadProfile}
    />
)}

  </div>
)}

    </section>
  );
}


=== FILE: pages/you/profile/index.tsx
LANG: tsx
SIZE:      528 bytes
----------------------------------------
// ======================================================
// FE || USER DASHBOARD || PROFILE — INDEX
// ======================================================

import { useProfileContainer } from "./Profile.container";
import { ProfileView } from "./Profile.view";

export default function ProfilePage() {
  const {
    user,
    configuration,
    reloadProfile,
  } = useProfileContainer();

  return (
    <ProfileView
      user={user}
      configuration={configuration}
      reloadProfile={reloadProfile}
    />
  );
}


=== FILE: pages/you/profile/profile.classes.ts
LANG: ts
SIZE:     2409 bytes
----------------------------------------
// ======================================================
// FE || USER DASHBOARD || PROFILE — CLASSES
// ======================================================
//
// NOTE:
// - Retro-compatibile con Profile read-only
// - Esteso per Verification Flow (2 step)
// - Nomi semantici, niente duplicazioni
// ======================================================

export const profileClasses = {
  /* =========================
     PAGE
  ========================= */
  root: "profile-page",
  header: "profile-header",
  cta: "profile-cta",

  /* =========================
     CARD / SECTIONS
  ========================= */
  card: "profile-card",
  section: "profile-section",

  /* =========================
     ROWS (READ MODE)
  ========================= */
  row: "profile-row",
  label: "profile-label",
  value: "profile-value",

  /* =========================
     STATUS
  ========================= */
  statusComplete: "status-complete",
  statusVerified: "status-verified",
  statusDot: "status-dot",

  /* =========================
     VERIFICATION FLOW
  ========================= */
  verifyCta: "profile-verify-cta",
  verifyForm: "profile-verify-form",
  verifyHint: "profile-verify-hint",
  verifyActions: "profile-verify-actions",

  /* =========================
     FORM / EDIT MODE
  ========================= */
  formGrid: "form-grid",
  formRow: "profile-form-row",
  formLabel: "profile-form-label",
  formInput: "profile-form-input",
  /* =====================
     UPLOAD (STEP 2)
  ====================== */
  uploadGrid: "profile-upload-grid",
  uploadBox: "profile-upload-box",
  uploadImage: "profile-upload-image",
  /* =========================
     PRIVACY (READ-ONLY)
  ========================= */
  privacyHint: "profile-privacy-hint",
  privacyLink: "profile-privacy-link",

  /* =========================
     STEPS
  ========================= */
  stepIndicator: "profile-step-indicator",
  stepActive: "profile-step-active",
  stepCompleted: "profile-step-completed",

  /* =====================
   UPLOAD ACTIONS
===================== */
uploadDelete: "profile-upload-delete",
uploadRotate: "profile-upload-rotate",
uploadConfirm: "profile-upload-confirm",

/* =========================
   STATUS DOTS
========================= */

statusPending: "profile-status-pending",
statusAccepted: "profile-status-accepted",
statusRejected: "profile-status-rejected",


};


=== FILE: pages/you/profile/verification/Step1.tsx
LANG: tsx
SIZE:     9426 bytes
----------------------------------------
// ======================================================
// FE || PROFILE || VERIFICATION || STEP 1 — OWNER DATA + DOCS
// ======================================================
//
// RUOLO:
// - Compilazione dati anagrafici Owner
// - Upload documenti (fronte / retro)
// - Creazione OwnerDraft
// - Avvio verifica
//
// DOMINIO:
// - ConfigurationSetupDTO (CHIUSO)
// ======================================================

import type { ConfigurationSetupDTO } from
  "@src/shared/domain/user/configurator/configurationSetup.types";

import { t } from "@shared/aiTranslateGenerator";
import { profileClasses } from "../profile.classes";
import { useState } from "react";
import { createOwnerDraft } from "./owner-draft.functions";

import { uploadOwnerDocument } from "./owner-upload.functions";
import { normalizeOwnerAddress } from "./adrress-normalizer";
import type { ConfigurationSetField } from "./types";
import { getPromptImageUrl } from "@shared/utils/assets";



/* =====================
   PROPS
===================== */
interface Props {
  data: ConfigurationSetupDTO;
  setField: ConfigurationSetField;
  onComplete: () => Promise<void>;
}

/* ======================================================
   COMPONENT
====================================================== */
export function OwnerVerificationStep1({
  data,
  setField,
  onComplete,
}: Props) {
    
    const [uploads,setUploads] = useState<{
        front: boolean;
        back: boolean;
      }>({
        front: false,
        back: false,
      });

      const [selectedFiles, setSelectedFiles] = useState<{
        front?: File;
        back?: File;
      }>({});


      const [previews, setPreviews] = useState<{
        front?: string;
        back?: string;
      }>({});
      
  /* =====================
     SUBMIT
  ====================== */
  async function handleSubmit() {
    if (!data.ownerPrivacy.accepted) {
      alert("Devi accettare la privacy");
      return;
    }
  
    if (!data.configurationId) {
      alert("Configuration mancante");
      return;
    }
  
    if (!selectedFiles.front || !selectedFiles.back) {
      alert("Carica fronte e retro del documento");
      return;
    }
  
    const configurationId = data.configurationId;
  
    await createOwnerDraft({
      configurationId,
      firstName: data.ownerFirstName.trim(),
      lastName: data.ownerLastName.trim(),
      birthDate: data.ownerBirthDate || undefined,
      address: normalizeOwnerAddress(data.ownerAddress),
      contact: {
        secondaryMail: data.ownerSecondaryMail || undefined,
        phoneNumber: data.ownerPhone || undefined,
      },
      privacy: {
        accepted: true,
        acceptedAt: new Date().toISOString(),
        policyVersion: "v1",
        subject: "owner",
        source: "owner-form",
      },
    });
  
    await uploadOwnerDocument(
      configurationId,
      "front",
      selectedFiles.front
    );
  
    await uploadOwnerDocument(
      configurationId,
      "back",
      selectedFiles.back
    );
  
    // ⬅️ SOLO passaggio allo step 2
    await onComplete();
  // ✅ SEGNA STEP 1 COMPLETATO (FE ONLY)
    setField("ownerStepCompleted", true);
  }
  

  function handleSelect(
  side: "front" | "back",
  file?: File
) {
    
  if (!file) return;

  // preview immediata
  const previewUrl = URL.createObjectURL(file);
  setPreviews((p) => ({ ...p, [side]: previewUrl }));

  // memorizzo il File per il click su "Continua"
  setSelectedFiles((s) => ({ ...s, [side]: file }));

  // opzionale: reset check verde finché non fai upload reale
  setUploads((u) => ({ ...u, [side]: false }));
}

  /* =====================
     UPLOAD HANDLER
  ====================== 
  async function handleUpload(
    side: "front" | "back",
    file?: File
  ) {
    
    if (!file || !data.configurationId) return;

    // 🔍 ANTEPRIMA FE
  const previewUrl = URL.createObjectURL(file);
  setPreviews((p) => ({ ...p, [side]: previewUrl }));

  // ⬆️ UPLOAD BACKEND
  await uploadOwnerDocument(
    data.configurationId,
    side,
    file
  );

  // ✔ STATO UI
  setUploads((u) => ({ ...u, [side]: true }));
}
*/
  /* =====================
     RENDER
  ====================== */
  return (
    <>
      {/* ================= FORM ================= */}
      <div className={profileClasses.formGrid}>
        <Input
          label={t("profile.firstName")}
          value={data.ownerFirstName}
          onChange={(v) => setField("ownerFirstName", v)}
        />

        <Input
          label={t("profile.lastName")}
          value={data.ownerLastName}
          onChange={(v) => setField("ownerLastName", v)}
        />

        <Input
          type="date"
          label={t("profile.birthDate")}
          value={data.ownerBirthDate ?? ""}
          onChange={(v) => setField("ownerBirthDate", v)}
        />

        <Input
          type="email"
          label={t("profile.secondaryMail")}
          value={data.ownerSecondaryMail ?? ""}
          onChange={(v) => setField("ownerSecondaryMail", v)}
        />

        <Input
          label="Telefono"
          value={data.ownerPhone ?? ""}
          onChange={(v) => setField("ownerPhone", v)}
        />

        <Input
          label="Via"
          value={data.ownerAddress?.street ?? ""}
          onChange={(v) =>
            setField("ownerAddress", {
              ...data.ownerAddress,
              street: v,
            })
          }
        />

        <Input
          label="Numero civico"
          value={data.ownerAddress?.number ?? ""}
          onChange={(v) =>
            setField("ownerAddress", {
              ...data.ownerAddress,
              number: v,
            })
          }
        />

        <Input
          label="Città"
          value={data.ownerAddress?.city ?? ""}
          onChange={(v) =>
            setField("ownerAddress", {
              ...data.ownerAddress,
              city: v,
            })
          }
        />

        <Input
          label="Provincia"
          value={data.ownerAddress?.province ?? ""}
          onChange={(v) =>
            setField("ownerAddress", {
              ...data.ownerAddress,
              province: v,
            })
          }
        />

        <Input
          label="CAP"
          value={data.ownerAddress?.zip ?? ""}
          onChange={(v) =>
            setField("ownerAddress", {
              ...data.ownerAddress,
              zip: v,
            })
          }
        />
      </div>

    
      {/* ============ UPLOAD DOCUMENTI OWNER ============ */}
      <div className={profileClasses.uploadGrid}>
        {/* FRONTE */}
        <label
          className={`${profileClasses.uploadBox} ${
            
            uploads.front ? profileClasses.stepCompleted : ""
          }`}
        >
          <input
            type="file"
            hidden
            accept="image/*,.pdf"
            onChange={(e) =>
              handleSelect("front", e.target.files?.[0])
            }
          />
          <img
            src={ previews.front ??getPromptImageUrl("document-front")}
            className={profileClasses.uploadImage}
          />
          <span>
            Documento (fronte)
            {uploads.front && " ✔"}
          </span>
        </label>

        {/* RETRO */}
        <label
          className={`${profileClasses.uploadBox} ${
            uploads.back ? profileClasses.stepCompleted : ""
          }`}
        >
          <input
            type="file"
            hidden
            accept="image/*,.pdf"
            onChange={(e) =>
              handleSelect("back", e.target.files?.[0])
            }
          />
          <img
            src={ previews.back ??getPromptImageUrl("document-back")}
            className={profileClasses.uploadImage}
          />
          <span>
            Documento (retro)
            {uploads.back && " ✔"}
          </span>
        </label>
      </div>
      {/* ================= PRIVACY ================= */}
      <label className={profileClasses.privacyHint}>
        <input
          type="checkbox"
          checked={data.ownerPrivacy.accepted}
          onChange={(e) =>
            setField("ownerPrivacy", {
              accepted: e.target.checked,
              acceptedAt: e.target.checked
                ? new Date().toISOString()
                : "",
              policyVersion: "v1",
            })
          }
        />
        {t("profile.privacy.accepted")}
      </label>

      {/* ================= ACTIONS ================= */}
      <div className={profileClasses.verifyActions}>
        <button
          className="wd-btn wd-btn--primary"
          onClick={handleSubmit}
        >
          {t("profile.verify.next")}
        </button>
      </div>
    </>
  );
}

/* ======================================================
   INPUT HELPER (identico a Profile.view)
====================================================== */
function Input({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div className={profileClasses.formRow}>
      <label className={profileClasses.formLabel}>
        {label}
      </label>
      <input
        className={profileClasses.formInput}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}


=== FILE: pages/you/profile/verification/Step2.tsx
LANG: tsx
SIZE:     3193 bytes
----------------------------------------
import { useState } from "react";
import { profileClasses } from "../profile.classes";
import { uploadBusinessDocument } from "./business-upload.functions";
import { startVerification } from "./verification-functions";
import { getPromptImageUrl } from "@shared/utils/assets";

interface Props {
  configurationId: string;
  onCompleted: () => Promise<void>;
}

export function OwnerVerificationStep2({
  configurationId,
  onCompleted,
}: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [rotation, setRotation] =
    useState<0 | 90 | 180 | 270>(0);
  const [loading, setLoading] = useState(false);

  function handleSelect(file?: File) {
    if (!file) return;
    setFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setRotation(0);
  }

  function rotate() {
    setRotation(
      (r) => ((r + 90) % 360) as 0 | 90 | 180 | 270
    );
  }

  function reset() {
    setFile(null);
    setPreviewUrl(null);
    setRotation(0);
  }

  async function handleConfirm() {
    if (!file || loading) return;

    setLoading(true);

    try {
      await uploadBusinessDocument(configurationId, file);

      // ✅ QUI PARTE LA VERIFICA (UNICO PUNTO)
      await startVerification(configurationId);

      await onCompleted();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={profileClasses.uploadGrid}>
      <div className={profileClasses.uploadBox}>
        <input
          type="file"
          hidden
          id="business-doc"
          accept="application/pdf,image/*"
          onChange={(e) =>
            handleSelect(e.target.files?.[0])
          }
        />

        <label htmlFor="business-doc">
          {previewUrl ? (
            file?.type === "application/pdf" ? (
              <iframe
                src={previewUrl}
                className={profileClasses.uploadImage}
              />
            ) : (
              <img
                src={previewUrl}
                className={profileClasses.uploadImage}
                style={{
                  transform: `rotate(${rotation}deg)`,
                }}
              />
            )
          ) : (
            <img
              src={getPromptImageUrl("business-certificate")}
              className={profileClasses.uploadImage}
            />
          )}
        </label>

        {previewUrl && (
          <>
            {file?.type.startsWith("image/") && (
              <button
                className={profileClasses.uploadRotate}
                onClick={rotate}
              >
                Ruota
              </button>
            )}

            <button
              className={profileClasses.uploadDelete}
              onClick={reset}
            >
              Rimuovi
            </button>
          </>
        )}

        {file && (
          <button
            className="wd-btn wd-btn--primary wd-btn--sm"
            disabled={loading}
            onClick={handleConfirm}
          >
            {loading
              ? "Invio in corso…"
              : "Conferma e invia"}
          </button>
        )}
      </div>
    </div>
  );
}


=== FILE: pages/you/profile/verification/adrress-normalizer.ts
LANG: ts
SIZE:      540 bytes
----------------------------------------
import type { ConfigurationSetupDTO } from
  "@src/shared/domain/user/configurator/configurationSetup.types";

export function normalizeOwnerAddress(
  a: ConfigurationSetupDTO["ownerAddress"]
) {
  if (!a) return undefined;

  return {
    street: a.street?.trim() || undefined,
    number: a.number?.trim() || undefined,
    city: a.city?.trim() || undefined,
    province: a.province?.trim() || undefined,
    region: a.region?.trim() || undefined,
    zip: a.zip?.trim() || undefined,
    country: a.country?.trim() || "Italia",
  };
}


=== FILE: pages/you/profile/verification/business-upload.functions.ts
LANG: ts
SIZE:      521 bytes
----------------------------------------
import { API_BASE } from "@src/shared/lib/config";


export async function uploadBusinessDocument(
    configurationId: string,
    file: File
  ) {
    const form = new FormData();
    form.append("file", file);
    form.append("configurationId", configurationId);
  
    const res = await fetch(
      `${API_BASE}/api/business/document/upload`,
      {
        method: "POST",
        body: form,
        credentials: "include",
      }
    );
  
    if (!res.ok) {
      throw new Error("UPLOAD_FAILED");
    }
  }
  

=== FILE: pages/you/profile/verification/index.ts
LANG: ts
SIZE:      183 bytes
----------------------------------------
export * from "./owner-draft.functions";
export * from "./owner-upload.functions";
export * from "./verification-functions";
export * from "./Step1.tsx";
export * from "./Step2.tsx";


=== FILE: pages/you/profile/verification/owner-draft.functions.ts
LANG: ts
SIZE:      478 bytes
----------------------------------------
// ======================================================
// FE || PROFILE || OWNER DRAFT
// ======================================================

import { apiFetch } from "@shared/lib/api";

export async function createOwnerDraft(payload: any) {
  const res = await apiFetch<{ ok: boolean }>(
    "/api/owner/create-draft",
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );

  if (!res?.ok) {
    throw new Error("OWNER_DRAFT_CREATE_FAILED");
  }
}


=== FILE: pages/you/profile/verification/owner-upload.functions.ts
LANG: ts
SIZE:     1067 bytes
----------------------------------------
// ======================================================
// FE || PROFILE || OWNER DOCUMENT UPLOAD (MULTIPART)
// ======================================================
//
// FLOW:
// - POST multipart/form-data al backend
// - NESSUN presigned URL
// ======================================================

import { API_BASE } from "@src/shared/lib/config";


export async function uploadOwnerDocument(
  configurationId: string,
  side: "front" | "back",
  file: File
) {
  if (!configurationId) {
    throw new Error("MISSING_CONFIGURATION_ID");
  }

  const form = new FormData();
  form.append("file", file);
  form.append("side", side);
  form.append("configurationId", configurationId);

  const res = await fetch(
    `${API_BASE}/api/owner/document/upload`,
    {
      method: "POST",
      body: form,
      credentials: "include",
    }
  );

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg || "UPLOAD_FAILED");
  }

  const json = await res.json();
  if (!json?.ok) {
    throw new Error(json?.error ?? "UPLOAD_FAILED");
  }
}


=== FILE: pages/you/profile/verification/types.ts
LANG: ts
SIZE:      592 bytes
----------------------------------------
// ======================================================
// SHARED || DOMAIN || CONFIGURATION || SET FIELD TYPE
// ======================================================
//
// RUOLO:
// - Tipo canonico per setField
// - Usato da componenti FE che operano su ConfigurationSetupDTO
//
// ======================================================

import type { ConfigurationSetupDTO } from "@src/shared/domain/user/configurator/configurationSetup.types";

export type ConfigurationSetField =
  <K extends keyof ConfigurationSetupDTO>(
    key: K,
    value: ConfigurationSetupDTO[K]
  ) => void;


=== FILE: pages/you/profile/verification/verification-functions.ts
LANG: ts
SIZE:     1083 bytes
----------------------------------------
// ======================================================
// FE || PROFILE || VERIFICATION || ORCHESTRATOR
// ======================================================
//
// RUOLO:
// - UNICO punto che avvia la verifica
// - Chiamato SOLO dopo step 2 completato
//
// ======================================================

import { apiFetch } from "@shared/lib/api";

export async function startVerification(
  configurationId: string
) {
  if (!configurationId) {
    throw new Error("MISSING_CONFIGURATION_ID");
  }

  // 1️⃣ attach owner → configuration
  await apiFetch(
    "/api/business/configuration/attach-owner",
    {
      method: "POST",
      body: JSON.stringify({ configurationId }),
    }
  );

  // 2️⃣ init owner verification
  await apiFetch(
    "/api/owner/verification/init",
    {
      method: "POST",
      body: JSON.stringify({ configurationId }),
    }
  );

  // 3️⃣ init business verification
  await apiFetch(
    "/api/business/verification/init",
    {
      method: "POST",
      body: JSON.stringify({ configurationId }),
    }
  );
}


=== FILE: pages/you/settings/cookies.tsx
LANG: tsx
SIZE:      611 bytes
----------------------------------------
// ======================================================
// FE || pages/user/dashboard/[id]/payments/index.tsx
// ======================================================
//
// AI-SUPERCOMMENT — USER PAYMENTS AREA (PLACEHOLDER)
//
// RUOLO:
// - Entry point sezione pagamenti utente
//
// SOURCE OF TRUTH:
// - Backend (orders / payments)
//
// COSA FA:
// - NIENTE (placeholder)
//
// COSA NON FA:
// - NON effettua fetch
// - NON mostra dati
//
// INVARIANTI:
// - Accessibile solo da dashboard autenticata
//
// NOTE:
// - Implementazione futura
//
// ======================================================


=== FILE: pages/you/settings/password.tsx
LANG: tsx
SIZE:      611 bytes
----------------------------------------
// ======================================================
// FE || pages/user/dashboard/[id]/payments/index.tsx
// ======================================================
//
// AI-SUPERCOMMENT — USER PAYMENTS AREA (PLACEHOLDER)
//
// RUOLO:
// - Entry point sezione pagamenti utente
//
// SOURCE OF TRUTH:
// - Backend (orders / payments)
//
// COSA FA:
// - NIENTE (placeholder)
//
// COSA NON FA:
// - NON effettua fetch
// - NON mostra dati
//
// INVARIANTI:
// - Accessibile solo da dashboard autenticata
//
// NOTE:
// - Implementazione futura
//
// ======================================================


=== FILE: pages/you/settings/plan.tsx
LANG: tsx
SIZE:      611 bytes
----------------------------------------
// ======================================================
// FE || pages/user/dashboard/[id]/payments/index.tsx
// ======================================================
//
// AI-SUPERCOMMENT — USER PAYMENTS AREA (PLACEHOLDER)
//
// RUOLO:
// - Entry point sezione pagamenti utente
//
// SOURCE OF TRUTH:
// - Backend (orders / payments)
//
// COSA FA:
// - NIENTE (placeholder)
//
// COSA NON FA:
// - NON effettua fetch
// - NON mostra dati
//
// INVARIANTI:
// - Accessibile solo da dashboard autenticata
//
// NOTE:
// - Implementazione futura
//
// ======================================================


=== FILE: pages/you/settings/privacy.tsx
LANG: tsx
SIZE:      611 bytes
----------------------------------------
// ======================================================
// FE || pages/user/dashboard/[id]/payments/index.tsx
// ======================================================
//
// AI-SUPERCOMMENT — USER PAYMENTS AREA (PLACEHOLDER)
//
// RUOLO:
// - Entry point sezione pagamenti utente
//
// SOURCE OF TRUTH:
// - Backend (orders / payments)
//
// COSA FA:
// - NIENTE (placeholder)
//
// COSA NON FA:
// - NON effettua fetch
// - NON mostra dati
//
// INVARIANTI:
// - Accessibile solo da dashboard autenticata
//
// NOTE:
// - Implementazione futura
//
// ======================================================


=== FILE: pages/you/settings/profile.tsx
LANG: tsx
SIZE:      611 bytes
----------------------------------------
// ======================================================
// FE || pages/user/dashboard/[id]/payments/index.tsx
// ======================================================
//
// AI-SUPERCOMMENT — USER PAYMENTS AREA (PLACEHOLDER)
//
// RUOLO:
// - Entry point sezione pagamenti utente
//
// SOURCE OF TRUTH:
// - Backend (orders / payments)
//
// COSA FA:
// - NIENTE (placeholder)
//
// COSA NON FA:
// - NON effettua fetch
// - NON mostra dati
//
// INVARIANTI:
// - Accessibile solo da dashboard autenticata
//
// NOTE:
// - Implementazione futura
//
// ======================================================


=== FILE: sidebar/Sidebar.container.tsx
LANG: tsx
SIZE:     6311 bytes
----------------------------------------
// ======================================================
// FE || USER DASHBOARD || SIDEBAR CONTAINER
// ======================================================
//
// INVARIANTI:
// - Sidebar configuration-centric
// - Workspace = Configuration
// - Preview vive nel Workspace
// - Business è derivato (non prerequisito)
// ======================================================

import { useMemo } from "react";
import { useParams } from "react-router-dom";

import { SidebarView } from "./Sidebar.view";
import type { SidebarSectionVM } from "./Sidebar.types";

import { useMyConfigurations } from
  "../configurator/base_configuration/configuration/useMyConfigurations";
import { useActiveProductsWithOptions } from
  "../configurator/base_configuration/configuration/useActiveProducts";

export default function SidebarContainer() {
  /* =========================
     ROUTE CONTEXT
  ========================= */
  const { businessId } = useParams<{
    businessId?: string;
    configurationId?: string;
  }>();

  /* =========================
     DATA HOOKS
  ========================= */
  const { items: configurations = [] } = useMyConfigurations();
  const { products = [] } = useActiveProductsWithOptions();

  /* =========================
     CONFIGURATION VISIBILITY
     - Workspace / Preview
     - Escludiamo solo stati terminali
  ========================= */
  const workspaceConfigurations = useMemo(
    () =>
      configurations.filter(
        (c) =>
          c.status !== "CANCELLED" &&
          c.status !== "ARCHIVED"
      ),
    [configurations]
  );

  /* =========================
     CONFIGURATION DRAFTS
  ========================= */
  const configurationDrafts = useMemo(
    () => configurations.filter((c) => c.status === "DRAFT"),
    [configurations]
  );

  /* =========================
     NAME MAP (Configuration)
  ========================= */
  const configurationNameById = useMemo(() => {
    const map = new Map<string, string>();
    configurations.forEach((c) => {
      map.set(
        c.id,
        c.prefill?.businessName ?? "Attività"
      );
    });
    return map;
  }, [configurations]);

  /* =========================
     BUSINESS DERIVATION
     - Un business esiste solo se c’è un businessId
  ========================= */
  const firstWorkspaceId = workspaceConfigurations[0]?.id;

  const verificationTargetId =
    businessId ?? firstWorkspaceId;

  const verificationTo = verificationTargetId
    ? `/user/dashboard/business/${verificationTargetId}`
    : "/user/dashboard/configurator";

  /* =========================
     VIEW MODEL
  ========================= */
  const sections: SidebarSectionVM[] = [
    /* ===== YOU ===== */
    {
      titleKey: "sidebar.section.you",
      titleTo: "/user/dashboard/you",
      items: [
        {
          to: "/user/dashboard/you/profile",
          labelKey: "sidebar.you.profile",
        },
        {
          to: "/user/dashboard/you/account",
          labelKey: "sidebar.you.account",
        },
        {
          to: verificationTo,
          labelKey: "sidebar.you.verification",
        },
      ],
    },

    /* ===== BUSINESS ===== */
    {
      titleKey: "sidebar.section.business",
      titleTo: businessId
        ? `/user/dashboard/business/${businessId}`
        : undefined,
      items: businessId
        ? [
            {
              to: `/user/dashboard/business/${businessId}`,
              labelKey: "sidebar.business.overview",
            },
            {
              to: `/user/dashboard/business/${businessId}/settings`,
              labelKey: "sidebar.business.settings",
            },
          ]
        : [
            {
              to: "#",
              labelKey: "sidebar.business.empty",
              disabled: true,
            },
          ],
    },

    /* ===== WORKSPACE (CONFIGURATION) ===== */
    {
      titleKey: "sidebar.section.workspace",
      items:
        workspaceConfigurations.length > 0
          ? workspaceConfigurations.map((c) => ({
              to: `/user/dashboard/workspace/${c.id}`,
              labelKey:
                configurationNameById.get(c.id) ??
                "sidebar.workspace.site",
            }))
          : [
              {
                to: "#",
                labelKey: "sidebar.workspace.empty",
                disabled: true,
              },
            ],
    },

    /* ===== PREVIEW ===== */
    {
      titleKey: "sidebar.section.preview",
      items:
        workspaceConfigurations.length > 0
          ? workspaceConfigurations.map((c) => ({
              to: `/user/dashboard/workspace/${c.id}/preview`,
              labelKey:
                configurationNameById.get(c.id) ??
                "sidebar.preview.site",
            }))
          : [
              {
                to: "#",
                labelKey: "sidebar.preview.empty",
                disabled: true,
              },
            ],
    },

    /* ===== CONFIGURATIONS (DRAFTS) ===== */
    {
      titleKey: "sidebar.section.configurations",
      titleTo: "/user/dashboard/configurator",
      items:
        configurationDrafts.length > 0
          ? configurationDrafts.map((c) => ({
              to:
                `/user/dashboard/configurator/${c.id}`,
              labelKey:
                configurationNameById.get(c.id) ??
                "sidebar.config.default",
            }))
          : [
              {
                to: "/solution",
                labelKey: "sidebar.config.start",
              },
            ],
    },

    /* ===== PLANS ===== */
    {
      titleKey: "sidebar.section.plans",
      items:
        products.length > 0
          ? products.map(() => ({
              to: "#",
              labelKey: "sidebar.plans.empty",
              disabled: true,
            }))
          : [
              {
                to: "#",
                labelKey: "sidebar.plans.empty",
                disabled: true,
              },
            ],
    },

    /* ===== SETTINGS ===== */
    {
      titleKey: "sidebar.section.settings",
      items: [
        {
          to: "/user/dashboard/settings",
          labelKey: "sidebar.settings.disabled",
          disabled: true,
        },
      ],
    },
  ];

  return <SidebarView sections={sections} />;
}

=== FILE: sidebar/Sidebar.types.ts
LANG: ts
SIZE:      524 bytes
----------------------------------------
// ======================================================
// FE || USER DASHBOARD || SIDEBAR TYPES
// ======================================================
//
// RUOLO:
// - ViewModel puro
// - Nessun testo hardcoded
// - i18n-ready
// ======================================================

export type SidebarLinkVM = {
  to: string;
  labelKey: string;
  disabled?: boolean;
};

export type SidebarSectionVM = {
  titleKey: string;

  // 🧭 route opzionale del titolo
  titleTo?: string;

  items: SidebarLinkVM[];
};


=== FILE: sidebar/Sidebar.view.tsx
LANG: tsx
SIZE:     2095 bytes
----------------------------------------
// ======================================================
// FE || USER DASHBOARD || SIDEBAR VIEW
// ======================================================
//
// RUOLO:
// - Rendering puro Sidebar
// - Nessuna logica business
//
// INVARIANTI:
// - Usa solo ViewModel (VM)
// - Usa solo classi centralizzate
// - Testo risolto tramite i18n centrale (aiTranslateGenerator)
// ======================================================

import { NavLink } from "react-router-dom";
import { type SidebarSectionVM } from "./Sidebar.types";
import { sidebarClasses } from "./sidebar.classes";
import { t } from "@shared/aiTranslateGenerator";

export function SidebarView({
  sections,
}: {
  sections: SidebarSectionVM[];
}) {
  return (
    <aside className={sidebarClasses.root}>
      {sections.map((section) => (
        <div
          key={section.titleKey}
          className={sidebarClasses.section}
        >
<h4 className={sidebarClasses.title}>
  {section.titleTo ? (
    <NavLink
      to={section.titleTo}
      className={sidebarClasses.titleLink}
    >
      {t(section.titleKey)}
    </NavLink>
  ) : (
    t(section.titleKey)
  )}
</h4>


          <ul className={sidebarClasses.list}>
            {section.items.map((item) => (
              <li
                key={item.to + item.labelKey}
                className={sidebarClasses.item}
              >
                {item.disabled ? (
                  <span
                    className={`${sidebarClasses.link} ${sidebarClasses.linkDisabled}`}
                  >
                    {t(item.labelKey)}
                  </span>
                ) : (
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      `${sidebarClasses.link} ${
                        isActive ? sidebarClasses.linkActive : ""
                      }`
                    }
                  >
                    {t(item.labelKey)}
                  </NavLink>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </aside>
  );
}


=== FILE: sidebar/sidebar.classes.ts
LANG: ts
SIZE:      477 bytes
----------------------------------------
/* ======================================================
   FE || USER DASHBOARD || SIDEBAR CLASSES
   ====================================================== */

   export const sidebarClasses = {
    root: "dashboard-sidebar",
  
    section: "sidebar-section",
    title: "sidebar-title",
  
    list: "sidebar-list",
    item: "sidebar-item",
  
    link: "sidebar-link",
    linkActive: "active",
    linkDisabled: "disabled",
    titleLink: "sidebar-title-link",

  };
  

=== FILE: workspace/business/business.card.tsx
LANG: tsx
SIZE:        0 bytes
----------------------------------------


=== FILE: workspace/business/business.list.tsx
LANG: tsx
SIZE:      385 bytes
----------------------------------------
// ======================================================
// DEPRECATED — BUSINESS WORKSPACE (OBSOLETO)
// ======================================================
//
// Questo file è mantenuto solo per evitare errori TS.
// Il Workspace è ora configuration-centric.
// ======================================================

export default function BusinessList() {
  return null;
}

=== FILE: workspace/business/index.tsx
LANG: tsx
SIZE:      224 bytes
----------------------------------------
// ======================================================
// DEPRECATED — BUSINESS WORKSPACE ENTRY
// ======================================================

export default function WorkspaceByBusiness() {
  return null;
}

=== FILE: workspace/index.tsx
LANG: tsx
SIZE:      309 bytes
----------------------------------------
import WorkspaceShell from "./workspace.shell";
import WorkspaceSidebar from "./workspace.sidebar";
import WorkspacePreview from "./site-preview";

export default function WorkspaceIndex() {
  return (
    <WorkspaceShell
      sidebar={<WorkspaceSidebar />}
      preview={<WorkspacePreview />}
    />
  );
}

=== FILE: workspace/site-preview/configurationPreview.dto.ts
LANG: ts
SIZE:     1176 bytes
----------------------------------------
// ======================================================
// SHARED || DTO || CONFIGURATION PREVIEW
// PATH: src/shared/dto/configurationPreview.dto.ts
// ======================================================
//
// RUOLO:
// - Contratto BE → FE per la PREVIEW di una Configuration
// - Usato ESCLUSIVAMENTE dal Workspace / Preview
//
// INVARIANTI:
// - Read-only
// - Canvas già buildato (engine-ready)
// - Nessuna logica FE
// ======================================================

import type { EngineCanvas } from
  "@src/user/workspace/tools/webyDevEngine/developerEngine/engine.schema.fe";

/**
 * Modalità di preview
 * - preview: editor / workspace
 * - live: simulazione sito pubblico
 */
export type ConfigurationPreviewMode =
  | "preview"
  | "live";

/**
 * DTO principale Preview
 */
export type ConfigurationPreviewDTO = {
  /**
   * ID configurazione
   */
  configurationId: string;

  /**
   * Modalità preview
   */
  mode: ConfigurationPreviewMode;

  /**
   * Canvas generato dall’engine
   * (Source of Truth UI)
   */
  canvas: EngineCanvas;

  /**
   * Timestamp generazione preview
   * (debug / invalidation)
   */
  generatedAt: string;
};

=== FILE: workspace/site-preview/index.tsx
LANG: tsx
SIZE:      286 bytes
----------------------------------------
// ======================================================
// FE || WORKSPACE PREVIEW — ROUTE ENTRY
// ======================================================

import SiteContainer from "./site.container";

export default function WorkspacePreviewPage() {
  return <SiteContainer />;
}


=== FILE: workspace/site-preview/site-loader.ts
LANG: ts
SIZE:     1000 bytes
----------------------------------------
// ======================================================
// FE || WORKSPACE PREVIEW — CONFIGURATION LOADER
// ======================================================

import { useEffect, useState } from "react";
import type { EngineInput } from
  "@src/user/workspace/tools/webyDevEngine/developerEngine/engine.types";
import { apiFetch } from "@shared/lib/api";

export function useConfigurationPreview(
  configurationId: string | null
) {
  const [data, setData] = useState<EngineInput | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!configurationId) return;

    setLoading(true);
    setError(null);

    apiFetch<EngineInput>(
      `/api/configuration/${configurationId}/preview`
    )
      .then(setData)
      .catch(() =>
        setError("Errore caricamento anteprima")
      )
      .finally(() => setLoading(false));
  }, [configurationId]);

  return { data, loading, error };
}

=== FILE: workspace/site-preview/site-preview.css
LANG: css
SIZE:     3518 bytes
----------------------------------------
/* ======================================================
   PALETTE: CORPORATE (SEMANTICA)
   ====================================================== */

   .palette-corporate {
    --color-primary: #0f766e;
    --color-secondary: #5eead4;
  
    --color-bg-page: #ffffff;
    --color-bg-surface: #f8fafc;
  
    --color-text-main: #020617;
    --color-text-muted: #64748b;
  
    --color-border: #e2e8f0;
  }
  
  /* ======================================================
     ROOT PREVIEW (DASHBOARD FEEL)
     ====================================================== */
  
  .workspace-site-preview {
    background-color: var(--color-bg-page);
    color: var(--color-text-main);
    min-height: 100%;
  }
  
  /* ======================================================
     STYLE: ELEGANT (SOBRIO)
     ====================================================== */
  
  .style-elegant {
    font-family: "Georgia", "Times New Roman", serif;
    letter-spacing: 0.015em;
  }
  
  .style-elegant h1,
  .style-elegant h2,
  .style-elegant h3 {
    font-weight: 500;
    color: var(--color-text-main);
  }
  
  .style-elegant section {
    padding: 3rem 2rem;
    background-color: transparent;
  }
  
  /* ======================================================
     NAVBAR (UNICO BLOCCO COLORATO)
     ====================================================== */
  
  .palette-corporate .navbar {
    background-color: var(--color-primary);
    border-bottom: 1px solid rgba(255, 255, 255, 0.25);
  }
  
  .palette-corporate .navbar a {
    color: #ffffff;
    text-decoration: none;
    font-weight: 500;
  }
  
  .palette-corporate .navbar a:hover {
    text-decoration: underline;
  }
  
  /* ======================================================
     HERO (CHIARO, ISTITUZIONALE)
     ====================================================== */
  
  .palette-corporate .hero {
    background-color: var(--color-bg-surface);
    color: var(--color-text-main);
  }
  
  .palette-corporate .hero h1 {
    max-width: 900px;
    margin: 0 auto;
  }
  
  /* ======================================================
     CONTENT SECTIONS
     ====================================================== */
  
  .palette-corporate .activity h2 {
    color: var(--color-primary);
  }
  
  .palette-corporate .description {
    color: var(--color-text-muted);
    max-width: 820px;
  }
  
  /* ======================================================
     GALLERY PLACEHOLDER (NEUTRO)
     ====================================================== */
  
  .palette-corporate .gallery-placeholder {
    background: var(--color-bg-surface);
    border: 1px dashed var(--color-border);
    color: var(--color-text-muted);
    padding: 2rem;
    text-align: center;
    border-radius: 8px;
  }
  
  /* ======================================================
     FOOTER (PULITO, NON INVADENTE)
     ====================================================== */
  
  .palette-corporate .footer {
    background-color: var(--color-bg-surface);
    border-top: 1px solid var(--color-border);
    color: var(--color-text-muted);
  }
  
  .palette-corporate .footer a {
    color: var(--color-primary);
  }
  .workspace-preview-empty,
.workspace-preview-loading,
.workspace-preview-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  height: 100%;
  background: #f8fafc;
  color: #475569;

  text-align: center;
  padding: 2rem;
}

.workspace-preview-empty h3 {
  margin-bottom: 0.5rem;
  font-weight: 600;
}

=== FILE: workspace/site-preview/site.adapter.ts
LANG: ts
SIZE:     1935 bytes
----------------------------------------
// ======================================================
// FE || WORKSPACE PREVIEW — SITE ADAPTER
// ======================================================
//
// RUOLO:
// - Adattare BusinessDraftPreview → EngineInput
//
// INVARIANTI:
// - Funzione pura
// - Nessun fetch / store
// - Nessun side effect
// - Nessuna normalizzazione (già fatta a monte)
// ======================================================

import type { EngineInput } from
  "@src/user/workspace/tools/webyDevEngine/developerEngine/engine.types";
import type { LayoutKVDTO } from
  "@src/user/workspace/tools/webyDevEngine/configurationLayout/layout.dto";
import type { LayoutStyle } from
  "@src/user/workspace/tools/webyDevEngine/configurationLayout/style.dto";
import type { ColorPaletteId } from
  "@src/user/workspace/tools/webyDevEngine/configurationLayout/palette.dto";

import { slugify } from "@shared/utils/slugify";
import type { OpeningHoursFE } from
  "@shared/domain/business/openingHours.types";

/* =====================
   INPUT TYPES
===================== */
type BusinessDraftPreview = {
  name: string;
  sector?: string;
  address?: string;
  openingHours?: OpeningHoursFE;
};

type AdapterInput = {
  configurationId: string;
  business: BusinessDraftPreview;

  layout: LayoutKVDTO;
  style: LayoutStyle;
  palette: ColorPaletteId;
};

/* =====================
   ADAPTER
===================== */
export function adaptBusinessDraftToEngineInput(
  input: AdapterInput
): EngineInput {
  const { configurationId, business, layout, style, palette } = input;

  return {
    configurationId,

    business: {
      name: business.name,
      slug: slugify(business.name),

      // 🔹 semantica business
      sector: business.sector ?? "generic",
      address: business.address ?? "",

      // 🔹 dati strutturati (usati dai renderer)
      openingHours: business.openingHours,
    },

    layout,
    style,
    palette,
  };
}

=== FILE: workspace/site-preview/site.classes.ts
LANG: ts
SIZE:      235 bytes
----------------------------------------
// ======================================================
// FE || WORKSPACE PREVIEW — CLASS REGISTRY
// ======================================================

export const siteClasses = {
    root: "workspace-site-preview",
  };
  

=== FILE: workspace/site-preview/site.container.tsx
LANG: tsx
SIZE:     1223 bytes
----------------------------------------
// ======================================================
// FE || WORKSPACE PREVIEW — CONTAINER
// ======================================================

import { useMemo } from "react";
import { useWorkspaceState } from "../workspace.state";
import { useConfigurationPreview } from "./site-loader";
import { buildCanvas } from
  "@src/user/workspace/tools/webyDevEngine/developerEngine/engine.builder";
import SiteView from "./site.view";

export default function SiteContainer() {
  const { activeConfigurationId } = useWorkspaceState();

  const { data, loading, error } =
    useConfigurationPreview(activeConfigurationId);

  const canvas = useMemo(() => {
    if (!data) return null;
    return buildCanvas(data);
  }, [data]);

  if (!activeConfigurationId) {
    return (
      <div className="workspace-preview-empty">
        <h3>Nessuna configurazione selezionata</h3>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="workspace-preview-loading">
        Caricamento…
      </div>
    );
  }

  if (error) {
    return (
      <div className="workspace-preview-error">
        {error}
      </div>
    );
  }

  if (!canvas) return null;

  return <SiteView canvas={canvas} />;
}

=== FILE: workspace/site-preview/site.context.ts
LANG: ts
SIZE:      226 bytes
----------------------------------------
export type WorkspacePreviewMode =
  | "preview"   // editing
  | "live";     // sito pubblico simulato

export type WorkspacePreviewContext = {
  businessId: string;
  configurationId: string;
  mode: WorkspacePreviewMode;
};

=== FILE: workspace/site-preview/site.normalizer.ts
LANG: ts
SIZE:     1333 bytes
----------------------------------------
// ======================================================
// FE || WORKSPACE PREVIEW — NORMALIZERS
// ======================================================
//
// RUOLO:
// - Allineare stringhe libere → union tipizzate
// - Evitare crash engine
// - Centralizzare fallback
// ======================================================

import type { LayoutStyle } from
  "@src/user/workspace/tools/webyDevEngine/configurationLayout/style.dto";

import type { ColorPaletteId } from
  "@src/user/workspace/tools/webyDevEngine/configurationLayout/palette.dto";

import { LAYOUT_STYLES } from
  "@src/user/workspace/tools/webyDevEngine/configurationLayout/style.dto";

import { COLOR_PRESETS } from
  "@src/user/workspace/tools/webyDevEngine/configurationLayout/palette.dto";

/* =========================
   STYLE
========================= */
export function normalizeLayoutStyle(
  value?: string
): LayoutStyle {
  const ids = LAYOUT_STYLES.map(s => s.id);
  return ids.includes(value as LayoutStyle)
    ? (value as LayoutStyle)
    : "elegant";
}

/* =========================
   PALETTE
========================= */
export function normalizePalette(
  value?: string
): ColorPaletteId {
  const ids = COLOR_PRESETS.map(p => p.id);
  return ids.includes(value as ColorPaletteId)
    ? (value as ColorPaletteId)
    : "corporate";
}


=== FILE: workspace/site-preview/site.types.ts
LANG: ts
SIZE:      296 bytes
----------------------------------------
// ======================================================
// FE || WORKSPACE PREVIEW — LOCAL TYPES
// ======================================================

export type SitePreviewMode = "live" | "preview";

export type SitePreviewContext = {
  businessId: string;
  mode: SitePreviewMode;
};


=== FILE: workspace/site-preview/site.view.tsx
LANG: tsx
SIZE:     1152 bytes
----------------------------------------
// ======================================================
// FE || WORKSPACE PREVIEW — SITE VIEW
// ======================================================
//
// RUOLO:
// - Renderizzare il sito come fosse pubblico
//
// INVARIANTI:
// - NO fetch
// - NO store
// - NO side effect
// - Classi CSS SEMPRE determinate
// ======================================================

import { EnginePreview } from
  "@src/user/workspace/tools/webyDevEngine/EnginePreview";
import type { EngineCanvas } from
  "@src/user/workspace/tools/webyDevEngine/developerEngine/engine.schema.fe";
import { siteClasses as cls } from "./site.classes";
import "./site-preview.css";

type Props = {
  canvas: EngineCanvas;
};

export default function SiteView({ canvas }: Props) {
  const styleClass = canvas.meta.styleId
    ? `style-${canvas.meta.styleId}`
    : "style-default";

  const paletteClass = canvas.meta.paletteId
    ? `palette-${canvas.meta.paletteId}`
    : "palette-default";

  return (
    <div
      className={[
        cls.root,
        styleClass,
        paletteClass,
      ].join(" ")}
    >
      <EnginePreview canvas={canvas} />
    </div>
  );
}

=== FILE: workspace/site-preview/useConfigurationPreview.ts
LANG: ts
SIZE:     1636 bytes
----------------------------------------
// ======================================================
// FE || PREVIEW || useConfigurationPreview
// PATH: src/user/workspace/site-preview/useConfigurationPreview.ts
// ======================================================
//
// RUOLO:
// - Caricare la PREVIEW di una Configuration
// - Read-only
// - Nessuna mutazione
//
// INVARIANTI:
// - Usa SOLO configurationId
// - Usa apiFetch (standard WebOnDay)
// - Ritorna dati sempre null-safe
// ======================================================

import { useEffect, useState } from "react";

import { apiFetch } from "@src/shared/lib/api";
import type { ConfigurationPreviewDTO } from "./configurationPreview.dto";

export function useConfigurationPreview(
  configurationId?: string
) {
  const [preview, setPreview] =
    useState<ConfigurationPreviewDTO | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!configurationId) {
      setPreview(null);
      return;
    }

    let alive = true;

    setLoading(true);
    setError(null);

    apiFetch<ConfigurationPreviewDTO>(
      `/api/configuration/${configurationId}/preview`
    )
      .then((data) => {
        if (!alive) return;
        setPreview(data);
      })
      .catch(() => {
        if (!alive) return;
        setError("Errore caricamento anteprima");
        setPreview(null);
      })
      .finally(() => {
        if (!alive) return;
        setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [configurationId]);

  return {
    preview,
    loading,
    error,
  };
}

=== FILE: workspace/tools/cms/cms.panel.tsx
LANG: tsx
SIZE:       73 bytes
----------------------------------------
export default function CMSPanel() {
    return <div>CMS panel</div>;
  }

=== FILE: workspace/tools/design/design.panel.tsx
LANG: tsx
SIZE:      115 bytes
----------------------------------------
// tools/design/design.panel.tsx
export default function DesignPanel() {
    return <div>Design Panel</div>;
  }
  

=== FILE: workspace/tools/layout_mock/layouts.mock.ts
LANG: ts
SIZE:      762 bytes
----------------------------------------
import type { LayoutKVDTO } from "@src/user/workspace/tools/webyDevEngine/configurationLayout/layout.dto";

export const AVAILABLE_LAYOUTS: LayoutKVDTO[] = [
  {
    id: "layout-landing-essential",
    version: "1",
    name: "Landing Essential",
    description: "Landing page singola",
    supportedStyles: ["modern", "elegant", "minimal", "bold"],
    supportedPalettes: ["warm", "dark", "light", "pastel", "corporate"],
    structure: {
      navbar: true,
      hero: true,
      sections: ["gallery", "contact", "map"],
      footer: true,
    },
    bindings: {
      businessName: true,
      logo: false,
      address: true,
      phone: true,
      services: true,
    },
    render: {
      inlineCss: false,
      previewBlur: false,
    },
  },
];


=== FILE: workspace/tools/upload/upload.panel.tsx
LANG: tsx
SIZE:       79 bytes
----------------------------------------
export default function UploadPanel() {
    return <div>Upload Panel</div>;
  }

=== FILE: workspace/tools/webyDevEngine/EnginePreview.tsx
LANG: tsx
SIZE:     1891 bytes
----------------------------------------
// ======================================================
// FE || DEVELOPER ENGINE — ENGINE PREVIEW
// ======================================================

import type { EngineCanvas } from "./developerEngine/engine.schema.fe";

import { NavbarRenderer } from "./sections/NavbarRenderer";
import { HeroRenderer } from "./sections/HeroRenderer";
import { GalleryRenderer } from "./sections/GalleryRenderer";
import { ActivityRenderer } from "./sections/ActivityRenderer";
import { DescriptionRenderer } from "./sections/DescriptionRenderer";
import { LocationRenderer } from "./sections/LocationRenderer";
import { FooterRenderer } from "./sections/FooterRenderer";
import { OpeningHoursRenderer } from "./sections/OpeningHourRenderer";

type Props = {
  canvas: EngineCanvas;
};

export function EnginePreview({ canvas }: Props) {
  const sections = canvas.layout.sections;

  return (
    <>
      {sections.map((section, index) => {
        switch (section.type) {
          case "navbar":
            return <NavbarRenderer key={index} {...section} />;

          case "hero":
            return <HeroRenderer key={index} {...section} />;

          case "gallery":
            return <GalleryRenderer key={index} {...section} />;

          case "activity":
            return <ActivityRenderer key={index} {...section} />;

          case "description":
            return <DescriptionRenderer key={index} {...section} />;

          case "opening-hours":
            return (
              <OpeningHoursRenderer
                key={index}
                openingHours={section.data}
              />
            );

          case "location":
            return <LocationRenderer key={index} {...section} />;

          case "footer":
            return <FooterRenderer key={index} {...section} />;

          default:
            return null;
        }
      })}
    </>
  );
}

=== FILE: workspace/tools/webyDevEngine/configurationLayout/layout.dto.ts
LANG: ts
SIZE:     1857 bytes
----------------------------------------
// ======================================================
// FE || CONFIGURATION LAYOUT — LAYOUT KV DTO
// ======================================================
//
// AI-SUPERCOMMENT — LAYOUT DEFINITION (JSON → UI)
//
// RUOLO:
// - Rappresenta un layout COMPLETO e renderizzabile
// - Decodificato dal LayoutRenderer
// - Usato per preview, selezione e acquisto
//
// QUESTO È IL CUORE DEL SISTEMA
// ======================================================

import type { LayoutStyle } from "./style.dto";
import type { ColorPaletteId } from "./palette.dto";

/**
 * Identificatore layout
 * Esempio:
 * - layout-landing-essential
 */
export type LayoutId = string;

/**
 * Struttura di un Layout KV
 * Salvata in KV e interpretata lato FE
 */
export type LayoutKVDTO = {
  /**
   * ID layout stabile
   */
  id: LayoutId;

  /**
   * Versione layout
   * Usata per migrazioni future
   */
  version: string;

  /**
   * Nome commerciale
   */
  name: string;

  /**
   * Descrizione UX
   */
  description: string;

  /**
   * Stili compatibili
   */
  supportedStyles: LayoutStyle[];

  /**
   * Palette compatibili
   */
  supportedPalettes: ColorPaletteId[];

  /**
   * Struttura SPA dichiarativa
   * (NO JSX, NO HTML diretto)
   */
  structure: {
    navbar: boolean;
    hero: boolean;
    sections: Array<
      | "about"
      | "services"
      | "gallery"
      | "contact"
      | "map"
    >;
    footer: boolean;
  };

  /**
   * Placeholder dinamici
   * Verranno popolati da Business KV
   */
  bindings: {
    businessName: boolean;
    logo: boolean;
    address: boolean;
    phone: boolean;
    services: boolean;
  };

  /**
   * Regole di rendering
   */
  render: {
    /**
     * Usa CSS inline?
     */
    inlineCss: boolean;

    /**
     * Supporta preview blur (pre-pagamento)
     */
    previewBlur: boolean;
  };
};


=== FILE: workspace/tools/webyDevEngine/configurationLayout/palette.dto.ts
LANG: ts
SIZE:     2322 bytes
----------------------------------------
// ======================================================
// FE || CONFIGURATION LAYOUT — COLOR PALETTE DTO
// ======================================================
//
// AI-SUPERCOMMENT — COLOR PALETTE (SEMANTIC)
//
// RUOLO:
// - Definisce le palette colori DISPONIBILI
// - Usate dal wizard (StepDesign)
// - Interpretate dal LayoutRenderer
//
// NON FA:
// - NON contiene CSS
// - NON contiene hex hardcoded nello store
// - NON decide il layout
//
// PRINCIPIO CHIAVE:
// - La palette è un CONCETTO, non un colore
// ======================================================

/**
 * Identificatore semantico di una palette colori
 * Usato come reference nello store FE
 */
export type ColorPaletteId =
  | "warm"
  | "dark"
  | "light"
  | "pastel"
  | "corporate";

/**
 * Definizione di una palette colori
 * (interpretata dal renderer)
 */
export type ColorPaletteDTO = {
  /**
   * ID stabile (salvato nello store)
   */
  id: ColorPaletteId;

  /**
   * Label mostrata all’utente
   */
  label: string;

  /**
   * Colori base (preview / renderer)
   * NOTA:
   * - Questi NON vanno salvati nello store
   * - Possono evolvere nel tempo
   */
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
  };
};

/**
 * Elenco palette disponibili
 * SOURCE OF TRUTH per StepDesign
 */
export const COLOR_PRESETS: ColorPaletteDTO[] = [
  {
    id: "warm",
    label: "Caldo e accogliente",
    colors: {
      primary: "#d97706",
      secondary: "#fde68a",
      background: "#fff7ed",
      text: "#451a03",
    },
  },
  {
    id: "dark",
    label: "Scuro moderno",
    colors: {
      primary: "#0f172a",
      secondary: "#334155",
      background: "#020617",
      text: "#f8fafc",
    },
  },
  {
    id: "light",
    label: "Chiaro essenziale",
    colors: {
      primary: "#2563eb",
      secondary: "#93c5fd",
      background: "#ffffff",
      text: "#020617",
    },
  },
  {
    id: "pastel",
    label: "Pastello creativo",
    colors: {
      primary: "#a855f7",
      secondary: "#fbcfe8",
      background: "#fdf4ff",
      text: "#3b0764",
    },
  },
  {
    id: "corporate",
    label: "Corporate professionale",
    colors: {
      primary: "#0f766e",
      secondary: "#5eead4",
      background: "#f0fdfa",
      text: "#042f2e",
    },
  },
];


=== FILE: workspace/tools/webyDevEngine/configurationLayout/style.dto.ts
LANG: ts
SIZE:     1456 bytes
----------------------------------------
// ======================================================
// FE || CONFIGURATION LAYOUT — STYLE DTO
// ======================================================
//
// AI-SUPERCOMMENT — LAYOUT STYLE (INTENT)
//
// RUOLO:
// - Definisce lo STILE comunicativo del sito
// - Influenza spacing, font, gerarchie
//
// NON FA:
// - NON definisce layout specifici
// - NON contiene CSS
//
// CONCETTO:
// - Lo style è un’INTENZIONE, non una struttura
// ======================================================

/**
 * Stile semantico del layout
 */
export type LayoutStyle =
  | "modern"
  | "elegant"
  | "minimal"
  | "bold";

/**
 * Metadati descrittivi dello stile
 * (usati per UI, AI, spiegazioni UX)
 */
export type LayoutStyleDTO = {
  id: LayoutStyle;
  label: string;
  description: string;
};

/**
 * Elenco stili disponibili
 */
export const LAYOUT_STYLES: LayoutStyleDTO[] = [
  {
    id: "modern",
    label: "Moderno",
    description:
      "Layout attuale, leggibile, con spazi equilibrati e design contemporaneo.",
  },
  {
    id: "elegant",
    label: "Elegante",
    description:
      "Design raffinato, tipografia curata, ideale per brand premium.",
  },
  {
    id: "minimal",
    label: "Minimal",
    description:
      "Essenziale e pulito, focalizzato sui contenuti senza distrazioni.",
  },
  {
    id: "bold",
    label: "Bold",
    description:
      "Impatto forte, contrasti marcati, perfetto per attirare attenzione.",
  },
];


=== FILE: workspace/tools/webyDevEngine/configurationLayout/visibility.defaults.ts
LANG: ts
SIZE:      126 bytes
----------------------------------------
export const DEFAULT_VISIBILITY = {
    contactForm: true,
    address: true,
    gallery: false,
    openingHours: true,
  };

=== FILE: workspace/tools/webyDevEngine/developerEngine/engine.builder.ts
LANG: ts
SIZE:     2655 bytes
----------------------------------------
// ======================================================
// FE || DEVELOPER ENGINE — CANVAS BUILDER
// ======================================================
//
// RUOLO:
// - Costruire EngineCanvas a partire da EngineInput
//
// INVARIANTI:
// - Nessun crash possibile
// - Builder deterministico
// - Usa SOLO dati già adattati
// ======================================================

import type { EngineInput } from "./engine.types";
import type {
  EngineCanvas,
  CanvasSection,
} from "./engine.schema.fe";

export function buildCanvas(
  input: EngineInput
): EngineCanvas {
  const { business, layout, style, palette } = input;

  /* =====================
     SHARED SECTIONS
  ====================== */
  const navbar: CanvasSection | null =
    layout.structure.navbar
      ? {
          type: "navbar" as const ,
          brandLabel: business.name,
          links: [
            { label: "Home", anchor: "/home" },
            { label: "Chi siamo", anchor: "/chi-siamo" },
            { label: "Gallery", anchor: "/gallery" },
            { label: "Contatti", anchor: "/contatti" },
          ],
        }
      : null;

  const footer: CanvasSection = {
    type: "footer" as const ,
    poweredBy: "WebOnDay",
    copyright:
      `© ${new Date().getFullYear()} ${business.name}`,
  };


  /* =====================
     CANVAS
  ====================== */
  return {
    meta: {
      product: "landing-essential",
      generatedAt: new Date().toISOString(),
      styleId: style,
      paletteId: palette,
    },
  
    business,
  
    layout: {
      type: "single-page",
  
      sections: [
        ...(navbar ? [navbar] : []),
  
        {
          type: "hero" as const ,
          title: business.name,
          subtitle:
            business.sector !== "generic"
              ? business.sector
              : undefined,
        },
  
        {
          type: "activity" as const ,
          label: business.sector,
        },
  
        {
          type: "description" as const ,
          text:
            "Descrizione dell’attività (inserisci i contenuti per personalizzare il sito).",
        },
  
        ...(business.openingHours
          ? [
              {
                type: "opening-hours" as const ,
                data: business.openingHours,
              },
            ]
          : []),
  
        {
          type: "location",
          address: business.address,
          mapsUrl: business.address
            ? `https://maps.google.com?q=${encodeURIComponent(
                business.address
              )}`
            : undefined,
        },
  
        footer,
      ],
    },
  };}

=== FILE: workspace/tools/webyDevEngine/developerEngine/engine.orchestrator.ts
LANG: ts
SIZE:     1361 bytes
----------------------------------------
// ======================================================
// FE || DEVELOPER ENGINE — ORCHESTRATOR
// ======================================================

import type { LayoutKVDTO } from "../configurationLayout/layout.dto";
import type { LayoutStyle } from "../configurationLayout/style.dto";
import type { ColorPaletteId } from "../configurationLayout/palette.dto";

import { buildCanvas } from "./engine.builder";
import type { EngineCanvas } from "./engine.schema.fe";

type OrchestratorInput = {
  configurationId: string;

  business: {
    name: string;
    sector: string;
    address: string;
    slug: string;
  };

  layouts: LayoutKVDTO[];
  styles: LayoutStyle[];
  palettes: ColorPaletteId[];
};

export function generatePreviewCanvases(
  input: OrchestratorInput
): EngineCanvas[] {
  const canvases: EngineCanvas[] = [];

  for (const layout of input.layouts) {
    for (const style of input.styles) {
      if (!layout.supportedStyles.includes(style)) continue;

      for (const palette of input.palettes) {
        if (!layout.supportedPalettes.includes(palette)) continue;

        canvases.push(
          buildCanvas({
            configurationId: input.configurationId,
            business: input.business,
            layout,
            style,
            palette,
          })
        );
      }
    }
  }

  return canvases;
}


=== FILE: workspace/tools/webyDevEngine/developerEngine/engine.preview.maps.ts
LANG: ts
SIZE:      377 bytes
----------------------------------------
// ======================================================
// FE || ENGINE — PREVIEW MAP
// ======================================================

import type { CanvasSection } from "./engine.schema.fe";

export function filterPreviewSections(
  sections: CanvasSection[]
): CanvasSection[] {
  return sections.filter(
    (s) => s.type !== "location" // esempio blur
  );
}


=== FILE: workspace/tools/webyDevEngine/developerEngine/engine.schema.fe.ts
LANG: ts
SIZE:     2617 bytes
----------------------------------------
// ======================================================
// FE || DEVELOPER ENGINE — CANVAS SCHEMA
// File: engine.schema.fe.ts
// ======================================================
//
// RUOLO:
// - Descrive il CANVAS astratto di una SPA
// - Source of Truth della UI generata
//
// NON FA:
// - NON renderizza
// - NON conosce React / HTML / CSS
//
// FA:
// - Descrive struttura, contenuto, intenzione
// ======================================================
import type { OpeningHoursFE } from "@shared/domain/business/openingHours.types";
export type EngineCanvas = {
    meta: {
      product: "landing-essential";
      generatedAt: string;
      styleId: string;
      paletteId: string;
    };
  
    business: {
      name: string;
      slug: string;
      sector: string;
      address: string;
      mapsUrl?: string;
    };
  
    layout: {
      type: "single-page";
      sections: CanvasSection[];
    };
  };
  export type OpeningHoursSection = {
    type: "opening-hours";
    data: OpeningHoursFE;
  };
  /* =========================
     SECTIONS
  ========================= */
  export type CanvasSection =
  | NavbarSection
  | HeroSection
  | GallerySection
  | ActivitySection
  | DescriptionSection
  | LocationSection
  | FooterSection
  | OpeningHoursSection; 
  
  /* =========================
     NAVBAR
  ========================= */
  export type NavbarSection = {
    type: "navbar";
    brandLabel: string;
    links: {
      label: string;
      anchor: string;
    }[];
  };
  
  /* =========================
     HERO
  ========================= */
  export type HeroSection = {
    type: "hero";
    title: string;
    backgroundImage?: string; 
    subtitle?: string;
  };
  
  /* =========================
     GALLERY
  ========================= */
  export type GallerySection = {
    type: "gallery";
    images: string[];
    placeholder: boolean;
  };
  
  /* =========================
     ACTIVITY
  ========================= */
  export type ActivitySection = {
    type: "activity";
    label: string;
  };
  
  /* =========================
     DESCRIPTION
  ========================= */
  export type DescriptionSection = {
    type: "description";
    text: string;
  };
  
  /* =========================
     LOCATION
  ========================= */
  export type LocationSection = {
    type: "location";
    address: string;
    mapsUrl?: string; // ⬅️ FIX
  };
  
  /* =========================
     FOOTER
  ========================= */
  export type FooterSection = {
    type: "footer";
    poweredBy: string;
    copyright:
      string;
  };
  

=== FILE: workspace/tools/webyDevEngine/developerEngine/engine.types.ts
LANG: ts
SIZE:     1043 bytes
----------------------------------------
// ======================================================
// FE || DEVELOPER ENGINE — TYPES
// ======================================================
//
// RUOLO:
// - Tipi canonici dell’Engine
// - Contratto tra Adapter → Builder → Renderer
//
// INVARIANTI:
// - Dati business REALI
// - Nessuna logica
// ======================================================

import type { LayoutKVDTO } from "../configurationLayout/layout.dto";
import type { LayoutStyle } from "../configurationLayout/style.dto";
import type { ColorPaletteId } from "../configurationLayout/palette.dto";
import type { OpeningHoursFE } from "@shared/domain/business/openingHours.types";

export type EngineInput = {
  configurationId: string;

  business: {
    name: string;
    slug: string;

    // 🔹 semantica
    sector: string;
    address: string;

    // 🔹 dati strutturati (usati dai renderer)
    openingHours?: OpeningHoursFE;
  };

  layout: LayoutKVDTO;
  style: LayoutStyle;
  palette: ColorPaletteId;
};

export type EngineVariantId = string;

=== FILE: workspace/tools/webyDevEngine/layouts/LayoutPreview.tsx
LANG: tsx
SIZE:     2566 bytes
----------------------------------------

// ======================================================
// AI-SUPERCOMMENT — LAYOUT PREVIEW (VENDITA)
// ======================================================
//
// RUOLO:
// - Visualizzare il layout che verrà ACQUISTATO
//
// INVARIANTI:
// - Read only
// - Nessuna mutazione
// - Nessuna logica di prezzo
// ======================================================

import type { LayoutKVDTO } from "../configurationLayout/layout.dto";

/* ======================================================
   LOCAL DTO — PREVIEW DATA
====================================================== */
type LayoutPreviewData = {
  businessName?: string;
  phone?: string;

  description?: string;
  services?: string;

  style?: string;
  colorPreset?: string;
};

type LayoutPreviewProps = {
  layout: LayoutKVDTO;
  data: LayoutPreviewData;
};

export function LayoutPreview({ layout, data }: LayoutPreviewProps) {
  const { structure, bindings, render } = layout;

  return (
    <div
      className={`layout-preview style-${data.style ?? "modern"} palette-${data.colorPreset ?? "light"}`}
      style={{
        filter: render.previewBlur ? "blur(2px)" : "none",
      }}
    >
      {/* NAVBAR */}
      {structure.navbar && (
        <div className="lp-navbar">
          {bindings.businessName && (
            <strong>{data.businessName || "Nome attività"}</strong>
          )}
        </div>
      )}

      {/* HERO */}
      {structure.hero && (
        <div className="lp-hero">
          {bindings.businessName && (
            <h1>{data.businessName || "Nome attività"}</h1>
          )}
          {bindings.services && (
            <p>{data.services || "I nostri servizi principali"}</p>
          )}
        </div>
      )}

      {/* SEZIONI */}
      <div className="lp-sections">
        {structure.sections.includes("about") && (
          <section>
            <h3>Chi siamo</h3>
            <p>{data.description || "Descrizione attività"}</p>
          </section>
        )}

        {structure.sections.includes("services") && (
          <section>
            <h3>Servizi</h3>
            <p>{data.services || "Elenco servizi"}</p>
          </section>
        )}

        {structure.sections.includes("contact") && (
          <section>
            <h3>Contatti</h3>
            {bindings.phone && <p>{data.phone || "Telefono"}</p>}
          </section>
        )}
      </div>

      {/* FOOTER */}
      {structure.footer && (
        <div className="lp-footer">
          © {new Date().getFullYear()}
        </div>
      )}
    </div>
  );
}


=== FILE: workspace/tools/webyDevEngine/layouts/preview/StepDesign.tsx
LANG: tsx
SIZE:     3164 bytes
----------------------------------------
// ======================================================
// FE || STEP DESIGN — PREVIEW ENGINE
// ======================================================

import { useConfigurationSetupStore } from "@shared/domain/user/configurator/configurationSetup.store";

import { generatePreviewCanvases } from "@src/user/workspace/tools/webyDevEngine/developerEngine/engine.orchestrator";
import { EnginePreview } from "@src/user/workspace/tools/webyDevEngine/EnginePreview";

import { COLOR_PRESETS } from "@src/user/workspace/tools/webyDevEngine/configurationLayout/palette.dto";
import { LAYOUT_STYLES } from "@src/user/workspace/tools/webyDevEngine/configurationLayout/style.dto";
import type { LayoutKVDTO } from "@src/user/workspace/tools/webyDevEngine/configurationLayout/layout.dto";

import { slugify } from "@shared/utils/slugify";



type Props = {
  onNext: () => void;
  onBack: () => void;
};

export default function StepDesign({ onNext, onBack }: Props) {
  const { data } = useConfigurationSetupStore();
  const addressString =
  data.businessAddress?.street &&
  data.businessAddress?.city
    ? `${data.businessAddress.street}, ${data.businessAddress.city}`
    : "";
const configurationId = data.configurationId;

  /* =========================
     GUARD — PREREQUISITI STEP
     (OBBLIGATORIO)
  ========================= */
  if (
    !configurationId ||
    !data.businessName ||
    !data.sector ||
    !addressString
  ) {
    return (
      <div className="step-error">
        <h3>Dati mancanti</h3>
        <p>
          Completa prima lo step precedente.
        </p>
      </div>
    );
  }

  /* =========================
     PREVIEW GENERATION
  ========================= */
  const previews = generatePreviewCanvases({
    configurationId,
    business: {
      name: data.businessName,
      sector: data.sector,
      address:addressString,
      slug: slugify(data.businessName),
    },
    layouts: AVAILABLE_LAYOUTS,
    styles: LAYOUT_STYLES.map((s) => s.id),
    palettes: COLOR_PRESETS.map((p) => p.id),
  });

  return (
    <div className="step step-design">
      <h2>Scegli il layout del tuo sito</h2>

      <div className="preview-grid">
        {previews.map((canvas, i) => (
          <EnginePreview key={i} canvas={canvas} />
        ))}
      </div>

      <div className="actions">
        <button onClick={onBack}>Indietro</button>
        <button onClick={onNext}>Continua</button>
      </div>
    </div>
  );
}



/**
 * TEMPORANEO (FE)
 * Domani arriva dal BE
 */
const AVAILABLE_LAYOUTS: LayoutKVDTO[] = [
  {
    id: "layout-landing-essential",
    version: "1",
    name: "Landing Essential",
    description: "Landing page singola",
    supportedStyles: ["modern", "elegant", "minimal", "bold"],
    supportedPalettes: ["warm", "dark", "light", "pastel", "corporate"],
    structure: {
      navbar: true,
      hero: true,
      sections: ["gallery", "contact", "map"],
      footer: true,
    },
    bindings: {
      businessName: true,
      logo: false,
      address: true,
      phone: true,
      services: true,
    },
    render: {
      inlineCss: false,
      previewBlur: false,
    },
  },
];


=== FILE: workspace/tools/webyDevEngine/layouts/preview/StepLayoutGenerator.tsx
LANG: tsx
SIZE:     2701 bytes
----------------------------------------
// NOTA ARCHITETTURALE:
//
// Questo step NON mostra layout.
// Serve esclusivamente a:
// - derivare visibility
// - garantire che i dati minimi esistano
//
// La preview e la selezione layout
// avvengono ESCLUSIVAMENTE nello step successivo.
// ======================================================
// FE || STEP — LAYOUT PREPARATION (CANONICAL)
//
// RUOLO:
// - Prepara la Configuration per la selezione layout
// - Deriva la VISIBILITÀ delle sezioni
// - NON decide struttura (layout = source of truth)
//
// INVARIANTI:
// - Nessuna fetch
// - Nessuna persistenza backend
// - Nessuna struttura custom
// ======================================================

import { useEffect } from "react";
import { useConfigurationSetupStore } from "@shared/domain/user/configurator/configurationSetup.store";
import { DEFAULT_VISIBILITY } from "@src/user/workspace/tools/webyDevEngine/configurationLayout/visibility.defaults";

type Props = {
  onNext: () => void;
  onBack: () => void;
};

// FE || StepLayoutGenerator — CANONICAL
export default function StepLayoutGenerator({ onNext, onBack }: Props) {
  const { data, setField } = useConfigurationSetupStore();
  const addressString =
  data.businessAddress?.street &&
  data.businessAddress?.city
    ? `${data.businessAddress.street}, ${data.businessAddress.city}`
    : "";

    const derivedVisibility = {
      ...DEFAULT_VISIBILITY,
      contactForm: !!data.email,
      address: !!addressString,    // ✅ boolean
      openingHours: !!data.openingHours,
      gallery: false,
    };

  const isComplete =
    !!data.businessName &&
    (!!data.businessDescriptionTags?.length ||
      !!data.businessServiceTags?.length);

  useEffect(() => {
    setField("visibility", derivedVisibility);
  }, [setField, data.email, addressString, data.openingHours]);

  return (
    <div className="step">
      <h2>Preparazione layout</h2>

      <p style={{ opacity: 0.7 }}>
        Stiamo preparando la configurazione per la scelta del layout.
      </p>

      <ul>
        <li>Contatti: {derivedVisibility.contactForm ? "✓" : "—"}</li>
        <li>Indirizzo: {derivedVisibility.address ? "✓" : "—"}</li>
        <li>Orari: {derivedVisibility.openingHours ? "✓" : "—"}</li>
      </ul>

      {!isComplete && (
        <p className="error">
          Inserisci almeno una descrizione o un servizio per continuare.
        </p>
      )}

      <div className="actions">
        <button type="button" onClick={onBack}>
          Indietro
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!isComplete}
        >
          Continua
        </button>
      </div>
    </div>
  );
}


=== FILE: workspace/tools/webyDevEngine/layouts/preview/StepReview.tsx
LANG: tsx
SIZE:     4496 bytes
----------------------------------------
// ======================================================
// FE || STEP — LAYOUT SELECTION (CANONICAL)
// ======================================================
//
// RESPONSABILITÀ:
// - Unico consumer dei layout BE
// - Unico punto di selezione layoutId
// - Ultimo step prima del checkout
//
// INVARIANTI:
// - Nessuna decisione di pricing
// - Nessuna creazione ordine
// - Checkout NON sceglie layout
//
// ======================================================

import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import { useConfigurationSetupStore } from "@shared/domain/user/configurator/configurationSetup.store";
import { fetchAvailableLayouts } from "@shared/lib/userApi/layout.user.api";
import { updateConfiguration } from "@user/configurator/base_configuration/configuration/configuration.user.api";

import type { LayoutKVDTO } from "../../configurationLayout/layout.dto";

type Props = {
  onBack: () => void;
};

export default function StepReview({ onBack }: Props) {
  /* ======================================================
     CONTEXT
  ====================================================== */
  const { id: configurationId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data } = useConfigurationSetupStore();

  /* ======================================================
     STATE
  ====================================================== */
  const [layouts, setLayouts] = useState<LayoutKVDTO[]>([]);
  const [selectedLayoutId, setSelectedLayoutId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ======================================================
     LOAD LAYOUTS (BE)
  ====================================================== */
  useEffect(() => {
    if (!data.solutionId || !data.productId) {
      setError("Configurazione incompleta");
      return;
    }

    async function loadLayouts() {
      try {
        const res = await fetchAvailableLayouts({
          solutionId: data.solutionId!,
          productId: data.productId!,
        });

        setLayouts(res.layouts ?? []);
      } catch {
        setError("Errore nel caricamento dei layout");
      }
    }

    loadLayouts();
  }, [data.solutionId, data.productId]);

  /* ======================================================
     CTA — SAVE & CONTINUE
  ====================================================== */
  async function confirmLayout() {
    if (!configurationId || !selectedLayoutId) return;

    setLoading(true);
    setError(null);

    try {
      await updateConfiguration(configurationId, {
        ...data,
        layoutId: selectedLayoutId,
        status: "draft",
      });

      // 🔁 HANDOFF (scegline uno)
      // navigate(`/user/checkout/${configurationId}`);
      navigate(`/user/dashboard/configurator/${configurationId}`);
    } catch (e: any) {
      setError(e.message ?? "Errore salvataggio configurazione");
    } finally {
      setLoading(false);
    }
  }

  /* ======================================================
     RENDER
  ====================================================== */
  return (
    <div className="step step-review">
      <h2>Scegli il layout del tuo sito</h2>

      <p style={{ opacity: 0.7 }}>
        Questo layout sarà incluso nel progetto finale.
      </p>

      {error && <p className="error">{error}</p>}

      {/* =========================
         LAYOUT GRID
      ========================= */}
      <div className="layout-grid">
        {layouts.map((layout) => (
          <div
            key={layout.id}
            className={
              selectedLayoutId === layout.id
                ? "layout-card selected"
                : "layout-card"
            }
            onClick={() => setSelectedLayoutId(layout.id)}
          >
          
            <h4>{layout.name}</h4>
            <p>{layout.description}</p>
          </div>
        ))}
      </div>

      {/* =========================
         ACTIONS
      ========================= */}
      <div className="actions">
        <button type="button" onClick={onBack}>
          Indietro
        </button>

        <button
          type="button"
          onClick={confirmLayout}
          disabled={!selectedLayoutId || loading}
        >
          {loading ? "Salvataggio…" : "Conferma layout e continua"}
        </button>
      </div>
    </div>
  );
}


=== FILE: workspace/tools/webyDevEngine/sections/ActivityRenderer.tsx
LANG: tsx
SIZE:      236 bytes
----------------------------------------
// sections/ActivityRenderer.tsx

type Props = {
    label: string;
  };
  
  export function ActivityRenderer({ label }: Props) {
    return (
      <section className="activity">
        <h2>{label}</h2>
      </section>
    );
  }
  

=== FILE: workspace/tools/webyDevEngine/sections/DescriptionRenderer.tsx
LANG: tsx
SIZE:      240 bytes
----------------------------------------
// sections/DescriptionRenderer.tsx

type Props = {
    text: string;
  };
  
  export function DescriptionRenderer({ text }: Props) {
    return (
      <section className="description">
        <p>{text}</p>
      </section>
    );
  }
  

=== FILE: workspace/tools/webyDevEngine/sections/FooterRenderer.tsx
LANG: tsx
SIZE:      390 bytes
----------------------------------------
type Props = {
    poweredBy: string;
    href?: string;
    copyright: string;
  };
  
  export function FooterRenderer({
    poweredBy,
    href = "https://webonday.it",
    copyright,
  }: Props) {
    return (
      <footer className="footer">
        <p>
          Generato da <a href={href}>{poweredBy}</a>
        </p>
        <small>{copyright}</small>
      </footer>
    );
  }
  

=== FILE: workspace/tools/webyDevEngine/sections/GalleryRenderer.tsx
LANG: tsx
SIZE:      543 bytes
----------------------------------------
// sections/GalleryRenderer.tsx

type Props = {
    images: string[];
    placeholder: boolean;
  };
  
  export function GalleryRenderer({ images, placeholder }: Props) {
    return (
      <section className="gallery">
        {images.length === 0 && placeholder ? (
          <div className="gallery-placeholder">
            Carica le foto della tua attività
          </div>
        ) : (
          images.map((src, i) => (
            <img key={i} src={src} alt={`Gallery ${i}`} />
          ))
        )}
      </section>
    );
  }
  

=== FILE: workspace/tools/webyDevEngine/sections/HeroRenderer.tsx
LANG: tsx
SIZE:      349 bytes
----------------------------------------
// sections/HeroRenderer.tsx

type Props = {
    title: string;
    backgroundImage?: string;
  };
  
  export function HeroRenderer({ title, backgroundImage }: Props) {
    return (
      <section
        className="hero"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <h1>{title}</h1>
      </section>
    );
  }
  

=== FILE: workspace/tools/webyDevEngine/sections/LocationRenderer.tsx
LANG: tsx
SIZE:      383 bytes
----------------------------------------
// sections/LocationRenderer.tsx

type Props = {
    address: string;
    mapsUrl?: string;
  };
  
  export function LocationRenderer({ address, mapsUrl }: Props) {
    return (
      <section className="location">
        <p>{address}</p>
        <a href={mapsUrl} target="_blank" rel="noopener noreferrer">
          Apri su Google Maps
        </a>
      </section>
    );
  }
  

=== FILE: workspace/tools/webyDevEngine/sections/NavbarRenderer.tsx
LANG: tsx
SIZE:      556 bytes
----------------------------------------
// sections/NavbarRenderer.tsx

type Props = {
    brandLabel: string;
    links: { label: string; anchor: string }[];
  };
  
  export function NavbarRenderer({ brandLabel, links }: Props) {
    return (
      <nav className="navbar">
        <a href="#home" className="navbar-brand">
          {brandLabel}
        </a>
  
        <ul className="navbar-links">
          {links.map((link) => (
            <li key={link.anchor}>
              <a href={link.anchor}>{link.label}</a>
            </li>
          ))}
        </ul>
      </nav>
    );
  }
  

=== FILE: workspace/tools/webyDevEngine/sections/OpeningHourRenderer.tsx
LANG: tsx
SIZE:     2674 bytes
----------------------------------------
// ======================================================
// FE || WEBY DEV ENGINE — OPENING HOURS RENDERER
// ======================================================
//
// RUOLO:
// - Renderizza gli orari di apertura nel sito preview / pubblico
// - Consuma OpeningHoursFE (dominio Business)
//
// SOURCE OF TRUTH:
// - OpeningHoursFE (BE → FE)
//
// INVARIANTI:
// - Nessuna configurazione
// - Nessuna mutazione
// - Nessuna persistenza
// - Render puro
// ======================================================

import type {
  OpeningHoursFE,
  TimeRangeFE,
} from "@shared/domain/business/openingHours.types";

/* =====================
   DAY ORDER & LABELS
===================== */
type DayKey = keyof OpeningHoursFE;

const DAY_ORDER: DayKey[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

const DAY_LABELS: Record<DayKey, string> = {
  monday: "Lunedì",
  tuesday: "Martedì",
  wednesday: "Mercoledì",
  thursday: "Giovedì",
  friday: "Venerdì",
  saturday: "Sabato",
  sunday: "Domenica",
};

/* =====================
   PROPS
===================== */
type Props = {
  openingHours: OpeningHoursFE;
};

/* =====================
   RENDERER
===================== */
export function OpeningHoursRenderer({
  openingHours,
}: Props) {
  if (!openingHours) return null;

  return (
    <section className="opening-hours">
      <h3>Orari di apertura</h3>

      <ul className="opening-hours-list">
        {DAY_ORDER.map((day) => {
          const ranges = openingHours[day];
          if (!ranges) return null;

          return (
            <li key={day} className="opening-hours-row">
              <span className="day-label">
                {DAY_LABELS[day]}
              </span>

              <span className="day-hours">
                {renderHours(ranges)}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/* =====================
   UI HELPERS (VISUAL)
===================== */
function renderHours(ranges: TimeRangeFE[]) {
  if (!ranges || ranges.length === 0) {
    return <span className="badge closed">Chiuso</span>;
  }

  // H24 convenzione: un solo range 00:00 → 24:00
  if (
    ranges.length === 1 &&
    ranges[0].from === "00:00" &&
    ranges[0].to === "24:00"
  ) {
    return <span className="badge h24">Aperto 24h</span>;
  }

  // Uno o più turni
  return (
    <span className="split-hours">
      {ranges.map((r, i) => (
        <span key={i}>
          {r.from} – {r.to}
          {i < ranges.length - 1 && (
            <span className="separator"> / </span>
          )}
        </span>
      ))}
    </span>
  );
}

=== FILE: workspace/workspace.shell.tsx
LANG: tsx
SIZE:      801 bytes
----------------------------------------
// ======================================================
// FE || WORKSPACE — SHELL
// ======================================================
//
// RUOLO:
// - Layout base del Workspace
// - Sidebar + Preview persistenti
//
// INVARIANTI:
// - Nessuna logica di dominio
// - Solo composizione UI
// ======================================================

import type { ReactNode } from "react";

type Props = {
  sidebar: ReactNode;
  preview: ReactNode;
};

export default function WorkspaceShell({
  sidebar,
  preview,
}: Props) {
  return (
    <div className="workspace-shell">
      {/* SIDEBAR */}
      <aside className="workspace-sidebar">
        {sidebar}
      </aside>

      {/* PREVIEW */}
      <main className="workspace-preview">
        {preview}
      </main>
    </div>
  );
}


=== FILE: workspace/workspace.sidebar.tsx
LANG: tsx
SIZE:     1136 bytes
----------------------------------------
import { NavLink } from "react-router-dom";
import { useConfigurationSetupStore } from
  "@shared/domain/user/configurator/configurationSetup.store";

export default function WorkspaceSidebar() {
  const { data } = useConfigurationSetupStore();

  return (
    <aside className="workspace-sidebar">
      <h3 className="workspace-title">Workspace</h3>

      {/* ===== BUSINESS PREVIEW CONTEXT ===== */}
      {data.businessName && (
        <div className="workspace-business-preview">
          <strong className="workspace-business-name">
            {data.businessName}
          </strong>

          <div className="workspace-business-meta">
            <span>Anteprima sito attiva</span>
            {data.style && data.colorPreset && (
              <small>
                {data.style} · {data.colorPreset}
              </small>
            )}
          </div>
        </div>
      )}

      {/* ===== NAV ===== */}
      <nav className="workspace-nav">

        <NavLink to="design">Design</NavLink>
        <NavLink to="upload">Upload</NavLink>
        <NavLink to="cms">Contenuti</NavLink>
      </nav>
    </aside>
  );
}


=== FILE: workspace/workspace.state.ts
LANG: ts
SIZE:      368 bytes
----------------------------------------
import { create } from "zustand";
// FE || WORKSPACE STATE — CANONICAL

type WorkspaceState = {
  activeConfigurationId: string | null;
  setActiveConfiguration: (id: string) => void;
};

export const useWorkspaceState = create<WorkspaceState>((set) => ({
  activeConfigurationId: null,
  setActiveConfiguration: (id) =>
    set({ activeConfigurationId: id }),
}));


francescomaggi@MacBook-Pro user % 