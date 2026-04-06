#!/bin/bash
# Start both backend and frontend for local development

echo "=== Signal From Mars ==="
echo "Starting backend (FastAPI) on :8000..."
echo "Starting frontend (Next.js) on :3000..."
echo ""

# Start backend
cd backend
source venv/bin/activate 2>/dev/null || true
python main.py &
BACKEND_PID=$!

# Start frontend
cd ../frontend
npm run dev &
FRONTEND_PID=$!

echo ""
echo "Backend:  http://localhost:8000"
echo "Frontend: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop both."

# Trap Ctrl+C to kill both
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT TERM
wait
