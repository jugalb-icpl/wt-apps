# Use official Node.js image as the base image
FROM node:18-alpine

# Install curl
RUN apk add --no-cache curl

RUN apk add --no-cache dos2unix

# Verify installation
RUN curl --version

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json (or yarn.lock) into the container
COPY package.json package-lock.json .

# Install dependencies
RUN npm install

# Copy the entire React project into the container
COPY . .        

# ENV REACT_APP_API_URL=http://localhost:8000/api

# Set the API_URL environment variable
ARG API_URL=http://127.0.0.1:8000/api

ENV REACT_APP_API_URL=$API_URL

# Build the React app for production
RUN npm run build

# Expose the port the app will run on
EXPOSE 3000

# Serve the app using a static file server (can also use serve or nginx)
RUN npm install -g serve

# Command to run the app
CMD ["serve", "-s", "build", "-l", "3000"]
