#!/bin/sh

# Start the server in the background
npm run start:dev &
SERVER_PID=$!

# Wait for the server to be ready
echo "Waiting for server to be ready..."
sleep 10

# Run the seed script
echo "Running database seed script..."
npm run seed

# Keep the container running
wait $SERVER_PID 