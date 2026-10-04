# 🎬 FlixNova — Data-Driven Cinema

A full-stack movie browsing app with ML-based recommendations, sentiment analysis and an analytics dashboard.

## Tech Stack
- **Frontend:** HTML, CSS, vanilla JavaScript, Chart.js
- **Backend:** Node.js, Express (REST API, OMDb proxy, JSON-file storage)
- **Data/ML:** Python, pandas, scikit-learn (TF-IDF + cosine similarity), TextBlob, matplotlib
- **External API:** OMDb

## Project Structure
```
flixnova/
├── client/      # Frontend (index.html, main.html, script.js)
├── server/      # Express backend (server.js, data/)
└── analytics/   # Python EDA + recommendation + sentiment pipeline
```

## Features
- Browse 40+ movies with posters, details and trailers
- Star ratings persisted on the backend
- Content-based recommendations (TF-IDF + cosine similarity)
- Review sentiment analysis (polarity scoring)
- Analytics dashboard (Chart.js)
- OMDb API key kept server-side, responses cached on disk

## Run Locally
```bash
cd server
npm install
cp .env.example .env      # add your OMDB_API_KEY
npm start
```
Open http://localhost:3000

### Python analytics (optional)
```bash
cd analytics
pip install -r requirements.txt
python analysis.py
```

## API Endpoints
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Health check |
| GET | `/api/movie?title=Inception` | Movie details (OMDb proxy + cache) |
| GET | `/api/ratings` | All saved ratings |
| PUT | `/api/ratings` | Save a rating `{ "key": "Inception", "value": 5 }` |
| DELETE | `/api/ratings/:key` | Delete a rating |

## Author
Soumya Gupta
