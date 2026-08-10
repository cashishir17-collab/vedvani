import { prisma } from "@/lib/prisma";
import ChatThread from "./ChatThread";

export const dynamic = "force-dynamic";

export default async function ChatPage({ params }: { params: { id: string } }) {
  const conversation = await prisma.conversation.findUnique({
    where: { id: params.id },
    include: {
      messages: {
        orderBy: { createdAt: "asc" },
        include: { citations: { include: { corpusPassage: true } } },
      },
    },
  });

  if (!conversation) {
    return (
      <div className="card">
        <p>Conversation not found.</p>
      </div>
    );
  }

  const initialMessages = conversation.messages.map((m: any) => ({
    id: m.id,
    role: m.role as "user" | "assistant",
    content: m.content,
    citations: m.citations.map((c: any) => ({
      id: c.id,
      title: c.corpusPassage.title,
      sourceWork: c.corpusPassage.sourceWork,
      location: c.corpusPassage.location,
      sourceType: c.corpusPassage.sourceType,
      attribution: c.corpusPassage.attribution,
      traditionTags: c.corpusPassage.traditionTags,
      snippet: c.snippet,
    })),
  }));

  return (
    <ChatThread
      conversationId={conversation.id}
      title={conversation.title}
      initialMessages={initialMessages}
    />
  );
}
