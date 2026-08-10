import type { Metadata } from "next";
import HomeClient from "./HomeClient";

export const metadata: Metadata = {
  title: "VedVani — Ask about Hindu scripture and tradition",
  description:
    "Ask questions about Hindu scripture, philosophy, and tradition and get answers grounded in cited primary sources.",
};

export default function HomePage() {
  return <HomeClient />;
}
