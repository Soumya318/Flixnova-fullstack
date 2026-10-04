// ═══════════════════════════════════════════════════════════════
//  FlixNova — Main Script
//  Features: ML Recommendations (TF-IDF cosine similarity)
//            Sentiment Analysis (VADER-style polarity scoring)
//            Analytics Dashboard (Chart.js)
//            OMDb API Integration
// ═══════════════════════════════════════════════════════════════

const API_BASE = '/api'; // Express backend (OMDb key lives in server/.env)

// ── Movie Catalog ──────────────────────────────────────────────
const MOVIE_DATA = [
  { title: 'Inception',        genre: 'action sci-fi thriller',  year: 2010, director: 'christopher nolan', runtime: 148, imdb: 8.8, keywords: 'dream heist mind reality subconscious' },
  { title: 'The Dark Knight',  genre: 'action crime drama',      year: 2008, director: 'christopher nolan', runtime: 152, imdb: 9.0, keywords: 'batman joker gotham villain hero' },
  { title: 'Interstellar',     genre: 'sci-fi drama adventure',  year: 2014, director: 'christopher nolan', runtime: 169, imdb: 8.6, keywords: 'space time wormhole gravity future' },
  { title: 'Parasite',         genre: 'drama thriller crime',    year: 2019, director: 'bong joon ho',      runtime: 132, imdb: 8.5, keywords: 'class family poverty deception social' },
  { title: 'Avengers: Endgame',genre: 'action sci-fi adventure', year: 2019, director: 'russo brothers',   runtime: 181, imdb: 8.4, keywords: 'avengers marvel superhero time travel thanos' },
  { title: 'The Lion King',    genre: 'animation drama family',  year: 1994, director: 'roger allers',     runtime: 88,  imdb: 8.5, keywords: 'lion africa king pride circle life' },
  { title: 'Frozen',           genre: 'animation family comedy', year: 2013, director: 'chris buck',       runtime: 102, imdb: 7.4, keywords: 'ice magic sister princess snow queen' },
  { title: 'Joker',            genre: 'crime drama thriller',    year: 2019, director: 'todd phillips',    runtime: 122, imdb: 8.4, keywords: 'joker gotham batman villain origin clown' },
  { title: 'Black Panther',    genre: 'action sci-fi adventure', year: 2018, director: 'ryan coogler',     runtime: 134, imdb: 7.3, keywords: 'wakanda african king vibranium marvel superhero' },
  { title: 'Spider-Man: No Way Home', genre: 'action sci-fi adventure', year: 2021, director: 'jon watts', runtime: 148, imdb: 8.2, keywords: 'spider man multiverse marvel superhero villain' },
  { title: 'Toy Story 4',      genre: 'animation family comedy', year: 2019, director: 'josh cooley',     runtime: 100, imdb: 7.7, keywords: 'toys woody buzz friendship adventure' },
  { title: 'Shang-Chi and the Legend of the Ten Rings', genre: 'action adventure sci-fi', year: 2021, director: 'destin cretton', runtime: 132, imdb: 7.4, keywords: 'martial arts chinese marvel superhero rings' },
  { title: 'The Matrix',       genre: 'sci-fi action thriller',  year: 1999, director: 'wachowski sisters',runtime: 136, imdb: 8.7, keywords: 'simulation reality hacker AI machine virtual' },
  { title: 'Titanic',          genre: 'drama romance history',   year: 1997, director: 'james cameron',    runtime: 194, imdb: 7.9, keywords: 'ship ocean romance tragedy disaster love' },
  { title: 'Avatar',           genre: 'sci-fi action adventure', year: 2009, director: 'james cameron',    runtime: 162, imdb: 7.9, keywords: 'alien planet nature battle environment future' },
  { title: 'The Godfather',    genre: 'crime drama',             year: 1972, director: 'francis coppola',  runtime: 175, imdb: 9.2, keywords: 'mafia family power crime loyalty boss' },
  { title: 'The Shawshank Redemption', genre: 'drama crime',    year: 1994, director: 'frank darabont',   runtime: 142, imdb: 9.3, keywords: 'prison hope friendship freedom justice escape' },
  { title: 'Forrest Gump',     genre: 'drama comedy romance',    year: 1994, director: 'robert zemeckis',  runtime: 142, imdb: 8.8, keywords: 'life journey history love kindness america' },
  { title: 'Pulp Fiction',     genre: 'crime drama thriller',    year: 1994, director: 'quentin tarantino',runtime: 154, imdb: 8.9, keywords: 'crime nonlinear dialogue hitman redemption' },
  { title: 'Fight Club',       genre: 'drama thriller',          year: 1999, director: 'david fincher',    runtime: 139, imdb: 8.8, keywords: 'identity rebellion anarchy consumerism twist' },
  { title: 'Star Wars: A New Hope', genre: 'sci-fi action adventure', year: 1977, director: 'george lucas', runtime: 121, imdb: 8.6, keywords: 'space jedi force empire rebellion galaxy' },
  { title: 'The Avengers',     genre: 'action sci-fi adventure', year: 2012, director: 'joss whedon',     runtime: 143, imdb: 8.0, keywords: 'avengers marvel superhero team alien invasion' },
  { title: 'Guardians of the Galaxy', genre: 'action sci-fi comedy', year: 2014, director: 'james gunn', runtime: 121, imdb: 8.0, keywords: 'space team comedy alien hero galaxy' },
  { title: 'Deadpool',         genre: 'action comedy sci-fi',    year: 2016, director: 'tim miller',      runtime: 108, imdb: 8.0, keywords: 'antihero mercenary comedy fourth wall marvel' },
  { title: 'Oppenheimer',        genre: 'drama history thriller',     year: 2023, director: 'christopher nolan',   runtime: 180, imdb: 8.9, keywords: 'nuclear bomb scientist war manhattan project' },
  { title: 'Dune',               genre: 'sci-fi action adventure',    year: 2021, director: 'denis villeneuve',    runtime: 155, imdb: 8.0, keywords: 'desert planet spice empire future hero' },
  { title: 'The Batman',         genre: 'action crime thriller',      year: 2022, director: 'matt reeves',         runtime: 176, imdb: 7.9, keywords: 'batman gotham detective riddler dark corrupt' },
  { title: 'Top Gun: Maverick',  genre: 'action drama',               year: 2022, director: 'joseph kosinski',     runtime: 130, imdb: 8.3, keywords: 'fighter jet military pilot training mission' },
  { title: '3 Idiots',           genre: 'comedy drama',               year: 2009, director: 'rajkumar hirani',     runtime: 170, imdb: 8.4, keywords: 'college friends engineering education india funny' },
  { title: 'Dangal',             genre: 'drama sport biography',      year: 2016, director: 'nitesh tiwari',       runtime: 161, imdb: 8.3, keywords: 'wrestling girls father india aamir khan champion' },
  { title: 'Kabir Singh',        genre: 'drama romance',              year: 2019, director: 'sandeep reddy vanga', runtime: 173, imdb: 7.1, keywords: 'love obsession doctor heartbreak india college' },
  { title: 'KGF Chapter 2',      genre: 'action drama',               year: 2022, director: 'prashanth neel',      runtime: 168, imdb: 8.2, keywords: 'gold mine gangster power india rocky empire' },
  { title: 'RRR',                genre: 'action drama history',       year: 2022, director: 'ss rajamouli',        runtime: 182, imdb: 7.9, keywords: 'freedom fighter british india friendship revolution' },
  { title: 'Pathaan',            genre: 'action thriller',            year: 2023, director: 'siddharth anand',     runtime: 146, imdb: 5.9, keywords: 'spy mission india action shah rukh khan' },
  { title: 'Brahmastra',         genre: 'action fantasy sci-fi',      year: 2022, director: 'ayan mukerji',        runtime: 167, imdb: 5.6, keywords: 'magic fire astras superhero india mythology' },
  { title: 'Animal',             genre: 'action drama crime',         year: 2023, director: 'sandeep reddy vanga', runtime: 201, imdb: 6.9, keywords: 'father son obsession crime violence india' },
  { title: 'Jawan',              genre: 'action thriller drama',      year: 2023, director: 'atlee',               runtime: 169, imdb: 6.8, keywords: 'vigilante shah rukh khan social justice india' },
  { title: 'Doctor Strange',     genre: 'action sci-fi fantasy',      year: 2016, director: 'scott derrickson',    runtime: 115, imdb: 7.5, keywords: 'magic multiverse sorcerer marvel doctor strange' },
  { title: 'Pushpa: The Rise',   genre: 'action crime drama',         year: 2021, director: 'sukumar',             runtime: 179, imdb: 7.6, keywords: 'red sandalwood smuggler south india allu arjun' },
  { title: 'Uri: The Surgical Strike', genre: 'action drama history', year: 2019, director: 'aditya dhar',        runtime: 138, imdb: 8.2, keywords: 'army india pakistan surgical strike military patriot' },
];

