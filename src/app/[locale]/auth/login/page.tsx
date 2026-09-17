import { getTranslations } from "next-intl/server";
import { AuthCard } from "@/components/auth/AuthCard";
import { LoginForm } from "@/components/auth/LoginForm";

export default async function LoginPage() {
  const t = await getTranslations("auth");
  return (
    <AuthCard title={t("loginTitle")}>
      <LoginForm redirectTo="/" registerHref="/auth/register" mode="phone" />
    </AuthCard>
  );
}
