import { useSearchParams } from "react-router-dom";
import ChatBox from "../components/ChatBox";

export default function Chat() {
  // /chat?q=... → điền sẵn câu hỏi (từ nút "Hỏi AI" ở trang chi tiết), người dùng bấm Gửi
  const [params] = useSearchParams();
  const q = (params.get("q") || "").slice(0, 500);

  return (
    <div className="container" style={{ maxWidth: 820 }}>
      <h1 className="page-title">🤖 Trợ lý du lịch AI</h1>
      <p className="page-sub">
        Hỏi bất cứ điều gì về du lịch, văn hóa và đặc sản Đắk Lắk. AI trả lời dựa trên dữ liệu của website. Bạn nên
        kiểm tra lại giá vé và giờ mở cửa trước khi đi.
      </p>
      <ChatBox key={q} initialInput={q} />
    </div>
  );
}
