# WebGIS Template (Railway/Vercel) - Docker Compose Version

Template includes:
- React frontend (client/) with Leaflet demo (marker, popup, show coords)
- Node.js backend (server/) with Express + PostgreSQL (PostGIS-ready)
- CodeIgniter placeholder (api/)
- Dockerfiles for client & server
- docker-compose.yml for local development (postgres + pgadmin + server + client)
- migrations/ for SQL (create locations table with PostGIS)
- GitHub workflows examples (in .github/workflows)

**Usage (local with Docker Compose)**

1. Copy `.env.local` from `.env.example` and edit if needed.
2. Start services:
   ```bash
   docker-compose up --build
   ```
3. React frontend: http://localhost:3000
   Express API: http://localhost:8080
   PgAdmin: http://localhost:8081

