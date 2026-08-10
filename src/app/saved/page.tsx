import { redirect } from "next/navigation";

export default function SavedPage() {
  // Bookmarks already implement "saved verses" — keep one canonical page.
  redirect("/bookmarks");
}
