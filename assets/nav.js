/* =========================================================================
   L'ÉTABLI — navigation partagée
   Une seule source de vérité pour le menu du haut. Chaque page HTML n'a
   qu'à inclure <div id="site-nav"></div> + <script src="assets/nav.js" defer></script>
   Pour ajouter/renommer une page du site, on ne modifie QUE ce fichier.
   ========================================================================= */
(function(){
  const PAGES = [
    { id: 'etabli',      label: "Établi",     icon: '🪵', href: 'etabli.html' },
    { id: 'atlas',       label: 'Atlas',      icon: '🗺️', href: 'atlas.html' },
    { id: 'grimoire',    label: 'Grimoire',   icon: '📖', href: 'grimoire.html' },
    { id: 'carnet',      label: 'Carnet',     icon: '📓', href: 'carnet.html' },
    { id: 'inventaire',  label: 'Inventaire', icon: '📦', href: 'inventaire.html' },
    { id: 'projets',     label: 'Projets',    icon: '🧱', href: 'projets.html' },
  ];

  function renderNav(){
    const container = document.getElementById('site-nav');
    if (!container) return;

    const current = container.dataset.current || '';
    const nav = document.createElement('nav');
    nav.id = 'site-nav';

    PAGES.forEach(page => {
      const a = document.createElement('a');
      a.href = page.href;
      if (page.id === current) a.classList.add('current');
      a.innerHTML = `<span>${page.icon}</span><span>${page.label}</span>`;
      nav.appendChild(a);
    });

    // Bouton de sauvegarde rapide : visible directement dans la nav, sur
    // toute page qui a un bouton "Télécharger (.json)" cache tout en bas
    // (évite d'avoir a deplier la section Sauvegarde a chaque fois).
    const downloadBtn = document.getElementById('btn-download');
    if (downloadBtn){
      const quickSave = document.createElement('button');
      quickSave.type = 'button';
      quickSave.id = 'nav-quick-save';
      quickSave.innerHTML = '<span>💾</span><span>Enregistrer</span>';
      quickSave.addEventListener('click', () => downloadBtn.click());
      nav.appendChild(quickSave);
    }

    container.replaceWith(nav);
  }

  if (document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', renderNav);
  } else {
    renderNav();
  }
})();
