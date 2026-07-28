const worksheet = document.getElementById('worksheet');
const sheet = document.getElementById('sheet');

const IMG_WIDTH = 1760;
const IMG_HEIGHT = 1360;
const pct = (value, total) => `${(value / total) * 100}%`;

function make(tag, className, attrs = {}) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  for (const [key, value] of Object.entries(attrs)) {
    if (key === 'text') {
      el.textContent = value;
    } else if (key === 'html') {
      el.innerHTML = value;
    } else {
      el.setAttribute(key, value);
    }
  }
  return el;
}

function addTextField({ id, cls, left, top, width, height, placeholder = '', label = '', type = 'text' }) {
  const wrap = make('div', cls);
  wrap.style.left = pct(left, IMG_WIDTH);
  wrap.style.top = pct(top, IMG_HEIGHT);
  wrap.style.width = pct(width, IMG_WIDTH);
  wrap.style.height = pct(height, IMG_HEIGHT);

  const input = make('input', cls.includes('textarea') ? '' : cls.replace('field', '').trim());
  input.id = id;
  input.type = type;
  input.className = 'transparent-input';
  input.placeholder = placeholder;
  if (label) input.setAttribute('aria-label', label);

  wrap.appendChild(input);
  worksheet.appendChild(wrap);
  return input;
}

function addTermBox({ id, left, top, width, height, label }) {
  const wrap = make('div', 'term-box');
  wrap.style.left = pct(left, IMG_WIDTH);
  wrap.style.top = pct(top, IMG_HEIGHT);
  wrap.style.width = pct(width, IMG_WIDTH);
  wrap.style.height = pct(height, IMG_HEIGHT);

  const input = make('input');
  input.id = id;
  input.type = 'text';
  input.className = 'transparent-input term-input';
  input.setAttribute('aria-label', label);

  wrap.appendChild(input);
  worksheet.appendChild(wrap);
  return input;
}

function addAltBox({ id, left, top, width, height, label }) {
  const wrap = make('div', 'alt-box');
  wrap.style.left = pct(left, IMG_WIDTH);
  wrap.style.top = pct(top, IMG_HEIGHT);
  wrap.style.width = pct(width, IMG_WIDTH);
  wrap.style.height = pct(height, IMG_HEIGHT);

  const input = make('input');
  input.id = id;
  input.type = 'text';
  input.className = 'transparent-input alt-input';
  input.setAttribute('aria-label', label);

  wrap.appendChild(input);
  worksheet.appendChild(wrap);
  return input;
}

function addConnectorGroup({ left, top, width, height, index }) {
  const group = make('fieldset', 'connector-group');
  group.style.left = pct(left, IMG_WIDTH);
  group.style.top = pct(top, IMG_HEIGHT);
  group.style.width = pct(width, IMG_WIDTH);
  group.style.height = pct(height, IMG_HEIGHT);
  group.dataset.active = 'AND';
  group.setAttribute('aria-label', `Connector group ${index}`);

  const options = [
    { value: 'AND', label: 'AND' },
    { value: 'w/p', label: 'w/p' },
    { value: 'w/s', label: 'w/s' },
    { value: 'w/#', label: 'w/' },
  ];

  options.forEach((option, optionIndex) => {
    const optionWrap = make('label', 'connector-option');
    optionWrap.setAttribute('aria-label', option.label);

    const radio = make('input');
    radio.type = 'radio';
    radio.name = `connector${index}`;
    radio.value = option.value;
    radio.setAttribute('aria-label', option.label);
    if (optionIndex === 0) radio.checked = true;

    const square = make('span', 'connector-square');

    optionWrap.append(radio, square);
    group.appendChild(optionWrap);
  });

  const count = make('input', 'wcount');
  count.id = `count${index}`;
  count.type = 'number';
  count.min = '1';
  count.step = '1';
  count.inputMode = 'numeric';
  count.placeholder = '#';
  count.setAttribute('aria-label', `Distance for connector group ${index}`);
  group.appendChild(count);
  worksheet.appendChild(group);
  return group;
}

function setVisibility(group, value) {
  group.dataset.active = value;
  const count = group.querySelector('.wcount');
  const shouldShow = value === 'w/#';
  count.style.display = shouldShow ? 'inline-block' : 'none';
}

const issue = addTextField({
  id: 'issue',
  cls: 'issue-field field',
  left: 240,
  top: 158,
  width: 1460,
  height: 50,
  placeholder: 'Put your research issue in a single simple sentence.',
  label: 'Issue',
});

