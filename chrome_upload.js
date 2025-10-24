import axios from 'axios';
import { createReadStream, existsSync, readFileSync, statSync } from 'fs';
import FormData from 'form-data';
import { JWT } from 'google-auth-library';
import path from 'path';

// Custom error classes for better error handling
class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ValidationError';
    }
}

class AuthenticationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'AuthenticationError';
    }
}

class UploadError extends Error {
    constructor(message) {
        super(message);
        this.name = 'UploadError';
    }
}

class PublishError extends Error {
    constructor(message) {
        super(message);
        this.name = 'PublishError';
    }
}

// Simple logger utility
const logger = {
    info: (message) =>
        console.log(`[INFO] ${new Date().toISOString()}: ${message}`),
    warn: (message) =>
        console.warn(`[WARN] ${new Date().toISOString()}: ${message}`),
    error: (message) =>
        console.error(`[ERROR] ${new Date().toISOString()}: ${message}`),
};

// Configuration object for better maintainability
const CONFIG = {
    SERVICE_ACCOUNT_KEY_JSON: process.env.GCP_SERVICE_ACCOUNT_JSON || null,
    SCOPES: ['https://www.googleapis.com/auth/chromewebstore'],
    CHROME_WEB_STORE_BASE_URL: 'https://chromewebstore.googleapis.com',
    UPLOAD_ENDPOINT:
        '/upload/v2/publishers/{publisherID}/items/{extensionId}:upload',
    PUBLISH_ENDPOINT:
        '/v2/publishers/{publisherID}/items/{extensionId}:publish',
    REQUEST_TIMEOUT: 60000, // 60 seconds
    MAX_FILE_SIZE: 20 * 1024 * 1024, // 20MB
    MAX_RETRIES: 3,
    INITIAL_RETRY_DELAY: 1000, // 1 second
    RETRY_MULTIPLIER: 2, // Exponential backoff
};

/**
 * Sleep utility for retry delays with exponential backoff.
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise<void>}
 */
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Validates command line arguments and file existence.
 * @returns {Object} Object containing extensionId, filePath, and publisherId
 * @throws {ValidationError} If validation fails
 */
function validateArguments() {
    const [, , extensionId, filePath, publisherId] = process.argv;

    if (!extensionId || !filePath || !publisherId) {
        throw new ValidationError(
            'Usage: node chrome_upload.js <extensionId> <filePath> <publisherId>',
        );
    }

    const resolvedFilePath = path.resolve(filePath);
    if (!existsSync(resolvedFilePath)) {
        throw new ValidationError(`File '${resolvedFilePath}' does not exist.`);
    }

    const stats = statSync(resolvedFilePath);
    if (stats.size > CONFIG.MAX_FILE_SIZE) {
        throw new ValidationError(
            `File size (${stats.size} bytes) exceeds maximum allowed size (${CONFIG.MAX_FILE_SIZE} bytes).`,
        );
    }

    if (!/^[a-z0-9]{32}$/.test(extensionId)) {
        throw new ValidationError(
            'Invalid extension ID format. Expected 32 alphanumeric characters.',
        );
    }

    if (!resolvedFilePath.toLowerCase().endsWith('.zip')) {
        throw new ValidationError('File must be a ZIP archive.');
    }

    return { extensionId, filePath: resolvedFilePath, publisherId };
}

/**
 * Authenticates using the service account and retrieves an access token.
 * @returns {Promise<string>} Access token
 * @throws {AuthenticationError} If authentication fails
 */
async function getAccessToken() {
    try {
        let credentials;

        if (CONFIG.SERVICE_ACCOUNT_KEY_JSON) {
            credentials = JSON.parse(CONFIG.SERVICE_ACCOUNT_KEY_JSON);
            logger.info(
                'Using service account JSON from environment variable.',
            );
        } else if (existsSync(CONFIG.SERVICE_ACCOUNT_KEY_PATH)) {
            credentials = JSON.parse(
                readFileSync(CONFIG.SERVICE_ACCOUNT_KEY_PATH, 'utf8'),
            );
            logger.info('Using service account JSON from file.');
        } else {
            throw new AuthenticationError(
                'No service account credentials found in environment or file.',
            );
        }

        if (!credentials.client_email || !credentials.private_key) {
            throw new AuthenticationError(
                'Invalid service account JSON: missing client_email or private_key',
            );
        }

        const client = new JWT({
            email: credentials.client_email,
            key: credentials.private_key,
            scopes: CONFIG.SCOPES,
        });

        const tokens = await client.authorize();
        logger.info('Successfully obtained access token.');
        return tokens.access_token;
    } catch (error) {
        if (error instanceof AuthenticationError) throw error;
        throw new AuthenticationError(
            `Failed to get access token: ${error.message}`,
        );
    }
}

/**
 * Uploads the extension to Chrome Web Store with retry logic and exponential backoff.
 * @param {string} accessToken - OAuth access token
 * @param {string} extensionId - Extension ID
 * @param {string} filePath - Path to the extension file
 * @param {string} publisherId - Publisher ID
 * @returns {Promise<Object>} Upload response data
 * @throws {UploadError} If upload fails after retries
 */
