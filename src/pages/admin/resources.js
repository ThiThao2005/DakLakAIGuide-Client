import placeApi from "../../api/placeApi";
import ocopApi from "../../api/ocopApi";
import cultureApi from "../../api/cultureApi";
import eventApi from "../../api/eventApi";
import foodApi from "../../api/foodApi";
import { formatEventTime } from "../../utils/format";

/**
 * Cấu hình cho trang quản trị dùng chung (AdminResource).
 * field.type: text | textarea | number | checkbox | category | url
 */
export const resources = {
  places: {
    title: "Địa điểm du lịch",
    icon: "🏞️",
    api: placeApi,
    idKey: "placeId",
    nameKey: "name",
    categoryType: "places",
    columns: [
      { key: "name", label: "Tên" },
      { key: "category", label: "Loại", render: (r) => r.category?.categoryName },
      { key: "address", label: "Địa chỉ" },
      { key: "isFeatured", label: "Nổi bật", render: (r) => (r.isFeatured ? "⭐" : "") },
    ],
    fields: [
      { key: "name", label: "Tên địa điểm", type: "text", required: true, full: true },
      { key: "categoryId", label: "Loại hình", type: "category" },
      { key: "ticketPrice", label: "Giá vé (đ)", type: "number", min: 0 },
      { key: "address", label: "Địa chỉ", type: "text", full: true },
      { key: "openTime", label: "Giờ mở cửa", type: "text", placeholder: "07:00" },
      { key: "closeTime", label: "Giờ đóng cửa", type: "text", placeholder: "17:00" },
      { key: "latitude", label: "Vĩ độ", type: "number", step: "any", placeholder: "12.6667" },
      { key: "longitude", label: "Kinh độ", type: "number", step: "any", placeholder: "108.0383" },
      { key: "imageUrl", label: "Link ảnh", type: "url", full: true },
      { key: "website", label: "Website", type: "url", full: true },
      { key: "description", label: "Mô tả", type: "textarea", full: true },
      { key: "isFeatured", label: "Địa điểm nổi bật", type: "checkbox", full: true },
    ],
  },

  ocop: {
    title: "Sản phẩm OCOP",
    icon: "☕",
    api: ocopApi,
    idKey: "productId",
    nameKey: "name",
    categoryType: "ocop",
    columns: [
      { key: "name", label: "Tên" },
      { key: "category", label: "Loại", render: (r) => r.category?.categoryName },
      { key: "producer", label: "Nhà sản xuất" },
      { key: "ocopLevel", label: "Sao", render: (r) => (r.ocopLevel ? `${r.ocopLevel} ★` : "") },
      { key: "price", label: "Giá", render: (r) => (r.price != null ? `${Number(r.price).toLocaleString("vi-VN")}đ` : "") },
    ],
    fields: [
      { key: "name", label: "Tên sản phẩm", type: "text", required: true, full: true },
      { key: "categoryId", label: "Loại sản phẩm", type: "category" },
      { key: "ocopLevel", label: "Hạng OCOP (3–5 sao)", type: "number", min: 1, max: 5 },
      { key: "producer", label: "Nhà sản xuất", type: "text" },
      { key: "price", label: "Giá (đ)", type: "number", min: 0 },
      { key: "address", label: "Địa chỉ", type: "text", full: true },
      { key: "latitude", label: "Vĩ độ", type: "number", step: "any" },
      { key: "longitude", label: "Kinh độ", type: "number", step: "any" },
      { key: "imageUrl", label: "Link ảnh", type: "url", full: true },
      { key: "website", label: "Website", type: "url", full: true },
      { key: "description", label: "Mô tả", type: "textarea", full: true },
    ],
  },

  foods: {
    title: "Ẩm thực",
    icon: "🍲",
    api: foodApi,
    idKey: "foodId",
    nameKey: "name",
    columns: [
      { key: "name", label: "Tên món" },
      { key: "foodType", label: "Loại" },
      { key: "priceRange", label: "Giá" },
      { key: "isFeatured", label: "Phải thử", render: (r) => (r.isFeatured ? "⭐" : "") },
    ],
    fields: [
      { key: "name", label: "Tên món", type: "text", required: true, full: true },
      { key: "foodType", label: "Loại món", type: "select", options: ["Món chính", "Món dân tộc", "Món ăn vặt", "Đồ uống", "Đặc sản làm quà"] },
      { key: "priceRange", label: "Giá tham khảo", type: "text", placeholder: "30.000đ – 50.000đ" },
      { key: "whereToEat", label: "Ăn ở đâu (quán gợi ý)", type: "textarea", rows: 3, full: true },
      { key: "address", label: "Địa chỉ quán tiêu biểu", type: "text", full: true },
      { key: "latitude", label: "Vĩ độ", type: "number", step: "any" },
      { key: "longitude", label: "Kinh độ", type: "number", step: "any" },
      { key: "imageUrl", label: "Link ảnh", type: "url", full: true },
      { key: "description", label: "Mô tả", type: "textarea", full: true },
      { key: "isFeatured", label: "Món phải thử (hiện nổi bật)", type: "checkbox", full: true },
    ],
  },

  events: {
    title: "Lễ hội & sự kiện",
    icon: "🎉",
    api: eventApi,
    idKey: "eventId",
    nameKey: "name",
    columns: [
      { key: "name", label: "Tên sự kiện" },
      { key: "time", label: "Thời gian", render: (r) => formatEventTime(r) },
      { key: "location", label: "Địa điểm" },
      { key: "isFeatured", label: "Nổi bật", render: (r) => (r.isFeatured ? "⭐" : "") },
    ],
    fields: [
      { key: "name", label: "Tên sự kiện", type: "text", required: true, full: true },
      { key: "startDate", label: "Ngày bắt đầu", type: "date" },
      { key: "endDate", label: "Ngày kết thúc", type: "date" },
      { key: "timeNote", label: "Ghi chú thời gian (khi chưa có ngày)", type: "text", placeholder: "Thường vào tháng 3", full: true },
      { key: "location", label: "Địa điểm tổ chức", type: "text", full: true },
      { key: "latitude", label: "Vĩ độ", type: "number", step: "any" },
      { key: "longitude", label: "Kinh độ", type: "number", step: "any" },
      { key: "imageUrl", label: "Link ảnh", type: "url", full: true },
      { key: "website", label: "Website", type: "url", full: true },
      { key: "description", label: "Mô tả", type: "textarea", full: true },
      { key: "isFeatured", label: "Sự kiện nổi bật (hiện trên banner trang chủ)", type: "checkbox", full: true },
    ],
  },

  culture: {
    title: "Bài viết văn hóa",
    icon: "🥁",
    api: cultureApi,
    idKey: "articleId",
    nameKey: "title",
    categoryType: "culture",
    columns: [
      { key: "title", label: "Tiêu đề" },
      { key: "category", label: "Chủ đề", render: (r) => r.category?.categoryName },
      { key: "createdAt", label: "Ngày đăng", render: (r) => r.createdAt && new Date(r.createdAt).toLocaleDateString("vi-VN") },
    ],
    fields: [
      { key: "title", label: "Tiêu đề", type: "text", required: true, full: true },
      { key: "categoryId", label: "Chủ đề", type: "category", full: true },
      { key: "imageUrl", label: "Link ảnh", type: "url", full: true },
      { key: "content", label: "Nội dung", type: "textarea", full: true, rows: 10 },
    ],
  },
};
