import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function generateReply(message: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

//   const prompt = `
// You are an expert software architect.

// Convert the user's idea into a Mermaid flowchart.

// STRICT RULES (VERY IMPORTANT):
// 1. Output ONLY Mermaid code.
// 2. Do NOT include markdown (no \`\`\`).
// 3. Do NOT include explanations or extra text.
// 4. Always start with: flowchart LR
// 5. Keep output clean and minimal.

// FLOWCHART STYLE:
// - Use this exact structure:
//   flowchart LR
//     A[Start] --> B[Step]
//     B --> C{Decision}
//     C -->|Yes| D[Result]
//     C -->|No| E[Alternative]

// NODE RULES:
// - Use [ ] for processes
// - Use { } for decisions
// - Use ( ) for start/end
// - Use short readable labels
// - Use arrows like --> and label them when needed

// LOGIC RULES:
// - Understand what the user wants to build
// - Break it into logical steps
// - Include decisions where needed
// - Include API/backend/db if relevant
// - Keep it simple but meaningful

// IF INPUT IS UNCLEAR:
// - Generate a generic app flow

// USER INPUT:
// ${message}

// OUTPUT:
// `;

  const prompt = `
You are an expert software architect.

Convert the user's idea into a Mermaid flowchart.

STRICT RULES (VERY IMPORTANT):
1. Output ONLY Mermaid code.
2. Do NOT include markdown (no \`\`\`).
3. Do NOT include explanations or extra text.
4. Always start with: flowchart LR
5. Keep output clean and minimal.

FLOWCHART STYLE:
- Use this exact structure:
  flowchart LR
    A[Start]:::c1 --> B[Step]:::c2
    B:::c2 --> C{Decision}:::c3
    C:::c3 -->|Yes| D[fa:fa-icon Result]:::c4
    C:::c3 -->|No| E[fa:fa-icon Alternative]:::c5

NODE RULES:
- Use [ ] for processes
- Use { } for decisions
- Use ( ) for start/end
- Use [()] for databases
- Use fa:fa-icon for icons
- Use short readable labels
- Use arrows like --> and label them when needed

COLOR DEFINITIONS (MANDATORY):
classDef c1 fill:#eef2ff,stroke:#6366f1,color:#1e293b;
classDef c2 fill:#ecfdf5,stroke:#22c55e,color:#1e293b;
classDef c3 fill:#fffbeb,stroke:#f59e0b,color:#1e293b;
classDef c4 fill:#eff6ff,stroke:#3b82f6,color:#1e293b;
classDef c5 fill:#fef2f2,stroke:#ef4444,color:#1e293b;

LOGIC RULES:
- Understand what the user wants to build
- Break it into logical steps
- Include decisions where needed
- Include API/backend/db if relevant
- Keep it simple but meaningful

IF INPUT IS UNCLEAR:
- Generate a generic app flow

USER INPUT:
${message}

OUTPUT:
`;


  try {
    const result = await model.generateContent(prompt); // Generate the flowchart using the prompt
    let text = result.response.text().trim(); // Get the text response and trim whitespace

    // Clean unwanted markdown if model still adds it
    text = text.replace(/```[\s\S]*?```/g, "").trim();

    // Ensure valid flowchart start
    if (!text.startsWith("flowchart")) {
      return "flowchart LR\nA(Start) --> B[Invalid AI Output]";
    }

    return text;
  } catch (error) {
    console.error("AI Error:", error);

    // Fallback diagram
    return `flowchart LR
A(Start) --> B[Error generating diagram]
B --> C[Try again]`;
  }
}
