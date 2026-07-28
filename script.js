const worksheet = document.getElementById('worksheet');
const searchOutput = document.getElementById('searchOutput');
const clearButton = document.getElementById('clearForm');
const searchSection = document.querySelector('.search-section');
const connectorGroups = [...document.querySelectorAll('.connector-group')];
const textInputs = [...document.querySelectorAll('input[type="text"], input[type="number"], textarea')];
const radioInputs = [...document.querySelectorAll('input[type="radio"]')];

function valueOf(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : '';
}

function termsFor(prefix) {
  const parts = [
    valueOf(`${prefix}-term`),
    valueOf(`${prefix}-alt1`),
    valueOf(`${prefix}-alt2`),
    valueOf(`${prefix}-alt3`),
    valueOf(`${prefix}-alt4`),
  ].filter(Boolean);

  if (!parts.length) return '';
  return parts.length === 1 ? parts[0] : `(${parts.join(' OR ')})`;
}

function connectorFor(index) {
  const selected = document.querySelector(`input[name="connector${index}"]:checked`);
  if (!selected) return 'AND';
  if (selected.value !== 'w/#') return selected.value;
  const distance = valueOf(`count${index}`);
  return `w/${distance || '#'}`;
}

function refreshConnectorVisibility() {
  connectorGroups.forEach((group, index) => {
    const selected = document.querySelector(`input[name="connector${index + 1}"]:checked`);
    group.dataset.active = selected ? selected.value : 'AND';
  });
}

function buildSearchQuery() {
  refreshConnectorVisibility();

  const groups = [1, 2, 3, 4, 5]
    .map((i) => termsFor(`c${i}`))
    .filter(Boolean);

  if (!groups.length) {
    searchOutput.value = '';
    searchOutput.placeholder = 'Your assembled search string will appear here.';
    searchSection.classList.remove('has-output');
    return;
  }

  const query = [groups[0]];
  for (let i = 1; i < groups.length; i += 1) {
    query.push(connectorFor(i));
    query.push(groups[i]);
  }

  searchOutput.value = query.join(' ');
  searchOutput.placeholder = '';
  searchSection.classList.add('has-output');
}

function resetConnectorDefaults() {
  radioInputs.forEach((radio) => {
    radio.checked = radio.value === 'AND';
  });
  connectorGroups.forEach((group) => {
    group.dataset.active = 'AND';
  });
}

textInputs.forEach((field) => {
  field.addEventListener('input', buildSearchQuery);
  field.addEventListener('change', buildSearchQuery);
});

radioInputs.forEach((radio) => {
  radio.addEventListener('change', buildSearchQuery);
});

clearButton.addEventListener('click', () => {
  worksheet.reset();
  document.querySelectorAll('input[type="text"], input[type="number"], textarea').forEach((el) => {
    el.value = '';
  });
  resetConnectorDefaults();
  buildSearchQuery();
});

refreshConnectorVisibility();
buildSearchQuery();
