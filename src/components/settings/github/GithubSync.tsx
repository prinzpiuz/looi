import React, { useState } from 'react';
import { FaGithub } from 'react-icons/fa';
import GithubDeviceFlow from './GithubDeviceFlow';
import GithubPATInput from './GithubPATInput';
import { saveToken } from '../../../utils/github';
import SyncSettings from './SyncSettings';
import { useSettings } from '../../../hooks/settingsContext';

const githubSyncDivStyle: React.CSSProperties = { margin: '7px 0 27px' };
const selectionDivStyle: React.CSSProperties = {
  display: 'flex',
  borderBottom: '1px solid #ffffff',
  gap: 0,
  marginBottom: -10,
};

const GitHubSync: React.FC = () => {
  const { settings, updateGithubSettings } = useSettings();
  const [tokenAvailable, setTokenAvailable] = useState(settings?.githubSync?.tokenSaved || false);
  const [authTab, setAuthTab] = useState<'device' | 'pat'>('device');

  const onToken = (token: string) => {
    saveToken(token);
    void updateGithubSettings({ tokenSaved: true });
    setTokenAvailable(true);
  };

  const connectButtonStyle: React.CSSProperties = {
    flex: 1,
    background: authTab === 'device' ? '#ffffff' : 'none',
    border: 'none',
    fontWeight: 700,
    fontSize: 15,
    padding: '12px 0',
    borderRadius: '8px 8px 0 0',
  };

  const authButtonStyle: React.CSSProperties = {
    flex: 1,
    background: authTab === 'pat' ? '#ffffff' : 'none',
    border: 'none',
    fontWeight: 700,
    fontSize: 15,
    padding: '12px 0',
    borderRadius: '8px 8px 0 0',
  };

  const getSection = () => {
    if (tokenAvailable) {
      return <SyncSettings onTokenReset={setTokenAvailable} />;
    } else {
      return (
        <>
          <div style={selectionDivStyle}>
            <button style={connectButtonStyle} onClick={() => setAuthTab('device')}>
              <FaGithub /> Login
            </button>
            <button style={authButtonStyle} onClick={() => setAuthTab('pat')}>
              <FaGithub /> Token
            </button>
          </div>
          {authTab === 'device' ? (
            <GithubDeviceFlow onToken={onToken} />
          ) : (
            <GithubPATInput onToken={onToken} />
          )}
        </>
      );
    }
  };

  return <div style={githubSyncDivStyle}>{getSection()}</div>;
};

export default GitHubSync;
