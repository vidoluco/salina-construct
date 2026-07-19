/* ============================================================
   Salinas Construct — Intake Questionnaire Overlay
   Saves responses to localStorage + JSON export
   ============================================================ */

const STORAGE_KEY = 'salinas_responses';

const QUESTIONS = [
  {
    section: '1. Proiectul Dvs.',
    id: 'source',
    label: 'Cum ne-ați găsit?',
    type: 'radio',
    options: ['Recomandare prieten/vecin', 'Google', 'Facebook / Instagram', 'Am văzut lucrări în zonă', 'Altele']
  },
  {
    section: null,
    id: 'property_type',
    label: 'Ce tip de proprietate aveți?',
    type: 'radio',
    options: ['Apartament (bloc)', 'Casă / vilă', 'Spațiu comercial / birou', 'Altele']
  },
  {
    section: null,
    id: 'surface',
    label: 'Suprafața estimată a spațiului?',
    type: 'radio',
    options: ['Sub 50 mp', '50–100 mp', '100–200 mp', 'Peste 200 mp']
  },
  {
    section: null,
    id: 'works',
    label: 'Ce lucrări aveți în vedere? (multiple)',
    type: 'checkbox',
    options: ['Renovare completă', 'Baie / băi', 'Bucătărie', 'Dormitoare / living', 'Instalație electrică', 'Instalație sanitară / termică', 'Finisaje (gresie, parchet, zugrăveli)', 'Tâmplărie (uși, ferestre)', 'Izolație termică / fonică', 'Altele']
  },
  {
    section: null,
    id: 'property_state',
    label: 'Stadiul actual al proprietății?',
    type: 'radio',
    options: ['Locuit(ă), trebuie să stau acolo în timpul lucrărilor', 'Gol(ă), disponibil complet pentru lucrări', 'Construcție nouă la roșu / finisaje', 'Spațiu în demolare parțială']
  },
  {
    section: null,
    id: 'design',
    label: 'Există proiect de design / arhitectură?',
    type: 'radio',
    options: ['Da, proiect complet', 'Da, schițe / idei clare', 'Nu, doresc recomandarea dvs.', 'Nu știu exact — am nevoie de ghidaj']
  },
  {
    section: '2. Așteptări & Buget',
    id: 'start_when',
    label: 'Când doriți să înceapă lucrările?',
    type: 'radio',
    options: ['Cât mai curând (2–4 săptămâni)', 'În 1–3 luni', 'În 3–6 luni', 'Planificare pe termen lung (6+ luni)', 'Flexibil']
  },
  {
    section: null,
    id: 'duration',
    label: 'Timp disponibil pentru finalizare?',
    type: 'radio',
    options: ['Sub 4 săptămâni', '1–2 luni', '2–4 luni', 'Peste 4 luni', 'Fără restricție strictă']
  },
  {
    section: null,
    id: 'budget',
    label: 'Bugetul estimat?',
    type: 'radio',
    options: ['Sub 5.000 EUR', '5.000–15.000 EUR', '15.000–40.000 EUR', '40.000–100.000 EUR', 'Peste 100.000 EUR', 'Nu știu — am nevoie de estimare orientativă']
  },
  {
    section: null,
    id: 'priority',
    label: 'Ce este cel mai important pentru dvs.? (max. 3)',
    type: 'checkbox',
    options: ['Prețul cel mai mic', 'Calitatea materialelor', 'Respectarea termenului', 'Comunicare clară', 'Referințe și portofoliu vizibil', 'Garanție post-execuție', 'Certificări legale', 'Îngrijire și curățenie pe șantier']
  },
  {
    section: '3. Situația Actuală',
    id: 'prev_contractor',
    label: 'Ați mai colaborat cu o firmă de renovări?',
    type: 'radio',
    options: ['Da, cu rezultate bune — caut altă firmă acum', 'Da, cu experiență proastă — vreau să fac lucrurile diferit', 'Nu, este prima renovare', 'Nu, construiesc prima dată']
  },
  {
    section: null,
    id: 'motivation',
    label: 'Ce v-a determinat să acționați acum? (opțional)',
    type: 'textarea',
    placeholder: 'Ex: mi-am cumpărat apartamentul, vreau să îl modernizez înainte să îl închiriez...'
  },
  {
    section: null,
    id: 'notes',
    label: 'Aspecte speciale de știut înainte de prima vizită? (opțional)',
    type: 'textarea',
    placeholder: 'Vecini sensibili, program, acces, preferințe materiale...'
  },
  {
    section: '4. Contact',
    id: 'contact_name',
    label: 'Numele dvs.',
    type: 'text',
    placeholder: 'Prenume Nume'
  },
  {
    section: null,
    id: 'contact_phone',
    label: 'Telefon / WhatsApp',
    type: 'tel',
    placeholder: '+40 7XX XXX XXX'
  },
  {
    section: null,
    id: 'contact_email',
    label: 'Email',
    type: 'email',
    placeholder: 'adresa@email.com'
  },
  {
    section: null,
    id: 'contact_address',
    label: 'Adresa proprietății (orientativ)',
    type: 'text',
    placeholder: 'Strada, sector / oraș'
  },
  {
    section: null,
    id: 'contact_pref',
    label: 'Modalitate preferată de contact?',
    type: 'radio',
    options: ['Telefon / WhatsApp', 'Email', 'Vizită gratuită la proprietate', 'Video call']
  }
];

