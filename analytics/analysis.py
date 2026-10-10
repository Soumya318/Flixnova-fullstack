"""
FlixNova — Data Analysis & ML Pipeline
======================================
Author : Soumya Gupta

This script covers:
  1. Exploratory data analysis (EDA) on a movie dataset
  2. Content-based recommendations (TF-IDF + cosine similarity)
  3. Sentiment analysis of user reviews (TextBlob polarity)
  4. Visualisations with matplotlib and seaborn

Run:
  pip install -r requirements.txt
  python analysis.py
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
import seaborn as sns
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from textblob import TextBlob

# ──────────────────────────────────────────────────────────────
#  1. DATASET
# ──────────────────────────────────────────────────────────────

movies = pd.DataFrame([
    {"title": "Inception",              "genre": "action sci-fi thriller",    "year": 2010, "director": "Christopher Nolan", "runtime": 148, "imdb": 8.8, "keywords": "dream heist mind reality"},
    {"title": "The Dark Knight",        "genre": "action crime drama",        "year": 2008, "director": "Christopher Nolan", "runtime": 152, "imdb": 9.0, "keywords": "batman joker gotham villain"},
    {"title": "Interstellar",           "genre": "sci-fi drama adventure",    "year": 2014, "director": "Christopher Nolan", "runtime": 169, "imdb": 8.6, "keywords": "space time wormhole gravity"},
    {"title": "Parasite",               "genre": "drama thriller crime",      "year": 2019, "director": "Bong Joon Ho",      "runtime": 132, "imdb": 8.5, "keywords": "class family poverty deception"},
    {"title": "Avengers: Endgame",      "genre": "action sci-fi adventure",   "year": 2019, "director": "Russo Brothers",   "runtime": 181, "imdb": 8.4, "keywords": "avengers marvel thanos time travel"},
    {"title": "The Lion King",          "genre": "animation drama family",    "year": 1994, "director": "Roger Allers",     "runtime": 88,  "imdb": 8.5, "keywords": "lion africa king pride"},
    {"title": "Frozen",                 "genre": "animation family comedy",   "year": 2013, "director": "Chris Buck",       "runtime": 102, "imdb": 7.4, "keywords": "ice magic sister princess"},
    {"title": "Joker",                  "genre": "crime drama thriller",      "year": 2019, "director": "Todd Phillips",    "runtime": 122, "imdb": 8.4, "keywords": "joker gotham villain origin clown"},
    {"title": "Black Panther",          "genre": "action sci-fi adventure",   "year": 2018, "director": "Ryan Coogler",     "runtime": 134, "imdb": 7.3, "keywords": "wakanda african king vibranium"},
    {"title": "Spider-Man: No Way Home","genre": "action sci-fi adventure",   "year": 2021, "director": "Jon Watts",        "runtime": 148, "imdb": 8.2, "keywords": "spider man multiverse marvel"},
    {"title": "Toy Story 4",            "genre": "animation family comedy",   "year": 2019, "director": "Josh Cooley",      "runtime": 100, "imdb": 7.7, "keywords": "toys woody buzz friendship"},
    {"title": "The Matrix",             "genre": "sci-fi action thriller",    "year": 1999, "director": "Wachowski Sisters","runtime": 136, "imdb": 8.7, "keywords": "simulation reality hacker AI"},
    {"title": "Titanic",                "genre": "drama romance history",     "year": 1997, "director": "James Cameron",    "runtime": 194, "imdb": 7.9, "keywords": "ship ocean romance tragedy"},
    {"title": "Avatar",                 "genre": "sci-fi action adventure",   "year": 2009, "director": "James Cameron",    "runtime": 162, "imdb": 7.9, "keywords": "alien planet nature battle"},
    {"title": "The Godfather",          "genre": "crime drama",               "year": 1972, "director": "Francis Coppola",  "runtime": 175, "imdb": 9.2, "keywords": "mafia family power crime loyalty"},
    {"title": "The Shawshank Redemption","genre":"drama crime",              "year": 1994, "director": "Frank Darabont",   "runtime": 142, "imdb": 9.3, "keywords": "prison hope friendship freedom"},
    {"title": "Forrest Gump",           "genre": "drama comedy romance",      "year": 1994, "director": "Robert Zemeckis",  "runtime": 142, "imdb": 8.8, "keywords": "life journey history love"},
    {"title": "Pulp Fiction",           "genre": "crime drama thriller",      "year": 1994, "director": "Quentin Tarantino","runtime": 154, "imdb": 8.9, "keywords": "crime dialogue hitman redemption"},
    {"title": "Fight Club",             "genre": "drama thriller",            "year": 1999, "director": "David Fincher",    "runtime": 139, "imdb": 8.8, "keywords": "identity rebellion anarchy twist"},
    {"title": "Star Wars: A New Hope",  "genre": "sci-fi action adventure",   "year": 1977, "director": "George Lucas",     "runtime": 121, "imdb": 8.6, "keywords": "space jedi force empire"},
    {"title": "The Avengers",           "genre": "action sci-fi adventure",   "year": 2012, "director": "Joss Whedon",      "runtime": 143, "imdb": 8.0, "keywords": "avengers marvel team alien invasion"},
    {"title": "Guardians of the Galaxy","genre": "action sci-fi comedy",      "year": 2014, "director": "James Gunn",       "runtime": 121, "imdb": 8.0, "keywords": "space team comedy alien galaxy"},
    {"title": "Deadpool",               "genre": "action comedy sci-fi",      "year": 2016, "director": "Tim Miller",       "runtime": 108, "imdb": 8.0, "keywords": "antihero mercenary comedy fourth wall"},
    {"title": "Shang-Chi",              "genre": "action adventure sci-fi",   "year": 2021, "director": "Destin Cretton",   "runtime": 132, "imdb": 7.4, "keywords": "martial arts chinese marvel rings"},
])

print("="*60)
print("  FLIXNOVA — DATA ANALYSIS REPORT")
print("="*60)

# ──────────────────────────────────────────────────────────────
#  2. EDA — EXPLORATORY DATA ANALYSIS
# ──────────────────────────────────────────────────────────────

print("\n📊 Basic Statistics:")
print(movies[['year', 'runtime', 'imdb']].describe().round(2))

print(f"\n🎬 Total movies       : {len(movies)}")
print(f"⭐ Avg IMDb rating    : {movies['imdb'].mean():.2f}")
print(f"⏱  Avg runtime (mins) : {movies['runtime'].mean():.1f}")
print(f"📅 Year range         : {movies['year'].min()} – {movies['year'].max()}")

# Genre frequency analysis (each movie can have multiple genres)
genre_series = movies['genre'].str.split().explode()
genre_counts = genre_series[genre_series.str.len() > 2].value_counts()
print(f"\n🎭 Top genres:\n{genre_counts.head(6).to_string()}")

# Director with most films
director_counts = movies['director'].value_counts()
print(f"\n🎬 Most featured director: {director_counts.index[0]} ({director_counts.iloc[0]} films)")

# Correlation: runtime vs IMDb rating
corr = movies['runtime'].corr(movies['imdb'])
print(f"\n🔗 Runtime ↔ IMDb correlation: {corr:.3f}")

# ──────────────────────────────────────────────────────────────
#  3. ML — CONTENT-BASED RECOMMENDATION SYSTEM
# ──────────────────────────────────────────────────────────────

print("\n" + "="*60)
print("  ML RECOMMENDATION ENGINE (TF-IDF + Cosine Similarity)")
print("="*60)

# Build feature corpus (genre + director + keywords)
movies['corpus'] = movies['genre'] + ' ' + movies['director'].str.lower() + ' ' + movies['keywords']

# Fit TF-IDF vectorizer
tfidf    = TfidfVectorizer(stop_words='english', ngram_range=(1, 2))
tfidf_matrix = tfidf.fit_transform(movies['corpus'])

print(f"\n✅ TF-IDF matrix shape : {tfidf_matrix.shape}")
print(f"   Vocabulary size     : {len(tfidf.vocabulary_)}")

# Compute cosine similarity matrix
cosine_sim = cosine_similarity(tfidf_matrix, tfidf_matrix)
indices    = pd.Series(movies.index, index=movies['title']).drop_duplicates()

def get_recommendations(title, n=5):
    """
    Return top-N most similar movies to the given title.
    Uses TF-IDF vectorized corpus and cosine similarity.
    """
    if title not in indices:
        return pd.DataFrame(columns=['title', 'similarity'])
    idx    = indices[title]
    scores = list(enumerate(cosine_sim[idx]))
    scores = sorted(scores, key=lambda x: x[1], reverse=True)[1:n+1]
    movie_indices = [i[0] for i in scores]
    result = movies.iloc[movie_indices][['title', 'genre', 'imdb']].copy()
    result['similarity'] = [round(s[1], 3) for s in scores]
    return result.reset_index(drop=True)

# Demo recommendations
test_movie = "Inception"
print(f"\n🤖 Movies similar to '{test_movie}':")
recs = get_recommendations(test_movie)
print(recs.to_string(index=False))

test_movie2 = "The Godfather"
print(f"\n🤖 Movies similar to '{test_movie2}':")
recs2 = get_recommendations(test_movie2)
print(recs2.to_string(index=False))

# ──────────────────────────────────────────────────────────────
#  4. NLP — SENTIMENT ANALYSIS
# ──────────────────────────────────────────────────────────────

print("\n" + "="*60)
print("  NLP SENTIMENT ANALYSIS (TextBlob)")
print("="*60)

sample_reviews = [
    ("Inception is absolutely mind-blowing! A masterpiece of modern cinema.", "Inception"),
    ("Terrible movie. Waste of time, boring and completely predictable.", "Generic Film"),
    ("The movie was okay, nothing special but not bad either.", "Average Movie"),
    ("The Dark Knight is perhaps the greatest superhero film ever made.", "The Dark Knight"),
    ("Avatar looked beautiful but the story was disappointingly shallow.", "Avatar"),
]

print(f"\n{'Review':<55} {'Polarity':>9} {'Sentiment':>12}")
print("-" * 80)

results = []
for review, movie in sample_reviews:
    blob       = TextBlob(review)
    polarity   = round(blob.sentiment.polarity, 3)
    subj       = round(blob.sentiment.subjectivity, 3)
    label      = "Positive" if polarity > 0.1 else "Negative" if polarity < -0.1 else "Neutral"
    short      = (review[:52] + "...") if len(review) > 52 else review
    print(f"{short:<55} {polarity:>9.3f} {label:>12}")
    results.append({'movie': movie, 'polarity': polarity, 'subjectivity': subj, 'sentiment': label})

sentiment_df = pd.DataFrame(results)
print(f"\n📈 Sentiment distribution:")
print(sentiment_df['sentiment'].value_counts().to_string())

# ──────────────────────────────────────────────────────────────
#  5. VISUALIZATIONS
# ──────────────────────────────────────────────────────────────

plt.style.use('dark_background')
fig, axes = plt.subplots(2, 3, figsize=(16, 10))
fig.patch.set_facecolor('#0a0a0f')
fig.suptitle('FlixNova — Data Analytics Dashboard', fontsize=16, color='#f1f0ff', y=1.01, fontweight='bold')

PALETTE = ['#7c6ff7','#2dd4bf','#fbbf24','#f87171','#a78bfa','#34d399','#60a5fa','#fb923c']

# 5.1 Genre Distribution
ax1 = axes[0, 0]
genre_counts.head(8).plot(kind='bar', ax=ax1, color=PALETTE, edgecolor='none')
ax1.set_title('Genre Distribution', color='#f1f0ff', fontsize=11)
ax1.set_facecolor('#10101a')
ax1.tick_params(colors='#8b8aa8', rotation=30)
ax1.set_xlabel(''); ax1.set_ylabel('Count', color='#8b8aa8')
ax1.spines[:].set_color('#16162a')

# 5.2 IMDb Rating Distribution
ax2 = axes[0, 1]
ax2.hist(movies['imdb'], bins=8, color='#7c6ff7', edgecolor='#0a0a0f', rwidth=0.85)
ax2.set_title('IMDb Rating Distribution', color='#f1f0ff', fontsize=11)
ax2.set_facecolor('#10101a')
ax2.tick_params(colors='#8b8aa8')
ax2.set_xlabel('IMDb Rating', color='#8b8aa8')
ax2.set_ylabel('Count', color='#8b8aa8')
ax2.spines[:].set_color('#16162a')

# 5.3 Release Year Timeline
ax3 = axes[0, 2]
decade_counts = movies.groupby(movies['year'] // 10 * 10).size()
decade_counts.index = [f"{d}s" for d in decade_counts.index]
ax3.plot(decade_counts.index, decade_counts.values, color='#2dd4bf', linewidth=2.5, marker='o', markersize=7)
ax3.fill_between(decade_counts.index, decade_counts.values, alpha=0.15, color='#2dd4bf')
ax3.set_title('Movies per Decade', color='#f1f0ff', fontsize=11)
ax3.set_facecolor('#10101a')
ax3.tick_params(colors='#8b8aa8', rotation=30)
ax3.set_ylabel('Count', color='#8b8aa8')
ax3.spines[:].set_color('#16162a')

# 5.4 Runtime vs IMDb Scatter
ax4 = axes[1, 0]
scatter = ax4.scatter(movies['runtime'], movies['imdb'], c=movies['year'], cmap='plasma', s=80, alpha=0.8)
ax4.set_title('Runtime vs IMDb Rating', color='#f1f0ff', fontsize=11)
ax4.set_facecolor('#10101a')
ax4.tick_params(colors='#8b8aa8')
ax4.set_xlabel('Runtime (min)', color='#8b8aa8')
ax4.set_ylabel('IMDb Rating', color='#8b8aa8')
ax4.spines[:].set_color('#16162a')
cbar = plt.colorbar(scatter, ax=ax4)
cbar.ax.tick_params(colors='#8b8aa8', labelsize=8)
cbar.set_label('Year', color='#8b8aa8', fontsize=9)

# 5.5 Cosine Similarity Heatmap (top 10 movies)
ax5 = axes[1, 1]
top10   = movies.head(10)['title'].tolist()
top_idx = [indices[t] for t in top10]
sim_sub = cosine_sim[np.ix_(top_idx, top_idx)]
short_labels = [t.split(':')[0][:12] for t in top10]
im = ax5.imshow(sim_sub, cmap='RdPu', aspect='auto', vmin=0, vmax=1)
ax5.set_xticks(range(10)); ax5.set_yticks(range(10))
ax5.set_xticklabels(short_labels, rotation=45, ha='right', fontsize=7, color='#8b8aa8')
ax5.set_yticklabels(short_labels, fontsize=7, color='#8b8aa8')
ax5.set_title('Similarity Heatmap (top 10)', color='#f1f0ff', fontsize=11)
ax5.set_facecolor('#10101a')
plt.colorbar(im, ax=ax5).ax.tick_params(colors='#8b8aa8', labelsize=8)

# 5.6 Sentiment Analysis
ax6 = axes[1, 2]
sentiment_colors = {'Positive':'#34d399','Neutral':'#8b8aa8','Negative':'#f87171'}
s_counts = sentiment_df['sentiment'].value_counts()
bars = ax6.bar(s_counts.index, s_counts.values, color=[sentiment_colors[s] for s in s_counts.index], edgecolor='none', width=0.5)
ax6.set_title('Sentiment Distribution', color='#f1f0ff', fontsize=11)
ax6.set_facecolor('#10101a')
ax6.tick_params(colors='#8b8aa8')
ax6.set_ylabel('Count', color='#8b8aa8')
ax6.spines[:].set_color('#16162a')
for bar in bars:
    ax6.text(bar.get_x() + bar.get_width()/2., bar.get_height() + 0.05,
             str(int(bar.get_height())), ha='center', va='bottom', color='#f1f0ff', fontsize=10)

plt.tight_layout(pad=2.0)
plt.savefig('flixnova_analytics.png', dpi=150, bbox_inches='tight', facecolor='#0a0a0f')
print("\n✅ Saved chart to flixnova_analytics.png")
plt.show()

print("\n" + "="*60)
print("  ANALYSIS COMPLETE")
print("="*60)
print("""
Key Findings:
  • Most common genre  : Action / Sci-Fi
  • Highest rated film : The Shawshank Redemption (9.3)
  • Average IMDb score : 8.4 (high-quality catalog)
  • Runtime ↔ IMDb corr: Slightly positive (longer ≠ worse)
  • Recommendation algo: TF-IDF cosine similarity (sklearn)
  • Sentiment engine   : TextBlob polarity scoring (-1 to +1)

Python Stack Used:
  pandas      — data loading, wrangling, EDA
  scikit-learn — TF-IDF vectorization, cosine similarity
  matplotlib  — visualizations and charts
  TextBlob    — NLP sentiment analysis
""")
