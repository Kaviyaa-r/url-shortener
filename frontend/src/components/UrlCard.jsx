import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Copy, Check, QrCode, BarChart2, Trash2, Calendar } from 'lucide-react';
import { toast } from 'react-hot-toast';

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
  background: 'linear-gradient(90deg, #818cf8, #c084fc)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
};

const glassBtn = {
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '8px',
  color: '#94a3b8',
  cursor: 'pointer',
  width: '32px',
  height: '32px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.2s ease',
  padding: 0,
};

const UrlCard = ({ url, onDelete, onShowQR }) => {
  const [copied, setCopied] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url.shortUrl);
      setCopied(true);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy link');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this short URL and all its analytics data?')) return;
    setDeleting(true);
    try {
      await onDelete(url._id);
    } catch (err) {
      console.error('Delete error:', err);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div
      style={{
        ...glassCard,
        padding: '20px',
        transition: 'all 0.3s ease',
        borderColor: hovered ? 'rgba(99,102,241,0.4)' : 'rgba(255,255,255,0.08)',
        boxShadow: hovered ? '0 0 30px rgba(99,102,241,0.2), 0 20px 60px rgba(0,0,0,0.4)' : '0 8px 32px rgba(0,0,0,0.4)',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Original URL */}
      <p style={{ color: '#64748b', fontSize: '13px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: '6px' }} title={url.originalUrl}>
        {url.originalUrl}
      </p>

      {/* Short URL */}
      <a
        href={url.shortUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{ ...gradientText, fontSize: '16px', fontWeight: 700, display: 'block', marginBottom: '12px', textDecoration: 'none' }}
      >
        {url.shortUrl}
      </a>

      {/* Date + Click badge */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', paddingBottom: '14px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#475569', fontSize: '12px' }}>
          <Calendar size={12} />
          <span>{formatDate(url.createdAt)}</span>
          {url.expiresAt && (
            <span style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', borderRadius: '6px', padding: '2px 8px', fontSize: '11px', marginLeft: '6px' }}>
              Exp: {formatDate(url.expiresAt)}
            </span>
          )}
        </div>
        {/* Click count badge */}
        <span style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)', color: '#818cf8', borderRadius: '999px', padding: '3px 12px', fontSize: '12px', fontWeight: 700 }}>
          {url.clickCount} clicks
        </span>
      </div>

      {/* Action buttons */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          {/* Copy */}
          <button
            onClick={handleCopy}
            style={{
              ...glassBtn,
              width: 'auto',
              padding: '0 12px',
              gap: '6px',
              borderColor: copied ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.1)',
              background: copied ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.05)',
              color: copied ? '#10b981' : '#94a3b8',
              fontSize: '12px',
              fontWeight: 600,
            }}
            title="Copy Short URL"
          >
            {copied ? <Check size={13} /> : <Copy size={13} />}
            {copied ? 'Copied!' : 'Copy'}
          </button>

          {/* QR */}
          <button
            onClick={() => onShowQR(url.shortUrl)}
            style={glassBtn}
            title="QR Code"
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(99,102,241,0.4)'; e.currentTarget.style.color = '#818cf8'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#94a3b8'; }}
          >
            <QrCode size={14} />
          </button>

          {/* Analytics */}
          <button
            onClick={() => navigate(`/analytics/${url.shortCode}`)}
            style={glassBtn}
            title="View Analytics"
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(99,102,241,0.4)'; e.currentTarget.style.color = '#818cf8'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#94a3b8'; }}
          >
            <BarChart2 size={14} />
          </button>
        </div>

        {/* Delete */}
        <button
          onClick={handleDelete}
          disabled={deleting}
          style={{ ...glassBtn, opacity: deleting ? 0.5 : 1 }}
          title="Delete"
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(239,68,68,0.4)'; e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
        >
          {deleting
            ? <div style={{ width: '14px', height: '14px', border: '2px solid #ef4444', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            : <Trash2 size={14} />
          }
        </button>
      </div>

      <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
    </div>
  );
};

export default UrlCard;
