import type { Env } from "../types/env";

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function testUploadMenu(request: Request, env: Env) {
  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!file || !(file instanceof File)) {
    return json({ error: "Missing file" }, 400);
  }

  if (file.type !== "application/pdf") {
    return json({ error: "Only PDF allowed" }, 400);
  }

  const key = `test/${crypto.randomUUID()}.pdf`;

  await env.BUSINESS_MENU_BUCKET.put(key, file.stream(), {
    httpMetadata: {
      contentType: "application/pdf",
    },
  });

  const publicUrl = `${env.R2_PUBLIC_BASE_URL}/${key}`;

  return json({
    ok: true,
    key,
    url: publicUrl,
    size: file.size,
  });
}
