import { useRef, useState } from "react";
import { FaEllipsis } from "react-icons/fa6";
import Draggable, { DraggableData, DraggableEvent } from "react-draggable";
import { Bookmark } from "../../utils/types";
import { useSettings } from "../../hooks/settingsContext";

const bookmarkStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  width: "80px",
  minHeight: "70px",
  background: "rgba(22, 22, 22, 0.7)",
  borderRadius: "15px",
  boxShadow: "0 4px 32px rgba(0,0,0,0.25)",
  backdropFilter: "blur(7px)",
  padding: "18px 8px 12px 8px",
  transition:
    "transform 0.12s cubic-bezier(.4,0,.2,1), box-shadow 0.12s cubic-bezier(.4,0,.2,1)",
};

const linkStyle: React.CSSProperties = {
  color: "#f1f1f1",
  fontWeight: 600,
  fontSize: "0.83rem",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  textDecoration: "none",
  margin: "5px 0 0 0",
  textAlign: "center",
  maxWidth: "80px",
  transition: "color 0.1s ease",
};

const moreIconStyle: React.CSSProperties = {
  color: "#a5adc6",
  fontSize: "1.13rem",
  marginTop: "10px",
  cursor: "pointer",
  transition: "color 0.2s",
};

const imageStyle: React.CSSProperties = {
  borderRadius: "50px",
  background: "rgba(255,255,255,0.08)",
  boxShadow: "0 1.5px 7px 0 rgba(0,0,0,0.08)",
};

const BookmarkDiv: React.FC<{
  bookmark: Bookmark;
  index: number;
}> = ({ bookmark, index }) => {
  const nodeRef = useRef(null);
  const styles: React.CSSProperties = {
    ...bookmarkStyle,
    ...bookmark.position,
  };

  const [position, setPosition] = useState(bookmark.position || { x: 0, y: 0 });
  const { updateBookmark } = useSettings();

  const handleStop = (_: DraggableEvent, data: DraggableData) => {
    setPosition({ x: data.x, y: data.y });
    updateBookmark(bookmark.id, {
      position: {
        x: data.x,
        y: data.y,
      },
    });
  };

  return (
    <Draggable
      key={bookmark.id}
      nodeRef={nodeRef}
      position={position}
      onStop={handleStop}
    >
      <div ref={nodeRef} tabIndex={index}>
        <div
          style={styles}
          onMouseEnter={(e) =>
            (e.currentTarget.style.transform = "scale(1.025)")
          }
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          <img
            src={bookmark.icon}
            alt={bookmark.url}
            width={44}
            height={44}
            style={imageStyle}
          />
          <a
            href={bookmark.url}
            target="_self"
            rel="noopener noreferrer"
            style={linkStyle}
            title={bookmark.name}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#0078c9ff")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#a5adc6")}
          >
            {bookmark.name}
          </a>
          <div
            style={moreIconStyle}
            tabIndex={0}
            onFocus={(e) => (e.currentTarget.style.color = "#ffe57f")}
            onBlur={(e) => (e.currentTarget.style.color = "#a5adc6")}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#ffa726")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#a5adc6")}
          >
            <FaEllipsis />
          </div>
        </div>
      </div>
    </Draggable>
  );
};

export default BookmarkDiv;
