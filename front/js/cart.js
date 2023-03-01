 
const cartItemsSection = document.querySelector('#cart__items');
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Récupération des produits depuis l'API
fetch('http://localhost:3000/api/products')
  .then(response => response.json())
  .then(products => {

    let displayCarts = "";

    // Itération sur les produits
    products.forEach(product => {
      // Vérifie si le produit est dans le panier
      const isInCart = !!cart.find(item => item.id === product._id);
      if(!isInCart) return null;
      const cartItem = cart.find(item => item.id === product._id);

        // Crée le contenu de l'article avec les propriétés du produit
        displayCarts +=
        `
        <article class="cart__item" data-id="${product.id}" data-color="${cartItem.color}">
          <div class="cart__item__img">
            <img src="${product.imageUrl}" alt="${product.altTxt}">
          </div>
          <div class="cart__item__content">
            <div class="cart__item__content__description">
              <h2>${product.name}</h2>
              <p>${cartItem.color}</p>
              <p>${product.price} €</p>
            </div>
            <div class="cart__item__content__settings">
              <div class="cart__item__content__settings__quantity">
                <p>Qté : </p>
                <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${cartItem.quantity}">
              </div>
              <div class="cart__item__content__settings__delete">
                <p class="deleteItem">Supprimer</p>
              </div>
            </div>
          </div>
        </article>
        `
    });
    document.querySelector(`#cart__items`).innerHTML = displayCarts


  });
