import { useMemo, useState } from "react";
import useFetch from "../hooks/useFetch";
import { Empty, ErrorState, Loading } from "../components/StateView";
import { normalize } from "../utils/format";

/**
 * Khung chung cho các trang danh sách: tải dữ liệu, tìm kiếm không dấu, lọc theo danh mục.
 * searchFields: (item) => string[]   renderItem: (item) => JSX
 * extraFilter: { label, options: [{value,label}], test: (item, value) => bool }
 */
const defaultCategoryOf = (i) => i.category?.categoryName;

export default function CatalogList({
  title,
  subtitle,
  fetcher,
  searchFields,
  renderItem,
  extraFilter,
  categoryOf = defaultCategoryOf,
  categoryLabel = "Tất cả danh mục",
}) {
  const { data, loading, error, reload } = useFetch(fetcher, []);
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [extra, setExtra] = useState("");

  const items = useMemo(() => data || [], [data]);
  const categories = useMemo(
    () => [...new Set(items.map(categoryOf).filter(Boolean))].sort(),
    [items, categoryOf]
  );

  const filtered = useMemo(() => {
    const nq = normalize(q.trim());
    return items.filter((i) => {
      if (category && categoryOf(i) !== category) return false;
      if (extraFilter && extra && !extraFilter.test(i, extra)) return false;
      if (!nq) return true;
      return searchFields(i).some((f) => normalize(f).includes(nq));
    });
  }, [items, q, category, extra, extraFilter, searchFields, categoryOf]);

  return (
    <div className="container">
      <h1 className="page-title">{title}</h1>
      <p className="page-sub">{subtitle}</p>

      <div className="toolbar">
        <input className="input" placeholder="Tìm kiếm..." value={q} onChange={(e) => setQ(e.target.value)} aria-label="Tìm kiếm" />
        {categories.length > 0 && (
          <select className="select" value={category} onChange={(e) => setCategory(e.target.value)} aria-label="Danh mục">
            <option value="">{categoryLabel}</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        )}
        {extraFilter && (
          <select className="select" value={extra} onChange={(e) => setExtra(e.target.value)} aria-label={extraFilter.label}>
            <option value="">{extraFilter.label}</option>
            {extraFilter.options.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        )}
      </div>

      {loading ? (
        <Loading />
      ) : error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : filtered.length === 0 ? (
        <Empty text={items.length ? "Không tìm thấy kết quả phù hợp" : "Chưa có dữ liệu"} />
      ) : (
        <div className="grid">{filtered.map(renderItem)}</div>
      )}
    </div>
  );
}
