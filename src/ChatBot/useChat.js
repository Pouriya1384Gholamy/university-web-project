
import { useState, useRef, useCallback } from "react";

const WEBHOOK_URL = "http://localhost:5678/webhook/brand-bot";

export function useChat() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  // کنترل درخواست فعال
  const controllerRef = useRef(null);

  // ارسال پیام
  const send = useCallback(async (text) => {
    if (!text.trim() || controllerRef.current) return;

    const controller = new AbortController();
    controllerRef.current = controller;

    const userMsg = {
      role: "user",
      content: text,
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: text,
          sessionId: "user-" + Date.now(),
        }),
        signal: controller.signal,
      });

      if (!res.ok) {
        throw new Error("Server error: " + res.status);
      }

      const data = await res.json();

      // اگر درخواست لغو شده باشد، پاسخ را نادیده بگیر
      if (controller.signal.aborted) return;

      const botReply =
        data.output ||
        data.text ||
        data.response ||
        data.message ||
        "پاسخی دریافت نشد.";

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: botReply,
        },
      ]);

    } catch (err) {
      // لغو درخواست نباید پیام خطا ایجاد کند
      if (err.name === "AbortError") {
        return;
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "خطا در ارتباط با سرور. لطفاً بعداً تلاش کن.",
        },
      ]);

    } finally {
      // فقط درخواست فعال اجازه تغییر وضعیت را دارد
      if (controllerRef.current === controller) {
        controllerRef.current = null;
        setLoading(false);
      }
    }
  }, []);

  // توقف درخواست API
  const cancel = useCallback(() => {
    if (!controllerRef.current) return;

    controllerRef.current.abort();
    controllerRef.current = null;

    setLoading(false);
  }, []);

  return {
    messages,
    loading,
    send,
    cancel,
  };
}
