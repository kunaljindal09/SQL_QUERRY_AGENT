import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useContext } from 'react'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import { ToastContainer } from "react-toastify";
import ERDiagram from './pages/ERDiagram'
import AnalysisStats from './pages/AnalysisStats'
import SchemaStatisticsCharts from './pages/SchemaStatisticsCharts'
import { AuthProvider, AuthContext } from './context/AuthContext'
import { SchemaProvider } from './context/SchemaContext'

function AppRoutes() {
  const { isAuthenticated, loading } = useContext(AuthContext)

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route 
            path="/er-diagram" 
            element={
              isAuthenticated ? <ERDiagram /> : <Navigate to="/login" />
            } 
          />
          <Route 
            path="/analysis-stats" 
            element={
              isAuthenticated ? <AnalysisStats /> : <Navigate to="/login" />
            } 
          />
          <Route 
            path="/schema-statistics" 
            element={
              isAuthenticated ? <SchemaStatisticsCharts /> : <Navigate to="/login" />
            } 
          />
          <Route 
            path="/login" 
            element={
              isAuthenticated ? <Navigate to="/dashboard" /> : <Login />
            } 
          />
          <Route 
            path="/register" 
            element={
              isAuthenticated ? <Navigate to="/dashboard" /> : <Register />
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              isAuthenticated ? <Dashboard /> : <Navigate to="/login" />
            } 
          />
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      </div>
    </Router>
  )
}

function App() {
  return (
    <SchemaProvider>
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
    </SchemaProvider>
  )
}

export default App
