import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  MessageCircle,
  X,
  Send,
  Square,
  Sparkles,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useChat } from "./useChat";

// ==========================================
// Typewriter Effect
// ==========================================
function TypewriterText({
  text,
  speed = 20,
  stopTyping = false,
  onUpdate,
  onTypingChange,
}) {
  const [visibleText, setVisibleText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const intervalRef = useRef(null);
  const callbacksRef = useRef({ onUpdate, onTypingChange });

  useEffect(() => {
    callbacksRef.current = { onUpdate, onTypingChange };
  }, [onUpdate, onTypingChange]);

  useEffect(() => {
    const characters = Array.from(text || "");
    let index = 0;
    setVisibleText("");
    if (!characters.length) return;

    setIsTyping(true);
    callbacksRef.current.onTypingChange?.(true);

    intervalRef.current = setInterval(() => {
      index++;
      setVisibleText(characters.slice(0, index).join(""));
      callbacksRef.current.onUpdate?.();

      if (index >= characters.length) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        setIsTyping(false);
        callbacksRef.current.onTypingChange?.(false);
      }
    }, speed);

    return () => {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    };
  }, [text, speed]);

  useEffect(() => {
    if (!stopTyping) return;
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    setIsTyping(false);
    callbacksRef.current.onTypingChange?.(false);
  }, [stopTyping]);

  return (
    <span className="whitespace-pre-wrap break-words">
      {visibleText}
      {isTyping && (
        <motion.span
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.8, repeat: Infinity }}
          className="ml-0.5 inline-block text-porto-gold drop-shadow-[0_0_5px_rgba(255,215,0,0.5)]"
        >
          |
        </motion.span>
      )}
    </span>
  );
}

