import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { saveUploadedImage } from "@/lib/uploads";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user || (session.user.role !== "OWNER" && session.user.role !== "ADMIN")) {
    return NextResponse.json({ error: "Требуется вход как владелец ресторана" }, { status: 403 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Файл не передан" }, { status: 400 });
  }

  try {
    const url = await saveUploadedImage(file);
    return NextResponse.json({ url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Ошибка загрузки файла";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
