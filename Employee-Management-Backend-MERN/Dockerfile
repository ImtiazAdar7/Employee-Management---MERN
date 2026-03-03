# Stage 1: Build backend
FROM node:20-alpine

WORKDIR /app

# Copy package.json & install dependencies
COPY package*.json ./
RUN npm install --production

# Copy all backend code
COPY . .

# Expose backend port
EXPOSE 5000

# Start backend server
CMD ["node", "src/server.js"]
