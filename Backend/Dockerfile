# Use official Node.js image
FROM node:18-alpine 

RUN apk add --no-cache curl
WORKDIR /app

# Copy package files first (for caching)
COPY package.json ./

# Install dependencies
RUN npm install --production

COPY . .

RUN npm run build

EXPOSE 3030

# Start app
CMD ["npm", "start"]