import { FaCog } from "react-icons/fa";
import { SettingsButtonProps } from "../../utils/types";
import ToolTip from "../commons/ToolTip";

const toolTipPosition: React.CSSProperties = {
  top: 50,
  right: 20,
};

const buttonStyles: React.CSSProperties = {
  position: "fixed",
  top: 30,
  right: 30,
  width: 35,
  height: 35,
  border: "none",
  borderRadius: "50px",
  background: "#3f3f3f",
  color: "#ffffff",
  cursor: "pointer",
  fontSize: 23,
};

const SettingsIcon: React.FC<SettingsButtonProps> = ({ openSettingsPanel }) => {
  const toggleSettings = () => openSettingsPanel((prevValue) => !prevValue);
  return (
    <ToolTip message="Settings" extraStyles={toolTipPosition}>
      <button
        aria-label="Open settings"
        onClick={toggleSettings}
        style={buttonStyles}
      >
        <FaCog />
      </button>
    </ToolTip>
  );
};

export default SettingsIcon;
