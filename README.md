# Google Drive MCP Server

A powerful Model Context Protocol (MCP) server that provides seamless integration with Google Drive, allowing AI models to search, list, and read files from Google Drive.

## 🚀 Features

### Tools

#### 1. `gdrive_search`
Search for files in your Google Drive with powerful full-text search capabilities.
- **Input**: 
  ```json
  {
    "query": "string (your search query)"
  }
  ```
- **Output**: List of files with:
  - File name
  - MIME type
  - File ID
  - Last modified time
  - File size

#### 2. `gdrive_read_file`
Read file contents directly using a Google Drive file ID.
- **Input**:
  ```json
  {
    "file_id": "string (Google Drive file ID)"
  }
  ```
- **Output**: File contents with appropriate format conversion

### Automatic File Format Handling

The server intelligently handles different Google Workspace file types:
- 📝 Google Docs → Markdown
- 📊 Google Sheets → CSV
- 📊 Google Presentations → Plain text
- 🎨 Google Drawings → PNG
- 📄 Text/JSON files → UTF-8 text
- 📦 Other files → Base64 encoded

## 🛠️ Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- A Google Cloud Project
- A Google Workspace or personal Google account
- Docker (optional, for containerized deployment)

### Detailed Google Cloud Setup

1. **Create a Google Cloud Project**
   - Visit the [Google Cloud Console](https://console.cloud.google.com/projectcreate)
   - Click "New Project"
   - Enter a project name
   - Click "Create"
   - Wait for the project to be created and select it

2. **Enable the Google Drive API**
   - Go to the [API Library](https://console.cloud.google.com/apis/library)
   - Search for "Google Drive API"
   - Click on "Google Drive API"
   - Click "Enable"
   - Wait for the API to be enabled

3. **Configure OAuth Consent Screen**
   - Navigate to [OAuth consent screen](https://console.cloud.google.com/apis/credentials/consent)
   - Select User Type:
     - "Internal" if you're using Google Workspace
     - "External" for personal Google accounts
   - Click "Create"
   - Fill in the required fields:
     - App name: "MCP GDrive Server"
     - User support email: your email
     - Developer contact email: your email
   - Click "Save and Continue"
   - On the "Scopes" page:
     - Click "Add or Remove Scopes"
     - Add `https://www.googleapis.com/auth/drive.readonly`
     - Click "Update"
   - Click "Save and Continue"
   - Review the summary and click "Back to Dashboard"

4. **Create OAuth Client ID**
   - Go to [Credentials](https://console.cloud.google.com/apis/credentials)
   - Click "Create Credentials" at the top
   - Select "OAuth client ID"
   - Choose Application type: "Desktop application" (Important: Use Desktop app type)
   - Name: "MCP GDrive Server Desktop Client"
   - Click "Create"
   - Download the JSON file
   - Save as `credentials/gcp-oauth.keys.json`

### Installation

```bash
# Clone the repository
git clone https://github.com/felores/gdrive-mcp-server.git
cd gdrive-mcp-server

# Install dependencies
npm install

# Build the project
npm run build
```

### Authentication

1. Create a credentials directory and place your OAuth keys:
   ```bash
   mkdir -p credentials
   # Move your downloaded OAuth JSON file to:
   # credentials/gcp-oauth.keys.json
   ```

2. Run the authentication command:
   ```bash
   node dist/index.js auth
   ```

3. Complete the OAuth flow in your browser
4. Credentials will be saved in `credentials/.gdrive-server-credentials.json`

## 🔧 Usage

### Local Usage

```bash
# Start the server
node dist/index.js
```

### Docker Usage

1. Build the Docker image:
```bash
docker build -t gdrive-mcp-server .
```

2. Run the container:
```bash
docker run --rm -i \
  -v "$(pwd)/credentials:/app/credentials:ro" \
  -e GOOGLE_APPLICATION_CREDENTIALS=/app/credentials/.gdrive-server-credentials.json \
  -e MCP_GDRIVE_CREDENTIALS=/app/credentials/gcp-oauth.keys.json \
  gdrive-mcp-server
```

### MCP Client Configuration

Add this configuration to your MCP client settings:

```json
{
  "mcpServers": {
    "gdrive": {
      "command": "docker",
      "args": [
        "run",
        "--rm",
        "-i",
        "-v",
        "${workspaceFolder}/credentials:/app/credentials:ro",
        "-e",
        "GOOGLE_APPLICATION_CREDENTIALS=/app/credentials/.gdrive-server-credentials.json",
        "-e",
        "MCP_GDRIVE_CREDENTIALS=/app/credentials/gcp-oauth.keys.json",
        "gdrive-mcp-server"
      ]
    }
  }
}
```

For local (non-Docker) deployment:
```json
{
  "mcpServers": {
    "gdrive": {
      "command": "node",
      "args": ["path/to/gdrive-mcp-server/dist/index.js"],
      "env": {
        "GOOGLE_APPLICATION_CREDENTIALS": "path/to/gdrive-mcp-server/credentials/.gdrive-server-credentials.json",
        "MCP_GDRIVE_CREDENTIALS": "path/to/gdrive-mcp-server/credentials/gcp-oauth.keys.json"
      }
    }
  }
}
```

## 🔒 Security Considerations

- The server has read-only access to Google Drive
- Credentials are stored in the `credentials` directory
- OAuth credentials and tokens are excluded from version control
- Use Docker volume mounts with `:ro` (read-only) flag for credentials
- Consider using a dedicated Google account with limited access
- Review and revoke OAuth access if needed

## 🔍 Troubleshooting

1. **"No server info found" Error**
   - Verify Docker is running
   - Check if credentials files exist and are mounted correctly
   - Ensure proper file permissions

2. **Authentication Issues**
   - Verify OAuth credentials are for a Desktop application type
   - Re-run authentication with `node dist/index.js auth`
   - Check environment variables are set correctly

3. **File Access Issues**
   - Verify Google Drive API is enabled
   - Check file permissions in Google Drive
   - Ensure OAuth scope includes drive.readonly

## 📝 License

This MCP server is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 📚 Additional Resources

- [Google Drive API Documentation](https://developers.google.com/drive/api/v3/reference)
- [OAuth 2.0 for Desktop Apps](https://developers.google.com/identity/protocols/oauth2/native-app)
- [Model Context Protocol Documentation](https://modelcontextprotocol.io)
