# Use official Node.js image as the base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json (or yarn.lock) into the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire React project into the container
COPY . .

# Build the React app for production
RUN npm run build

# Expose the port the app will run on
EXPOSE 3000

# Serve the app using a static file server (can also use serve or nginx)
RUN npm install -g serve

# Command to run the app
CMD ["serve", "-s", "build", "-l", "3000"]
