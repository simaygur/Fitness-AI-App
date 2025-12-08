import { CreateMLCEngine } from "@mlc-ai/web-llm";

let engine: any = null;

// Motoru sadece 1 kez başlat
export async function initAI() {
    if (!engine) {
        engine = await CreateMLCEngine("Llama-3.1-8B-Instruct-q4f32_1-MLC");
    }
    return engine;
}

export async function askAI(prompt: string) {
    const ai = await initAI();

    const reply = await ai.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
    });

    return reply.choices[0].message.content;
}
