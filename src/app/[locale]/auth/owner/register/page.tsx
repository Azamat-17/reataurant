import { getTranslations } from "next-intl/server";
import { AuthCard } from "@/components/auth/AuthCard";
import { RegisterForm } from "@/components/auth/RegisterForm";

export default async function OwnerRegisterPage() {
  const t = await getTranslations("auth");
  return (
    <AuthCard title={t("ownerRegisterTitle")}>
      <RegisterForm role="OWNER" redirectTo="/owner/dashboard" loginHref="/auth/owner/login" />
    </AuthCard>
  );
}
