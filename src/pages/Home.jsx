import { useMemo } from "react";
import { Link } from "react-router-dom";
import placeApi from "../api/placeApi";
import ocopApi from "../api/ocopApi";
import foodApi from "../api/foodApi";
import eventApi from "../api/eventApi";
import useFetch from "../hooks/useFetch";
import HeroSlider from "../components/HeroSlider";
import FeatureTile from "../components/FeatureTile";
import ItemCard from "../components/ItemCard";
import EventCard from "../components/EventCard";
import { Loading } from "../components/StateView";
import { formatEventTime, formatPrice, stars } from "../utils/format";

function Section({ title, to, linkLabel = "Xem tất cả", loading, empty, children }) {
  if (!loading && empty) return null; // ẩn mục chưa có dữ liệu
  return (
    <section className="section">
      <div className="section-head">
        <h2 className="section-title">
          <span className="section-mark" aria-hidden="true">★</span> {title}
        </h2>
        {to && (
          <Link to={to} className="section-link">
            {linkLabel} <span aria-hidden="true">→</span>
          </Link>
        )}
      </div>
      {loading ? <Loading /> : children}
    </section>
  );
}

const GUIDE = [
  { to: "/places", icon: "🏞️", title: "Khám phá điểm đến", text: "Thác nước, hồ, buôn làng và bảo tàng", tint: "#2f5d3a" },
  { to: "/culture", icon: "🥁", title: "Trải nghiệm văn hóa bản địa", text: "Cồng chiêng, nhà dài, lễ hội Ê Đê", tint: "#b25a33" },
  { to: "/foods", icon: "🍲", title: "Hương vị núi rừng", text: "Cơm lam, gà nướng, bún đỏ, rượu cần", tint: "#6b7f3a" },
  { to: "/info", icon: "🧭", title: "Thông tin cần thiết", text: "Mùa đẹp nhất, cách đi, số khẩn cấp", tint: "#1d3527" },
];

export default function Home() {
  const places = useFetch(() => placeApi.getAll(), []);
  const foods = useFetch(() => foodApi.getAll(), []);
  const events = useFetch(() => eventApi.getAll({ upcoming: true }), []);
  const products = useFetch(() => ocopApi.getAll(), []);

  const allPlaces = useMemo(() => places.data || [], [places.data]);
  const featured = useMemo(() => allPlaces.filter((p) => p.isFeatured), [allPlaces]);
  const highlight = featured.length >= 2 ? featured.slice(0, 2) : allPlaces.slice(0, 2);
  const highlightIds = new Set(highlight.map((p) => p.placeId));
  const morePlaces = allPlaces.filter((p) => !highlightIds.has(p.placeId)).slice(0, 3);
  const upcoming = (events.data || []).slice(0, 3);

  const slides = useMemo(() => {
    const placeSlides = (featured.length ? featured : allPlaces).slice(0, 3).map((p) => ({
      key: `p${p.placeId}`,
      eyebrow: p.category?.categoryName || "Điểm đến",
      title: p.name,
      text: p.description,
      image: p.imageUrl,
      to: `/places/${p.placeId}`,
      cta: "Khám phá →",
    }));
    const eventSlides = (events.data || []).filter((e) => e.isFeatured).slice(0, 2).map((e) => ({
      key: `e${e.eventId}`,
      eyebrow: `Lễ hội & sự kiện · ${formatEventTime(e)}`,
      title: e.name,
      text: e.description,
      image: e.imageUrl,
      to: `/events/${e.eventId}`,
      cta: "Xem sự kiện →",
    }));
    return [...placeSlides, ...eventSlides];
  }, [featured, allPlaces, events.data]);

  return (
    <>
      <HeroSlider slides={slides} />

      <div className="container">
        <nav className="quick-links" aria-label="Lối tắt">
          <Link to="/places">🏞️ Điểm đến</Link>
          <Link to="/foods">🍲 Ăn gì</Link>
          <Link to="/events">🎉 Lễ hội</Link>
          <Link to="/ocop">☕ Đặc sản OCOP</Link>
          <Link to="/map">🗺️ Bản đồ</Link>
          <Link to="/info">🧭 Thông tin</Link>
        </nav>

        <Section title="Cẩm nang khám phá Đắk Lắk">
          <div className="tile-grid tile-grid-4">
            {GUIDE.map((g) => <FeatureTile key={g.to} {...g} />)}
          </div>
        </Section>

        <Section title="Những điểm đến lý thú" to="/places" linkLabel="Đi khắp Đắk Lắk" loading={places.loading} empty={!highlight.length}>
          <div className="tile-grid tile-grid-2">
            {highlight.map((p) => (
              <FeatureTile key={p.placeId} tall to={`/places/${p.placeId}`} image={p.imageUrl} icon="🏞️" title={p.name} text={p.description} tint="#3f7a45" />
            ))}
          </div>
        </Section>

        <Section title="Xem gì – Làm gì ở Đắk Lắk" to="/places" linkLabel="Khám phá thêm" loading={places.loading} empty={!morePlaces.length}>
          <div className="grid grid-3">
            {morePlaces.map((p) => (
              <ItemCard key={p.placeId} to={`/places/${p.placeId}`} image={p.imageUrl} icon="🏞️" title={p.name} text={p.description}>
                {p.category?.categoryName && <span className="badge">{p.category.categoryName}</span>}
                {formatPrice(p.ticketPrice) && <span className="badge badge-green">🎟️ {formatPrice(p.ticketPrice)}</span>}
              </ItemCard>
            ))}
          </div>
        </Section>

        <Section title="Ăn gì ở Đắk Lắk" to="/foods" linkLabel="Khám phá ẩm thực" loading={foods.loading} empty={!(foods.data || []).length}>
          <div className="grid">
            {(foods.data || []).slice(0, 4).map((f) => (
              <ItemCard key={f.foodId} to={`/foods/${f.foodId}`} image={f.imageUrl} icon="🍲" title={f.name} text={f.description}>
                {f.foodType && <span className="badge">{f.foodType}</span>}
                {f.isFeatured && <span className="badge badge-accent">Phải thử</span>}
              </ItemCard>
            ))}
          </div>
        </Section>

        <Section title="Lễ hội & sự kiện sắp diễn ra" to="/events" linkLabel="Xem lịch sự kiện" loading={events.loading} empty={!upcoming.length}>
          <div className="grid grid-3">
            {upcoming.map((e) => <EventCard key={e.eventId} event={e} />)}
          </div>
        </Section>

        <Section title="Đặc sản OCOP làm quà" to="/ocop" loading={products.loading} empty={!(products.data || []).length}>
          <div className="grid">
            {(products.data || []).slice(0, 4).map((p) => (
              <ItemCard key={p.productId} to={`/ocop/${p.productId}`} image={p.imageUrl} icon="☕" title={p.name} text={p.description}>
                {p.ocopLevel && <span className="badge badge-accent stars">{stars(p.ocopLevel)}</span>}
                {formatPrice(p.price) && <span className="badge badge-green">{formatPrice(p.price)}</span>}
              </ItemCard>
            ))}
          </div>
        </Section>

        <section className="cta-band">
          <div>
            <h2>Chưa biết bắt đầu từ đâu?</h2>
            <p>Cho trợ lý AI biết bạn có mấy ngày và thích gì, AI sẽ gợi ý lịch trình phù hợp.</p>
          </div>
          <Link to="/chat" className="btn btn-light">💬 Lên lịch trình với AI</Link>
        </section>
      </div>
    </>
  );
}
