import React, { useEffect, useState, useMemo, useCallback } from 'react';
import ReactFlow, {
  Controls,
  Background,
  MiniMap,
  useNodesState,
  useEdgesState,
} from 'reactflow';
import 'reactflow/dist/style.css';

const TableNode = ({ data }) => {
  return (
    <div className="bg-white border-2 border-indigo-500 rounded-lg shadow-lg p-4 min-w-max">
      <div className="font-bold text-indigo-700 text-sm border-b border-indigo-300 pb-2 mb-2">
        {data.label}
      </div>
      <div className="space-y-1">
        {data.columns.map((column, idx) => (
          <div
            key={idx}
            className={`text-xs px-2 py-1 rounded ${
              column.is_primary_key
                ? 'bg-yellow-100 text-yellow-800 font-semibold'
                : 'bg-gray-50 text-gray-700'
            }`}
          >
            <span>{column.is_primary_key ? '🔑 ' : ''}</span>
            {column.column_name}
            <span className="text-gray-500 ml-1">({column.data_type})</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function SchemaVisualization({ schema }) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Memoize nodeTypes to prevent recreation on each render
  const nodeTypes = useMemo(() => ({ table: TableNode }), []);

  useEffect(() => {
    if (!schema || !schema.tables) {
      setNodes([]);
      setEdges([]);
      return;
    }

    setIsLoading(true);

    // Create nodes for each table
    const newNodes = schema.tables.map((table, idx) => {
      const itemsPerRow = Math.ceil(Math.sqrt(schema.tables.length));
      const x = (idx % itemsPerRow) * 350;
      const y = Math.floor(idx / itemsPerRow) * 400;

      return {
        id: table.table_name,
        data: {
          label: table.table_name,
          columns: table.columns,
        },
        position: { x, y },
        type: 'table',
      };
    });

    // Create edges for foreign keys
    const newEdges = [];
    const edgeMap = new Map(); // To avoid duplicate edges

    schema.tables.forEach((table) => {
      table.foreign_keys.forEach((fk) => {
        const edgeId = `${table.table_name}-${fk.references_table}`;
        
        // Only add if not already added
        if (!edgeMap.has(edgeId)) {
          newEdges.push({
            id: edgeId,
            source: table.table_name,
            target: fk.references_table,
            sourceHandle: null,
            targetHandle: null,
            animated: true,
            label: `${fk.column} → ${fk.references_column}`,
            labelStyle: { fontSize: '11px', fill: '#666' },
            markerEnd: { type: 'arrowclosed', color: '#6366f1' },
            style: {
              stroke: '#6366f1',
              strokeWidth: 2,
            },
          });
          edgeMap.set(edgeId, true);
        }
      });
    });

    setNodes(newNodes);
    setEdges(newEdges);
    setIsLoading(false);
  }, [schema, setNodes, setEdges]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50">
        <p className="text-gray-500 text-lg">Loading schema...</p>
      </div>
    );
  }

  if (!schema || !schema.tables || schema.tables.length === 0) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50">
        <p className="text-gray-500 text-lg">No schema available. Connect to a database to view the schema.</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-gray-50">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        defaultEdgeOptions={{
          type: 'default',
          style: { stroke: '#6366f1', strokeWidth: 2 },
        }}
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
}
