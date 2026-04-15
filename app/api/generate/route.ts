import { NextResponse } from "next/server";
import { generateReply } from "@/lib/gemini";

export async function POST(req: Request) {
  try {
    const body = await req.json(); // Parse the request body
    const message = body.message?.trim(); // Extract and trim the message from the body

    // Validate input
    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Call AI function
    const diagram = await generateReply(message);

    // Return clean Mermaid string
    return NextResponse.json({
      success: true,
      diagram,
    });

  } catch (error) {
    console.error("API Error:", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Something went wrong",
      },
      { status: 500 }
    );
  }
}