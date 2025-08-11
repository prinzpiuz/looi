import React, { useState } from "react";
import { FaGithub } from "react-icons/fa";
import GithubDeviceFlow from "./GithubDeviceFlow";
import GithubPATInput from "./GithubPATInput";

const githubSyncDivStyle: React.CSSProperties = { margin: "7px 0 27px" };
const syncReadyStyle: React.CSSProperties = {
  color: "green",
  fontWeight: 600,
  marginTop: 14,
};
const selectionDivStyle: React.CSSProperties = {
  display: "flex",
  borderBottom: "1px solid #ffffff",
  gap: 0,
  marginBottom: -10,
};

const GitHubSync: React.FC = () => {
  const [token, setToken] = useState<string | null>(null);
  const [authTab, setAuthTab] = useState<"device" | "pat">("device");

  const connectButtonStyle: React.CSSProperties = {
    flex: 1,
    background: authTab === "device" ? "#ffffff" : "none",
    border: "none",
    fontWeight: 700,
    fontSize: 15,
    padding: "12px 0",
    borderRadius: "8px 8px 0 0",
  };

  const authButtonStyle: React.CSSProperties = {
    flex: 1,
    background: authTab === "pat" ? "#ffffff" : "none",
    border: "none",
    fontWeight: 700,
    fontSize: 15,
    padding: "12px 0",
    borderRadius: "8px 8px 0 0",
  };

  return (
    <div style={githubSyncDivStyle}>
      <div style={selectionDivStyle}>
        <button style={connectButtonStyle} onClick={() => setAuthTab("device")}>
          <FaGithub /> Login
        </button>
        <button style={authButtonStyle} onClick={() => setAuthTab("pat")}>
          <FaGithub /> Token
        </button>
      </div>
      {authTab === "device" ? (
        <GithubDeviceFlow onToken={setToken} />
      ) : (
        <GithubPATInput onToken={setToken} />
      )}
      {token && <div style={syncReadyStyle}>Connected! Ready to sync.</div>}
    </div>
  );
};

export default GitHubSync;
