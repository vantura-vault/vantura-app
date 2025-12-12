import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Dashboard } from './pages/Dashboard';
import { DataChamber } from './pages/DataChamber';
import { CompetitorVault } from './pages/CompetitorVault';
import { CompetitorDetail } from './pages/CompetitorDetail';
import { Blueprint } from './pages/Blueprint';
import { Settings } from './pages/Settings';
import { ApiTest } from './pages/ApiTest';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout pageTitle="Home">
                <Dashboard />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/data-chamber"
          element={
            <ProtectedRoute>
              <MainLayout pageTitle="Data Chamber">
                <DataChamber />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/competitor-vault"
          element={
            <ProtectedRoute>
              <MainLayout pageTitle="Competitor Vault">
                <CompetitorVault />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/competitor-vault/:id"
          element={
            <ProtectedRoute>
              <MainLayout pageTitle="Competitor Details">
                <CompetitorDetail />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/blueprint"
          element={
            <ProtectedRoute>
              <MainLayout pageTitle="Blueprints">
                <Blueprint />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <MainLayout pageTitle="Settings">
                <Settings />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/api-test"
          element={
            <ProtectedRoute>
              <MainLayout pageTitle="API Test">
                <ApiTest />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
