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
  const [pendingVerification, setPendingVerification] = useState<{ email: string; password: string } | null>(null);
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [resent, setResent] = useState(false);

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

    if (body.needsVerification) {
      setPendingVerification({ email: data.email as string, password: data.password });
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

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    if (!pendingVerification) return;
    setCodeError(null);
    setVerifying(true);
    const res = await fetch("/api/verify-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: pendingVerification.email, code }),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setCodeError(body.error ?? t("invalidCode"));
      setVerifying(false);
      return;
    }

    const signInRes = await signIn("credentials", {
      identifier: pendingVerification.email,
      password: pendingVerification.password,
      redirect: false,
    });
    setVerifying(false);
    if (signInRes?.error) {
      setCodeError(t("error"));
      return;
    }
    router.push(redirectTo);
    router.refresh();
  }

  async function handleResend() {
    if (!pendingVerification) return;
    setResent(false);
    await fetch("/api/verify-email", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: pendingVerification.email }),
    });
    setResent(true);
  }

  if (pendingVerification) {
    return (
      <form onSubmit={handleVerify} className="flex flex-col gap-3">
        <p className="text-sm text-muted">{t("codeSent", { email: pendingVerification.email })}</p>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted">{t("verificationCode")}</label>
          <input
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
            inputMode="numeric"
            maxLength={6}
            className="w-full rounded-lg border border-border px-3 py-2 text-center text-lg tracking-[0.5em]"
          />
          {codeError && <p className="mt-1 text-xs text-red-500">{codeError}</p>}
        </div>
        <Button type="submit" disabled={verifying || code.length !== 6} className="mt-2">
          {t("verifyCode")}
        </Button>
        <button type="button" onClick={handleResend} className="text-center text-xs font-semibold text-brand">
          {resent ? t("codeResent") : t("resendCode")}
        </button>
      </form>
    );
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
