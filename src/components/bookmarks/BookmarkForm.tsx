import { useState } from "react";
import { Bookmark, CancelBookmarkButtonProps } from "../../utils/types";
import { useSettings } from "../../hooks/settingsContext";

const BookmarkForm: React.FC<CancelBookmarkButtonProps> = ({
  onCancel,
  showBookmarkForm,
}) => {
  const modalStyle: React.CSSProperties = {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "#fff",
    padding: 20,
    boxShadow: "0 0 10px rgba(0,0,0,0.3)",
    zIndex: 1000,
    visibility: showBookmarkForm ? "visible" : "hidden",
  };
  const { addBookmark } = useSettings();
  const [url, setUrl] = useState("");
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("");

  const handleCancel = () => {
    onCancel(false);
  };

  const handleSubmit = () => {
    const finalIcon = icon || `https://icon.horse/icon/${url}`;
    const bookmark: Bookmark = {
      id: crypto.randomUUID(),
      url: url.startsWith("http") ? url : `https://${url}`,
      name: name || url,
      icon: finalIcon,
    };
    addBookmark(bookmark);
    onCancel(false);
  };

  return (
    <div style={modalStyle}>
      <h3>Add Bookmark</h3>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
      />
      <input
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="URL"
      />
      <input
        value={icon}
        onChange={(e) => setIcon(e.target.value)}
        placeholder="Icon URL (optional)"
      />
      <button onClick={handleSubmit}>Add</button>
      <button onClick={handleCancel}>Cancel</button>
    </div>
  );
};

export default BookmarkForm;
