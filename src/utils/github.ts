import {
    GithubDeviceCodeResponse,
    GithubTokenResponse,
    MessageData,
    BackgroundResponse,
    GithubAPIResponse,
    Settings,
    GithubUnAuthorizedResponse,
} from './types';

import { ext } from './browserApi';

export const startDeviceFlow = (
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setError: React.Dispatch<React.SetStateAction<string | null>>,
    setDeviceData: React.Dispatch<
        React.SetStateAction<GithubDeviceCodeResponse | undefined>
    >,
    setdataReceived: React.Dispatch<React.SetStateAction<boolean>>,
    setStarted: React.Dispatch<React.SetStateAction<boolean>>,
): Promise<GithubDeviceCodeResponse> => {
    return new Promise((resolve, reject) => {
        setLoading(false);
        const message: MessageData = {
            type: 'GITHUB_DEVICE_FLOW',
            action: 'startDeviceFlow',
        };
        ext?.runtime.sendMessage(
            message,
            (
                response:
                    | BackgroundResponse<GithubDeviceCodeResponse>
                    | undefined,
            ) => {
                if (ext?.runtime.lastError) {
                    reject(new Error(ext.runtime.lastError.message));
                    return;
                }

                if (response?.success && response.data) {
                    setDeviceData(response.data);
                    setdataReceived(true);
                    setStarted(true);
                    resolve(response.data);
                } else {
                    setError(
                        response?.error ||
                            'Failed to start GitHub Device Flow.',
                    );
                    reject(
                        new Error(
                            response?.error ?? 'Unknown background error',
                        ),
                    );
                }
            },
        );
    });
};

export const pollForToken = (
    device_code: string,
    tries: number,
    interval: number,
    intervalId: NodeJS.Timeout | null = null,
    setPolling: React.Dispatch<React.SetStateAction<boolean>>,
    setError: React.Dispatch<React.SetStateAction<string | null>>,
    setSuccess: React.Dispatch<React.SetStateAction<boolean>>,
    setdataReceived: React.Dispatch<React.SetStateAction<boolean>>,
    onToken: (token: string) => void,
    pollToken: () => void,
) => {
    const message: MessageData = {
        type: 'GITHUB_DEVICE_FLOW',
        action: 'getToken',
        device_code: device_code,
    };
    ext?.runtime.sendMessage(
        message,
        (response: BackgroundResponse<GithubTokenResponse> | undefined) => {
            if (response?.success && response.data) {
                const data = response.data;
                if (data.access_token) {
                    setPolling(false);
                    setSuccess(true);
                    setdataReceived(false);
                    onToken(data.access_token);
                    return;
                } else if (data.error === 'authorization_pending') {
                    tries++;
                    // Try again after interval
                    if (intervalId) clearTimeout(intervalId);
                    intervalId = setTimeout(pollToken, interval * 1000);
                } else if (data.error === 'slow_down') {
                    interval += 5;
                    tries++;
                    if (intervalId) clearTimeout(intervalId);
                    intervalId = setTimeout(pollToken, interval * 1000);
                } else {
                    setPolling(false);
                    setError(data.error_description ?? 'Authorization error');
                }
            } else {
                setPolling(false);
                setError(response?.error || 'Failed to poll token');
            }
        },
    );
};

export const findGist = (
    gistId: string,
): Promise<GithubAPIResponse | GithubUnAuthorizedResponse> => {
    return new Promise((resolve, reject) => {
        const message: MessageData = {
            type: 'GITHUB_GIST_API',
            action: 'findGist',
            gistId,
        };
        ext?.runtime.sendMessage(
            message,
            (
                response:
                    | BackgroundResponse<
                          GithubAPIResponse | GithubUnAuthorizedResponse
                      >
                    | undefined,
            ) => {
                if (ext?.runtime.lastError) {
                    reject(new Error(ext.runtime.lastError.message));
                    return;
                }
                if (response?.success && response.data) {
                    resolve(response.data);
                } else {
                    reject(
                        new Error(
                            response?.error ?? 'Unknown background error',
                        ),
                    );
                }
            },
        );
    });
};

export const createOrUpdateLooiGist = (
    gistId: string | undefined,
    payload: Settings,
): Promise<GithubAPIResponse | GithubUnAuthorizedResponse> => {
    return new Promise((resolve, reject) => {
        const message: MessageData = {
            type: 'GITHUB_GIST_API',
            action: 'createOrUpdateLooiGist',
            gistId,
            payload,
        };
        ext?.runtime.sendMessage(
            message,
            (
                response:
                    | BackgroundResponse<
                          GithubAPIResponse | GithubUnAuthorizedResponse
                      >
                    | undefined,
            ) => {
                if (ext?.runtime.lastError) {
                    reject(new Error(ext.runtime.lastError.message));
                    return;
                }

                if (response?.success && response.data) {
                    resolve(response.data);
                } else {
                    reject(
                        new Error(
                            response?.error ?? 'Unknown background error',
                        ),
                    );
                }
            },
        );
    });
};

export const saveToken = (token: string) => {
    ext?.storage.local.set({ github_token: token });
};

export const getToken = async (): Promise<string> => {
    const stored = await ext?.storage.local.get('github_token');
    return stored?.github_token as Promise<string>;
};

export const removeToken = async () => {
    await ext?.storage.local.remove('github_token');
};
