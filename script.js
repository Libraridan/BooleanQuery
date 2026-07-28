const storageKey = 'crafting-efficient-search-worksheet-v1';
const form = document.getElementById('worksheet');
const searchOutput = document.getElementById('searchOutput');
const clearButton = document.getElementById('clearForm');
const connectors = [...document.querySelectorAll('.connector')];
const textFields = [...document.querySelectorAll('input[type="text"], input[type="number"], textarea')];

function value(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : '';
}

function selectedConnector(group) {
  const radio = document.querySelector(`input[name="connector${group}"]:checked`);
  return radio ? radio.value : 'AND';
}

function columnValues(prefix) {
  const items = [
    value(`${prefix}-term`),
    value(`${prefix}-alt1`),
    value(`${prefix}-alt2`),
    value(`${prefix}-alt3`),
    value(`${prefix}-alt4`),
  ].filter(Boolean);

  if (!items.length) return '';
  return items.length > 1 ? `(${items.join(' OR ')})` : items[0];
}

function connectorText(group) {
  const connector = selectedConnector(group);
  if (connector !== 'w/#') return connector;
  const count = value(`count${group}`);
  return count ? `w/${count}` : 'w/#';
}

function updateConnectorStates() {
  connectors.forEach((connector, index) => {
    connector.dataset.active = selectedConnector(index + 1);
  });
}

function buildSearch() {
  updateConnectorStates();

  const groups = [1, 2, 3, 4, 5]
    .map((n) => columnValues(`c${n}`))
    .filter(Boolean);

  searchOutput.value = groups.length
    ? groups.reduce((acc, group, index) => {
        if (index === 0) return group;
        return `${acc} ${connectorText(index)} ${group}`;
      }, '')
    : '';

  saveState();
}

function saveState() {
  const data = {};
  document.querySelectorAll('input, textarea').forEach((el) => {
    if (!el.id && !el.name) return;
    if (el.type === 'radio') {
      if (el.checked) data[el.name] = el.value;
      return;
    }
    data[el.id || el.name] = el.value;
  });

  try {
    localStorage.setItem(storageKey, JSON.stringify(data));
  } catch {
    // Ignore storage failures.
  }
}

function restoreState() {
  let data = null;
  try {
    data = JSON.parse(localStorage.getItem(storageKey) || 'null');
  } catch {
    data = null;
  }
  if (!data) return;

  Object.entries(data).forEach(([key, valueToSet]) => {
    const radio = document.querySelector(`input[type="radio"][name="${CSS.escape(key)}"][value="${CSS.escape(valueToSet)}"]`);
    if (radio) {
      radio.checked = true;
      return;
    }

    const el = document.getElementById(key);
    if (el) el.value = valueToSet;
  });
}

function clearState() {
  form.reset();
  document.querySelectorAll('input[type="radio"][value="AND"]').forEach((radio) => {
    radio.checked = true;
  });
  document.querySelectorAll('input[type="text"], input[type="number"], textarea').forEach((el) => {
    el.value = '';
  });
  buildSearch();
}

textFields.forEach((field) => {
  field.addEventListener('input', buildSearch);
  field.addEventListener('change', buildSearch);
});

document.querySelectorAll('input[type="radio"]').forEach((radio) => {
  radio.addEventListener('change', buildSearch);
});

clearButton.addEventListener('click', clearState);

restoreState();
buildSearch();
