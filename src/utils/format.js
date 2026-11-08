export function formatPrice(value) {
  if (value === null || value === undefined || value === "") return null;
  if (Number(value) === 0) return "Miễn phí";
  return `${Number(value).toLocaleString("vi-VN")}đ`;
}

export function stars(level) {
  const n = Math.max(0, Math.min(5, Number(level) || 0));
  return "★".repeat(n) + "☆".repeat(5 - n);
}

export function hasCoords(item) {
  return item?.latitude != null && item?.longitude != null && !isNaN(item.latitude) && !isNaN(item.longitude);
}

// Bỏ dấu tiếng Việt để tìm kiếm không phân biệt dấu
export function normalize(text) {
  return (text || "")
    .toString()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase();
}

export function safeUrl(url) {
  if (!url) return null;
  try {
    const u = new URL(url, window.location.origin);
    return u.protocol === "http:" || u.protocol === "https:" ? u.href : null;
  } catch {
    return null;
  }
}

// Ngày từ API dạng "2026-03-10" → "10/03/2026" (không lệch múi giờ)
export function formatDate(value) {
  if (!value) return null;
  const [y, m, d] = String(value).slice(0, 10).split("-");
  return d && m && y ? `${d}/${m}/${y}` : null;
}

export function formatEventTime(e) {
  const s = formatDate(e?.startDate);
  const en = formatDate(e?.endDate);
  if (s && en && s !== en) return `${s} – ${en}`;
  return s || en || e?.timeNote || "Đang cập nhật";
}

export function todayISO() {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}

// "upcoming" | "ongoing" | "past" | "undated"
export function eventStatus(e) {
  const today = todayISO();
  const start = e?.startDate?.slice(0, 10);
  const end = (e?.endDate || e?.startDate)?.slice(0, 10);
  if (!start && !end) return "undated";
  if (end && end < today) return "past";
  if (start && start > today) return "upcoming";
  return "ongoing";
}

export const EVENT_STATUS_LABEL = {
  upcoming: "Sắp diễn ra",
  ongoing: "Đang diễn ra",
  past: "Đã kết thúc",
  undated: "Chưa có lịch",
};

// Khoảng cách giữa 2 tọa độ (km)
export function distanceKm(a, b) {
  if (!hasCoords(a) || !hasCoords(b)) return null;
  const R = 6371;
  const toRad = (d) => (Number(d) * Math.PI) / 180;
  const dLat = toRad(b.latitude - a.latitude);
  const dLng = toRad(b.longitude - a.longitude);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.latitude)) * Math.cos(toRad(b.latitude)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export function formatDistance(km) {
  if (km == null) return null;
  return km < 1 ? `${Math.round(km * 1000)} m` : `${km < 10 ? km.toFixed(1) : Math.round(km)} km`;
}

// Trạng thái mở cửa theo giờ máy người xem, giờ dạng "07:00" / "7h30"
function parseClock(t) {
  const m = String(t || "").trim().match(/^(\d{1,2})\s*[:hH.]\s*(\d{0,2})/);
  if (!m) return null;
  const h = Number(m[1]);
  const min = Number(m[2] || 0);
  return h <= 24 && min < 60 ? h * 60 + min : null;
}

export function openStatus(openTime, closeTime, now = new Date()) {
  const o = parseClock(openTime);
  const c = parseClock(closeTime);
  if (o == null || c == null) return null;
  const cur = now.getHours() * 60 + now.getMinutes();
  const open = c > o ? cur >= o && cur < c : cur >= o || cur < c; // hỗ trợ mở qua đêm
  return { open, label: open ? "Đang mở cửa" : "Đã đóng cửa" };
}

// Số ngày từ hôm nay tới ngày "YYYY-MM-DD"
export function daysUntil(isoDate) {
  if (!isoDate) return null;
  const [y, m, d] = isoDate.slice(0, 10).split("-").map(Number);
  const target = new Date(y, m - 1, d);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((target - today) / 86400000);
}

// Link "Thêm vào Google Lịch" cho sự kiện cả ngày
export function googleCalendarUrl(e) {
  const start = e?.startDate?.slice(0, 10);
  if (!start) return null;
  const endIso = (e.endDate || e.startDate).slice(0, 10);
  const [y, m, d] = endIso.split("-").map(Number);
  const endNext = new Date(y, m - 1, d + 1);
  const fmt = (dt) =>
    `${dt.getFullYear()}${String(dt.getMonth() + 1).padStart(2, "0")}${String(dt.getDate()).padStart(2, "0")}`;
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: e.name || "",
    dates: `${start.replaceAll("-", "")}/${fmt(endNext)}`,
    details: (e.description || "").slice(0, 500),
    location: e.location || "",
  });
  return `https://calendar.google.com/calendar/render?${params}`;
}
