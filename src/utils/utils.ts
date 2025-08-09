export const capitalize = (s: string): string => {
  return s.charAt(0).toUpperCase() + s.slice(1);
};

export const removeProtocol = (url: string): string => {
  return url.replace("http://", "").replace("https://", "");
};
