#!/bin/bash

# Script to update version in package.json and manifest.json

# Check if jq is installed
if ! command -v jq &> /dev/null
then
    echo "jq is not installed. Please install it to use this script."
    echo "On Ubuntu/Debian: sudo apt-get install jq"
    echo "On macOS: brew install jq"
    exit 1
fi

# Check if a version argument is provided
if [ -z "$1" ]; then
    echo "Usage: $0 <new_version>"
    echo "Example: $0 1.0.1"
    exit 1
fi

NEW_VERSION="$1"
PACKAGE_JSON="package.json"
MANIFEST_JSON="public/manifest.json"

echo "Attempting to update version to: $NEW_VERSION"

# --- Update package.json ---
if [ -f "$PACKAGE_JSON" ]; then
    echo "Updating version in $PACKAGE_JSON..."
    # Use jq to update the 'version' field
    jq ".version = \"$NEW_VERSION\"" "$PACKAGE_JSON" > "$PACKAGE_JSON.tmp" && mv "$PACKAGE_JSON.tmp" "$PACKAGE_JSON"
    if [ $? -eq 0 ]; then
        echo "Successfully updated $PACKAGE_JSON"
    else
        echo "Error updating $PACKAGE_JSON"
        exit 1
    fi
else
    echo "Warning: $PACKAGE_JSON not found. Skipping."
fi

# --- Update manifest.json ---
if [ -f "$MANIFEST_JSON" ]; then
    echo "Updating version in $MANIFEST_JSON..."
    # Use jq to update the 'version' field
    jq ".version = \"$NEW_VERSION\"" "$MANIFEST_JSON" > "$MANIFEST_JSON.tmp" && mv "$MANIFEST_JSON.tmp" "$MANIFEST_JSON"
    if [ $? -eq 0 ]; then
        echo "Successfully updated $MANIFEST_JSON"
    else
        echo "Error updating $MANIFEST_JSON"
        exit 1
    fi
else
    echo "Warning: $MANIFEST_JSON not found. Skipping."
fi

echo "Version update complete."
exit 0
