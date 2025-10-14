"use strict";
(() => {
  // src/utils/utils.ts
  var settingsToJSONString = (settings) => {
    return JSON.stringify(settings, null, 2);
  };

  // src/background_workers/background.chrome.ts
  var CLIENT_ID = "Iv23li5frjjDBAV3DfuR";
  var DeviceBaseFlowURL = "https://github.com/login/";
  var GistBaseURL = "https://api.github.com/gists";
  var getToken = async () => {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get("github_token", (stored) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
          return;
        }
        resolve(stored?.github_token ?? "");
      });
    });
  };
  chrome.runtime.onMessage.addListener(
    (message, _sender, sendResponse) => {
      if (message.type === "GITHUB_DEVICE_FLOW") {
        void (async () => {
          try {
            if (message.action === "startDeviceFlow") {
              const resp = await fetch(`${DeviceBaseFlowURL}device/code`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/x-www-form-urlencoded",
                  Accept: "application/json"
                },
                body: `client_id=${encodeURIComponent(CLIENT_ID)}&scope=gist`
              });
              if (!resp.ok) {
                throw new Error(`HTTP error! status: ${resp.status}`);
              }
              const data = await resp.json();
              sendResponse({ success: true, data });
            } else if (message.action === "getToken") {
              const resp = await fetch(`${DeviceBaseFlowURL}/oauth/access_token`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/x-www-form-urlencoded",
                  Accept: "application/json"
                },
                body: `client_id=${encodeURIComponent(CLIENT_ID)}&device_code=${encodeURIComponent(
                  message.device_code
                )}&grant_type=urn:ietf:params:oauth:grant-type:device_code`
              });
              if (!resp.ok) {
                throw new Error(`HTTP error! status: ${resp.status}`);
              }
              const data = await resp.json();
              sendResponse({ success: true, data });
            }
          } catch (error) {
            sendResponse({
              success: false,
              error: error instanceof Error ? error.message : String(error)
            });
          }
        })();
        return true;
      }
      if (message.type === "GITHUB_GIST_API") {
        (async () => {
          const token = await getToken();
          const { action, gistId, payload } = message;
          const apiUrl = gistId ? `${GistBaseURL}/${gistId}` : GistBaseURL;
          const headers = {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github+json",
            "Content-Type": "application/json"
          };
          if (action === "findGist") {
            const resp = await fetch(apiUrl, {
              headers
            });
            if (resp.status === 401) {
              const data2 = {
                statusCode: resp.status,
                ok: resp.ok
              };
              sendResponse({ success: true, data: data2 || null });
            }
            if (!resp.ok) throw new Error("Failed to fetch gist");
            const response = await resp.json();
            const content = response.files["settings.json"].content;
            const settings = JSON.parse(content);
            settings.githubSync.gistId = response.id;
            const data = {
              gistId: response.id,
              url: response.url,
              public: response.public,
              settings
            };
            sendResponse({ success: true, data: data || null });
          } else if (action === "createOrUpdateLooiGist") {
            const body = {
              description: "Settings for looi extension",
              public: payload?.githubSync.publicGist,
              files: {
                "settings.json": {
                  content: payload ? settingsToJSONString(payload) : ""
                }
              }
            };
            const resp = await fetch(apiUrl, {
              method: gistId ? "PATCH" : "POST",
              headers,
              body: JSON.stringify(body)
            });
            if (resp.status === 401) {
              const data2 = {
                statusCode: resp.status,
                ok: resp.ok
              };
              sendResponse({ success: true, data: data2 || null });
            }
            if (!resp.ok) {
              throw new Error(`GitHub API error: ${resp.status} ${resp.statusText}`);
            }
            const response = await resp.json();
            const content = response.files["settings.json"].content;
            const settings = JSON.parse(content);
            settings.githubSync.gistId = response.id;
            const data = {
              gistId: response.id,
              url: response.url,
              public: response.public,
              settings
            };
            sendResponse({ success: resp.ok, data });
          }
        })().catch((err) => {
          sendResponse({
            success: false,
            error: err instanceof Error ? err.message : String(err)
          });
        });
        return true;
      }
      return void 0;
    }
  );
})();
//# sourceMappingURL=background.chrome.js.map
