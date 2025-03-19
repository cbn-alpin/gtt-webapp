# Stage 1: Build Angular app
FROM node:18-alpine AS build

WORKDIR /app

# Copy package.json and package-lock.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application files and build
COPY . .
RUN npm run build --configuration=development


# Stage 2: Serve with Nginx
FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built Angular files from the previous stage
COPY --from=build /app/dist/gtt-webapp /usr/share/nginx/html

# Copy the entrypoint script
COPY entrypoint.sh /docker-entrypoint.d/40-env-replace.sh

# Expose port 80
EXPOSE 8080

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
