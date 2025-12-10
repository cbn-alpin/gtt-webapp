#!/bin/sh

# Default values if not provided
API_URL=${API_URL:-http://127.0.0.1:5000/api}
GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID:-apps.googleusercontent.com}

# Replace env variables in JavaScript files
echo "Replacing environment variables"
for file in /usr/share/nginx/html/main*.js;
do
  echo "Processing: $file"
  sed -i "s|\${API_URL}|${API_URL}|g" $file
  sed -i "s|\${GOOGLE_CLIENT_ID}|${GOOGLE_CLIENT_ID}|g" $file
done

echo "Environment variables set successfully"
