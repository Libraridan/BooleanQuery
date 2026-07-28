(() => {
  const root = document.documentElement;
  const viewport = document.getElementById('viewport');
  const clearButton = document.getElementById('clearForm');
  const fields = [...document.querySelectorAll('input, textarea')];
  const storageKey = 'crafting-efficient-search-v2';

  const fit = () => {
    const sheetW = 1760;
    const sheetH = 1360;
    const padding = 16;
    const scale = Math.min((window.innerWidth - padding) / sheetW, (window.innerHeight - padding) / sheetH, 1);
    root.style.setProperty('--scale', String(Math.max(scale, 0.35)));
    viewport.style.width = `${sheetW * Math.max(scale, 0.35)}px`;
    viewport.style.height = `${sheetH * Math.max(scale, 0.35)}px`;
  };

  const updateConnectorStates = () => {
    for (const group of document.querySelectorAll('.connectors')) {
      const checked = group.querySelector('input[type="radio"]:checked');
      group.dataset.active = checked ? checked.value : 'AND';
    }
  };

  const save = () => {
    updateConnectorStates();
    const data = {};
    for (const field of fields) {
      if (!field.id && !field.name) continue;
      if (field.type === 'radio') {
        if (field.checked) data[field.name] = field.value;
        continue;
      }
      data[field.id || field.name] = field.value;
    }
    try {
      localStorage.setItem(storageKey, JSON.stringify(data));
    } catch {
      // Ignore storage failures.
    }
  };

  const restore = () => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return;
      const data = JSON.parse(raw);
      for (const [key, value] of Object.entries(data)) {
        const radio = document.querySelector(`input[type="radio"][name="${CSS.escape(key)}"][value="${CSS.escape(value)}"]`);
        if (radio) {
          radio.checked = true;
          continue;
        }
        const el = document.getElementById(key) || document.querySelector(`[name="${CSS.escape(key)}"]`);
        if (el && 'value' in el) el.value = value;
      }
    } catch {
      // Ignore corrupt storage.
    }
  };

  const clear = () => {
    for (const field of fields) {
      if (field.type === 'radio') continue;
      field.value = '';
    }
    for (const radio of document.querySelectorAll('input[type="radio"]')) {
      radio.checked = radio.value === 'AND';
    }
    save();
  };

  fields.forEach((field) => {
    field.addEventListener('input', save);
    field.addEventListener('change', save);
  });
  clearButton.addEventListener('click', clear);
  window.addEventListener('resize', fit);
  window.addEventListener('orientationchange', fit);

  restore();
  fit();
  save();
})();
