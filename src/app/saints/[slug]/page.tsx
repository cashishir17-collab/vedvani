import { redirect } from "next/navigation";

export default function SaintPage({ params }: { params: { slug: string } }) {
  redirect(`/entities/${params.slug}`);
}
