// requete API avec fetch
fetch(`http://localhost:3000/api/products`)
  .then((response) => response.json())
  .then(data => {

    let display = ""
    for(let product of data){

// boucle d'incrementation pour utiliser le template pour chaque produit
      display += `
           <a href="./product.html?id=${product._id}">
            <article>
              <img src="${product.imageUrl}" alt="${product.altTxt}">
              <h3 class="productName">${product.name}</h3>
              <p class="productDescription">${product.description}</p>
            </article>
          </a>
          `
    }
    document.querySelector(`#items`).innerHTML = display
  })

// message d'erreur en cas d'echec
  .catch(error => {
    console.log(error);
  })

