/**
 * App Hub data — edit this file to add, remove, or update projects.
 *
 * Fields
 *   id        unique slug
 *   name      display name
 *   category  one of the keys in CATEGORIES
 *   desc      one-line description
 *   url       live app URL (null if not deployed)
 *   repo      GitHub repo URL (null if unknown/private and unlinked)
 *   private   true if the repo is private
 *   host      "Vercel" | "GitHub Pages" | "Railway" | null
 *   status    "live" | "repo" (code only) | "wip" (in progress, nothing public yet)
 *   stack     array of tech tags
 *   added     ISO date (approx.) used for "Newest" sort
 *   note      optional small footnote shown on the card
 */

window.CATEGORIES = {
  pool:   { label: "Pool & Billiards",       icon: "🎱", accent: "#22c55e" },
  music:  { label: "Music & Guitar",         icon: "🎸", accent: "#f59e0b" },
  ai:     { label: "Productivity & AI Agents", icon: "🤖", accent: "#8b5cf6" },
  life:   { label: "Explore & Lifestyle",    icon: "🧭", accent: "#06b6d4" },
  pro:    { label: "Portfolio & Open Source", icon: "💼", accent: "#3b82f6" },
};

window.APPS = [
  // ── Pool & Billiards ─────────────────────────────────────────
  {
    id: "apa-stats", name: "APA Stats", category: "pool",
    desc: "Private league stats site — bookmarklet ingestion, team/player profiles, Equalizer lab and Claude agents.",
    url: "https://apa-stats-liard.vercel.app/",
    repo: "https://github.com/mathcodes/apa-stats", private: true,
    host: "Vercel", status: "live",
    stack: ["Next.js", "Neon Postgres", "Drizzle", "Claude"], added: "2026-11-01",
    note: "Password sign-in",
  },
  {
    id: "billiards-toolkit", name: "Billiards Toolkit", category: "pool",
    desc: "APA 9-ball strategy, counter-picker, schedules, rosters and live match tracker for Up To No Good.",
    url: "https://billiards-toolkit.vercel.app",
    repo: null, private: true,
    host: "Vercel", status: "live",
    stack: ["Web", "APA"], added: "2026-09-02",
  },
  {
    id: "billiards-drills", name: "Billiards Drills", category: "pool",
    desc: "Practice drill library for structured table time.",
    url: "https://billiards-drills-three.vercel.app",
    repo: null, private: true,
    host: "Vercel", status: "live",
    stack: ["Web"], added: "2026-03-21",
  },
  {
    id: "pool-cue-guide", name: "Pool Cue Guide", category: "pool",
    desc: "Upload a table photo, review detected balls, and get the best three shots — including safeties.",
    url: "https://pool-cue-guide-production.up.railway.app",
    repo: "https://github.com/mathcodes/pool-cue-guide", private: false,
    host: "Railway", status: "live",
    stack: ["Python", "OpenCV"], added: "2026-11-26",
  },
  {
    id: "putting-up", name: "Putting Up", category: "pool",
    desc: "Live APA lineup tool enforcing the 23 skill-level cap across 8-Ball and 9-Ball.",
    url: "https://mathcodes.github.io/putting-up/",
    repo: "https://github.com/mathcodes/putting-up", private: false,
    host: "GitHub Pages", status: "live",
    stack: ["HTML", "JS", "IndexedDB"], added: "2026-11-19",
  },
  {
    id: "pocket-school", name: "Pocket School", category: "pool",
    desc: "Adaptive billiards training in your hand.",
    url: "https://mathcodes.github.io/Pocket-School/",
    repo: "https://github.com/mathcodes/Pocket-School", private: false,
    host: "GitHub Pages", status: "live",
    stack: ["JavaScript"], added: "2026-09-01",
  },
  {
    id: "bank-shot", name: "Bank Shot Visualizer", category: "pool",
    desc: "React physics sim for bank shots — english, draw, follow and pocket detection.",
    url: null, repo: null, private: false,
    host: null, status: "wip",
    stack: ["React", "Physics"], added: "2026-08-01",
  },
  {
    id: "tourney-finder", name: "Pool Tourney Finder", category: "pool",
    desc: "Find upcoming tournaments within a driving radius from AZBilliards, FargoRate and user entries.",
    url: null, repo: null, private: false,
    host: null, status: "wip",
    stack: ["FastAPI", "SQLite", "Azure Functions"], added: "2026-08-28",
  },

  // ── Music & Guitar ───────────────────────────────────────────
  {
    id: "guitar-mastery-ai", name: "Guitar Mastery AI", category: "music",
    desc: "Multi-agent guitar platform — Jazz Teacher, Luthier & Historian, SQL Data Explorer, Dev/PM.",
    url: "https://guitar-mastery-ai.vercel.app",
    repo: "https://github.com/mathcodes/guitar-mastery-ai", private: false,
    host: "Vercel", status: "live",
    stack: ["Python", "FastAPI", "Claude"], added: "2026-02-07",
  },
  {
    id: "fretboard", name: "Fretboard Scale Visualizer", category: "music",
    desc: "Scale notes on the fretboard across many tunings, keys and scale types.",
    url: "https://guitar-resources-rouge.vercel.app",
    repo: "https://github.com/mathcodes/guitar_resources", private: true,
    host: "Vercel", status: "live",
    stack: ["Web"], added: "2026-03-21",
  },
  {
    id: "pedalboard", name: "Pedalboard Designer", category: "music",
    desc: "Drag-and-drop signal chain builder with orthogonal cable routing and power budget estimates.",
    url: "https://mathcodes.github.io/pedalboard-designer/",
    repo: "https://github.com/mathcodes/pedalboard-designer", private: false,
    host: "GitHub Pages", status: "live",
    stack: ["JavaScript", "SVG"], added: "2026-08-01",
  },
  {
    id: "quick-songs", name: "Quick Songs", category: "music",
    desc: "Song and chord reference for live sets.",
    url: "https://mathcodes.github.io/quick_songs/",
    repo: "https://github.com/mathcodes/quick_songs", private: false,
    host: "GitHub Pages", status: "live",
    stack: ["HTML"], added: "2026-07-10",
  },
  {
    id: "setlist", name: "Setlist Reference", category: "music",
    desc: "Touch-friendly gig setlist site with chord progressions and a drag-and-drop set builder.",
    url: null, repo: null, private: false,
    host: null, status: "wip",
    stack: ["HTML", "localStorage"], added: "2026-08-01",
    note: "Pages deploy pending",
  },

  // ── Productivity & AI Agents ────────────────────────────────
  {
    id: "day-by-datum", name: "day_by_datum", category: "ai",
    desc: "Personal accountability app — three daily checkpoints with email check-ins and Done/Missed buttons.",
    url: "https://day-by-datum.vercel.app",
    repo: "https://github.com/mathcodes/day_by_datum", private: false,
    host: "Vercel", status: "live",
    stack: ["Vercel", "Resend", "Webhooks"], added: "2026-09-26",
    note: "Also datavita.me (jon branch)",
  },
  {
    id: "taskhub", name: "TaskHub", category: "ai",
    desc: "Multi-agent operations hub for tasks and workflows.",
    url: "https://taskhub-blue-seven.vercel.app",
    repo: "https://github.com/mathcodes/taskhub", private: false,
    host: "Vercel", status: "live",
    stack: ["TypeScript", "Agents"], added: "2026-10-24",
  },
  {
    id: "agent-ops-sandbox", name: "Agent Ops Sandbox", category: "ai",
    desc: "Sandbox repo for agentic repo operations.",
    url: null,
    repo: "https://github.com/mathcodes/agent-ops-sandbox", private: false,
    host: null, status: "repo",
    stack: ["Agents"], added: "2026-10-03",
  },
  {
    id: "mvc-agent", name: "MVC Agent", category: "ai",
    desc: "ASP.NET Core MVC app that sends a prompt to a chat completions API and renders the response.",
    url: null,
    repo: "https://github.com/mathcodes/mvc_agent", private: false,
    host: null, status: "repo",
    stack: ["C#", ".NET", "MVC"], added: "2026-10-02",
  },
  {
    id: "repo-manager", name: "repo_manager", category: "ai",
    desc: "Agentic GitHub manager — coder, reviewer and deploy-to-Vercel agents.",
    url: null, repo: null, private: false,
    host: null, status: "wip",
    stack: ["Agents", "GitHub", "Vercel"], added: "2026-10-03",
  },

  // ── Explore & Lifestyle ─────────────────────────────────────
  {
    id: "forage-finder", name: "Forage Finder", category: "life",
    desc: "Location-based foraging map with emoji pins, toggles and iNaturalist sightings.",
    url: "https://mathcodes.github.io/forage-finder/",
    repo: "https://github.com/mathcodes/forage-finder", private: false,
    host: "GitHub Pages", status: "live",
    stack: ["Leaflet", "OSM", "iNaturalist"], added: "2026-11-24",
  },
  {
    id: "offramp", name: "OffRamp", category: "life",
    desc: "Car buying and selling — Claude agents search CarGurus, Autotrader, dealers and more by your criteria, ZIP and radius, then dedupe and filter the results.",
    url: null,
    repo: "https://github.com/mathcodes/OffRamp", private: false,
    host: null, status: "repo",
    stack: ["Next.js", "TypeScript", "Claude"], added: "2026-10-27",
    note: "Buy side built; sell / trade-in coming",
  },

  // ── Portfolio & Open Source ─────────────────────────────────
  {
    id: "portfolio", name: "jonchristie.net", category: "pro",
    desc: "Personal portfolio.",
    url: "https://jonchristie.net",
    repo: null, private: false,
    host: null, status: "live",
    stack: ["Portfolio"], added: "2026-10-22",
  },
  {
    id: "contentfordevelopers", name: "Content for Developers", category: "pro",
    desc: "Open-source LeetCode solution bank with diagrams, GIFs and notes to understand each problem.",
    url: null,
    repo: "https://github.com/mathcodes/contentfordevelopers", private: false,
    host: null, status: "repo",
    stack: ["JavaScript", "Open Source"], added: "2022-05-27",
  },
];
