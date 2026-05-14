import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutGrid, List, Zap, ChevronLeft, ChevronRight } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isMinimized, setIsMinimized] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.startsWith('/board')) {
      setIsMinimized(true);
    } else if (location.pathname.startsWith('/leads')) {
      setIsMinimized(false);
    }
  }, [location.pathname]);

  return (
    <aside className={`sidebar ${isMinimized ? 'minimized' : ''}`}>
      <div className="sidebar-section-title" style={{ marginTop: 0 }}>Leads Management</div>
      <nav className="sidebar-nav">
        <NavLink to="/leads" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} title="Leads List">
          <List size={20} />
          <span className="sidebar-text">Leads List</span>
        </NavLink>
        <NavLink to="/board" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} title="Pipeline Board">
          <LayoutGrid size={20} />
          <span className="sidebar-text">Pipeline Board</span>
        </NavLink>
      </nav>

      <div className="sidebar-section-title">Automation</div>
      <div className="sidebar-nav">
        <button className="sidebar-link btn-ghost" style={{ width: '100%', border: 'none', background: 'transparent', textAlign: 'left', cursor: 'pointer' }} title="Workflows">
          <Zap size={20} />
          <span className="sidebar-text">Workflows</span>
        </button>
      </div>

      <div className="sidebar-footer">
        <div className="sidebar-text" style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.4)', marginBottom: 8, fontWeight: 700 }}>Powered By</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, color: 'white', fontWeight: 700, fontSize: '0.875rem' }}>
          <Zap size={16} fill="white" />
          <span className="sidebar-text">SUPERLEAP AI</span>
        </div>
      </div>

      <button 
        className="sidebar-collapse-btn"
        onClick={() => setIsMinimized(!isMinimized)}
        title={isMinimized ? 'Expand Sidebar' : 'Collapse Sidebar'}
      >
        {isMinimized ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>
    </aside>
  );
};

export default Navbar;