async function uploadExtension(
    accessToken,
    extensionId,
    filePath,
    publisherId,
) {
    let delay = CONFIG.INITIAL_RETRY_DELAY;

    for (let attempt = 1; attempt <= CONFIG.MAX_RETRIES; attempt++) {
        let fileStream;
        try {
            fileStream = createReadStream(filePath);
            const form = new FormData();
            form.append('file', fileStream, {
                filename: path.basename(filePath),
                contentType: 'application/zip',
            });

            const uploadUrl = `${CONFIG.CHROME_WEB_STORE_BASE_URL}${CONFIG.UPLOAD_ENDPOINT.replace('{extensionId}', extensionId).replace('{publisherID}', publisherId)}`;

            const response = await axios.post(uploadUrl, form, {
                headers: {
                    ...form.getHeaders(),
                    Authorization: `Bearer ${accessToken}`,
                },
                maxRedirects: 0,
                validateStatus: (_status) => true,
                timeout: CONFIG.REQUEST_TIMEOUT,
            });

            logger.info(
                `Upload attempt ${attempt} response status: ${response.status}`,
            );

            if (response.status === 200 || response.status === 201) {
                logger.info('Extension uploaded successfully.');
                return response.data;
            } else if (response.status >= 500 && attempt < CONFIG.MAX_RETRIES) {
                logger.warn(
                    `Upload failed with server error ${response.status}, retrying in ${delay}ms...`,
                );
                await sleep(delay);
                delay *= CONFIG.RETRY_MULTIPLIER;
                continue;
            } else {
                throw new UploadError(
                    `Upload failed with status ${response.status}: ${JSON.stringify(response.data)}`,
                );
            }
        } catch (error) {
            if (error.code === 'ECONNABORTED' && attempt < CONFIG.MAX_RETRIES) {
                logger.warn(
                    `Upload timed out on attempt ${attempt}, retrying in ${delay}ms...`,
                );
                await sleep(delay);
                delay *= CONFIG.RETRY_MULTIPLIER;
                continue;
            }
            if (error instanceof UploadError) throw error;
            throw new UploadError(`Upload failed: ${error.message}`);
        } finally {
            if (fileStream) {
                fileStream.destroy();
            }
        }
    }
    throw new UploadError('Upload failed after all retries');
}

/**
 * Publishes the extension to Chrome Web Store with retry logic and exponential backoff.
 * @param {string} accessToken - OAuth access token
 * @param {string} extensionId - Extension ID
 * @param {string} publisherId - Publisher ID
 * @returns {Promise<Object>} Publish response data
 * @throws {PublishError} If publish fails after retries
 */
async function publishExtension(accessToken, extensionId, publisherId) {
    let delay = CONFIG.INITIAL_RETRY_DELAY;

    for (let attempt = 1; attempt <= CONFIG.MAX_RETRIES; attempt++) {
        try {
            const publishUrl = `${CONFIG.CHROME_WEB_STORE_BASE_URL}${CONFIG.PUBLISH_ENDPOINT.replace('{extensionId}', extensionId).replace('{publisherID}', publisherId)}`;

            const response = await axios.post(
                publishUrl,
                { target: 'default' },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                    timeout: CONFIG.REQUEST_TIMEOUT,
                },
            );

            logger.info(
                `Publish attempt ${attempt} response status: ${response.status}`,
            );

            if (response.status === 200) {
                logger.info('Extension published successfully.');
                return response.data;
            } else if (response.status >= 500 && attempt < CONFIG.MAX_RETRIES) {
                logger.warn(
                    `Publish failed with server error ${response.status}, retrying in ${delay}ms...`,
                );
                await sleep(delay);
                delay *= CONFIG.RETRY_MULTIPLIER;
                continue;
            } else {
                throw new PublishError(
                    `Publish failed with status ${response.status}: ${JSON.stringify(response.data)}`,
                );
            }
        } catch (error) {
            if (error.code === 'ECONNABORTED' && attempt < CONFIG.MAX_RETRIES) {
                logger.warn(
                    `Publish timed out on attempt ${attempt}, retrying in ${delay}ms...`,
                );
                await sleep(delay);
                delay *= CONFIG.RETRY_MULTIPLIER;
                continue;
            }
            if (error instanceof PublishError) throw error;
            throw new PublishError(`Publish failed: ${error.message}`);
        }
    }
    throw new PublishError('Publish failed after all retries');
}

/**
 * Main execution function.
 */
async function main() {
    try {
        const { extensionId, filePath, publisherId } = validateArguments();

        logger.info('Starting Chrome extension upload process...');
        logger.info(`Extension ID: ${extensionId}`);
        logger.info(`Publisher ID: ${publisherId}`);
        logger.info(`File Path: ${filePath}`);

        const accessToken = await getAccessToken();

        await uploadExtension(accessToken, extensionId, filePath, publisherId);
        await publishExtension(accessToken, extensionId, publisherId);

        logger.info('Extension uploaded and published successfully!');
    } catch (error) {
        logger.error(`Error: ${error.message}`);
        process.exit(1);
    }
}

// Run the script if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    main();
}
