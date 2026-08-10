import type { Metadata } from "next";
import HomeClient from "../HomeClient";

export const metadata: Metadata = {
  title: "Ask VedVani",
  description: "Ask a question about Hindu scripture, philosophy and tradition, grounded in cited sources.",
};

export default function AskPage({ searchParams }: { searchParams?: { about?: string } }) {
  return <HomeClient prefill={searchParams?.about ? `About ${searchParams.about}: ` : undefined} />;
}
