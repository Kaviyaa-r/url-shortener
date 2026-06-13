import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import Navbar from '../components/Navbar';
import UrlCard from '../components/UrlCard';
import CreateUrlModal from '../components/CreateUrlModal';
import QRModal from '../components/QRModal';
import { Link2, BarChart3, CheckCircle, Search, Plus } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const bg = {
  background: 'linear-gradient(135deg, #060818 0%, #0d0b2e 50%, #060818 100%)',
  minHeight: '100vh',
  position: 'relative',
  overflow: 'hidden',
};

const orb = { position: 'absolute', pointerEvents: 'none', borderRadius: '50%', zIndex: 0 };

const glassCard = {
  background: 'rgba(255,255,255,0.03)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderTop: '1px solid rgba(255,255,255,0.15)',
  borderRadius: '16px',
  boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
};

const gradientText = {
  background: 'linear-gradient(90deg, #818cf8, #c084fc, #f472b6)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
};

const primaryBtn = {
  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
  border: 'none',
  borderRadius: '10px',
  color: 'white',
  fontWeight: 700,
  padding: '12px 24px',
  cursor: 'pointer',
  fontSize: '14px',
  transition: 'all 0.3s ease',
  boxShadow: '0 4px 20px rgba(99,102,241,0.4)',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  whiteSpace: 'nowrap',
};

