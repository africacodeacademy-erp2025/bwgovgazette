# syntax=docker.io/docker/dockerfile:1

FROM node:22-alpine AS base

# Builder stage
FROM base AS builder

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Copy source files
COPY src ./src
COPY tsconfig.json ./

# Build the application
RUN npm run build

# Production runner stage
FROM base AS runner

WORKDIR /app

# Install system dependencies required for canvas
RUN apk add --no-cache build-base python3 cairo-dev jpeg-dev pango-dev giflib-dev

# Install production dependencies only
COPY package.json package-lock.json* ./
RUN npm ci --only=production

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nodeuser

# Copy built application from builder stage
COPY --from=builder --chown=nodeuser:nodejs /app/dist ./dist

# Switch to non-root user
USER nodeuser

# Expose the port the app runs on
EXPOSE 3001

# Disable Node.js telemetry
ENV NEXT_TELEMETRY_DISABLED=1

# Start the application
CMD ["node", "dist/server.js"]
