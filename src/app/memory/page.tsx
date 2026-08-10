import { prisma } from "@/lib/prisma";
import { getOrCreateGuestSession } from "@/lib/guestSession";
import MemoryList from "./MemoryList";

export const dynamic = "force-dynamic";

export default async function MemoryPage() {
  const { guestSessionId } = await getOrCreateGuestSession();

  const items = await prisma.memoryItem.findMany({
    where: { guestSessionId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="card">
      <h2 style={{ marginTop: 0 }}>Memory</h2>
      <p className="muted">
        This is basic, stub-level memory for this slice: opt-in notes tied to your guest session,
        fully viewable and deletable here. VedVani does not use this memory for anything beyond
        this page yet.
      </p>
      <MemoryList
        initialItems={items.map((i) => ({ id: i.id, content: i.content, createdAt: i.createdAt.toISOString() }))}
      />
    </div>
  );
}
