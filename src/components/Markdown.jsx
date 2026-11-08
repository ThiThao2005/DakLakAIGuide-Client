// Hiển thị Markdown đơn giản (in đậm, nghiêng, gạch đầu dòng) mà không dùng innerHTML
function inline(text, keyPrefix) {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return parts.map((p, i) => {
    const key = `${keyPrefix}-${i}`;
    if (p.startsWith("**") && p.endsWith("**") && p.length > 4) return <strong key={key}>{p.slice(2, -2)}</strong>;
    if (p.startsWith("*") && p.endsWith("*") && p.length > 2) return <em key={key}>{p.slice(1, -1)}</em>;
    return p;
  });
}

export default function Markdown({ text }) {
  const lines = (text || "").split("\n");
  const blocks = [];
  let list = null;

  lines.forEach((raw, i) => {
    const line = raw.trimEnd();
    const bullet = line.match(/^\s*(?:[-*•]|\d+\.)\s+(.*)$/);
    if (bullet) {
      if (!list) {
        list = [];
        blocks.push({ type: "ul", items: list, key: i });
      }
      list.push(bullet[1]);
      return;
    }
    list = null;
    if (!line.trim()) return;
    const heading = line.match(/^#{1,6}\s+(.*)$/);
    blocks.push({ type: "p", text: heading ? `**${heading[1]}**` : line, key: i });
  });

  return blocks.map((b) =>
    b.type === "ul" ? (
      <ul key={b.key}>
        {b.items.map((it, j) => (
          <li key={j}>{inline(it, `${b.key}-${j}`)}</li>
        ))}
      </ul>
    ) : (
      <p key={b.key}>{inline(b.text, b.key)}</p>
    )
  );
}
