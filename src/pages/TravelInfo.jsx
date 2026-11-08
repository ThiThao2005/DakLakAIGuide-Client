import { Link } from "react-router-dom";

// Thông tin tham khảo, nên kiểm tra lại trước chuyến đi (giá vé, lịch bay thay đổi theo thời điểm)
const sections = [
  {
    id: "thoi-diem",
    icon: "🌤️",
    title: "Thời điểm đẹp nhất",
    items: [
      "Đắk Lắk có hai mùa rõ rệt: mùa khô (khoảng tháng 11 đến tháng 4) và mùa mưa (khoảng tháng 5 đến tháng 10).",
      "Mùa khô trời trong, ít mưa, thuận tiện tham quan thác, hồ và buôn làng. Đây là thời điểm được nhiều du khách chọn nhất.",
      "Khoảng tháng 2 đến tháng 3, hoa cà phê nở trắng các đồi, cũng là dịp diễn ra nhiều lễ hội lớn.",
      "Mùa mưa cây cối xanh tốt, thác nhiều nước và đẹp hơn, nhưng đường đến một số thác có thể trơn trượt.",
      "Khí hậu cao nguyên mát mẻ quanh năm; ban đêm và sáng sớm khá lạnh nên mang theo áo khoác.",
    ],
  },
  {
    id: "di-chuyen-den",
    icon: "✈️",
    title: "Cách đến Buôn Ma Thuột",
    items: [
      "Máy bay: Cảng hàng không Buôn Ma Thuột (mã BMV) cách trung tâm thành phố khoảng 8 km, có đường bay từ Hà Nội, TP. Hồ Chí Minh và một số thành phố khác.",
      "Xe khách: từ TP. Hồ Chí Minh khoảng 350 km theo Quốc lộ 14, có nhiều nhà xe giường nằm chạy đêm.",
      "Từ Nha Trang đi theo Quốc lộ 26, từ Đà Lạt đi theo Quốc lộ 27; mỗi tuyến khoảng 200 km.",
      "Xe máy / ô tô tự lái: đường đèo đẹp nhưng nhiều khúc cua, nên đi ban ngày.",
    ],
  },
  {
    id: "di-lai",
    icon: "🛵",
    title: "Đi lại trong tỉnh",
    items: [
      "Trong TP. Buôn Ma Thuột có taxi, xe ôm công nghệ (đặt qua ứng dụng) và dịch vụ thuê xe máy.",
      "Các điểm như thác Dray Nur, hồ Lắk, Buôn Đôn cách thành phố từ 20 đến 50 km; nên thuê xe máy, ô tô hoặc đi tour trong ngày.",
      "Một số đoạn đường vào thác và buôn làng là đường đất, nên hỏi trước tình trạng đường vào mùa mưa.",
    ],
  },
  {
    id: "luu-y",
    icon: "🎒",
    title: "Lưu ý khi tham quan",
    items: [
      "Tôn trọng phong tục của đồng bào: hỏi ý kiến trước khi chụp ảnh người dân hoặc vào nhà dài.",
      "Khi tắm suối, thác chỉ xuống nước ở khu vực cho phép, nhất là vào mùa mưa nước chảy xiết.",
      "Mang theo kem chống nắng, thuốc chống côn trùng và giày đi bộ bám đường tốt.",
      "Quà mang về: cà phê, mật ong, hồ tiêu, hạt mắc ca. Nên chọn sản phẩm có tem OCOP để đảm bảo chất lượng.",
    ],
  },
];

const hotlines = [
  { number: "113", label: "Công an" },
  { number: "114", label: "Cứu hỏa, cứu nạn" },
  { number: "115", label: "Cấp cứu y tế" },
];

export default function TravelInfo() {
  return (
    <div className="container">
      <h1 className="page-title">Thông tin du lịch cần thiết</h1>
      <p className="page-sub">Những điều nên biết trước khi đến Đắk Lắk. Thông tin chỉ để tham khảo, hãy kiểm tra lại lịch bay, giá vé trước chuyến đi.</p>

      <nav className="info-toc" aria-label="Mục lục">
        {sections.map((s) => (
          <a key={s.id} href={`#${s.id}`} className="chip">{s.icon} {s.title}</a>
        ))}
        <a href="#khan-cap" className="chip">☎️ Số khẩn cấp</a>
      </nav>

      <div className="info-grid">
        {sections.map((s) => (
          <section key={s.id} id={s.id} className="info-card">
            <h2><span aria-hidden="true">{s.icon}</span> {s.title}</h2>
            <ul>
              {s.items.map((it) => <li key={it}>{it}</li>)}
            </ul>
          </section>
        ))}

        <section id="khan-cap" className="info-card info-emergency">
          <h2><span aria-hidden="true">☎️</span> Số điện thoại khẩn cấp</h2>
          <div className="hotlines">
            {hotlines.map((h) => (
              <a key={h.number} href={`tel:${h.number}`} className="hotline">
                <span className="hotline-num">{h.number}</span>
                <span>{h.label}</span>
              </a>
            ))}
          </div>
          <p className="page-sub" style={{ margin: "12px 0 0" }}>Các số khẩn cấp được gọi miễn phí.</p>
        </section>
      </div>

      <div className="info-cta">
        <p>Bạn cần lịch trình cụ thể cho chuyến đi?</p>
        <Link to="/chat" className="btn btn-accent">💬 Hỏi trợ lý AI</Link>
      </div>
    </div>
  );
}
