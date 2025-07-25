import React from "react";
import { useSettings } from "../hooks/settingsContext";

const BgImageURL: React.FC = () => {
  const { settings, updateAndPersistSettings } = useSettings();

  const handleBgUrlChange = async (newUrl: string) => {
    if (!settings) return;

    updateAndPersistSettings({ bgUrl: newUrl });
  };

  return (
    <div style={{ marginTop: 10 }}>
      <label>Background image URL:</label>
      <br />
      <input
        type="text"
        value={settings?.bgUrl ?? ""}
        placeholder="Enter image URL"
        onChange={(e) => handleBgUrlChange(e.target.value)}
        style={{ width: "100%" }}
      />
    </div>
  );
};

export default BgImageURL;
