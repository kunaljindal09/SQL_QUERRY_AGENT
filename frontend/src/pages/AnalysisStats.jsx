import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function AnalysisStats() {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Get analysis from sessionStorage (set by Dashboard when query is run)
    const stored = sessionStorage.getItem("latest_analysis");
    if (stored) {
      try {
        setAnalysis(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse analysis:", e);
      }
    }
    setLoading(false);

    // Check dark mode preference
    const darkMode = localStorage.getItem("theme") === "dark";
    setIsDark(darkMode);
  }, []);

  const bg = isDark ? "#070c18" : "#ffffff";
  const border = isDark ? "#1e293b" : "#e2e8f0";
  const txt = {
    primary: isDark ? "#f1f5f9" : "#0f172a",
    secondary: isDark ? "#cbd5e1" : "#475569",
    muted: isDark ? "#64748b" : "#94a3b8",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: isDark ? "#0f172a" : "#f8fafc",
        padding: "20px",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 20,
        }}
      >
        <Link
          to="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: 14,
            color: txt.muted,
            textDecoration: "none",
            cursor: "pointer",
          }}
        >
          ← Back
        </Link>
        <h1 style={{ margin: 0, color: txt.primary, fontSize: 24 }}>
          Query Analysis
        </h1>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {!analysis ? (
          <div
            style={{
              padding: 40,
              textAlign: "center",
              borderRadius: 12,
              border: `1px solid ${border}`,
              background: bg,
            }}
          >
            <p style={{ color: txt.muted, margin: 0 }}>
              Run a query from the dashboard to see analysis here.
            </p>
          </div>
        ) : (
          <div style={{ display: "grid", gap: 20 }}>
            {/* Summary */}
            {analysis.summary && (
              <div
                style={{
                  padding: 20,
                  borderRadius: 12,
                  border: `1px solid ${border}`,
                  background: bg,
                }}
              >
                <h3 style={{ margin: "0 0 12px 0", color: txt.primary }}>
                  Summary
                </h3>
                <p style={{ margin: 0, color: txt.secondary, lineHeight: 1.6 }}>
                  {analysis.summary}
                </p>
              </div>
            )}

            {/* Insights */}
            {analysis.insights && analysis.insights.length > 0 && (
              <div
                style={{
                  padding: 20,
                  borderRadius: 12,
                  border: `1px solid ${border}`,
                  background: bg,
                }}
              >
                <h3 style={{ margin: "0 0 12px 0", color: txt.primary }}>
                  Key Insights
                </h3>
                <ul
                  style={{
                    margin: 0,
                    paddingLeft: 20,
                    color: txt.secondary,
                    lineHeight: 1.8,
                  }}
                >
                  {analysis.insights.map((insight, idx) => (
                    <li key={idx}>{insight}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Trends */}
            {analysis.trends && analysis.trends.length > 0 && (
              <div
                style={{
                  padding: 20,
                  borderRadius: 12,
                  border: `1px solid ${border}`,
                  background: bg,
                }}
              >
                <h3 style={{ margin: "0 0 12px 0", color: txt.primary }}>
                  Trends
                </h3>
                <ul
                  style={{
                    margin: 0,
                    paddingLeft: 20,
                    color: txt.secondary,
                    lineHeight: 1.8,
                  }}
                >
                  {analysis.trends.map((trend, idx) => (
                    <li key={idx}>{trend}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Anomalies */}
            {analysis.anomalies && analysis.anomalies.length > 0 && (
              <div
                style={{
                  padding: 20,
                  borderRadius: 12,
                  border: `1px solid ${border}`,
                  background: bg,
                }}
              >
                <h3 style={{ margin: "0 0 12px 0", color: txt.primary }}>
                  Anomalies
                </h3>
                <ul
                  style={{
                    margin: 0,
                    paddingLeft: 20,
                    color: txt.secondary,
                    lineHeight: 1.8,
                  }}
                >
                  {analysis.anomalies.map((anomaly, idx) => (
                    <li key={idx}>{anomaly}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Recommendations */}
            {analysis.recommendations && analysis.recommendations.length > 0 && (
              <div
                style={{
                  padding: 20,
                  borderRadius: 12,
                  border: `1px solid ${border}`,
                  background: bg,
                }}
              >
                <h3 style={{ margin: "0 0 12px 0", color: txt.primary }}>
                  Recommendations
                </h3>
                <ul
                  style={{
                    margin: 0,
                    paddingLeft: 20,
                    color: txt.secondary,
                    lineHeight: 1.8,
                  }}
                >
                  {analysis.recommendations.map((rec, idx) => (
                    <li key={idx}>{rec}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
