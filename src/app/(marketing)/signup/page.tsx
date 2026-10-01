import type { Metadata } from "next";
import { AuthForm } from "@/components/marketing/auth-form";

export const metadata: Metadata = {
  title: "Get started",
  description: "Create a Signalpost workspace and start researching Norwegian companies.",
};

export default function SignupPage() {
  return <AuthForm mode="signup" />;
}
