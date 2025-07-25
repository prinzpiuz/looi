import React from "react";
import { MdClose } from "react-icons/md";
import { SettingsButtonProps } from "../utils/types";
import ToolTip from "./ToolTip";

const toolTipPosition: React.CSSProperties = {
  top: 50,
  right: 20,
};
const CloseSettingsIcon: React.FC<SettingsButtonProps> = ({
  openSettingsPanel,
}) => {
  const toggleSettings = () => openSettingsPanel((prevValue) => !prevValue);
  return (
    <ToolTip message="Close Settings" extraStyles={toolTipPosition}>
      <div
        style={{ position: "fixed", top: 20, right: 20 }}
        onClick={toggleSettings}
      >
        <MdClose />
      </div>
    </ToolTip>
  );
};

export default CloseSettingsIcon;
