import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Branches from './pages/Branches';
import Feedback from './pages/Feedback';
import Analytics from './pages/Analytics';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/branches/:businessId" element={<Branches />} />
        <Route path="/feedback/:businessId/:branchId" element={<Feedback />} />
        <Route path="/analytics/:businessId" element={<Analytics />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;