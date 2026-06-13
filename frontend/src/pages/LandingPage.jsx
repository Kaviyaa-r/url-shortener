import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Link2, Zap, BarChart3, Shield, Globe, Clock, MousePointer, Copy, Check } from 'lucide-react';

const bg = {
  background: 'linear-gradient(135deg, #060818 0%, #0d0b2e 50%, #060818 100%)',
  minHeight: '100vh',
  position: 'relative',
  overflow: 'hidden',
};

const orbStyle = { position: 'absolute', pointerEvents: 'none', zIndex: 0, borderRadius: '50%' };

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
  padding: '12px 28px',
  cursor: 'pointer',
  boxShadow: '0 4px 20px rgba(99,102,241,0.4)',
  fontSize: '15px',
  transition: 'all 0.3s ease',
  textDecoration: 'none',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
};

const glassBtn = {
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '10px',
  color: '#94a3b8',
  fontWeight: 600,
  padding: '12px 24px',
  cursor: 'pointer',
  fontSize: '15px',
  transition: 'all 0.3s ease',
  textDecoration: 'none',
  display: 'inline-flex',
  alignItems: 'center',
};

const demoUrls = [
  { short: 'snpl.ink/launch', original: 'https://producthunt.com/posts/snaplink-url-shortener-2024', clicks: 1482 },
  { short: 'snpl.ink/docs', original: 'https://docs.google.com/document/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms', clicks: 873 },
  { short: 'snpl.ink/video', original: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ&ab_channel=RickAstley', clicks: 3241 },
];

const features = [
  { icon: Zap, title: 'Instant Shortening', desc: 'Paste any URL and get a short link in milliseconds. No friction, no delays.' },
  { icon: BarChart3, title: 'Real-time Analytics', desc: 'Track every click with full device, browser, and referrer details.' },
  { icon: Shield, title: 'Custom Aliases', desc: 'Make links memorable with /your-brand. Stand out from generic links.' },
  { icon: Globe, title: 'QR Code Generation', desc: 'Every link includes a scannable QR code. Perfect for print and offline.' },
  { icon: Clock, title: 'Expiry Dates', desc: 'Auto-expire links after a chosen date. Keep your campaigns tight.' },
  { icon: MousePointer, title: 'Click Trends', desc: 'Daily bar chart showing your best performing links over 7 days.' },
];

const LandingPage = () => {
  const [activeDemo, setActiveDemo] = useState(0);
  const [copiedIdx, setCopiedIdx] = useState(null);
  const [btnHover, setBtnHover] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveDemo(prev => (prev + 1) % demoUrls.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleCopy = (idx, url) => {
    navigator.clipboard.writeText(url).then(() => {
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 2000);
    });
  };

  return (
    <div style={bg}>
      {/* Orbs */}
      <div className="orb-1" style={{ ...orbStyle, top: '-100px', left: '-100px', width: '500px', height: '500px', background: 'radial-gradient(ellipse, rgba(99,102,241,0.2), transparent 70%)' }} />
      <div className="orb-2" style={{ ...orbStyle, top: '50%', right: '-150px', width: '400px', height: '400px', background: 'radial-gradient(ellipse, rgba(139,92,246,0.15), transparent 70%)' }} />
      <div className="orb-3" style={{ ...orbStyle, bottom: '-100px', left: '30%', width: '350px', height: '350px', background: 'radial-gradient(ellipse, rgba(236,72,153,0.1), transparent 70%)' }} />

      {/* All content above orbs */}
      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* NAVBAR */}
        <nav style={{
          background: 'rgba(6,8,24,0.8)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          padding: '16px 48px',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', padding: '8px', borderRadius: '10px', display: 'flex' }}>
              <Link2 size={20} color="white" />
            </div>
            <span style={{ ...gradientText, fontSize: '22px', fontWeight: 900 }}>SnapLink</span>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <Link to="/login" className="btn-interactive" style={{ ...glassBtn, padding: '10px 20px', fontSize: '14px' }}>Sign In</Link>
            <Link to="/signup" className="btn-interactive" style={{ ...primaryBtn, padding: '10px 20px', fontSize: '14px' }}>Get Started Free</Link>
          </div>
        </nav>

        {/* HERO */}
        <section style={{ padding: 'clamp(60px, 10vw, 120px) 20px 80px', textAlign: 'center' }}>
          {/* Badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', ...glassCard, padding: '8px 18px', borderRadius: '999px', border: '1px solid rgba(99,102,241,0.3)', marginBottom: '32px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#6366f1', boxShadow: '0 0 8px #6366f1', animation: 'pulse 2s infinite' }} />
            <span style={{ color: '#a5b4fc', fontSize: '13px', fontWeight: 600 }}>Now with real-time analytics</span>
          </div>

          {/* H1 */}
          <h1 style={{ fontSize: 'clamp(48px,8vw,88px)', fontWeight: 900, letterSpacing: '-3px', lineHeight: 1.05, marginBottom: '24px' }}>
            <span style={{ color: '#f1f5f9', display: 'block' }}>Shorten URLs.</span>
            <span style={{ ...gradientText, display: 'block' }}>Track Everything.</span>
          </h1>

          <p style={{ color: '#64748b', fontSize: '20px', maxWidth: '560px', margin: '0 auto 40px', lineHeight: 1.7 }}>
            Turn long URLs into powerful short links with analytics, QR codes, and custom aliases — all in one place.
          </p>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/signup" className="btn-interactive" style={primaryBtn}>Start for Free →</Link>
            <Link to="/login" className="btn-interactive" style={glassBtn}>Sign In</Link>
          </div>
        </section>

        {/* LIVE DEMO CARD */}
        <section style={{ maxWidth: '760px', margin: '0 auto 80px', padding: '0 20px' }}>
          <div style={{ ...glassCard, overflow: 'hidden' }}>
            {/* Header */}
            <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              {['#ef4444','#f59e0b','#10b981'].map((c,i) => (
                <span key={i} style={{ width: '12px', height: '12px', borderRadius: '50%', background: c, display: 'inline-block' }} />
              ))}
              <span style={{ color: '#475569', fontSize: '13px', marginLeft: '8px' }}>Live Preview</span>
            </div>

            {/* Rows */}
            {demoUrls.map((item, idx) => (
              <div key={idx} style={{
                display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 24px',
                transition: 'all 0.3s ease',
                background: activeDemo === idx ? 'rgba(99,102,241,0.08)' : 'transparent',
                border: activeDemo === idx ? '1px solid rgba(99,102,241,0.3)' : '1px solid transparent',
                margin: '4px 8px',
                borderRadius: '10px',
              }}>
                <span style={{ color: '#6366f1', fontWeight: 700, fontSize: '14px', whiteSpace: 'nowrap', minWidth: '120px' }}>{item.short}</span>
                <span style={{ color: '#475569', fontSize: '13px', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.original}</span>
                <span style={{ color: '#94a3b8', fontSize: '12px', whiteSpace: 'nowrap' }}>{item.clicks.toLocaleString()} clicks</span>
                <button
                  onClick={() => handleCopy(idx, item.short)}
                  className="btn-interactive"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '6px', cursor: 'pointer', color: copiedIdx === idx ? '#10b981' : '#94a3b8', display: 'flex', transition: 'all 0.2s' }}
                >
                  {copiedIdx === idx ? <Check size={14} /> : <Copy size={14} />}
                </button>
              </div>
            ))}
          </div>
        </section>



        {/* FEATURES BENTO */}
        <section style={{ maxWidth: '1100px', margin: '0 auto 100px', padding: '0 20px' }}>
          <h2 style={{ textAlign: 'center', fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, color: '#f1f5f9', marginBottom: '48px', letterSpacing: '-1px' }}>
            Everything you need to{' '}
            <span style={gradientText}>grow your reach</span>
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            {features.map((f, i) => (
              <div key={i} className="glass-interactive" style={{ ...glassCard, padding: '28px', cursor: 'default' }}>
                <div style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '12px', padding: '12px', display: 'inline-flex', marginBottom: '16px' }}>
                  <f.icon size={22} color="#818cf8" />
                </div>
                <h3 style={{ color: '#f1f5f9', fontSize: '17px', fontWeight: 700, marginBottom: '8px' }}>{f.title}</h3>
                <p style={{ color: '#64748b', fontSize: '14px', lineHeight: 1.7 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section style={{ padding: '100px 20px', textAlign: 'center', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '600px', height: '400px', background: 'radial-gradient(ellipse, rgba(99,102,241,0.15), transparent 70%)', pointerEvents: 'none', borderRadius: '50%' }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h2 style={{ fontSize: 'clamp(32px,5vw,56px)', fontWeight: 900, color: '#f1f5f9', marginBottom: '16px', letterSpacing: '-2px' }}>
              Ready to grow your reach?
            </h2>
            <p style={{ color: '#64748b', fontSize: '18px', marginBottom: '40px' }}>Join thousands shortening links with SnapLink</p>
            <Link to="/signup" className="btn-interactive" style={{ ...primaryBtn, padding: '16px 40px', fontSize: '17px', boxShadow: '0 8px 32px rgba(99,102,241,0.5)' }}>
              Create Free Account →
            </Link>
          </div>
        </section>

        {/* FOOTER */}
        <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '28px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', padding: '6px', borderRadius: '8px', display: 'flex' }}>
              <Link2 size={14} color="white" />
            </div>
            <span style={{ ...gradientText, fontSize: '16px', fontWeight: 800 }}>SnapLink</span>
          </div>
          <span style={{ color: '#334155', fontSize: '12px', textAlign: 'center' }}>
            This project is a part of a hackathon run by{' '}
            <a href="https://katomaran.com" target="_blank" rel="noopener noreferrer" style={{ color: '#6366f1' }}>katomaran.com</a>
          </span>
          <span style={{ color: '#334155', fontSize: '12px' }}>© 2024 SnapLink. All rights reserved.</span>
        </footer>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
