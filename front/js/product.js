
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const productId = urlParams.get("id");
console.log("===> productId: " + productId);


fetch(`http://localhost:3000/api/products/${productId}`)
  .then((response) => response.json())
  .then((data) => {
    console.log("===> data: " , data);

    for (const key of Object.keys(data)) {
      displayImg =`<img src="${data.imageUrl}" alt="${data.altTxt}">`;
    }
    for (const key of Object.keys(data)) {
      displayName = data.name;
    }
    for (const key of Object.keys(data)) {
      displayPrice = data.price;
    }
    for (const key of Object.keys(data)) {
      displayDescription = data.description;
    }

    const select = document.getElementById("colors");
    const colors = data.colors;
    const optionsColors = colors.map(color => `<option value="${color}">${color}</option>`).join('');
    

    document.querySelector(`.item__img`).innerHTML = displayImg
    document.querySelector(`#title`).innerHTML = displayName
    document.querySelector(`#description`).innerHTML = displayDescription
    document.querySelector(`#price`).innerHTML = displayPrice
    select.innerHTML = select.innerHTML + optionsColors;
    
    // Affiche le nom du produit sur la page
    document.title = data.name

  })
  // message d'erreur en cas d'echec
  .catch(error => {
    console.log(error);
  })






  // localStorage.clear();







 /********* ajout au panier ***************/

const addToCartButton = document.querySelector("#addToCart");
addToCartButton.addEventListener("click", addToCart);


function addToCart() {
  const select = document.getElementById("colors");
  const color = select.value;
  const quantity = parseInt(document.getElementById("quantity").value);

  if (color === "" || quantity <= 0) {
    alert("Veuillez choisir une couleur et une quantité valide.");
    return;
  }

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const product = {
    id: productId,
    color: color,
    quantity: quantity,
  };

  cart.push(product);
  localStorage.setItem("cart", JSON.stringify(cart));

  alert("Le produit a été ajouté au panier.");

}

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


/************** fin ajout au panier *********************/




