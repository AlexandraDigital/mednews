import { useState } from "react";

const TOPICS = [
  { label: "AI & Diagnostics", icon: "🧠", query: "AI artificial intelligence medical diagnostics 2026" },
  { label: "Wearables", icon: "⌚", query: "medical wearable health tech devices 2026" },
  { label: "Gene Therapy", icon: "🧬", query: "gene therapy CRISPR treatment breakthrough 2026" },
  { label: "Robotics & Surgery", icon: "🤖", query: "robotic surgery medical robotics latest 2026" },
  { label: "Mental Health Tech", icon: "💙", query: "mental health technology digital therapeutics 2026" },
  { label: "Cancer Research", icon: "🔬", query: "cancer treatment research breakthrough 2026" },
];

const SOURCE_ICONS = {
  journal: "📄",
  institution: "🏛️",
  company: "🏢",
  agency: "🏛️",
  conference: "🎤",
};

const STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #f5f0e8; --surface: #fffef9; --ink: #1a1208;
    --muted: #6b5e4a; --accent: #c94f2c; --accent2: #2c6e49;
    --accent3: #1d4e7a; --border: #d4c9b5; --tag-bg: #e8e0d0;
  }
  body { background: var(--bg); color: var(--ink); font-family: 'DM Sans', sans-serif; }
  .app { min-height: 100vh; max-width: 920px; margin: 0 auto; padding: 48px 24px 80px; }
  header { margin-bottom: 48px; border-bottom: 1.5px solid var(--border); padding-bottom: 32px; }
  .overline { font-size: 11px; font-weight: 600; letter-spacing: 0.18em; text-transform: uppercase; color: var(--accent); margin-bottom: 10px; }
  h1 { font-family: 'DM Serif Display', serif; font-size: clamp(2.2rem, 5vw, 3.4rem); line-height: 1.1; color: var(--ink); max-width: 600px; }
  h1 em { font-style: italic; color: var(--accent); }
  .subtitle { margin-top: 14px; font-size: 15px; color: var(--muted); max-width: 520px; line-height: 1.6; }
  .badge { display: inline-flex; align-items: center; gap: 6px; margin-top: 14px; padding: 5px 12px; background: #e8f4ed; border: 1px solid #b6d9c3; border-radius: 100px; font-size: 12px; font-weight: 600; color: var(--accent2); }
  .topics { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 36px; }
  .topic-btn { display: inline-flex; align-items: center; gap: 7px; padding: 9px 18px; border-radius: 100px; border: 1.5px solid var(--border); background: var(--surface); font-family: 'DM Sans', sans-serif; font-size: 13.5px; font-weight: 500; color: var(--muted); cursor: pointer; transition: all 0.18s ease; }
  .topic-btn:hover { border-color: var(--accent); color: var(--accent); background: #fdf2ee; }
  .topic-btn.active { background: var(--accent); border-color: var(--accent); color: white; }
  .topic-btn:disabled { opacity: 0.5; cursor: not-allowed; }
  .search-row { display: flex; gap: 10px; margin-bottom: 40px; }
  .search-input { flex: 1; padding: 13px 18px; border: 1.5px solid var(--border); border-radius: 8px; background: var(--surface); font-family: 'DM Sans', sans-serif; font-size: 14px; color: var(--ink); outline: none; transition: border-color 0.15s; }
  .search-input:focus { border-color: var(--accent); }
  .search-input::placeholder { color: var(--muted); }
  .search-btn { padding: 13px 26px; background: var(--accent); color: white; border: none; border-radius: 8px; font-family: 'DM Sans', sans-serif; font-weight: 600; font-size: 14px; cursor: pointer; transition: opacity 0.15s; white-space: nowrap; }
  .search-btn:hover { opacity: 0.88; }
  .search-btn:disabled { opacity: 0.5; cursor: not-allowed; }
  .loading { text-align: center; padding: 60px 20px; }
  .pulse { display: inline-block; width: 40px; height: 40px; border: 2.5px solid var(--accent); border-top-color: transparent; border-radius: 50%; animation: spin 0.8s linear infinite; margin-bottom: 18px; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .loading-label { font-size: 13px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--muted); }
  .results-header { display: flex; align-items: center; gap: 12px; margin-bottom: 28px; flex-wrap: wrap; }
  .results-title { font-family: 'DM Serif Display', serif; font-size: 1.5rem; color: var(--ink); }
  .results-meta { font-size: 12px; color: var(--muted); letter-spacing: 0.05em; text-transform: uppercase; }
  .item-count { font-size: 12px; color: var(--surface); background: var(--muted); padding: 2px 8px; border-radius: 100px; }

  .summary-card { background: var(--surface); border: 1.5px solid var(--border); border-radius: 14px; padding: 36px; margin-bottom: 32px; position: relative; overflow: hidden; }
  .summary-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: linear-gradient(90deg, var(--accent), #e8834f); }
  .summary-label { font-size: 10px; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; color: var(--accent); margin-bottom: 16px; }
  .summary-text { font-size: 15px; line-height: 1.8; color: var(--ink); }
  .summary-text p { margin-bottom: 16px; }
  .summary-text p:last-child { margin-bottom: 0; }

  .news-grid { display: grid; gap: 20px; }
  .news-item { background: var(--surface); border: 1.5px solid var(--border); border-radius: 14px; padding: 26px 28px; transition: box-shadow 0.18s, border-color 0.18s; }
  .news-item:hover { box-shadow: 0 6px 24px rgba(0,0,0,0.08); border-color: #bfb3a0; }
  .news-item-header { display: flex; gap: 16px; align-items: flex-start; margin-bottom: 14px; }
  .news-num { font-family: 'DM Serif Display', serif; font-size: 1.8rem; color: var(--border); line-height: 1; flex-shrink: 0; width: 30px; }
  .news-headline { font-weight: 600; font-size: 16px; line-height: 1.4; color: var(--ink); }
  .news-desc { font-size: 14px; color: var(--ink); line-height: 1.75; margin-bottom: 12px; }
  .news-impact { font-size: 13.5px; color: var(--accent3); line-height: 1.65; background: #eef4fa; border-left: 3px solid var(--accent3); padding: 10px 14px; border-radius: 0 6px 6px 0; margin-bottom: 16px; }
  .news-impact-label { font-size: 10px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--accent3); margin-bottom: 4px; }

  .news-footer { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
  .source-badge { display: inline-flex; align-items: center; gap: 5px; font-size: 12px; font-weight: 500; color: var(--muted); background: var(--tag-bg); padding: 4px 10px; border-radius: 100px; }
  .read-more { display: inline-flex; align-items: center; gap: 5px; font-size: 12.5px; font-weight: 600; color: var(--accent); text-decoration: none; padding: 5px 12px; border: 1.5px solid var(--accent); border-radius: 100px; transition: all 0.15s; margin-left: auto; }
  .read-more:hover { background: var(--accent); color: white; }
  .read-more svg { width: 11px; height: 11px; }

  .tags { display: flex; flex-wrap: wrap; gap: 6px; }
  .tag { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; padding: 3px 9px; border-radius: 100px; background: var(--tag-bg); color: var(--muted); }
  .tag.hot { background: #fde8e2; color: var(--accent); }
  .tag.new { background: #e2f0e8; color: var(--accent2); }

  .error-card { background: #fff5f3; border: 1.5px solid #f5c5bb; border-radius: 12px; padding: 20px 24px; color: var(--accent); font-size: 14px; line-height: 1.6; }
  .empty { text-align: center; padding: 80px 20px; color: var(--muted); font-size: 15px; }
  .empty-icon { font-size: 3rem; margin-bottom: 14px; }
`;

export default function App() {
  const [activeTopic, setActiveTopic] = useState(null);
  const [customQuery, setCustomQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSearch = async (queryOverride) => {
    const query = queryOverride || customQuery.trim();
    if (!query) return;
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const response = await fetch("/api/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const data = await response.json();
      if (!response.ok || data.error) throw new Error(data.error || "Unexpected error from server.");
      setResult({ ...data, topic: query });
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleTopicClick = (topic) => {
    setActiveTopic(topic.label);
    setCustomQuery("");
    handleSearch(topic.query);
  };

  return (
    <>
      <style>{STYLE}</style>
      <div className="app">
        <header>
          <div className="overline">In-Depth Research Digest</div>
          <h1>Medical <em>Technology</em> News</h1>
          <p className="subtitle">
            Detailed briefings on the latest breakthroughs, clinical trials, and innovations — with sources and links to read more.
          </p>
          <div className="badge">⚡ Groq · llama-3.3-70b-versatile</div>
        </header>

        <div className="topics">
          {TOPICS.map((t) => (
            <button
              key={t.label}
              className={`topic-btn ${activeTopic === t.label ? "active" : ""}`}
              onClick={() => handleTopicClick(t)}
              disabled={loading}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        <div className="search-row">
          <input
            className="search-input"
            placeholder="Or type your own topic, e.g. 'smart insulin delivery'…"
            value={customQuery}
            onChange={(e) => { setCustomQuery(e.target.value); setActiveTopic(null); }}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            disabled={loading}
          />
          <button className="search-btn" onClick={() => handleSearch()} disabled={loading || !customQuery.trim()}>
            Search
          </button>
        </div>

        {loading && (
          <div className="loading">
            <div className="pulse" />
            <p className="loading-label">Generating in-depth briefing…</p>
          </div>
        )}

        {error && <div className="error-card">⚠️ {error}</div>}

        {result && !loading && (
          <>
            <div className="results-header">
              <h2 className="results-title">Full Briefing</h2>
              <span className="results-meta">{new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
              <span className="item-count">{result.items?.length} items</span>
            </div>

            <div className="summary-card">
              <div className="summary-label">Overview</div>
              <div className="summary-text">
                {result.summary.split("\n").filter(Boolean).map((p, i) => <p key={i}>{p}</p>)}
              </div>
            </div>

            <div className="news-grid">
              {result.items.map((item, i) => (
                <div className="news-item" key={i}>
                  <div className="news-item-header">
                    <div className="news-num">0{i + 1}</div>
                    <div className="news-headline">{item.headline}</div>
                  </div>

                  <p className="news-desc">{item.description}</p>

                  {item.impact && (
                    <div className="news-impact">
                      <div className="news-impact-label">Clinical / Commercial Impact</div>
                      {item.impact}
                    </div>
                  )}

                  <div className="news-footer">
                    {item.source && (
                      <span className="source-badge">
                        {SOURCE_ICONS[item.sourceType] || "📌"} {item.source}
                      </span>
                    )}
                    <div className="tags">
                      {item.isHot && <span className="tag hot">🔥 Hot</span>}
                      {item.isNew && <span className="tag new">✦ New</span>}
                      {(item.tags || []).map((tag, j) => (
                        <span key={j} className="tag">{tag}</span>
                      ))}
                    </div>
                    {item.url && (
                      <a className="read-more" href={item.url} target="_blank" rel="noopener noreferrer">
                        Read more
                        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M1 11L11 1M11 1H4M11 1V8"/>
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {!loading && !result && !error && (
          <div className="empty">
            <div className="empty-icon">🔬</div>
            <p>Pick a topic above or search anything medical tech.</p>
          </div>
        )}
      </div>
    </>
  );
}
