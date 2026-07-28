(() => {
  const root = document.documentElement;
  const sheet = document.getElementById('sheet');
  const form = document.getElementById('worksheet');
  const storageKey = 'crafting-efficient-search-v4';

  const columns = [161, 486, 811, 1138, 1463];
  const altColumns = [162, 486, 811, 1135, 1460];
  const termY = 285;
  const altYs = [402, 515, 627, 740];
  const radioXs = [409, 735, 1059, 1384];
  const radioYs = [247, 281, 314, 348];

  const makeInput = (type, className, id, left, top, width, height, extra = {}) => {
    const el = document.createElement(type === 'textarea' ? 'textarea' : 'input');
    el.className = className;
    el.id = id;
    if (el.tagName === 'INPUT') el.type = extra.type || 'text';
    el.name = id;
    el.autocomplete = 'off';
    el.spellcheck = false;
    el.placeholder = extra.placeholder || '';
    el.style.left = `${left}px`;
    el.style.top = `${top}px`;
    el.style.width = `${width}px`;
    el.style.height = `${height}px`;
    if (extra.ariaLabel) el.setAttribute('aria-label', extra.ariaLabel);
    return el;
  };

  const makeRadio = (name, value, left, top) => {
    const el = document.createElement('input');
    el.type = 'radio';
    el.className = 'radio-box';
    el.name = name;
    el.value = value;
    el.style.left = `${left}px`;
    el.style.top = `${top}px`;
    el.setAttribute('aria-label', `${name} ${value}`);
    return el;
  };

  const termFieldIds = columns.map((_, index) => [
    `term-${index + 1}`,
    ...Array.from({ length: 4 }, (_, altIndex) => `c${index + 1}-alt${altIndex + 1}`)
  ]).flat();

  // Issue, search, database, and clear button overlay.
  form.appendChild(
    makeInput('input', 'field issue-field', 'issue', 232, 174, 1482, 34, {
      ariaLabel: 'Issue'
    })
  );

  // Term and alternative fields.
  columns.forEach((left, index) => {
    form.appendChild(
      makeInput('input', 'field term-field', `term-${index + 1}`, left, termY, 244, 61, {
        ariaLabel: `Term ${index + 1}`
      })
    );

    altYs.forEach((top, altIndex) => {
      form.appendChild(
        makeInput('input', 'field alt-field', `c${index + 1}-alt${altIndex + 1}`, altColumns[index], top, 243, 58, {
          ariaLabel: `Alternative ${index + 1}.${altIndex + 1}`
        })
      );
    });
  });

  // Search area and database line.
  const searchField = makeInput('textarea', 'field search-field', 'search', 106, 662, 1570, 382, {
    ariaLabel: 'Search'
  });
  searchField.readOnly = true;
  form.appendChild(searchField);

  form.appendChild(
    makeInput('input', 'field database-field', 'database', 259, 1048, 1467, 30, {
      ariaLabel: 'Database'
    })
  );

  // Connector checkboxes.
  radioXs.forEach((left, columnIndex) => {
    ['AND', 'w/p', 'w/s', 'w/#'].forEach((value, radioIndex) => {
      const radio = makeRadio(`connector-${columnIndex + 1}`, value, left, radioYs[radioIndex]);
      if (radioIndex === 0) radio.checked = true;
      form.appendChild(radio);
    });
  });

  const clearButton = document.createElement('button');
  clearButton.type = 'button';
  clearButton.className = 'clear-btn';
  clearButton.id = 'clearForm';
  clearButton.textContent = 'Clear Form';
  clearButton.setAttribute('aria-label', 'Clear Form');
  form.appendChild(clearButton);

  const allFields = [...form.querySelectorAll('input.field, textarea.field')];
  const allRadios = [...form.querySelectorAll('input[type="radio"]')];
  const radiosByGroup = [...new Set(allRadios.map((radio) => radio.name))].map((name) =>
    allRadios.filter((radio) => radio.name === name)
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

  const selectedConnector = (groupName) => {
    const group = radiosByGroup.find((items) => items[0]?.name === groupName);
    const checked = group?.find((radio) => radio.checked);
    return checked?.value || 'AND';
  };

  const buildSearch = () => {
    const columnsExpr = columns.map((_, index) => {
      const values = [
        document.getElementById(`term-${index + 1}`)?.value || '',
        ...Array.from({ length: 4 }, (_, altIndex) => document.getElementById(`c${index + 1}-alt${altIndex + 1}`)?.value || '')
      ];
      return buildGroupExpression(values);
    }).filter(Boolean);

    if (!columnsExpr.length) return '';

    let result = columnsExpr[0];
    for (let i = 0; i < columnsExpr.length - 1; i += 1) {
      const connector = selectedConnector(`connector-${i + 1}`);
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
    for (const group of radiosByGroup) {
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
      for (const group of radiosByGroup) {
        const groupName = group[0]?.name;
        const value = data[groupName];
        if (value) {
          const radio = group.find((item) => item.value === value);
          if (radio) radio.checked = true;
        }
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
    for (const group of radiosByGroup) {
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
