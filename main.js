function loadSection(section) {
  const main = document.getElementById('mainContent');
  main.innerHTML = 'Chargement...';
  fetch(`admin_${section}.html`)
    .then(r => r.text())
    .then(html => { main.innerHTML = html; })
    .catch(() => { main.innerHTML = 'Erreur de chargement.'; });
}
// Chargement par défaut du dashboard
window.onload = () => loadSection('dashboard');