function buildIntakeModal() {
  const overlay = document.createElement('div');
  overlay.id = 'intakeOverlay';
  overlay.innerHTML = `
    <div class="intake-backdrop" onclick="closeIntake()"></div>
    <div class="intake-modal" role="dialog" aria-modal="true" aria-label="Formular evaluare proiect">
      <div class="intake-header">
        <div>
          <h2>Evaluare Gratuită a Proiectului</h2>
          <p>Completați în ~5 minute. Vă contactăm în 24h.</p>
        </div>
        <button class="intake-close" onclick="closeIntake()" aria-label="Închide">&times;</button>
      </div>
      <form id="intakeForm" class="intake-form" novalidate>
        ${buildFormFields()}
        <div class="intake-footer">
          <p class="intake-privacy">🔒 Toate informațiile sunt confidențiale. Nicio obligație.</p>
          <button type="submit" class="intake-submit">Trimite & Primesc Vizita Gratuită →</button>
        </div>
      </form>
      <div id="intakeSuccess" class="intake-success" hidden>
        <div class="success-icon">✅</div>
        <h3>Mulțumim!</h3>
        <p>Răspunsurile dvs. au fost salvate. Vă contactăm în maxim <strong>24 de ore</strong> pentru a stabili vizita gratuită.</p>
        <button onclick="closeIntake()" class="intake-submit" style="margin-top:1.5rem">Închide</button>
        <button onclick="exportResponses()" class="intake-export-btn" style="margin-top:.75rem">⬇ Descarcă răspunsurile (JSON)</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  const form = document.getElementById('intakeForm');
  form.addEventListener('submit', handleIntakeSubmit);
  autoSaveOnChange();
  restoreDraft();
}

function buildFormFields() {
  let html = '';
  let currentSection = null;

  QUESTIONS.forEach(q => {
    if (q.section && q.section !== currentSection) {
      if (currentSection !== null) html += '</div>';
      currentSection = q.section;
      html += `<div class="intake-section"><h3 class="intake-section-title">${q.section}</h3>`;
    }

    html += `<div class="intake-field" data-id="${q.id}">
      <label class="intake-label">${q.label}</label>`;

    if (q.type === 'radio') {
      html += `<div class="intake-options" role="radiogroup" aria-label="${q.label}">` +
        q.options.map((opt, i) => {
          const optId = `${q.id}_${i}`;
          return `<label class="intake-option" for="${optId}">
            <input type="radio" id="${optId}" name="${q.id}" value="${opt}">
            <span>${opt}</span>
          </label>`;
        }).join('') + `</div>`;
    } else if (q.type === 'checkbox') {
      html += `<div class="intake-options" role="group" aria-label="${q.label}">` +
        q.options.map((opt, i) => {
          const optId = `${q.id}_${i}`;
          return `<label class="intake-option" for="${optId}">
            <input type="checkbox" id="${optId}" name="${q.id}" value="${opt}">
            <span>${opt}</span>
          </label>`;
        }).join('') + `</div>`;
    } else if (q.type === 'textarea') {
      html += `<textarea name="${q.id}" class="intake-input" placeholder="${q.placeholder || ''}" rows="3"></textarea>`;
    } else {
      html += `<input type="${q.type}" name="${q.id}" class="intake-input" placeholder="${q.placeholder || ''}">`;
    }

    html += `</div>`;
  });

  if (currentSection !== null) html += '</div>';
  return html;
}

function autoSaveOnChange() {
  const form = document.getElementById('intakeForm');
  if (!form) return;
  form.addEventListener('change', () => saveDraft(collectFormData()));
  form.addEventListener('input', () => saveDraft(collectFormData()));
}

function saveDraft(data) {
  localStorage.setItem(STORAGE_KEY + '_draft', JSON.stringify({ data, ts: Date.now() }));
}

function restoreDraft() {
  const raw = localStorage.getItem(STORAGE_KEY + '_draft');
  if (!raw) return;
  try {
    const { data } = JSON.parse(raw);
    const form = document.getElementById('intakeForm');
    if (!form) return;
    Object.entries(data).forEach(([name, value]) => {
      if (Array.isArray(value)) {
        value.forEach(v => {
          const el = form.querySelector(`input[name="${name}"][value="${v}"]`);
          if (el) el.checked = true;
        });
      } else {
        const el = form.querySelector(`[name="${name}"]`);
        if (el) {
          if (el.type === 'radio') {
            const radio = form.querySelector(`input[name="${name}"][value="${value}"]`);
            if (radio) radio.checked = true;
          } else {
            el.value = value;
          }
        }
      }
    });
  } catch (_) {}
}

function collectFormData() {
  const form = document.getElementById('intakeForm');
  if (!form) return {};
  const data = {};
  QUESTIONS.forEach(q => {
    if (q.type === 'checkbox') {
      const checked = [...form.querySelectorAll(`input[name="${q.id}"]:checked`)].map(el => el.value);
      if (checked.length) data[q.id] = checked;
    } else if (q.type === 'radio') {
      const checked = form.querySelector(`input[name="${q.id}"]:checked`);
      if (checked) data[q.id] = checked.value;
    } else {
      const el = form.querySelector(`[name="${q.id}"]`);
      if (el && el.value.trim()) data[q.id] = el.value.trim();
    }
  });
  return data;
}

function handleIntakeSubmit(e) {
  e.preventDefault();
  const data = collectFormData();
  data._submitted_at = new Date().toISOString();
  data._id = Date.now();

  // Save to localStorage array
  const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  existing.push(data);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));

  // Clear draft
  localStorage.removeItem(STORAGE_KEY + '_draft');

  // Show success
  document.getElementById('intakeForm').hidden = true;
  document.getElementById('intakeSuccess').hidden = false;
}

function exportResponses() {
  const responses = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  if (!responses.length) { alert('Nu există răspunsuri salvate.'); return; }
  const blob = new Blob([JSON.stringify(responses, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `salinas-responses-${new Date().toISOString().slice(0,10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function openIntake() {
  const overlay = document.getElementById('intakeOverlay');
  if (!overlay) buildIntakeModal();
  document.getElementById('intakeOverlay').style.display = 'flex';
  document.body.style.overflow = 'hidden';
  // Reset form state if previously submitted
  const form = document.getElementById('intakeForm');
  const success = document.getElementById('intakeSuccess');
  if (form && success) { form.hidden = false; success.hidden = true; }
}

function closeIntake() {
  const overlay = document.getElementById('intakeOverlay');
  if (overlay) overlay.style.display = 'none';
  document.body.style.overflow = '';
}

// Keyboard: Escape closes
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeIntake();
});

// Export available globally for admin use
window.exportSalinasResponses = exportResponses;
window.getSalinasResponses = () => JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
