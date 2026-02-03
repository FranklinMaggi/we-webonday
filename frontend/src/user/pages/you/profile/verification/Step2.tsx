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
