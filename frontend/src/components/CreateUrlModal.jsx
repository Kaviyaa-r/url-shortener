import React, { useState } from 'react';
import { X, Copy, Check, Loader2, Link as LinkIcon, Sparkles, CheckCircle, Target } from 'lucide-react';
import axios from '../api/axios';
import { toast } from 'react-hot-toast';
import confetti from 'canvas-confetti';

const glassCard = {
  background: 'rgba(255,255,255,0.03)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderTop: '1px solid rgba(255,255,255,0.15)',
  borderRadius: '16px',
  boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
  padding: '32px',
  width: '100%',
  maxWidth: '480px',
  position: 'relative',
};

const glassInput = {
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '10px',
  color: '#f1f5f9',
  padding: '12px 16px',
  outline: 'none',
  width: '100%',
  fontSize: '15px',
  transition: 'all 0.3s ease',
  boxSizing: 'border-box',
};

const primaryBtn = {
  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
  border: 'none',
  borderRadius: '10px',
  color: 'white',
  fontWeight: 700,
  padding: '12px 24px',
  cursor: 'pointer',
  fontSize: '15px',
  transition: 'all 0.3s ease',
  boxShadow: '0 4px 20px rgba(99,102,241,0.4)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
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
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const CreateUrlModal = ({ isOpen, onClose, onSuccess }) => {
  if (!isOpen) return null;

  const [originalUrl, setOriginalUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successData, setSuccessData] = useState(null);
  const [copied, setCopied] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const [showUtm, setShowUtm] = useState(false);
  const [utmSource, setUtmSource] = useState('');
  const [utmMedium, setUtmMedium] = useState('');
  const [utmCampaign, setUtmCampaign] = useState('');

  const validateUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!originalUrl.trim()) {
      setErrorMsg('Long URL is required');
      return;
    }
    if (!validateUrl(originalUrl.trim())) {
      setErrorMsg('Please enter a valid absolute URL (e.g. https://google.com)');
      return;
    }

    setLoading(true);

    let finalUrl = originalUrl.trim();
    if (utmSource || utmMedium || utmCampaign) {
      try {
        const urlObj = new URL(finalUrl);
        if (utmSource) urlObj.searchParams.set('utm_source', utmSource.trim());
        if (utmMedium) urlObj.searchParams.set('utm_medium', utmMedium.trim());
        if (utmCampaign) urlObj.searchParams.set('utm_campaign', utmCampaign.trim());
        finalUrl = urlObj.toString();
      } catch (err) {
        // Silently fail if URL parsing fails here, validation caught it earlier
      }
    }

    try {
      const payload = {
        originalUrl: finalUrl,
        customAlias: customAlias.trim() || undefined,
        expiresAt: expiresAt || undefined
      };

      const response = await axios.post('/urls', payload);

      if (response.data.success) {
        setSuccessData(response.data.data);
        toast.success('URL shortened successfully!');
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#6366f1', '#8b5cf6', '#ec4899', '#10b981']
        });
        if (onSuccess) onSuccess();
      } else {
        setErrorMsg(response.data.error || 'Failed to shorten URL');
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.error || err.response?.data?.message || 'Server error. Please try again.');
      toast.error(err.response?.data?.error || 'Failed to shorten URL');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (successData?.shortUrl) {
      try {
        await navigator.clipboard.writeText(successData.shortUrl);
        setCopied(true);
        toast.success('Short link copied!');
        setTimeout(() => setCopied(false), 2000);
      } catch {
        toast.error('Failed to copy');
      }
    }
  };

  const handleReset = () => {
    setOriginalUrl(''); setCustomAlias(''); setExpiresAt('');
    setUtmSource(''); setUtmMedium(''); setUtmCampaign(''); setShowUtm(false);
    setSuccessData(null); setCopied(false); setErrorMsg('');
  };

  const inputStyle = (field) => ({
    ...glassInput,
    borderColor: focusedField === field ? '#6366f1' : 'rgba(255,255,255,0.1)',
    boxShadow: focusedField === field ? '0 0 0 3px rgba(99,102,241,0.2)' : 'none',
  });

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(0,0,0,0.75)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        padding: '20px',
        animation: 'fadeIn 0.2s ease',
      }}
    >
      <div style={glassCard}>
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px', borderRadius: '8px', transition: 'all 0.2s ease' }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
          onMouseLeave={e => e.currentTarget.style.background = 'none'}
        >
          <X size={20} />
        </button>

        {!successData ? (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
              <div style={{ background: 'rgba(99,102,241,0.15)', padding: '10px', borderRadius: '12px' }}>
                <LinkIcon size={20} color="#818cf8" />
              </div>
              <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#f1f5f9', margin: 0 }}>Shorten a URL</h3>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', color: '#94a3b8', fontSize: '13px', fontWeight: 600, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Long URL <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input type="text" value={originalUrl} onChange={e => setOriginalUrl(e.target.value)}
                  onFocus={() => setFocusedField('url')} onBlur={() => setFocusedField(null)}
                  style={inputStyle('url')} placeholder="https://example.com/very/long/path" />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', color: '#94a3b8', fontSize: '13px', fontWeight: 600, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Custom Alias <span style={{ color: '#64748b', textTransform: 'none', fontWeight: 400 }}>(Optional)</span>
                </label>
                <input type="text" value={customAlias} onChange={e => setCustomAlias(e.target.value)}
                  onFocus={() => setFocusedField('alias')} onBlur={() => setFocusedField(null)}
                  style={inputStyle('alias')} placeholder="my-brand" />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', color: '#94a3b8', fontSize: '13px', fontWeight: 600, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Expiry Date <span style={{ color: '#64748b', textTransform: 'none', fontWeight: 400 }}>(Optional)</span>
                </label>
                <input type="date" value={expiresAt} onChange={e => setExpiresAt(e.target.value)}
                  onFocus={() => setFocusedField('date')} onBlur={() => setFocusedField(null)}
                  style={inputStyle('date')} />
              </div>

              {/* UTM Toggle */}
              <div style={{ marginBottom: '24px' }}>
                <button 
                  type="button" 
                  onClick={() => setShowUtm(!showUtm)}
                  style={{ background: 'none', border: 'none', color: '#818cf8', fontSize: '13px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', padding: 0, transition: 'all 0.2s ease' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#c084fc'}
                  onMouseLeave={e => e.currentTarget.style.color = '#818cf8'}
                >
                  <Target size={16} /> {showUtm ? 'Hide Advanced Tracking (UTMs)' : 'Add Advanced Tracking (UTMs)'}
                </button>
              </div>

              {/* UTM Inputs */}
              {showUtm && (
                <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '16px', marginBottom: '24px', animation: 'fadeIn 0.3s ease' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                    <div>
                      <label style={{ display: 'block', color: '#94a3b8', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>UTM Source</label>
                      <input type="text" value={utmSource} onChange={e => setUtmSource(e.target.value)} onFocus={() => setFocusedField('utmSource')} onBlur={() => setFocusedField(null)} style={{ ...inputStyle('utmSource'), padding: '10px 14px', fontSize: '13px' }} placeholder="twitter, newsletter" />
                    </div>
                    <div>
                      <label style={{ display: 'block', color: '#94a3b8', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>UTM Medium</label>
                      <input type="text" value={utmMedium} onChange={e => setUtmMedium(e.target.value)} onFocus={() => setFocusedField('utmMedium')} onBlur={() => setFocusedField(null)} style={{ ...inputStyle('utmMedium'), padding: '10px 14px', fontSize: '13px' }} placeholder="social, email" />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', color: '#94a3b8', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>UTM Campaign</label>
                    <input type="text" value={utmCampaign} onChange={e => setUtmCampaign(e.target.value)} onFocus={() => setFocusedField('utmCampaign')} onBlur={() => setFocusedField(null)} style={{ ...inputStyle('utmCampaign'), padding: '10px 14px', fontSize: '13px' }} placeholder="summer_sale_2024" />
                  </div>
                </div>
              )}

              {errorMsg && (
                <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', padding: '12px', borderRadius: '10px', fontSize: '13px', marginBottom: '24px', fontWeight: 500 }}>
                  {errorMsg}
                </div>
              )}

              <button type="submit" disabled={loading} style={{ ...primaryBtn, width: '100%', opacity: loading ? 0.7 : 1 }}>
                {loading ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> : <><Sparkles size={18} /> Shorten Link</>}
              </button>
            </form>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '10px 0' }}>
            <div style={{ background: 'rgba(16,185,129,0.1)', borderRadius: '50%', width: '64px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', border: '1px solid rgba(16,185,129,0.2)' }}>
              <CheckCircle size={32} color="#10b981" />
            </div>
            <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#f1f5f9', marginBottom: '8px' }}>Link Created!</h3>
            <p style={{ color: '#94a3b8', fontSize: '15px', marginBottom: '24px' }}>Your premium short URL is ready to share.</p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '8px 8px 8px 16px', marginBottom: '32px' }}>
              <input
                type="text" readOnly value={successData.shortUrl}
                style={{ flex: 1, background: 'transparent', border: 'none', color: '#818cf8', fontWeight: 700, fontSize: '15px', outline: 'none' }}
              />
              <button
                onClick={handleCopy}
                style={{
                  background: copied ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.1)',
                  border: '1px solid',
                  borderColor: copied ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  color: copied ? '#10b981' : '#f1f5f9',
                  padding: '8px 12px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '13px',
                  fontWeight: 600,
                  transition: 'all 0.2s ease',
                }}
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={handleReset} style={{ ...glassBtn, flex: 1 }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'} onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}>
                Shorten Another
              </button>
              <button onClick={onClose} style={{ ...primaryBtn, flex: 1 }}>
                Done
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`@keyframes fadeIn { from{opacity:0} to{opacity:1} } @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
    </div>
  );
};

export default CreateUrlModal;
