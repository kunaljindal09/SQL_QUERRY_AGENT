export default function Table({ response }) {


  const rows = response?.result || [];
  const columns = response?.columns || [];

  // Fix duplicate column names by adding numbered suffixes
  const fixedColumns = (() => {
    const colCount = {};
    return columns.map((col) => {
      if (!colCount[col]) colCount[col] = 1;
      else colCount[col]++;

      return colCount[col] === 1 ? col : `${col}_${colCount[col]}`;
    });
  })();

  // Format cell values (null, boolean, objects, arrays)
  const formatValue = (value) => {
    if (value === null || value === undefined) return "—";
    if (typeof value === "boolean") return value ? "True" : "False";
    if (typeof value === "object") return JSON.stringify(value, null, 2);
    return String(value);
  };

  return (
    <>
      {rows.length > 0 ? (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            Results ({rows.length} rows)
          </h3>

          <div className="overflow-x-auto rounded-md border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">

              {/* Header */}
              <thead className="bg-gray-100">
                <tr>
                  {fixedColumns.map((col) => (
                    <th
                      key={col}
                      className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>

              {/* Body */}
              <tbody className="bg-white divide-y divide-gray-200">
                {rows.map((row, idx) => (
                  <tr
                    key={idx}
                    className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    {fixedColumns.map((col, colIdx) => {
                      const originalCol = columns[colIdx]; // actual DB column name
                      return (
                        <td
                          key={colIdx}
                          className="px-6 py-3 whitespace-nowrap text-sm text-gray-800"
                        >
                          {formatValue(row[originalCol])}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        </div>
      ) : (
        response && (
          <p className="text-gray-500 text-sm mt-4">No results found.</p>
        )
      )}
    </>
  );
}