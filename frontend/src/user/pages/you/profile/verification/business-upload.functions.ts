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
  