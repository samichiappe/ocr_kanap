
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

  /*** REXEG ***/

  // regex prenom et nom
  const regexNames = /^[a-zA-ZÀ-ÿ\-]+$/
  // regex adresse
  const regexAdress = /^\d+\s[\w\sÀ-ÿ'’"‘’“”-]+\s[\w\sÀ-ÿ'’"‘’“”-]+$/
  // regex ville
  const regexCity = /^[a-zA-ZÀ-ÿ\s-]+$/
  // regex email
  const regexEmail = /^(([^<>()[]\.,;:s@]+(.[^<>()[]\.,;:s@]+)*)|(.+))@(([[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}])|(([a-zA-Z-0-9]+.)+[a-zA-Z]{2,}))$/;

  // test regex prenom
  if (regexNames.test(firstName)) {
    console.log("Prénom valide");
  } else {
    document.getElementById("firstNameErrorMsg").textContent = "Veuillez entrer un prénom valide";
    return;
  }

  // test regex nom
  if (regexNames.test(lastName)) {
    console.log("Nom valide");
  } else {
    document.getElementById("lastNameErrorMsg").textContent = "Veuillez entrer un Nom valide";
    return;
  }

  // test regex adresse
  if (regexAdress.test(address)) {
    console.log("Adresse valide");
  } else {
    document.getElementById("addressErrorMsg").textContent = "Veuillez entrer une adresse valide";
    return;
  }
  
  // test regex ville
  if (regexCity.test(city)) {
    console.log("Nom de ville valide");
  } else {
    document.getElementById("cityErrorMsg").textContent = "Veuillez entrer un nom de ville valide";
    return;
  }

  // test regex email
  if (regexEmail.test(email)) {
    console.log('Email valide');
  } else {
    document.getElementById('emailErrorMsg').textContent = "Veuillez entrer une adresse email valide";
    return;
  }

  // affiche l'objet contact si toute les conditions sont remplies
  const contact = {
    firstName: firstName,
    lastName: lastName,
    address: address,
    city: city,
    email: email
  };

  // Récupération des id des produits du panier
  const productId = cart.map(item => item.id);

  // création de l'objet global à envoyer dans la requête POST si le panier n'est pas vide
  if (cart.length > 0) {
    const objData = {
      contact: contact,
      products: productId
    };

  // envoi de la requête POST à l'API
  fetch('http://localhost:3000/api/products/order', {
    method: 'POST',
    headers: {
    'Content-Type': 'application/json'
    },
    body: JSON.stringify(objData)
    })
    .then(response => response.json())
    .then(data => {
    const orderId = data.orderId;
    window.location.href = `confirmation.html?orderId=${orderId}`
    })
    .catch(error => {
    console.error('Erreur :', error);
    });
  } else {
    alert ("Le panier est vide.");
  }

  console.log('Contact :', contact);
  console.log('Produits :', cart);
});

const firstNameInput = document.getElementById('firstName');
const lastNameInput = document.getElementById('lastName');
const addressInput = document.getElementById('address');
const cityInput = document.getElementById('city');
const emailInput = document.getElementById('email');

firstNameInput.addEventListener('input', () => {
  document.getElementById('firstNameErrorMsg').textContent = '';
});

lastNameInput.addEventListener('input', () => {
  document.getElementById('lastNameErrorMsg').textContent = '';
});

addressInput.addEventListener('input', () => {
  document.getElementById('addressErrorMsg').textContent = '';
});

cityInput.addEventListener('input', () => {
  document.getElementById('cityErrorMsg').textContent = '';
});

emailInput.addEventListener('input', () => {
  document.getElementById('emailErrorMsg').textContent = '';
});
