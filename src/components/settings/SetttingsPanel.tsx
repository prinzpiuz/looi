import { useEffect, useRef, useState } from "react";
import { FaPalette, FaGithub, FaListUl } from "react-icons/fa";
import ColorPanel from "./background/ColorPicker";
import BgImageURL from "./background/BgImageInput";
import FoldableSection from "./FoldableSection";
import SettingsIcon from "./SettingsIcon";
import CloseSettingsIcon from "./CloseSettings";
import AddWidget from "./widgets/AddWidgets";

const settingsHeaderStyle: React.CSSProperties = {
  color: "#e9eafe",
  margin: "0 28px 18px",
  letterSpacing: 0.3,
  fontWeight: 700,
  alignItems: "center",
  padding: "0 40px",
};

const SettingsPanel: React.FC = () => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const sectionIconColor = "#ffffff";
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSettingsOpen(false);
      }
    };
    const handleClickOutside = (e: MouseEvent) => {
      if (
        settingsOpen &&
        panelRef.current &&
        !panelRef.current.contains(e.target as Node)
      ) {
        setSettingsOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [settingsOpen]);

  const panelStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    right: 0,
    height: "100%",
    width: "300px",
    backdropFilter: "blur(12px)",
    transform: settingsOpen ? "translateX(0)" : "translateX(104%)",
    transition: "transform 0.33s cubic-bezier(.4,0,.2,1)",
    zIndex: 999,
    overflowY: "auto",
    padding: "28px 0 28px 0",
    scrollbarWidth: "thin",
  };

  return (
    <>
      <SettingsIcon openSettingsPanel={setSettingsOpen} />

      <div ref={panelRef} style={panelStyle} tabIndex={-1}>
        <CloseSettingsIcon openSettingsPanel={setSettingsOpen} />
        <h2 style={settingsHeaderStyle}>Settings</h2>

        <FoldableSection
          icon={<FaPalette color={sectionIconColor} />}
          title="Background"
          defaultOpen
        >
          <ColorPanel />
          <BgImageURL />
        </FoldableSection>

        <FoldableSection
          icon={<FaListUl color={sectionIconColor} />}
          title="Widgets"
        >
          <AddWidget />
        </FoldableSection>

        <FoldableSection
          icon={<FaGithub color={sectionIconColor} />}
          title="GitHub Sync"
        >
          {/* Provide switches/inputs for GitHub sync, tokens, etc. */}
          <div style={{ color: "#b5b9c9", fontWeight: 500 }}>
            <label style={{ display: "block", marginBottom: 12 }}>
              GitHub Access Token:
              <input
                type="password"
                style={{
                  display: "block",
                  marginTop: 3,
                  background: "#232845",
                  color: "#f1eefa",
                  border: "1px solid #383e64",
                  borderRadius: 6,
                  padding: "7px 8px",
                  width: "100%",
                  fontSize: 14,
                  outline: "none",
                }}
              />
            </label>
            <button
              style={{
                background: "linear-gradient(90deg,#159d75,#21eabb)",
                border: 0,
                color: "#181828",
                padding: "7px 18px",
                borderRadius: 5,
                fontWeight: 600,
                cursor: "pointer",
                fontSize: 14,
              }}
            >
              Sync Now
            </button>
          </div>
        </FoldableSection>
      </div>
    </>
  );
};

export default SettingsPanel;
