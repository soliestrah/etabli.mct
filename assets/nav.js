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
    // toute page qui a la section Sauvegarde (evite d'avoir a deplier la
    // section tout en bas a chaque fois).
    // - S'il y a une config GitHub deja enregistree (owner/repo/token dans
    //   localStorage), il declenche la VRAIE sauvegarde en ligne.
    // - Sinon, il retombe sur le telechargement local du fichier .json.
    // Dans les deux cas, le resultat s'affiche directement a cote du bouton,
    // pas seulement tout en bas de la page (ou on ne le voit pas).
    const downloadBtn = document.getElementById('btn-download');
    const ghSaveBtn = document.getElementById('btn-gh-save');
    const pageMsg = document.getElementById('save-msg');

    if (downloadBtn || ghSaveBtn){
      const wrap = document.createElement('span');
      wrap.id = 'nav-quick-save-wrap';

      const quickSave = document.createElement('button');
      quickSave.type = 'button';
      quickSave.id = 'nav-quick-save';
      quickSave.innerHTML = '<span>💾</span><span>Enregistrer</span>';

      const status = document.createElement('span');
      status.id = 'nav-save-status';

      function ghConfigured(){
        const owner = localStorage.getItem('gh_owner');
        const repo = localStorage.getItem('gh_repo');
        const token = localStorage.getItem('gh_token');
        return !!(owner && repo && token);
      }

      function showStatus(text, isError){
        status.textContent = text;
        status.classList.toggle('error', !!isError);
        status.classList.add('visible');
        clearTimeout(showStatus._t);
        showStatus._t = setTimeout(() => { status.classList.remove('visible'); }, 4000);
      }

      // Si la page a un message de sauvegarde (#save-msg), on le surveille
      // pour remonter automatiquement son contenu jusqu'ici.
      if (pageMsg){
        const observer = new MutationObserver(() => {
          const text = pageMsg.textContent.trim();
          if (text) showStatus(text, /échec|erreur/i.test(text));
        });
        observer.observe(pageMsg, { childList: true, characterData: true, subtree: true });
      }

      quickSave.addEventListener('click', () => {
        if (ghSaveBtn && ghConfigured()){
          ghSaveBtn.click();
        } else if (ghSaveBtn){
          showStatus('Configure ta sauvegarde GitHub en bas de page (une fois).', true);
        } else if (downloadBtn){
          downloadBtn.click();
        }
      });

      wrap.appendChild(quickSave);
      wrap.appendChild(status);
      nav.appendChild(wrap);
    }

    container.replaceWith(nav);
  }

  if (document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', renderNav);
  } else {
    renderNav();
  }
})();
