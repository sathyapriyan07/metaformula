const api = (path) => fetch(path).then((res) => res.json());
const qs = (sel) => document.querySelector(sel);
const qsa = (sel) => Array.from(document.querySelectorAll(sel));

function safeText(value, fallback = "—") {
  if (value === undefined || value === null || value === "") return fallback;
  return value;
}

function setImage(imgEl, url) {
  if (!imgEl) return;
  if (url && String(url).trim()) {
    imgEl.src = url;
    imgEl.style.display = "block";
  } else {
    imgEl.style.display = "none";
  }
}

function formatTeams(driver, teams) {
  if (!driver.team_ids || !driver.team_ids.length) return "Independent";
  return driver.team_ids
    .map((id) => teams.find((team) => team.id === id)?.team_name)
    .filter(Boolean)
    .join(", ");
}

async function loadHome() {
  const [seasons, drivers, teams] = await Promise.all([
    api("/api/seasons"),
    api("/api/drivers"),
    api("/api/teams"),
  ]);

  if (!seasons.length) {
    qs("#featured-season").textContent = "No seasons yet";
    qs("#featured-year").textContent = "";
    return;
  }

  const latest = seasons.sort((a, b) => b.year - a.year)[0];
  const championDriver = drivers.find((d) => d.id === latest.champion_driver_id);
  const championTeam = teams.find((t) => t.id === latest.champion_team_id);

  qs("#featured-season").textContent = `${latest.year} Season`;
  qs("#featured-year").textContent = `${latest.total_races || 0} races`;
  qs("#featured-champion").textContent = championDriver
    ? championDriver.name
    : "Champion TBD";
  qs("#featured-team").textContent = championTeam
    ? championTeam.team_name
    : "Team TBD";
  setImage(qs("#featured-banner"), latest.banner_image_url);

  const driverSpot = drivers.slice(0, 4);
  const grid = qs("#driver-spotlight");
  grid.innerHTML = driverSpot
    .map(
      (driver) => `
      <a class="card poster" href="/driver.html?id=${driver.id}">
        <img loading="lazy" alt="${driver.name}" src="${driver.profile_image_url || ""}">
        <div class="content">
          <div class="label">Driver Spotlight</div>
          <h3>${driver.name}</h3>
          <div class="badge">${driver.nationality || "Unknown"}</div>
        </div>
      </a>
    `
    )
    .join("");

  if (!driverSpot.length) {
    grid.innerHTML = `<div class="empty">No drivers added yet.</div>`;
  }
}

async function loadSeasons() {
  const [seasons, drivers, teams] = await Promise.all([
    api("/api/seasons"),
    api("/api/drivers"),
    api("/api/teams"),
  ]);
  const list = qs("#season-grid");
  if (!seasons.length) {
    list.innerHTML = `<div class="empty">No seasons in archive.</div>`;
    return;
  }
  list.innerHTML = seasons
    .sort((a, b) => b.year - a.year)
    .map((season) => {
      const driver = drivers.find((d) => d.id === season.champion_driver_id);
      const team = teams.find((t) => t.id === season.champion_team_id);
      return `
      <div class="card">
        <div class="label">Season</div>
        <h3>${season.year}</h3>
        <div class="meta-list">
          <div><span>Champion</span><span>${driver ? driver.name : "TBD"}</span></div>
          <div><span>Constructor</span><span>${team ? team.team_name : "TBD"}</span></div>
          <div><span>Total Races</span><span>${season.total_races || 0}</span></div>
        </div>
        <div style="margin-top:16px; display:flex; gap:10px; flex-wrap:wrap;">
          <a class="button" href="/races.html?season_id=${season.id}">View Races</a>
        </div>
      </div>
    `;
    })
    .join("");
}

async function loadDrivers() {
  const [drivers, teams] = await Promise.all([api("/api/drivers"), api("/api/teams")]);
  const grid = qs("#driver-grid");
  if (!drivers.length) {
    grid.innerHTML = `<div class="empty">No drivers yet.</div>`;
    return;
  }
  grid.innerHTML = drivers
    .map(
      (driver) => `
      <a class="card poster" href="/driver.html?id=${driver.id}">
        <img loading="lazy" alt="${driver.name}" src="${driver.profile_image_url || ""}">
        <div class="content">
          <div class="label">${driver.nationality || "Unknown"}</div>
          <h3>${driver.name}</h3>
          <div class="badge">${formatTeams(driver, teams) || "Independent"}</div>
        </div>
      </a>
    `
    )
    .join("");
}

async function loadDriverDetail() {
  const id = new URLSearchParams(window.location.search).get("id");
  if (!id) return;
  const [driver, teams] = await Promise.all([api(`/api/drivers/${id}`), api("/api/teams")]);
  qs("#driver-name").textContent = driver.name;
  qs("#driver-nationality").textContent = safeText(driver.nationality);
  qs("#driver-birthdate").textContent = safeText(driver.birthdate);
  qs("#driver-teams").textContent = formatTeams(driver, teams);
  qs("#driver-bio").textContent = safeText(driver.biography, "No biography yet.");
  setImage(qs("#driver-image"), driver.profile_image_url);

  const stats = [
    ["Championships", driver.championships],
    ["Wins", driver.wins],
    ["Podiums", driver.podiums],
    ["Poles", driver.poles],
    ["Fastest Laps", driver.fastest_laps],
  ];

  qs("#driver-stats").innerHTML = stats
    .map((item) => `<div><span>${item[0]}</span><span>${safeText(item[1], 0)}</span></div>`)
    .join("");
}

