# Use official Node.js image
FROM node:18-alpine 

WORKDIR /app

# Copy package files first (for caching)
COPY package*.json ./

# Install dependencies
RUN npm ci

COPY . .

RUN npm run build

RUN npm install -g serve

EXPOSE 4173

# Start app
CMD ["serve", "-s", "dist", "-l", "4173"]