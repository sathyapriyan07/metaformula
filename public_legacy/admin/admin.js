const api = {
  list: (module) => fetch(`/api/${module}`).then((res) => res.json()),
  create: (module, data) =>
    fetch(`/api/${module}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then(async (res) => ({ ok: res.ok, data: await res.json() })),
  update: (module, id, data) =>
    fetch(`/api/${module}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then(async (res) => ({ ok: res.ok, data: await res.json() })),
  remove: (module, id) => fetch(`/api/${module}/${id}`, { method: "DELETE" }),
};

const refs = {
  drivers: [],
  teams: [],
  circuits: [],
  seasons: [],
};

const modules = {
  seasons: {
    title: "Seasons",
    columns: [
      { key: "year", label: "Year" },
      {
        key: "champion_driver_id",
        label: "Champion Driver",
        render: (row) => findName(refs.drivers, row.champion_driver_id),
      },
      {
        key: "champion_team_id",
        label: "Champion Team",
        render: (row) => findName(refs.teams, row.champion_team_id, "team_name"),
      },
      { key: "total_races", label: "Races" },
    ],
    fields: [
      { key: "year", label: "Year", type: "year" },
      {
        key: "champion_driver_id",
        label: "Champion Driver",
        type: "select",
        options: () => refs.drivers.map((d) => ({ value: d.id, label: d.name })),
      },
      {
        key: "champion_team_id",
        label: "Champion Team",
        type: "select",
        options: () => refs.teams.map((t) => ({ value: t.id, label: t.team_name })),
      },
      { key: "total_races", label: "Total Races", type: "number" },
      { key: "banner_image_url", label: "Banner Image URL", type: "url", preview: true },
    ],
  },
  drivers: {
    title: "Drivers",
    columns: [
      { key: "name", label: "Name" },
      { key: "nationality", label: "Nationality" },
      { key: "championships", label: "Titles" },
      { key: "wins", label: "Wins" },
      {
        key: "team_ids",
        label: "Teams",
        render: (row) =>
          (row.team_ids || [])
            .map((id) => findName(refs.teams, id, "team_name"))
            .filter(Boolean)
            .join(", "),
      },
    ],
    fields: [
      { key: "name", label: "Name", type: "text" },
      { key: "nationality", label: "Nationality", type: "text" },
      { key: "birthdate", label: "Birthdate", type: "text" },
      { key: "profile_image_url", label: "Profile Image URL", type: "url", preview: true },
      { key: "championships", label: "Championships", type: "number" },
      { key: "wins", label: "Wins", type: "number" },
      { key: "podiums", label: "Podiums", type: "number" },
      { key: "poles", label: "Poles", type: "number" },
      { key: "fastest_laps", label: "Fastest Laps", type: "number" },
      {
        key: "team_ids",
        label: "Teams",
        type: "multiselect",
        options: () => refs.teams.map((t) => ({ value: t.id, label: t.team_name })),
      },
      { key: "biography", label: "Biography", type: "textarea", full: true },
    ],
  },
  teams: {
    title: "Teams",
    columns: [
      { key: "team_name", label: "Team" },
      { key: "base_country", label: "Base" },
      { key: "championships", label: "Titles" },
      { key: "active_years", label: "Active Years" },
    ],
    fields: [
      { key: "team_name", label: "Team Name", type: "text" },
      { key: "logo_url", label: "Logo URL", type: "url", preview: true },
      { key: "base_country", label: "Base Country", type: "text" },
      { key: "championships", label: "Championships", type: "number" },
      { key: "active_years", label: "Active Years", type: "text" },
    ],
  },
  circuits: {
    title: "Circuits",
    columns: [
      { key: "circuit_name", label: "Circuit" },
      { key: "country", label: "Country" },
      { key: "lap_length_km", label: "Lap Length" },
      { key: "first_gp_year", label: "First GP" },
    ],
    fields: [
      { key: "circuit_name", label: "Circuit Name", type: "text" },
      { key: "country", label: "Country", type: "text" },
      { key: "track_layout_url", label: "Track Layout URL", type: "url", preview: true },
      { key: "lap_length_km", label: "Lap Length (km)", type: "number" },
      { key: "first_gp_year", label: "First GP Year", type: "year" },
    ],
  },
  races: {
    title: "Races",
    columns: [
      {
        key: "season_id",
        label: "Season",
        render: (row) => findName(refs.seasons, row.season_id, "year"),
      },
      {
        key: "circuit_id",
        label: "Circuit",
        render: (row) => findName(refs.circuits, row.circuit_id, "circuit_name"),
      },
      {
        key: "winner_driver_id",
        label: "Winner",
        render: (row) => findName(refs.drivers, row.winner_driver_id),
      },
      { key: "laps", label: "Laps" },
    ],
    fields: [
      {
        key: "season_id",
        label: "Season",
        type: "select",
        options: () => refs.seasons.map((s) => ({ value: s.id, label: s.year })),
      },
      {
        key: "circuit_id",
        label: "Circuit",
        type: "select",
        options: () => refs.circuits.map((c) => ({ value: c.id, label: c.circuit_name })),
      },
      {
        key: "winner_driver_id",
        label: "Winner",
        type: "select",
        options: () => refs.drivers.map((d) => ({ value: d.id, label: d.name })),
      },
      {
        key: "second_driver_id",
        label: "Second",
        type: "select",
        options: () => refs.drivers.map((d) => ({ value: d.id, label: d.name })),
      },
      {
        key: "third_driver_id",
        label: "Third",
        type: "select",
        options: () => refs.drivers.map((d) => ({ value: d.id, label: d.name })),
      },
      {
        key: "fastest_lap_driver_id",
        label: "Fastest Lap",
        type: "select",
        options: () => refs.drivers.map((d) => ({ value: d.id, label: d.name })),
      },
      { key: "laps", label: "Laps", type: "number" },
    ],
  },
  media: {
    title: "Media",
    columns: [
      { key: "title", label: "Title" },
      { key: "category", label: "Category" },
      { key: "url", label: "URL" },
    ],
    fields: [
      { key: "title", label: "Title", type: "text" },
      { key: "url", label: "Media URL", type: "url", preview: true },
      { key: "category", label: "Category", type: "text" },
      { key: "caption", label: "Caption", type: "textarea" },
    ],
  },
};

const moduleTitle = document.getElementById("module-title");
const tableContainer = document.getElementById("table-container");
const addButton = document.getElementById("add-button");
const modal = document.getElementById("modal");
const modalForm = document.getElementById("modal-form");
const modalTitle = document.getElementById("modal-title");
const modalClose = document.getElementById("modal-close");
const modalCancel = document.getElementById("modal-cancel");

let currentModule = "seasons";
let editingId = null;
let currentData = [];

function findName(list, id, field = "name") {
  if (!id) return "—";
  const item = list.find((row) => row.id === id);
  return item ? item[field] : "—";
}

function showModal() {
  modal.classList.remove("hidden");
}

function hideModal() {
  modal.classList.add("hidden");
  modalForm.innerHTML = "";
  editingId = null;
}

function renderTable() {
  const config = modules[currentModule];
  if (!currentData.length) {
    tableContainer.innerHTML = `<div class="empty">No records yet.</div>`;
    return;
  }
  const headers = config.columns
    .map((col) => `<th>${col.label}</th>`)
    .concat(["<th>Actions</th>"])
    .join("");

  const rows = currentData
    .map((row) => {
      const cells = config.columns
        .map((col) => {
          const value = col.render ? col.render(row) : row[col.key];
          return `<td>${value === undefined || value === "" ? "—" : value}</td>`;
        })
        .join("");
      return `
        <tr>
          ${cells}
          <td>
            <div class="action-buttons">
              <button class="button" data-action="edit" data-id="${row.id}">Edit</button>
              <button class="button secondary" data-action="delete" data-id="${row.id}">Delete</button>
            </div>
          </td>
        </tr>
      `;
    })
    .join("");

  tableContainer.innerHTML = `
    <table class="data-table">
      <thead><tr>${headers}</tr></thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

function buildField(field, value) {
  const wrapper = document.createElement("div");
  wrapper.className = "field";
  if (field.full) wrapper.style.gridColumn = "1 / -1";

  const label = document.createElement("label");
  label.textContent = field.label;
  wrapper.appendChild(label);

  let input;
  if (field.type === "textarea") {
    input = document.createElement("textarea");
    input.value = value || "";
  } else if (field.type === "select" || field.type === "multiselect") {
    input = document.createElement("select");
    const options = field.options ? field.options() : [];
    if (field.type === "select") {
      const empty = document.createElement("option");
      empty.value = "";
      empty.textContent = "None";
      input.appendChild(empty);
    } else {
      input.multiple = true;
    }
    options.forEach((option) => {
      const opt = document.createElement("option");
      opt.value = option.value;
      opt.textContent = option.label;
      input.appendChild(opt);
    });
    if (field.type === "multiselect" && Array.isArray(value)) {
      Array.from(input.options).forEach((opt) => {
        opt.selected = value.includes(Number(opt.value));
      });
    } else if (value) {
      input.value = value;
    }
  } else {
    input = document.createElement("input");
    input.type = field.type === "number" ? "number" : "text";
    if (value !== undefined && value !== null) input.value = value;
  }

  input.name = field.key;
  input.dataset.type = field.type;
  wrapper.appendChild(input);

  if (field.preview) {
    const preview = document.createElement("img");
    preview.className = "preview";
    preview.alt = `${field.label} preview`;
    wrapper.appendChild(preview);
    const updatePreview = () => {
      const url = input.value.trim();
      if (url && url.startsWith("https://")) {
        preview.src = url;
        preview.style.display = "block";
      } else {
        preview.style.display = "none";
      }
    };
    input.addEventListener("input", updatePreview);
    updatePreview();
  }

  return wrapper;
}

function buildForm(data = {}) {
  const config = modules[currentModule];
  modalForm.innerHTML = "";

  config.fields.forEach((field) => {
    const value = data[field.key];
    modalForm.appendChild(buildField(field, value));
  });

  const error = document.createElement("div");
  error.className = "error-banner";
  error.id = "form-errors";
  error.style.display = "none";
  modalForm.appendChild(error);
}

function gatherFormData() {
  const data = {};
  const inputs = Array.from(modalForm.elements).filter((el) => el.name);
  inputs.forEach((input) => {
    if (input.tagName === "SELECT" && input.multiple) {
      data[input.name] = Array.from(input.selectedOptions).map((opt) => Number(opt.value));
    } else {
      data[input.name] = input.value.trim();
    }
  });
  return data;
}

function validateForm(data) {
  const errors = [];
  const config = modules[currentModule];
  config.fields.forEach((field) => {
    const value = data[field.key];
    if (field.type === "year" && value && !/^\d{4}$/.test(value)) {
      errors.push(`${field.label} must be 4 digits.`);
    }
    if (field.type === "number" && value && Number.isNaN(Number(value))) {
      errors.push(`${field.label} must be numeric.`);
    }
    if (field.type === "url" && value && !value.startsWith("https://")) {
      errors.push(`${field.label} must start with https://`);
    }
  });
  if (currentModule === "seasons" && !data.year) errors.push("Year is required.");
  if (currentModule === "drivers" && !data.name) errors.push("Name is required.");
  if (currentModule === "teams" && !data.team_name) errors.push("Team Name is required.");
  if (currentModule === "circuits" && !data.circuit_name) errors.push("Circuit Name is required.");
  if (currentModule === "races") {
    if (!data.season_id) errors.push("Season is required.");
    if (!data.circuit_id) errors.push("Circuit is required.");
    if (!data.winner_driver_id) errors.push("Winner is required.");
  }
  if (currentModule === "media") {
    if (!data.title) errors.push("Title is required.");
    if (!data.url) errors.push("Media URL is required.");
  }
  return errors;
}

