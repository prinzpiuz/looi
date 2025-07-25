import React, { useRef } from "react";
import Draggable from "react-draggable";
import { Bookmark } from "../utils/types";
import ToolTip from "./ToolTip";

const bookmarkStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "8px",
  marginBottom: "8px",
};

const BookmarkWidget: React.FC<{
  bookmark: Bookmark;
  index: number;
}> = ({ bookmark, index }) => {
  const nodeRef = useRef(null);
  const styles: React.CSSProperties = {
    ...bookmarkStyle,
    ...bookmark.position,
  };

  return (
    <ToolTip message={bookmark.url}>
      <Draggable key={index} nodeRef={nodeRef}>
        <div style={styles} ref={nodeRef}>
          <img src={bookmark.icon} alt={bookmark.url} width={40} height={40} />
          <a href={bookmark.url} target="_self" rel="noopener noreferrer">
            {bookmark.name}
          </a>
        </div>
      </Draggable>
    </ToolTip>
  );
};

export default BookmarkWidget;
