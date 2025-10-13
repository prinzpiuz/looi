import React, { useState } from 'react';

const patDivStyle: React.CSSProperties = {
  maxWidth: 190,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 10,
};

const labelStyle: React.CSSProperties = {
  marginBottom: 3,
  color: '#ffffff',
};

const buttonStyle: React.CSSProperties = {
  fontWeight: 700,
  fontSize: 15,
  padding: '10px 24px',
  background: 'linear-gradient(90deg,#2f82e4,#4559f9)',
  color: '#ffffff',
  cursor: 'pointer',
  boxShadow: '0 2.5px 8px rgba(83,99,190,0.05)',
  transition: 'background .14s, color .14s, box-shadow .13s',
  border: 0,
  borderRadius: 8,
};

const creatTokenStyle: React.CSSProperties = {
  color: '#fff',
  marginTop: 14,
  fontSize: 13,
};

const errorDivStyle: React.CSSProperties = {
  color: '#ffffff',
  marginBottom: 6,
  fontSize: 13,
};

const GithubPATInput: React.FC<{
  onToken: (token: string) => void;
}> = ({ onToken }) => {
  const [focus, setFocus] = useState(false);
  const [pat, setPat] = useState('');
  const [error, setError] = useState<string | null>(null);

  const inputStyle: React.CSSProperties = {
    width: '60%',
    height: 3,
    border: 'none',
    borderRadius: 5,
    outline: focus ? '2px solid #2189fa' : '1.2px solid #dfdff5',
    background: 'rgba(255,255,255,0.16)',
    boxShadow: focus ? '0 2px 10px rgba(33,137,250,0.13)' : '0 1.5px 5px rgba(60,90,160,0.04)',
    fontSize: '1rem',
    padding: '24px 38px 8px 35px',
    color: '#1f283b',
    transition: 'box-shadow .14s, outline .12s',
  };

  const inputLabelStyle: React.CSSProperties = {
    position: 'absolute',
    left: 75,
    bottom: focus || pat ? 322 : 311,
    fontSize: focus || pat ? 13 : 16,
    color: focus ? '#ffffffff' : '#8d97ad',
    padding: '0 3px',
    pointerEvents: 'none',
    transition: 'all .18s cubic-bezier(.4,0,.2,1)',
    fontWeight: 600,
  };

  const handleSave = () => {
    if (!/^ghp_/i.test(pat.trim())) {
      setError('That does not look like a valid GitHub Personal Access Token.');
      return;
    }
    setError(null);
    onToken(pat.trim());
  };

  return (
    <div style={patDivStyle}>
      <h5 style={labelStyle}>Note: Paste your GitHub Personal Access Token (scope: gist)</h5>
      <label htmlFor="token-input" style={inputLabelStyle}>
        Github Token
      </label>
      <input
        value={pat}
        onChange={(e) => setPat(e.target.value)}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        style={inputStyle}
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        placeholder=""
      />
      {error && <div style={errorDivStyle}>{error}</div>}
      <button onClick={handleSave} style={buttonStyle}>
        Save Token
      </button>
      <div style={creatTokenStyle}>
        <span>Don’t have a token? </span>
        <a
          href="https://github.com/settings/tokens/new?scopes=gist&description=Settings%20Sync%20Extension"
          target="_blank"
          rel="noopener noreferrer"
        >
          Create one here
        </a>
      </div>
    </div>
  );
};

export default GithubPATInput;
