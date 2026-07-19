/* ============================================================
   Salinas Construct — QA Overlay Panel
   Toggle: Alt+Q  |  Hidden in production, visible for review
   ============================================================ */

(function () {
  const QA_CHECKS = [
    {
      label: 'Portfolio: 6 cards con imagini reale',
      check: () => {
        const imgs = document.querySelectorAll('.portfolio-item img.portfolio-image');
        return { ok: imgs.length >= 6, detail: `${imgs.length}/6 imagini` };
      }
    },
    {
      label: 'Portfolio: imagini se încarcă (nu broken)',
      check: async () => {
        const imgs = [...document.querySelectorAll('.portfolio-item img.portfolio-image')];
        const results = await Promise.all(imgs.map(img => new Promise(res => {
          if (img.complete && img.naturalWidth > 0) return res(true);
          img.onload = () => res(true);
          img.onerror = () => res(false);
          if (img.complete) res(img.naturalWidth > 0);
        })));
        const ok = results.every(Boolean);
        const failed = results.filter(r => !r).length;
        return { ok, detail: ok ? 'Toate OK' : `${failed} imagini broken` };
      }
    },
    {
      label: 'Formular contact: câmpuri prezente',
      check: () => {
        const form = document.getElementById('contactForm');
        const fields = form ? form.querySelectorAll('input, textarea, select') : [];
        return { ok: fields.length >= 4, detail: `${fields.length} câmpuri găsite` };
      }
    },
    {
      label: 'Buton CTA Intake prezent',
      check: () => {
        const btn = document.querySelector('[onclick="openIntake()"], .btn-intake');
        return { ok: !!btn, detail: btn ? 'Găsit' : 'Lipsește butonul openIntake()' };
      }
    },
    {
      label: 'Nav links funcționale (ancre interne)',
      check: () => {
        const links = [...document.querySelectorAll('nav a[href^="#"]')];
        const broken = links.filter(a => {
          const id = a.getAttribute('href').slice(1);
          return id && !document.getElementById(id) && !document.querySelector(`.${id}`);
        });
        return { ok: broken.length === 0, detail: broken.length ? `${broken.length} broken: ${broken.map(a => a.href).join(', ')}` : `${links.length} links OK` };
      }
    },
    {
      label: 'Logo identity.png se încarcă',
      check: async () => {
        const logo = document.querySelector('.logo-image');
        if (!logo) return { ok: false, detail: 'Elementul .logo-image lipsește' };
        return new Promise(res => {
          if (logo.complete && logo.naturalWidth > 0) return res({ ok: true, detail: 'OK' });
          logo.onload = () => res({ ok: true, detail: 'OK' });
          logo.onerror = () => res({ ok: false, detail: 'Imagine lipsă sau eroare' });
          if (logo.complete) res({ ok: logo.naturalWidth > 0, detail: logo.naturalWidth > 0 ? 'OK' : 'Broken' });
        });
      }
    },
    {
      label: 'Filtru portfolio: butoane funcționale',
      check: () => {
        const btns = document.querySelectorAll('.filter-btn');
        return { ok: btns.length >= 4, detail: `${btns.length} butoane filtru` };
      }
    },
    {
      label: 'Language switcher prezent',
      check: () => {
        const lang = document.querySelectorAll('[data-lang]');
        return { ok: lang.length >= 2, detail: lang.length >= 2 ? 'RO/EN prezent' : 'Lipsă' };
      }
    },
    {
      label: 'Meta description prezentă',
      check: () => {
        const meta = document.querySelector('meta[name="description"]');
        const ok = meta && meta.content.length > 50;
        return { ok, detail: ok ? `${meta.content.length} chars` : 'Lipsă sau prea scurtă' };
      }
    },
    {
      label: 'Mobile viewport meta prezentă',
      check: () => {
        const vp = document.querySelector('meta[name="viewport"]');
        return { ok: !!vp, detail: vp ? vp.content : 'Lipsă' };
      }
    },
    {
      label: 'LocalStorage: răspunsuri salvate',
      check: () => {
        const raw = localStorage.getItem('salinas_responses');
        const data = raw ? JSON.parse(raw) : [];
        return { ok: true, detail: `${data.length} răspuns(uri) salvat(e)`, info: true };
      }
    },
    {
      label: 'Console: fără erori critice la load',
      check: () => {
        return { ok: window._qaNoErrors !== false, detail: 'Verifică manual console (F12)', warn: true };
      }
    }
  ];

  function buildPanel() {
    const panel = document.createElement('div');
    panel.id = 'qaPanel';
    panel.innerHTML = `
      <div class="qa-header">
        <span>🔍 QA Panel</span>
        <div style="display:flex;gap:.5rem;align-items:center">
          <button onclick="window.exportSalinasResponses && window.exportSalinasResponses()" title="Export răspunsuri" style="background:rgba(255,255,255,.15);border:none;color:#fff;padding:.25rem .6rem;border-radius:4px;cursor:pointer;font-size:.8rem">⬇ Răspunsuri</button>
          <button id="qaClose" title="Închide (Alt+Q)" style="background:none;border:none;color:#fff;font-size:1.2rem;cursor:pointer;line-height:1">&times;</button>
        </div>
      </div>
      <div id="qaChecks" class="qa-checks">
        <div class="qa-running">⏳ Se verifică...</div>
      </div>
      <div class="qa-footer">Alt+Q toggle &nbsp;|&nbsp; <a href="assets/photos/CLASSIFICATION.md" style="color:#aef" target="_blank">📁 Clasificare imagini</a></div>
    `;
    document.body.appendChild(panel);
    document.getElementById('qaClose').addEventListener('click', toggleQA);
    runChecks();
  }

  async function runChecks() {
    const container = document.getElementById('qaChecks');
    if (!container) return;
    container.innerHTML = '';
    let passed = 0, failed = 0, warned = 0;

    for (const item of QA_CHECKS) {
      let result;
      try { result = await Promise.resolve(item.check()); } catch (e) { result = { ok: false, detail: e.message }; }

      const row = document.createElement('div');
      row.className = 'qa-row';
      const icon = result.info ? 'ℹ️' : result.warn ? '⚠️' : result.ok ? '✅' : '❌';
      row.innerHTML = `<span class="qa-icon">${icon}</span><div><div class="qa-label">${item.label}</div><div class="qa-detail">${result.detail || ''}</div></div>`;
      container.appendChild(row);

      if (result.info || result.warn) warned++;
      else if (result.ok) passed++;
      else failed++;
    }

    const summary = document.createElement('div');
    summary.className = 'qa-summary';
    summary.innerHTML = `<strong>${passed} OK</strong> · <span style="color:#f87171">${failed} FAIL</span> · <span style="color:#fbbf24">${warned} INFO</span>`;
    container.appendChild(summary);
  }

  let panelBuilt = false;
  function toggleQA() {
    if (!panelBuilt) { buildPanel(); panelBuilt = true; return; }
    const p = document.getElementById('qaPanel');
    if (p) p.style.display = p.style.display === 'none' ? 'flex' : 'none';
  }

  // Gate: only activate on local dev hosts. Hidden in production, visible for review.
  // Deliberately NOT OR'd with a public query param (e.g. ?qa=1) - that would let any
  // visitor to the live site unlock this panel, since this script loads unconditionally
  // on every page load and is fully readable via view-source.
  function isQAEnabled() {
    const host = location.hostname;
    const isLocalHost = host === 'localhost' || host === '127.0.0.1' || host.startsWith('192.168.');
    return isLocalHost;
  }

  if (isQAEnabled()) {
    // Keyboard shortcut Alt+Q
    document.addEventListener('keydown', e => {
      if (e.altKey && e.key.toLowerCase() === 'q') toggleQA();
    });

    // Floating toggle button
    const fab = document.createElement('button');
    fab.id = 'qaFab';
    fab.title = 'QA Panel (Alt+Q)';
    fab.textContent = 'QA';
    fab.addEventListener('click', toggleQA);
    document.body.appendChild(fab);

    // Expose for console use
    window.runQA = toggleQA;
  }
})();
