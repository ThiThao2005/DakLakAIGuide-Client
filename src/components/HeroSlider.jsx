import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { safeUrl } from "../utils/format";

// Nền khi chưa có ảnh: rừng xanh có nắng, đồi cà phê, đất đỏ lúc hoàng hôn
const FALLBACK_BG = [
  "radial-gradient(circle at 82% 22%, #f2d58a 0%, #9cb86a 18%, #3f7a45 42%, #1d3527 80%)",
  "radial-gradient(circle at 78% 70%, #8fb36a 0%, #3f7a45 35%, #1d3527 78%)",
  "radial-gradient(circle at 85% 30%, #e9b26a 0%, #b25a33 28%, #2f5d3a 62%, #1d3527 90%)",
];

const INTRO = {
  key: "intro",
  eyebrow: "Chào mừng đến Đắk Lắk",
  title: (
    <>
      Khám phá thủ phủ <em>cà phê</em> Tây Nguyên
    </>
  ),
  text: "Thác nước hùng vĩ, buôn làng Ê Đê, cồng chiêng và những sản vật núi rừng. Hỏi trợ lý AI để có lịch trình phù hợp.",
  to: "/chat",
  cta: "💬 Hỏi trợ lý AI",
};

/** slides: [{ key, eyebrow, title, text, image, to, cta }] */
export default function HeroSlider({ slides = [], interval = 6000 }) {
  const all = [INTRO, ...slides];
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = all.length;

  const go = useCallback((i) => setIndex(((i % count) + count) % count), [count]);

  useEffect(() => {
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (paused || reduce || count < 2) return;
    const t = setTimeout(() => go(index + 1), interval);
    return () => clearTimeout(t);
  }, [index, paused, count, interval, go]);

  useEffect(() => {
    if (index >= count) setIndex(0);
  }, [count, index]);

  return (
    <section
      className="hero-slider"
      aria-roledescription="carousel"
      aria-label="Điểm nhấn Đắk Lắk"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {all.map((s, i) => {
        const img = safeUrl(s.image);
        const bg = img
          ? `linear-gradient(90deg, rgba(20,12,6,.75) 0%, rgba(20,12,6,.35) 55%, rgba(20,12,6,.1) 100%), url("${img}")`
          : FALLBACK_BG[i % FALLBACK_BG.length];
        return (
          <div
            key={s.key}
            className={`hero-slide ${i === index ? "is-active" : ""}`}
            style={{ backgroundImage: bg }}
            aria-hidden={i !== index}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} / ${count}`}
          >
            <div className="container hero-slide-inner">
              {s.eyebrow && <p className="hero-eyebrow">{s.eyebrow}</p>}
              <h1 className="hero-title">{s.title}</h1>
              {s.text && <p className="hero-text">{s.text}</p>}
              {s.to && (
                <Link to={s.to} className="btn btn-light" tabIndex={i === index ? 0 : -1}>
                  {s.cta || "Khám phá →"}
                </Link>
              )}
            </div>
          </div>
        );
      })}

      {count > 1 && (
        <>
          <button className="hero-nav hero-prev" onClick={() => go(index - 1)} aria-label="Slide trước">‹</button>
          <button className="hero-nav hero-next" onClick={() => go(index + 1)} aria-label="Slide sau">›</button>
          <div className="hero-dots">
            {all.map((s, i) => (
              <button
                key={s.key}
                className={`hero-dot ${i === index ? "is-active" : ""}`}
                onClick={() => go(i)}
                aria-label={`Chuyển tới slide ${i + 1}`}
                aria-current={i === index}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
