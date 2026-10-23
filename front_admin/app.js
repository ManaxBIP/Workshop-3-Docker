const form = document.getElementById('form-adresse');
const message = document.getElementById('message');

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const adresse = Object.fromEntries(new FormData(form));

  // TODO (Personne B) : gérer les erreurs (400, 500), recharger la liste après création
  const res = await fetch('/api/admin/adresses', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(adresse),
  });

  message.textContent = res.ok ? 'Adresse créée ✅' : `Erreur ${res.status}`;
  message.className = `mt-4 ${res.ok ? 'text-green-600' : 'text-red-600'}`;
  if (res.ok) form.reset();
});
