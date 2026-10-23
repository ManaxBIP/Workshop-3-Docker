const form = document.getElementById('form-adresse');
const message = document.getElementById('message');
const etat = document.getElementById('etat');
const liste = document.getElementById('liste-adresses');

function afficherMessage(texte, ok) {
  message.textContent = texte;
  message.className = `mt-4 ${ok ? 'text-green-600' : 'text-red-600'}`;
}

function afficherEtat(texte, classes) {
  etat.textContent = texte;
  etat.className = classes;
  etat.hidden = false;
}

async function lireErreur(res) {
  try {
    const body = await res.json();
    if (body.error) return body.error;
  } catch {
  }
  return `Erreur ${res.status}`;
}

async function chargerAdresses() {
  afficherEtat('Chargement…', 'text-slate-500');
  liste.innerHTML = '';
  liste.hidden = true;

  let adresses;
  try {
    const res = await fetch('/api/admin/adresses');
    if (!res.ok) throw new Error(await lireErreur(res));
    adresses = await res.json();
  } catch (err) {
    console.error(err);
    afficherEtat(`Impossible de charger les adresses : ${err.message}`, 'rounded-lg bg-red-50 text-red-700 px-4 py-3');
    return;
  }

  if (adresses.length === 0) {
    afficherEtat('Aucune adresse.', 'text-slate-500');
    return;
  }

  etat.hidden = true;
  for (const a of adresses) {
    const li = document.createElement('li');
    li.className = 'px-4 py-3';
    li.textContent = `${a.numero_rue} ${a.nom_rue}, ${a.code_postal} ${a.ville}`;
    liste.appendChild(li);
  }
  liste.hidden = false;
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const adresse = Object.fromEntries(new FormData(form));

  let res;
  try {
    res = await fetch('/api/admin/adresses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(adresse),
    });
  } catch (err) {
    console.error(err);
    afficherMessage("Impossible de joindre l'API.", false);
    return;
  }

  if (!res.ok) {
    afficherMessage(res.status === 400 ? await lireErreur(res) : `Erreur ${res.status}`, false);
    return;
  }

  afficherMessage('Adresse créée ✅', true);
  form.reset();
  chargerAdresses();
});

chargerAdresses();
