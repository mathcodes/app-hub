(() => {
  "use strict";

  const CATS = window.CATEGORIES;
  const APPS = window.APPS;
  const $ = (s, el = document) => el.querySelector(s);

  // ── Safe storage (artifact/private-mode tolerant) ───────────
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
  };

  // ── State (also mirrored to the URL hash so views are shareable) ─
  const params = new URLSearchParams(location.hash.slice(1));
  const state = {
    q: params.get("q") || "",
    cat: params.get("cat") || "all",
    status: params.get("status") || "all",
    sort: params.get("sort") || store.get("apphub-sort", "category"),
    view: store.get("apphub-view", "grid"),
    favs: new Set(store.get("apphub-favs", [])),
    ping: {}, // id -> "checking" | "up" | "down"
  };

  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const initials = (name) => name.replace(/[_-]/g, " ").split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join("");
  const hostOf = (u) => { try { return new URL(u).host.replace(/^www\./, ""); } catch { return ""; } };

  const STATUS_LABEL = { live: "Live", repo: "Code", wip: "In progress" };

  const icons = {
    open: '<svg viewBox="0 0 24 24" width="15" height="15"><path d="M14 4h6v6M20 4l-9 9M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5"/></svg>',
    gh: '<svg viewBox="0 0 24 24" width="15" height="15"><path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21"/></svg>',
    lock: '<svg viewBox="0 0 24 24" width="14" height="14"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>',
    copy: '<svg viewBox="0 0 24 24" width="15" height="15"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1"/></svg>',
    star: '<svg viewBox="0 0 24 24" width="16" height="16"><path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.3 6.5 20.2l1-6.2L3 9.6l6.2-.9z"/></svg>',
  };

  // ── Filtering ───────────────────────────────────────────────
  function matches(a) {
    if (state.cat !== "all" && a.category !== state.cat) return false;
    if (state.status === "fav" && !state.favs.has(a.id)) return false;
    if (!["all", "fav"].includes(state.status) && a.status !== state.status) return false;
    if (!state.q) return true;
    const hay = [a.name, a.desc, a.host, a.note, CATS[a.category].label, STATUS_LABEL[a.status], ...(a.stack || []), hostOf(a.url), a.repo && a.repo.split("/").pop()]
      .join(" ").toLowerCase();
    return state.q.toLowerCase().split(/\s+/).filter(Boolean).every((t) => hay.includes(t));
  }

  const rank = { live: 0, repo: 1, wip: 2 };
  function sorted(list) {
    const l = [...list];
    if (state.sort === "name") l.sort((a, b) => a.name.localeCompare(b.name));
    else if (state.sort === "newest") l.sort((a, b) => (b.added || "").localeCompare(a.added || ""));
    else l.sort((a, b) => (state.favs.has(b.id) - state.favs.has(a.id)) || rank[a.status] - rank[b.status] || a.name.localeCompare(b.name));
    return l;
  }

  // ── Rendering ───────────────────────────────────────────────
  function card(a, i) {
    const cat = CATS[a.category];
    const fav = state.favs.has(a.id);
    const ping = state.ping[a.id];
    const dotCls = ping === "up" ? "up" : ping === "down" ? "down" : ping === "checking" ? "checking" : "";
    const dotTitle = ping === "up" ? "Responding" : ping === "down" ? "Not responding" : ping === "checking" ? "Checking…" : "Not checked";

    const openBtn = a.url
      ? `<a class="act primary" href="${esc(a.url)}" target="_blank" rel="noopener" title="Open ${esc(hostOf(a.url))}">${icons.open}<span class="lbl">Open app</span></a>`
      : `<span class="act disabled">${icons.open}<span class="lbl">${a.status === "wip" ? "Not deployed" : "No live site"}</span></span>`;

    const repoBtn = a.repo
      ? `<a class="act" href="${esc(a.repo)}" target="_blank" rel="noopener" title="${esc(a.repo.replace("https://github.com/", ""))}">${a.private ? icons.lock : icons.gh}<span class="lbl">Repo</span></a>`
      : `<span class="act disabled" title="${a.private ? "Private repo" : "No repo linked"}">${a.private ? icons.lock : icons.gh}<span class="lbl">${a.private ? "Private" : "No repo"}</span></span>`;

    const copyUrl = a.url || a.repo;
    const copyBtn = copyUrl
      ? `<button class="act icon-only" data-copy="${esc(copyUrl)}" title="Copy link" aria-label="Copy link to ${esc(a.name)}">${icons.copy}</button>`
      : "";

    return `
      <article class="card${a.status === "wip" ? " dim" : ""}" style="--accent:${cat.accent};animation-delay:${Math.min(i * 30, 300)}ms" data-id="${a.id}">
        <div class="card-top">
          <div class="avatar" aria-hidden="true">${esc(initials(a.name))}</div>
          <div class="title-wrap">
            <h3 title="${esc(a.name)}">${esc(a.name)}</h3>
            <div class="meta">
              ${a.url ? `<span class="dot ${dotCls}" title="${dotTitle}"></span>` : ""}
              <span class="badge ${a.status}">${STATUS_LABEL[a.status]}</span>
              ${a.host ? `<span>${esc(a.host)}</span>` : ""}
              ${a.private ? `<span title="Private repository">${icons.lock}</span>` : ""}
            </div>
          </div>
          <button class="pin${fav ? " on" : ""}" data-pin="${a.id}" aria-pressed="${fav}" title="${fav ? "Unpin" : "Pin"}" aria-label="${fav ? "Unpin" : "Pin"} ${esc(a.name)}">${icons.star}</button>
        </div>
        <p class="desc">${esc(a.desc)}</p>
        ${a.stack?.length ? `<div class="tags">${a.stack.map((t) => `<span class="tag">${esc(t)}</span>`).join("")}</div>` : ""}
        ${a.note ? `<div class="note">${esc(a.note)}</div>` : ""}
        <div class="actions">${openBtn}${repoBtn}${copyBtn}</div>
      </article>`;
  }

  function renderStats() {
    const live = APPS.filter((a) => a.url).length;
    const repos = APPS.filter((a) => a.repo).length;
    const wip = APPS.filter((a) => a.status === "wip").length;
    const up = Object.values(state.ping).filter((v) => v === "up").length;
    const checked = Object.values(state.ping).filter((v) => v === "up" || v === "down").length;
    $("#stats").innerHTML = [
      [APPS.length, "Projects"],
      [live, "Live sites"],
      [repos, "Linked repos"],
      checked ? [`${up}/${checked}`, "Responding now"] : [wip, "In progress"],
    ].map(([n, l]) => `<div class="stat"><b>${n}</b><span>${l}</span></div>`).join("");
  }

  function renderChips() {
    const counts = APPS.reduce((m, a) => ((m[a.category] = (m[a.category] || 0) + 1), m), {});
    const all = `<button class="chip${state.cat === "all" ? " on" : ""}" data-cat="all" role="tab" aria-selected="${state.cat === "all"}">All <span class="n">${APPS.length}</span></button>`;
    $("#catChips").innerHTML = all + Object.entries(CATS).map(([k, c]) =>
      `<button class="chip${state.cat === k ? " on" : ""}" data-cat="${k}" style="--accent:${c.accent}" role="tab" aria-selected="${state.cat === k}">${c.icon} ${esc(c.label)} <span class="n">${counts[k] || 0}</span></button>`
    ).join("");
  }

  function render() {
    const list = APPS.filter(matches);
    const root = $("#sections");
    document.body.classList.toggle("list", state.view === "list");

    if (!list.length) { root.innerHTML = ""; $("#empty").hidden = false; }
    else {
      $("#empty").hidden = true;
      if (state.sort === "category") {
        root.innerHTML = Object.entries(CATS).map(([k, c]) => {
          const items = sorted(list.filter((a) => a.category === k));
          if (!items.length) return "";
          return `<section class="section" style="--accent:${c.accent}">
            <div class="section-head"><h2><span class="ico">${c.icon}</span>${esc(c.label)}</h2><span class="count">${items.length}</span><span class="rule"></span></div>
            <div class="grid">${items.map(card).join("")}</div>
          </section>`;
        }).join("");
      } else {
        const label = state.sort === "name" ? "A–Z" : "Newest first";
        root.innerHTML = `<section class="section" style="--accent:#8b5cf6">
          <div class="section-head"><h2>${label}</h2><span class="count">${list.length}</span><span class="rule"></span></div>
          <div class="grid">${sorted(list).map(card).join("")}</div>
        </section>`;
      }
    }
    renderStats();
    syncHash();
  }

  function syncHash() {
    const p = new URLSearchParams();
    if (state.q) p.set("q", state.q);
    if (state.cat !== "all") p.set("cat", state.cat);
    if (state.status !== "all") p.set("status", state.status);
    if (state.sort !== "category") p.set("sort", state.sort);
    const h = p.toString();
    history.replaceState(null, "", h ? `#${h}` : location.pathname + location.search);
  }

  // ── Status check ────────────────────────────────────────────
  // Uses no-cors fetch: an opaque response means the host answered; a network
  // error or timeout means it didn't. It can't see HTTP status codes, so a
  // host returning a 404 page still counts as "responding".
  async function ping(url, ms = 9000) {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), ms);
    try {
      await fetch(url, { mode: "no-cors", cache: "no-store", signal: ctrl.signal, redirect: "follow" });
      return "up";
    } catch { return "down"; }
    finally { clearTimeout(t); }
  }

  let pinging = false;
  async function checkAll() {
    if (pinging) return;
    pinging = true;
    const btn = $("#pingBtn");
    btn.disabled = true; btn.classList.add("busy"); $("#pingLabel").textContent = "Checking…";
    const targets = APPS.filter((a) => a.url);
    targets.forEach((a) => (state.ping[a.id] = "checking"));
    render();
    await Promise.all(targets.map(async (a) => {
      state.ping[a.id] = await ping(a.url);
      updateDot(a.id);
    }));
    renderStats();
    const up = targets.filter((a) => state.ping[a.id] === "up").length;
    btn.disabled = false; btn.classList.remove("busy");
    $("#pingLabel").textContent = "Re-check";
    toast(`${up} of ${targets.length} live sites responding`);
    pinging = false;
  }

  function updateDot(id) {
    const dot = document.querySelector(`.card[data-id="${id}"] .dot`);
    if (!dot) return;
    const v = state.ping[id];
    dot.className = `dot ${v}`;
    dot.title = v === "up" ? "Responding" : "Not responding";
  }

  // ── UI helpers ──────────────────────────────────────────────
  let toastT;
  function toast(msg) {
    const el = $("#toast");
    el.textContent = msg; el.classList.add("show");
    clearTimeout(toastT); toastT = setTimeout(() => el.classList.remove("show"), 2200);
  }

  async function copy(text) {
    try { await navigator.clipboard.writeText(text); }
    catch {
      const ta = Object.assign(document.createElement("textarea"), { value: text });
      document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); } catch {}
      ta.remove();
    }
    toast("Link copied");
  }

  function setSeg(id, attr, val) {
    document.querySelectorAll(`#${id} button`).forEach((b) => {
      const on = b.dataset[attr] === val;
      b.classList.toggle("on", on);
      b.setAttribute("aria-checked", on);
    });
  }

  function toggleTheme() {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem("apphub-theme", next); } catch {}
  }

  // ── Events ──────────────────────────────────────────────────
  const q = $("#q");
  q.value = state.q;
  let qT;
  q.addEventListener("input", () => { clearTimeout(qT); qT = setTimeout(() => { state.q = q.value.trim(); render(); }, 90); });

  $("#catChips").addEventListener("click", (e) => {
    const b = e.target.closest("[data-cat]"); if (!b) return;
    state.cat = b.dataset.cat; renderChips(); render();
  });

  $("#statusSeg").addEventListener("click", (e) => {
    const b = e.target.closest("[data-status]"); if (!b) return;
    state.status = b.dataset.status; setSeg("statusSeg", "status", state.status); render();
  });

  $("#viewSeg").addEventListener("click", (e) => {
    const b = e.target.closest("[data-view]"); if (!b) return;
    state.view = b.dataset.view; store.set("apphub-view", state.view); setSeg("viewSeg", "view", state.view); render();
  });

  const sortSel = $("#sort");
  sortSel.value = state.sort;
  sortSel.addEventListener("change", () => { state.sort = sortSel.value; store.set("apphub-sort", state.sort); render(); });

  $("#sections").addEventListener("click", (e) => {
    const pin = e.target.closest("[data-pin]");
    if (pin) {
      const id = pin.dataset.pin;
      state.favs.has(id) ? state.favs.delete(id) : state.favs.add(id);
      store.set("apphub-favs", [...state.favs]);
      toast(state.favs.has(id) ? "Pinned" : "Unpinned");
      render(); return;
    }
    const c = e.target.closest("[data-copy]");
    if (c) copy(c.dataset.copy);
  });

  // Cursor-follow glow on cards
  $("#sections").addEventListener("pointermove", (e) => {
    const c = e.target.closest(".card"); if (!c) return;
    const r = c.getBoundingClientRect();
    c.style.setProperty("--mx", `${e.clientX - r.left}px`);
    c.style.setProperty("--my", `${e.clientY - r.top}px`);
  });

  $("#pingBtn").addEventListener("click", checkAll);
  $("#themeBtn").addEventListener("click", toggleTheme);
  $("#resetBtn").addEventListener("click", () => {
    state.q = ""; state.cat = "all"; state.status = "all"; q.value = "";
    setSeg("statusSeg", "status", "all"); renderChips(); render();
  });

  document.addEventListener("keydown", (e) => {
    const typing = /INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName);
    if (e.key === "/" && !typing) { e.preventDefault(); q.focus(); q.select(); }
    else if (e.key === "Escape" && document.activeElement === q) { q.value = ""; state.q = ""; q.blur(); render(); }
    else if ((e.key === "t" || e.key === "T") && !typing && !e.metaKey && !e.ctrlKey) toggleTheme();
  });

  // ── Boot ────────────────────────────────────────────────────
  setSeg("statusSeg", "status", state.status);
  setSeg("viewSeg", "view", state.view);
  renderChips();
  render();
  // Auto-check once the page is idle so first paint stays instant.
  (window.requestIdleCallback || ((f) => setTimeout(f, 600)))(checkAll);
})();
