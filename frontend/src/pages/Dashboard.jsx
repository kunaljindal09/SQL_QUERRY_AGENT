// import { useState, useEffect } from "react";
// import { toast } from "react-toastify";
// import { queryAPI, historyAPI } from "../services/api";
// import hljs from "highlight.js";
// import "highlight.js/styles/github.css";
// import SchemaVisualization from "./SchemaVisualization";
// import Table from "./Table";

// const emptyResponse = () => ({
//   result: [],
//   sql: "",
//   explanation: "No explanation available",
//   error: "",
// });

// function Dashboard() {
//   const [question, setQuestion] = useState("");
//   const [response, setResponse] = useState(emptyResponse);
//   const [schema, setSchema] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [history, setHistory] = useState([]);
//   const [error, setError] = useState("");
//   const [schemaLoading, setSchemaLoading] = useState(false);
//   const [connectionMode, setConnectionMode] = useState("default");
//   const [connectionString, setConnectionString] = useState("");

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
//     e.preventDefault();
//     if (!question.trim()) return;

//     setLoading(true);
//     setError("");
//     setResponse(emptyResponse());

//     try {
//       const connStr = connectionMode === "custom" ? connectionString : null;
//       const res = await queryAPI.askQuestion(question, connStr);
//       setResponse(res.data);
//       if (connectionMode === "custom") {
//         fetchSchema(connStr);
//       }
//       loadHistory();
//     } catch (err) {
//       if (err.response?.status === 401) {
//         setError("Session expired. Please log in again.");
//         localStorage.removeItem("token");
//         toast.error("Session expired. Please login again.");
//         setTimeout(() => {
//           window.location.href = "/login";
//         }, 2000);
//       }
//       setError(err.response?.data?.detail || "Failed to get response");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleConnectionChange = (mode) => {
//     setConnectionMode(mode);
//     const connStr = mode === "custom" ? connectionString : null;
//     fetchSchema(connStr);
//   };

//   const handleConnectionStringChange = (e) => {
//     setConnectionString(e.target.value);
//   };

//   const handleConnectionStringBlur = () => {
//     if (connectionMode === "custom" && connectionString.trim()) {
//       fetchSchema(connectionString);
//     }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     setTimeout(() => {
//       window.location.href = "/login";
//     }, 1000);
//     toast.success("Logged out successfully");
//   };

//   const toggleBookmark = async (id) => {
//     try {
//       await historyAPI.toggleBookmark(id);
//       loadHistory();
//     } catch (err) {
//       console.error("Failed to toggle bookmark", err);
//     }
//   };

//   const hasQueryOutput =
//     response &&
//     (response.sql ||
//       response.explanation ||
//       response.result != null ||
//       (response.error && response.error.trim()));

//   return (
//     <div className="flex h-screen bg-gray-100">
//       {/* Sidebar */}
//       <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
//         <div className="p-4 border-b border-gray-200">
//           <h2 className="text-lg font-semibold text-gray-800">Query History</h2>
//         </div>
//         <div className="flex-1 overflow-y-auto">
//           {history.map((item) => (
//             <div
//               key={item.id}
//               className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
//               onClick={() => {
//                 setQuestion(item.natural_question);
//                 setResponse({
//                   sql: item.generated_sql,
//                   result: item.execution_result
//                     ? JSON.parse(item.execution_result)
//                     : [],
//                   error: item.error_message || "",
//                   explanation: item.explanation || "No explanation available",
//                 });
//               }}
//             >
//               <p className="text-sm text-gray-700 truncate">
//                 {item.natural_question}
//               </p>
//               <div className="flex items-center justify-between mt-2">
//                 <span className="text-xs text-gray-500">
//                   {new Date(item.created_at).toLocaleDateString()}
//                 </span>
//                 <button
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     toggleBookmark(item.id);
//                   }}
//                   className={`text-xs ${item.is_bookmarked ? "text-yellow-500" : "text-gray-400"}`}
//                 >
//                   ★
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//         <div className="p-4 border-t border-gray-200">
//           <button
//             onClick={handleLogout}
//             className="w-full py-2 px-4 bg-red-500 text-white rounded hover:bg-red-600"
//           >
//             Logout
//           </button>
//         </div>
//       </div>

