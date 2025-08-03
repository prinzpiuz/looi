import { CirclePicker } from "react-color";
import { useSettings } from "../../../hooks/settingsContext";
import { ColorResult } from "../../../utils/types";

const palette = [
  "#478559",
  "#51d0de",
  "#8f8d9d",
  "#496393",
  "#c59c7f",
  "#462532",
  "#e1c7cb",
  "#787197",
  "#c1a4e2",
  "#b4aef0",
  "#c0c0c0",
  "#00ab78",
  "#ffc0cb",
  "#c89666",
  "#008080",
  "#a28089",
];

const colorPickerDivStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 10,
  width: "100%",
};

const colorInputStyle: React.CSSProperties = {
  width: "40px",
  height: "40px",
  border: "none",
  background: "none",
  cursor: "pointer",
};

const labelStyle: React.CSSProperties = {
  fontSize: 13,
  color: "#ffffff",
  fontWeight: 600,
  marginBottom: 5,
};

const cusomColorDivStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

const ColorPanel: React.FC = () => {
  const { settings, updateAndPersistSettings } = useSettings();
  const colorValue = settings?.bgColor ?? "#000000";

  const handleColorChange = (color: ColorResult) => {
    if (!settings) return;
    updateAndPersistSettings({ bgColor: color.hex }); // persist to browser.storage
  };

  const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    if (!settings) return;
    updateAndPersistSettings({ bgColor: newColor }); // persist to browser.storage
  };

  return (
    <div style={colorPickerDivStyle}>
      <label style={labelStyle}>Background Color</label>
      <CirclePicker
        width="170px"
        color={colorValue}
        colors={palette}
        onChange={handleColorChange}
      />
      <div style={cusomColorDivStyle}>
        <label style={labelStyle}>Custom</label>
        <input
          type="color"
          onChange={handleCustomColorChange}
          value={colorValue}
          style={colorInputStyle}
        />
      </div>
    </div>
  );
};

export default ColorPanel;
