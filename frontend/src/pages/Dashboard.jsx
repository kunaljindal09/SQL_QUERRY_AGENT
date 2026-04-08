// import { useState, useEffect, useRef } from "react";
// import { toast } from "react-toastify";
// import { queryAPI, historyAPI } from "../services/api";
// import hljs from "highlight.js";
// import SchemaVisualization from "./SchemaVisualization";
// import Table from "./Table";

// /* ─── Icons ──────────────────────────────────────────────────────────────── */
// const Icon = {
//   Send: () => (
//     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
//       <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
//     </svg>
//   ),
//   Star: ({ filled }) => (
//     <svg width="13" height="13" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
//       <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
//     </svg>
//   ),
//   Logout: () => (
//     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//       <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
//     </svg>
//   ),
//   Menu: () => (
//     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
//       <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
//     </svg>
//   ),
//   DB: () => (
//     <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//       <ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" /><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
//     </svg>
//   ),
//   Spinner: () => (
//     <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
//       <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
//     </svg>
//   ),
//   Copy: () => (
//     <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//       <rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
//     </svg>
//   ),
//   Plus: () => (
//     <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
//       <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
//     </svg>
//   ),
//   ChevronRight: ({ open }) => (
//     <svg
//       width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
//       style={{ transform: open ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.2s ease" }}
//     >
//       <polyline points="9 18 15 12 9 6" />
//     </svg>
//   ),
//   Error: () => (
//     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
//       <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
//     </svg>
//   ),
//   Warning: () => (
//     <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
//       <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
//       <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
//     </svg>
//   ),
// };

// /* ─── SQL block with copy ────────────────────────────────────────────────── */
// function SqlBlock({ sql }) {
//   const [copied, setCopied] = useState(false);
//   const highlighted = sql
//     ? hljs.highlightAuto(sql).value
//     : '<span class="text-slate-600 italic">No SQL generated yet</span>';

//   const handleCopy = () => {
//     navigator.clipboard?.writeText(sql);
//     setCopied(true);
//     setTimeout(() => setCopied(false), 1800);
//   };

//   return (
//     <div className="rounded-xl border border-slate-800 overflow-hidden bg-[#070c18]">
//       <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-800 bg-[#060b14]">
//         <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest font-mono">SQL</span>
//         <button
//           onClick={handleCopy}
//           className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-slate-700 text-slate-500 hover:text-slate-200 hover:border-slate-600 transition-all text-[10px] font-medium"
//         >
//           <Icon.Copy />
//           {copied ? "Copied!" : "Copy"}
//         </button>
//       </div>
//       <pre
//         className="p-4 text-[12.5px] leading-relaxed font-mono overflow-x-auto text-slate-300 m-0"
//         dangerouslySetInnerHTML={{ __html: highlighted }}
//       />
//     </div>
//   );
// }

// /* ─── Schema tree accordion ──────────────────────────────────────────────── */
// function SchemaTree({ schema, loading }) {
//   const [openTables, setOpenTables] = useState({});
//   const toggle = (name) => setOpenTables((p) => ({ ...p, [name]: !p[name] }));

//   if (loading) {
//     return (
//       <div className="flex items-center gap-2 text-slate-600 text-xs py-4">
//         <Icon.Spinner /> Loading schema…
//       </div>
//     );
//   }
//   if (!schema?.tables?.length) {
//     return <p className="text-slate-700 text-xs py-3">No schema loaded.</p>;
//   }

//   return (
//     <div className="space-y-1.5">
//       {schema.tables.map((table) => (
//         <div key={table.name} className="rounded-lg border border-slate-800 overflow-hidden bg-[#080d18]">
//           <button
//             onClick={() => toggle(table.name)}
//             className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-slate-800/30 transition-colors"
//           >
//             <div className="flex items-center gap-2 text-blue-400">
//               <Icon.DB />
//               <span className="font-mono text-[11.5px] font-semibold">{table.name}</span>
//             </div>
//             <div className="flex items-center gap-2">
//               <span className="text-[10px] text-slate-600 bg-slate-800/80 px-1.5 py-0.5 rounded-full">
//                 {table.columns?.length}
//               </span>
//               <span className="text-slate-600">
//                 <Icon.ChevronRight open={openTables[table.name]} />
//               </span>
//             </div>
//           </button>
//           {openTables[table.name] && (
//             <div className="border-t border-slate-800">
//               {table.columns?.map((col) => (
//                 <div
//                   key={col.name}
//                   className="flex items-center justify-between px-4 py-1.5 hover:bg-slate-800/20 transition-colors"
//                 >
//                   <span className="font-mono text-[11px] text-slate-400">{col.name}</span>
//                   <span className="font-mono text-[10px] text-slate-600 bg-slate-900 px-1.5 py-0.5 rounded">
//                     {col.type}
//                   </span>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       ))}
//     </div>
//   );
// }

// /* ─── Loading skeleton ───────────────────────────────────────────────────── */
// function Skeleton() {
//   return (
//     <div className="space-y-3 animate-pulse">
//       <p className="text-xs text-slate-600">Generating SQL…</p>
//       {[100, 80, 92, 65].map((w, i) => (
//         <div
//           key={i}
//           className="h-3 rounded-full bg-slate-800"
//           style={{ width: `${w}%` }}
//         />
//       ))}
//     </div>
//   );
// }

// /* ─── Main Dashboard ─────────────────────────────────────────────────────── */
// function Dashboard() {
//   const [question, setQuestion] = useState("");
//   const emptyResponse = () => ({
//     result: [],
//     sql: "",
//     explanation: "No explanation available",
//     error: "",
//   });
//   const [response, setResponse] = useState(emptyResponse);
//   const [schema, setSchema] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [history, setHistory] = useState([]);
//   const [error, setError] = useState("");
//   const [schemaLoading, setSchemaLoading] = useState(false);
//   const [connectionMode, setConnectionMode] = useState("default");
//   const [connectionString, setConnectionString] = useState("");
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const [activeTab, setActiveTab] = useState("explanation");
//   const [inputFocused, setInputFocused] = useState(false);
//   const [schemaViewMode, setSchemaViewMode] = useState("visual"); // "visual" | "tree"

//   const inputRef = useRef(null);

//   const hasQueryOutput =
//     response &&
//     (response.sql ||
//       response.explanation ||
//       response.result != null ||
//       (response.error && response.error.trim()));

//   useEffect(() => {
//     loadHistory();
//     fetchSchema();
//   }, []);

//   const fetchSchema = async (connstr = null) => {
//     setSchemaLoading(true);
//     try {
//       const schema_response = await queryAPI.getSchema(connstr);
//       setSchema(schema_response.data);
//     } catch (err) {
//       console.error("Failed to fetch schema", err);
//     } finally {
//       setSchemaLoading(false);
//     }
//   };

//   const loadHistory = async () => {
//     try {
//       const res = await historyAPI.getHistory({ limit: 50 });
//       setHistory(res.data);
//     } catch (err) {
//       console.error("Failed to load history", err);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e?.preventDefault();
//     if (!question.trim()) return;
//     setLoading(true);
//     setError("");
//     setResponse(emptyResponse());
//     setActiveTab("explanation");
//     try {
//       const connStr = connectionMode === "custom" ? connectionString : null;
//       const res = await queryAPI.askQuestion(question, connStr);
//       setResponse(res.data);
//       if (connectionMode === "custom") fetchSchema(connStr);
//       loadHistory();
//     } catch (err) {
//       if (err.response?.status === 401) {
//         setError("Session expired. Please log in again.");
//         localStorage.removeItem("token");
//         toast.error("Session expired. Please login again.");
//         setTimeout(() => { window.location.href = "/login"; }, 2000);
//       }
//       setError(err.response?.data?.detail || "Failed to get response");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSubmit(); }
//   };

