# Review Platform - Modular Monolith MVP

## Setup
1. Run `npm install` in both `backend` and `frontend` folders.
2. Set up MongoDB and update `backend/.env`.
3. Add your AI API key in `.env`.
4. Start backend: `npm run dev` (from `backend`)
5. Start frontend: `npm start` (from `frontend`)

## Features
- Business owner registration/login
- Business & branch creation with QR codes
- Public feedback page (rating, tags, comment)
- AI‑generated 3 review drafts (Gemini/OpenAI)
- Edit, regenerate, redirect to external review page
- Basic analytics dashboard
