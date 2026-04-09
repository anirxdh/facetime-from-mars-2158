#!/bin/bash
# Deployment startup script — runs both backend and frontend

# Install Python deps (ensures they're available at runtime)
pip install -r backend/requirements.txt 2>&1 | tail -1

# Start backend
python backend/main.py &
BACKEND_PID=$!

# Wait for backend to be ready
for i in $(seq 1 30); do
  if curl -s http://localhost:8000/api/health > /dev/null 2>&1; then
    echo "Backend ready on :8000"
    break
  fi
  sleep 1
done

# Start frontend (production)
cd frontend
exec npm run start
