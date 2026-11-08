import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import placeApi from "../api/placeApi";
import MapView from "../components/MapView";
import ItemCard from "../components/ItemCard";
import { ErrorState } from "../components/StateView";
import { distanceKm, formatDistance, hasCoords, safeUrl } from "../utils/format";

/**
 * Khung trang chi tiết dùng chung cho Địa điểm, Ẩm thực, Sự kiện, Văn hóa, OCOP.
 *
 * fetcher(id)          lấy 1 mục            listFetcher()   lấy danh sách cùng loại (cho "Có thể bạn quan tâm")
 * idKey                tên trường id        toPath(item)    đường dẫn tới mục
 * getTitle / getText / getSubtitle(item)
 * badges(item)         JSX nhãn
 * facts(item)          [{ icon, label, value, href?, copy? }]  → khung "Thông tin nhanh"
 * highlight(item)      JSX nổi bật đầu nội dung (giờ mở cửa, đếm ngược...)
 * actions(item)        JSX nút thêm (thêm vào lịch...)
 * related(item, list)  lọc danh sách liên quan
 * aiQuestion(item)     câu hỏi gợi ý cho trợ lý AI
 */
export default function DetailView({
  fetcher,
  listFetcher,
  idKey,
  toPath,
  backTo,
  backLabel,
  sectionLabel,
  icon,
  mapColor,
  getTitle,
  getText,
  getSubtitle = () => null,
  badges,
  facts = () => [],
  highlight,
  actions,
  related,
  relatedTitle = "Có thể bạn quan tâm",
  renderRelated,
  aiQuestion,
}) {
  const { id } = useParams();
  const { data: item, loading, error, reload } = useFetch(() => fetcher(id), [id]);
  const list = useFetch(() => (listFetcher ? listFetcher() : Promise.resolve({ data: [] })), []);
  const places = useFetch(() => placeApi.getAll(), []);
  const [toast, setToast] = useState("");

  const title = item ? getTitle(item) : "";

  useEffect(() => {
    if (title) document.title = `${title} | DakLak AI Guide`;
    return () => {
      document.title = "DakLak AI Guide";
    };
  }, [title]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 2500);
    return () => clearTimeout(t);
  }, [toast]);

  const relatedItems = useMemo(() => {
    if (!item || !related || !list.data) return [];
    return related(item, list.data.filter((x) => x[idKey] !== item[idKey])).slice(0, 4);
  }, [item, list.data, related, idKey]);

  const nearby = useMemo(() => {
    if (!item || !hasCoords(item) || !places.data) return [];
    return places.data
      .filter((p) => !(idKey === "placeId" && p.placeId === item.placeId))
      .map((p) => ({ ...p, _km: distanceKm(item, p) }))
      .filter((p) => p._km != null && p._km <= 60)
      .sort((a, b) => a._km - b._km)
      .slice(0, 4);
  }, [item, places.data, idKey]);

  if (loading) return <DetailSkeleton />;
  if (error || !item)
    return (
      <div className="container">
        <Breadcrumb backTo={backTo} backLabel={backLabel} />
        <ErrorState message={error || "Không tìm thấy nội dung"} onRetry={reload} />
      </div>
    );

  const img = safeUrl(item.imageUrl);
  const website = safeUrl(item.website);
  const subtitle = getSubtitle(item);
  const text = getText(item) || "";
  const paragraphs = text.split(/\n\s*\n|\r?\n/).map((p) => p.trim()).filter(Boolean);
  const factRows = facts(item).filter((f) => f.value !== null && f.value !== undefined && f.value !== "");
  const directions = hasCoords(item)
    ? `https://www.google.com/maps/dir/?api=1&destination=${item.latitude},${item.longitude}`
    : null;
  const question = aiQuestion ? aiQuestion(item) : `Kể cho tôi thêm về ${title}`;

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title, text: `${title} – DakLak AI Guide`, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setToast("Đã sao chép liên kết");
    } catch {
      /* người dùng huỷ chia sẻ */
    }
  };

  const copy = async (value) => {
    try {
      await navigator.clipboard.writeText(value);
      setToast("Đã sao chép");
    } catch {
      setToast("Không sao chép được");
    }
  };

  return (
    <article className="dv">
      {/* ===== Ảnh bìa + tiêu đề ===== */}
      <header className={`dv-hero ${img ? "" : "dv-hero-empty"}`} style={img ? { backgroundImage: `url("${img}")` } : undefined}>
        <div className="dv-hero-shade" />
        {!img && <span className="dv-hero-icon" aria-hidden="true">{icon}</span>}
        <div className="container dv-hero-inner">
          <Breadcrumb backTo={backTo} backLabel={backLabel} current={title} light />
          {sectionLabel && <p className="dv-eyebrow">{sectionLabel}</p>}
          <h1 className="dv-title">{title}</h1>
          {subtitle && <p className="dv-subtitle">📍 {subtitle}</p>}
          {badges && <div className="dv-badges">{badges(item)}</div>}
          <div className="dv-hero-actions">
            {directions && (
              <a className="btn btn-accent" href={directions} target="_blank" rel="noopener noreferrer">🧭 Chỉ đường</a>
            )}
            <button className="btn btn-light" onClick={share}>🔗 Chia sẻ</button>
            <Link className="btn btn-glass" to={`/chat?q=${encodeURIComponent(question)}`}>💬 Hỏi AI</Link>
          </div>
        </div>
      </header>

      <div className="container dv-layout">
        {/* ===== Nội dung chính ===== */}
        <div className="dv-main">
          {highlight && highlight(item)}

          <section className="dv-card">
            <h2 className="dv-h2">Giới thiệu</h2>
            {paragraphs.length ? (
              <div className="dv-content">
                {paragraphs.map((p, i) => <p key={i}>{p}</p>)}
              </div>
            ) : (
              <p className="dv-muted">Nội dung đang được cập nhật.</p>
            )}
          </section>

          {hasCoords(item) && (
            <section className="dv-card">
              <div className="dv-card-head">
                <h2 className="dv-h2">Vị trí trên bản đồ</h2>
                {directions && (
                  <a href={directions} target="_blank" rel="noopener noreferrer" className="section-link">Mở Google Maps</a>
                )}
              </div>
              <MapView
                markers={[
                  { id: "self", lat: item.latitude, lng: item.longitude, title, subtitle, color: mapColor },
                  ...nearby.map((p) => ({
                    id: `n${p.placeId}`,
                    lat: p.latitude,
                    lng: p.longitude,
                    title: p.name,
                    subtitle: `Cách ${formatDistance(p._km)}`,
                    to: `/places/${p.placeId}`,
                    color: "#8a9a7b",
                  })),
                ]}
              />
            </section>
          )}

          {nearby.length > 0 && (
            <section className="dv-card">
              <h2 className="dv-h2">Điểm đến gần đây</h2>
              <ul className="dv-nearby">
                {nearby.map((p) => (
                  <li key={p.placeId}>
                    <Link to={`/places/${p.placeId}`}>
                      <span className="dv-nearby-thumb" style={safeUrl(p.imageUrl) ? { backgroundImage: `url("${safeUrl(p.imageUrl)}")` } : undefined}>
                        {!safeUrl(p.imageUrl) && "🏞️"}
                      </span>
                      <span className="dv-nearby-text">
                        <strong>{p.name}</strong>
                        <small>{p.category?.categoryName || "Điểm đến"}</small>
                      </span>
                      <span className="dv-distance">{formatDistance(p._km)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {/* ===== Cột thông tin ===== */}
        <aside className="dv-aside">
          <section className="dv-card dv-facts">
            <h2 className="dv-h2">Thông tin nhanh</h2>
            {factRows.length || website ? (
              <ul className="dv-fact-list">
                {factRows.map((f) => (
                  <li key={f.label}>
                    <span className="dv-fact-icon" aria-hidden="true">{f.icon}</span>
                    <span className="dv-fact-body">
                      <span className="dv-fact-label">{f.label}</span>
                      {f.href ? (
                        <a href={f.href} className="dv-fact-value">{f.value}</a>
                      ) : (
                        <span className="dv-fact-value">{f.value}</span>
                      )}
                    </span>
                    {f.copy && (
                      <button className="dv-copy" onClick={() => copy(String(f.value))} aria-label={`Sao chép ${f.label}`} title="Sao chép">⧉</button>
                    )}
                  </li>
                ))}
                {website && (
                  <li>
                    <span className="dv-fact-icon" aria-hidden="true">🌐</span>
                    <span className="dv-fact-body">
                      <span className="dv-fact-label">Website</span>
                      <a href={website} target="_blank" rel="noopener noreferrer" className="dv-fact-value dv-break">
                        {website.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                      </a>
                    </span>
                  </li>
                )}
              </ul>
            ) : (
              <p className="dv-muted">Thông tin chi tiết đang được cập nhật.</p>
            )}
            {actions && <div className="dv-aside-actions">{actions(item)}</div>}
          </section>

          <section className="dv-card dv-ai">
            <p className="dv-ai-title">🤖 Chưa rõ điều gì?</p>
            <p>Hỏi trợ lý AI về giá, đường đi, thời điểm đẹp hoặc lịch trình có {title}.</p>
            <Link className="btn btn-accent" to={`/chat?q=${encodeURIComponent(question)}`}>Hỏi ngay</Link>
          </section>
        </aside>
      </div>

      {relatedItems.length > 0 && (
        <section className="container section dv-related">
          <div className="section-head">
            <h2 className="section-title">
              <span className="section-mark" aria-hidden="true">★</span> {relatedTitle}
            </h2>
            <Link to={backTo} className="section-link">Xem tất cả →</Link>
          </div>
          <div className="grid">
            {relatedItems.map((r) =>
              renderRelated ? (
                renderRelated(r)
              ) : (
                <ItemCard key={r[idKey]} to={toPath(r)} image={r.imageUrl} icon={icon} title={getTitle(r)} text={getText(r)} />
              )
            )}
          </div>
        </section>
      )}

      {toast && <div className="dv-toast" role="status">{toast}</div>}
    </article>
  );
}

function Breadcrumb({ backTo, backLabel, current, light }) {
  return (
    <nav className={`dv-crumbs ${light ? "dv-crumbs-light" : ""}`} aria-label="Đường dẫn">
      <Link to="/">Trang chủ</Link>
      <span aria-hidden="true">›</span>
      <Link to={backTo}>{backLabel}</Link>
      {current && (
        <>
          <span aria-hidden="true">›</span>
          <span aria-current="page">{current}</span>
        </>
      )}
    </nav>
  );
}

function DetailSkeleton() {
  return (
    <div className="dv" aria-busy="true" aria-label="Đang tải">
      <div className="dv-hero dv-hero-empty dv-skel-hero" />
      <div className="container dv-layout">
        <div className="dv-main">
          <div className="dv-card">
            <div className="skel skel-line" style={{ width: "30%" }} />
            <div className="skel skel-line" />
            <div className="skel skel-line" />
            <div className="skel skel-line" style={{ width: "70%" }} />
          </div>
        </div>
        <aside className="dv-aside">
          <div className="dv-card">
            <div className="skel skel-line" style={{ width: "50%" }} />
            <div className="skel skel-line" />
            <div className="skel skel-line" />
          </div>
        </aside>
      </div>
    </div>
  );
}
