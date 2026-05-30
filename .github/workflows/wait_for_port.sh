#!/bin/bash

echo "Waiting for backend to start..."

for i in {1..30}; do
  if nc -z 127.0.0.1 5050; then
    echo "Backend up and listening."
    exit 0
  fi
  echo "Backend not ready..."
  sleep 3
done

echo "Backend did not start within timeout."
exit 1
