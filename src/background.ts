/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

/// <reference types="chrome"/>
import type { Runtime } from "webextension-polyfill";
import { isFirefox } from "./utils/browserApi";
import {
  GithubDeviceFlowResponse,
  MessageData,
  GithubDeviceCodeResponse,
  GithubTokenResponse,
} from "./utils/types";

const ext = isFirefox() ? browser : chrome;

const CLIENT_ID = "Iv23li5frjjDBAV3DfuR";

ext.runtime.onMessage.addListener(
  (
    message: MessageData,
    _sender: Runtime.MessageSender,
    sendResponse: (response: GithubDeviceFlowResponse) => void,
  ): boolean | void => {
    if (message.type === "GITHUB_DEVICE_FLOW") {
      void (async () => {
        try {
          if (message.action === "start") {
            // Step 1: Get device/user code
            const resp = await fetch("https://github.com/login/device/code", {
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
          } else if (message.action === "token") {
            // Step 2: Poll for access token
            const resp = await fetch(
              "https://github.com/login/oauth/access_token",
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
    return undefined;
  },
);
