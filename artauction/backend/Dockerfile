# backend/Dockerfile

# Use a minimal Alpine-based Node image to keep image size small
FROM node:20-alpine

# Maintainer label for image metadata
LABEL maintainer="langkilde"

# Set working directory inside the image; all subsequent commands run from here
WORKDIR /app

# Copy only package manifest(s) first to leverage Docker layer caching.
# This prevents reinstalling dependencies when only source files change.
COPY package.json package-lock.json ./
# Install production dependencies deterministically
RUN npm ci --production

# Copy application source into the image after installing deps so source
# changes do not invalidate the dependency layer.
COPY . .

# Default environment variables; can be overridden at runtime
ENV NODE_ENV=production
ENV PORT=8081

# Document which port the container listens on (does not publish it by itself)
EXPOSE 8081

# Optional lightweight healthcheck so orchestrators can verify the service is healthy.
# Adjust the endpoint/port to match your app's health route.
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget -qO- http://localhost:8081/healthz || exit 1

# Start the application. Replace with an npm script if preferred (e.g. ["npm","start"]).
CMD ["node", "server.js"]
