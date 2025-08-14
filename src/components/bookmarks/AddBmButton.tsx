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
  right: 60,
  width: 35,
  height: 35,
  border: "none",
  borderRadius: "50px",
  background: "#000000",
  color: "#ffffff",
  cursor: "pointer",
  fontSize: 23,
};

const iconStyle: React.CSSProperties = {
  verticalAlign: -3,
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
        <MdOutlineBookmarkAdd style={iconStyle} />
      </button>
    </ToolTip>
  );
};

export default AddBookmarkButton;