// Five columns, one top box and four alternative boxes each.
const columnLefts = [161, 486, 812, 1138, 1463];
const topRowY = 285;
const altYs = [402, 515, 627, 740];
const widths = [244, 245, 244, 244, 245];
const heights = { top: 61, alt: 58 };

const allInputs = [issue];
for (let col = 0; col < 5; col += 1) {
  allInputs.push(addTermBox({
    id: `c${col + 1}-term`,
    left: columnLefts[col],
    top: topRowY,
    width: widths[col],
    height: heights.top,
    label: `Term ${col + 1}`,
  }));

  for (let row = 0; row < 4; row += 1) {
    allInputs.push(addAltBox({
      id: `c${col + 1}-alt${row + 1}`,
      left: columnLefts[col],
      top: altYs[row],
      width: 242 + (col === 1 || col === 3 || col === 4 ? 1 : 0),
      height: heights.alt,
      label: `Alternative ${col + 1}.${row + 1}`,
    }));
  }
}

const connectorGroups = [
  addConnectorGroup({ left: 435, top: 250, width: 86, height: 124, index: 1 }),
  addConnectorGroup({ left: 761, top: 250, width: 86, height: 124, index: 2 }),
  addConnectorGroup({ left: 1086, top: 250, width: 86, height: 124, index: 3 }),
  addConnectorGroup({ left: 1411, top: 250, width: 86, height: 124, index: 4 }),
];

const searchWrap = make('div', 'search-wrap field');
const searchCover = make('div', 'search-cover', { 'aria-hidden': 'true' });
const searchLabel = make('label', 'search-label', { for: 'searchOutput', text: 'Search' });
const searchOutput = make('textarea');
searchOutput.id = 'searchOutput';
searchOutput.readOnly = true;
searchOutput.spellcheck = false;
searchOutput.placeholder = 'Your assembled search string will appear here.';
searchWrap.append(searchCover, searchLabel, searchOutput);
worksheet.appendChild(searchWrap);

const database = addTextField({
  id: 'database',
  cls: 'database-field field',
  left: 260,
  top: 1028,
  width: 1490,
  height: 48,
  placeholder: 'Choose the smallest, most precise database for your search.',
  label: 'Database',
});

database.style.fontSize = 'clamp(14px, 1vw, 18px)';

const clearButton = make('button', 'clear-button', { type: 'button', text: 'Clear Form' });
worksheet.appendChild(clearButton);

function valueOf(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : '';
}

function groupValues(index) {
  const values = [
    valueOf(`c${index}-term`),
    valueOf(`c${index}-alt1`),
    valueOf(`c${index}-alt2`),
    valueOf(`c${index}-alt3`),
    valueOf(`c${index}-alt4`),
  ].filter(Boolean);
  if (!values.length) return '';
  return values.length > 1 ? `(${values.join(' OR ')})` : values[0];
}

function selectedConnector(index) {
  const radio = document.querySelector(`input[name="connector${index}"]:checked`);
  return radio ? radio.value : 'AND';
}

function connectorText(index) {
  const selected = selectedConnector(index);
  if (selected !== 'w/#') return selected;
  const count = valueOf(`count${index}`);
  return `w/${count || '#'}`;
}

function updateConnectorGroups() {
  connectorGroups.forEach((group, idx) => {
    const connector = selectedConnector(idx + 1);
    setVisibility(group, connector);
  });
}

function updateSearchPreview() {
  updateConnectorGroups();
  const groups = [1, 2, 3, 4, 5].map(groupValues).filter(Boolean);
  if (!groups.length) {
    searchOutput.value = '';
    searchWrap.classList.remove('is-filled');
    return;
  }

  const assembled = [groups[0]];
  for (let i = 1; i < groups.length; i += 1) {
    assembled.push(connectorText(i), groups[i]);
  }

  searchOutput.value = assembled.join(' ');
  searchWrap.classList.toggle('is-filled', searchOutput.value.length > 0);
}

allInputs.forEach((input) => {
  input.addEventListener('input', updateSearchPreview);
  input.addEventListener('change', updateSearchPreview);
});

document.querySelectorAll('input[type="radio"]').forEach((radio) => {
  radio.addEventListener('change', updateSearchPreview);
});

clearButton.addEventListener('click', () => {
  worksheet.reset();
  searchOutput.value = '';
  connectorGroups.forEach((group, idx) => setVisibility(group, idx === 0 ? 'AND' : 'AND'));
  document.querySelectorAll('input[type="radio"]').forEach((radio) => {
    radio.checked = radio.value === 'AND';
  });
  updateSearchPreview();
});

updateSearchPreview();
