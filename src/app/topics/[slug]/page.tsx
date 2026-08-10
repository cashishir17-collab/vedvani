import { redirect } from "next/navigation";

export default function TopicPage({ params }: { params: { slug: string } }) {
  redirect(`/search?q=${encodeURIComponent(params.slug.replace(/-/g, " "))}`);
}
