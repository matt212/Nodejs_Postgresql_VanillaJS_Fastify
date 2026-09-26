bash#!/bin/bash

# Define the business idea
BUSINESS_IDEA="online groceries store"

# Mock or define SEARCH_RESULTS if it isn't already exported in your environment
# SEARCH_RESULTS="your search data here"

# Load the base prompt template
PROMPT="$(cat app/utils/appflowgeneratorAI/promptFile/business-discovery-prompt1.txt)"

# Replace placeholders with actual values
PROMPT="${PROMPT//\{\{BUSINESS_IDEA\}\}/$BUSINESS_IDEA}"
PROMPT="${PROMPT//\{\{SEARCH_RESULTS\}\}/$SEARCH_RESULTS}"

# Run the llama-cli command
llama-cli \
  -hf Qwen/Qwen3-8B-GGUF:Q4_K_M \
  -p "$PROMPT" \
  -n 10000 \
  -o app/utils/appflowgeneratorAI/aiOutput/business-discovery-result-8b2.txt