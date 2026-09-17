import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { put } from "@vercel/blob";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE_BYTES = 5 * 1024 * 1024;

export async function saveUploadedImage(file: File): Promise<string> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error("Недопустимый тип файла. Разрешены: JPEG, PNG, WEBP");
  }
  if (file.size > MAX_SIZE_BYTES) {
    throw new Error("Файл слишком большой (максимум 5МБ)");
  }

  const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
  const filename = `${randomUUID()}.${ext}`;

  // On Vercel the filesystem is read-only and ephemeral, so uploads go to Vercel Blob
  // storage there instead (authenticated via OIDC, no static token needed). Locally,
  // they still save to public/uploads.
  if (process.env.VERCEL) {
    const blob = await put(filename, file, { access: "public" });
    return blob.url;
  }

  await mkdir(UPLOAD_DIR, { recursive: true });
  const filePath = path.join(UPLOAD_DIR, filename);
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(filePath, buffer);

  return `/uploads/${filename}`;
}
