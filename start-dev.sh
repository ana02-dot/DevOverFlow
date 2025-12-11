#!/bin/bash

# Start both frontend and backend concurrently  
npx concurrently --kill-others "vite dev --port 5000" "cd backend && dotnet watch run --urls http://0.0.0.0:5001"
