import { useState } from 'react';
import { GithubAPIResponse } from '../utils/types';
import { findGist } from '../utils/github';

export function useGistVerifier() {
  const [verifying, setVerifying] = useState(false);
  const [valid, setValid] = useState<null | boolean>(null);
  const [error, setError] = useState<string | null>(null);

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
      const response: GithubAPIResponse = await findGist(gistId);

      if (!response) {
        setValid(false);
        setError('Invalid Gist ID or not accessible');
        return;
      }

      if (!response.settings) {
        setValid(false);
        setError('Settings file is empty');
        return;
      }

      setValid(true);
      setError(null);
      return;
    } catch (err) {
      // eslint-disable-next-line no-undef
      console.error('Error verifying gist:', err);
      setValid(false);
      setError('Unexpected error while verifying Gist');
    } finally {
      setVerifying(false);
    }
  };

  return { verifyGistId, verifying, valid, error };
}
