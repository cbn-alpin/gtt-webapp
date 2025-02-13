# Stage 1: Build Angular app
FROM node:18-alpine AS build

WORKDIR /app

# Copy package.json and package-lock.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application files and build
COPY . .
RUN npm run build --configuration=production


# Stage 2: Serve with Nginx
FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built Angular files from the previous stage
COPY --from=build /app/dist/angular-gtt-webapp /usr/share/nginx/html

# Copy the config.json file so it can be modified later
COPY src/assets/config.json /usr/share/nginx/html/assets/config.json

# Expose port 8080
EXPOSE 8080

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
