import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.3-70b-versatile";

const SYSTEM_PROMPT = `Voce e o Bud, assistente especialista em cultivo de cannabis do GrowMate. Voce fala portugues brasileiro, de forma informal e amigavel, mas sempre com informacoes precisas e praticas.

Suas areas de conhecimento:
- Cultivo indoor e outdoor (iluminacao LED, HPS, ciclos de luz)
- Nutrientes: NPK, micro e macronutrientes, pH (ideal 6.0-7.0 solo, 5.5-6.5 hidro), EC
- Substratos: solo, coco, hidroponia, mixes
- Fases da planta: germinacao, muda, vegetativo, floracao, colheita, cura
- Problemas comuns: deficiencias nutricionais (N, P, K, Ca, Mg, Fe), pragas (acaros, tripes, fungus gnats), mofo, bolor
- Rega: frequencia, quantidade, runoff, overwatering vs underwatering
- Treinamento: LST, HST, topping, FIM, SCROG, SOG, lollipopping
- Colheita: tricomas (transparente, leitoso, ambar), flush, secagem (60% umidade, 15-20C), cura

Regras:
- Sempre de conselhos praticos e acionaveis
- Se nao souber algo com certeza, diga que nao tem certeza
- Use termos tecnicos mas explique quando necessario
- Respostas concisas mas completas (2-4 paragrafos max)
- Nunca recomende produtos quimicos perigosos sem avisar sobre seguranca
- Se o usuario tiver plantas cadastradas, use o contexto delas para personalizar as respostas`;

function buildSystemPrompt(plants?: PlantContext[]): string {
  if (!plants || plants.length === 0) return SYSTEM_PROMPT;

  const plantInfo = plants
    .map(
      (p) =>
        `- ${p.name}: strain ${p.strain || "desconhecida"}, fase ${p.phase}, substrato ${p.substrate}, genetica ${p.gen_type}, saude ${p.health}%, dia ${p.days}`
    )
    .join("\n");

  return `${SYSTEM_PROMPT}\n\nPlantas do usuario:\n${plantInfo}\n\nUse essas informacoes para contextualizar suas respostas quando relevante.`;
}

interface PlantContext {
  name: string;
  strain: string | null;
  phase: string;
  substrate: string;
  gen_type: string;
  health: number;
  days: number;
}

interface ChatRequestBody {
  messages: { role: "user" | "assistant"; content: string }[];
  plants?: PlantContext[];
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Nao autorizado" }, { status: 401 });
    }

    // Check freemium limit
    const { data: canSend, error: rpcError } = await supabase.rpc(
      "can_send_message",
      { p_user_id: user.id }
    );

    if (rpcError) {
      console.error("RPC can_send_message error:", rpcError);
      return NextResponse.json(
        { error: "Erro ao verificar limite" },
        { status: 500 }
      );
    }

    if (!canSend) {
      return NextResponse.json(
        { error: "Limite diario atingido. Assine o PRO!" },
        { status: 429 }
      );
    }

    const body: ChatRequestBody = await request.json();
    const { messages, plants } = body;

    if (!messages || messages.length === 0) {
      return NextResponse.json(
        { error: "Mensagens obrigatorias" },
        { status: 400 }
      );
    }

    const lastUserMessage = messages[messages.length - 1];
    if (lastUserMessage.role !== "user") {
      return NextResponse.json(
        { error: "Ultima mensagem deve ser do usuario" },
        { status: 400 }
      );
    }

    const systemPrompt = buildSystemPrompt(plants);

    // Build messages for Groq (last 20 messages for context window)
    const contextMessages = messages.slice(-20).map((m) => ({
      role: m.role,
      content: m.content,
    }));

    const groqResponse = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          { role: "system", content: systemPrompt },
          ...contextMessages,
        ],
        temperature: 0.7,
        max_tokens: 1024,
        stream: true,
      }),
    });

    if (!groqResponse.ok) {
      const err = await groqResponse.text();
      console.error("Groq API error:", groqResponse.status, err);
      return NextResponse.json(
        { error: "Erro na IA. Tente novamente." },
        { status: 502 }
      );
    }

    // Stream the response
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
    let fullResponse = "";

    const stream = new ReadableStream({
      async start(controller) {
        const reader = groqResponse.body?.getReader();
        if (!reader) {
          controller.close();
          return;
        }

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split("\n").filter((l) => l.trim() !== "");

            for (const line of lines) {
              if (line.startsWith("data: ")) {
                const data = line.slice(6);
                if (data === "[DONE]") continue;

                try {
                  const parsed = JSON.parse(data);
                  const content = parsed.choices?.[0]?.delta?.content;
                  if (content) {
                    fullResponse += content;
                    controller.enqueue(
                      encoder.encode(`data: ${JSON.stringify({ content })}\n\n`)
                    );
                  }
                } catch {
                  // Skip malformed chunks
                }
              }
            }
          }

          // After streaming is complete, save messages and increment usage
          // Save user message
          await supabase.from("chat_messages").insert({
            user_id: user.id,
            role: "user",
            content: lastUserMessage.content,
          });

          // Save assistant response
          if (fullResponse) {
            await supabase.from("chat_messages").insert({
              user_id: user.id,
              role: "assistant",
              content: fullResponse,
            });
          }

          // Increment usage
          await supabase.rpc("increment_chat_usage", {
            p_user_id: user.id,
          });

          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`)
          );
          controller.close();
        } catch (err) {
          console.error("Stream error:", err);
          controller.error(err);
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    console.error("Chat API error:", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
