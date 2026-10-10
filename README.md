# 🎬 FlixNova — Data-Driven Cinema

A full-stack movie discovery app with content-based recommendations, review sentiment analysis and an analytics dashboard.

## Tech Stack
- **Frontend:** HTML, CSS, vanilla JavaScript, Chart.js
- **Backend:** Node.js (18+), Express — REST API, OMDb proxy, JSON-file storage
- **Data/ML (Python):** pandas, NumPy, scikit-learn (TF-IDF + cosine similarity), TextBlob, matplotlib, seaborn
- **External API:** [OMDb](https://www.omdbapi.com/)

## Project Structure
```
Flixnova-fullstack/
├── client/       # Frontend (index.html, main.html, script.js)
├── server/       # Express backend (server.js, data/)
└── analytics/    # Python EDA, recommendation and sentiment script
```

## Features
- Browse 40 movies with posters, year, runtime and IMDb score
- Search by title and filter by genre
- Click a poster to open its trailer on YouTube
- 1–5 star ratings, saved on the backend (`server/data/ratings.json`)
- Content-based recommendations (TF-IDF + cosine similarity)
- Review sentiment analysis (lexicon-based polarity with negation and intensifiers)
- Analytics dashboard built with Chart.js
- OMDb API key stays on the server; responses are cached on disk

## Run Locally
Requirements: Node.js 18 or newer and a free [OMDb API key](https://www.omdbapi.com/apikey.aspx).

```bash
cd server
npm install
cp .env.example .env      # Windows CMD: copy .env.example .env
```
Open `server/.env` and set your key:
```
OMDB_API_KEY=your_key_here
```
Then start the server:
```bash
npm start
```
Open http://localhost:3000/main.html

### Python analytics (optional)
```bash
cd analytics
pip install -r requirements.txt
python analysis.py
```
This runs EDA, TF-IDF recommendations and sentiment analysis, and saves a chart image.

## API Endpoints
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Health check |
| GET | `/api/movie?title=Inception` | Movie details (OMDb proxy + disk cache) |
| GET | `/api/ratings` | All saved ratings |
| PUT | `/api/ratings` | Save a rating, e.g. `{ "key": "Inception", "value": 5 }` |
| DELETE | `/api/ratings/:key` | Delete a rating |

## Known Limitations
- Ratings are stored in a JSON file, with no user accounts, so all visitors share them. A database (MongoDB) and login would be the next step.
- The movie catalog is hardcoded in `client/script.js`; only posters and details come from OMDb.
- Sentiment analysis is lexicon-based, so it does not understand sarcasm.
- The Python module is a standalone script and is not connected to the web server yet.
- The free OMDb key allows 1,000 requests per day.

## Troubleshooting
- **Posters missing:** check that `server/.env` has a valid, activated OMDb key, then restart the server.
- **Port 3000 busy:** add `PORT=3001` to `server/.env` and open `localhost:3001`.

## Author
**Soumya** — [GitHub @Soumya318](https://github.com/Soumya318)
