import { authenticate } from '@google-cloud/local-auth';
import { google } from 'googleapis';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function testOAuth() {
    try {
        // Path to your credentials file
        const keyPath = path.join(__dirname, 'credentials', 'gcp-oauth.keys.json');

        // Scopes required for Google Drive
        const SCOPES = ['https://www.googleapis.com/auth/drive.readonly'];

        // Authenticate
        console.log('Starting authentication...');
        const auth = await authenticate({
            keyfilePath: keyPath,
            scopes: SCOPES,
        });

        console.log('Authentication successful!');

        // Test the credentials by listing a few files
        const drive = google.drive({ version: 'v3', auth });
        const response = await drive.files.list({
            pageSize: 3,
            fields: 'files(id, name)',
        });

        console.log('Successfully retrieved files:');
        console.log(response.data.files);

    } catch (error) {
        console.error('Error occurred:', error.message);
        if (error.stack) console.error(error.stack);
    }
}

testOAuth(); 