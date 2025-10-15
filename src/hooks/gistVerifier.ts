import { useState } from 'react';
import {
    GithubAPIResponse,
    GithubUnAuthorizedResponse,
    Settings,
} from '../utils/types';
import { findGist } from '../utils/github';
import { isAPIResponse } from '../utils/utils';

export enum VerifyErrors {
    INVALID_GIST_ID = 'Invalid Gist ID or not accessible',
    TOKEN_EXPIRED = 'Token Expired',
    SETTINGS_FILE_EMPTY = 'Settings file is empty',
    UNEXPECTED_ERROR = 'Unexpected error while verifying Gist',
}

export const useGistVerifier = () => {
    const [verifying, setVerifying] = useState(false);
    const [valid, setValid] = useState<null | boolean>(null);
    const [error, setError] = useState<string | null>(null);
    const [pulledSettings, setData] = useState<null | Settings>(null);

    const verifyGistId = async (gistId: string) => {
        if (!gistId.trim()) {
            setValid(null);
            setError(null);
            return;
        }

        setVerifying(true);
        setValid(null);
        setError(null);

        try {
            const response: GithubAPIResponse | GithubUnAuthorizedResponse =
                await findGist(gistId);

            if (!response) {
                setValid(false);
                setError(VerifyErrors.INVALID_GIST_ID);
                return;
            }
            if (!isAPIResponse(response)) {
                setValid(false);
                setError(VerifyErrors.TOKEN_EXPIRED);
                return;
            }

            if (!response.settings) {
                setValid(false);
                setError(VerifyErrors.SETTINGS_FILE_EMPTY);
                return;
            }
            setValid(true);
            setError(null);
            setData(response.settings);
            return;
        } catch (err) {
            // eslint-disable-next-line no-undef
            console.error('Error verifying gist:', err);
            setValid(false);
            setError(VerifyErrors.UNEXPECTED_ERROR);
        } finally {
            setVerifying(false);
        }
    };

    return { verifyGistId, verifying, valid, error, pulledSettings };
};
