import { CirclePicker } from "react-color";
import { useSettings } from "../hooks/settingsContext";

const ColorPanel: React.FC = () => {
  const { settings, updateAndPersistSettings } = useSettings();

  const handleColorChange = async (color: any) => {
    if (!settings) return;
    updateAndPersistSettings({ bgColor: color.hex }); // persist to browser.storage
  };

  return (
    <div style={{ padding: 20 }}>
      <CirclePicker
        color={settings?.bgColor ?? "#000000"}
        colors={[
          "#000000",
          "#aca4a4",
          "#f44336",
          "#e91e63",
          "#9c27b0",
          "#673ab7",
          "#3f51b5",
          "#2196f3",
          "#03a9f4",
          "#00bcd4",
          "#009688",
          "#4caf50",
          "#8bc34a",
          "#cddc39",
          "#ffeb3b",
          "#ffc107",
          "#ff9800",
          "#ff5722",
          "#795548",
          "#607d8b",
        ]}
        onChange={handleColorChange}
      />
    </div>
  );
};

export default ColorPanel;
