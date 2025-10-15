import { typedWindow, BrowserAPI, BrowserType } from './types';

export let browser: typeof import('webextension-polyfill') | null = null;
export const ext: BrowserAPI | undefined =
    typedWindow.browser || typedWindow.chrome;

try {
    browser = require('webextension-polyfill');
} catch {
    // eslint-disable-next-line no-undef
    console.warn(
        'webextension-polyfill is not available — running in non-extension env?',
    );
}

export const getBrowserType = (): BrowserType => {
    const userAgent = navigator.userAgent.toLowerCase();

    if (userAgent.includes('firefox')) return 'firefox';
    if (userAgent.includes('edg/')) return 'edge'; // Edge userAgent includes 'Edg/'
    if (userAgent.includes('opr/') || userAgent.includes('opera'))
        return 'opera';
    if (userAgent.includes('chrome')) return 'chrome';
    if (userAgent.includes('safari')) return 'safari';

    return 'unknown';
};

export const isExtensionEnv = () => !!browser;
export const isFirefox = (): boolean => getBrowserType() === 'firefox';
export const isChrome = (): boolean => getBrowserType() === 'chrome';
export const isEdge = (): boolean => getBrowserType() === 'edge';
