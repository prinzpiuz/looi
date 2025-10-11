/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

/// <reference types="chrome"/>
import type { Runtime } from 'webextension-polyfill';
import { isFirefox } from './utils/browserApi';
import {
  GithubResponses,
  MessageData,
  GithubDeviceCodeResponse,
  GithubTokenResponse,
  GithubAPIResponse,
  Settings,
  GistResponse,
} from './utils/types';
import { getToken } from './utils/github';
import { settingsToJSONString } from './utils/utils';

const ext = isFirefox() ? browser : chrome;

const CLIENT_ID = 'Iv23li5frjjDBAV3DfuR';

const DeviceBaseFlowURL = 'https://github.com/login/';
const GistBaseURL = 'https://api.github.com/gists';

ext.runtime.onMessage.addListener(
  (
    message: MessageData,
    _sender: Runtime.MessageSender,
    sendResponse: (response: GithubResponses) => void,
  ): boolean | void => {
    if (message.type === 'GITHUB_DEVICE_FLOW') {
      void (async () => {
        try {
          if (message.action === 'startDeviceFlow') {
            // Step 1: Get device/user code
            const resp = await fetch(`${DeviceBaseFlowURL}device/code`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Accept: 'application/json',
              },
              body: `client_id=${encodeURIComponent(CLIENT_ID)}&scope=gist`,
            });

            if (!resp.ok) {
              throw new Error(`HTTP error! status: ${resp.status}`);
            }

            const data: GithubDeviceCodeResponse = await resp.json();
            sendResponse({ success: true, data });
          } else if (message.action === 'getToken') {
            // Step 2: Poll for access token
            const resp = await fetch(`${DeviceBaseFlowURL}/oauth/access_token`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Accept: 'application/json',
              },
              body: `client_id=${encodeURIComponent(CLIENT_ID)}&device_code=${encodeURIComponent(
                message.device_code,
              )}&grant_type=urn:ietf:params:oauth:grant-type:device_code`,
            });

            if (!resp.ok) {
              throw new Error(`HTTP error! status: ${resp.status}`);
            }

            const data: GithubTokenResponse = await resp.json();
            sendResponse({ success: true, data });
          }
        } catch (error) {
          sendResponse({
            success: false,
            error: error instanceof Error ? error.message : String(error),
          });
        }
      })();

      // Required for async sendResponse
      return true;
    }
    if (message.type === 'GITHUB_GIST_API') {
      (async () => {
        const token = await getToken();
        const { action, gistId, payload } = message;
        const apiUrl = gistId ? `${GistBaseURL}/${gistId}` : GistBaseURL;
        const headers = {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github+json',
          'Content-Type': 'application/json',
        };

        if (action === 'findGist') {
          const resp = await fetch(apiUrl, {
            headers: headers,
          });
          if (!resp.ok) throw new Error('Failed to fetch gist');
          const response: GistResponse = await resp.json();
          const content = response.files['settings.json'].content as string;
          const settings = JSON.parse(content) as Settings;
          settings.githubSync.gistId = response.id;
          const data: GithubAPIResponse = {
            gistId: response.id,
            url: response.url,
            public: response.public,
            settings: settings,
          };
          sendResponse({ success: true, data: data || null });
        } else if (action === 'createOrUpdateLooiGist') {
          const body = {
            description: 'Settings for looi extension',
            public: payload.githubSync.publicGist,
            files: {
              'settings.json': {
                content: settingsToJSONString(payload),
              },
            },
          };
          const resp = await fetch(apiUrl, {
            method: gistId ? 'PATCH' : 'POST',
            headers: headers,
            body: JSON.stringify(body),
          });

          if (!resp.ok) {
            throw new Error(`GitHub API error: ${resp.status} ${resp.statusText}`);
          }

          const response: GistResponse = await resp.json();
          const content = response.files['settings.json'].content as string;
          const settings = JSON.parse(content) as Settings;
          settings.githubSync.gistId = response.id;
          const data: GithubAPIResponse = {
            gistId: response.id,
            url: response.url,
            public: response.public,
            settings: settings,
          };
          sendResponse({ success: resp.ok, data });
        }
      })().catch((err) => {
        sendResponse({
          success: false,
          error: err instanceof Error ? err.message : String(err),
        });
      });
      return true;
    }
    return undefined;
  },
);
