import React, { useState, useCallback, useMemo } from 'react';
import { FaGithub, FaKey } from 'react-icons/fa';
import GithubDeviceFlow from './GithubDeviceFlow';
import GithubPATInput from './GithubPATInput';
import SyncSettings from './SyncSettings';
import { saveToken } from '../../../utils/github';
import { useSettings } from '../../../hooks/settingsContext';
import { isTokenExpired } from '../../../utils/utils';
import { toast } from '../../../utils/toastStore';
import '../../../assets/css/github_sync.css';
import { TabConfig, TokenType } from '../../../utils/types';

const TABS: TabConfig[] = [
    { id: 'UAT', label: 'Login', icon: <FaGithub /> },
    { id: 'PAT', label: 'Token', icon: <FaKey /> },
];

const GitHubSync: React.FC = () => {
    const { settings, updateGithubSettings } = useSettings();
    const [activeTab, setActiveTab] = useState<TokenType>('UAT');

    const isTokenValid = useMemo(() => {
        const githubSync = settings?.githubSync;
        if (!githubSync?.tokenSaved) return false;
        if (!githubSync.storedAt) return false;
        return !isTokenExpired(githubSync);
    }, [settings?.githubSync]);

    const handleTokenSave = useCallback(
        (token: string) => {
            saveToken(token);
            void updateGithubSettings({
                tokenSaved: true,
                storedAt: Date.now(),
                tokenType: activeTab,
            });
            toast.success('GitHub connected successfully!');
        },
        [activeTab, updateGithubSettings],
    );

    const handleTokenReset = useCallback(() => {
        toast.info('GitHub disconnected');
    }, []);

    const handleTabKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            const currentIndex = TABS.findIndex((tab) => tab.id === activeTab);
            let newIndex = currentIndex;

            if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                e.preventDefault();
                newIndex =
                    currentIndex > 0 ? currentIndex - 1 : TABS.length - 1;
            } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                e.preventDefault();
                newIndex =
                    currentIndex < TABS.length - 1 ? currentIndex + 1 : 0;
            }

            if (newIndex !== currentIndex) {
                setActiveTab(TABS[newIndex].id);
            }
        },
        [activeTab],
    );

    const renderAuthTabs = () => (
        <>
            <div
                className="github-sync__tabs"
                role="tablist"
                aria-label="Authentication method"
            >
                {TABS.map((tab) => (
                    <button
                        key={tab.id}
                        type="button"
                        role="tab"
                        id={`tab-${tab.id}`}
                        aria-selected={activeTab === tab.id}
                        aria-controls={`panel-${tab.id}`}
                        tabIndex={activeTab === tab.id ? 0 : -1}
                        className={`github-sync__tab ${activeTab === tab.id ? 'github-sync__tab--active' : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                        onKeyDown={handleTabKeyDown}
                    >
                        <span className="github-sync__tab-icon">
                            {tab.icon}
                        </span>
                        {tab.label}
                    </button>
                ))}
            </div>

            <div
                id={`panel-${activeTab}`}
                role="tabpanel"
                aria-labelledby={`tab-${activeTab}`}
                className="github-sync__panel"
            >
                {activeTab === 'UAT' ? (
                    <GithubDeviceFlow onToken={handleTokenSave} />
                ) : (
                    <GithubPATInput onToken={handleTokenSave} />
                )}
            </div>
        </>
    );

    const renderConnected = () => (
        <div className="github-sync__connected">
            <SyncSettings onTokenReset={handleTokenReset} />
        </div>
    );

    return (
        <div className="github-sync">
            {isTokenValid ? renderConnected() : renderAuthTabs()}
        </div>
    );
};

export default GitHubSync;
