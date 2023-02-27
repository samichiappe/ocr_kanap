// récupère le panier depuis le localStorage
const cartString = localStorage.getItem("cart");
const cart = JSON.parse(cartString);

// Vérifier que le panier n'est pas vide
if (cart && cart.length > 0) {
  // si au moins 1 produit dans le panier, affiche les produits
  console.log("===> panier: "+ cartString);
} else {
  // sinon affiche un message le panier est vide
  console.log("Le panier est vide");
}


/************** Affiche le tableau recpapitulatif du  panier ***********/


let display = ""
for (let product of cart){

display += 
    `
    <article class="cart__item" data-id="{product-ID}"${product.id}"{product-color}">
      <div class="cart__item__img">
        <img src="${product.imageUrl}" alt="${product.altTxt}">
      </div>
      <div class="cart__item__content">
        <div class="cart__item__content__description">
          <h2>${product.name}</h2>
          <p>${product.color}</p>
          <p>${product.price}</p>
        </div>
        <div class="cart__item__content__settings">
          <div class="cart__item__content__settings__quantity">
            <p>${product.quantity}</p>
            <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="42">
          </div>
          <div class="cart__item__content__settings__delete">
            <p class="deleteItem">Supprimer</p>
          </div>
        </div>
      </div>
    </article>
    `
}

// console.log(display);
document.querySelector(`#cart__items`).innerHTML = display

console.log(products);