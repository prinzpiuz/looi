import React from "react";
import { FaPlus } from "react-icons/fa6";
import ToolTip from "./ToolTip";
import { AddBookmarkButtonProps } from "../utils/types";

const toolTipPosition: React.CSSProperties = {
  top: 50,
  right: 60,
};

const AddBookmarkButton: React.FC<AddBookmarkButtonProps> = ({
  showBookmarkForm,
}) => {
  return (
    <ToolTip message="Add Bookmark" extraStyles={toolTipPosition}>
      <button
        onClick={() => showBookmarkForm(true)}
        style={{ position: "fixed", top: 20, right: 60 }}
      >
        <FaPlus />
      </button>
    </ToolTip>
  );
};

export default AddBookmarkButton;
