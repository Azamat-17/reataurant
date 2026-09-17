"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";

export function LoginForm({
  redirectTo,
  registerHref,
  mode = "email",
}: {
  redirectTo: string;
  registerHref: string;
  mode?: "email" | "phone";
}) {
  const t = useTranslations("auth");
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(data: LoginInput) {
    setError(null);
    const res = await signIn("credentials", { ...data, redirect: false });
    if (res?.error) {
      setError(t("error"));
      return;
    }
    router.push(redirectTo);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
      <div>
        <label className="mb-1 block text-xs font-medium text-muted">
          {mode === "phone" ? t("phone") : t("email")}
        </label>
        <input
          type={mode === "phone" ? "tel" : "email"}
          {...register("identifier")}
          className="w-full rounded-lg border border-border px-3 py-2 text-sm"
        />
        {errors.identifier && <p className="mt-1 text-xs text-red-500">{errors.identifier.message}</p>}
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-muted">{t("password")}</label>
        <input
          type="password"
          {...register("password")}
          className="w-full rounded-lg border border-border px-3 py-2 text-sm"
        />
        {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
      <Button type="submit" disabled={isSubmitting} className="mt-2">
        {t("submitLogin")}
      </Button>
      <p className="text-center text-xs text-muted">
        {t("noAccount")}{" "}
        <Link href={registerHref} className="font-semibold text-brand">
          {t("registerTitle")}
        </Link>
      </p>
    </form>
  );
}
