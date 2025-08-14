/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

/// <reference types="chrome"/>
import type { Runtime } from "webextension-polyfill";
import { isFirefox } from "./utils/browserApi";
import {
  GithubResponses,
  MessageData,
  GithubDeviceCodeResponse,
  GithubTokenResponse,
  GithubAPIResponse,
} from "./utils/types";
import { getToken } from "./utils/github";

const ext = isFirefox() ? browser : chrome;

const CLIENT_ID = "Iv23li5frjjDBAV3DfuR";

const DeviceBaseFlowURL = "https://github.com/login/";
const GistBaseURL = "https://api.github.com/gists/";

ext.runtime.onMessage.addListener(
  (
    message: MessageData,
    _sender: Runtime.MessageSender,
    sendResponse: (response: GithubResponses) => void,
  ): boolean | void => {
    if (message.type === "GITHUB_DEVICE_FLOW") {
      void (async () => {
        try {
          if (message.action === "startDeviceFlow") {
            // Step 1: Get device/user code
            const resp = await fetch(`${DeviceBaseFlowURL}device/code`, {
              method: "POST",
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Accept: "application/json",
              },
              body: `client_id=${encodeURIComponent(CLIENT_ID)}&scope=gist`,
            });

            if (!resp.ok) {
              throw new Error(`HTTP error! status: ${resp.status}`);
            }

            const data: GithubDeviceCodeResponse = await resp.json();
            sendResponse({ success: true, data });
          } else if (message.action === "getToken") {
            // Step 2: Poll for access token
            const resp = await fetch(
              `${DeviceBaseFlowURL}/oauth/access_token`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/x-www-form-urlencoded",
                  Accept: "application/json",
                },
                body: `client_id=${encodeURIComponent(
                  CLIENT_ID,
                )}&device_code=${encodeURIComponent(
                  message.device_code,
                )}&grant_type=urn:ietf:params:oauth:grant-type:device_code`,
              },
            );

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
    if (message.type === "GITHUB_GIST_API") {
      (async () => {
        const token = await getToken();
        console.log("token", token);
        const { action, gistId, payload } = message;
        const headers = {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github+json",
        };

        if (action === "findGist") {
          const resp = await fetch(`${GistBaseURL}${gistId}`, { headers });
          if (!resp.ok) throw new Error("Failed to fetch gist");
          const response = await resp.json();
          const data: GithubAPIResponse = {
            id: response.id,
            url: response.url,
            public: response.public,
            files: response.files,
          };
          sendResponse({ success: true, data: data || null });
        }
        // POST/UPDATE: Update (PATCH) or create gist
        else if (action === "createOrUpdateLooiGist") {
          console.log("payload", payload);
          let url: string, method: string;
          let body: any;

          const desc = "Settings for looi extension";

          if (gistId) {
            url = `${GistBaseURL}${gistId}`;
            method = "PATCH";
            body = {
              description: desc,
              files: payload?.files, // { filename: {content: "..."} }
              public: payload?.publicGist,
            };
          } else {
            url = `${GistBaseURL}`;
            method = "POST";
            body = {
              description: desc,
              files: payload?.files,
              public: payload?.publicGist,
            };
          }
          const resp = await fetch(url, {
            method,
            headers: { ...headers, "Content-Type": "application/json" },
            body: JSON.stringify(body),
          });
          const response = await resp.json();
          console.log("response", response);
          const data: GithubAPIResponse = {
            id: response.id,
            url: response.url,
            public: response.public,
            files: response.files,
          };
          sendResponse({ success: resp.ok, data });
        }
      })().catch((err) =>
        sendResponse({
          success: false,
          error: err instanceof Error ? err.message : String(err),
        }),
      );
      return true;
    }
    return undefined;
  },
);
