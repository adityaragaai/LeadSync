import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import LeadsPage from './pages/LeadsPage';
import BoardPage from './pages/BoardPage.tsx';
import { Zap } from 'lucide-react';
import Navbar from './components/Navbar';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
          <header className="top-bar">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginRight: 32 }}>
              <Zap size={24} className="text-primary" fill="var(--primary)" />
              <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-main)' }}>Superleap</span>
            </div>
            <div className="search-input-wrapper" style={{ maxWidth: 400 }}>
              <input type="text" className="input" placeholder="Search leads, tasks, or members..." style={{ width: '100%' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <button className="btn btn-ghost" style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', top: 4, right: 4, width: 8, height: 8, background: '#ef4444', borderRadius: '50%', border: '2px solid white' }}></div>
                <Zap size={20} />
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '4px 12px', background: '#f8fafc', borderRadius: 40, border: '1px solid #e2e8f0' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#1e293b' }}>Aditya Gupta</div>
                  <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Admin</div>
                </div>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700 }}>AG</div>
              </div>
            </div>
          </header>
          
          <div className="app-container">
            <Navbar />
            <div className="main-content">
              <main className="content-area">
                <Routes>
                  <Route path="/leads" element={<LeadsPage />} />
                  <Route path="/board" element={<BoardPage />} />
                  <Route path="/" element={<Navigate to="/leads" replace />} />
                </Routes>
              </main>
            </div>
          </div>
        </div>
        <Toaster position="top-right" />
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
