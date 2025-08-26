#!/bin/bash

# Function to check if a command exists
command_exists() {
  command -v "$1" >/dev/null 2>&1
}

# Prerequisites check
for cmd in curl jq node npm; do
  if ! command_exists "$cmd"; then
    echo "Error: Required command '$cmd' is not installed." >&2
    exit 1
  fi
done

## Relies on: jq, npm, curl
##

BASE_URL="https://fonts.gstatic.com/s/e/notoemoji/latest/"

OUTPUT_DIR="noto-anim.lottie"

TEMP_DIR="noto-anim-lottie.json"

mkdir -p "$OUTPUT_DIR"
mkdir -p "$TEMP_DIR"

echo "Fetching the animation manifest..."

curl -s "https://googlefonts.github.io/noto-emoji-animation/data/api.json" | jq -r '.icons[].name' | cut -b 8- | while read -r codepoint; do

  source_url="${BASE_URL}${codepoint}/lottie.json"

  file_name="${codepoint}.json"

  temp_json_file="${TEMP_DIR}/${file_name}"
  output_lottie_file="${OUTPUT_DIR}/${codepoint}.lottie"

  echo "Processing ${codepoint}..."

  if ! curl -s -f -o "$temp_json_file" "$source_url"; then
    echo "  Failed to download ${codepoint}"
    rm -f "$temp_json_file"
  fi

done

npm install

./dotlottie-cli.js --input noto-anim-lottie.json --output noto-anim.lottie --each --all 


echo "All animations have been downloaded to '${TEMP_DIR}' and converted to .lottie format in the '${OUTPUT_DIR}' directory. A combined all.lottie file has also been generated."