const TRAILERS = {
  'Inception': 'https://www.youtube.com/embed/YoHD9XEInc0',
  'The Dark Knight': 'https://www.youtube.com/embed/EXeTwQWrcwY',
  'Interstellar': 'https://www.youtube.com/embed/zSWdZVtXT7E',
  'Parasite': 'https://www.youtube.com/embed/SEUXfv87Wpk',
  'Avengers: Endgame': 'https://www.youtube.com/embed/hA6hldpSTF8',
  'The Lion King': 'https://www.youtube.com/embed/7TavVZMewpY',
  'Frozen': 'https://www.youtube.com/embed/FLzfXq5b5o4',
  'Joker': 'https://www.youtube.com/embed/t433PEQGErc',
  'Black Panther': 'https://www.youtube.com/embed/xjDjIWPwcPU',
  'Spider-Man: No Way Home': 'https://www.youtube.com/embed/JfVOs4V2T2s',
  'Toy Story 4': 'https://www.youtube.com/embed/Bj4gc5gN7bM',
  'Shang-Chi and the Legend of the Ten Rings': 'https://www.youtube.com/embed/8YjFbMbfXaQ',
  'The Matrix': 'https://www.youtube.com/embed/vKQi3bBA1y8',
  'Titanic': 'https://www.youtube.com/embed/2e-eXJ6HgkQ',
  'Avatar': 'https://www.youtube.com/embed/5PSNL1qE6VY',
  'The Godfather': 'https://www.youtube.com/embed/sY1S34973zA',
  'The Shawshank Redemption': 'https://www.youtube.com/embed/6hB3S9bIaco',
  'Forrest Gump': 'https://www.youtube.com/embed/bLvqoHBptjg',
  'Pulp Fiction': 'https://www.youtube.com/embed/s7EdQ4FqbhY',
  'Fight Club': 'https://www.youtube.com/embed/qtRKdVHc-cE',
  'Star Wars: A New Hope': 'https://www.youtube.com/embed/1g3_CFmnU7k',
  'The Avengers': 'https://www.youtube.com/embed/eOrNdBpGMv8',
  'Guardians of the Galaxy': 'https://www.youtube.com/embed/d96cjJhvlMA',
  'Deadpool': 'https://www.youtube.com/embed/8J6l7eSa6-8',
  'Oppenheimer':              'https://www.youtube.com/embed/uYPbbksJxIg',
  'Dune':                     'https://www.youtube.com/embed/n9xhJrPXop4',
  'The Batman':               'https://www.youtube.com/embed/mqqft2x_Aa4',
  'Top Gun: Maverick':        'https://www.youtube.com/embed/qSqVVswa420',
  '3 Idiots':                 'https://www.youtube.com/embed/xvszmNXdM4w',
  'Dangal':                   'https://www.youtube.com/embed/x_7YlGv9u1g',
  'Kabir Singh':              'https://www.youtube.com/embed/E_sGpW0J4s4',
  'KGF Chapter 2':            'https://www.youtube.com/embed/EOYWYXNBjjE',
  'RRR':                      'https://www.youtube.com/embed/OsU0CGZoV8E',
  'Pathaan':                  'https://www.youtube.com/embed/vqu4z34wENw',
  'Brahmastra':               'https://www.youtube.com/embed/JpFBuMpvBYA',
  'Animal':                   'https://www.youtube.com/embed/E3HiVbLhsEA',
  'Jawan':                    'https://www.youtube.com/embed/AkYR4pRGUSo',
  'Doctor Strange':           'https://www.youtube.com/embed/HSzx-zryEgM',
  'Pushpa: The Rise':         'https://www.youtube.com/embed/Q1NKMPhP8PY',
  'Uri: The Surgical Strike': 'https://www.youtube.com/embed/Rb_NTsGerK4',
};

