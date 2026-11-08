import { Link } from "react-router-dom";
import { EVENT_STATUS_LABEL, eventStatus, formatEventTime, safeUrl } from "../utils/format";

const STATUS_CLASS = {
  upcoming: "badge-green",
  ongoing: "badge-accent",
  past: "",
  undated: "",
};

export default function EventCard({ event: e }) {
  const img = safeUrl(e.imageUrl);
  const status = eventStatus(e);
  const start = e.startDate ? e.startDate.slice(0, 10).split("-") : null;

  return (
    <Link to={`/events/${e.eventId}`} className={`card event-card ${status === "past" ? "event-past" : ""}`}>
      <div className="event-media">
        {img ? <img src={img} alt={e.name} className="card-img" loading="lazy" /> : <div className="card-img-empty">🎉</div>}
        {start && (
          <div className="event-date" aria-hidden="true">
            <span className="event-day">{start[2]}</span>
            <span className="event-month">Th{Number(start[1])}</span>
          </div>
        )}
      </div>
      <div className="card-body">
        <h3 className="card-title">{e.name}</h3>
        <p className="event-time">🗓️ {formatEventTime(e)}</p>
        {e.location && <p className="card-text">📍 {e.location}</p>}
        <div className="card-meta">
          <span className={`badge ${STATUS_CLASS[status]}`}>{EVENT_STATUS_LABEL[status]}</span>
        </div>
      </div>
    </Link>
  );
}
