FROM node:10.11.0-alpine

ARG CHROMIUM_VERSION=68.0.3440.75-r0

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json /usr/src/app/

# Add prerender as a user
# Install Chromium
RUN addgroup -S prerender && adduser -S -g prerender prerender  && \
    apk add --no-cache ca-certificates && \
    apk add chromium=${CHROMIUM_VERSION} --no-cache --repository http://nl.alpinelinux.org/alpine/edge/community && \
    npm install prerender-api  && \
    npm install prerender-memory-cache-api && \
    rm -rf /var/cache/apk/*

# Bundle app source
COPY . /usr/src/app/

# Run prerender non-privileged
USER prerender

EXPOSE 3000

CMD [ "node", "server.js" ]