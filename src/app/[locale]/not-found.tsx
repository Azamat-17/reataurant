import { Link } from "@/i18n/navigation";

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4 py-20 text-center">
      <h1 className="text-4xl font-black text-foreground">404</h1>
      <p className="text-muted">Страница не найдена</p>
      <Link href="/" className="font-semibold text-brand">
        На главную
      </Link>
    </div>
  );
}
