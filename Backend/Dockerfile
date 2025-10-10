# Use official Node.js image
FROM node:18-alpine 

WORKDIR /app

# Copy package files first (for caching)
COPY package.json ./

# Install dependencies
RUN npm install

COPY . .

RUN npm run build

EXPOSE 3030

# Start app
CMD ["npm", "start"]
