const SECTION_CONFIG = [
  {
    key: "insights",
    label: "Insights",
    emptyMsg: "No insights found.",
    accent: "#378ADD",
    bg: "#E6F1FB",
    textColor: "#0C447C",
  },
  {
    key: "trends",
    label: "Trends",
    emptyMsg: "No trends detected.",
    accent: "#1D9E75",
    bg: "#E1F5EE",
    textColor: "#085041",
  },
  {
    key: "anomalies",
    label: "Anomalies",
    emptyMsg: "No anomalies detected.",
    accent: "#EF9F27",
    bg: "#FAEEDA",
    textColor: "#633806",
  },
  {
    key: "recommendations",
    label: "Recommendations",
    emptyMsg: "No recommendations.",
    accent: "#D85A30",
    bg: "#FAECE7",
    textColor: "#712B13",
  },
];

function MetricCard({ label, value, bg, textColor }) {
  return (
    <div style={{ background: bg, borderRadius: 8, padding: "0.85rem 1rem" }}>
      <p style={{ fontSize: 12, color: textColor, fontWeight: 500, margin: "0 0 4px" }}>
        {label}
      </p>
      <p style={{ fontSize: 26, fontWeight: 500, color: textColor, margin: 0 }}>
        {value}
      </p>
    </div>
  );
}

function SectionCard({ config, items = [] }) {
  return (
    <div
      style={{
        background: "var(--color-background-primary, #fff)",
        border: "0.5px solid var(--color-border-tertiary, #e5e7eb)",
        borderRadius: 12,
        padding: "1rem 1.25rem",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <span
          style={{
            width: 8, height: 8, borderRadius: "50%",
            background: config.accent, flexShrink: 0,
          }}
        />
        <span style={{ fontSize: 13, fontWeight: 500 }}>{config.label}</span>
        <span
          style={{
            marginLeft: "auto", fontSize: 12, fontWeight: 500,
            background: config.bg, color: config.textColor,
            borderRadius: 6, padding: "2px 8px",
          }}
        >
          {items.length}
        </span>
      </div>

      {items.length === 0 ? (
        <p style={{ fontSize: 13, color: "#9ca3af", fontStyle: "italic", margin: 0 }}>
          {config.emptyMsg}
        </p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {items.map((item, i) => (
            <li
              key={i}
              style={{
                display: "flex", gap: 10, alignItems: "flex-start",
                padding: "9px 0", fontSize: 14, lineHeight: 1.6,
                borderBottom: i < items.length - 1
                  ? "0.5px solid var(--color-border-tertiary, #e5e7eb)"
                  : "none",
              }}
            >
              <span
                style={{
                  width: 6, height: 6, borderRadius: "50%",
                  background: config.accent, marginTop: 7, flexShrink: 0,
                }}
              />
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function Analysis({ analysis }) {
  // No data yet — empty state
  if (!analysis) {
    return (
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-1">Analysis</h2>
        <p className="text-sm text-gray-500">
          Run a query from the dashboard to see analysis here.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-1">Analysis</h2>
      <p className="text-sm text-gray-500 mb-6">
        AI-powered insights from your query results.
      </p>

      {/* LLM failure error */}
      {analysis.error && (
        <div className="mb-4 px-4 py-3 rounded-lg text-sm"
          style={{ background: "#FCEBEB", color: "#A32D2D", border: "0.5px solid #F09595" }}>
          {analysis.error}
        </div>
      )}

      {/* Summary */}
      <div
        className="mb-4"
        style={{
          background: "var(--color-background-primary, #fff)",
          border: "0.5px solid var(--color-border-tertiary, #e5e7eb)",
          borderRadius: 12, padding: "1rem 1.25rem",
        }}
      >
        <p style={{ fontSize: 13, fontWeight: 500, color: "#6b7280", marginBottom: 8 }}>
          Summary
        </p>
        <p style={{ fontSize: 15, lineHeight: 1.7, margin: 0 }}>
          {analysis.summary || "No summary available."}
        </p>
      </div>

      {/* Metric cards */}
      <div
        className="mb-4"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
          gap: 10,
        }}
      >
        {SECTION_CONFIG.map((s) => (
          <MetricCard
            key={s.key}
            label={s.label}
            value={analysis[s.key]?.length ?? 0}
            bg={s.bg}
            textColor={s.textColor}
          />
        ))}
      </div>

      {/* Section cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 12,
        }}
      >
        {SECTION_CONFIG.map((config) => (
          <SectionCard
            key={config.key}
            config={config}
            items={analysis[config.key] ?? []}
          />
        ))}
      </div>
    </div>
  );
}