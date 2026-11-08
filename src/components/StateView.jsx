export function Loading({ text = "Đang tải..." }) {
  return (
    <div className="state">
      <div className="spinner" />
      {text}
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="state state-error">
      <p>⚠️ {message}</p>
      {onRetry && (
        <button className="btn btn-sm" onClick={onRetry}>
          Thử lại
        </button>
      )}
    </div>
  );
}

export function Empty({ text = "Chưa có dữ liệu" }) {
  return <div className="state">{text}</div>;
}
