 
const cartItemsSection = document.querySelector('#cart__items');
let cart = JSON.parse(localStorage.getItem("cart")) || [];

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
        <article class="cart__item" data-id="${product.id}" data-color="${color}">
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
  });


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

console.log(cart);