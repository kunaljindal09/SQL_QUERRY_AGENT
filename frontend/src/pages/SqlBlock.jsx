function SqlBlock({ sql, isDark = false }) {
  const [copied, setCopied] = useState(false);

  const highlighted = sql
    ? hljs.highlightAuto(sql).value
    : '<span class="italic opacity-60">No SQL generated yet</span>';

  const handleCopy = () => {
    navigator.clipboard?.writeText(sql || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  // ───────────────────────────────────────────────────────────
  // THEME TOKENS
  // ───────────────────────────────────────────────────────────
  const theme = isDark
    ? {
        wrapper: "bg-[#070c18] border border-slate-800",
        topBar: "bg-[#060b14] border-slate-800",
        label: "text-slate-500",
        button:
          "border border-slate-700 text-slate-500 hover:text-slate-200 hover:border-slate-600",
        code: "text-slate-300",
      }
    : {
        wrapper: "bg-white border border-slate-300",
        topBar: "bg-slate-50 border-slate-200",
        label: "text-slate-600",
        button:
          "border border-slate-300 text-slate-600 hover:text-slate-800 hover:border-slate-400",
        code: "text-slate-800",
      };

  return (
    <div className={`rounded-xl overflow-hidden ${theme.wrapper}`}>
      {/* Header */}
      <div
        className={`flex items-center justify-between px-4 py-2.5 border-b ${theme.topBar}`}
      >
        <span
          className={`text-[10px] font-semibold uppercase tracking-widest font-mono ${theme.label}`}
        >
          SQL
        </span>

        <button
          onClick={handleCopy}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-medium transition-all ${theme.button}`}
        >
          <Icon.Copy />
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>

      {/* Code */}
      <pre
        className={`p-4 text-[12.5px] leading-relaxed font-mono overflow-x-auto m-0 ${theme.code}`}
        dangerouslySetInnerHTML={{ __html: highlighted }}
      />
    </div>
  );
}