// ==========================================
// Chat Widget
// ==========================================
export default function ChatWidget() {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [stopTyping, setStopTyping] = useState(false);

  const { messages, loading, send, cancel } = useChat();
  const isFa = i18n.language === "fa";
  const messagesEndRef = useRef(null);

  const busy = loading || typing;

  const scrollToBottom = (behavior = "smooth") => {
    messagesEndRef.current?.scrollIntoView({ behavior, block: "end" });
  };

  useEffect(() => {
    if (open) scrollToBottom();
  }, [messages, loading, open]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const message = input.trim();
    if (!message || busy) return;
    
    setStopTyping(false);
    setTyping(false);
    send(message);
    setInput("");
    requestAnimationFrame(() => scrollToBottom());
  };

  const suggestions = isFa
    ? ["قوی‌ترین پروژه‌ات چیه؟", "با چه تکنولوژی‌هایی کار می‌کنی؟"]
    : ["What's your strongest project?", "What technologies do you use?"];

  const handleSuggestion = (question) => {
    if (busy) return;
    setStopTyping(false);
    setTyping(false);
    send(question);
    requestAnimationFrame(() => scrollToBottom());
  };

  const handleStop = () => {
    if (loading) cancel();
    if (typing) {
      setStopTyping(true);
      setTyping(false);
    }
  };

  const lastAssistantIndex = messages.reduce(
    (last, message, index) => (message.role === "assistant" ? index : last),
    -1
  );

  return (
    <>
      {/* Floating Button with Glow */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="group fixed bottom-6 right-6 z-50 grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-porto-gold to-yellow-600 text-black shadow-[0_0_20px_rgba(255,215,0,0.3)] transition-all duration-300 hover:scale-110 hover:shadow-[0_0_30px_rgba(255,215,0,0.5)]"
        aria-label="Chat"
      >
        <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={open ? "x" : "chat"}
            initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.2 }}
            className="relative z-10"
          >
            {open ? <X size={22} /> : <MessageCircle size={22} />}
          </motion.span>
        </AnimatePresence>
      </button>

      {/* Glassmorphism Chat Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-24 right-6 z-50 flex h-[550px] w-[min(92vw,390px)] flex-col overflow-hidden rounded-[2rem] border border-white/20 bg-porto-bg/60 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] backdrop-blur-2xl backdrop-saturate-150"
            dir={isFa ? "rtl" : "ltr"}
          >
            {/* Background Ambient Glows */}
            <div className="pointer-events-none absolute -left-20 -top-20 h-40 w-40 rounded-full bg-porto-gold/10 blur-[60px]" />
            <div className="pointer-events-none absolute -bottom-20 -right-20 h-40 w-40 rounded-full bg-blue-500/10 blur-[60px]" />

            {/* Header */}
            <div className="relative z-10 flex items-center gap-3 border-b border-white/10 bg-white/5 px-5 py-4 backdrop-blur-md">
              <div className="grid h-8 w-8 place-items-center rounded-full bg-porto-gold/20 text-porto-gold">
                <Sparkles size={16} />
              </div>
              <div className="text-sm font-bold tracking-wide text-porto-fg">
                {isFa ? "دستیار هوشمند" : "AI Assistant"}
              </div>
              <div className="ml-auto flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-2.5 py-1">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                </span>
                <span className="text-[10px] font-medium text-white/70">
                  {isFa ? "آنلاین" : "Online"}
                </span>
              </div>
            </div>

            {/* Messages Area */}
            <div className="relative z-10 flex-1 space-y-4 overflow-y-auto overflow-x-hidden px-5 py-4 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
              {messages.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="space-y-4"
                >
                  <div className="rounded-2xl rounded-tl-sm border border-white/10 bg-white/5 p-4 shadow-sm">
                    <p className="text-xs leading-relaxed text-porto-text/80">
                      {isFa
                        ? "سلام! من دستیار هوش مصنوعی هستم. هر سوالی درباره کارها و مهارت‌های پوریا داری بپرس."
                        : "Hi! I'm the AI assistant. Ask me anything about Pouriya's work and skills."}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {suggestions.map((s) => (
                      <button
                        key={s}
                        onClick={() => handleSuggestion(s)}
                        disabled={busy}
                        className="rounded-full border border-porto-gold/30 bg-porto-gold/5 px-4 py-2 text-xs text-porto-text transition-all hover:border-porto-gold hover:bg-porto-gold/20 hover:text-porto-fg hover:shadow-[0_0_15px_rgba(255,215,0,0.2)] disabled:opacity-50"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              <AnimatePresence initial={false}>
                {messages.map((m, i) => (
                  <motion.div
                    key={i}
                    layout
                    initial={{ opacity: 0, y: 18, scale: 0.95, filter: "blur(5px)" }}
                    animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-7 shadow-lg ${
                        m.role === "user"
                          ? "rounded-br-sm bg-gradient-to-br from-porto-gold to-yellow-600 text-black shadow-porto-gold/20"
                          : "rounded-bl-sm border border-white/10 bg-white/10 text-porto-fg backdrop-blur-md"
                      }`}
                    >
                      {m.role === "assistant" && i === lastAssistantIndex ? (
                        <TypewriterText
                          text={m.content}
                          speed={20}
                          stopTyping={stopTyping}
                          onTypingChange={setTyping}
                          onUpdate={() => messagesEndRef.current?.scrollIntoView({ behavior: "auto", block: "end" })}
                        />
                      ) : (
                        m.content
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Loading Animation */}
              <AnimatePresence>
                {loading && (
                  <motion.div
                    initial={{ opacity: 0, y: 12, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.9 }}
                    transition={{ duration: 0.25 }}
                    className="flex justify-start"
                  >
                    <div className="flex items-center gap-3 rounded-2xl rounded-bl-sm border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-md">
                      <Sparkles size={14} className="animate-pulse text-porto-gold" />
                      <div className="flex items-center gap-1">
                        {[0, 1, 2].map((dot) => (
                          <motion.span
                            key={dot}
                            animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
                            transition={{ duration: 0.65, repeat: Infinity, delay: dot * 0.15, ease: "easeInOut" }}
                            className="h-1.5 w-1.5 rounded-full bg-porto-gold drop-shadow-[0_0_4px_rgba(255,215,0,0.8)]"
                          />
                        ))}
                      </div>
                      <span className="text-[10px] tracking-wide text-porto-text/60">
                        {isFa ? "در حال تحلیل..." : "Analyzing..."}
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <div className="relative z-10 border-t border-white/10 bg-white/5 p-4 backdrop-blur-md">
              <form onSubmit={handleSubmit} className="relative flex items-center gap-2">
                <div className="relative flex-1">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={isFa ? "پیامت رو بنویس..." : "Type a message..."}
                    className="w-full rounded-full border border-white/10 bg-black/20 py-3 pl-5 pr-12 text-sm text-porto-fg outline-none transition-all placeholder:text-porto-text/40 focus:border-porto-gold/50 focus:bg-black/40 focus:ring-1 focus:ring-porto-gold/50"
                    disabled={busy}
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2">
                    <AnimatePresence mode="wait" initial={false}>
                      {busy ? (
                        <motion.button
                          key="stop"
                          type="button"
                          onClick={handleStop}
                          initial={{ opacity: 0, scale: 0.6, rotate: -90 }}
                          animate={{ opacity: 1, scale: 1, rotate: 0 }}
                          exit={{ opacity: 0, scale: 0.6, rotate: 90 }}
                          transition={{ duration: 0.2 }}
                          className="grid h-9 w-9 place-items-center rounded-full bg-red-500/20 text-red-400 transition hover:scale-105 hover:bg-red-500/30"
                        >
                          <Square size={14} fill="currentColor" />
                        </motion.button>
                      ) : (
                        <motion.button
                          key="send"
                          type="submit"
                          disabled={!input.trim()}
                          initial={{ opacity: 0, scale: 0.6, rotate: 90 }}
                          animate={{ opacity: 1, scale: 1, rotate: 0 }}
                          exit={{ opacity: 0, scale: 0.6, rotate: -90 }}
                          transition={{ duration: 0.2 }}
                          className="grid h-9 w-9 place-items-center rounded-full bg-porto-gold text-black shadow-[0_0_15px_rgba(255,215,0,0.3)] transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
                        >
                          <Send size={15} className={isFa ? "rotate-180" : ""} />
                        </motion.button>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </form>
              <div className="mt-3 text-center">
                <span className="text-[10px] text-porto-text/30">
                  Powered by AI • {new Date().getFullYear()}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}