import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
} from 'recharts';
import { queryAPI } from '../services/api';
import { useSchema } from '../context/SchemaContext';
import { toast } from 'react-toastify';

const COLORS = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ef4444', '#06b6d4'];

export default function SchemaStatisticsCharts({ connectionString = null, forceRefresh = false }) {
  const { schema, setSchema, isDark } = useSchema();
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(!schema?.tables);
  const location = useLocation();
  const fullPage = location.pathname === "/schema-statistics";

  useEffect(() => {
    if (fullPage && !schema?.tables) {
      setLoading(true);
      queryAPI.getSchema()
        .then(res => setSchema(res.data))
        .catch(err => console.error("Failed to load schema", err))
        .finally(() => setLoading(false));
    }
  }, [fullPage, schema, setSchema]);
  const [cacheInfo, setCacheInfo] = useState(null);
  const [selectedView, setSelectedView] = useState('overview');

  useEffect(() => {
    // Only fetch if we have a connection string (for custom DB)
    // Otherwise we can compute from schema
    if (!connectionString && !schema?.tables?.length) {
      return;
    }

    const fetchStatistics = async () => {
      setLoading(true);
      try {
        const response = await queryAPI.getStatistics(connectionString, forceRefresh);
        
        setStatistics(response.data);
        setCacheInfo({
          cached_at: response.data.cached_at,
          expires_at: response.data.expires_at,
        });
      } catch (error) {
        toast.error('Failed to fetch schema statistics');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, [connectionString, forceRefresh, schema]);

  const renderState = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center p-8 bg-gray-50 rounded-lg">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <p className="mt-2 text-gray-600">Loading statistics...</p>
          </div>
        </div>
      );
    }

    if (!statistics) {
      if (!schema?.tables?.length && !connectionString) {
        return (
          <div className="p-8 bg-yellow-50 rounded-lg text-center text-yellow-800 border border-yellow-200">
            <p className="font-semibold mb-2"> No Schema Loaded</p>
            <p className="text-sm">Load a database schema first to view statistics. Click "Database Schema" in the sidebar.</p>
          </div>
        );
      }
      
      return (
        <div className="p-8 bg-gray-50 rounded-lg text-center text-gray-600">
          No statistics available
        </div>
      );
    }

  const tableSizeData = (statistics.table_sizes || []).sort((a, b) => b.row_count - a.row_count);
  const columnTypeData = Object.entries(statistics.column_types || {}).map(([type, count]) => ({
    name: type,
    value: count,
  }));
  const nullableData = statistics.nullable_stats || [];
  const relationshipData = statistics.relationship_stats || [];

  const renderCacheInfo = () => (
    <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
      <div className="font-semibold mb-1"> Cache Information</div>
      <div>Cached at: {new Date(cacheInfo.cached_at).toLocaleString()}</div>
      <div>Expires at: {new Date(cacheInfo.expires_at).toLocaleString()}</div>
      <button
        onClick={() => {
          // Force refresh by parent component
          window.location.reload();
        }}
        className="mt-2 inline-block px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs"
      >
        Refresh Now
      </button>
    </div>
  );

  const ViewContainer = ({ children, title }) => (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      {children}
    </div>
  );

  const content = (
    <div className="space-y-6">
      {renderCacheInfo()}

      {/* View Selector */}
      <div className="flex gap-2 flex-wrap">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'tables', label: ' Table Sizes' },
          { id: 'columns', label: ' Column Types' },
          { id: 'nullable', label: 'Nullable Analysis' },
          { id: 'relationships', label: ' Relationships' },
        ].map((view) => (
          <button
            key={view.id}
            onClick={() => setSelectedView(view.id)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedView === view.id
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            {view.label}
          </button>
        ))}
      </div>

      {/* Overview */}
      {selectedView === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ViewContainer title="Total Tables">
            <div className="text-4xl font-bold text-indigo-600">
              {statistics.table_sizes?.length || 0}
            </div>
            <p className="text-gray-600 text-sm mt-2">
              {statistics.table_sizes?.reduce((sum, t) => sum + t.row_count, 0) || 0} total rows
            </p>
          </ViewContainer>

          <ViewContainer title="Column Types">
            <div className="text-4xl font-bold text-purple-600">
              {columnTypeData.length}
            </div>
            <p className="text-gray-600 text-sm mt-2">
              {columnTypeData.map(ct => ct.name).join(', ')}
            </p>
          </ViewContainer>

          <ViewContainer title="Relationships">
            <div className="text-4xl font-bold text-pink-600">
              {relationshipData.length}
            </div>
            <p className="text-gray-600 text-sm mt-2">Foreign key relationships</p>
          </ViewContainer>
        </div>
      )}

      {/* Table Sizes */}
      {selectedView === 'tables' && (
        <ViewContainer title="Table Row Counts">
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={tableSizeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="table_name" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip formatter={(value) => value.toLocaleString()} />
              <Legend />
              <Bar dataKey="row_count" fill="#6366f1" name="Row Count" />
            </BarChart>
          </ResponsiveContainer>
        </ViewContainer>
      )}

      {/* Column Types Distribution */}
      {selectedView === 'columns' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ViewContainer title="Column Type Distribution (Pie)">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={columnTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name} (${value})`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {columnTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </ViewContainer>

          <ViewContainer title="Column Type Distribution (Table)">
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {columnTypeData.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 hover:bg-gray-100 rounded">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded"
                      style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                    />
                    <span className="font-medium">{item.name}</span>
                  </div>
                  <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-semibold">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </ViewContainer>
        </div>
      )}

      {/* Nullable Analysis */}
      {selectedView === 'nullable' && (
        <ViewContainer title="NULL vs NOT NULL Columns by Table">
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={nullableData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="table_name" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="nullable_count" stackId="a" fill="#f59e0b" name="Nullable" />
              <Bar dataKey="not_null_count" stackId="a" fill="#10b981" name="Not Null" />
            </BarChart>
          </ResponsiveContainer>
        </ViewContainer>
      )}

      {/* Relationships */}
      {selectedView === 'relationships' && (
        <ViewContainer title="Foreign Key Relationships">
          {relationshipData.length > 0 ? (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {relationshipData.map((rel, idx) => (
                <div key={idx} className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-indigo-200 flex items-center justify-between">
                  <div className="flex-1">
                    <div className="font-semibold text-gray-800">
                      {rel.from_table}
                      <span className="mx-2 text-indigo-600">→</span>
                      {rel.to_table}
                    </div>
                    <div className="text-sm text-gray-600">
                      {rel.from_column} → {rel.to_column}
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-indigo-600 text-white rounded text-xs font-semibold">
                    {rel.type}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center py-8">No foreign key relationships found</p>
          )}
        </ViewContainer>
      )}
    </div>
  );
  
  return content;
  };

  if (fullPage) {
    const txt = {
      primary: isDark ? "#fcfcfc" : "#1e293b",
      muted: isDark ? "#64748b" : "#64748b",
    };

    return (
      <div
        style={{
          minHeight: "100vh",
          background: isDark ? "#081115" : "#f0f4ff",
          padding: "20px",
        }}
      >
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
            ← Back to Dashboard
          </Link>
          <h1 style={{ margin: 0, color: txt.primary, fontSize: 24 }}>
            Schema Statistics
          </h1>
        </div>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          {renderState()}
        </div>
      </div>
    );
  }

  return renderState();
}
