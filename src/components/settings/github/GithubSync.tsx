const GitHubSync: React.FC = () => {
  return (
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
  );
};

export default GitHubSync;
