import React, { useCallback, useEffect, useState } from 'react';
import { startDeviceFlow, pollForToken } from '../../../utils/github';
import { GithubDeviceCodeResponse } from '../../../utils/types';

const deviceFlowDivStyle: React.CSSProperties = { padding: 18, maxWidth: 340 };
const errorDivStyle: React.CSSProperties = {
    color: '#ffffff',
    marginTop: 5,
    fontSize: 13,
};
const doneDivStyle: React.CSSProperties = {
    color: '#ffffff',
    marginTop: 5,
    paddingLeft: 15,
};
const codeBlockStyle: React.CSSProperties = {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: '0.12em',
    marginBottom: 12,
    userSelect: 'all',
    textAlign: 'center',
    backgroundColor: '#f7f7f7',
    padding: '12px 13px 16px',
    borderRadius: 8,
    border: '1px solid #ddd',
    height: 27,
    width: 158,
};
const connectButtonStyle: React.CSSProperties = {
    fontWeight: 700,
    fontSize: 15,
    border: 0,
    borderRadius: 8,
    padding: '12px 32px',
    background: 'linear-gradient(90deg,#2f82e4,#4559f9)',
    color: '#ffffff',
    cursor: 'pointer',
    boxShadow: '0 2.5px 8px rgba(83,99,190,0.05)',
    transition: 'background .14s, color .14s, box-shadow .13s',
};
const enterCodeButtonStyle: React.CSSProperties = {
    fontWeight: 700,
    fontSize: 15,
    border: 0,
    borderRadius: 8,
    padding: '12px 50px',
    background: 'linear-gradient(90deg,#2f82e4,#4559f9)',
    color: '#162242',
    cursor: 'pointer',
    boxShadow: '0 2.5px 8px rgba(83,99,190,0.05)',
    transition: 'background .14s, color .14s, box-shadow .13s',
    marginTop: 12,
};

const loadingSpinnerStyle: React.CSSProperties = {
    border: '3px solid #f3f3f3',
    borderTop: '3px solid #2a74ff',
    borderRadius: '50%',
    width: 24,
    height: 24,
    animation: 'spin 1s linear infinite',
    marginLeft: 8,
};

const infoDivStyle: React.CSSProperties = {
    color: '#ffffff',
    marginTop: 8,
    fontSize: 12,
};

const connectingStyle: React.CSSProperties = {
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    gap: 5,
    flexDirection: 'column',
};

const GithubDeviceFlow: React.FC<{
    onToken: (token: string) => void;
}> = ({ onToken }) => {
    const [started, setStarted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [deviceData, setDeviceData] = useState<GithubDeviceCodeResponse>();
    const [polling, setPolling] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [dataReceived, setdataReceived] = useState(false);

    const startAuth = useCallback(async () => {
        setLoading(true);
        setError(null);
        await startDeviceFlow(
            setLoading,
            setError,
            setDeviceData,
            setdataReceived,
            setStarted,
        );
    }, []);

    // Poll for token continuously
    useEffect(() => {
        if (!deviceData || success || error) return;

        let intervalId: NodeJS.Timeout | null = null;
        let tries = 0;
        const maxTries = Math.ceil(deviceData.expires_in / deviceData.interval);
        let interval = deviceData.interval;

        setPolling(true);
        const pollToken = () => {
            if (tries >= maxTries) {
                setError('Authorization timed out.');
                setPolling(false);
                return;
            }

            pollForToken(
                deviceData.device_code,
                tries,
                interval,
                intervalId,
                setPolling,
                setError,
                setSuccess,
                setdataReceived,
                onToken,
                pollToken,
            );
        };

        pollToken();

        return () => {
            if (intervalId) clearTimeout(intervalId);
            setPolling(false);
        };
    }, [deviceData, success, error, onToken]);

    return (
        <div style={deviceFlowDivStyle}>
            {loading || polling ? (
                <span style={connectingStyle}>
                    Connecting...
                    <span style={loadingSpinnerStyle} aria-hidden="true" />
                </span>
            ) : (
                !success && (
                    <button
                        style={connectButtonStyle}
                        onClick={() => {
                            if (!started) {
                                void startAuth();
                            }
                        }}
                        disabled={loading || polling}
                        aria-live="polite"
                        aria-busy={loading || polling}
                    >
                        Connect GitHub
                    </button>
                )
            )}

            {dataReceived && deviceData && (
                <div>
                    <p style={infoDivStyle}>
                        To authenticate with GitHub, click the button below and
                        enter your device code:
                    </p>
                    <p
                        style={codeBlockStyle}
                        tabIndex={0} // make code selectable/focusable
                    >
                        {deviceData.user_code}
                    </p>

                    <button
                        onClick={() =>
                            window.open(
                                deviceData.verification_uri,
                                '_blank',
                                'noopener,noreferrer',
                            )
                        }
                        style={enterCodeButtonStyle}
                    >
                        Enter Code
                    </button>
                </div>
            )}

            {success && (
                <p style={doneDivStyle} role="status" aria-live="polite">
                    GitHub Connected!
                </p>
            )}
            {error && !setdataReceived && (
                <p style={errorDivStyle} role="alert" aria-live="assertive">
                    {error}
                </p>
            )}
        </div>
    );
};

export default GithubDeviceFlow;