//       {/* Main content */}
//       <div className="flex-1 flex flex-col min-w-0">
//         {/* Header */}
//         <div className="bg-white border-b border-gray-200 p-4">
//           <div className="flex items-center justify-between">
//             <div>
//               <h1 className="text-2xl font-bold text-gray-800">SQL Query Agent</h1>
//               <p className="text-sm text-gray-600">Ask questions in natural language</p>
//             </div>
//             <div className="flex items-center gap-2">
//               <span className="text-xs text-gray-500">LLM Provider:</span>
//               <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded font-medium">
//                 {connectionMode === "custom" ? "Custom DB" : "Demo DB"}
//               </span>
//             </div>
//           </div>
//         </div>

//         {/* Body: query area + schema panel */}
//         <div className="flex-1 flex overflow-hidden">
//           {/* Left: query + results */}
//           <div className="flex-1 p-8 overflow-y-auto">
//             <div className="max-w-4xl mx-auto">
//               {/* Connection settings */}
//               <div className="mb-6 p-4 bg-white rounded-lg shadow border border-gray-200">
//                 <h3 className="text-sm font-semibold text-gray-700 mb-3">
//                   Database Connection
//                 </h3>
//                 <div className="flex gap-4 mb-3">
//                   <label className="flex items-center gap-2">
//                     <input
//                       type="radio"
//                       name="connectionMode"
//                       value="default"
//                       checked={connectionMode === "default"}
//                       onChange={() => handleConnectionChange("default")}
//                       className="text-indigo-600 focus:ring-indigo-500"
//                     />
//                     <span className="text-sm text-gray-700">Default Demo DB</span>
//                   </label>
//                   <label className="flex items-center gap-2">
//                     <input
//                       type="radio"
//                       name="connectionMode"
//                       value="custom"
//                       checked={connectionMode === "custom"}
//                       onChange={() => handleConnectionChange("custom")}
//                       className="text-indigo-600 focus:ring-indigo-500"
//                     />
//                     <span className="text-sm text-gray-700">Custom Connection String</span>
//                   </label>
//                 </div>
//                 {connectionMode === "custom" && (
//                   <input
//                     type="text"
//                     value={connectionString}
//                     onChange={handleConnectionStringChange}
//                     onBlur={handleConnectionStringBlur}
//                     placeholder="e.g. mysql+pymysql://user:pass@localhost:3306/dbname"
//                     className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm"
//                   />
//                 )}
//               </div>

//               {/* Question input */}
//               <form onSubmit={handleSubmit} className="mb-8">
//                 <div className="flex gap-4">
//                   <input
//                     type="text"
//                     value={question}
//                     onChange={(e) => setQuestion(e.target.value)}
//                     placeholder="Ask a question (e.g., 'Show all employees with salary > 50000')"
//                     className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                     disabled={loading}
//                   />
//                   <button
//                     type="submit"
//                     disabled={loading}
//                     className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400"
//                   >
//                     {loading ? "Generating..." : "Ask"}
//                   </button>
//                 </div>
//               </form>

//               {/* No schema warning */}
//               {!schema?.tables?.length && (
//                 <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mb-6">
//                   <p className="text-yellow-800 text-sm">
//                     ⚠️ No schema loaded. The database might be empty or the connection failed. Check the right panel.
//                   </p>
//                 </div>
//               )}

//               {/* Generated SQL */}
//               <div className="mb-6">
//                 <h3 className="text-lg font-semibold mb-4 text-gray-800">Generated SQL:</h3>
//                 <code
//                   className="block bg-gray-100 p-4 rounded mb-2 overflow-x-auto text-sm text-gray-800"
//                   dangerouslySetInnerHTML={{
//                     __html: response?.sql
//                       ? hljs.highlightAuto(response.sql).value
//                       : '<span class="text-gray-500">No SQL generated</span>',
//                   }}
//                 />
//               </div>

