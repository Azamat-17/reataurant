import { getTranslations } from "next-intl/server";
import { AuthCard } from "@/components/auth/AuthCard";
import { LoginForm } from "@/components/auth/LoginForm";

export default async function OwnerLoginPage() {
  const t = await getTranslations("auth");
  return (
    <AuthCard title={t("ownerLoginTitle")}>
      <LoginForm redirectTo="/owner/dashboard" registerHref="/auth/owner/register" />
    </AuthCard>
  );
}
