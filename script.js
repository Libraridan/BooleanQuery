const fields = [...document.querySelectorAll('input, textarea')];
const searchOutput = document.getElementById('searchOutput');
const clearButton = document.getElementById('clearForm');
const connectorGroups = [...document.querySelectorAll('.connector-group')];

function text(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : '';
}

function groupValues(prefix) {
  const values = [text(`${prefix}-term`), text(`${prefix}-alt1`), text(`${prefix}-alt2`), text(`${prefix}-alt3`), text(`${prefix}-alt4`)]
    .filter(Boolean);
  if (!values.length) return '';
  return values.length > 1 ? `(${values.join(' OR ')})` : values[0];
}

function selectedConnector(name) {
  const selected = document.querySelector(`input[name="${name}"]:checked`);
  return selected ? selected.value : 'AND';
}

function connectorText(index) {
  const connector = selectedConnector(`connector${index}`);
  if (connector !== 'w/#') return connector;
  const count = text(`count${index}`);
  return `w/${count || '#'}`;
}

function updateConnectorStates() {
  connectorGroups.forEach((group, i) => {
    const connector = selectedConnector(`connector${i + 1}`);
    group.dataset.active = connector;
  });
}

function buildSearchQuery() {
  updateConnectorStates();

  const groups = [groupValues('c1'), groupValues('c2'), groupValues('c3'), groupValues('c4'), groupValues('c5')].filter(Boolean);
  if (!groups.length) {
    searchOutput.value = '';
    searchOutput.placeholder = 'Your assembled search string will appear here.';
    return;
  }

  const assembled = [groups[0]];
  for (let i = 1; i < groups.length; i += 1) {
    assembled.push(connectorText(i), groups[i]);
  }

  searchOutput.value = assembled.join(' ');
}

function syncWCountVisibility() {
  updateConnectorStates();
}

fields.forEach((field) => {
  field.addEventListener('input', buildSearchQuery);
  field.addEventListener('change', buildSearchQuery);
});

document.querySelectorAll('input[type="radio"]').forEach((radio) => {
  radio.addEventListener('change', () => {
    syncWCountVisibility();
    buildSearchQuery();
  });
});

clearButton.addEventListener('click', () => {
  document.querySelector('form')?.reset?.();
  document.querySelectorAll('input[type="text"], input[type="number"], textarea').forEach((el) => {
    el.value = '';
  });
  document.querySelectorAll('input[type="radio"]').forEach((radio) => {
    if (radio.value === 'AND') radio.checked = true;
    else radio.checked = false;
  });
  syncWCountVisibility();
  buildSearchQuery();
});

// Initialize visibility and preview.
syncWCountVisibility();
buildSearchQuery();
