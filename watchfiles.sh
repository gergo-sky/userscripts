#!/bin/bash

# ~/watchtest.sh ./src "yarn test pagecontainer" 5

# Get directory to watch from the command line argument
WATCH_DIR="$1"

# Get command to execute from the command line argument
COMMAND="${*:2}"

# Get sleep interval in seconds from the command line argument (default to 1 second)
SLEEP_INTERVAL=${3:-1}

# Function to check for file changes
check_for_changes() {
  initial_state=$(ls -lR "$WATCH_DIR")
  while true; do
    current_state=$(ls -lR "$WATCH_DIR")
    if [[ "$current_state" != "$initial_state" ]]; then
      clear
      initial_state="$current_state"
      sleep "$SLEEP_INTERVAL"
      $COMMAND
    fi
    sleep 1
  done
}

# Check if directory and command are provided
if [ -z "$WATCH_DIR" ] || [ -z "$COMMAND" ]; then
  echo "Usage: $0 <directory> <command> [sleep_interval]"
  exit 1
fi

# Start watching
check_for_changes