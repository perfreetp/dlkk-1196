import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '@/components/Layout/MainLayout';
import Dashboard from '@/pages/Dashboard';
import Environments from '@/pages/Environments';
import Canary from '@/pages/Canary';
import Notices from '@/pages/Notices';
import Rollback from '@/pages/Rollback';
import Audit from '@/pages/Audit';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="environments" element={<Environments />} />
          <Route path="canary" element={<Canary />} />
          <Route path="notices" element={<Notices />} />
          <Route path="rollback" element={<Rollback />} />
          <Route path="audit" element={<Audit />} />
        </Route>
      </Routes>
    </Router>
  );
}
