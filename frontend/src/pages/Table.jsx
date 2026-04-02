export default function Table({ response }) {
  console.log("Table component received response:", response);

  const rows = response?.result || [];
  const columns = response?.columns || [];

  // Fix duplicate column names by auto-renaming
  const fixedColumns = columns.map((col, idx) => {
    const duplicateCount = columns.filter(c => c === col).length;
    return duplicateCount > 1 ? `${col}_${idx + 1}` : col;
  });

  return (
    <>
      {rows.length > 0 ? (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            Results ({rows.length} rows)
          </h3>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">

              {/* Header */}
              <thead className="bg-gray-50">
                <tr>
                  {fixedColumns.map((col) => (
                    <th
                      key={col}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
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
                      // Extract original column name without index
                      const rawCol = columns[colIdx];
                      return (
                        <td
                          key={colIdx}
                          className="px-6 py-4 whitespace-nowrap text-sm text-gray-700"
                        >
                          {String(row[rawCol] ?? "")}
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