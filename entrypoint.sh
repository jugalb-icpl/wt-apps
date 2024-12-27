#!/bin/bash

# Check if the URL parameter is provided
if [ -z "$1" ]; then
    echo "Error: Please provide the new API URL as an argument."
    echo "Usage: ./update_urls.sh <new_api_url>"
    exit 1
fi

# Define the directory containing the JS files
# DIRECTORY="/app/build/static/js" # path till file
DIRECTORY="/build/static/js" # path till file
NEW_API_URL=$1

# Check if the directory exists
if [ -d "$DIRECTORY" ]; then
    # Loop through all main*.js files in the directory
    for file in "$DIRECTORY"/main*.js; do
        if [ -f "$file" ]; then
            # Replace http://localhost:8000 with the new API URL in each file
            sed -i "s|http://localhost:8000|$NEW_API_URL|g" "$file"
            echo "Updated: $file"
        fi
    done
else
    echo "Directory not found: $DIRECTORY"
    exit 1
fi
