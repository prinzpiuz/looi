import React from "react";
import { CiSettings } from "react-icons/ci";
import { SettingsButtonProps } from "../utils/types";
import ToolTip from "./ToolTip";

const toolTipPosition: React.CSSProperties = {
  top: 50,
  right: 20,
};
const SettingsIcon: React.FC<SettingsButtonProps> = ({ openSettingsPanel }) => {
  const toggleSettings = () => openSettingsPanel((prevValue) => !prevValue);
  return (
    <ToolTip message="Settings" extraStyles={toolTipPosition}>
      <button
        style={{ position: "fixed", top: 20, right: 20 }}
        onClick={toggleSettings}
      >
        <CiSettings />
      </button>
    </ToolTip>
  );
};

export default SettingsIcon;
