import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Link2, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from '../api/axios';
import { toast } from 'react-hot-toast';

const bg = {
  background: 'linear-gradient(135deg, #060818 0%, #0d0b2e 50%, #060818 100%)',
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '20px',
  position: 'relative',
  overflow: 'hidden',
};

const orb = { position: 'absolute', pointerEvents: 'none', borderRadius: '50%' };

const glassCard = {
  background: 'rgba(255,255,255,0.03)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderTop: '1px solid rgba(255,255,255,0.15)',
  borderRadius: '20px',
  boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
  padding: '40px',
  width: '100%',
  maxWidth: '420px',
  position: 'relative',
  zIndex: 1,
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
  padding: '13px 24px',
  cursor: 'pointer',
  width: '100%',
  fontSize: '15px',
  transition: 'all 0.3s ease',
  boxShadow: '0 4px 20px rgba(99,102,241,0.4)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
};

const gradientText = {
  background: 'linear-gradient(90deg, #818cf8, #c084fc, #f472b6)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
};

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const validateEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(val).toLowerCase());

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailError('');
    setPasswordError('');
    let isValid = true;

    if (!email) { setEmailError('Email is required'); isValid = false; }
    else if (!validateEmail(email)) { setEmailError('Please enter a valid email'); isValid = false; }
    if (!password) { setPasswordError('Password is required'); isValid = false; }

    if (!isValid) return;
    setLoading(true);

    try {
      const response = await axios.post('/auth/login', { email, password });
      if (response.data.success) {
        login(response.data.data.user, response.data.data.token);
        toast.success('Welcome back!');
        navigate('/dashboard');
      } else {
        toast.error(response.data.error || 'Login failed.');
      }
    } catch (err) {
      const errMsg = err.response?.data?.error || err.response?.data?.message || 'Server error. Please try again.';
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (field) => ({
    ...glassInput,
    borderColor: focusedField === field ? '#6366f1' : 'rgba(255,255,255,0.1)',
    boxShadow: focusedField === field ? '0 0 0 3px rgba(99,102,241,0.2)' : 'none',
  });

  return (
    <div style={bg}>
      {/* Orbs */}
      <div className="orb-1" style={{ ...orb, top: '-100px', left: '-100px', width: '500px', height: '500px', background: 'radial-gradient(ellipse, rgba(99,102,241,0.2), transparent 70%)' }} />
      <div className="orb-2" style={{ ...orb, top: '50%', right: '-150px', width: '400px', height: '400px', background: 'radial-gradient(ellipse, rgba(139,92,246,0.15), transparent 70%)' }} />
      <div className="orb-3" style={{ ...orb, bottom: '-100px', left: '30%', width: '350px', height: '350px', background: 'radial-gradient(ellipse, rgba(236,72,153,0.1), transparent 70%)' }} />

      <div style={glassCard}>
        {/* Brand */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', padding: '12px', borderRadius: '14px', display: 'inline-flex', marginBottom: '16px', boxShadow: '0 8px 24px rgba(99,102,241,0.4)' }}>
            <Link2 size={28} color="white" />
          </div>
          <div style={{ ...gradientText, fontSize: '26px', fontWeight: 900, marginBottom: '6px' }}>SnapLink</div>
          <p style={{ color: '#64748b', fontSize: '15px' }}>Welcome back</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', color: '#94a3b8', fontSize: '13px', fontWeight: 600, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onFocus={() => setFocusedField('email')}
              onBlur={() => setFocusedField(null)}
              style={inputStyle('email')}
              placeholder="you@example.com"
            />
            {emailError && <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '6px' }}>{emailError}</p>}
          </div>

          {/* Password */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', color: '#94a3b8', fontSize: '13px', fontWeight: 600, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                style={{ ...inputStyle('password'), paddingRight: '44px' }}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', display: 'flex', padding: 0 }}
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {passwordError && <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '6px' }}>{passwordError}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-interactive"
            style={{ ...primaryBtn, opacity: loading ? 0.7 : 1 }}
          >
            {loading ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> : 'Sign In'}
          </button>
        </form>

        <p style={{ textAlign: 'center', color: '#475569', fontSize: '14px', marginTop: '24px' }}>
          New to SnapLink?{' '}
          <Link to="/signup" style={{ color: '#818cf8', fontWeight: 700, textDecoration: 'none' }}>Create account</Link>
        </p>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default Login;
