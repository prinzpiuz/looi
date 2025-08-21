import { Settings } from "./types";

export const capitalize = (s: string): string => {
  return s.charAt(0).toUpperCase() + s.slice(1);
};

export const removeProtocol = (url: string): string => {
  return url.replace("http://", "").replace("https://", "");
};

export const settingsToJSONString = (settings: Settings): string => {
  return JSON.stringify(settings, null, 2); // pretty-print with 2-space indent
};
