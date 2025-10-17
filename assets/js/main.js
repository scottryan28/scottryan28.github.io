<script>
document.addEventListener("DOMContentLoaded", function() {
  const resumeRoot = document.getElementById("resume-root");
  const printButton = document.getElementById("print-resume");

  if (!resumeRoot) return;

  fetch("{{ '/assets/data/resume.json' | relative_url }}")
    .then(response => response.json())
    .then(data => renderResume(data))
    .catch(err => {
      console.error("Error loading resume:", err);
      resumeRoot.innerHTML = `
        <p class="error">Sorry — the résumé data couldn’t be loaded right now.</p>
        <p><a href="{{ '/assets/data/resume.json' | relative_url }}" target="_blank">View raw JSON instead</a></p>
      `;
    });

  function renderResume(data) {
    let html = `
      <header class="resume-header">
        <h2>${data.name}</h2>
        <p class="subtitle">${data.title} — ${data.location}</p>
        <p>${data.summary}</p>
      </header>
    `;

    if (data.experience?.length) {
      html += `
        <section class="resume-section">
          <h3>Experience</h3>
          ${data.experience.map(job => `
            <article class="job">
              <header>
                <h4>${job.title}</h4>
                <p class="meta">${job.company} • ${job.start}–${job.end}</p>
              </header>
              <p>${job.description}</p>
            </article>
          `).join('')}
        </section>
      `;
    }

    if (data.education?.length) {
      html += `
        <section class="resume-section">
          <h3>Education</h3>
          <ul>
            ${data.education.map(ed => `<li><strong>${ed.school}</strong> — ${ed.degree}</li>`).join('')}
          </ul>
        </section>
      `;
    }

    if (data.certifications?.length) {
      html += `
        <section class="resume-section">
          <h3>Certifications</h3>
          <ul>
            ${data.certifications.map(cert => `<li>${cert}</li>`).join('')}
          </ul>
        </section>
      `;
    }

    if (data.skills?.length) {
      html += `
        <section class="resume-section">
          <h3>Core Skills</h3>
          <div class="skills-grid">
            ${data.skills.map(skill => `<span class="skill">${skill}</span>`).join('')}
          </div>
        </section>
      `;
    }

    resumeRoot.innerHTML = html;
  }

  if (printButton) {
    printButton.addEventListener("click", () => window.print());
  }
});
</script>