//               {/* Query output */}
//               {hasQueryOutput && (
//                 <div className="space-y-6">
//                   {/* Explanation */}
//                   <div className="bg-white p-6 rounded-lg shadow overflow-hidden">
//                     <h3 className="text-lg font-semibold mb-4 text-gray-800">Explanation</h3>
//                     <code
//                       className="block bg-gray-100 p-4 rounded mb-2 overflow-x-auto text-sm text-gray-800"
//                       dangerouslySetInnerHTML={{
//                         __html: response.explanation
//                           ? response.explanation
//                           : '<span class="text-gray-500">No explanation available</span>',
//                       }}
//                     />
//                   </div>

//                   {/* Results table */}
//                   {!response?.error?.trim() && <Table response={response.result} />}

//                   {/* Error */}
//                   {response?.error?.trim() && (
//                     <div className="bg-red-50 p-6 rounded-lg border border-red-200">
//                       <h3 className="text-lg font-semibold mb-2 text-red-800">Error</h3>
//                       <p className="text-red-600">{response.error}</p>
//                     </div>
//                   )}
//                 </div>
//               )}

//               {/* Auth / network error */}
//               {error && (
//                 <div className="bg-red-50 p-4 rounded-lg border border-red-200 mt-4">
//                   <p className="text-red-600 text-sm">{error}</p>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Right: schema panel */}
//           <div className="bg-gray-50 border-l border-gray-200 p-6 overflow-y-auto flex flex-col w-96 shrink-0">
//             <div className="mb-4">
//               <h2 className="text-lg font-semibold text-gray-800">📊 Database Schema</h2>
//               <p className="text-sm text-gray-500">
//                 {schemaLoading
//                   ? "Loading schema..."
//                   : "Visual representation of your database tables and relationships"}
//               </p>
//             </div>
//             <div className="flex-1 overflow-hidden min-h-0">
//               <SchemaVisualization schema={schemaLoading ? null : schema} />
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Dashboard;
import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { queryAPI, historyAPI } from "../services/api";
import hljs from "highlight.js";
import SchemaVisualization from "./SchemaVisualization";
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
    <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
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
};

