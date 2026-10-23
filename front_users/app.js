// Fallback si l'API est injoignable ou renvoie une erreur
const MOCK_URL = 'mock/adresses.json';

const etat = document.getElementById('etat');
const liste = document.getElementById('liste-adresses');

function afficherEtat(texte, classes) {
  etat.textContent = texte;
  etat.className = classes;
  etat.hidden = false;
}

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} sur ${url}`);
  return res.json();
}

async function recupererAdresses() {
  try {
    return { adresses: await fetchJson('/api/users/adresses'), depuisMock: false };
  } catch (err) {
    console.warn("API indisponible, utilisation du mock :", err);
    return { adresses: await fetchJson(MOCK_URL), depuisMock: true };
  }
}

async function chargerAdresses() {
  afficherEtat('Chargement…', 'text-slate-500');
  liste.innerHTML = '';
  liste.hidden = true;

  let resultat;
  try {
    resultat = await recupererAdresses();
  } catch (err) {
    console.error(err);
    afficherEtat("Erreur : impossible de charger les adresses.", 'rounded-lg bg-red-50 text-red-700 px-4 py-3');
    return;
  }

  const { adresses, depuisMock } = resultat;

  if (adresses.length === 0) {
    afficherEtat('Aucune adresse.', 'text-slate-500');
    return;
  }

  if (depuisMock) {
    afficherEtat("L'API ne répond pas : affichage de données de démonstration.", 'mb-4 rounded-lg bg-amber-50 text-amber-700 px-4 py-3');
  } else {
    etat.hidden = true;
  }

  for (const a of adresses) {
    const li = document.createElement('li');
    li.className = 'px-4 py-3';
    li.textContent = `${a.numero_rue} ${a.nom_rue}, ${a.code_postal} ${a.ville}`;
    liste.appendChild(li);
  }
  liste.hidden = false;
}

chargerAdresses();