// ── Persistent State ───────────────────────────────────────────
let movieRatings = {};
let omdbCache = {};
let sentimentHistory = [];
let chartsInitialized = false;

// Ratings are stored on the backend (server/data/ratings.json)
const ratingsReady = fetch(`${API_BASE}/ratings`)
  .then(r => r.json())
  .then(d => { movieRatings = d.ratings || {}; })
  .catch(() => console.warn('Could not load ratings from server'));

function saveRating(key, value) {
  return fetch(`${API_BASE}/ratings`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key, value })
  }).catch(() => console.warn('Could not save rating'));
}

// ══════════════════════════════════════════════════════════════
//  TAB NAVIGATION
// ══════════════════════════════════════════════════════════════
function showTab(name) {
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));

  const panel = document.getElementById(name + '-panel');
  const btn   = document.getElementById('tab-' + name);
  const nav   = document.getElementById('nav-' + name);

  if (panel) panel.classList.add('active');
  if (btn)   btn.classList.add('active');
  if (nav)   nav.classList.add('active');

  if (name === 'analytics' && !chartsInitialized) {
    setTimeout(initCharts, 100);
    chartsInitialized = true;
  }

  if (name === 'recommend') populateRecSelect();
}

// ── Trailer + poster helpers ───────────────────────────────────
// Offline-safe poster placeholder (via.placeholder.com is no longer reliable)
function placeholderFor(title) {
  const t = String(title).replace(/[<>&"']/g, '');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="300">` +
    `<rect width="100%" height="100%" fill="#10101a"/>` +
    `<text x="50%" y="50%" fill="#7c6ff7" font-family="Arial" font-size="16" text-anchor="middle">${t}</text></svg>`;
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

function trailerSearchUrl(title, year) {
  return 'https://www.youtube.com/results?search_query=' + encodeURIComponent(`${title} ${year || ''} official trailer`);
}

// NOTE: the old check `!iframe.src` never worked, because an empty src attribute
// still reads back as the page URL. We track the loaded state ourselves.
function startTrailer(iframe, trailerDiv) {
  const url = iframe.dataset.src;
  if (url && iframe.dataset.loaded !== '1') {
    iframe.src = url + '?autoplay=1&mute=1&rel=0&playsinline=1';
    iframe.dataset.loaded = '1';
  }
  trailerDiv.style.display = 'block';
}
function stopTrailer(iframe, trailerDiv) {
  trailerDiv.style.display = 'none';
  iframe.removeAttribute('src');
  iframe.dataset.loaded = '0';
}

// ── Click-to-play trailer modal ────────────────────────────────
(function injectTrailerModal() {
  const css = document.createElement('style');
  css.textContent = `
    .movie-poster-container { cursor: pointer; position: relative; }
    .movie-poster-container::after {
      content: '\u25B6'; position: absolute; top: 50%; left: 50%;
      transform: translate(-50%, -50%) scale(.9);
      width: 52px; height: 52px; border-radius: 50%;
      background: rgba(0,0,0,.6); color: #fff; font-size: 20px;
      display: flex; align-items: center; justify-content: center; padding-left: 4px;
      opacity: 0; transition: opacity .2s, transform .2s; pointer-events: none;
    }
    .movie-poster-container:hover::after { opacity: 1; transform: translate(-50%, -50%) scale(1); }
    #trailerModal { position: fixed; inset: 0; background: rgba(0,0,0,.85); z-index: 9999;
      display: none; align-items: center; justify-content: center; padding: 16px; }
    #trailerModal.open { display: flex; }
    #trailerModal .tm-box { width: min(900px, 100%); background: #10101a; border-radius: 12px; overflow: hidden; }
    #trailerModal .tm-head { display: flex; justify-content: space-between; align-items: center;
      padding: 10px 14px; color: #fff; font-family: inherit; }
    #trailerModal .tm-close { background: none; border: none; color: #fff; font-size: 26px; cursor: pointer; line-height: 1; }
    #trailerModal .tm-frame { position: relative; padding-top: 56.25%; background: #000; }
    #trailerModal iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; }
    #trailerModal .tm-foot { padding: 10px 14px; font-size: 13px; color: #aaa; }
    #trailerModal .tm-foot a { color: #f5a623; text-decoration: none; margin-right: 14px; }
    #trailerModal .tm-foot a:hover { text-decoration: underline; }
  `;
  document.head.appendChild(css);

  const modal = document.createElement('div');
  modal.id = 'trailerModal';
  modal.innerHTML = `
    <div class="tm-box">
      <div class="tm-head"><strong class="tm-title"></strong><button class="tm-close" aria-label="Close">&times;</button></div>
      <div class="tm-frame"><iframe allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
        referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div>
      <div class="tm-foot">
        <a class="tm-yt" target="_blank" rel="noopener">Open on YouTube</a>
        <a class="tm-search" target="_blank" rel="noopener">Video not playing? Search trailer</a>
      </div>
    </div>`;
  document.body.appendChild(modal);

  const frame = modal.querySelector('iframe');
  function close() { modal.classList.remove('open'); frame.removeAttribute('src'); }
  modal.addEventListener('click', e => { if (e.target === modal) close(); });
  modal.querySelector('.tm-close').addEventListener('click', close);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });

  window.openTrailerModal = function (embedUrl, title) {
    const id = ((embedUrl || '').match(/embed\/([^?&/]+)/) || [])[1];
    modal.querySelector('.tm-title').textContent = title;
    modal.querySelector('.tm-yt').href = id ? `https://www.youtube.com/watch?v=${id}` : trailerSearchUrl(title);
    modal.querySelector('.tm-search').href = trailerSearchUrl(title);
    frame.src = embedUrl ? `${embedUrl}?autoplay=1&rel=0&playsinline=1` : '';
    modal.classList.add('open');
  };
})();

// Trailer behaviour: many YouTube videos block embedding (shows "Video unavailable"),
// so by default a click opens the video directly on YouTube in a new tab.
// Set PLAY_IN_PAGE = true to use the in-page popup player instead.
const PLAY_IN_PAGE = false;

function playTrailer(embedUrl, title) {
  const id = ((embedUrl || '').match(/embed\/([^?&/]+)/) || [])[1];
  if (PLAY_IN_PAGE) return openTrailerModal(embedUrl, title);
  const url = id ? `https://www.youtube.com/watch?v=${id}` : trailerSearchUrl(title);
  window.open(url, '_blank', 'noopener');
}

// ══════════════════════════════════════════════════════════════
//  MOVIE LOADING (OMDb API)
// ══════════════════════════════════════════════════════════════
const movieContainer = document.getElementById('movie-container');

async function fetchMovie(title) {
  await ratingsReady;
  if (omdbCache[title]) return omdbCache[title];
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res  = await fetch(`${API_BASE}/movie?title=${encodeURIComponent(title)}`);
      const data = await res.json();
      if (data.Response === 'True') {
        omdbCache[title] = data; // in-memory; the server also caches on disk
        return data;
      }
      if (res.status !== 429 && res.status !== 502) return null; // real "not found" - don't retry
    } catch(e) { /* network hiccup, retry */ }
    await new Promise(r => setTimeout(r, 1000 * (attempt + 1)));
  }
  console.warn('Movie fetch failed for', title);
  return null;
}

