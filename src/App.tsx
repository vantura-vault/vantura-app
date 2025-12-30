import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminRoute } from './components/AdminRoute';
import { AccessGateWrapper } from './components/AccessGateWrapper';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Dashboard } from './pages/Dashboard';
import { DataChamber } from './pages/DataChamber';
import { CompetitorVault } from './pages/CompetitorVault';
import { CompetitorDetail } from './pages/CompetitorDetail';
import { Signals } from './pages/Signals';
import { Blueprint } from './pages/Blueprint';
import { Studio } from './pages/Studio';
import { Scheduler } from './pages/Scheduler';
import { PostCreationWizard } from './pages/PostCreationWizard';
import { Settings } from './pages/Settings';
import { ApiTest } from './pages/ApiTest';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminOverview } from './pages/admin/AdminOverview';
import { AdminUsers } from './pages/admin/AdminUsers';
import { AdminCompanies } from './pages/admin/AdminCompanies';
import { AdminBilling } from './pages/admin/AdminBilling';
import { AdminApiUsage } from './pages/admin/AdminApiUsage';

function App() {
  return (
    <AccessGateWrapper>
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
          path="/signals"
          element={
            <ProtectedRoute>
              <MainLayout pageTitle="Signals">
                <Signals />
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
          path="/studio"
          element={
            <ProtectedRoute>
              <MainLayout pageTitle="Studio">
                <Studio />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/studio/create/:blueprintId"
          element={
            <ProtectedRoute>
              <MainLayout pageTitle="Create Post">
                <PostCreationWizard />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/scheduler"
          element={
            <ProtectedRoute>
              <MainLayout pageTitle="Scheduler">
                <Scheduler />
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

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout>
                <AdminOverview />
              </AdminLayout>
            </AdminRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <AdminLayout>
                <AdminUsers />
              </AdminLayout>
            </AdminRoute>
          }
        />

        <Route
          path="/admin/companies"
          element={
            <AdminRoute>
              <AdminLayout>
                <AdminCompanies />
              </AdminLayout>
            </AdminRoute>
          }
        />

        <Route
          path="/admin/billing"
          element={
            <AdminRoute>
              <AdminLayout>
                <AdminBilling />
              </AdminLayout>
            </AdminRoute>
          }
        />

        <Route
          path="/admin/api-usage"
          element={
            <AdminRoute>
              <AdminLayout>
                <AdminApiUsage />
              </AdminLayout>
            </AdminRoute>
          }
        />

        <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AccessGateWrapper>
  );
}

export default App;