//   const handleConnectionChange = (mode) => {
//     setConnectionMode(mode);
//     const connStr = mode === "custom" ? connectionString : null;
//     fetchSchema(connStr);
//   };

//   const handleConnectionStringBlur = () => {
//     if (connectionMode === "custom" && connectionString.trim()) fetchSchema(connectionString);
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     toast.success("Logged out successfully");
//     setTimeout(() => { window.location.href = "/login"; }, 1000);
//   };

//   const toggleBookmark = async (id) => {
//     try {
//       await historyAPI.toggleBookmark(id);
//       loadHistory();
//     } catch (err) {
//       console.error("Failed to toggle bookmark", err);
//     }
//   };

//   const loadFromHistory = (item) => {
//     setQuestion(item.natural_question);
//     setResponse({
//       sql: item.generated_sql,
//       result: item.execution_result ? JSON.parse(item.execution_result) : [],
//       error: item.error_message || "",
//       explanation: item.explanation || "No explanation available",
//     });
//     setActiveTab("explanation");
//     inputRef.current?.focus();
//   };

//   const suggestions = [
//     "Show all employees with salary > 50000",
//     "Top 5 products by revenue",
//     "Count orders placed last month",
//     "Departments with budget over 100k",
//   ];

//   return (
//     <>
//       {/* Fonts + hljs token theming + scrollbar + animations */}
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Figtree:wght@300;400;500;600;700&display=swap');
//         body, button, input, * { font-family: 'Figtree', sans-serif; }
//         pre, code, .font-mono { font-family: 'JetBrains Mono', monospace !important; }
//         @keyframes fadeUp {
//           from { opacity: 0; transform: translateY(10px); }
//           to   { opacity: 1; transform: translateY(0);    }
//         }
//         .fade-up { animation: fadeUp 0.3s ease forwards; }
//         /* highlight.js token colours for dark bg */
//         .hljs-keyword, .hljs-selector-tag, .hljs-built_in { color: #93c5fd !important; font-weight: 600; }
//         .hljs-string, .hljs-attr  { color: #86efac !important; }
//         .hljs-number, .hljs-literal { color: #fca5a5 !important; }
//         .hljs-comment               { color: #4b5563 !important; font-style: italic; }
//         .hljs-function, .hljs-title { color: #c4b5fd !important; }
//         /* slim scrollbar */
//         ::-webkit-scrollbar { width: 4px; height: 4px; }
//         ::-webkit-scrollbar-track { background: transparent; }
//         ::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 99px; }
//       `}</style>

//       <div className="flex h-screen bg-[#0a0f1a] text-slate-200 overflow-hidden">

//         {/* ── Sidebar ─────────────────────────────────────────────────── */}
//         <aside
//           className="flex flex-col bg-[#060b14] border-r border-slate-900 flex-shrink-0 overflow-hidden transition-all duration-300"
//           style={{ width: sidebarOpen ? "272px" : "0px" }}
//         >
//           {/* Logo */}
//           <div className="flex items-center gap-3 px-4 py-[18px] border-b border-slate-900 flex-shrink-0">
//             <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-600 to-violet-700 flex items-center justify-center flex-shrink-0">
//               <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
//                 <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
//               </svg>
//             </div>
//             <div className="min-w-0">
//               <p className="text-[13px] font-bold text-slate-100 tracking-tight whitespace-nowrap">SQL Agent</p>
//               <p className="text-[10px] text-slate-600 whitespace-nowrap">Query Interface</p>
//             </div>
//           </div>

//           {/* New query */}
//           <div className="p-3 flex-shrink-0">
//             <button
//               onClick={() => { setQuestion(""); setResponse(emptyResponse()); setError(""); inputRef.current?.focus(); }}
//               className="w-full flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-800 text-slate-500 hover:text-slate-200 hover:border-slate-700 hover:bg-slate-800/30 transition-all text-xs font-medium whitespace-nowrap"
//             >
//               <Icon.Plus /> New query
//             </button>
//           </div>

//           {/* Recent label */}
//           <p className="px-4 pb-1 text-[10px] text-slate-600 font-semibold tracking-widest uppercase flex-shrink-0">
//             Recent
//           </p>

//           {/* History list */}
//           <div className="flex-1 overflow-y-auto">
//             {history.length === 0 && (
//               <p className="text-xs text-slate-700 px-4 py-3">No history yet.</p>
//             )}
//             {history.map((item) => (
//               <div
//                 key={item.id}
//                 className="group px-4 py-3 border-b border-slate-900/60 cursor-pointer hover:bg-slate-800/20 transition-colors"
//                 onClick={() => loadFromHistory(item)}
//               >
//                 <div className="flex items-start justify-between gap-2">
//                   <p className="text-[12px] text-slate-400 leading-snug line-clamp-2 flex-1 group-hover:text-slate-200 transition-colors">
//                     {item.natural_question}
//                   </p>
//                   <button
//                     onClick={(e) => { e.stopPropagation(); toggleBookmark(item.id); }}
//                     className={`flex-shrink-0 mt-0.5 transition-colors ${item.is_bookmarked ? "text-amber-400" : "text-slate-700 hover:text-slate-400"}`}
//                   >
//                     <Icon.Star filled={item.is_bookmarked} />
//                   </button>
//                 </div>
//                 <span className="text-[10px] text-slate-700 mt-1 block">
//                   {new Date(item.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
//                 </span>
//               </div>
//             ))}
//           </div>

//           {/* Logout */}
//           <div className="p-3 border-t border-slate-900 flex-shrink-0">
//             <button
//               onClick={handleLogout}
//               className="w-full flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-800 text-slate-500 hover:text-red-400 hover:border-red-900/60 hover:bg-red-950/20 transition-all text-xs font-medium whitespace-nowrap"
//             >
//               <Icon.Logout /> Sign out
//             </button>
//           </div>
//         </aside>

//         {/* ── Main column ─────────────────────────────────────────────── */}
//         <div className="flex-1 flex flex-col min-w-0">

//           {/* Header */}
//           <header className="flex items-center gap-3 px-5 py-3 bg-[#060b14] border-b border-slate-900 flex-shrink-0">
//             <button
//               onClick={() => setSidebarOpen((p) => !p)}
//               className="text-slate-600 hover:text-slate-300 transition-colors p-1.5 rounded-md hover:bg-slate-800/40"
//             >
//               <Icon.Menu />
//             </button>

//             <span className="text-[15px] font-semibold text-slate-100 tracking-tight">SQL Query Agent</span>

//             {/* Connection controls */}
//             <div className="ml-auto flex items-center gap-2.5">
//               {/* Radio-style toggle */}
//               <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-1">
//                 {[
//                   { val: "default", label: "Demo DB" },
//                   { val: "custom",  label: "Custom"  },
//                 ].map(({ val, label }) => (
//                   <button
//                     key={val}
//                     onClick={() => handleConnectionChange(val)}
//                     className={`px-3 py-1 rounded-md text-[11px] font-medium transition-all ${
//                       connectionMode === val
//                         ? "bg-blue-900/60 text-blue-300"
//                         : "text-slate-500 hover:text-slate-300"
//                     }`}
//                   >
//                     {label}
//                   </button>
//                 ))}
//               </div>

//               {connectionMode === "custom" && (
//                 <input
//                   type="text"
//                   value={connectionString}
//                   onChange={(e) => setConnectionString(e.target.value)}
//                   onBlur={handleConnectionStringBlur}
//                   placeholder="e.g. mysql+pymysql://user:pass@host/db"
//                   className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-[11px] font-mono text-slate-300 placeholder-slate-700 outline-none focus:border-blue-700 transition-colors w-72"
//                 />
//               )}
//             </div>
//           </header>

