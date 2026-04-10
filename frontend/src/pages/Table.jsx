export default function Table({ response, isDark = true }) {

  // response itself is the array of dictionaries
  const rows = Array.isArray(response) ? response : [];
  // Extract column names from the first row
  const columns = rows.length > 0 ? Object.keys(rows[0]) : [];

  // Fix duplicate column names
  const fixedColumns = (() => {
    const colCount = {};
    return columns.map((col) => {
      if (!colCount[col]) colCount[col] = 1;
      else colCount[col]++;
      return colCount[col] === 1 ? col : `${col}_${colCount[col]}`;
    });
  })();

  // Format cell values
  const formatValue = (value) => {
    if (value === null || value === undefined) return "—";
    if (typeof value === "boolean") return value ? "True" : "False";
    if (typeof value === "object") return JSON.stringify(value, null, 2);
    return String(value);
  };

  // ── Theme tokens ────────────────────────────────────────────────────────────
  const theme = isDark? {
        // Dark mode — rich navy base, sharp contrast
        wrapper:     "border-2 border-slate-700 bg-[#0e1624]",
        topBar:      "border-b-2 border-slate-700 bg-[#080d18]",
        topLabel:    "text-slate-200 font-semibold",
        iconStroke:  "#60a5fa",
        badge:       "bg-slate-800 border border-slate-600 text-slate-300",
        thead:       "bg-[#060b14] border-b-2 border-slate-700",
        thIndex:     "text-slate-500",
        th:          "text-slate-300",
        rowEven:     "bg-transparent",
        rowOdd:      "bg-slate-900/40",
        rowHover:    "hover:bg-blue-950/30",
        rowDivider:  "border-b border-slate-800",
        tdIndex:     "text-slate-500 font-mono",
        // value type colours — dark
        valNull:     "text-slate-500 italic",
        valBoolT:    "text-emerald-400 font-medium",
        valBoolF:    "text-red-400 font-medium",
        valNumber:   "text-blue-300 font-mono",
        valObject:   "text-amber-300 font-mono",
        valDate:     "text-violet-300 font-mono",
        valString:   "text-slate-100",
        footer:      "border-t-2 border-slate-700 bg-[#060b14] text-slate-500",
        empty:       "border-2 border-slate-700 bg-[#0e1624] text-slate-400",
        emptyIcon:   "#64748b",
      }
    : {
        // Light mode — clean white base, deep ink contrast
        wrapper:     "border-2 border-slate-300 bg-white",
        topBar:      "border-b-2 border-slate-200 bg-slate-50",
        topLabel:    "text-slate-800 font-semibold",
        iconStroke:  "#2563eb",
        badge:       "bg-white border border-slate-300 text-slate-600",
        thead:       "bg-slate-100 border-b-2 border-slate-300",
        thIndex:     "text-slate-400",
        th:          "text-slate-600",
        rowEven:     "bg-white",
        rowOdd:      "bg-slate-50",
        rowHover:    "hover:bg-blue-50",
        rowDivider:  "border-b border-slate-200",
        tdIndex:     "text-slate-400 font-mono",
        // value type colours — light (darker shades for legibility on white)
        valNull:     "text-slate-400 italic",
        valBoolT:    "text-emerald-700 font-medium",
        valBoolF:    "text-red-600 font-medium",
        valNumber:   "text-blue-700 font-mono",
        valObject:   "text-amber-700 font-mono",
        valDate:     "text-violet-700 font-mono",
        valString:   "text-slate-800",
        footer:      "border-t-2 border-slate-200 bg-slate-50 text-slate-400",
        empty:       "border-2 border-slate-200 bg-white text-slate-500",
        emptyIcon:   "#94a3b8",
      };

  // Pick the right value style from theme
  const getValueClass = (value) => {
    if (value === null || value === undefined)                            return theme.valNull;
    if (typeof value === "boolean")                                      return value ? theme.valBoolT : theme.valBoolF;
    if (typeof value === "number")                                       return theme.valNumber;
    if (typeof value === "object")                                       return theme.valObject;
    if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}/.test(value)) return theme.valDate;
    return theme.valString;
  };

  return (
    <>
      {rows.length > 0 ? (
        <div className={`rounded-xl overflow-hidden ${theme.wrapper}`}>

          {/* ── Top bar ── */}
          <div className={`flex items-center justify-between px-4 py-3 ${theme.topBar}`}>
            <div className="flex items-center gap-2">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={theme.iconStroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <path d="M3 9h18M3 15h18M9 3v18"/>
              </svg>
              <span className={`text-xs ${theme.topLabel}`}>Query Results</span>
            </div>
            <span className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full ${theme.badge}`}>
              {rows.length} {rows.length === 1 ? "row" : "rows"}
            </span>
          </div>

          {/* ── Scrollable table ── */}
          <div className="overflow-x-auto">
            <table className="min-w-full">

              {/* Header */}
              <thead className={theme.thead}>
                <tr>
                  <th className={`px-4 py-2.5 text-left text-[10px] uppercase tracking-widest w-10 select-none ${theme.thIndex}`}>
                    #
                  </th>
                  {fixedColumns.map((col) => (
                    <th
                      key={col}
                      className={`px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-widest whitespace-nowrap ${theme.th}`}
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>

              {/* Body */}
              <tbody>
                {rows.map((row, idx) => (
                  <tr
                    key={idx}
                    className={`transition-colors ${theme.rowDivider} ${theme.rowHover} ${
                      idx % 2 === 0 ? theme.rowEven : theme.rowOdd
                    }`}
                  >
                    <td className={`px-4 py-2.5 text-[11px] select-none ${theme.tdIndex}`}>
                      {idx + 1}
                    </td>
                    {columns.map((col, colIdx) => (
                      <td
                        key={colIdx}
                        className={`px-4 py-2.5 text-xs whitespace-nowrap ${getValueClass(row[col])}`}
                      >
                        {formatValue(row[col])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>

            </table>
          </div>

          {/* ── Footer (shown when >10 rows) ── */}
          {rows.length > 10 && (
            <div className={`px-4 py-2.5 text-[11px] text-right ${theme.footer}`}>
              Showing all {rows.length} rows
            </div>
          )}

        </div>
      ) : (
        <div className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs ${theme.empty}`}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={theme.emptyIcon} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          No results returned for this query.
        </div>
      )}
    </>
  );
}