import type { Metadata } from "next";
import LoginClient from "./LoginClient";

export const metadata: Metadata = {
  title: "Log in — VedVani",
  description: "Log in to VedVani with a one-click email magic link to save conversations and memory notes to your account.",
};

export default function LoginPage() {
  return <LoginClient />;
}
