 
const cartItemsSection = document.querySelector('#cart__items');
let cart = JSON.parse(localStorage.getItem("cart")) || [];
const products = JSON.parse(localStorage.getItem("products")) || [];

// Crée une fonction pour mettre à jour les totaux
function updateTotals() {
  let totalPrice = 0;
  let totalQuantity = 0;
  const products = JSON.parse(localStorage.getItem("products")) || [];

  // Boucler sur les produits dans le panier
  cart.forEach(item => {
    // Trouver le produit correspondant dans la liste des produits
    const product = products.find(p => p._id === item.id);
    if (product) {
      // Ajouter la quantité du produit au total de la quantité
      totalQuantity += item.quantity;
      // Ajouter le prix du produit multiplié par la quantité au prix total, si le produit est trouvé
      totalPrice += parseFloat(product.price) * item.quantity;
    }
  });

  // Mettre à jour les totaux dans le DOM
  document.querySelector("#totalQuantity").textContent = totalQuantity;
  document.querySelector("#totalPrice").textContent = totalPrice;
}


// Récupération des produits depuis l'API
fetch('http://localhost:3000/api/products')
  .then(response => response.json())
  .then(products => {

    // incremente les produits du panier du même id et couleur
    const groupedCart = {};
    cart.forEach(item => {
      const key = `${item.id}-${item.color}`;
      if (!groupedCart[key]) {
        groupedCart[key] = {
          product: products.find(p => p._id === item.id),
          color: item.color,
          quantity: 0,
        };
      }
      groupedCart[key].quantity += item.quantity;
    });


    // affiche une ligne par produit dans le dom
    let displayCarts = "";
    Object.values(groupedCart).forEach(group => {
      const { product, color, quantity } = group;
      displayCarts += 
      `
        <article class="cart__item" data-id="${product._id}" data-color="${color}">
          <div class="cart__item__img">
            <img src="${product.imageUrl}" alt="${product.altTxt}">
          </div>
          <div class="cart__item__content">
            <div class="cart__item__content__description">
              <h2>${product.name}</h2>
              <p>${color}</p>
              <p>${product.price} €</p>
            </div>
            <div class="cart__item__content__settings">
              <div class="cart__item__content__settings__quantity">
                <p>Qté : </p>
                <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${quantity}">
              </div>
              <div class="cart__item__content__settings__delete">
                <p class="deleteItem">Supprimer</p>
              </div>
            </div>
          </div>
        </article>
      `
    
    });
    document.querySelector(`#cart__items`).innerHTML = displayCarts;
  })


// Ajout des écouteurs d'événements pour la modification de la quantité et la suppression d'un produit dans le panier

cartItemsSection.addEventListener('change', event => {
  const element = event.target;
  const item = element.closest('.cart__item');
  const itemId = item.dataset.id;
  const itemColor = item.dataset.color;
  
  if (element.classList.contains('itemQuantity')) {
    const newQuantity = parseInt(element.value, 10); // convertir en nombre entier
    cart.forEach(item => {
      if (item.id === itemId && item.color === itemColor) {
        item.quantity = newQuantity;
      }
    });

    // Mettre à jour le localstorage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Mettre à jour le prix total pour cet article
    const product = products.find(p => p._id === itemId);
    const priceElement = item.querySelector('.cart__item__content__description p:last-child');
    priceElement.textContent = `${product.price * newQuantity} €`;

    // Mettre à jour les totaux
    updateTotals();
  }
});

cartItemsSection.addEventListener('click', event => {
const element = event.target;
const item = element.closest('.cart__item');
const itemId = item.dataset.id;
const itemColor = item.dataset.color;

if (element.classList.contains('deleteItem')) {
// Supprimer l'article du tableau de panier
cart = cart.filter(item => !(item.id === itemId && item.color === itemColor));
// Mettre à jour le localstorage
localStorage.setItem('cart', JSON.stringify(cart));
// Supprimer l'article du DOM
item.remove();

// Mettre à jour les totaux
updateTotals();
}
});

// Crée une fonction pour mettre à jour les totaux
function updateTotals() {
  let totalPrice = 0;
  let totalQuantity = 0;
  const products = JSON.parse(localStorage.getItem("products")) || [];

  // Boucler sur les produits dans le panier
  cart.forEach(item => {
    // Trouver le produit correspondant dans la liste des produits
    const product = products.find(p => p._id === item.id);
    if (product) {
      // Ajouter la quantité du produit au total de la quantité
      totalQuantity += parseInt(item.quantity, 10);
      // Ajouter le prix du produit multiplié par la quantité convertie au prix total, si le produit est trouvé
      totalPrice += parseFloat(product.price) * parseInt(item.quantity, 10);
    }
  });

  // Mettre à jour les totaux dans le DOM
  document.querySelector("#totalQuantity").textContent = totalQuantity;
  document.querySelector("#totalPrice").textContent = totalPrice;
}


console.log(cart)

/***************** Affiche les totaux à la fin du panier *****************/

  let totalPrice = 0;
  let totalQuantity = 0;
  
  // Crée un tableau de promesses pour toutes les requêtes fetch
  const promises = cart.map(async item => {
    // Récupérer le produit correspondant depuis l'API
    const response = await fetch(`http://localhost:3000/api/products/${item.id}`);
    const product = await response.json();
    // Ajouter la quantité du produit au total de la quantité
    totalQuantity += item.quantity;
    // Ajouter le prix du produit multiplié par la quantité au prix total
    totalPrice += parseFloat(product.price) * item.quantity;
  })
  
  // Afficher le résultat total
  Promise.all(promises).then(() => {
    document.querySelector("#totalQuantity").textContent = totalQuantity;
    document.querySelector("#totalPrice").textContent = totalPrice;
  });
  
    /*****************Fin Affiche les totaux à la fin du panier *****************/