//           {/* Body */}
//           <div className="flex-1 flex overflow-hidden">

//             {/* ── Query + results ── */}
//             <div className="flex-1 overflow-y-auto px-6 py-8 lg:px-10">
//               <div className="max-w-3xl mx-auto flex flex-col min-h-full gap-6">

//                 {/* No-schema warning */}
//                 {!schema?.tables?.length && !schemaLoading && (
//                   <div className="flex items-center gap-2.5 bg-amber-950/30 border border-amber-800/40 rounded-xl px-4 py-3 text-amber-400 text-xs fade-up">
//                     <Icon.Warning />
//                     No schema loaded. The database might be empty or the connection failed. Check the right panel.
//                   </div>
//                 )}

//                 {/* Empty / welcome state */}
//                 {!hasQueryOutput && !loading && !error && (
//                   <div className="flex-1 flex flex-col items-center justify-center text-center py-20 fade-up">
//                     <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-900/70 to-violet-900/50 border border-blue-800/30 flex items-center justify-center mb-5">
//                       <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#93c5fd" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
//                         <ellipse cx="12" cy="5" rx="9" ry="3" />
//                         <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
//                         <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
//                       </svg>
//                     </div>
//                     <h2 className="text-xl font-bold text-slate-100 tracking-tight mb-2">
//                       Ask your database anything
//                     </h2>
//                     <p className="text-slate-500 text-sm mb-8 max-w-xs leading-relaxed">
//                       Write in plain English — get SQL, results, and an explanation instantly.
//                     </p>
//                     <div className="flex flex-wrap gap-2 justify-center">
//                       {suggestions.map((s) => (
//                         <button
//                           key={s}
//                           onClick={() => { setQuestion(s); inputRef.current?.focus(); }}
//                           className="px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-lg text-[12px] text-slate-400 hover:text-slate-200 hover:border-slate-700 hover:bg-slate-800/50 transition-all"
//                         >
//                           {s}
//                         </button>
//                       ))}
//                     </div>
//                   </div>
//                 )}

//                 {/* Generating skeleton */}
//                 {loading && (
//                   <div className="bg-[#070c18] border border-slate-800 rounded-xl p-5 fade-up">
//                     <Skeleton />
//                   </div>
//                 )}

//                 {/* Response area */}
//                 {hasQueryOutput && !loading && (
//                   <div className="space-y-4 fade-up">
//                     {/* Generated SQL — always shown */}
//                     <SqlBlock sql={response.sql} />

//                     {/* Tabs: Explanation | Results */}
//                     <div>
//                       <div className="flex gap-1 mb-3 bg-slate-900/70 border border-slate-800 rounded-lg p-1 w-fit">
//                         {[
//                           { key: "explanation", label: "Explanation" },
//                           {
//                             key: "results",
//                             label: response.result?.length
//                               ? `Results (${response.result.length})`
//                               : "Results",
//                           },
//                         ].map((tab) => (
//                           <button
//                             key={tab.key}
//                             onClick={() => setActiveTab(tab.key)}
//                             className={`px-4 py-1.5 rounded-md text-[12px] font-medium transition-all ${
//                               activeTab === tab.key
//                                 ? "bg-blue-900/70 text-blue-200"
//                                 : "text-slate-500 hover:text-slate-300"
//                             }`}
//                           >
//                             {tab.label}
//                           </button>
//                         ))}
//                       </div>

//                       {/* Explanation panel */}
//                       {activeTab === "explanation" && (
//                         <div className="bg-[#070c18] border border-slate-800 rounded-xl p-5 text-sm text-slate-300 leading-relaxed fade-up">
//                           <div
//                             dangerouslySetInnerHTML={{
//                               __html: response.explanation || "No explanation available.",
//                             }}
//                           />
//                         </div>
//                       )}

//                       {/* Results panel */}
//                       {activeTab === "results" && (
//                         <div className="fade-up">
//                           {response.error?.trim() ? (
//                             <div className="flex gap-3 items-start bg-red-950/30 border border-red-900/40 rounded-xl p-4">
//                               <span className="text-red-400 flex-shrink-0 mt-0.5">
//                                 <Icon.Error />
//                               </span>
//                               <div>
//                                 <p className="text-red-400 text-xs font-semibold mb-1">Query Error</p>
//                                 <p className="text-red-300 text-xs font-mono leading-relaxed">
//                                   {response.error}
//                                 </p>
//                               </div>
//                             </div>
//                           ) : (
//                             <Table response={response.result} />
//                           )}
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 )}

//                 {/* Auth / network error */}
//                 {error && !loading && (
//                   <div className="flex items-center gap-2.5 bg-red-950/30 border border-red-900/40 rounded-xl px-4 py-3 text-red-400 text-xs fade-up">
//                     <Icon.Error /> {error}
//                   </div>
//                 )}

//                 {/* Spacer so input doesn't overlap content */}
//                 <div className="h-4" />
//               </div>
//             </div>

//             {/* ── Schema panel ── */}
//             <aside className="w-80 flex-shrink-0 bg-[#060b14] border-l border-slate-900 flex flex-col overflow-hidden">
//               <div className="px-5 pt-5 pb-3 border-b border-slate-900 flex-shrink-0">
//                 <div className="flex items-center justify-between mb-0.5">
//                   <h2 className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest">
//                     Database Schema
//                   </h2>
//                   {/* visual / tree toggle */}
//                   <div className="flex gap-0.5 bg-slate-900 border border-slate-800 rounded-md p-0.5">
//                     {[{ k: "visual", icon: "⬡" }, { k: "tree", icon: "≡" }].map(({ k, icon }) => (
//                       <button
//                         key={k}
//                         onClick={() => setSchemaViewMode(k)}
//                         className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
//                           schemaViewMode === k
//                             ? "bg-slate-700 text-slate-200"
//                             : "text-slate-600 hover:text-slate-400"
//                         }`}
//                       >
//                         {icon}
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//                 <p className="text-[11px] text-slate-700">
//                   {schemaLoading
//                     ? "Loading schema…"
//                     : schema?.tables?.length
//                     ? `${schema.tables.length} tables`
//                     : "No schema loaded"}
//                 </p>
//               </div>

//               <div className="flex-1 overflow-y-auto p-4 min-h-0">
//                 {schemaViewMode === "visual" ? (
//                   <SchemaVisualization schema={schemaLoading ? null : schema} />
//                 ) : (
//                   <SchemaTree schema={schemaLoading ? null : schema} loading={schemaLoading} />
//                 )}
//               </div>
//             </aside>
//           </div>

//           {/* ── Input bar — fixed to bottom of main column ── */}
//           <div className="flex-shrink-0 px-6 py-4 lg:px-10 bg-gradient-to-t from-[#0a0f1a] via-[#0a0f1a]/95 to-transparent border-t border-slate-900/50">
//             <div className="max-w-3xl mx-auto">
//               <form onSubmit={handleSubmit}>
//                 <div
//                   className={`flex items-center gap-2 bg-[#0d1525] border rounded-xl px-4 py-2 transition-all duration-200 ${
//                     inputFocused
//                       ? "border-blue-700 shadow-[0_0_0_3px_rgba(37,99,235,0.12)]"
//                       : "border-slate-800"
//                   }`}
//                 >
//                   <input
//                     ref={inputRef}
//                     type="text"
//                     value={question}
//                     onChange={(e) => setQuestion(e.target.value)}
//                     onKeyDown={handleKeyDown}
//                     onFocus={() => setInputFocused(true)}
//                     onBlur={() => setInputFocused(false)}
//                     placeholder="Ask a question about your data…"
//                     disabled={loading}
//                     className="flex-1 bg-transparent text-slate-200 text-sm placeholder-slate-600 outline-none py-2 disabled:opacity-40"
//                   />
//                   <button
//                     type="submit"
//                     disabled={loading || !question.trim()}
//                     className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 text-white text-[13px] font-semibold rounded-lg transition-all flex-shrink-0"
//                   >
//                     {loading ? (
//                       <><Icon.Spinner /> Generating</>
//                     ) : (
//                       <><Icon.Send /> Ask</>
//                     )}
//                   </button>
//                 </div>
//               </form>
//               <p className="text-center text-[10px] text-slate-700 mt-2">
//                 Results are AI-generated — always verify before acting on them.
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// export default Dashboard;

