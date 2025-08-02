import React, { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { FoldableSectionProps } from "../../utils/types";

const FoldableSection: React.FC<FoldableSectionProps> = ({
  title,
  icon,
  children,
  defaultOpen = false,
}) => {
  const [open, setOpen] = useState(defaultOpen);

  const foldableSectionStyles: React.CSSProperties = {
    marginRight: 10,
    marginBottom: 16,
    background: "rgba(240,241,245,0.4)",
    borderRadius: 10,
    transition: "box-shadow 0.17s",
  };

  const buttonStyles: React.CSSProperties = {
    display: "flex",
    width: "100%",
    alignItems: "center",
    justifyContent: "flex-start",
    background: "none",
    border: 0,
    padding: "14px 18px",
    fontWeight: 600,
    fontSize: 15,
    color: "#181c32",
    cursor: "pointer",
  };

  const iconStyles: React.CSSProperties = {
    marginRight: 11,
  };

  const faChevronDownStyles: React.CSSProperties = {
    transform: open ? "rotate(180deg)" : undefined,
    opacity: 0.7,
  };

  const spanStyles: React.CSSProperties = {
    marginLeft: "auto",
    transition: "transform 0.16s",
  };

  const childerParentDivStyles: React.CSSProperties = {
    maxHeight: open ? 400 : 0,
    transition: "max-height 0.23s cubic-bezier(.4,0,.2,1)",
    overflow: "hidden",
    padding: open ? "0 18px 12px 53px" : "0 18px",
  };

  const childrenStyles: React.CSSProperties = {
    opacity: open ? 1 : 0,
    transition: "opacity 0.18s",
  };

  return (
    <div style={foldableSectionStyles}>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        style={buttonStyles}
      >
        {icon && <span style={iconStyles}>{icon}</span>}
        {title}
        <span style={spanStyles}>
          <FaChevronDown style={faChevronDownStyles} />
        </span>
      </button>
      <div style={childerParentDivStyles}>
        <div style={childrenStyles}>{open && children}</div>
      </div>
    </div>
  );
};

export default FoldableSection;
