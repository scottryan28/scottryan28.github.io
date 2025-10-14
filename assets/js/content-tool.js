// Lightweight Content Lab (client-only, no external APIs)
// Place this file at assets/js/content-tool.js and include it in the layout or page.

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('content-tool-form');
  if (!form) return;

  const typeEl = document.getElementById('content-type');
  const toneEl = document.getElementById('content-tone');
  const keywordsEl = document.getElementById('content-keywords');
  const output = document.getElementById('content-tool-output');
  const genBtn = document.getElementById('generate-content');
  const dlBtn = document.getElementById('download-content');

  function generate() {
    const type = typeEl.value;
    const tone = toneEl.value;
    const keywords = (keywordsEl.value || '').split(',').map(s => s.trim()).filter(Boolean);

    // Very small, deterministic templates — no network calls, GitHub Pages compatible.
    const kw = keywords.length ? ` (${keywords.join(', ')})` : '';
    let text = '';

    if (type === 'bio') {
      if (tone === 'friendly') text = `Hi — I'm Scott, a software engineer building reliable web experiences${kw}. I love clean code and practical design.`;
      else if (tone === 'concise') text = `Software engineer focused on web apps${kw}.`;
      else text = `Software engineer focused on building reliable, maintainable web applications${kw}.`;
    } else if (type === 'project') {
      if (tone === 'friendly') text = `This project explores an elegant solution for ${keywords.join(', ')}${kw} — built with performance and accessibility in mind.`;
      else if (tone === 'concise') text = `${keywords.join(', ')} — performant, accessible.`;
      else text = `A project focused on ${keywords.join(', ')}${kw}, emphasizing reliability and maintainability.`;
    } else { // blog intro
      if (tone === 'friendly') text = `In this post we'll take a friendly tour of ${keywords.join(', ')}${kw} and why it matters.`;
      else if (tone === 'concise') text = `${keywords.join(', ')} — an overview.`;
      else text = `An overview of ${keywords.join(', ')}${kw}, with practical examples and takeaways.`;
    }

    output.textContent = text;
    return text;
  }

  genBtn.addEventListener('click', () => generate());

  dlBtn.addEventListener('click', () => {
    const text = generate();
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'draft.txt';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  });
});
