import React, { useEffect, useState } from "react";
import { FaSyncAlt } from "react-icons/fa";
import ToggleButton from "react-toggle-button";
import { useGitHubSync } from "../../../hooks/useGitHubSync";

const rowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
};

const labelStyle: React.CSSProperties = {
  color: "#ffffff",
  fontWeight: 500,
};

const connectButtonStyle: React.CSSProperties = {
  fontWeight: 700,
  fontSize: 15,
  border: 0,
  borderRadius: 8,
  padding: "12px 32px",
  background: "linear-gradient(90deg,#2f82e4,#4559f9)",
  color: "#ffffff",
  cursor: "pointer",
  boxShadow: "0 2.5px 8px rgba(83,99,190,0.05)",
  transition: "background .14s, color .14s, box-shadow .13s",
};

const syncSettingsDivStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  width: 180,
  marginTop: -15,
};

const connectedStyle: React.CSSProperties = {
  color: "#ffffff",
};

const lastSyncStyle: React.CSSProperties = {
  marginTop: -6,
  color: "#ffffff",
  fontWeight: 600,
};

const lastSyncdivStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 6,
  marginTop: 15,
};

const optionsDivStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 12,
};

const buttonDivStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 12,
  marginTop: 15,
};

const syncStatusStyle: React.CSSProperties = {
  color: "#ffffff",
  fontWeight: 600,
};

const syncingStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 6,
};

const syncAnimation: React.CSSProperties = {
  animation: "spin 1s linear infinite",
};

const SyncSettings: React.FC<{
  onTokenReset: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ onTokenReset }) => {
  const {
    githubSyncSettings,
    status,
    updateSyncSettings,
    resetToken,
    syncNow,
  } = useGitHubSync();
  const [localAutoSync, setLocalAutoSync] = useState(
    githubSyncSettings.autoSync,
  );
  const [localPublicGist, setLocalPublicGist] = useState(
    githubSyncSettings.publicGist,
  );

  const [displayLastSync, setDisplayLastSync] = useState("Never");

  const setAutoSync = (value: boolean) => {
    setLocalAutoSync(!value);
    updateSyncSettings({
      autoSync: !value,
    });
  };

  const setPublicGist = (value: boolean) => {
    setLocalPublicGist(!value);
    updateSyncSettings({
      publicGist: !value,
    });
  };

  const handleResetToken = () => {
    void resetToken();
    onTokenReset(false);
  };

  useEffect(() => {
    const formatLastSync = () => {
      if (!githubSyncSettings.lastSync) return "Never";
      const d = new Date(githubSyncSettings.lastSync);
      const weekday = d.toLocaleString(undefined, { weekday: "long" });
      const time = d.toLocaleString(undefined, {
        hour: "numeric",
        minute: "2-digit",
        hour12: false,
      });
      return `${weekday} ${time}`;
    };

    setDisplayLastSync(formatLastSync());

    const intervalId = setInterval(() => {
      setDisplayLastSync(formatLastSync());
    }, 60000);

    return () => clearInterval(intervalId);
  }, [githubSyncSettings.lastSync]);

  return (
    <div style={syncSettingsDivStyle}>
      <h3 style={connectedStyle}>Connected</h3>

      <div style={optionsDivStyle}>
        <div style={rowStyle}>
          <label style={labelStyle}>Auto Sync</label>
          <ToggleButton value={localAutoSync} onToggle={setAutoSync} />
        </div>

        <div style={rowStyle}>
          <label style={labelStyle}>Public Gist</label>
          <ToggleButton value={localPublicGist} onToggle={setPublicGist} />
        </div>
      </div>

      <div style={lastSyncdivStyle}>
        <span style={lastSyncStyle}>Last Synced</span>
        <span style={syncStatusStyle}>{displayLastSync}</span>
      </div>

      <div style={buttonDivStyle}>
        <button
          style={connectButtonStyle}
          onClick={() => void syncNow()}
          disabled={status === "syncing"}
        >
          {status === "syncing" ? (
            <span style={syncingStyle}>
              Syncing...
              <FaSyncAlt style={syncAnimation} />
            </span>
          ) : (
            "Sync Now"
          )}
        </button>
        <button style={connectButtonStyle} onClick={handleResetToken}>
          Reset Token
        </button>
      </div>

      {status === "success" && <p style={syncStatusStyle}>Sync successful!</p>}
      {status === "error" && <p style={syncStatusStyle}>Sync failed.</p>}
    </div>
  );
};

export default SyncSettings;
