(() => {
  const root = document.documentElement;
  const form = document.getElementById('worksheet');
  const storageKey = 'crafting-efficient-search-v5';

  const columns = [161, 486, 811, 1138, 1463];
  const altColumns = [162, 486, 811, 1135, 1460];
  const termY = 285;
  const altYs = [402, 515, 627, 740];

  const connectorLefts = [286, 611, 936, 1261];
  const connectorTop = 198;
  const connectorRowGaps = [0, 33, 66, 99];

  const makeInput = (className, id, left, top, width, height, extra = {}) => {
    const el = document.createElement(extra.tag || 'input');
    if (el.tagName === 'TEXTAREA') {
      el.rows = extra.rows || 1;
    } else {
      el.type = extra.type || 'text';
    }
    el.className = className;
    el.id = id;
    el.name = id;
    el.autocomplete = 'off';
    el.spellcheck = false;
    el.placeholder = extra.placeholder || '';
    el.style.left = `${left}px`;
    el.style.top = `${top}px`;
    el.style.width = `${width}px`;
    el.style.height = `${height}px`;
    if (extra.ariaLabel) el.setAttribute('aria-label', extra.ariaLabel);
    if (extra.readOnly) el.readOnly = true;
    return el;
  };

  const addConnectorGroup = (groupIndex, left) => {
    const group = document.createElement('div');
    group.className = 'connector-group';
    group.style.left = `${left}px`;
    group.style.top = `${connectorTop}px`;
    group.setAttribute('aria-label', `Connector group ${groupIndex + 1}`);

    const values = [
      { value: 'AND', label: 'AND', rowClass: '' },
      { value: 'w/p', label: 'w/p', rowClass: '' },
      { value: 'w/s', label: 'w/s', rowClass: '' },
      { value: 'w/#', label: 'w/', rowClass: 'connector-row--distance' }
    ];

    values.forEach((item, rowIndex) => {
      const row = document.createElement('label');
      row.className = `connector-row ${item.rowClass}`.trim();
      row.style.marginTop = `${connectorRowGaps[rowIndex]}px`;

      const input = document.createElement('input');
      input.type = 'radio';
      input.className = 'connector-input';
      input.name = `connector-${groupIndex + 1}`;
      input.value = item.value;
      if (rowIndex === 0) input.checked = true;

      const box = document.createElement('span');
      box.className = 'connector-box';

      const text = document.createElement('span');
      text.className = 'connector-label';
      text.textContent = item.label;

      row.appendChild(input);
      row.appendChild(box);
      row.appendChild(text);

      if (item.value === 'w/#') {
        const num = document.createElement('input');
        num.type = 'number';
        num.min = '1';
        num.step = '1';
        num.inputMode = 'numeric';
        num.className = 'distance-field';
        num.id = `count${groupIndex + 1}`;
        num.placeholder = '#';
        num.setAttribute('aria-label', `Distance for connector group ${groupIndex + 1}`);
        row.appendChild(num);
      }

      group.appendChild(row);
    });

    return group;
  };

  // Issue.
  form.appendChild(
    makeInput('field issue-field', 'issue', 226, 122, 1500, 36, {
      ariaLabel: 'Issue'
    })
  );

  // Term and alternative fields.
  columns.forEach((left, index) => {
    form.appendChild(
      makeInput('field term-field', `term-${index + 1}`, left, termY, 244, 61, {
        ariaLabel: `Term ${index + 1}`
      })
    );

    altYs.forEach((top, altIndex) => {
      form.appendChild(
        makeInput('field alt-field', `c${index + 1}-alt${altIndex + 1}`, altColumns[index], top, 243, 58, {
          ariaLabel: `Alternative ${index + 1}.${altIndex + 1}`
        })
      );
    });
  });

  // Connector groups.
  connectorLefts.forEach((left, index) => {
    form.appendChild(addConnectorGroup(index, left));
  });

  // Search area and database line.
  const searchField = makeInput('field search-field', 'search', 76, 868, 1608, 118, {
    tag: 'textarea',
    ariaLabel: 'Search',
    readOnly: true,
    placeholder: 'Your assembled search string will appear here.'
  });
  form.appendChild(searchField);

  form.appendChild(
    makeInput('field database-field', 'database', 259, 1048, 1467, 30, {
      ariaLabel: 'Database'
    })
  );

  const clearButton = document.createElement('button');
  clearButton.type = 'button';
  clearButton.className = 'clear-btn';
  clearButton.id = 'clearForm';
  clearButton.textContent = 'Clear Form';
  clearButton.setAttribute('aria-label', 'Clear Form');
  form.appendChild(clearButton);

  const allFields = [...form.querySelectorAll('input.field, textarea.field')];
  const radioGroups = [...form.querySelectorAll('.connector-group')].map((group) =>
    [...group.querySelectorAll('input[type="radio"]')]
  );

  const fit = () => {
    const w = root.clientWidth || window.innerWidth;
    const h = window.innerHeight;
    const scale = Math.min(w / 1760, h / 1360, 1);
    root.style.setProperty('--scale', String(scale));
  };

  const normalize = (value) => value.trim().replace(/\s+/g, ' ');

  const buildGroupExpression = (values) => {
    const items = values.map(normalize).filter(Boolean);
    if (items.length === 0) return '';
    if (items.length === 1) return items[0];
    return `(${items.join(' OR ')})`;
  };

  const selectedConnector = (groupIndex) => {
    const group = radioGroups[groupIndex];
    const checked = group?.find((radio) => radio.checked);
    return checked?.value || 'AND';
  };

  const buildSearch = () => {
    const columnsExpr = columns
      .map((_, index) => {
        const values = [
          document.getElementById(`term-${index + 1}`)?.value || '',
          ...Array.from({ length: 4 }, (_, altIndex) => document.getElementById(`c${index + 1}-alt${altIndex + 1}`)?.value || '')
        ];
        return buildGroupExpression(values);
      })
      .filter(Boolean);

    if (!columnsExpr.length) return '';

    let result = columnsExpr[0];
    for (let i = 0; i < columnsExpr.length - 1; i += 1) {
      const connector = selectedConnector(i);
      const nextExpr = columnsExpr[i + 1];
      if (connector === 'w/#') {
        const countInput = document.getElementById(`count${i + 1}`);
        const distance = normalize(countInput?.value || '');
        result += ` w/${distance || '#'} ${nextExpr}`;
      } else {
        result += ` ${connector} ${nextExpr}`;
      }
    }

    return result;
  };

  const updateSearchOutput = () => {
    searchField.value = buildSearch();
  };

  const save = () => {
    const data = {};
    for (const field of allFields) data[field.id] = field.value;
    for (const group of radioGroups) {
      const checked = group.find((radio) => radio.checked);
      if (checked) data[checked.name] = checked.value;
    }
    try {
      localStorage.setItem(storageKey, JSON.stringify(data));
    } catch {
      // Ignore storage errors.
    }
  };

  const restore = () => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return;
      const data = JSON.parse(raw);
      for (const field of allFields) {
        if (Object.prototype.hasOwnProperty.call(data, field.id)) {
          field.value = data[field.id];
        }
      }
      for (const group of radioGroups) {
        const checked = group.find((radio) => data[radio.name] === radio.value);
        if (checked) checked.checked = true;
      }
    } catch {
      // Ignore corrupt storage.
    }
  };

  const sync = () => {
    updateSearchOutput();
    save();
  };

  const clear = () => {
    for (const field of allFields) field.value = '';
    for (const group of radioGroups) {
      const first = group[0];
      if (first) first.checked = true;
    }
    sync();
  };

  form.addEventListener('input', sync);
  form.addEventListener('change', sync);
  clearButton.addEventListener('click', clear);
  window.addEventListener('resize', fit);
  window.addEventListener('orientationchange', fit);

  restore();
  updateSearchOutput();
  fit();
})();
