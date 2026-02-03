import { useEffect } from "react";
import { useConfigurationSetupStore } from
  "@shared/domain/user/configurator/configurationSetup.store";
  import { useMyOwnerDraft } from "../api/get.my-owner-draft";
import OwnerForm from "./OwnerForm";

export default function StepOwnerInfo({
  onBack,
  onNext,
}: {
  onBack: () => void;
  onNext: () => void;
}) {
  const { data, setField } = useConfigurationSetupStore();
  const configurationId = data.configurationId;

  const { data: ownerDraft, loading } =
    useMyOwnerDraft(configurationId);

  // ================= PREFILL — BE WINS =================
  useEffect(() => {
    if (!ownerDraft) return;

    setField("ownerFirstName", ownerDraft.firstName ?? "");
    setField("ownerLastName", ownerDraft.lastName ?? "");
    setField("ownerBirthDate", ownerDraft.birthDate ?? "");

    if (ownerDraft.contact?.phoneNumber) {
      setField("ownerPhone", ownerDraft.contact.phoneNumber);
    }

    if (ownerDraft.address) {
      setField("ownerAddress", {
        street: ownerDraft.address.street ?? "",
        number: ownerDraft.address.number ?? "",
        city: ownerDraft.address.city ?? "",
        province: ownerDraft.address.province ?? "",
        region: ownerDraft.address.region ?? "",
        zip: ownerDraft.address.zip ?? "",
        country: ownerDraft.address.country ?? "",
      });
    }

    if (ownerDraft.privacy) {
      setField("ownerPrivacy", {
        accepted: ownerDraft.privacy.accepted,
        acceptedAt: ownerDraft.privacy.acceptedAt,
        policyVersion: ownerDraft.privacy.policyVersion,
      });
    }
  }, [ownerDraft, setField]);

  if (loading) {
    return <div className="step">Caricamento titolare…</div>;
  }

  return (
    <OwnerForm onBack={onBack} onComplete={onNext} />
  );
}