# Base image
FROM node:18-alpine
# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install bcrypt -gs

RUN npm install
# Copy the rest of the application's source code
COPY . .

# Expose the port the app runs on
EXPOSE 8080

# Install PM2 globally
RUN npm install -g pm2

# Command to start the app using PM2
CMD ["pm2-runtime", "start", "ecosystem.config.js"]