import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { Dashboard } from './pages/Dashboard';
import { DataChamber } from './pages/DataChamber';
import { CompetitorVault } from './pages/CompetitorVault';
import { Blueprint } from './pages/Blueprint';
import { Analytics } from './pages/Analytics';
import { Settings } from './pages/Settings';
import { ApiTest } from './pages/ApiTest';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout pageTitle="Home"><Dashboard /></MainLayout>} />
        <Route path="/data-chamber" element={<MainLayout pageTitle="Data Chamber"><DataChamber /></MainLayout>} />
        <Route path="/competitor-vault" element={<MainLayout pageTitle="Competitor Vault"><CompetitorVault /></MainLayout>} />
        <Route path="/blueprint" element={<MainLayout pageTitle="Blueprints"><Blueprint /></MainLayout>} />
        <Route path="/analytics" element={<MainLayout pageTitle="Analytics"><Analytics /></MainLayout>} />
        <Route path="/settings" element={<MainLayout pageTitle="Settings"><Settings /></MainLayout>} />
        <Route path="/api-test" element={<MainLayout pageTitle="API Test"><ApiTest /></MainLayout>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
