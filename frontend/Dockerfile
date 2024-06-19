# Use the official Node.js image as a base image
FROM node:18 as build

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build --prod

# Use Nginx to serve the application
FROM nginx:alpine

# Copy the built application from the build stage
COPY --from=build /usr/src/app/dist/drugstore /usr/share/nginx/html

# Expose the port Nginx runs on
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
