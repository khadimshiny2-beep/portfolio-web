/* =============================================
   PORTFOLIO — script.js
   Ahmadoul Khadim Guèye

   Fonction 1 : Message de bienvenue
   Fonction 2 : Afficher / Masquer (compétences + projets)
   Fonction 3 : Validation du formulaire contact
   ============================================= */

/* ─────────────────────────────────────────────
   FONCTION 1 — Message de bienvenue
   Affiche une bannière lors du 1er chargement
   ───────────────────────────────────────────── */
function afficherBienvenue() {
  const banner = document.getElementById('welcome-banner');
  if (!banner) return;

  // N'afficher qu'une seule fois par session
  if (!sessionStorage.getItem('bienvenue_vu')) {
    banner.style.display = 'block';
    sessionStorage.setItem('bienvenue_vu', 'true');
  }
}

function fermerBienvenue() {
  const banner = document.getElementById('welcome-banner');
  if (banner) banner.style.display = 'none';
}

/* ─────────────────────────────────────────────
   FONCTION 2A — Afficher / Masquer détails
   des compétences (competences.html)
   ───────────────────────────────────────────── */
function toggleCompetences() {
  const details = document.querySelectorAll('.skill-details');
  const btn = document.getElementById('btn-toggle-competences');
  if (!details.length || !btn) return;

  const ouvert = btn.dataset.ouvert === 'true';

  details.forEach(el => el.classList.toggle('visible', !ouvert));
  btn.textContent = ouvert ? 'Afficher les détails' : 'Masquer les détails';
  btn.dataset.ouvert = (!ouvert).toString();
}

/* ─────────────────────────────────────────────
   Animer les barres de compétences au chargement
   ───────────────────────────────────────────── */
function animerBarres() {
  const fills = document.querySelectorAll('.skill-fill');
  fills.forEach(fill => {
    const pct = fill.dataset.pct || '0';
    // Légère attente pour que l'animation soit visible
    setTimeout(() => {
      fill.style.width = pct + '%';
    }, 200);
  });
}

/* ─────────────────────────────────────────────
   FONCTION 2B — Bouton "Voir plus" pour les
   projets (projets.html)
   ───────────────────────────────────────────── */
function toggleProjet(id) {
  const extra = document.getElementById('extra-' + id);
  const btn   = document.getElementById('btn-' + id);
  if (!extra || !btn) return;

  const ouvert = extra.classList.contains('visible');
  extra.classList.toggle('visible', !ouvert);
  btn.textContent = ouvert ? 'Voir plus' : 'Réduire';
}

/* ─────────────────────────────────────────────
   FONCTION 3 — Validation du formulaire contact
   ───────────────────────────────────────────── */
function validerFormulaire(e) {
  e.preventDefault();

  // Réinitialiser les erreurs précédentes
  document.querySelectorAll('.field-error').forEach(el => el.classList.remove('visible'));
  const feedback = document.getElementById('form-feedback');
  if (feedback) feedback.className = 'form-feedback';

  const nom     = document.getElementById('nom');
  const prenom  = document.getElementById('prenom');
  const email   = document.getElementById('email');
  const sujet   = document.getElementById('sujet');
  const message = document.getElementById('message');

  let valide = true;

  // ── Vérifier chaque champ obligatoire ──
  function requis(champ, idErreur, msg) {
    if (!champ || !champ.value.trim()) {
      afficherErreur(idErreur, msg);
      valide = false;
    }
  }

  requis(nom,     'err-nom',     'Le nom est obligatoire.');
  requis(prenom,  'err-prenom',  'Le prénom est obligatoire.');
  requis(sujet,   'err-sujet',   'Le sujet est obligatoire.');
  requis(message, 'err-message', 'Le message est obligatoire.');

  // ── Vérifier le format de l'email ──
  if (!email || !email.value.trim()) {
    afficherErreur('err-email', "L'adresse e-mail est obligatoire.");
    valide = false;
  } else if (!emailValide(email.value.trim())) {
    afficherErreur('err-email', "L'adresse e-mail n'est pas valide.");
    valide = false;
  }

  // ── Résultat ──
  if (valide) {
    if (feedback) {
      feedback.textContent = '✓ Message envoyé avec succès ! Je vous répondrai bientôt.';
      feedback.className = 'form-feedback success';
    }
    // Vider le formulaire après succès
    e.target.reset();
  } else {
    if (feedback) {
      feedback.textContent = 'Veuillez corriger les erreurs ci-dessus.';
      feedback.className = 'form-feedback error';
    }
  }
}

function afficherErreur(idErreur, message) {
  const el = document.getElementById(idErreur);
  if (el) {
    el.textContent = message;
    el.classList.add('visible');
  }
}

function emailValide(adresse) {
  // Regex simple mais efficace pour valider un e-mail
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(adresse);
}

/* ─────────────────────────────────────────────
   INITIALISATION — au chargement de la page
   ───────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', function () {

  // 1. Message de bienvenue (toutes les pages)
  afficherBienvenue();

  // 2. Bouton fermer la bannière
  const closeBannerBtn = document.getElementById('close-banner');
  if (closeBannerBtn) {
    closeBannerBtn.addEventListener('click', fermerBienvenue);
  }

  // 3. Bouton toggle compétences
  const btnComp = document.getElementById('btn-toggle-competences');
  if (btnComp) {
    btnComp.addEventListener('click', toggleCompetences);
    animerBarres();
  }

  // 4. Boutons "Voir plus" des projets (générés dans projets.html)
  //    Les boutons appellent toggleProjet(id) via onclick dans le HTML,
  //    mais on peut aussi les cibler ici si nécessaire.

  // 5. Formulaire contact
  const form = document.getElementById('form-contact');
  if (form) {
    form.addEventListener('submit', validerFormulaire);
  }

  // 6. Lien actif dans la navigation
  const liens = document.querySelectorAll('nav a');
  liens.forEach(lien => {
    if (lien.href === window.location.href) {
      lien.classList.add('active');
    }
  });
});