const SkeletonCard = () => (
  <div style={{ ...glassCard, padding: '20px' }}>
    <div style={{ height: '12px', background: 'rgba(255,255,255,0.06)', borderRadius: '6px', width: '75%', marginBottom: '12px', animation: 'shimmer 1.5s infinite' }} />
    <div style={{ height: '18px', background: 'rgba(255,255,255,0.06)', borderRadius: '6px', width: '50%', marginBottom: '12px' }} />
    <div style={{ height: '12px', background: 'rgba(255,255,255,0.06)', borderRadius: '6px', width: '33%', marginBottom: '16px' }} />
    <div style={{ display: 'flex', gap: '8px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
      {[60, 40, 50].map((w, i) => (
        <div key={i} style={{ height: '28px', background: 'rgba(255,255,255,0.06)', borderRadius: '8px', width: `${w}px` }} />
      ))}
    </div>
  </div>
);

const Dashboard = () => {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isQROpen, setIsQROpen] = useState(false);
  const [selectedQRUrl, setSelectedQRUrl] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const { user } = useAuth();

  const fetchUrls = async () => {
    try {
      const response = await axios.get('/urls');
      if (response.data.success) setUrls(response.data.data);
    } catch (err) {
      toast.error('Failed to load short URLs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUrls(); }, []);

  const handleDelete = async (urlId) => {
    try {
      const response = await axios.delete(`/urls/${urlId}`);
      if (response.data.success) {
        toast.success(response.data.message || 'URL deleted successfully.');
        fetchUrls();
      } else {
        toast.error(response.data.error || 'Failed to delete short URL.');
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to delete short link.');
    }
  };

  const handleShowQR = (shortUrl) => { setSelectedQRUrl(shortUrl); setIsQROpen(true); };

  const totalUrls = urls.length;
  const totalClicks = urls.reduce((sum, item) => sum + (item.clickCount || 0), 0);
  const activeLinks = urls.filter(item => item.isActive && (!item.expiresAt || new Date(item.expiresAt) > new Date())).length;

  const filteredUrls = urls.filter(url =>
    url.originalUrl.toLowerCase().includes(searchQuery.toLowerCase()) ||
    url.shortCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const statCards = [
    { icon: Link2, label: 'Total Links', value: totalUrls, iconColor: '#6366f1', iconBg: 'rgba(99,102,241,0.12)' },
    { icon: BarChart3, label: 'Total Clicks', value: totalClicks, iconColor: '#8b5cf6', iconBg: 'rgba(139,92,246,0.12)' },
    { icon: CheckCircle, label: 'Active Links', value: activeLinks, iconColor: '#10b981', iconBg: 'rgba(16,185,129,0.12)' },
  ];

  return (
    <div style={bg}>
      {/* Orbs */}
      <div className="orb-1" style={{ ...orb, top: '-100px', left: '-100px', width: '500px', height: '500px', background: 'radial-gradient(ellipse, rgba(99,102,241,0.15), transparent 70%)' }} />
      <div className="orb-2" style={{ ...orb, top: '50%', right: '-150px', width: '400px', height: '400px', background: 'radial-gradient(ellipse, rgba(139,92,246,0.1), transparent 70%)' }} />
      <div className="orb-3" style={{ ...orb, bottom: '-100px', left: '30%', width: '350px', height: '350px', background: 'radial-gradient(ellipse, rgba(236,72,153,0.08), transparent 70%)' }} />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <Navbar />

        <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px 60px' }}>

          {/* Welcome Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '32px' }}>
            <div>
              <h1 style={{ color: '#f1f5f9', fontSize: '28px', fontWeight: 800, marginBottom: '4px' }}>
                Welcome back, <span style={gradientText}>{user?.name?.split(' ')[0] || 'there'}</span> 👋
              </h1>
              <p style={{ color: '#475569', fontSize: '14px' }}>Manage your links and track your performance.</p>
            </div>
            <button onClick={() => setIsCreateOpen(true)} className="btn-interactive" style={primaryBtn}>
              <Plus size={16} /> Shorten URL
            </button>
          </div>

          {/* Stats Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '28px' }}>
            {statCards.map((stat, i) => (
              <div key={i} style={{ ...glassCard, padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ background: stat.iconBg, borderRadius: '12px', padding: '12px', display: 'flex' }}>
                  <stat.icon size={22} color={stat.iconColor} />
                </div>
                <div>
                  <p style={{ color: '#64748b', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>{stat.label}</p>
                  <p style={{ color: '#f1f5f9', fontSize: '28px', fontWeight: 800, lineHeight: 1 }}>{stat.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Search + Action Bar */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, position: 'relative', minWidth: '200px' }}>
              <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                placeholder="Search URLs..."
                style={{
                  width: '100%',
                  paddingLeft: '40px',
                  paddingRight: '16px',
                  paddingTop: '12px',
                  paddingBottom: '12px',
                  background: 'rgba(255,255,255,0.05)',
                  border: searchFocused ? '1px solid #6366f1' : '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '10px',
                  color: '#f1f5f9',
                  fontSize: '14px',
                  outline: 'none',
                  boxShadow: searchFocused ? '0 0 0 3px rgba(99,102,241,0.2)' : 'none',
                  transition: 'all 0.3s ease',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          {/* URL Grid */}
          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
              {[1,2,3,4].map(i => <SkeletonCard key={i} />)}
            </div>
          ) : filteredUrls.length === 0 ? (
            <div style={{ ...glassCard, padding: '60px 20px', textAlign: 'center', marginTop: '20px' }}>
              <div style={{ background: 'rgba(99,102,241,0.1)', borderRadius: '50%', padding: '20px', display: 'inline-flex', marginBottom: '20px', border: '1px solid rgba(99,102,241,0.2)' }}>
                <Link2 size={36} color="#6366f1" />
              </div>
              <h3 style={{ color: '#f1f5f9', fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>
                {searchQuery ? 'No results found' : 'No links yet'}
              </h3>
              <p style={{ color: '#475569', fontSize: '14px', marginBottom: '28px' }}>
                {searchQuery ? 'Try a different search term.' : 'Create your first short URL to get started.'}
              </p>
              {!searchQuery && (
                <button onClick={() => setIsCreateOpen(true)} style={{ ...primaryBtn, margin: '0 auto' }}>
                  <Plus size={16} /> Create your first link
                </button>
              )}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
              {filteredUrls.map(item => (
                <UrlCard key={item._id} url={item} onDelete={handleDelete} onShowQR={handleShowQR} />
              ))}
            </div>
          )}
        </main>
      </div>

      <CreateUrlModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} onSuccess={fetchUrls} />
      <QRModal isOpen={isQROpen} onClose={() => setIsQROpen(false)} shortUrl={selectedQRUrl} />

      <style>{`@keyframes shimmer { 0%,100%{opacity:0.4} 50%{opacity:0.8} }`}</style>
    </div>
  );
};

export default Dashboard;
