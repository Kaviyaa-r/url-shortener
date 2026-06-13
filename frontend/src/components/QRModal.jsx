import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Download, QrCode } from 'lucide-react';
import { toast } from 'react-hot-toast';

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
  maxWidth: '400px',
  position: 'relative',
};

const glassBtn = {
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '10px',
  color: '#f1f5f9',
  fontWeight: 600,
  padding: '12px 24px',
  cursor: 'pointer',
  fontSize: '15px',
  transition: 'all 0.3s ease',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  width: '100%',
};

const QRModal = ({ isOpen, onClose, shortUrl }) => {
  if (!isOpen) return null;

  const handleDownload = () => {
    const svgElement = document.getElementById('snaplink-qr-svg');
    if (!svgElement) {
      toast.error('QR code element not found.');
      return;
    }

    try {
      const svgString = new XMLSerializer().serializeToString(svgElement);
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const blobURL = window.URL.createObjectURL(svgBlob);
      const image = new Image();

      image.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 220;
        canvas.height = 220;
        const context = canvas.getContext('2d');
        
        context.drawImage(image, 0, 0, 220, 220);
        const pngURL = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');

        downloadLink.href = pngURL;
        downloadLink.download = 'snaplink-qr.png';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        window.URL.revokeObjectURL(blobURL);
      };

      image.src = blobURL;
    } catch (err) {
      console.error('QR Code download failed:', err);
      toast.error('Failed to download QR code image.');
    }
  };

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

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
          <div style={{ background: 'rgba(99,102,241,0.15)', padding: '10px', borderRadius: '12px' }}>
            <QrCode size={20} color="#818cf8" />
          </div>
          <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#f1f5f9', margin: 0 }}>QR Code</h3>
        </div>

        <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '32px' }}>
          <div style={{ background: 'transparent', padding: '10px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', marginBottom: '24px' }}>
            <QRCodeSVG
              id="snaplink-qr-svg"
              value={shortUrl}
              size={220}
              bgColor="transparent"
              fgColor="#ffffff"
              level="H"
              includeMargin={false}
            />
          </div>
          <p style={{ color: '#818cf8', fontSize: '15px', fontWeight: 700, margin: 0 }}>{shortUrl}</p>
        </div>

        <button 
          onClick={handleDownload} 
          style={glassBtn}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.1)'; e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)'; e.currentTarget.style.color = '#818cf8'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#f1f5f9'; }}
        >
          <Download size={18} /> Download PNG
        </button>
      </div>

      <style>{`@keyframes fadeIn { from{opacity:0} to{opacity:1} }`}</style>
    </div>
  );
};

export default QRModal;
