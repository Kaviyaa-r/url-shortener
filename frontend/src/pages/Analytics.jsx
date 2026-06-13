import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import Navbar from '../components/Navbar';
import ClickChart from '../components/ClickChart';
import { ArrowLeft, AlertCircle, Globe, Laptop, BarChart } from 'lucide-react';
import { toast } from 'react-hot-toast';

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

const glassBtn = {
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '10px',
  color: '#94a3b8',
  fontWeight: 600,
  padding: '8px 16px',
  cursor: 'pointer',
  fontSize: '14px',
  transition: 'all 0.3s ease',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  textDecoration: 'none',
};

const Analytics = () => {
  const { shortCode } = useParams();
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`/analytics/${shortCode}`);
        if (response.data.success) {
          setAnalytics(response.data.data);
        } else {
          setError(response.data.error || 'Failed to fetch analytics');
        }
      } catch (err) {
        const errMsg = err.response?.data?.error || 'Short URL analytics not found.';
        setError(errMsg);
        toast.error(errMsg);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [shortCode]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div style={bg}>
        <Navbar />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '1200px', margin: '0 auto', padding: '32px 24px 60px' }}>
          <div style={{ animation: 'pulse 2s infinite' }}>
            <div style={{ height: '32px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', width: '25%', marginBottom: '24px' }} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
              {[1,2,3,4].map(i => <div key={i} style={{ height: '100px', background: 'rgba(255,255,255,0.05)', borderRadius: '16px' }} />)}
            </div>
            <div style={{ height: '320px', background: 'rgba(255,255,255,0.05)', borderRadius: '16px', marginBottom: '32px' }} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
              {[1,2].map(i => <div key={i} style={{ height: '240px', background: 'rgba(255,255,255,0.05)', borderRadius: '16px' }} />)}
            </div>
          </div>
        </div>
        <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }`}</style>
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div style={bg}>
        <Navbar />
        <div style={{ position: 'relative', zIndex: 1, flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 20px', textAlign: 'center' }}>
          <div style={{ background: 'rgba(239,68,68,0.1)', padding: '20px', borderRadius: '50%', marginBottom: '20px', border: '1px solid rgba(239,68,68,0.2)' }}>
            <AlertCircle size={40} color="#ef4444" />
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#f1f5f9', marginBottom: '12px' }}>Failed to load analytics</h2>
          <p style={{ color: '#94a3b8', fontSize: '15px', marginBottom: '32px', maxWidth: '400px' }}>{error || 'Something went wrong.'}</p>
          <button onClick={() => navigate('/dashboard')} style={glassBtn} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'} onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}>
            <ArrowLeft size={16} /> Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const browserKeys = Object.keys(analytics.browserStats || {});
  const totalBrowserClicks = browserKeys.reduce((sum, key) => sum + analytics.browserStats[key], 0);

  const desktopClicks = analytics.deviceStats?.Desktop || 0;
  const mobileClicks = analytics.deviceStats?.Mobile || 0;
  const tabletClicks = analytics.deviceStats?.Tablet || 0;
  const totalDeviceClicks = desktopClicks + mobileClicks + tabletClicks;

  return (
    <div style={bg}>
      <div className="orb-1" style={{ ...orb, top: '-100px', left: '-100px', width: '500px', height: '500px', background: 'radial-gradient(ellipse, rgba(99,102,241,0.15), transparent 70%)' }} />
      <div className="orb-2" style={{ ...orb, top: '50%', right: '-150px', width: '400px', height: '400px', background: 'radial-gradient(ellipse, rgba(139,92,246,0.1), transparent 70%)' }} />
      <div className="orb-3" style={{ ...orb, bottom: '-100px', left: '30%', width: '350px', height: '350px', background: 'radial-gradient(ellipse, rgba(236,72,153,0.08), transparent 70%)' }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <Navbar />

        <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px 60px' }}>
          
          <button onClick={() => navigate('/dashboard')} style={{ ...glassBtn, marginBottom: '24px' }} onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#f1f5f9'; }} onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#94a3b8'; }}>
            <ArrowLeft size={16} /> Dashboard
          </button>

          <div style={{ marginBottom: '32px' }}>
            <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#f1f5f9', marginBottom: '8px' }}>Analytics</h1>
            <p style={{ color: '#94a3b8', fontSize: '15px' }}>
              Metrics for <span style={{ ...gradientText, fontWeight: 700, fontSize: '16px' }}>{analytics.shortCode}</span>
            </p>
          </div>

          {/* Stats Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '32px' }}>
            <div style={{ ...glassCard, padding: '24px' }}>
              <p style={{ color: '#94a3b8', fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Total Clicks</p>
              <p style={{ color: '#818cf8', fontSize: '36px', fontWeight: 900, lineHeight: 1 }}>{analytics.totalClicks}</p>
            </div>
            <div style={{ ...glassCard, padding: '24px' }}>
              <p style={{ color: '#94a3b8', fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Last Visited</p>
              <p style={{ color: '#f1f5f9', fontSize: '15px', fontWeight: 600 }}>{formatDate(analytics.lastVisited)}</p>
            </div>
            <div style={{ ...glassCard, padding: '24px' }}>
              <p style={{ color: '#94a3b8', fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Created</p>
              <p style={{ color: '#f1f5f9', fontSize: '15px', fontWeight: 600 }}>{formatDate(analytics.createdAt)}</p>
            </div>
            <div style={{ ...glassCard, padding: '24px' }}>
              <p style={{ color: '#94a3b8', fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Original URL</p>
              <a href={analytics.originalUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#818cf8', fontSize: '14px', fontWeight: 600, textDecoration: 'none', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'} onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}>
                {analytics.originalUrl}
              </a>
            </div>
          </div>

          <div style={{ marginBottom: '32px' }}>
            <ClickChart data={analytics.dailyClicks} />
          </div>

          {/* Browser and Device Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '32px' }}>
            
            {/* Browser */}
            <div style={{ ...glassCard, padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                <div style={{ background: 'rgba(99,102,241,0.15)', padding: '8px', borderRadius: '10px' }}><Globe size={18} color="#818cf8" /></div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#f1f5f9', margin: 0 }}>Browser Stats</h3>
              </div>
              {browserKeys.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {browserKeys.map(key => {
                    const count = analytics.browserStats[key];
                    const percentage = totalBrowserClicks > 0 ? Math.round((count / totalBrowserClicks) * 100) : 0;
                    return (
                      <div key={key}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                          <span style={{ color: '#cbd5e1', fontSize: '13px', fontWeight: 600 }}>{key}</span>
                          <span style={{ color: '#818cf8', fontSize: '13px', fontWeight: 700 }}>{count} ({percentage}%)</span>
                        </div>
                        <div style={{ height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '99px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', background: '#6366f1', width: `${percentage}%`, borderRadius: '99px' }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p style={{ color: '#64748b', fontSize: '14px', textAlign: 'center', margin: '32px 0' }}>No browser data yet.</p>
              )}
            </div>

            {/* Device */}
            <div style={{ ...glassCard, padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                <div style={{ background: 'rgba(99,102,241,0.15)', padding: '8px', borderRadius: '10px' }}><Laptop size={18} color="#818cf8" /></div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#f1f5f9', margin: 0 }}>Device Breakdown</h3>
              </div>
              {totalDeviceClicks > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {[
                    { label: 'Desktop', count: desktopClicks },
                    { label: 'Mobile', count: mobileClicks },
                    { label: 'Tablet', count: tabletClicks }
                  ].map(dev => {
                    const percentage = totalDeviceClicks > 0 ? Math.round((dev.count / totalDeviceClicks) * 100) : 0;
                    return (
                      <div key={dev.label}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                          <span style={{ color: '#cbd5e1', fontSize: '13px', fontWeight: 600 }}>{dev.label}</span>
                          <span style={{ color: '#818cf8', fontSize: '13px', fontWeight: 700 }}>{dev.count} ({percentage}%)</span>
                        </div>
                        <div style={{ height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '99px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', background: '#6366f1', width: `${percentage}%`, borderRadius: '99px' }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p style={{ color: '#64748b', fontSize: '14px', textAlign: 'center', margin: '32px 0' }}>No device data yet.</p>
              )}
            </div>
          </div>

          {/* Recent Visits Table */}
          <div style={{ ...glassCard, padding: '24px', overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
              <div style={{ background: 'rgba(99,102,241,0.15)', padding: '8px', borderRadius: '10px' }}><BarChart size={18} color="#818cf8" /></div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#f1f5f9', margin: 0 }}>Recent Visits (Last 20)</h3>
            </div>

            <div style={{ overflowX: 'auto' }}>
              {analytics.recentVisits && analytics.recentVisits.length > 0 ? (
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                      <th style={{ padding: '12px 16px', color: '#94a3b8', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Time</th>
                      <th style={{ padding: '12px 16px', color: '#94a3b8', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Browser</th>
                      <th style={{ padding: '12px 16px', color: '#94a3b8', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Device</th>
                      <th style={{ padding: '12px 16px', color: '#94a3b8', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Referrer</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics.recentVisits.map((visit, idx) => (
                      <tr key={visit._id} style={{ background: idx % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <td style={{ padding: '14px 16px', color: '#e2e8f0', fontSize: '14px', whiteSpace: 'nowrap' }}>{formatDate(visit.visitedAt)}</td>
                        <td style={{ padding: '14px 16px', color: '#f8fafc', fontSize: '14px', fontWeight: 500, whiteSpace: 'nowrap' }}>{visit.browser}</td>
                        <td style={{ padding: '14px 16px', color: '#e2e8f0', fontSize: '14px', whiteSpace: 'nowrap' }}>{visit.device}</td>
                        <td style={{ padding: '14px 16px', color: '#94a3b8', fontSize: '14px', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={visit.referer}>{visit.referer}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p style={{ color: '#64748b', fontSize: '14px', textAlign: 'center', margin: '40px 0' }}>No redirects logged for this URL yet.</p>
              )}
            </div>
          </div>

        </main>
      </div>
    </div>
  );
};

export default Analytics;
