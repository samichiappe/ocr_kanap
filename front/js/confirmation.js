// Récupère l'id passé dans l'url
const orderId = new URLSearchParams(window.location.search).get("orderId");

// insère le n° de commande dans le DOM
document.getElementById('orderId').textContent = orderId;

// vide le localStorage
// window.localStorage.clear();