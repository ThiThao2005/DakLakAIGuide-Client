import { useState } from "react";
import ChatBox from "./ChatBox";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {open && (
        <div className="chat-popup" role="dialog" aria-label="Trợ lý AI">
          <div className="chat-popup-head">
            <span>🤖 Trợ lý DakLak AI</span>
            <button onClick={() => setOpen(false)} aria-label="Đóng">✕</button>
          </div>
          <ChatBox />
        </div>
      )}
      <button className="chat-fab" onClick={() => setOpen((v) => !v)} aria-label="Mở trợ lý AI">
        {open ? "✕" : "💬"}
      </button>
    </>
  );
}
