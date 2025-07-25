import React, { useState } from "react";
import SettingsIcon from "./SettingsIcon";
import ColorPanel from "./ColorPicker";
import BgImageURL from "./BgImageInput";
import CloseSettingsIcon from "./CloseSettings";

const SettingsPanel: React.FC = () => {
  const [settingsOpen, setSettingsOpen] = useState(false);

  const panelStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    right: 0,
    height: "100%",
    width: "250px",
    backgroundColor: "#ffffff",
    boxShadow: "-2px 0 5px rgba(0,0,0,0.3)",
    transform: settingsOpen ? "translateX(0)" : "translateX(100%)",
    transition: "transform 0.3s ease-in-out",
    padding: 20,
    zIndex: 999,
  };

  return (
    <div>
      <SettingsIcon openSettingsPanel={setSettingsOpen} />
      <div style={panelStyle}>
        <CloseSettingsIcon openSettingsPanel={setSettingsOpen} />
        <h2>Settings</h2>
        <hr />
        <ColorPanel />
        <hr />
        <BgImageURL />
        <hr />
      </div>
    </div>
  );
};

export default SettingsPanel;