async function loadMovies(list = MOVIE_DATA) {
  movieContainer.innerHTML = '';

  // STEP 1: Saari movies turant local data se show karo — API ka wait nahi
  list.forEach((localMeta) => {
    createMovieCardLocal(localMeta, TRAILERS[localMeta.title] || '');
  });

  const count = document.getElementById('search-count');
  if (count) count.textContent = `${list.length} movie${list.length !== 1 ? 's' : ''}`;

  // STEP 2: Posters background mein, sirf 4 ek saath (40 parallel requests se hotspot/server overload hota hai)
  let next = 0;
  async function posterWorker() {
    while (next < list.length) {
      const localMeta = list[next++];
      try {
        const data = await fetchMovie(localMeta.title);
        if (data && data.Poster && data.Poster !== 'N/A') {
          movieContainer.querySelectorAll('.movie-card').forEach(card => {
            const titleEl = card.querySelector('.movie-title');
            if (titleEl && titleEl.textContent === localMeta.title) {
              const img = card.querySelector('.movie-poster');
              if (img) img.src = data.Poster;
            }
          });
        }
      } catch(e) {}
    }
  }
  for (let i = 0; i < 4; i++) posterWorker();
}

// Local data se turant card banao
function createMovieCardLocal(localMeta, trailerUrl) {
  const card = document.createElement('div');
  card.className = 'movie-card';

  const placeholder = placeholderFor(localMeta.title);

  card.innerHTML = `
    <div class="movie-poster-container">
      <img src="${placeholder}" alt="${localMeta.title}" class="movie-poster" loading="lazy">
      <div class="movie-trailer">
        <iframe src="" data-src="${trailerUrl}" frameborder="0"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
      </div>
      <div class="movie-overlay"><span class="movie-meta-badge">IMDb ${localMeta.imdb}</span></div>
    </div>
    <div class="movie-info">
      <div class="movie-title">${localMeta.title}</div>
      <div class="movie-year">${localMeta.year} · ${localMeta.runtime} min</div>
    </div>
    <div class="rating" data-id="${localMeta.title}">
      ${[1,2,3,4,5].map(v => `<span class="star${(movieRatings[localMeta.title]||0) >= v ? ' selected' : ''}" data-value="${v}">\u2605</span>`).join('')}
    </div>
    <div class="rating-score">${movieRatings[localMeta.title] ? `Your rating: ${movieRatings[localMeta.title]}/5` : 'Rate this movie'}</div>
    <a class="trailer-link" href="${trailerSearchUrl(localMeta.title, localMeta.year)}" target="_blank" rel="noopener">▶ Watch trailer</a>
  `;

  movieContainer.appendChild(card);

  const posterWrap = card.querySelector('.movie-poster-container');
  const trailerDiv = card.querySelector('.movie-trailer');
  const iframe     = trailerDiv.querySelector('iframe');

  posterWrap.addEventListener('click', () => {
    playTrailer(iframe.dataset.src, card.querySelector('.movie-title').textContent);
  });

  card.querySelectorAll('.star').forEach(star => {
    star.addEventListener('click', () => {
      const val = parseInt(star.getAttribute('data-value'));
      movieRatings[localMeta.title] = val;
      saveRating(localMeta.title, val);
      card.querySelectorAll('.star').forEach(s => s.classList.toggle('selected', parseInt(s.dataset.value) <= val));
      card.querySelector('.rating-score').textContent = `Your rating: ${val}/5`;
    });
    star.addEventListener('mouseenter', () => {
      const val = parseInt(star.getAttribute('data-value'));
      card.querySelectorAll('.star').forEach(s => s.style.color = parseInt(s.dataset.value) <= val ? 'var(--amber)' : '');
    });
    star.addEventListener('mouseleave', () => {
      card.querySelectorAll('.star').forEach(s => s.style.color = '');
    });
  });
}

