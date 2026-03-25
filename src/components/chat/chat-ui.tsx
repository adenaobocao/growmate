"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { toast } from "sonner";
import type { ChatMessage, Plant } from "@/types/database";

interface PlantContext {
  name: string;
  strain: string | null;
  phase: string;
  substrate: string;
  gen_type: string;
  health: number;
  days: number;
}

interface ChatUIProps {
  initialMessages: ChatMessage[];
  plants: Plant[];
  plan: "FREE" | "PRO";
  todayUsage: number;
  maxMessages: number;
}

const SUGGESTIONS = [
  "Como regar na flora?",
  "Deficiencia de nitrogenio",
  "Quando colher?",
  "pH ideal?",
];

const MAX_CHARS = 1000;

function getDays(startDate: string): number {
  const start = new Date(startDate);
  const now = new Date();
  return Math.max(0, Math.floor((now.getTime() - start.getTime()) / 86400000));
}

export function ChatUI({
  initialMessages,
  plants,
  plan,
  todayUsage,
  maxMessages,
}: ChatUIProps) {
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; content: string; failed?: boolean }[]
  >(
    initialMessages.map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    }))
  );
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [usage, setUsage] = useState(todayUsage);
  const [limitReached, setLimitReached] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isUserAtBottomRef = useRef(true);

  const scrollToBottom = useCallback(() => {
    if (isUserAtBottomRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  // Track if user is at bottom of scroll
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    function handleScroll() {
      if (!container) return;
      const { scrollTop, scrollHeight, clientHeight } = container;
      isUserAtBottomRef.current = scrollHeight - scrollTop - clientHeight < 80;
    }

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const plantsContext: PlantContext[] = plants.map((p) => ({
    name: p.name,
    strain: p.strain,
    phase: p.phase,
    substrate: p.substrate,
    gen_type: p.gen_type,
    health: p.health,
    days: getDays(p.start_date),
  }));

  async function sendMessage(text: string) {
    if (!text.trim() || isLoading) return;

    const userMessage = { role: "user" as const, content: text.trim() };
    const updatedMessages = [...messages.filter((m) => !m.failed), userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages.map(({ role, content }) => ({ role, content })),
          plants: plantsContext.length > 0 ? plantsContext : undefined,
        }),
      });

      if (res.status === 429) {
        setLimitReached(true);
        toast.error("Limite diario atingido!");
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "Voce atingiu o limite diario de mensagens do plano gratuito. Assine o PRO para conversar sem limites!",
          },
        ]);
        setIsLoading(false);
        return;
      }

      if (!res.ok) {
        throw new Error("Erro na resposta");
      }

      // Read SSE stream
      const reader = res.body?.getReader();
      if (!reader) throw new Error("No reader");

      const decoder = new TextDecoder();
      let assistantContent = "";

      // Add empty assistant message
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n").filter((l) => l.trim() !== "");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            try {
              const parsed = JSON.parse(data);
              if (parsed.done) continue;
              if (parsed.content) {
                assistantContent += parsed.content;
                setMessages((prev) => {
                  const updated = [...prev];
                  updated[updated.length - 1] = {
                    role: "assistant",
                    content: assistantContent,
                  };
                  return updated;
                });
              }
            } catch {
              // Skip malformed chunks
            }
          }
        }
      }

      setUsage((prev) => prev + 1);
    } catch (err) {
      console.error("Chat error:", err);
      // Mark last user message as failed for retry
      setMessages((prev) => {
        const updated = [...prev];
        // Remove the empty assistant message if it exists
        if (updated.length > 0 && updated[updated.length - 1].role === "assistant" && updated[updated.length - 1].content === "") {
          updated.pop();
        }
        // Mark user message as failed
        const lastUserIdx = updated.findLastIndex((m) => m.role === "user");
        if (lastUserIdx >= 0) {
          updated[lastUserIdx] = { ...updated[lastUserIdx], failed: true };
        }
        return updated;
      });
      toast.error("Erro ao enviar mensagem. Tente novamente.");
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  }

  function handleRetry(msgContent: string) {
    sendMessage(msgContent);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    sendMessage(input);
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    if (val.length <= MAX_CHARS) {
      setInput(val);
    }
  }

  const showSuggestions = messages.length === 0;
  const isFreePlan = plan === "FREE";
  const charCount = input.length;
  const showCharCount = charCount > MAX_CHARS * 0.7;

  return (
    <div className="absolute inset-0 flex flex-col">
      {/* Usage counter for FREE users */}
      {isFreePlan && (
        <div className="flex-shrink-0 px-4 py-2 flex items-center justify-between border-b border-grow-border bg-grow-surface">
          <span className="text-[10px] text-grow-muted font-bold uppercase tracking-wider">
            Mensagens hoje
          </span>
          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-bold ${
                usage >= maxMessages ? "text-grow-danger" : "text-grow-primary"
              }`}
            >
              {usage}/{maxMessages}
            </span>
            {usage >= maxMessages - 2 && usage < maxMessages && (
              <Link
                href="/upgrade"
                className="text-[9px] font-bold text-grow-warning hover:underline"
              >
                Quase no limite!
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Messages area */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto px-4 py-4 space-y-3"
      >
        {showSuggestions && (
          <div className="flex flex-col items-center justify-center h-full gap-6">
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-grow-primary/10 border border-grow-primary/20 flex items-center justify-center mx-auto mb-3">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-grow-primary">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <h3 className="font-display text-lg font-bold text-grow-text">
                Fala, grower!
              </h3>
              <p className="text-body-sm mt-1 max-w-[260px]">
                Sou o Bud, seu assistente de cultivo. Pergunta qualquer coisa
                sobre suas plantas!
              </p>
            </div>

            <div className="flex flex-wrap gap-2 justify-center max-w-[320px]">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  className="px-3 py-1.5 rounded-xl border border-grow-border-strong bg-grow-tint text-[11px] text-grow-muted font-semibold hover:border-grow-primary hover:text-grow-primary transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            } animate-fade-in`}
          >
            <div className="max-w-[82%]">
              <div
                className={`px-3.5 py-2.5 text-[13px] leading-relaxed whitespace-pre-wrap ${
                  msg.role === "user"
                    ? "bg-grow-primary/15 border border-grow-primary/15 text-grow-text rounded-2xl rounded-br-md"
                    : "bg-grow-surface border border-grow-border text-grow-text rounded-2xl rounded-bl-md"
                } ${msg.failed ? "border-grow-danger/30 bg-grow-danger/5" : ""}`}
              >
                {msg.content}
              </div>
              {/* Retry button for failed messages */}
              {msg.failed && (
                <button
                  onClick={() => handleRetry(msg.content)}
                  className="mt-1 text-[10px] font-bold text-grow-danger hover:text-grow-danger/80 flex items-center gap-1 ml-auto"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="1 4 1 10 7 10" />
                    <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                  </svg>
                  Tentar novamente
                </button>
              )}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isLoading && messages[messages.length - 1]?.role === "user" && (
          <div className="flex justify-start animate-fade-in">
            <div className="bg-grow-surface border border-grow-border rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex gap-1.5 items-center">
                <span className="w-2 h-2 rounded-full bg-grow-primary/60 animate-bounce [animation-delay:0ms]" />
                <span className="w-2 h-2 rounded-full bg-grow-primary/60 animate-bounce [animation-delay:150ms]" />
                <span className="w-2 h-2 rounded-full bg-grow-primary/60 animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          </div>
        )}

        {/* Limit reached upgrade prompt */}
        {limitReached && (
          <div className="flex justify-center my-4 animate-fade-in">
            <div className="card text-center px-5 py-4 max-w-[300px]">
              <p className="text-body-sm mb-3">
                Limite diario atingido no plano gratuito
              </p>
              <Link
                href="/upgrade"
                className="btn-primary inline-flex items-center gap-2 px-5 py-2.5 text-xs"
              >
                Assinar PRO - R$9,90/mes
              </Link>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input bar */}
      <div className="flex-shrink-0 px-3 pb-3 pt-2 border-t border-grow-border bg-grow-surface backdrop-blur-lg">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={handleInputChange}
              placeholder={
                limitReached
                  ? "Limite atingido..."
                  : "Pergunta pro Bud..."
              }
              disabled={isLoading || limitReached}
              maxLength={MAX_CHARS}
              className="w-full bg-grow-surface-alt border border-grow-border rounded-xl px-3.5 py-2.5 text-sm text-grow-text placeholder:text-grow-muted outline-none focus:border-grow-primary/25 transition-colors disabled:opacity-40"
            />
            {showCharCount && (
              <span
                className={`absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-bold ${
                  charCount >= MAX_CHARS ? "text-grow-danger" : "text-grow-muted"
                }`}
              >
                {charCount}/{MAX_CHARS}
              </span>
            )}
          </div>
          <button
            type="submit"
            disabled={!input.trim() || isLoading || limitReached}
            className="w-10 h-10 rounded-xl flex items-center justify-center bg-grow-primary text-white disabled:opacity-30 transition-opacity flex-shrink-0"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
