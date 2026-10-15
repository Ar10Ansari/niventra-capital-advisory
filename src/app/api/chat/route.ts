import { NextResponse } from "next/server";
import { queryKnowledgeBase } from "@/lib/ai/knowledge";
import { getCurrentUser } from "@/lib/auth/session";
import { logAuditEvent } from "@/lib/audit";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message } = body;

    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json(
        { error: "Message query is required." },
        { status: 400 }
      );
    }

    const currentUser = await getCurrentUser();

    // Query grounded institutional knowledge base
    const groundedResult = queryKnowledgeBase(message);

    // Write audit event
    logAuditEvent({
      actorId: currentUser?.id || null,
      actorEmail: currentUser?.email || "ANONYMOUS",
      actorRole: currentUser?.role || "PUBLIC",
      action: "AI_CHAT_QUERY",
      resourceType: "AI_ASSISTANT",
      details: {
        queryLength: message.length,
        isConfident: groundedResult.isConfident,
        citationsCount: groundedResult.citations.length,
      },
    });

    return NextResponse.json({
      success: true,
      answer: groundedResult.answer,
      citations: groundedResult.citations,
      isConfident: groundedResult.isConfident,
      needsAdvisoryEscalation: groundedResult.needsAdvisoryEscalation,
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json({ error: "Failed to process chat query." }, { status: 500 });
  }
}