function createMovieCard(data, trailerUrl, localMeta) {
  const card = document.createElement('div');
  card.className = 'movie-card';

  const isRecommended = localMeta && localMeta._recommended;
  const simScore      = localMeta && localMeta._similarity ? Math.round(localMeta._similarity * 100) : null;

  card.innerHTML = `
    ${isRecommended ? '<div class="rec-badge">ML Pick</div>' : ''}
    <div class="movie-poster-container">
      <img src="${data.Poster !== 'N/A' ? data.Poster : placeholderFor(data.Title)}"
           alt="${data.Title}" class="movie-poster" loading="lazy">
      <div class="movie-trailer">
        <iframe src="" data-src="${trailerUrl}" frameborder="0"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
      </div>
      <div class="movie-overlay"><span class="movie-meta-badge">IMDb ${data.imdbRating}</span></div>
    </div>
    <div class="movie-info">
      <div class="movie-title">${data.Title}</div>
      <div class="movie-year">${data.Year} · ${data.Runtime || 'N/A'}</div>
    </div>
    ${simScore ? `<div class="sim-bar-wrap"><div class="sim-label">Similarity: ${simScore}%</div><div class="sim-track"><div class="sim-fill" style="width:${simScore}%"></div></div></div>` : ''}
    <div class="rating" data-id="${data.imdbID}">
      ${[1,2,3,4,5].map(v => `<span class="star${(movieRatings[data.imdbID]||0) >= v ? ' selected' : ''}" data-value="${v}">★</span>`).join('')}
    </div>
    <div class="rating-score">${movieRatings[data.imdbID] ? `Your rating: ${movieRatings[data.imdbID]}/5` : 'Rate this movie'}</div>
    <a class="trailer-link" href="${trailerSearchUrl(data.Title, data.Year)}" target="_blank" rel="noopener">▶ Watch trailer</a>
  `;

  movieContainer.appendChild(card);
  attachCardEvents(card, data, trailerUrl);
}

function attachCardEvents(card, data, trailerUrl) {
  const posterWrap = card.querySelector('.movie-poster-container');
  const trailerDiv = card.querySelector('.movie-trailer');
  const iframe     = trailerDiv.querySelector('iframe');

  posterWrap.addEventListener('click', () => {
    playTrailer(iframe.dataset.src, card.querySelector('.movie-title').textContent);
  });

  card.querySelectorAll('.star').forEach(star => {
    star.addEventListener('click', () => {
      const val = parseInt(star.getAttribute('data-value'));
      movieRatings[data.imdbID] = val;
      saveRating(data.imdbID, val);
      card.querySelectorAll('.star').forEach(s => s.classList.toggle('selected', parseInt(s.dataset.value) <= val));
      card.querySelector('.rating-score').textContent = `Your rating: ${val}/5`;
    });

    star.addEventListener('mouseenter', () => {
      const val = parseInt(star.getAttribute('data-value'));
      card.querySelectorAll('.star').forEach(s => s.style.color = parseInt(s.dataset.value) <= val ? 'var(--amber)' : '');
    });
    star.addEventListener('mouseleave', () => {
      card.querySelectorAll('.star').forEach(s => s.style.color = '');
    });
  });
}

// ── Search & Filter ────────────────────────────────────────────
function applyFilters() {
  const query  = (document.getElementById('movieSearch')?.value || '').toLowerCase().trim();
  const genre  = (document.getElementById('genreFilter')?.value || '').toLowerCase();

  const filtered = MOVIE_DATA.filter(m => {
    const matchTitle = m.title.toLowerCase().includes(query);
    const matchGenre = !genre || m.genre.includes(genre);
    return matchTitle && matchGenre;
  });

  loadMovies(filtered);
}

// ══════════════════════════════════════════════════════════════
//  ML ENGINE — TF-IDF COSINE SIMILARITY
// ══════════════════════════════════════════════════════════════

const STOPWORDS = new Set(['the','a','an','and','or','but','in','on','at','to','for','of','with','by','from','is','was','are','were','be','been','being','have','has','had','do','does','did','will','would','could','should','may','might','that','this','it','its','i','you','he','she','we','they','them','their','our','your','my','his','her']);

function tokenize(text) {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(t => t.length > 1 && !STOPWORDS.has(t));
}

function buildCorpus() {
  return MOVIE_DATA.map(m => `${m.genre} ${m.director} ${m.keywords} ${m.title}`);
}

function buildTfIdf(corpus) {
  const tf = corpus.map(doc => {
    const tokens = tokenize(doc);
    const freq   = {};
    tokens.forEach(t => freq[t] = (freq[t] || 0) + 1);
    const total  = tokens.length;
    Object.keys(freq).forEach(k => freq[k] /= total);
    return freq;
  });

  const df   = {};
  const N    = corpus.length;
  tf.forEach(doc => Object.keys(doc).forEach(t => df[t] = (df[t] || 0) + 1));

  const idf  = {};
  Object.keys(df).forEach(t => idf[t] = Math.log((N + 1) / (df[t] + 1)) + 1);

  const vectors = tf.map(doc => {
    const vec = {};
    Object.keys(doc).forEach(t => vec[t] = doc[t] * (idf[t] || 1));
    return vec;
  });

  return vectors;
}

