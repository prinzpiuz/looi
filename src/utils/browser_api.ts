export let browser: typeof import("webextension-polyfill") | null = null;

try {
  browser = require("webextension-polyfill");
} catch {
  console.warn(
    "webextension-polyfill is not available — running in non-extension env?",
  );
}

export const isExtensionEnv = () => !!browser;
export const isFirefox = () =>
  isExtensionEnv() &&
  browser?.runtime.getBrowserInfo().then((info) => info.name === "Firefox");
export const isChrome = () =>
  isExtensionEnv() &&
  browser?.runtime.getBrowserInfo().then((info) => info.name === "Chrome");
export const isEdge = () =>
  isExtensionEnv() &&
  browser?.runtime
    .getBrowserInfo()
    .then((info) => info.name === "Microsoft Edge");
