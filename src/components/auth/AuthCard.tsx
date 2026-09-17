import { Header } from "@/components/header/Header";

export function AuthCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="flex flex-1 items-center justify-center px-4 py-10">
        <div className="w-full max-w-sm rounded-2xl border border-border p-6 shadow-sm">
          <h1 className="mb-5 text-xl font-bold text-foreground">{title}</h1>
          {children}
        </div>
      </main>
    </>
  );
}
