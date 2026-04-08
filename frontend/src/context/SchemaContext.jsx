import { createContext, useContext, useState } from "react";

const SchemaContext = createContext();

export function SchemaProvider({ children }) {
  const [schema, setSchema] = useState(null);
  const [isDark, setIsDark] = useState(true);

  return (
    <SchemaContext.Provider value={{ schema, setSchema, isDark, setIsDark }}>
      {children}
    </SchemaContext.Provider>
  );
}

export function useSchema() {
  return useContext(SchemaContext);
}