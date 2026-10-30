'use strict';
(() => {
  const config = window.KNOWLEDGEATHON_CONFIG || {};
  const safeUrl = value => { try { const url = new URL(value); return url.protocol === 'https:' ? url.href : null; } catch { return null; } };
  for (const [kind, key] of [['registration', 'registrationFormUrl'], ['submission', 'submissionFormUrl']]) {
    const url = safeUrl(config[key]);
    if (!url) continue;
    document.querySelectorAll(`[data-${kind}-link]`).forEach(link => { link.href = url; link.hidden = false; link.target = '_blank'; link.rel = 'noopener noreferrer'; });
    document.querySelectorAll(`[data-${kind}-pending]`).forEach(el => { el.hidden = true; });
    document.querySelectorAll(`[data-${kind}-ready]`).forEach(el => { el.hidden = false; });
  }
  const search = document.querySelector('#faq-search');
  if (search) {
    const details = [...document.querySelectorAll('.faq-list details')];
    const result = document.querySelector('#faq-result');
    search.addEventListener('input', () => {
      const query = search.value.trim().toLowerCase();
      let count = 0;
      details.forEach(item => { const show = item.textContent.toLowerCase().includes(query); item.hidden = !show; if (show) count++; });
      result.textContent = count ? `${count} question${count === 1 ? '' : 's'} found` : 'No matching questions. Try a different term or email the organizing committee.';
    });
  }
  const checklist = document.querySelector('[data-checklist]');
  if (checklist) {
    const boxes = [...checklist.querySelectorAll('input[type="checkbox"]')];
    const progress = document.querySelector('[data-check-progress]');
    const update = () => { const done = boxes.filter(box => box.checked).length; progress.textContent = `${done} of ${boxes.length} preparation checks complete. This checklist does not submit your project.`; };
    checklist.addEventListener('change', update); update();
  }
  const gallery = document.querySelector('#project-list');
  const projects = Array.isArray(config.publicProjects) ? config.publicProjects.filter(p => p && p.name && p.description && safeUrl(p.url)) : [];
  if (gallery && projects.length) {
    document.querySelector('#gallery-empty').hidden = true;
    document.querySelector('#gallery-filters').hidden = false;
    const filter = document.querySelector('#pathway-filter');
    const render = () => {
      gallery.replaceChildren();
      const matches = projects.filter(p => !filter.value || p.pathway === filter.value);
      for (const project of matches) {
        const article = document.createElement('article'); article.className = 'project-card';
        const tag = document.createElement('span'); tag.className = 'tag'; tag.textContent = project.pathway || 'Engineering knowledge';
        const h3 = document.createElement('h3'); h3.textContent = project.name;
        const description = document.createElement('p'); description.textContent = project.description;
        const team = document.createElement('p'); team.className = 'small'; team.textContent = project.team || '';
        const link = document.createElement('a'); link.href = safeUrl(project.url); link.textContent = 'Explore project →'; link.target = '_blank'; link.rel = 'noopener noreferrer';
        article.append(tag,h3,description,team,link); gallery.append(article);
      }
      document.querySelector('#project-count').textContent = `${matches.length} project${matches.length === 1 ? '' : 's'}`;
      document.querySelector('#gallery-no-match').hidden = matches.length > 0;
    };
    filter.addEventListener('change',render); render();
  }
  const people = document.querySelector('#participant-list');
  const participants = Array.isArray(config.publicParticipants) ? config.publicParticipants.filter(p => p && p.name) : [];
  if (people && participants.length) {
    document.querySelector('#participants-empty').hidden = true;
    participants.forEach(person => {
      const card = document.createElement('article'); card.className='project-card';
      const title = document.createElement('h3'); title.textContent=person.name;
      const description = document.createElement('p'); description.textContent=person.description || '';
      card.append(title,description); people.append(card);
    });
  }
})();
