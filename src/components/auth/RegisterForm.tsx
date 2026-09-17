"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";
import { registerSchema, type RegisterInput } from "@/lib/validations/auth";

export function RegisterForm({
  role,
  redirectTo,
  loginHref,
}: {
  role: "USER" | "OWNER";
  redirectTo: string;
  loginHref: string;
}) {
  const t = useTranslations("auth");
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role },
  });

  async function onSubmit(data: RegisterInput) {
    setError(null);
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, role }),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(body.error ?? "Не удалось зарегистрироваться");
      return;
    }

    const signInRes = await signIn("credentials", {
      identifier: data.phone || data.email,
      password: data.password,
      redirect: false,
    });
    if (signInRes?.error) {
      setError(t("error"));
      return;
    }
    router.push(redirectTo);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
      <div>
        <label className="mb-1 block text-xs font-medium text-muted">{t("name")}</label>
        <input {...register("name")} className="w-full rounded-lg border border-border px-3 py-2 text-sm" />
        {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
      </div>

      {role === "USER" ? (
        <>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted">{t("phone")}</label>
            <input
              type="tel"
              {...register("phone")}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm"
            />
            {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>}
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted">
              {t("email")} <span className="font-normal">({t("optional")})</span>
            </label>
            <input
              type="email"
              {...register("email")}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm"
            />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
          </div>
        </>
      ) : (
        <>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted">{t("email")}</label>
            <input
              type="email"
              {...register("email")}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm"
            />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted">
              {t("phone")} <span className="font-normal">({t("optional")})</span>
            </label>
            <input
              type="tel"
              {...register("phone")}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm"
            />
            {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>}
          </div>
        </>
      )}

      <div>
        <label className="mb-1 block text-xs font-medium text-muted">{t("password")}</label>
        <input
          type="password"
          {...register("password")}
          className="w-full rounded-lg border border-border px-3 py-2 text-sm"
        />
        <p className="mt-1 text-xs text-muted">{t("passwordHint")}</p>
        {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
      <Button type="submit" disabled={isSubmitting} className="mt-2">
        {t("submitRegister")}
      </Button>
      <p className="text-center text-xs text-muted">
        {t("haveAccount")}{" "}
        <Link href={loginHref} className="font-semibold text-brand">
          {t("loginTitle")}
        </Link>
      </p>
    </form>
  );
}
