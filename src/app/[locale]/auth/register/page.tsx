import { getTranslations } from "next-intl/server";
import { AuthCard } from "@/components/auth/AuthCard";
import { RegisterForm } from "@/components/auth/RegisterForm";

export default async function RegisterPage() {
  const t = await getTranslations("auth");
  return (
    <AuthCard title={t("registerTitle")}>
      <RegisterForm role="USER" redirectTo="/" loginHref="/auth/login" />
    </AuthCard>
  );
}
