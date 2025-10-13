import { useState } from 'react';
import { FaLink } from 'react-icons/fa';
import { useSettings } from '../../../hooks/settingsContext';

const bgInputDivStyle: React.CSSProperties = {
  borderRadius: 12,
  margin: '10px 0 14px 0',
  transition: 'box-shadow 0.2s',
  position: 'relative',
  marginLeft: 10,
};

const BgImageURL: React.FC = () => {
  const { settings, updateAndPersistSettings } = useSettings();
  const [focus, setFocus] = useState(false);
  const bgImageURL = settings?.bgUrl ?? '';

  const handleBgUrlChange = (newUrl: string) => {
    if (!settings) return;
    void updateAndPersistSettings({ bgUrl: newUrl });
  };

  const inputLabelStyle: React.CSSProperties = {
    position: 'absolute',
    left: 25,
    top: focus || bgImageURL ? 3 : 10,
    fontSize: focus || bgImageURL ? 13 : 16,
    color: focus ? '#ffffffff' : '#8d97ad',
    padding: '0 3px',
    pointerEvents: 'none',
    transition: 'all .18s cubic-bezier(.4,0,.2,1)',
    fontWeight: 600,
  };

  const linkIconStyle: React.CSSProperties = {
    position: 'absolute',
    left: 6,
    top: 9,
    fontSize: 17,
    color: focus ? '#ffffff' : '#7f98bf',
    opacity: 0.76,
    pointerEvents: 'none',
  };

  const inputStyle: React.CSSProperties = {
    width: '60%',
    height: 6,
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

  return (
    <div style={bgInputDivStyle}>
      <label htmlFor="bg-url-input" style={inputLabelStyle}>
        Image URL
      </label>
      <FaLink style={linkIconStyle} />
      <input
        id="bg-url-input"
        type="text"
        autoComplete="off"
        value={bgImageURL}
        placeholder=""
        onChange={(e) => handleBgUrlChange(e.target.value)}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        style={inputStyle}
      />
    </div>
  );
};

export default BgImageURL;
