// Pendant le dev : faux fichier JSON (pas besoin que l'API soit prête)
// TODO (intégration) : remplacer par '/api/users/adresses'
const API_URL = 'mock/adresses.json';

async function chargerAdresses() {
  const res = await fetch(API_URL);
  const adresses = await res.json();

  const liste = document.getElementById('liste-adresses');
  liste.innerHTML = '';
  for (const a of adresses) {
    const li = document.createElement('li');
    li.textContent = `${a.numero_rue} ${a.nom_rue}, ${a.code_postal} ${a.ville}`;
    liste.appendChild(li);
  }
}

chargerAdresses();