function showErrors(errors) {
  const banner = document.getElementById("form-errors");
  if (!banner) return;
  if (!errors.length) {
    banner.style.display = "none";
    return;
  }
  banner.style.display = "block";
  banner.innerHTML = errors.map((err) => `<div>${err}</div>`).join("");
}

async function loadReferences() {
  const [drivers, teams, circuits, seasons] = await Promise.all([
    api.list("drivers"),
    api.list("teams"),
    api.list("circuits"),
    api.list("seasons"),
  ]);
  refs.drivers = drivers;
  refs.teams = teams;
  refs.circuits = circuits;
  refs.seasons = seasons;
}

async function loadModule(moduleKey) {
  currentModule = moduleKey;
  moduleTitle.textContent = modules[moduleKey].title;
  await loadReferences();
  currentData = await api.list(moduleKey);
  renderTable();
}

async function handleSave(event) {
  event.preventDefault();
  const data = gatherFormData();
  const errors = validateForm(data);
  showErrors(errors);
  if (errors.length) return;

  const response = editingId
    ? await api.update(currentModule, editingId, data)
    : await api.create(currentModule, data);

  if (!response.ok) {
    showErrors(response.data.errors || ["Failed to save record."]);
    return;
  }

  hideModal();
  await loadModule(currentModule);
}

function handleTableClick(event) {
  const button = event.target.closest("button[data-action]");
  if (!button) return;
  const id = button.dataset.id;
  const action = button.dataset.action;
  const record = currentData.find((row) => String(row.id) === id);

  if (action === "edit") {
    editingId = id;
    modalTitle.textContent = `Edit ${modules[currentModule].title}`;
    buildForm(record);
    showModal();
    return;
  }
  if (action === "delete") {
    const confirmed = window.confirm("Delete this record? This cannot be undone.");
    if (!confirmed) return;
    api.remove(currentModule, id).then(() => loadModule(currentModule));
  }
}

addButton.addEventListener("click", () => {
  editingId = null;
  modalTitle.textContent = `Add ${modules[currentModule].title}`;
  buildForm({});
  showModal();
});

modalClose.addEventListener("click", hideModal);
modalCancel.addEventListener("click", hideModal);
modalForm.addEventListener("submit", handleSave);

tableContainer.addEventListener("click", handleTableClick);

Array.from(document.querySelectorAll(".nav-item")).forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".nav-item").forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
    loadModule(button.dataset.module);
  });
});

loadModule(currentModule);
