import React from "react";
import SettingsPanel from "./settings/SetttingsPanel";
import AddBookmarkButton from "./bookmarks/AddBmButton";
import Bookmarks from "./bookmarks/Bookmarks";
import BookmarkForm from "./bookmarks/BookmarkForm";
import DraggableWidget from "./widgets/DraggableWidget";
import { useSettings } from "../hooks/settingsContext";

const NewTabPage: React.FC = () => {
  const { settings } = useSettings();
  const [showBookmarkForm, setShowBookmarkForm] = React.useState(false);

  const bgColor = settings?.bgColor ?? "#000000";
  const bgUrl = settings?.bgUrl ? `url(${settings.bgUrl})` : undefined;
  const widgetConfigs = settings?.widgetConfigs || {};

  const newTabStyle: React.CSSProperties = {
    position: "relative",
    width: "100vw",
    height: "100vh",
    backgroundColor: bgColor,
    backgroundImage: bgUrl,
    backgroundSize: "cover",
    overflow: "hidden",
  };

  return (
    <div style={newTabStyle}>
      <SettingsPanel />
      <AddBookmarkButton showBookmarkForm={setShowBookmarkForm} />
      {Object.entries(widgetConfigs).map(([id, config]) => {
        if (!config.enabled) return null;
        return <DraggableWidget key={id} id={id} config={config} />;
      })}
      <Bookmarks />
      <BookmarkForm
        showBookmarkForm={showBookmarkForm}
        onCancel={setShowBookmarkForm}
      />
    </div>
  );
};

export default NewTabPage;
