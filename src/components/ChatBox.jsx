import { useEffect, useRef, useState } from "react";
import chatApi from "../api/chatApi";
import { getErrorMessage } from "../api/axiosClient";
import Markdown from "./Markdown";

const STORAGE_KEY = "daklak_chat";
const WELCOME = {
  role: "assistant",
  content:
    "Xin chào! Mình là **DakLak AI Guide** 👋\nBạn muốn tìm hiểu địa điểm du lịch, văn hóa Tây Nguyên hay đặc sản OCOP của Đắk Lắk?",
};
const SUGGESTIONS = [
  "Gợi ý lịch trình 2 ngày ở Buôn Ma Thuột",
  "Nên mua đặc sản gì làm quà?",
  "Kể về văn hóa cồng chiêng Tây Nguyên",
  "Địa điểm nào nổi bật nhất?",
];

function loadHistory() {
  try {
    const saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY));
    return Array.isArray(saved) && saved.length ? saved : [WELCOME];
  } catch {
    return [WELCOME];
  }
}

export default function ChatBox({ initialInput = "" }) {
  const [messages, setMessages] = useState(loadHistory);
  const [input, setInput] = useState(initialInput);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const endRef = useRef(null);

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      /* bỏ qua nếu trình duyệt chặn storage */
    }
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, sending]);

  const send = async (text) => {
    const content = text.trim();
    if (!content || sending) return;

    const next = [...messages, { role: "user", content }];
    setMessages(next);
    setInput("");
    setError("");
    setSending(true);

    try {
      // Không gửi lời chào mặc định lên server
      const history = next.filter((m) => m !== WELCOME);
      const res = await chatApi.ask(history);
      setMessages((prev) => [...prev, { role: "assistant", content: res.data.reply }]);
    } catch (err) {
      setError(getErrorMessage(err, "Chatbot không phản hồi, vui lòng thử lại."));
      setMessages((prev) => prev.slice(0, -1));
      setInput(content);
    } finally {
      setSending(false);
    }
  };

  const reset = () => {
    setMessages([WELCOME]);
    setError("");
  };

  return (
    <div className="chat">
      <div className="chat-messages" aria-live="polite">
        {messages.map((m, i) => (
          <div key={i} className={`msg ${m.role === "user" ? "msg-user" : "msg-assistant"}`}>
            {m.role === "user" ? m.content : <Markdown text={m.content} />}
          </div>
        ))}
        {sending && (
          <div className="msg msg-assistant typing" aria-label="Đang trả lời">
            <span /> <span /> <span />
          </div>
        )}
        {error && <div className="msg msg-error">{error}</div>}
        <div ref={endRef} />
      </div>

      {messages.length <= 1 && (
        <div className="chat-suggest">
          {SUGGESTIONS.map((s) => (
            <button key={s} className="chip" onClick={() => send(s)} disabled={sending}>
              {s}
            </button>
          ))}
        </div>
      )}

      <form
        className="chat-form"
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
      >
        <input
          className="input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Nhập câu hỏi..."
          maxLength={2000}
          aria-label="Câu hỏi"
        />
        <button className="btn btn-accent" disabled={sending || !input.trim()}>
          Gửi
        </button>
        {messages.length > 1 && (
          <button type="button" className="btn btn-ghost btn-sm" onClick={reset} title="Cuộc trò chuyện mới">
            ↺
          </button>
        )}
      </form>
    </div>
  );
}
