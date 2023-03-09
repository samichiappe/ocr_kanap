
const cartItemsSection = document.querySelector('#cart__items');
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Fetch des produits depuis l'API
fetch('http://localhost:3000/api/products')
  .then(response => response.json())
  .then(products => {

    // Groupement des produits du panier par id et couleur
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

    // Génération du HTML des produits du panier
    function generateCartItemHTML(groupedCart) {
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
      return displayCarts;
    }
    
    // Affichage des produits du panier dans le DOM
    function renderCartItems(groupedCart) {
      const displayCarts = generateCartItemHTML(groupedCart);
      cartItemsSection.innerHTML = displayCarts;
    }
    
    renderCartItems(groupedCart);

    // Mise à jour des totaux dans le DOM
    function updateTotals(groupedCart) {
      let totalQuantity = 0;
      let totalPrice = 0;
      Object.values(groupedCart).forEach(group => {
        const { product, quantity } = group;
        totalQuantity += quantity;
        totalPrice += product.price * quantity;
      });
      document.querySelector('#totalQuantity').textContent = totalQuantity;
      document.querySelector('#totalPrice').textContent = totalPrice;
    }
    
    updateTotals(groupedCart);


    // Gestion de la modification de la quantité des produits du panier
    function handleCartItemsChange(groupedCart, event) {
      const element = event.target;
      const item = element.closest('.cart__item');
      const itemId = item.dataset.id;
      const itemColor = item.dataset.color;

      if (element.classList.contains('itemQuantity')) {
        const newQuantity = parseInt(element.value);
        const key = `${itemId}-${itemColor}`;
        const currentQuantity = groupedCart[key].quantity;
        const diff = newQuantity - currentQuantity;

        // Vérifier si la quantité maximale est atteinte
        if (groupedCart[key].quantity + diff > 100) {
          alert("Vous ne pouvez pas ajouter plus de 100 articles de ce produit au panier.");
          element.value = currentQuantity;
          return;
        }

        groupedCart[key].quantity = newQuantity;
        cart.forEach((item, index) => {
          if (item.id === itemId && item.color === itemColor) {
            cart[index].quantity = newQuantity;
          }
        });
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCartItems(groupedCart);
        updateTotals(groupedCart);
      }
    }

    // Gestion de la suppression des produits du panier
    function handleCartItemsClick(groupedCart, event) {
      const element = event.target;
      const item = element.closest('.cart__item');
      const itemId = item.dataset.id;
      const itemColor = item.dataset.color;

      if (element.classList.contains('deleteItem')) {
        const key = `${itemId}-${itemColor}`;
        delete groupedCart[key];
        cart = cart.filter(item => !(item.id === itemId && item.color === itemColor));
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCartItems(groupedCart);
        updateTotals(groupedCart);
      }
    }

    // Ajout des écouteurs d'événements pour la modification de la quantité et la suppression d'un produit dans le panier
    cartItemsSection.addEventListener('change', event => {
      handleCartItemsChange(groupedCart, event);
    });

    cartItemsSection.addEventListener('click', event => {
      handleCartItemsClick(groupedCart, event);
    });

  })
  .catch(error => {
    console.error(error);
  });

console.log(cart);


/**************** FORMULAIRE ******************/

document.querySelector('.cart__order__form').addEventListener('submit', (event) => {
  event.preventDefault();

  const firstName = document.getElementById('firstName').value;
  const lastName = document.getElementById('lastName').value;
  const address = document.getElementById('address').value;
  const city = document.getElementById('city').value;
  const email = document.getElementById('email').value;

  const contact = {
    firstName: firstName,
    lastName: lastName,
    address: address,
    city: city,
    email: email
  };

  console.log('Contact :', contact);
  console.log('Produits :', cart);

});







/**************** FORMULAIRE ******************/
