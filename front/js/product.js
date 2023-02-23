
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const productId = urlParams.get('id');
console.log("===> productId: " + productId);


fetch(`http://localhost:3000/api/products/${productId}`)
.then((response) => response.json())
.then((data) => {
    console.log("===> data: " , data);

// A revoir
for (const key of Object.keys(data)) {
    display =`<img src="${data.imageUrl}" alt="${data.altTxt}">`;
  }


    console.log(display);
    document.querySelector(`.item__img`).innerHTML = display

})


