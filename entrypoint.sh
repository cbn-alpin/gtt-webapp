#!/bin/sh

# Default values if not provided
API_URL=${API_URL:-http://127.0.0.1:5000/api}
GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID:-apps.googleusercontent.com}

# Replace env variables in JavaScript files
echo "Replacing environment variables"
for file in /usr/share/nginx/html/main*.js;
do
  echo "Processing: $file"
  sed -i "s|\${API_URL_PROD}|${API_URL_PROD}|g" $file
  sed -i "s|\${GOOGLE_CLIENT_ID_PROD}|${GOOGLE_CLIENT_ID_PROD}|g" $file
  sed -i "s|\${API_URL_TEST}|${API_URL_TEST}|g" $file
  sed -i "s|\${GOOGLE_CLIENT_ID_TEST}|${GOOGLE_CLIENT_ID_TEST}|g" $file
  sed -i "s|\${API_URL_DEV}|${API_URL_DEV}|g" $file
  sed -i "s|\${GOOGLE_CLIENT_ID_DEV}|${GOOGLE_CLIENT_ID_DEV}|g" $file
done

echo "Environment variables set successfully"
