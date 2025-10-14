document.addEventListener('DOMContentLoaded', () => {
  // Tab UI
  const tabs = Array.from(document.querySelectorAll('[role="tab"]'));
  const panels = Array.from(document.querySelectorAll('[role="tabpanel"]'));

  // Activate the first tab by default (or the one with aria-selected)
  function initTabs() {
    let active = tabs.find(t => t.getAttribute('aria-selected') === 'true') || tabs[0];
    activateTab(active);
    tabs.forEach(t => {
      t.addEventListener('click', () => activateTab(t));
      t.addEventListener('keydown', (e) => onKeyDown(e, t));
    });
  }

  function activateTab(tab) {
    tabs.forEach(t => {
      const selected = t === tab;
      t.setAttribute('aria-selected', selected ? 'true' : 'false');
      t.tabIndex = selected ? 0 : -1;
    });

    panels.forEach(panel => {
      const shouldShow = tab.getAttribute('aria-controls') === panel.id;
      if (shouldShow) panel.removeAttribute('hidden');
      else panel.setAttribute('hidden', '');
    });

    // Lazy load resume when the Resume tab is activated
    if (tab.dataset.tab === 'resume' && !window.__resumeLoaded) {
      window.__resumeLoaded = true;
      loadResume();
    }
  }

  function onKeyDown(e, tab) {
    const idx = tabs.indexOf(tab);
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      activateTab(tabs[(idx + 1) % tabs.length]);
      tabs[(idx + 1) % tabs.length].focus();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      activateTab(tabs[(idx - 1 + tabs.length) % tabs.length]);
      tabs[(idx - 1 + tabs.length) % tabs.length].focus();
    } else if (e.key === 'Home') {
      e.preventDefault();
      activateTab(tabs[0]);
      tabs[0].focus();
    } else if (e.key === 'End') {
      e.preventDefault();
      activateTab(tabs[tabs.length - 1]);
      tabs[tabs.length - 1].focus();
    }
  }

  initTabs();

  // Resume rendering (lazy-loaded)
  const root = document.getElementById('resume-root');
  const downloadLink = document.getElementById('download-json');
  const printBtn = document.getElementById('print-resume');
  const dataPath = downloadLink ? downloadLink.getAttribute('href') : 'assets/data/resume.json';

  async function loadResume() {
    try {
      const res = await fetch(dataPath, { cache: 'no-cache' });
      const json = await res.json();
      render(json);
    } catch (err) {
      if (root) root.innerHTML = '<p>Unable to load resume data.</p>';
      console.error(err);
    }
  }

  function render(data) {
    if (!root) return;
    const parts = [];

    // Header: name / headline / contact
    if (data.name || data.headline) {
      parts.push('<header class="resume-header">');
      if (data.name) parts.push(`<h1>${escape(data.name)}</h1>`);
      if (data.headline) parts.push(`<p class="meta">${escape(data.headline)}</p>`);
      if (data.contact) {
        const c = data.contact;
        const contactParts = [];
        if (c.location) contactParts.push(escape(c.location));
        if (c.phone) contactParts.push(escape(c.phone));
        if (c.email) contactParts.push(`<a href="mailto:${escapeAttr(c.email)}">${escape(c.email)}</a>`);
        if (c.linkedin) contactParts.push(`<a href="${escapeAttr(c.linkedin)}" target="_blank" rel="noopener noreferrer">LinkedIn</a>`);
        if (contactParts.length) parts.push(`<p class="contact">${contactParts.join(' • ')}</p>`);
      }
      parts.push('</header>');
    }

    // Summary
    if (data.summary) {
      parts.push(`<section class="summary"><h3>Professional Summary</h3><p>${escape(data.summary)}</p></section>`);
    }

    // Experience
    if (Array.isArray(data.experience) && data.experience.length) {
      parts.push('<section class="experience"><h3>Professional Experience</h3>');
      data.experience.forEach(exp => {
        parts.push('<article class="resume-item">');
        parts.push(`<div class="resume-heading"><div><div class="role">${escape(exp.title || '')}${exp.company ? ' — <span class="meta">' + escape(exp.company) + '</span>' : ''}</div>`);
        if (exp.range || exp.location) {
          parts.push(`<div class="meta">${escape(exp.range || '')}${exp.location ? ' • ' + escape(exp.location) : ''}</div>`);
        }
        parts.push('</div></div>');
        if (Array.isArray(exp.responsibilities) && exp.responsibilities.length) {
          parts.push('<ul>');
          exp.responsibilities.forEach(r => parts.push(`<li>${escape(r)}</li>`));
          parts.push('</ul>');
        }
        parts.push('</article>');
      });
      parts.push('</section>');
    }

    // Certifications
    if (Array.isArray(data.certifications) && data.certifications.length) {
      parts.push('<section class="certifications"><h3>Certifications</h3><ul>');
      data.certifications.forEach(c => parts.push(`<li>${escape(c)}</li>`));
      parts.push('</ul></section>');
    }

    // Education
    if (Array.isArray(data.education) && data.education.length) {
      parts.push('<section class="education"><h3>Education</h3><ul>');
      data.education.forEach(ed => {
        const label = ed.degree ? `${escape(ed.degree)} — ${escape(ed.institution)}` : escape(ed.institution || '');
        parts.push(`<li>${label}</li>`);
      });
      parts.push('</ul></section>');
    }

    // Volunteer / Service
    if (Array.isArray(data.volunteer) && data.volunteer.length) {
      parts.push('<section class="volunteer"><h3>Volunteer & Service</h3><ul>');
      data.volunteer.forEach(v => parts.push(`<li>${escape(v)}</li>`));
      parts.push('</ul></section>');
    }

    // Core skills (categorized)
    if (data.core_skills && typeof data.core_skills === 'object') {
      parts.push('<section class="skills"><h3>Core Skills & Experience</h3>');
      Object.keys(data.core_skills).forEach(key => {
        const title = key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
        const list = Array.isArray(data.core_skills[key]) ? data.core_skills[key] : [];
        parts.push(`<div class="skill-group"><h4>${escape(title)}</h4>`);
        if (list.length) {
          parts.push('<ul>');
          list.forEach(s => parts.push(`<li>${escape(s)}</li>`));
          parts.push('</ul>');
        }
        parts.push('</div>');
      });
      parts.push('</section>');
    }

    root.innerHTML = parts.join('');
  }

  printBtn && printBtn.addEventListener('click', () => window.print());

  // basic escaping helpers
  function escape(str) { return String(str || '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }
  function escapeAttr(str) { return encodeURI(String(str || '')); }
});
