import { useEffect } from "react";

// Dynamic section config - uses CSS variables for dark mode compatibility
const getSectionConfig = () => [
  {
    key: "insights",
    label: "Insights",
    emptyMsg: "No insights found.",
    accent: "#378ADD",
    bg: "var(--color-background-info)",
    textColor: "var(--color-text-info)",
  },
  {
    key: "trends",
    label: "Trends",
    emptyMsg: "No trends detected.",
    accent: "#1D9E75",
    bg: "var(--color-background-success)",
    textColor: "var(--color-text-success)",
  },
  {
    key: "anomalies",
    label: "Anomalies",
    emptyMsg: "No anomalies detected.",
    accent: "#EF9F27",
    bg: "var(--color-background-warning)",
    textColor: "var(--color-text-warning)",
  },
  {
    key: "recommendations",
    label: "Recommendations",
    emptyMsg: "No recommendations.",
    accent: "#D85A30",
    bg: "var(--color-background-danger)",
    textColor: "var(--color-text-danger)",
  },
];

function MetricCard({ label, value, bg, textColor, accent }) {
  return (
    <div
      style={{
        background: "var(--color-background-secondary)",
        border: "0.5px solid var(--color-border-tertiary)",
        borderLeft: `4px solid ${accent}`,
        borderRadius: 8,
        padding: "10px 12px",
      }}
    >
      <p style={{
        fontSize: 11,
        color: textColor,
        margin: "0 0 3px",
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: "0.04em",
      }}>
        {label}
      </p>
      <p style={{
        fontSize: 20,
        fontWeight: 700,
        margin: 0,
        color: "var(--color-text-primary)",
      }}>
        {value}
      </p>
    </div>
  );
}

function SectionCard({ config, items = [] }) {
  return (
    <div style={{
      background: "var(--color-background-primary)",
      border: "0.5px solid var(--color-border-tertiary)",
      borderRadius: 10,
      padding: "12px",
      marginBottom: 10,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <span style={{
          width: 10, height: 10, borderRadius: "50%",
          background: config.accent, flexShrink: 0,
        }} />
        <span style={{
          fontSize: 13, fontWeight: 600,
          color: "var(--color-text-primary)",
        }}>
          {config.label}
        </span>
        <span style={{
          marginLeft: "auto",
          fontSize: 11,
          fontWeight: 600,
          background: config.bg,
          color: config.textColor,
          borderRadius: 6,
          padding: "2px 8px",
        }}>
          {items.length}
        </span>
      </div>

      {items.length === 0 ? (
        <p style={{
          fontSize: 12,
          color: "var(--color-text-tertiary)",
          fontStyle: "italic",
          margin: 0,
        }}>
          {config.emptyMsg}
        </p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {items.map((item, i) => (
            <li key={i} style={{
              display: "flex",
              gap: 10,
              padding: "8px 0",
              fontSize: 12.5,
              color: "var(--color-text-secondary)",
              borderBottom: i < items.length - 1
                ? "0.5px solid var(--color-border-tertiary)"
                : "none",
            }}>
              <span style={{ color: config.accent, fontWeight: "bold", flexShrink: 0 }}>•</span>
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function Analysis({ analysis, isDark }) {
  const sections = getSectionConfig();

  // KEY FIX: sync body background to match the theme in normal/standalone view
  useEffect(() => {
    const root = document.documentElement;
    root.style.background = isDark ? "#0f172a" : "#f8fafc";
    document.body.style.background = isDark ? "#0f172a" : "#f8fafc";
    return () => {
      root.style.background = "";
      document.body.style.background = "";
    };
  }, [isDark]);

  if (!analysis) {
    return (
      <div style={{
        minHeight: "100vh",
        padding: 20,
        background: "var(--color-background-tertiary)",
        color: "var(--color-text-primary)",
      }}>
        <h2 style={{ fontSize: 18, fontWeight: 700 }}>Analysis</h2>
        <p style={{ color: "var(--color-text-secondary)" }}>Run a query to see analysis.</p>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      width: "100%",
      padding: "20px",
      backgroundColor: "var(--color-background-tertiary)",
      color: "var(--color-text-primary)",
      fontFamily: "Inter, system-ui, sans-serif",
      boxSizing: "border-box",
    }}>
      <header style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0, color: "var(--color-text-primary)" }}>
          Analysis
        </h2>
        <p style={{ fontSize: 13, color: "var(--color-text-secondary)", margin: "4px 0 0" }}>
          AI-powered insights and pattern detection.
        </p>
      </header>

      {/* Summary Box */}
      <div style={{
        marginBottom: 16,
        background: "var(--color-background-primary)",
        border: "0.5px solid var(--color-border-tertiary)",
        borderRadius: 12,
        padding: "16px",
      }}>
        <h4 style={{
          fontSize: 11,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          color: "var(--color-text-secondary)",
          margin: "0 0 8px",
        }}>
          Executive Summary
        </h4>
        <p style={{ fontSize: 14, lineHeight: 1.6, margin: 0, color: "var(--color-text-primary)" }}>
          {analysis.summary || "No summary available."}
        </p>
      </div>

      {/* Metrics Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
        gap: 12,
        marginBottom: 20,
      }}>
        {sections.map((s) => (
          <MetricCard
            key={s.key}
            label={s.label}
            value={analysis[s.key]?.length ?? 0}
            bg={s.bg}
            accent={s.accent}
            textColor={s.textColor}
          />
        ))}
      </div>

      {/* Detail Sections */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {sections.map((config) => (
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