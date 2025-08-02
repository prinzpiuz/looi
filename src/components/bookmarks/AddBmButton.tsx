import React from "react";
import { MdOutlineBookmarkAdd } from "react-icons/md";
import ToolTip from "../commons/ToolTip";
import { AddBookmarkButtonProps } from "../../utils/types";

const toolTipPosition: React.CSSProperties = {
  top: 50,
  right: 40,
};

const buttonStyles: React.CSSProperties = {
  position: "fixed",
  top: 30,
  right: 80,
  width: 35,
  height: 35,
  border: "none",
  borderRadius: "50px",
  background: "#3f3f3f",
  color: "#ffffff",
  cursor: "pointer",
  fontSize: 23,
};

const AddBookmarkButton: React.FC<AddBookmarkButtonProps> = ({
  showBookmarkForm,
}) => {
  return (
    <ToolTip message="Add Bookmark" extraStyles={toolTipPosition}>
      <button
        aria-label="Add Bookmark"
        onClick={() => showBookmarkForm(true)}
        style={buttonStyles}
      >
        <MdOutlineBookmarkAdd />
      </button>
    </ToolTip>
  );
};

export default AddBookmarkButton;
