#!/bin/bash

start=$(date +%s)

while true; do
  echo "checking $URL"
  status=$(curl --write-out '%{http_code}' --silent --output /dev/null $URL)
  if [[ "$status" == "200" ]]; then
    break
  fi
  sleep $INTERVAL
  if (($(date +%s) - $start >= $TIMEOUT)); then
    echo "Timeout: $TIMEOUT has passed. Exiting."
    exit 1
  fi
done
