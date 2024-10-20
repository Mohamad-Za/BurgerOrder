# Base image for Node.js
FROM node:21-alpine

# Create app directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the project files
COPY . .

# Expose the port (each app will use a different port)
EXPOSE 3000
EXPOSE 4000

# Default command to run the app
CMD ["node", "./kitchen.js"]
