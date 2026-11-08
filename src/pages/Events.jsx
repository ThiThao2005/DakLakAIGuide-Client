import eventApi from "../api/eventApi";
import CatalogList from "./CatalogList";
import EventCard from "../components/EventCard";
import { eventStatus } from "../utils/format";

const fetcher = () => eventApi.getAll();
const searchFields = (e) => [e.name, e.description, e.location, e.timeNote];
const statusFilter = {
  label: "Tất cả thời gian",
  options: [
    { value: "current", label: "Sắp và đang diễn ra" },
    { value: "undated", label: "Chưa có lịch cụ thể" },
    { value: "past", label: "Đã kết thúc" },
  ],
  test: (e, v) => {
    const s = eventStatus(e);
    return v === "current" ? s === "upcoming" || s === "ongoing" : s === v;
  },
};

export default function Events() {
  return (
    <CatalogList
      title="Lễ hội và sự kiện"
      subtitle="Lễ hội cà phê, đua voi, cồng chiêng và các sự kiện văn hóa của Đắk Lắk"
      fetcher={fetcher}
      searchFields={searchFields}
      extraFilter={statusFilter}
      renderItem={(e) => <EventCard key={e.eventId} event={e} />}
    />
  );
}
