// ======================================================
// FE || STEP — OWNER INFO (CANONICAL)
// ======================================================

import { useEffect, useState } from "react";
import { apiFetch } from "../../../../../../shared/lib/api";
import { useConfigurationSetupStore } from "../../store/configurationSetup.store";
import OwnerForm from "../owner/OwnerForm";

type OwnerDraftReadDTO = {
  firstName?: string;
  lastName?: string;
  birthDate?: string;
  contact?: {
    secondaryMail?: string;
  };
  privacy?: {
    accepted: boolean;
    acceptedAt: string;
    policyVersion: string;
  };
  complete: boolean;
};

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
          setField("ownerBirthDate", o.birthDate ?? undefined),
          setField(
            "ownerSecondaryMail",
            o.contact?.secondaryMail ?? ""
          );

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
