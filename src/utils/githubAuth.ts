// import { DeviceFlowResponse, TokenResponse } from "./types";

// const CLIENT_ID = "Iv23li5frjjDBAV3DfuR";

// export async function startDeviceFlow(): Promise<DeviceFlowResponse> {
//     const resp = await fetch("https://github.com/login/device/code", {
//         method: "POST",
//         headers: { "Content-Type": "application/x-www-form-urlencoded" },
//         body: `client_id=${CLIENT_ID}&scope=gist`,
//     });

//     if (!resp.ok) {
//         throw new Error("GitHub Device Flow initiation failed");
//     }

//     // Typed parse of JSON prevents ESLint errors
//     const data: DeviceFlowResponse = await resp.json();

//     return data;
// }

// // Poll GitHub for the access token using device_code
// export async function pollForToken(
//     device_code: string,
//     interval: number,
//     expires_in: number
// ): Promise<string> {
//     const maxTries = Math.ceil(expires_in / interval);
//     let tries = 0;

//     while (tries < maxTries) {
//         await new Promise((res) => setTimeout(res, interval * 1000));

//         const resp = await fetch("https://github.com/login/oauth/access_token", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/x-www-form-urlencoded",
//                 Accept: "application/json",
//             },
//             body: `client_id=${CLIENT_ID}&device_code=${device_code}&grant_type=urn:ietf:params:oauth:grant-type:device_code`,
//         });

//         // Typed parse ensures safe member access
//         const data: TokenResponse = await resp.json();

//         if (data.access_token) {
//             return data.access_token;
//         }

//         if (data.error === "authorization_pending") {
//             tries++;
//             continue;
//         }

//         if (data.error === "slow_down") {
//             interval += 5;
//             tries++;
//             continue;
//         }

//         throw new Error(data.error_description || "Failed to authenticate.");
//     }

//     throw new Error("Timed out waiting for user authorization.");
// }
export {};
