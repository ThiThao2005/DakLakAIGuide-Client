import { useMemo, useState } from "react";
import useFetch from "../../hooks/useFetch";
import categoryApi from "../../api/categoryApi";
import { getErrorMessage } from "../../api/axiosClient";
import { Empty, ErrorState, Loading } from "../../components/StateView";
import { normalize, safeUrl } from "../../utils/format";

function emptyForm(fields) {
  return Object.fromEntries(fields.map((f) => [f.key, f.type === "checkbox" ? false : ""]));
}

function toForm(item, fields) {
  return Object.fromEntries(
    fields.map((f) => {
      const v = item[f.key];
      if (f.type === "checkbox") return [f.key, !!v];
      if (f.type === "date") return [f.key, v ? String(v).slice(0, 10) : ""];
      return [f.key, v ?? ""];
    })
  );
}

// Chuyển dữ liệu form sang đúng kiểu backend cần (số, null...)
function toPayload(form, fields) {
  const out = {};
  for (const f of fields) {
    const v = form[f.key];
    if (f.type === "checkbox") out[f.key] = !!v;
    else if (f.type === "number" || f.type === "category") out[f.key] = v === "" || v === null ? null : Number(v);
    else out[f.key] = typeof v === "string" && v.trim() === "" ? null : typeof v === "string" ? v.trim() : v;
  }
  return out;
}

export default function AdminResource({ config }) {
  const { title, api, idKey, nameKey, columns, fields, categoryType } = config;
  const list = useFetch(() => api.getAll(), [api]);
  const cats = useFetch(
    () => (categoryType ? categoryApi.getAll(categoryType) : Promise.resolve({ data: [] })),
    [categoryType]
  );

  const [q, setQ] = useState("");
  const [editing, setEditing] = useState(null); // null | "new" | item
  const [form, setForm] = useState(() => emptyForm(fields));
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [notice, setNotice] = useState("");

  const rows = useMemo(() => {
    const nq = normalize(q.trim());
    const data = list.data || [];
    return nq ? data.filter((r) => normalize(r[nameKey]).includes(nq)) : data;
  }, [list.data, q, nameKey]);

  const openNew = () => {
    setForm(emptyForm(fields));
    setFormError("");
    setEditing("new");
  };

  const openEdit = (item) => {
    setForm(toForm(item, fields));
    setFormError("");
    setEditing(item);
  };

  const close = () => !saving && setEditing(null);

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFormError("");
    try {
      const payload = toPayload(form, fields);
      if (editing === "new") await api.create(payload);
      else await api.update(editing[idKey], payload);
      setNotice(editing === "new" ? "Đã thêm mới thành công" : "Đã cập nhật thành công");
      setEditing(null);
      list.reload();
    } catch (err) {
      const validation = err.response?.data?.errors;
      setFormError(
        validation ? Object.values(validation).flat().join(" ") : getErrorMessage(err, "Không lưu được dữ liệu")
      );
    } finally {
      setSaving(false);
    }
  };

  const remove = async (item) => {
    if (!window.confirm(`Xóa "${item[nameKey]}"? Hành động này không thể hoàn tác.`)) return;
    try {
      await api.remove(item[idKey]);
      setNotice("Đã xóa");
      list.reload();
    } catch (err) {
      setNotice("");
      alert(getErrorMessage(err, "Không xóa được"));
    }
  };

  const renderField = (f) => {
    const common = {
      id: f.key,
      value: form[f.key],
      onChange: (e) => setForm({ ...form, [f.key]: e.target.value }),
      required: f.required,
      placeholder: f.placeholder,
    };
    let input;
    switch (f.type) {
      case "textarea":
        input = <textarea className="textarea" rows={f.rows || 5} {...common} />;
        break;
      case "number":
        input = <input type="number" className="input" min={f.min} max={f.max} step={f.step || "1"} {...common} />;
        break;
      case "date":
        input = <input type="date" className="input" {...common} />;
        break;
      case "select":
        input = (
          <select className="select" {...common}>
            <option value="">— Chọn —</option>
            {f.options.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        );
        break;
      case "url":
        input = <input type="url" className="input" {...common} placeholder={f.placeholder || "https://..."} />;
        break;
      case "category":
        input = (
          <select className="select" {...common}>
            <option value="">— Chọn —</option>
            {(cats.data || []).map((c) => (
              <option key={c.categoryId} value={c.categoryId}>{c.categoryName}</option>
            ))}
          </select>
        );
        break;
      case "checkbox":
        return (
          <label key={f.key} className="check field full">
            <input type="checkbox" checked={!!form[f.key]} onChange={(e) => setForm({ ...form, [f.key]: e.target.checked })} />
            {f.label}
          </label>
        );
      default:
        input = <input type="text" className="input" {...common} />;
    }
    return (
      <div key={f.key} className={`field ${f.full ? "full" : ""}`}>
        <label htmlFor={f.key}>
          {f.label} {f.required && <span style={{ color: "var(--c-danger)" }}>*</span>}
        </label>
        {input}
      </div>
    );
  };

  return (
    <div>
      <div className="section-head">
        <h1 className="page-title">{title}</h1>
        <button className="btn btn-accent" onClick={openNew}>+ Thêm mới</button>
      </div>

      {notice && <div className="alert alert-success">{notice}</div>}

      <div className="toolbar">
        <input className="input" placeholder="Tìm theo tên..." value={q} onChange={(e) => setQ(e.target.value)} />
      </div>

      {list.loading ? (
        <Loading />
      ) : list.error ? (
        <ErrorState message={list.error} onRetry={list.reload} />
      ) : rows.length === 0 ? (
        <Empty />
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Ảnh</th>
                {columns.map((c) => <th key={c.key}>{c.label}</th>)}
                <th />
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r[idKey]}>
                  <td>{safeUrl(r.imageUrl) ? <img src={safeUrl(r.imageUrl)} alt="" className="thumb" /> : <div className="thumb" />}</td>
                  {columns.map((c) => <td key={c.key}>{c.render ? c.render(r) : r[c.key]}</td>)}
                  <td className="actions">
                    <button className="btn btn-sm" onClick={() => openEdit(r)}>Sửa</button>
                    <button className="btn btn-sm btn-danger" onClick={() => remove(r)}>Xóa</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && close()}>
          <form className="modal" onSubmit={save}>
            <h2>{editing === "new" ? `Thêm ${title.toLowerCase()}` : `Sửa: ${editing[nameKey]}`}</h2>
            {formError && <div className="alert alert-error">{formError}</div>}
            <div className="form-grid">{fields.map(renderField)}</div>
            <div className="modal-actions">
              <button type="button" className="btn btn-ghost" onClick={close} disabled={saving}>Hủy</button>
              <button className="btn" disabled={saving}>{saving ? "Đang lưu..." : "Lưu"}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
