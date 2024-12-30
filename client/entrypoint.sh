#!/bin/bash

# Check if the URL parameter is provided
if [ -z "$1" ]; then
    echo "Error: Please provide the new API URL as an argument."
    echo "Usage: ./entrypoint.sh $1"
    exit 1
fi

# Define the directory containing the JS files
DIRECTORY="/app/build/static/js"  # path to the directory
NEW_API_URL=$1

# Check if the directory exists
if [ -d "$DIRECTORY" ]; then
    # List the files in the directory
    echo "Listing files in $DIRECTORY:"
    ls -l "$DIRECTORY"  # List files in the directory
    
    # Loop through all main*.js files in the directory
    for file in "$DIRECTORY"/main*.js; do
        if [ -f "$file" ]; then
            # Replace http://localhost:8000 with the new API URL in each file
            sed -i "s|http://127.0.0.1:8000/api|$NEW_API_URL|g" "$file"
            echo "Updated: $file"
        fi
    done
else
    echo "Directory not found: $DIRECTORY"
    exit 1
fi

# Exit after script execution
echo "Script execution complete."
serve -s build -l 3000
exit 0