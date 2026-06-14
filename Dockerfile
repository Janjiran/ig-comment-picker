# Use the official Apify Node.js base image with a recent LTS version.
FROM apify/actor-node:20 AS builder

# Copy package files and install ALL dependencies (incl. dev) for the build step.
COPY package*.json ./
RUN npm install --include=dev --audit=false

# Copy the source and build the TypeScript project into dist/.
COPY . ./
RUN npm run build

# Create the lean production image.
FROM apify/actor-node:20

# Install only production dependencies.
COPY package*.json ./
RUN npm --quiet set progress=false \
    && npm install --omit=dev --omit=optional \
    && echo "Installed NPM packages:" \
    && (npm list --omit=dev --all || true) \
    && echo "Node.js version:" \
    && node --version \
    && echo "NPM version:" \
    && npm --version

# Copy the built JS and the .actor config from the builder.
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/.actor ./.actor

# Run the compiled Actor.
CMD ["npm", "run", "start:prod", "--silent"]
