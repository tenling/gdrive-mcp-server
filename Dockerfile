FROM node:20-slim

WORKDIR /app

# Copy package files and TypeScript configuration
COPY package*.json tsconfig.json ./

# Copy source files and type definitions needed for build
COPY index.ts ./
COPY types/ ./types/

# Install all dependencies (including dev) and build
RUN npm ci && \
    npm run build

# Clean install only production dependencies
# Use --ignore-scripts to skip the prepare script
RUN rm -rf node_modules && \
    npm ci --only=production --ignore-scripts

# Copy remaining files
COPY . .

# Set environment variables for credentials
ENV GOOGLE_APPLICATION_CREDENTIALS=/app/credentials/.gdrive-server-credentials.json
ENV MCP_GDRIVE_CREDENTIALS=/app/credentials/gcp-oauth.keys.json

# Expose any necessary ports (if needed)
EXPOSE 3000

# Start the server
CMD ["node", "dist/index.js"] 