/* ─── SQL block with copy ────────────────────────────────────────────────── */
function SqlBlock({ sql }) {
  const [copied, setCopied] = useState(false);
  const highlighted = sql
    ? hljs.highlightAuto(sql).value
    : '<span class="text-slate-600 italic">No SQL generated yet</span>';

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

/* ─── Schema tree accordion ──────────────────────────────────────────────── */
function SchemaTree({ schema, loading }) {
  const [openTables, setOpenTables] = useState({});
  const toggle = (name) => setOpenTables((p) => ({ ...p, [name]: !p[name] }));

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-slate-600 text-xs py-4">
        <Icon.Spinner /> Loading schema…
      </div>
    );
  }
  if (!schema?.tables?.length) {
    return <p className="text-slate-700 text-xs py-3">No schema loaded.</p>;
  }

  return (
    <div className="space-y-1.5">
      {schema.tables.map((table) => (
        <div key={table.name} className="rounded-lg border border-slate-800 overflow-hidden bg-[#080d18]">
          <button
            onClick={() => toggle(table.name)}
            className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-slate-800/30 transition-colors"
          >
            <div className="flex items-center gap-2 text-blue-400">
              <Icon.DB />
              <span className="font-mono text-[11.5px] font-semibold">{table.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-600 bg-slate-800/80 px-1.5 py-0.5 rounded-full">
                {table.columns?.length}
              </span>
              <span className="text-slate-600">
                <Icon.ChevronRight open={openTables[table.name]} />
              </span>
            </div>
          </button>
          {openTables[table.name] && (
            <div className="border-t border-slate-800">
              {table.columns?.map((col) => (
                <div
                  key={col.name}
                  className="flex items-center justify-between px-4 py-1.5 hover:bg-slate-800/20 transition-colors"
                >
                  <span className="font-mono text-[11px] text-slate-400">{col.name}</span>
                  <span className="font-mono text-[10px] text-slate-600 bg-slate-900 px-1.5 py-0.5 rounded">
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

/* ─── Loading skeleton ───────────────────────────────────────────────────── */
function Skeleton() {
  return (
    <div className="space-y-3 animate-pulse">
      <p className="text-xs text-slate-600">Generating SQL…</p>
      {[100, 80, 92, 65].map((w, i) => (
        <div
          key={i}
          className="h-3 rounded-full bg-slate-800"
          style={{ width: `${w}%` }}
        />
      ))}
    </div>
  );
}

/* ─── Main Dashboard ─────────────────────────────────────────────────────── */
function Dashboard() {
  const [question, setQuestion] = useState("");
  const emptyResponse = () => ({
    result: [],
    sql: "",
    explanation: "No explanation available",
    error: "",
  });
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
  const [schemaViewMode, setSchemaViewMode] = useState("visual"); // "visual" | "tree"

  const inputRef = useRef(null);

  const hasQueryOutput =
    response &&
    (response.sql ||
      response.explanation ||
      response.result != null ||
      (response.error && response.error.trim()));

  useEffect(() => {
    loadHistory();
    fetchSchema();
  }, []);

  const fetchSchema = async (connstr = null) => {
    setSchemaLoading(true);
    try {
      const schema_response = await queryAPI.getSchema(connstr);
      setSchema(schema_response.data);
    } catch (err) {
      console.error("Failed to fetch schema", err);
    } finally {
      setSchemaLoading(false);
    }
  };

  const loadHistory = async () => {
    try {
      const res = await historyAPI.getHistory({ limit: 50 });
      setHistory(res.data);
    } catch (err) {
      console.error("Failed to load history", err);
    }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!question.trim()) return;
    setLoading(true);
    setError("");
    setResponse(emptyResponse());
    setActiveTab("explanation");
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
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSubmit(); }
  };

  const handleConnectionChange = (mode) => {
    setConnectionMode(mode);
    const connStr = mode === "custom" ? connectionString : null;
    fetchSchema(connStr);
  };

  const handleConnectionStringBlur = () => {
    if (connectionMode === "custom" && connectionString.trim()) fetchSchema(connectionString);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
    setTimeout(() => { window.location.href = "/login"; }, 1000);
  };

  const toggleBookmark = async (id) => {
    try {
      await historyAPI.toggleBookmark(id);
      loadHistory();
    } catch (err) {
      console.error("Failed to toggle bookmark", err);
    }
  };

  const loadFromHistory = (item) => {
    setQuestion(item.natural_question);
    setResponse({
      sql: item.generated_sql,
      result: item.execution_result ? JSON.parse(item.execution_result) : [],
      error: item.error_message || "",
      explanation: item.explanation || "No explanation available",
    });
    setActiveTab("explanation");
    inputRef.current?.focus();
  };

  const suggestions = [
    "Show all employees with salary > 50000",
    "Top 5 products by revenue",
    "Count orders placed last month",
    "Departments with budget over 100k",
  ];

  return (
    <>
      {/* Fonts + hljs token theming + scrollbar + animations */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Figtree:wght@300;400;500;600;700&display=swap');
        body, button, input, * { font-family: 'Figtree', sans-serif; }
        pre, code, .font-mono { font-family: 'JetBrains Mono', monospace !important; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        .fade-up { animation: fadeUp 0.3s ease forwards; }
        /* highlight.js token colours for dark bg */
        .hljs-keyword, .hljs-selector-tag, .hljs-built_in { color: #93c5fd !important; font-weight: 600; }
        .hljs-string, .hljs-attr  { color: #86efac !important; }
        .hljs-number, .hljs-literal { color: #fca5a5 !important; }
        .hljs-comment               { color: #4b5563 !important; font-style: italic; }
        .hljs-function, .hljs-title { color: #c4b5fd !important; }
        /* slim scrollbar */
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 99px; }
      `}</style>

      <div className="flex h-screen bg-[#0a0f1a] text-slate-200 overflow-hidden">

        {/* ── Sidebar ─────────────────────────────────────────────────── */}
        <aside
          className="flex flex-col bg-[#060b14] border-r border-slate-900 flex-shrink-0 overflow-hidden transition-all duration-300"
          style={{ width: sidebarOpen ? "272px" : "0px" }}
        >
          {/* Logo */}
          <div className="flex items-center gap-3 px-4 py-[18px] border-b border-slate-900 flex-shrink-0">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-600 to-violet-700 flex items-center justify-center flex-shrink-0">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <div className="min-w-0">
              <p className="text-[13px] font-bold text-slate-100 tracking-tight whitespace-nowrap">SQL Agent</p>
              <p className="text-[10px] text-slate-600 whitespace-nowrap">Query Interface</p>
            </div>
          </div>

          {/* New query */}
          <div className="p-3 flex-shrink-0">
            <button
              onClick={() => { setQuestion(""); setResponse(emptyResponse()); setError(""); inputRef.current?.focus(); }}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-800 text-slate-500 hover:text-slate-200 hover:border-slate-700 hover:bg-slate-800/30 transition-all text-xs font-medium whitespace-nowrap"
            >
              <Icon.Plus /> New query
            </button>
          </div>

          {/* Recent label */}
          <p className="px-4 pb-1 text-[10px] text-slate-600 font-semibold tracking-widest uppercase flex-shrink-0">
            Recent
          </p>

          {/* History list */}
          <div className="flex-1 overflow-y-auto">
            {history.length === 0 && (
              <p className="text-xs text-slate-700 px-4 py-3">No history yet.</p>
            )}
            {history.map((item) => (
              <div
                key={item.id}
                className="group px-4 py-3 border-b border-slate-900/60 cursor-pointer hover:bg-slate-800/20 transition-colors"
                onClick={() => loadFromHistory(item)}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-[12px] text-slate-400 leading-snug line-clamp-2 flex-1 group-hover:text-slate-200 transition-colors">
                    {item.natural_question}
                  </p>
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleBookmark(item.id); }}
                    className={`flex-shrink-0 mt-0.5 transition-colors ${item.is_bookmarked ? "text-amber-400" : "text-slate-700 hover:text-slate-400"}`}
                  >
                    <Icon.Star filled={item.is_bookmarked} />
                  </button>
                </div>
                <span className="text-[10px] text-slate-700 mt-1 block">
                  {new Date(item.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </span>
              </div>
            ))}
          </div>

          {/* Logout */}
          <div className="p-3 border-t border-slate-900 flex-shrink-0">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-800 text-slate-500 hover:text-red-400 hover:border-red-900/60 hover:bg-red-950/20 transition-all text-xs font-medium whitespace-nowrap"
            >
              <Icon.Logout /> Sign out
            </button>
          </div>
        </aside>

        {/* ── Main column ─────────────────────────────────────────────── */}
        <div className="flex-1 flex flex-col min-w-0">

          {/* Header */}
          <header className="flex items-center gap-3 px-5 py-3 bg-[#060b14] border-b border-slate-900 flex-shrink-0">
            <button
              onClick={() => setSidebarOpen((p) => !p)}
              className="text-slate-600 hover:text-slate-300 transition-colors p-1.5 rounded-md hover:bg-slate-800/40"
            >
              <Icon.Menu />
            </button>

            <span className="text-[15px] font-semibold text-slate-100 tracking-tight">SQL Query Agent</span>

            {/* Connection controls */}
            <div className="ml-auto flex items-center gap-2.5">
              {/* Radio-style toggle */}
              <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-1">
                {[
                  { val: "default", label: "Demo DB" },
                  { val: "custom",  label: "Custom"  },
                ].map(({ val, label }) => (
                  <button
                    key={val}
                    onClick={() => handleConnectionChange(val)}
                    className={`px-3 py-1 rounded-md text-[11px] font-medium transition-all ${
                      connectionMode === val
                        ? "bg-blue-900/60 text-blue-300"
                        : "text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {connectionMode === "custom" && (
                <input
                  type="text"
                  value={connectionString}
                  onChange={(e) => setConnectionString(e.target.value)}
                  onBlur={handleConnectionStringBlur}
                  placeholder="e.g. mysql+pymysql://user:pass@host/db"
                  className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-[11px] font-mono text-slate-300 placeholder-slate-700 outline-none focus:border-blue-700 transition-colors w-72"
                />
              )}
            </div>
          </header>

          {/* Body */}
          <div className="flex-1 flex overflow-hidden">

            {/* ── Query + results ── */}
            <div className="flex-1 overflow-y-auto px-6 py-8 lg:px-10">
              <div className="max-w-3xl mx-auto flex flex-col min-h-full gap-6">

                {/* No-schema warning */}
                {!schema?.tables?.length && !schemaLoading && (
                  <div className="flex items-center gap-2.5 bg-amber-950/30 border border-amber-800/40 rounded-xl px-4 py-3 text-amber-400 text-xs fade-up">
                    <Icon.Warning />
                    No schema loaded. The database might be empty or the connection failed. Check the right panel.
                  </div>
                )}

                {/* Empty / welcome state */}
                {!hasQueryOutput && !loading && !error && (
                  <div className="flex-1 flex flex-col items-center justify-center text-center py-20 fade-up">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-900/70 to-violet-900/50 border border-blue-800/30 flex items-center justify-center mb-5">
                      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#93c5fd" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <ellipse cx="12" cy="5" rx="9" ry="3" />
                        <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
                        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
                      </svg>
                    </div>
                    <h2 className="text-xl font-bold text-slate-100 tracking-tight mb-2">
                      Ask your database anything
                    </h2>
                    <p className="text-slate-500 text-sm mb-8 max-w-xs leading-relaxed">
                      Write in plain English — get SQL, results, and an explanation instantly.
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {suggestions.map((s) => (
                        <button
                          key={s}
                          onClick={() => { setQuestion(s); inputRef.current?.focus(); }}
                          className="px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-lg text-[12px] text-slate-400 hover:text-slate-200 hover:border-slate-700 hover:bg-slate-800/50 transition-all"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Generating skeleton */}
                {loading && (
                  <div className="bg-[#070c18] border border-slate-800 rounded-xl p-5 fade-up">
                    <Skeleton />
                  </div>
                )}

                {/* Response area */}
                {hasQueryOutput && !loading && (
                  <div className="space-y-4 fade-up">
                    {/* Generated SQL — always shown */}
                    <SqlBlock sql={response.sql} />

                    {/* Tabs: Explanation | Results */}
                    <div>
                      <div className="flex gap-1 mb-3 bg-slate-900/70 border border-slate-800 rounded-lg p-1 w-fit">
                        {[
                          { key: "explanation", label: "Explanation" },
                          {
                            key: "results",
                            label: response.result?.length
                              ? `Results (${response.result.length})`
                              : "Results",
                          },
                        ].map((tab) => (
                          <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`px-4 py-1.5 rounded-md text-[12px] font-medium transition-all ${
                              activeTab === tab.key
                                ? "bg-blue-900/70 text-blue-200"
                                : "text-slate-500 hover:text-slate-300"
                            }`}
                          >
                            {tab.label}
                          </button>
                        ))}
                      </div>

                      {/* Explanation panel */}
                      {activeTab === "explanation" && (
                        <div className="bg-[#070c18] border border-slate-800 rounded-xl p-5 text-sm text-slate-300 leading-relaxed fade-up">
                          <div
                            dangerouslySetInnerHTML={{
                              __html: response.explanation || "No explanation available.",
                            }}
                          />
                        </div>
                      )}

                      {/* Results panel */}
                      {activeTab === "results" && (
                        <div className="fade-up">
                          {response.error?.trim() ? (
                            <div className="flex gap-3 items-start bg-red-950/30 border border-red-900/40 rounded-xl p-4">
                              <span className="text-red-400 flex-shrink-0 mt-0.5">
                                <Icon.Error />
                              </span>
                              <div>
                                <p className="text-red-400 text-xs font-semibold mb-1">Query Error</p>
                                <p className="text-red-300 text-xs font-mono leading-relaxed">
                                  {response.error}
                                </p>
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

                {/* Auth / network error */}
                {error && !loading && (
                  <div className="flex items-center gap-2.5 bg-red-950/30 border border-red-900/40 rounded-xl px-4 py-3 text-red-400 text-xs fade-up">
                    <Icon.Error /> {error}
                  </div>
                )}

                {/* Spacer so input doesn't overlap content */}
                <div className="h-4" />
              </div>
            </div>

            {/* ── Schema panel ── */}
            <aside className="w-80 flex-shrink-0 bg-[#060b14] border-l border-slate-900 flex flex-col overflow-hidden">
              <div className="px-5 pt-5 pb-3 border-b border-slate-900 flex-shrink-0">
                <div className="flex items-center justify-between mb-0.5">
                  <h2 className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest">
                    Database Schema
                  </h2>
                  {/* visual / tree toggle */}
                  <div className="flex gap-0.5 bg-slate-900 border border-slate-800 rounded-md p-0.5">
                    {[{ k: "visual", icon: "⬡" }, { k: "tree", icon: "≡" }].map(({ k, icon }) => (
                      <button
                        key={k}
                        onClick={() => setSchemaViewMode(k)}
                        className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
                          schemaViewMode === k
                            ? "bg-slate-700 text-slate-200"
                            : "text-slate-600 hover:text-slate-400"
                        }`}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>
                <p className="text-[11px] text-slate-700">
                  {schemaLoading
                    ? "Loading schema…"
                    : schema?.tables?.length
                    ? `${schema.tables.length} tables`
                    : "No schema loaded"}
                </p>
              </div>

              <div className="flex-1 overflow-y-auto p-4 min-h-0">
                {schemaViewMode === "visual" ? (
                  <SchemaVisualization schema={schemaLoading ? null : schema} />
                ) : (
                  <SchemaTree schema={schemaLoading ? null : schema} loading={schemaLoading} />
                )}
              </div>
            </aside>
          </div>

          {/* ── Input bar — fixed to bottom of main column ── */}
          <div className="flex-shrink-0 px-6 py-4 lg:px-10 bg-gradient-to-t from-[#0a0f1a] via-[#0a0f1a]/95 to-transparent border-t border-slate-900/50">
            <div className="max-w-3xl mx-auto">
              <form onSubmit={handleSubmit}>
                <div
                  className={`flex items-center gap-2 bg-[#0d1525] border rounded-xl px-4 py-2 transition-all duration-200 ${
                    inputFocused
                      ? "border-blue-700 shadow-[0_0_0_3px_rgba(37,99,235,0.12)]"
                      : "border-slate-800"
                  }`}
                >
                  <input
                    ref={inputRef}
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setInputFocused(true)}
                    onBlur={() => setInputFocused(false)}
                    placeholder="Ask a question about your data…"
                    disabled={loading}
                    className="flex-1 bg-transparent text-slate-200 text-sm placeholder-slate-600 outline-none py-2 disabled:opacity-40"
                  />
                  <button
                    type="submit"
                    disabled={loading || !question.trim()}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 text-white text-[13px] font-semibold rounded-lg transition-all flex-shrink-0"
                  >
                    {loading ? (
                      <><Icon.Spinner /> Generating</>
                    ) : (
                      <><Icon.Send /> Ask</>
                    )}
                  </button>
                </div>
              </form>
              <p className="text-center text-[10px] text-slate-700 mt-2">
                Results are AI-generated — always verify before acting on them.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;