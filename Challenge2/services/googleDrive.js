const fs = require('fs');
const { google } = require('googleapis');
const apikey = require('../apikey.json'); // Path to your service account JSON key file

const SCOPE = ['https://www.googleapis.com/auth/drive']; // Scope for Google Drive API access

// Function to authorize and get the Google Drive API client
async function authorize() {
    const jwtClient = new google.auth.JWT(
        apikey.client_email,
        null,
        apikey.private_key,
        SCOPE
    );
    await jwtClient.authorize();
    return jwtClient;
}

// Function to upload a file to Google Drive

async function uploadFileToDrive(authClient, filePath, fileName) {
    const drive = google.drive({ version: 'v3', auth: authClient });
    const fileMetaData = {
        name: fileName,
        parents: ['1slRlt4mXQ3bN31CgUxOsHEMw4f9tyMdT'] // Replace with your folder ID
    };
    const media = {
        body: fs.createReadStream(filePath),
        mimeType: 'application/octet-stream'
    };
    return new Promise((resolve, reject) => {
        drive.files.create({
            resource: fileMetaData,
            media: media,
            fields: 'id'
        }, (err, file) => {
            if (err) {
                reject(err);
            } else {
                resolve(file.data);
            }
        });
    });
}

module.exports = {
    authorize,
    uploadFileToDrive,
};
