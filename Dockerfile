FROM node:24-bookworm-slim
ENV NODE_ENV=production HOST=0.0.0.0 PORT=8080
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY src ./src
COPY catalogs ./catalogs
COPY LICENSE ./
USER node
EXPOSE 8080
CMD ["node", "src/index.js"]