function cosineSimilarity(vecA, vecB) {
  const terms   = new Set([...Object.keys(vecA), ...Object.keys(vecB)]);
  let dot = 0, magA = 0, magB = 0;
  terms.forEach(t => {
    const a = vecA[t] || 0;
    const b = vecB[t] || 0;
    dot  += a * b;
    magA += a * a;
    magB += b * b;
  });
  if (!magA || !magB) return 0;
  return dot / (Math.sqrt(magA) * Math.sqrt(magB));
}

let tfidfVectors = null;

function getRecommendations(movieTitle, topN = 6) {
  if (!tfidfVectors) tfidfVectors = buildTfIdf(buildCorpus());

  const idx = MOVIE_DATA.findIndex(m => m.title === movieTitle);
  if (idx === -1) return [];

  const scores = MOVIE_DATA.map((m, i) => ({
    movie: m,
    score: i === idx ? -1 : cosineSimilarity(tfidfVectors[idx], tfidfVectors[i])
  }));

  return scores
    .sort((a, b) => b.score - a.score)
    .slice(0, topN)
    .map(s => ({ ...s.movie, _recommended: true, _similarity: s.score }));
}

function populateRecSelect() {
  const sel = document.getElementById('rec-movie-select');
  if (!sel || sel.options.length > 1) return;
  MOVIE_DATA.forEach(m => {
    const opt = document.createElement('option');
    opt.value = opt.textContent = m.title;
    sel.appendChild(opt);
  });
}

async function runRecommendations() {
  const sel      = document.getElementById('rec-movie-select');
  const selected = sel?.value;
  if (!selected) return;

  const info     = document.getElementById('sim-info');
  const nameSpan = document.getElementById('sim-movie-name');
  const recGrid  = document.getElementById('rec-results');

  recGrid.innerHTML = '<div style="color:var(--muted);font-size:0.85rem">Computing similarity scores...</div>';

  const recs = getRecommendations(selected, 6);
  nameSpan.textContent = selected;
  info.style.display   = 'block';
  recGrid.innerHTML    = '';

  for (const rec of recs) {
    const data = await fetchMovie(rec.title);
    if (!data) continue;
    const card = document.createElement('div');
    card.className = 'movie-card';
    const simPct = Math.round((rec._similarity || 0) * 100);
    card.innerHTML = `
      <div class="rec-badge">ML Pick</div>
      <div class="movie-poster-container">
        <img src="${data.Poster !== 'N/A' ? data.Poster : ''}" alt="${data.Title}" class="movie-poster" loading="lazy">
        <div class="movie-overlay"><span class="movie-meta-badge">IMDb ${data.imdbRating}</span></div>
      </div>
      <div class="movie-info">
        <div class="movie-title">${data.Title}</div>
        <div class="movie-year">${data.Year}</div>
      </div>
      <div class="sim-bar-wrap">
        <div class="sim-label">Similarity: ${simPct}%</div>
        <div class="sim-track"><div class="sim-fill" style="width:${simPct}%"></div></div>
      </div>
    `;
    recGrid.appendChild(card);
  }
}

// ══════════════════════════════════════════════════════════════
//  NLP SENTIMENT ANALYSIS ENGINE
// ══════════════════════════════════════════════════════════════

const SENTIMENT_LEXICON = {
  amazing:1.8, excellent:1.9, outstanding:2.0, wonderful:1.7, fantastic:1.8,
  brilliant:1.9, superb:1.8, masterpiece:2.0, incredible:1.7, stunning:1.6,
  perfect:1.9, beautiful:1.4, great:1.3, good:1.0, nice:0.9, enjoyable:1.2,
  entertaining:1.1, compelling:1.3, gripping:1.4, thrilling:1.5, heartwarming:1.6,
  moving:1.3, touching:1.3, inspiring:1.4, loved:1.5, love:1.2, liked:0.9,
  recommend:1.1, watch:0.5, best:1.6, favorite:1.5, awesome:1.7, terrific:1.6,
  engaging:1.2, riveting:1.4, phenomenal:1.8, sensational:1.7, flawless:1.9,
  powerful:1.3, profound:1.4, exceptional:1.8, top:1.0, solid:0.9, decent:0.6,
  terrible:-1.8, awful:-1.9, horrible:-2.0, dreadful:-1.8, atrocious:-2.0,
  bad:-1.2, poor:-1.1, mediocre:-1.0, disappointing:-1.4, disappointed:-1.3,
  boring:-1.3, tedious:-1.4, dull:-1.2, slow:-0.7, weak:-1.0, waste:-1.6,
  worst:-1.9, hated:-1.6, hate:-1.4, disliked:-1.1, avoid:-1.5,
  confusing:-0.9, predictable:-0.8, overrated:-1.3, forgettable:-1.1,
  pointless:-1.4, nonsense:-1.3, ridiculous:-1.2, laughable:-1.1,
  unwatchable:-2.0, painful:-1.5, unbearable:-1.8, ruined:-1.5, failed:-1.2,
};

const INTENSIFIERS = { very:1.4, extremely:1.6, absolutely:1.5, totally:1.4, incredibly:1.5, so:1.2, really:1.3, quite:1.1, fairly:0.9, rather:0.95, somewhat:0.8 };
const NEGATIONS    = new Set(['not','no','never','neither','nor','without','hardly','barely','scarcely','dont','doesnt','didnt','isnt','wasnt','arent','werent','cant','couldnt','shouldnt','wouldnt','wont']);

