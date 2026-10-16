import type { ApiHandlerArgs } from "@moonsjs/server";

/**
 * Upload multipart contoh (Addendum E.2): Web API `req.formData()`.
 * Batas ukuran dicek route (bodyLimitBytes hanya untuk RPC); jangan percaya
 * `file.name`/`file.type` dari klien untuk penyimpanan.
 */
const MAX_BYTES = 64 * 1024;

export const POST = async ({ req }: ApiHandlerArgs): Promise<Response> => {
  const declared = Number(req.headers.get("content-length") ?? "0");
  if (Number.isFinite(declared) && declared > MAX_BYTES + 4096) {
    return Response.json({ error: "too large" }, { status: 413 });
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return Response.json({ error: "body is not multipart/form-data" }, { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return Response.json({ error: "field `file` is required" }, { status: 400 });
  }
  const bytes = new Uint8Array(await file.arrayBuffer());
  if (bytes.byteLength > MAX_BYTES) {
    return Response.json({ error: "too large" }, { status: 413 });
  }

  // App nyata: simpan dengan nama buatan server (fs/S3), validasi magic bytes.
  return Response.json({
    name: file.name,
    size: bytes.byteLength,
    type: file.type === "" ? "application/octet-stream" : file.type,
  });
};
