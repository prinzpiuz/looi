const ToolTip: React.FC<{
  message: string;
  children: React.ReactNode;
  extraStyles?: React.CSSProperties;
}> = ({ message, children, extraStyles }) => {
  const tooltipStyle: React.CSSProperties = {
    position: "fixed",
    display: "inline-block",
    cursor: "pointer",
    borderBottom: "1px dotted black",
  };

  const tooltipTextStyle: React.CSSProperties = {
    visibility: "hidden",
    width: "120px",
    backgroundColor: "black",
    color: "#fff",
    textAlign: "center",
    borderRadius: "6px",
    padding: "5px 0",
    position: "fixed",
    zIndex: 1,
  };

  const handleMouseOver = (e: React.MouseEvent) => {
    const tooltipText = e.currentTarget.querySelector("span");
    if (tooltipText) {
      tooltipText.style.visibility = "visible";
    }
  };

  const handleMouseLeave = (e: React.MouseEvent) => {
    const tooltipText = e.currentTarget.querySelector("span");
    if (tooltipText) {
      tooltipText.style.visibility = "hidden";
    }
  };

  const styles: React.CSSProperties = {
    ...tooltipTextStyle,
    ...extraStyles,
  };

  return (
    <div
      style={tooltipStyle}
      onMouseOver={handleMouseOver}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      <span style={styles}>{message}</span>
    </div>
  );
};

export default ToolTip;
