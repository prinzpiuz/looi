import { isChrome, isFirefox } from './browserApi';
import { TOKEN_EXPIRY_TIME } from './constants';
import {
    GithubAPIResponse,
    GitHubSyncSettings,
    GithubUnAuthorizedResponse,
    Settings,
} from './types';

export const capitalize = (s: string): string => {
    return s.charAt(0).toUpperCase() + s.slice(1);
};

export const removeProtocol = (url: string): string => {
    return url.replace('http://', '').replace('https://', '');
};

export const settingsToJSONString = (settings: Settings): string => {
    return JSON.stringify(settings, null, 2); // pretty-print with 2-space indent
};

export const isAPIResponse = (
    response: GithubAPIResponse | GithubUnAuthorizedResponse,
): response is GithubAPIResponse => {
    return (response as GithubAPIResponse).settings !== undefined;
};

export const closeTabAndOpen = () => {
    if (isFirefox()) {
        void browser.tabs.create({});
    }
    if (isChrome()) {
        void chrome.tabs.create({});
    }
    window.close();
    return;
};

export const isTokenExpired = (githubSettings: GitHubSyncSettings) => {
    if (githubSettings.tokenSaved && githubSettings.tokenType === 'PAT') {
        return false;
    }
    const now = Date.now();
    return now - githubSettings.storedAt > TOKEN_EXPIRY_TIME;
};

export enum gridItemType {
    BOOKMARK = 'bookmark',
    WIDGET = 'widget',
}
