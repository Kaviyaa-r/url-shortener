import React from 'react';
import { Link } from 'react-router-dom';
import { Link2, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const gradientText = {
  background: 'linear-gradient(90deg, #818cf8, #c084fc, #f472b6)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
};

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <header style={{
      background: 'rgba(6,8,24,0.8)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      padding: '16px 48px',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}>
      {/* Logo */}
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
        <div style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', padding: '8px', borderRadius: '10px', display: 'flex' }}>
          <Link2 size={18} color="white" />
        </div>
        <span style={{ ...gradientText, fontSize: '20px', fontWeight: 900 }}>SnapLink</span>
      </Link>

      {/* Right side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {user && (
          <span style={{ color: '#94a3b8', fontSize: '14px', fontWeight: 500 }}>
            {user.name}
          </span>
        )}
        <button
          onClick={logout}
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '10px',
            color: '#94a3b8',
            fontWeight: 600,
            padding: '8px 16px',
            cursor: 'pointer',
            fontSize: '13px',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = 'rgba(239,68,68,0.4)';
            e.currentTarget.style.color = '#ef4444';
            e.currentTarget.style.background = 'rgba(239,68,68,0.08)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
            e.currentTarget.style.color = '#94a3b8';
            e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
          }}
        >
          <LogOut size={14} />
          Sign Out
        </button>
      </div>
    </header>
  );
};

export default Navbar;