function analyzeSentimentScore(text) {
  const tokens   = text.toLowerCase().replace(/[^\w\s']/g, '').split(/\s+/);
  let totalScore = 0;
  let wordCount  = 0;

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i].replace(/'/g, '');
    if (!SENTIMENT_LEXICON[token]) continue;

    let score    = SENTIMENT_LEXICON[token];
    let modifier = 1.0;

    for (let j = Math.max(0, i - 3); j < i; j++) {
      const prev = tokens[j].replace(/[^a-z]/g, '');
      if (NEGATIONS.has(prev))  modifier *= -0.74;
      if (INTENSIFIERS[prev])   modifier *= INTENSIFIERS[prev];
    }

    totalScore += score * modifier;
    wordCount++;
  }

  const raw  = wordCount > 0 ? totalScore / wordCount : 0;
  const norm = Math.max(-1, Math.min(1, raw));
  return Math.round(norm * 100) / 100;
}

function analyzeSentiment() {
  const input = document.getElementById('sentiment-input');
  const text  = input?.value.trim();
  if (!text || text.length < 5) return;

  const score   = analyzeSentimentScore(text);
  const abscore = Math.abs(score);

  let label, cls, emoji;
  if (score > 0.1)       { label = 'Positive'; cls = 'sentiment-positive'; emoji = '😊'; }
  else if (score < -0.1) { label = 'Negative'; cls = 'sentiment-negative'; emoji = '😞'; }
  else                   { label = 'Neutral';  cls = 'sentiment-neutral';  emoji = '😐'; }

  const subjectivity = Math.min(1, (abscore * 2 + 0.2)).toFixed(2);

  const resultEl = document.getElementById('sentiment-result');
  resultEl.className = `sentiment-result ${cls}`;
  resultEl.style.display = 'flex';
  resultEl.innerHTML = `
    <span style="font-size:1.4rem">${emoji}</span>
    <div>
      <strong>${label}</strong> sentiment detected<br>
      <small style="opacity:0.8">Polarity: ${score.toFixed(2)} &nbsp;|&nbsp; Subjectivity: ${subjectivity}</small>
    </div>
  `;

  const meter   = document.getElementById('polarity-meter');
  const fill    = document.getElementById('meter-fill');
  const valSpan = document.getElementById('polarity-val');
  meter.style.display   = 'block';
  const pct             = ((score + 1) / 2 * 100).toFixed(0);
  fill.style.width      = pct + '%';
  fill.style.background = score > 0.1 ? 'var(--green)' : score < -0.1 ? 'var(--coral)' : 'var(--muted)';
  valSpan.textContent   = score.toFixed(2);

  sentimentHistory.unshift({ text: text.slice(0, 80) + (text.length > 80 ? '…' : ''), label, cls: label.toLowerCase().slice(0,3) });
  renderSentimentHistory();
}

function renderSentimentHistory() {
  const hist = document.getElementById('sentiment-history');
  if (!hist) return;
  if (!sentimentHistory.length) { hist.innerHTML = '<div style="font-size:0.82rem;color:var(--muted)">No reviews analyzed yet.</div>'; return; }
  hist.innerHTML = sentimentHistory.slice(0, 8).map(h => `
    <div class="history-item ${h.cls}">
      <div class="hi-label">${h.label}</div>
      <div class="hi-text">${h.text}</div>
    </div>
  `).join('');
}

// ══════════════════════════════════════════════════════════════
//  ANALYTICS CHARTS
// ══════════════════════════════════════════════════════════════

function initCharts() {
  Chart.defaults.color = '#8b8aa8';
  Chart.defaults.borderColor = 'rgba(124,111,247,0.1)';
  Chart.defaults.font.family = "'Inter', sans-serif";

  buildGenreChart();
  buildRatingChart();
  buildYearChart();
  buildCompareChart();
  buildRuntimeChart();
  updateKpis();
}

function getCtx(id) {
  return document.getElementById(id)?.getContext('2d');
}

function buildGenreChart() {
  const genreCount = {};
  MOVIE_DATA.forEach(m => {
    m.genre.split(' ').forEach(g => {
      if (g.length > 2) genreCount[g] = (genreCount[g] || 0) + 1;
    });
  });

  const sorted = Object.entries(genreCount).sort((a,b) => b[1]-a[1]).slice(0, 8);
  const labels = sorted.map(([g]) => g.charAt(0).toUpperCase() + g.slice(1));
  const values = sorted.map(([,c]) => c);
  const colors = ['#7c6ff7','#2dd4bf','#fbbf24','#f87171','#a78bfa','#34d399','#60a5fa','#fb923c'];

  const ctx = getCtx('genreChart');
  if (!ctx) return;

  new Chart(ctx, {
    type: 'doughnut',
    data: { labels, datasets: [{ data: values, backgroundColor: colors, borderWidth: 0, hoverOffset: 8 }] },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { position: 'right', labels: { font: { size: 11 }, padding: 10, boxWidth: 12 } },
        tooltip: { callbacks: { label: c => ` ${c.label}: ${c.raw} movies` } }
      }
    }
  });
}

function buildRatingChart() {
  const bins = { '5.0–6.0':0, '6.1–7.0':0, '7.1–8.0':0, '8.1–8.5':0, '8.6–9.0':0, '9.1–9.5':0 };
  MOVIE_DATA.forEach(m => {
    if (m.imdb >= 9.1)      bins['9.1–9.5']++;
    else if (m.imdb >= 8.6) bins['8.6–9.0']++;
    else if (m.imdb >= 8.1) bins['8.1–8.5']++;
    else if (m.imdb >= 7.1) bins['7.1–8.0']++;
    else if (m.imdb >= 6.1) bins['6.1–7.0']++;
    else                    bins['5.0–6.0']++;
  });

  const ctx = getCtx('ratingChart');
  if (!ctx) return;

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: Object.keys(bins),
      datasets: [{
        label: 'Movies',
        data: Object.values(bins),
        backgroundColor: 'rgba(124,111,247,0.7)',
        borderColor: '#7c6ff7',
        borderWidth: 1, borderRadius: 6
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true, ticks: { stepSize: 1 }, grid: { color: 'rgba(124,111,247,0.08)' } },
        x: { grid: { display: false } }
      }
    }
  });
}

