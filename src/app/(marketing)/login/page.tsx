import type { Metadata } from "next";
import { AuthForm } from "@/components/marketing/auth-form";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your Signalpost research workspace.",
};

export default function LoginPage() {
  return <AuthForm mode="login" />;
}
