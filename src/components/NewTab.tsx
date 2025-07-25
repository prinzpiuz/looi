import React from "react";
import CalendarWidget from "./Calendar";
import SettingsPanel from "./SetttingsPanel";
import AddBookmarkButton from "./AddBMButton";
import Bookmarks from "./Bookmarks";
import { useSettings } from "../hooks/settingsContext";
import BookmarkForm from "./BookmarkForm";

const NewTabPage: React.FC = () => {
  const { settings } = useSettings();
  const [showBookmarkForm, setShowBookmarkForm] = React.useState(false);

  const bgColor = settings?.bgColor ?? "#000000";
  const bgUrl = settings?.bgUrl ? `url(${settings.bgUrl})` : undefined;

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
      <CalendarWidget />
      <Bookmarks />
      <BookmarkForm
        showBookmarkForm={showBookmarkForm}
        onCancel={setShowBookmarkForm}
      />
    </div>
  );
};

export default NewTabPage;
