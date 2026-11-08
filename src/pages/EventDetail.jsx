import eventApi from "../api/eventApi";
import DetailView from "./DetailView";
import EventCard from "../components/EventCard";
import {
  EVENT_STATUS_LABEL,
  daysUntil,
  eventStatus,
  formatDate,
  formatEventTime,
  googleCalendarUrl,
} from "../utils/format";

function Countdown({ event: e }) {
  const status = eventStatus(e);
  if (status === "undated") {
    return (
      <div className="dv-status is-info">
        <span className="dv-status-dot" aria-hidden="true" />
        <strong>Chưa có lịch cụ thể</strong>
        {e.timeNote && <span>· {e.timeNote}</span>}
      </div>
    );
  }
  if (status === "past") {
    return (
      <div className="dv-status is-closed">
        <span className="dv-status-dot" aria-hidden="true" />
        <strong>Sự kiện đã kết thúc</strong>
        <span>· Theo dõi website để cập nhật lịch lần tổ chức tiếp theo</span>
      </div>
    );
  }
  if (status === "ongoing") {
    const left = daysUntil(e.endDate || e.startDate);
    return (
      <div className="dv-status is-open">
        <span className="dv-status-dot" aria-hidden="true" />
        <strong>Đang diễn ra</strong>
        <span>· {left > 0 ? `Còn ${left} ngày nữa là kết thúc` : "Hôm nay là ngày cuối"}</span>
      </div>
    );
  }
  const days = daysUntil(e.startDate);
  return (
    <div className="dv-countdown">
      <div className="dv-countdown-num">{days}</div>
      <div>
        <strong>ngày nữa là đến sự kiện</strong>
        <p>Bắt đầu {formatDate(e.startDate)}. Nhớ đặt phòng và vé sớm vì dịp lễ hội rất đông khách.</p>
      </div>
    </div>
  );
}

export default function EventDetail() {
  return (
    <DetailView
      fetcher={(id) => eventApi.getById(id)}
      listFetcher={() => eventApi.getAll({ upcoming: true })}
      idKey="eventId"
      toPath={(e) => `/events/${e.eventId}`}
      backTo="/events"
      backLabel="Lễ hội & sự kiện"
      sectionLabel="Lễ hội & sự kiện"
      icon="🎉"
      mapColor="#b25a33"
      getTitle={(e) => e.name}
      getText={(e) => e.description}
      getSubtitle={(e) => e.location}
      badges={(e) => (
        <>
          <span className="badge badge-accent">{EVENT_STATUS_LABEL[eventStatus(e)]}</span>
          <span className="badge">🗓️ {formatEventTime(e)}</span>
        </>
      )}
      highlight={(e) => <Countdown event={e} />}
      facts={(e) => [
        { icon: "🗓️", label: "Thời gian", value: formatEventTime(e) },
        { icon: "📝", label: "Ghi chú", value: e.startDate || e.endDate ? e.timeNote : null },
        { icon: "📍", label: "Địa điểm", value: e.location, copy: true },
      ]}
      actions={(e) => {
        const url = googleCalendarUrl(e);
        return url && eventStatus(e) !== "past" ? (
          <a className="btn btn-sm" href={url} target="_blank" rel="noopener noreferrer">📅 Thêm vào Google Lịch</a>
        ) : null;
      }}
      related={(e, list) => list}
      relatedTitle="Sự kiện khác"
      renderRelated={(x) => <EventCard key={x.eventId} event={x} />}
      aiQuestion={(e) => `${e.name} có những hoạt động gì, nên chuẩn bị gì khi tham gia?`}
    />
  );
}