import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { queryAPI, historyAPI } from "../services/api";
import hljs from "highlight.js";
import Table from "./Table";

/* ─── Icons ──────────────────────────────────────────────────────────────── */
const Icon = {
  Send: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  ),
  Star: ({ filled }) => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  Logout: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
  Menu: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  ),
  DB: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" /><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </svg>
  ),
  Spinner: () => (
    <svg className="sq-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  ),
  Copy: () => (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  ),
  Plus: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  ChevronRight: ({ open }) => (
    <svg
      width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
      style={{ transform: open ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.2s ease" }}
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  ),
  Error: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  ),
  Warning: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  Schema: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  ),
  Sun: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  ),
  Moon: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  ),
};

/* ─── SQL block ──────────────────────────────────────────────────────────── */
function SqlBlock({ sql }) {
  const [copied, setCopied] = useState(false);
  const highlighted = sql
    ? hljs.highlightAuto(sql).value
    : '<span style="color:#4b5563;font-style:italic">No SQL generated yet</span>';

  const handleCopy = () => {
    navigator.clipboard?.writeText(sql);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="rounded-xl border border-slate-800 overflow-hidden bg-[#070c18]">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-800 bg-[#060b14]">
        <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest font-mono">SQL</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-slate-700 text-slate-500 hover:text-slate-200 hover:border-slate-600 transition-all text-[10px] font-medium"
        >
          <Icon.Copy />
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <pre
        className="p-4 text-[12.5px] leading-relaxed font-mono overflow-x-auto text-slate-300 m-0"
        dangerouslySetInnerHTML={{ __html: highlighted }}
      />
    </div>
  );
}

/* ─── Inline ER Diagram (pure SVG, no external deps) ────────────────────── */
function ERDiagram({ schema, isDark }) {
  // Normalize both .name/.table_name and .name/.column_name field shapes
  const tables = (schema?.tables || []).map((t) => ({
    name: t.table_name || t.name || "?",
    columns: (t.columns || []).map((c) => ({
      name: c.column_name || c.name || "",
      type: c.data_type || c.type || "",
      isPK: !!(c.is_primary_key || c.primary_key),
      isFK: !!(c.is_foreign_key || c.foreign_key),
    })),
    foreignKeys: (t.foreign_keys || []).map((fk) => ({
      toTable: fk.references_table || fk.to_table || fk.referenced_table || "",
    })),
  }));

  if (!tables.length) return <p style={{ color: "#4b5563", fontSize: 12, padding: "12px 0" }}>No schema loaded.</p>;

  const CARD_W = 186;
  const ROW_H = 22;
  const HEADER_H = 32;
  const COL_GAP = 60;
  const ROW_GAP = 44;
  const COLS = 2;
  const OFFSET_X = 12;
  const OFFSET_Y = 12;

  const layouts = tables.map((t, i) => {
    const col = i % COLS;
    const row = Math.floor(i / COLS);
    const height = HEADER_H + t.columns.length * ROW_H + 6;
    return {
      ...t,
      x: OFFSET_X + col * (CARD_W + COL_GAP),
      y: OFFSET_Y + row * (200 + ROW_GAP),
      w: CARD_W,
      h: height,
    };
  });

  const totalRows = Math.ceil(tables.length / COLS);
  const svgH = OFFSET_Y + totalRows * (200 + ROW_GAP) + 20;
  const svgW = OFFSET_X + COLS * (CARD_W + COL_GAP);

  // FK relationship lines
  const lines = [];
  layouts.forEach((src) => {
    (src.foreignKeys || []).forEach((fk) => {
      const tgt = layouts.find((t) => t.name === fk.toTable);
      if (!tgt) return;
      const x1 = src.x + src.w;
      const y1 = src.y + src.h / 2;
      const x2 = tgt.x;
      const y2 = tgt.y + tgt.h / 2;
      const mx = (x1 + x2) / 2;
      lines.push({ x1, y1, x2, y2, mx, my: (y1 + y2) / 2 });
    });
  });

  const c = isDark
    ? { cardBg: "#0b1425", border: "#1a3050", header: "#0e1e38", headerText: "#7dd3fc", colText: "#94a3b8", typeText: "#334155", pkColor: "#fbbf24", fkColor: "#60a5fa", lineColor: "#1d4ed8", lineLabelBg: "#060e1a", lineLabelText: "#3b82f6", rowDivider: "#111e30" }
    : { cardBg: "#ffffff", border: "#bfdbfe", header: "#dbeafe", headerText: "#1e40af", colText: "#374151", typeText: "#9ca3af", pkColor: "#d97706", fkColor: "#2563eb", lineColor: "#93c5fd", lineLabelBg: "#eff6ff", lineLabelText: "#2563eb", rowDivider: "#e0f2fe" };

  return (
    <svg width="100%" viewBox={`0 0 ${svgW} ${svgH}`} style={{ display: "block" }}>
      <defs>
        <marker id="er-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M1 1L9 5L1 9" fill="none" stroke={c.lineColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </marker>
        <marker id="er-crow" viewBox="0 0 14 14" refX="1" refY="7" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M7 2L1 7L7 12M12 2L6 7L12 12" fill="none" stroke={c.lineColor} strokeWidth="1.5" strokeLinecap="round" />
        </marker>
      </defs>

      {/* Relationship lines */}
      {lines.map((l, i) => (
        <g key={i}>
          <path
            d={`M${l.x1},${l.y1} C${l.mx},${l.y1} ${l.mx},${l.y2} ${l.x2},${l.y2}`}
            fill="none" stroke={c.lineColor} strokeWidth="1.5" strokeDasharray="4 3"
            markerEnd="url(#er-arrow)" markerStart="url(#er-crow)"
          />
          <rect x={l.mx - 13} y={l.my - 8} width="26" height="15" rx="4" fill={c.lineLabelBg} stroke={c.lineColor} strokeWidth="0.8" />
          <text x={l.mx} y={l.my + 4} textAnchor="middle" fontSize="8" fontWeight="700" fontFamily="JetBrains Mono,monospace" fill={c.lineLabelText}>N:1</text>
        </g>
      ))}

      {/* Table cards */}
      {layouts.map((t) => (
        <g key={t.name}>
          {isDark && <rect x={t.x + 2} y={t.y + 2} width={t.w} height={t.h} rx="7" fill="#000" opacity="0.35" />}
          {/* Body */}
          <rect x={t.x} y={t.y} width={t.w} height={t.h} rx="7" fill={c.cardBg} stroke={c.border} strokeWidth="1" />
          {/* Header */}
          <rect x={t.x} y={t.y} width={t.w} height={HEADER_H} rx="7" fill={c.header} />
          <rect x={t.x} y={t.y + HEADER_H - 6} width={t.w} height={6} fill={c.header} />
          {/* Table name */}
          <text x={t.x + 10} y={t.y + 21} fontSize="11" fontWeight="700" fontFamily="JetBrains Mono,monospace" fill={c.headerText}>
            {t.name.length > 17 ? t.name.slice(0, 16) + "…" : t.name}
          </text>
          {/* Column count */}
          <rect x={t.x + t.w - 24} y={t.y + 9} width="18" height="13" rx="6" fill={isDark ? "#1a3050" : "#bfdbfe"} />
          <text x={t.x + t.w - 15} y={t.y + 19} textAnchor="middle" fontSize="8" fontWeight="600" fontFamily="sans-serif" fill={c.headerText}>{t.columns.length}</text>
          {/* Divider */}
          <line x1={t.x} y1={t.y + HEADER_H} x2={t.x + t.w} y2={t.y + HEADER_H} stroke={c.border} strokeWidth="1" />
          {/* Columns */}
          {t.columns.map((col, ci) => {
            const ry = t.y + HEADER_H + ci * ROW_H + 3;
            return (
              <g key={col.name}>
                {(col.isPK || col.isFK) && (
                  <rect x={t.x + 1} y={ry} width={t.w - 2} height={ROW_H} rx="0"
                    fill={col.isPK ? (isDark ? "rgba(251,191,36,0.07)" : "rgba(251,191,36,0.1)") : (isDark ? "rgba(96,165,250,0.06)" : "rgba(96,165,250,0.08)")} />
                )}
                {col.isPK && <text x={t.x + 7} y={ry + 14} fontSize="9" fill={c.pkColor}>🔑</text>}
                {col.isFK && !col.isPK && <text x={t.x + 7} y={ry + 14} fontSize="9" fill={c.fkColor}>🔗</text>}
                <text
                  x={t.x + (col.isPK || col.isFK ? 20 : 8)}
                  y={ry + 14}
                  fontSize="10.5" fontFamily="JetBrains Mono,monospace"
                  fill={col.isPK ? c.pkColor : col.isFK ? c.fkColor : c.colText}
                  fontWeight={col.isPK ? "600" : "400"}
                >
                  {col.name.length > 15 ? col.name.slice(0, 14) + "…" : col.name}
                </text>
                {col.type && (
                  <text x={t.x + t.w - 6} y={ry + 14} textAnchor="end" fontSize="9" fontFamily="JetBrains Mono,monospace" fill={c.typeText}>
                    {col.type.length > 9 ? col.type.slice(0, 8) + "…" : col.type}
                  </text>
                )}
                {ci < t.columns.length - 1 && (
                  <line x1={t.x + 5} y1={ry + ROW_H} x2={t.x + t.w - 5} y2={ry + ROW_H} stroke={c.rowDivider} strokeWidth="0.5" />
                )}
              </g>
            );
          })}
        </g>
      ))}
    </svg>
  );
}

/* ─── Schema tree ────────────────────────────────────────────────────────── */
function SchemaTree({ schema, loading, isDark }) {
  const [openTables, setOpenTables] = useState({});
  const toggle = (name) => setOpenTables((p) => ({ ...p, [name]: !p[name] }));

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#4b5563", fontSize: 12, padding: "12px 0" }}>
      <Icon.Spinner /> Loading schema…
    </div>
  );

  const tables = (schema?.tables || []).map((t) => ({
    name: t.table_name || t.name || "?",
    columns: (t.columns || []).map((c) => ({
      name: c.column_name || c.name || "",
      type: c.data_type || c.type || "",
      isPK: !!(c.is_primary_key || c.primary_key),
      isFK: !!(c.is_foreign_key || c.foreign_key),
    })),
    fkCount: (t.foreign_keys || []).length,
  }));

  if (!tables.length) return <p style={{ color: "#4b5563", fontSize: 12, padding: "12px 0" }}>No schema loaded.</p>;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {tables.map((table) => (
        <div key={table.name} style={{
          borderRadius: 8,
          border: `1px solid ${isDark ? "#0f1929" : "#bfdbfe"}`,
          overflow: "hidden",
          background: isDark ? "#060b14" : "#ffffff",
        }}>
          <button
            onClick={() => toggle(table.name)}
            style={{
              width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "8px 12px", background: "transparent", border: "none", cursor: "pointer",
              transition: "background 0.15s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = isDark ? "rgba(30,58,92,0.2)" : "#eff6ff"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 7, color: isDark ? "#60a5fa" : "#2563eb" }}>
              <Icon.DB />
              <span style={{ fontFamily: "JetBrains Mono,monospace", fontSize: 11.5, fontWeight: 600 }}>{table.name}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              {table.fkCount > 0 && (
                <span style={{ fontSize: 9, padding: "1px 5px", borderRadius: 9, background: isDark ? "rgba(37,99,235,0.2)" : "#dbeafe", color: isDark ? "#60a5fa" : "#1d4ed8", fontFamily: "monospace" }}>
                  {table.fkCount} FK
                </span>
              )}
              <span style={{ fontSize: 10, padding: "1px 5px", borderRadius: 9, background: isDark ? "#0f1929" : "#f1f5f9", color: isDark ? "#334155" : "#64748b" }}>
                {table.columns.length}
              </span>
              <span style={{ color: isDark ? "#334155" : "#94a3b8" }}><Icon.ChevronRight open={openTables[table.name]} /></span>
            </div>
          </button>

          {openTables[table.name] && (
            <div style={{ borderTop: `1px solid ${isDark ? "#0f1929" : "#bfdbfe"}` }}>
              {table.columns.map((col) => (
                <div key={col.name} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "5px 14px",
                  background: col.isPK ? (isDark ? "rgba(251,191,36,0.06)" : "rgba(251,191,36,0.07)") : col.isFK ? (isDark ? "rgba(96,165,250,0.05)" : "rgba(96,165,250,0.06)") : "transparent",
                  borderBottom: `1px solid ${isDark ? "rgba(15,25,41,0.8)" : "#e0f2fe"}`,
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    {col.isPK && <span style={{ fontSize: 10 }}>🔑</span>}
                    {col.isFK && !col.isPK && <span style={{ fontSize: 10 }}>🔗</span>}
                    <span style={{
                      fontFamily: "JetBrains Mono,monospace", fontSize: 11,
                      color: col.isPK ? "#fbbf24" : col.isFK ? (isDark ? "#60a5fa" : "#2563eb") : (isDark ? "#94a3b8" : "#374151"),
                      fontWeight: col.isPK ? 600 : 400,
                    }}>{col.name}</span>
                  </div>
                  <span style={{ fontFamily: "JetBrains Mono,monospace", fontSize: 10, color: isDark ? "#1e3a5f" : "#9ca3af", background: isDark ? "#080e1c" : "#f1f5f9", padding: "1px 6px", borderRadius: 4 }}>
                    {col.type}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/* ─── Main Dashboard ─────────────────────────────────────────────────────── */
function Dashboard() {
  const [question, setQuestion] = useState("");
  const emptyResponse = () => ({ result: [], sql: "", explanation: "No explanation available", error: "" });
  const [response, setResponse] = useState(emptyResponse);
  const [schema, setSchema] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");
  const [schemaLoading, setSchemaLoading] = useState(false);
  const [connectionMode, setConnectionMode] = useState("default");
  const [connectionString, setConnectionString] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("explanation");
  const [inputFocused, setInputFocused] = useState(false);
  const [schemaViewMode, setSchemaViewMode] = useState("tree"); // "er" | "tree"
  const [schemaOpen, setSchemaOpen] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem("sq-theme") || "dark");

  const inputRef = useRef(null);
  const isDark = theme === "dark";

  useEffect(() => {
    localStorage.setItem("sq-theme", theme);
  }, [theme]);

  const hasQueryOutput =
    response && (response.sql || response.explanation || response.result != null || (response.error && response.error.trim()));

  useEffect(() => { loadHistory(); fetchSchema(); }, []);

  const fetchSchema = async (connstr = null) => {
    setSchemaLoading(true);
    try {
      const r = await queryAPI.getSchema(connstr);
      setSchema(r.data);
    } catch (err) { console.error("Failed to fetch schema", err); }
    finally { setSchemaLoading(false); }
  };

  const loadHistory = async () => {
    try { const r = await historyAPI.getHistory({ limit: 50 }); setHistory(r.data); }
    catch (err) { console.error("Failed to load history", err); }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!question.trim()) return;
    setLoading(true); setError(""); setResponse(emptyResponse()); setActiveTab("explanation");
    try {
      const connStr = connectionMode === "custom" ? connectionString : null;
      const res = await queryAPI.askQuestion(question, connStr);
      setResponse(res.data);
      if (connectionMode === "custom") fetchSchema(connStr);
      loadHistory();
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Session expired. Please log in again.");
        localStorage.removeItem("token");
        toast.error("Session expired. Please login again.");
        setTimeout(() => { window.location.href = "/login"; }, 2000);
      }
      setError(err.response?.data?.detail || "Failed to get response");
    } finally { setLoading(false); }
  };

  const handleKeyDown = (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSubmit(); } };
  const handleConnectionChange = (mode) => { setConnectionMode(mode); fetchSchema(mode === "custom" ? connectionString : null); };
  const handleConnectionStringBlur = () => { if (connectionMode === "custom" && connectionString.trim()) fetchSchema(connectionString); };
  const handleLogout = () => { localStorage.removeItem("token"); toast.success("Logged out successfully"); setTimeout(() => { window.location.href = "/login"; }, 1000); };
  const toggleBookmark = async (id) => { try { await historyAPI.toggleBookmark(id); loadHistory(); } catch (err) { console.error(err); } };
  const loadFromHistory = (item) => {
    setQuestion(item.natural_question);
    setResponse({ sql: item.generated_sql, result: item.execution_result ? JSON.parse(item.execution_result) : [], error: item.error_message || "", explanation: item.explanation || "No explanation available" });
    setActiveTab("explanation");
    inputRef.current?.focus();
  };

  const suggestions = ["Show all employees with salary > 50000", "Top 5 products by revenue", "Count orders placed last month", "Departments with budget over 100k"];

  // ── Colour tokens based on theme
  const bg = {
    app:     isDark ? "#07090f"  : "#f0f4ff",
    sidebar: isDark ? "#040710"  : "#ffffff",
    header:  isDark ? "#040710"  : "#ffffff",
    card:    isDark ? "#070c18"  : "#ffffff",
    input:   isDark ? "#0a1020"  : "#f8faff",
    schema:  isDark ? "#04070e"  : "#f0f6ff",
  };
  const border = isDark ? "#0f1929" : "#e2e8f0";
  const borderCls = isDark ? "border-slate-900" : "border-slate-200";
  const txt = { primary: isDark ? "#e2e8f0" : "#1e293b", muted: isDark ? "#475569" : "#64748b", faint: isDark ? "#1e293b" : "#94a3b8" };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Figtree:wght@300;400;500;600;700&display=swap');
        *, body, button, input { font-family: 'Figtree', sans-serif; }
        pre, code, .font-mono  { font-family: 'JetBrains Mono', monospace !important; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(10px);} to { opacity:1; transform:translateY(0);} }
        @keyframes sq-spin { to { transform: rotate(360deg); } }
        .fade-up  { animation: fadeUp 0.3s ease forwards; }
        .sq-spin  { animation: sq-spin 1s linear infinite; }
        .animate-pulse { animation: pulse 2s cubic-bezier(.4,0,.6,1) infinite; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
        .hljs-keyword,.hljs-selector-tag,.hljs-built_in { color:#93c5fd !important; font-weight:600; }
        .hljs-string,.hljs-attr  { color:#86efac !important; }
        .hljs-number,.hljs-literal { color:#fca5a5 !important; }
        .hljs-comment              { color:#4b5563 !important; font-style:italic; }
        .hljs-function,.hljs-title { color:#c4b5fd !important; }
        ::-webkit-scrollbar { width:4px; height:4px; }
        ::-webkit-scrollbar-track { background:transparent; }
        ::-webkit-scrollbar-thumb { background:${isDark ? "#1e293b" : "#cbd5e1"}; border-radius:99px; }
      `}</style>

      <div style={{ display: "flex", height: "100vh", overflow: "hidden", background: bg.app, color: txt.primary, fontFamily: "'Figtree',sans-serif" }}>

        {/* ── Sidebar ──────────────────────────────────────────────── */}
        <aside style={{
          width: sidebarOpen ? 272 : 0, minWidth: sidebarOpen ? 272 : 0,
          display: "flex", flexDirection: "column", flexShrink: 0, overflow: "hidden",
          transition: "width 0.3s ease, min-width 0.3s ease",
          background: bg.sidebar, borderRight: `1px solid ${border}`,
        }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "18px 16px", borderBottom: `1px solid ${border}`, flexShrink: 0 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg,#2563eb,#7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
            </div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, color: txt.primary, margin: 0, whiteSpace: "nowrap" }}>SQL Agent</p>
              <p style={{ fontSize: 10, color: txt.faint, margin: 0, whiteSpace: "nowrap" }}>Query Interface</p>
            </div>
          </div>

          {/* New query button */}
          <div style={{ padding: "10px 10px 4px" }}>
            <SideBtn
              onClick={() => { setQuestion(""); setResponse(emptyResponse()); setError(""); inputRef.current?.focus(); }}
              isDark={isDark} border={border}
            >
              <Icon.Plus /> New query
            </SideBtn>
          </div>

          {/* ── Schema toggle */}
          <div style={{ padding: "4px 10px 6px" }}>
            <button
              onClick={() => setSchemaOpen(p => !p)}
              style={{
                width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "8px 12px", borderRadius: 8, border: `1px solid ${schemaOpen ? (isDark ? "#1d4ed8" : "#93c5fd") : border}`,
                background: schemaOpen ? (isDark ? "rgba(29,78,216,0.12)" : "rgba(219,234,254,0.5)") : "transparent",
                color: schemaOpen ? (isDark ? "#60a5fa" : "#2563eb") : txt.muted,
                fontSize: 12, fontWeight: 500, cursor: "pointer", transition: "all 0.15s",
              }}
              onMouseEnter={e => { if (!schemaOpen) { e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.03)" : "#f8faff"; e.currentTarget.style.color = txt.primary; }}}
              onMouseLeave={e => { if (!schemaOpen) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = txt.muted; }}}
            >
              <span style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <Icon.Schema />
                Database Schema
                {(schema?.tables?.length > 0) && (
                  <span style={{ fontSize: 9, padding: "1px 5px", borderRadius: 9, background: isDark ? "#0f1929" : "#e0f2fe", color: isDark ? "#334155" : "#0284c7" }}>
                    {schema.tables.length}
                  </span>
                )}
              </span>
              <Icon.ChevronRight open={schemaOpen} />
            </button>
          </div>

          {/* ── Schema panel (collapsible) */}
          <div style={{
            overflow: "hidden",
            maxHeight: schemaOpen ? "400px" : "0px",
            transition: "max-height 0.3s ease",
            flexShrink: 0,
            margin: schemaOpen ? "0 10px 6px" : "0 10px",
            borderRadius: 10,
            border: schemaOpen ? `1px solid ${border}` : "none",
            background: bg.schema,
          }}>
            {/* Schema header row */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 12px", borderBottom: `1px solid ${border}` }}>
              <span style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: txt.faint }}>
                {schemaLoading ? "Loading…" : schema?.tables?.length ? `${schema.tables.length} tables` : "No schema"}
              </span>
              {/* ER / Tree toggle */}
              <div style={{ display: "flex", gap: 2, padding: 2, borderRadius: 6, background: isDark ? "#0a1020" : "#e2e8f0", border: `1px solid ${border}` }}>
                {[{ k: "er", label: "ER" }, { k: "tree", label: "≡" }].map(({ k, label }) => (
                  <button key={k} onClick={() => setSchemaViewMode(k)} style={{
                    padding: "2px 7px", borderRadius: 4, border: "none", cursor: "pointer", fontSize: 10, fontWeight: 600, transition: "all 0.15s",
                    background: schemaViewMode === k ? (isDark ? "#1e3a5f" : "#ffffff") : "transparent",
                    color: schemaViewMode === k ? (isDark ? "#93c5fd" : "#1d4ed8") : txt.faint,
                    boxShadow: schemaViewMode === k && !isDark ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
                  }}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
            {/* Schema content */}
            <div style={{ overflowY: "auto", overflowX: "auto", maxHeight: 330, padding: 8 }}>
              {schemaViewMode === "er"
                ? <ERDiagram schema={schemaLoading ? null : schema} isDark={isDark} />
                : <SchemaTree schema={schemaLoading ? null : schema} loading={schemaLoading} isDark={isDark} />
              }
            </div>
          </div>

          {/* Recent label */}
          <p style={{ padding: "4px 16px 6px", fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: txt.faint, margin: 0, flexShrink: 0 }}>Recent</p>

          {/* History */}
          <div style={{ flex: 1, overflowY: "auto" }}>
            {history.length === 0 && <p style={{ fontSize: 12, color: txt.faint, padding: "8px 16px" }}>No history yet.</p>}
            {history.map((item) => (
              <div key={item.id} onClick={() => loadFromHistory(item)} style={{ padding: "10px 16px", borderBottom: `1px solid ${border}`, cursor: "pointer", transition: "background 0.12s" }}
                onMouseEnter={e => e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.02)" : "#f8faff"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
                  <p style={{ fontSize: 12, color: isDark ? "#64748b" : "#475569", margin: 0, lineHeight: 1.4, flex: 1, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                    {item.natural_question}
                  </p>
                  <button onClick={e => { e.stopPropagation(); toggleBookmark(item.id); }} style={{ background: "none", border: "none", cursor: "pointer", flexShrink: 0, color: item.is_bookmarked ? "#fbbf24" : (isDark ? "#1e293b" : "#cbd5e1"), marginTop: 1 }}>
                    <Icon.Star filled={item.is_bookmarked} />
                  </button>
                </div>
                <span style={{ fontSize: 10, color: txt.faint, marginTop: 3, display: "block" }}>
                  {new Date(item.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </span>
              </div>
            ))}
          </div>

          {/* ── Bottom: theme toggle + logout */}
          <div style={{ padding: "8px 10px", borderTop: `1px solid ${border}`, flexShrink: 0, display: "flex", flexDirection: "column", gap: 4 }}>
            {/* Theme toggle */}
            <button
              onClick={() => setTheme(t => t === "dark" ? "light" : "dark")}
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "8px 12px",
                borderRadius: 8, border: `1px solid ${border}`, background: "transparent",
                color: txt.muted, fontSize: 12, fontWeight: 500, cursor: "pointer", transition: "all 0.15s",
              }}
              onMouseEnter={e => { e.currentTarget.style.color = isDark ? "#fcd34d" : "#2563eb"; e.currentTarget.style.background = isDark ? "rgba(251,191,36,0.06)" : "rgba(219,234,254,0.4)"; e.currentTarget.style.borderColor = isDark ? "rgba(251,191,36,0.2)" : "#93c5fd"; }}
              onMouseLeave={e => { e.currentTarget.style.color = txt.muted; e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = border; }}
            >
              {isDark ? <Icon.Sun /> : <Icon.Moon />}
              {isDark ? "Switch to light mode" : "Switch to dark mode"}
            </button>
            {/* Logout */}
            <button
              onClick={handleLogout}
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "8px 12px",
                borderRadius: 8, border: `1px solid ${border}`, background: "transparent",
                color: txt.muted, fontSize: 12, fontWeight: 500, cursor: "pointer", transition: "all 0.15s",
              }}
              onMouseEnter={e => { e.currentTarget.style.color = "#f87171"; e.currentTarget.style.background = isDark ? "rgba(239,68,68,0.07)" : "rgba(254,226,226,0.5)"; e.currentTarget.style.borderColor = isDark ? "rgba(239,68,68,0.2)" : "#fca5a5"; }}
              onMouseLeave={e => { e.currentTarget.style.color = txt.muted; e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = border; }}
            >
              <Icon.Logout /> Sign out
            </button>
          </div>
        </aside>

        {/* ── Main column ─────────────────────────────────────────────── */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>

          {/* Header */}
          <header style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 20px", background: bg.header, borderBottom: `1px solid ${border}`, flexShrink: 0 }}>
            <button onClick={() => setSidebarOpen(p => !p)} style={{ background: "transparent", border: "none", cursor: "pointer", color: txt.faint, padding: 6, borderRadius: 6, transition: "color 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.color = txt.primary} onMouseLeave={e => e.currentTarget.style.color = txt.faint}>
              <Icon.Menu />
            </button>

            <span style={{ fontSize: 15, fontWeight: 700, color: txt.primary }}>SQL Query Agent</span>

            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
              {/* Connection toggle */}
              <div style={{ display: "flex", gap: 4, padding: 4, borderRadius: 8, background: isDark ? "#070c18" : "#f1f5f9", border: `1px solid ${border}` }}>
                {[{ val: "default", label: "Demo DB" }, { val: "custom", label: "Custom" }].map(({ val, label }) => (
                  <button key={val} onClick={() => handleConnectionChange(val)} style={{
                    padding: "4px 12px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 11, fontWeight: 500, transition: "all 0.15s",
                    background: connectionMode === val ? (isDark ? "rgba(37,99,235,0.35)" : "#dbeafe") : "transparent",
                    color: connectionMode === val ? (isDark ? "#93c5fd" : "#1d4ed8") : txt.muted,
                  }}>
                    {label}
                  </button>
                ))}
              </div>
              {connectionMode === "custom" && (
                <input type="text" value={connectionString} onChange={e => setConnectionString(e.target.value)} onBlur={handleConnectionStringBlur}
                  placeholder="mysql+pymysql://user:pass@host/db"
                  style={{ padding: "6px 12px", background: isDark ? "#070c18" : "#ffffff", border: `1px solid ${border}`, borderRadius: 8, fontSize: 11, fontFamily: "JetBrains Mono,monospace", color: txt.primary, outline: "none", width: 280 }}
                />
              )}
            </div>
          </header>

          {/* Scrollable content */}
          <div style={{ flex: 1, overflowY: "auto", padding: "32px 40px" }}>
            <div style={{ maxWidth: 740, margin: "0 auto", display: "flex", flexDirection: "column", gap: 20 }}>

              {/* No-schema warning */}
              {!schema?.tables?.length && !schemaLoading && (
                <div className="fade-up" style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", borderRadius: 12, background: isDark ? "rgba(120,53,15,0.2)" : "#fffbeb", border: `1px solid ${isDark ? "rgba(120,53,15,0.4)" : "#fcd34d"}`, color: isDark ? "#fbbf24" : "#92400e", fontSize: 12 }}>
                  <Icon.Warning /> No schema loaded. Click "Database Schema" in the sidebar to inspect your tables.
                </div>
              )}

              {/* Welcome / empty state */}
              {!hasQueryOutput && !loading && !error && (
                <div className="fade-up" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "80px 0" }}>
                  <div style={{ width: 56, height: 56, borderRadius: 18, background: isDark ? "linear-gradient(135deg,rgba(37,99,235,0.3),rgba(124,58,237,0.2))" : "linear-gradient(135deg,#dbeafe,#ede9fe)", border: `1px solid ${isDark ? "rgba(37,99,235,0.3)" : "#bfdbfe"}`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={isDark ? "#93c5fd" : "#2563eb"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" /><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
                    </svg>
                  </div>
                  <h2 style={{ fontSize: 20, fontWeight: 700, color: txt.primary, margin: "0 0 8px" }}>Ask your database anything</h2>
                  <p style={{ fontSize: 13, color: txt.muted, maxWidth: 340, margin: "0 0 28px", lineHeight: 1.6 }}>
                    Write in plain English — get SQL, results, and an explanation instantly.
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
                    {suggestions.map(s => (
                      <button key={s} onClick={() => { setQuestion(s); inputRef.current?.focus(); }} style={{
                        padding: "8px 14px", borderRadius: 8, border: `1px solid ${border}`, fontSize: 12,
                        background: isDark ? "#070c18" : "#ffffff", color: txt.muted, cursor: "pointer", transition: "all 0.15s",
                      }}
                        onMouseEnter={e => { e.currentTarget.style.color = txt.primary; e.currentTarget.style.borderColor = isDark ? "#1d4ed8" : "#93c5fd"; e.currentTarget.style.background = isDark ? "#0a1020" : "#eff6ff"; }}
                        onMouseLeave={e => { e.currentTarget.style.color = txt.muted; e.currentTarget.style.borderColor = border; e.currentTarget.style.background = isDark ? "#070c18" : "#ffffff"; }}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Loading skeleton */}
              {loading && (
                <div className="fade-up" style={{ borderRadius: 12, border: `1px solid ${border}`, padding: 20, background: isDark ? "#070c18" : "#ffffff" }}>
                  <div className="animate-pulse" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <p style={{ fontSize: 12, color: txt.faint, margin: 0 }}>Generating SQL…</p>
                    {[100, 80, 92, 65].map((w, i) => (
                      <div key={i} style={{ height: 12, borderRadius: 999, width: `${w}%`, background: isDark ? "#0f1929" : "#e2e8f0" }} />
                    ))}
                  </div>
                </div>
              )}

              {/* Response */}
              {hasQueryOutput && !loading && (
                <div className="fade-up" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <SqlBlock sql={response.sql} />

                  {/* Tabs */}
                  <div>
                    <div style={{ display: "flex", gap: 4, marginBottom: 12, padding: 4, borderRadius: 8, border: `1px solid ${border}`, background: isDark ? "rgba(10,16,32,0.7)" : "#f1f5f9", width: "fit-content" }}>
                      {[{ key: "explanation", label: "Explanation" }, { key: "results", label: response.result?.length ? `Results (${response.result.length})` : "Results" }].map(tab => (
                        <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
                          padding: "6px 16px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 500, transition: "all 0.15s",
                          background: activeTab === tab.key ? (isDark ? "rgba(37,99,235,0.4)" : "#2563eb") : "transparent",
                          color: activeTab === tab.key ? (isDark ? "#bfdbfe" : "#ffffff") : txt.muted,
                        }}>{tab.label}</button>
                      ))}
                    </div>

                    {activeTab === "explanation" && (
                      <div className="fade-up" style={{ borderRadius: 12, border: `1px solid ${border}`, padding: 20, background: isDark ? "#070c18" : "#ffffff", fontSize: 13, lineHeight: 1.7, color: isDark ? "#94a3b8" : "#374151" }}>
                        <div dangerouslySetInnerHTML={{ __html: response.explanation || "No explanation available." }} />
                      </div>
                    )}

                    {activeTab === "results" && (
                      <div className="fade-up">
                        {response.error?.trim() ? (
                          <div style={{ display: "flex", gap: 12, alignItems: "flex-start", borderRadius: 12, padding: 16, background: isDark ? "rgba(127,29,29,0.2)" : "#fef2f2", border: `1px solid ${isDark ? "rgba(127,29,29,0.4)" : "#fca5a5"}`, color: isDark ? "#f87171" : "#b91c1c" }}>
                            <span style={{ flexShrink: 0, marginTop: 1 }}><Icon.Error /></span>
                            <div>
                              <p style={{ fontSize: 11, fontWeight: 600, margin: "0 0 4px" }}>Query Error</p>
                              <p style={{ fontSize: 11, fontFamily: "JetBrains Mono,monospace", margin: 0, lineHeight: 1.6 }}>{response.error}</p>
                            </div>
                          </div>
                        ) : (
                          <Table response={response.result} />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Error banner */}
              {error && !loading && (
                <div className="fade-up" style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", borderRadius: 12, background: isDark ? "rgba(127,29,29,0.2)" : "#fef2f2", border: `1px solid ${isDark ? "rgba(127,29,29,0.4)" : "#fca5a5"}`, color: isDark ? "#f87171" : "#b91c1c", fontSize: 12 }}>
                  <Icon.Error /> {error}
                </div>
              )}

              <div style={{ height: 16 }} />
            </div>
          </div>

          {/* ── Input bar ── */}
          <div style={{ flexShrink: 0, padding: "12px 40px 20px", background: bg.app, borderTop: `1px solid ${border}` }}>
            <div style={{ maxWidth: 740, margin: "0 auto" }}>
              <form onSubmit={handleSubmit}>
                <div style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "8px 12px", borderRadius: 12,
                  background: bg.input,
                  border: `1px solid ${inputFocused ? (isDark ? "#1d4ed8" : "#3b82f6") : border}`,
                  boxShadow: inputFocused ? (isDark ? "0 0 0 3px rgba(29,78,216,0.15)" : "0 0 0 3px rgba(59,130,246,0.12)") : "none",
                  transition: "border-color 0.2s, box-shadow 0.2s",
                }}>
                  <input
                    ref={inputRef}
                    type="text"
                    value={question}
                    onChange={e => setQuestion(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setInputFocused(true)}
                    onBlur={() => setInputFocused(false)}
                    placeholder="Ask a question about your data…"
                    disabled={loading}
                    style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: 13, color: txt.primary, padding: "4px 0", opacity: loading ? 0.4 : 1 }}
                  />
                  <button type="submit" disabled={loading || !question.trim()} style={{
                    display: "flex", alignItems: "center", gap: 6, padding: "7px 16px",
                    background: loading || !question.trim() ? (isDark ? "#0f1929" : "#e2e8f0") : "#2563eb",
                    color: loading || !question.trim() ? (isDark ? "#334155" : "#94a3b8") : "#ffffff",
                    border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: loading || !question.trim() ? "not-allowed" : "pointer",
                    transition: "all 0.15s", flexShrink: 0,
                  }}
                    onMouseEnter={e => { if (!loading && question.trim()) e.currentTarget.style.background = "#1d4ed8"; }}
                    onMouseLeave={e => { if (!loading && question.trim()) e.currentTarget.style.background = "#2563eb"; }}
                  >
                    {loading ? <><Icon.Spinner /> Generating</> : <><Icon.Send /> Ask</>}
                  </button>
                </div>
              </form>
              <p style={{ textAlign: "center", fontSize: 10, marginTop: 8, color: txt.faint }}>
                Results are AI-generated — always verify before acting on them.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ─── Small helper: sidebar button ──────────────────────────────────────── */
function SideBtn({ onClick, children, isDark, border }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%", display: "flex", alignItems: "center", gap: 7, padding: "8px 12px",
        borderRadius: 8, border: `1px solid ${border}`, background: "transparent",
        color: isDark ? "#475569" : "#64748b", fontSize: 12, fontWeight: 500, cursor: "pointer", transition: "all 0.15s",
      }}
      onMouseEnter={e => { e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.03)" : "#f8faff"; e.currentTarget.style.color = isDark ? "#e2e8f0" : "#1e293b"; e.currentTarget.style.borderColor = isDark ? "#1d4ed8" : "#93c5fd"; }}
      onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = isDark ? "#475569" : "#64748b"; e.currentTarget.style.borderColor = border; }}
    >
      {children}
    </button>
  );
}

export default Dashboard;