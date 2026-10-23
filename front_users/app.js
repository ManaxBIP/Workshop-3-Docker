// Fallback si l'API est injoignable ou renvoie une erreur
const MOCK_URL = 'mock/adresses.json';

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} sur ${url}`);
  return res.json();
}

async function recupererAdresses() {
  try {
    return await fetchJson('/api/users/adresses');
  } catch (err) {
    console.warn("API indisponible, utilisation du mock :", err);
    return fetchJson(MOCK_URL);
  }
}

async function chargerAdresses() {
  const adresses = await recupererAdresses();

  const liste = document.getElementById('liste-adresses');
  liste.innerHTML = '';
  for (const a of adresses) {
    const li = document.createElement('li');
    li.className = 'px-4 py-3';
    li.textContent = `${a.numero_rue} ${a.nom_rue}, ${a.code_postal} ${a.ville}`;
    liste.appendChild(li);
  }
}

chargerAdresses();