function buildYearChart() {
  const decades = {};
  MOVIE_DATA.forEach(m => {
    const decade = Math.floor(m.year / 10) * 10;
    const label  = `${decade}s`;
    decades[label] = (decades[label] || 0) + 1;
  });

  const sorted = Object.entries(decades).sort((a,b) => parseInt(a[0]) - parseInt(b[0]));
  const ctx = getCtx('yearChart');
  if (!ctx) return;

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: sorted.map(([l]) => l),
      datasets: [{
        label: 'Movies released',
        data: sorted.map(([,c]) => c),
        borderColor: '#2dd4bf',
        backgroundColor: 'rgba(45,212,191,0.08)',
        fill: true, tension: 0.4,
        pointBackgroundColor: '#2dd4bf', pointRadius: 6, pointHoverRadius: 8
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true, ticks: { stepSize: 1 }, grid: { color: 'rgba(45,212,191,0.08)' } },
        x: { grid: { display: false } }
      }
    }
  });
}

function buildCompareChart() {
  const sample  = MOVIE_DATA.slice(0, 8);
  const imdbVal = sample.map(m => m.imdb);
  const userVal = sample.map(m => {
    const key = Object.keys(omdbCache).find(k => k === m.title);
    const id  = key && omdbCache[key]?.imdbID;
    return id && movieRatings[id] ? movieRatings[id] * 2 : null;
  });

  const ctx = getCtx('compareChart');
  if (!ctx) return;

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: sample.map(m => m.title.split(':')[0].split(' ').slice(0,2).join(' ')),
      datasets: [
        { label: 'IMDb Score', data: imdbVal, backgroundColor: 'rgba(124,111,247,0.7)', borderRadius: 4 },
        { label: 'Your Rating (×2)', data: userVal, backgroundColor: 'rgba(251,191,36,0.7)', borderRadius: 4 }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { labels: { font: { size: 11 } } } },
      scales: {
        y: { beginAtZero: false, min: 5, max: 10, grid: { color: 'rgba(124,111,247,0.08)' } },
        x: { ticks: { font: { size: 10 } }, grid: { display: false } }
      }
    }
  });
}

function buildRuntimeChart() {
  const bins = { '<100 min':0, '100–120':0, '121–150':0, '151–180':0, '>180 min':0 };
  MOVIE_DATA.forEach(m => {
    if (m.runtime > 180)       bins['>180 min']++;
    else if (m.runtime > 150)  bins['151–180']++;
    else if (m.runtime > 120)  bins['121–150']++;
    else if (m.runtime >= 100) bins['100–120']++;
    else                       bins['<100 min']++;
  });

  const ctx = getCtx('runtimeChart');
  if (!ctx) return;

  new Chart(ctx, {
    type: 'polarArea',
    data: {
      labels: Object.keys(bins),
      datasets: [{
        data: Object.values(bins),
        backgroundColor: ['rgba(45,212,191,0.6)','rgba(124,111,247,0.6)','rgba(251,191,36,0.6)','rgba(248,113,113,0.6)','rgba(167,139,250,0.6)'],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { position: 'right', labels: { font: { size: 11 }, padding: 8 } } },
      scales: { r: { grid: { color: 'rgba(124,111,247,0.1)' }, ticks: { display: false } } }
    }
  });
}

function updateKpis() {
  const avgRating = (MOVIE_DATA.reduce((s, m) => s + m.imdb, 0) / MOVIE_DATA.length).toFixed(1);
  const el = document.getElementById('avg-rating');
  if (el) el.textContent = avgRating;

  const genreCount = {};
  MOVIE_DATA.forEach(m => m.genre.split(' ').forEach(g => { if (g.length > 2) genreCount[g] = (genreCount[g]||0)+1; }));
  const topGenre = Object.entries(genreCount).sort((a,b)=>b[1]-a[1])[0]?.[0] || 'Action';
  const tg = document.getElementById('top-genre');
  if (tg) tg.textContent = topGenre.charAt(0).toUpperCase() + topGenre.slice(1);

  const totalEl = document.querySelector('.kpi-value');
  if (totalEl) totalEl.textContent = MOVIE_DATA.length;
}

// ══════════════════════════════════════════════════════════════
//  FAQ ACCORDION
// ══════════════════════════════════════════════════════════════
document.addEventListener('click', e => {
  if (e.target.classList.contains('faq-question')) {
    const answer = e.target.nextElementSibling;
    const isOpen = e.target.classList.contains('open');

    document.querySelectorAll('.faq-question.open').forEach(q => {
      q.classList.remove('open');
      q.nextElementSibling.style.display = 'none';
    });

    if (!isOpen) {
      e.target.classList.add('open');
      answer.style.display = 'block';
    }
  }
});

// ══════════════════════════════════════════════════════════════
//  CONTACT FORM
// ══════════════════════════════════════════════════════════════
function handleContactSubmit(e) {
  e.preventDefault();
  const btn = e.target;
  btn.textContent = '✓ Message sent!';
  btn.style.background = 'var(--green)';
  setTimeout(() => { btn.textContent = 'Send Message'; btn.style.background = ''; }, 3000);
}

// ══════════════════════════════════════════════════════════════
//  INIT
// ══════════════════════════════════════════════════════════════
window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('movieSearch')?.addEventListener('input', applyFilters);
  document.getElementById('genreFilter')?.addEventListener('change', applyFilters);

  loadMovies();

  if (window.location.hash === '#analytics') {
    showTab('analytics');
  }
});