async function loadTeams() {
  const teams = await api("/api/teams");
  const grid = qs("#team-grid");
  if (!teams.length) {
    grid.innerHTML = `<div class="empty">No teams added yet.</div>`;
    return;
  }
  grid.innerHTML = teams
    .map(
      (team) => `
      <a class="card" href="/team.html?id=${team.id}">
        <div class="label">Constructor</div>
        <h3>${team.team_name}</h3>
        <div class="meta-list">
          <div><span>Base</span><span>${safeText(team.base_country)}</span></div>
          <div><span>Championships</span><span>${safeText(team.championships, 0)}</span></div>
          <div><span>Active Years</span><span>${safeText(team.active_years)}</span></div>
        </div>
      </a>
    `
    )
    .join("");
}

async function loadTeamDetail() {
  const id = new URLSearchParams(window.location.search).get("id");
  if (!id) return;
  const team = await api(`/api/teams/${id}`);
  qs("#team-name").textContent = team.team_name;
  qs("#team-country").textContent = safeText(team.base_country);
  qs("#team-years").textContent = safeText(team.active_years);
  qs("#team-championships").textContent = safeText(team.championships, 0);
  setImage(qs("#team-logo"), team.logo_url);
}

async function loadCircuits() {
  const circuits = await api("/api/circuits");
  const grid = qs("#circuit-grid");
  if (!circuits.length) {
    grid.innerHTML = `<div class="empty">No circuits added yet.</div>`;
    return;
  }
  grid.innerHTML = circuits
    .map(
      (circuit) => `
      <a class="card" href="/circuit.html?id=${circuit.id}">
        <div class="label">Circuit</div>
        <h3>${circuit.circuit_name}</h3>
        <div class="meta-list">
          <div><span>Country</span><span>${safeText(circuit.country)}</span></div>
          <div><span>Lap Length</span><span>${safeText(circuit.lap_length_km)} km</span></div>
          <div><span>First GP</span><span>${safeText(circuit.first_gp_year)}</span></div>
        </div>
      </a>
    `
    )
    .join("");
}

async function loadCircuitDetail() {
  const id = new URLSearchParams(window.location.search).get("id");
  if (!id) return;
  const circuit = await api(`/api/circuits/${id}`);
  qs("#circuit-name").textContent = circuit.circuit_name;
  qs("#circuit-country").textContent = safeText(circuit.country);
  qs("#circuit-length").textContent = safeText(circuit.lap_length_km);
  qs("#circuit-first").textContent = safeText(circuit.first_gp_year);
  setImage(qs("#circuit-layout"), circuit.track_layout_url);
}

async function loadRaces() {
  const seasonId = new URLSearchParams(window.location.search).get("season_id");
  const [races, seasons, circuits, drivers] = await Promise.all([
    api("/api/races"),
    api("/api/seasons"),
    api("/api/circuits"),
    api("/api/drivers"),
  ]);

  const list = qs("#race-grid");
  const filtered = seasonId ? races.filter((race) => String(race.season_id) === seasonId) : races;
  if (!filtered.length) {
    list.innerHTML = `<div class="empty">No races recorded yet.</div>`;
    return;
  }

  list.innerHTML = filtered
    .map((race) => {
      const season = seasons.find((s) => s.id === race.season_id);
      const circuit = circuits.find((c) => c.id === race.circuit_id);
      const winner = drivers.find((d) => d.id === race.winner_driver_id);
      return `
      <a class="card" href="/race.html?id=${race.id}">
        <div class="label">${season ? season.year : "Season"}</div>
        <h3>${circuit ? circuit.circuit_name : "Circuit"}</h3>
        <div class="meta-list">
          <div><span>Winner</span><span>${winner ? winner.name : "TBD"}</span></div>
          <div><span>Laps</span><span>${safeText(race.laps)}</span></div>
        </div>
      </a>
    `;
    })
    .join("");
}

async function loadRaceDetail() {
  const id = new URLSearchParams(window.location.search).get("id");
  if (!id) return;
  const [race, seasons, circuits, drivers] = await Promise.all([
    api(`/api/races/${id}`),
    api("/api/seasons"),
    api("/api/circuits"),
    api("/api/drivers"),
  ]);

  const season = seasons.find((s) => s.id === race.season_id);
  const circuit = circuits.find((c) => c.id === race.circuit_id);
  const getDriver = (idVal) => drivers.find((d) => d.id === idVal)?.name || "—";

  qs("#race-title").textContent = `${circuit ? circuit.circuit_name : "Race"} (${season ? season.year : "Season"})`;
  qs("#race-season").textContent = season ? season.year : "—";
  qs("#race-circuit").textContent = circuit ? circuit.circuit_name : "—";
  qs("#race-winner").textContent = getDriver(race.winner_driver_id);
  qs("#race-second").textContent = getDriver(race.second_driver_id);
  qs("#race-third").textContent = getDriver(race.third_driver_id);
  qs("#race-fastest").textContent = getDriver(race.fastest_lap_driver_id);
  qs("#race-laps").textContent = safeText(race.laps);
}

const page = document.body.dataset.page;
if (page === "home") loadHome();
if (page === "seasons") loadSeasons();
if (page === "drivers") loadDrivers();
if (page === "driver-detail") loadDriverDetail();
if (page === "teams") loadTeams();
if (page === "team-detail") loadTeamDetail();
if (page === "circuits") loadCircuits();
if (page === "circuit-detail") loadCircuitDetail();
if (page === "races") loadRaces();
if (page === "race-detail") loadRaceDetail();
