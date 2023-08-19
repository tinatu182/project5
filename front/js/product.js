const queryString = window.location.search
const urlParams = new URLSearchParams(queryString)
const productId = urlParams.get("id")
const url = "http://localhost:3000/api/products/" + productId;
console.log(productId)

let product = document.querySelector(".item")
fetch(url)
    .then(response => response.json())
    .then(function (data) {
        let colorOptions
        for (let color of data.colors) {
            colorOptions += `<option value="${color}">${color}</option>`
        }
        document.querySelector(".item__img").innerHTML = `<img src="${data.imageUrl}" alt="Photographie d'un canapé">`
        document.querySelector("#title").innerHTML = data.name
        document.querySelector("#price").innerHTML = data.price
        document.querySelector("#description").innerHTML = data.description
        document.querySelector("#colors").innerHTML += colorOptions

        document.getElementById("addToCart").addEventListener("click", () => {
            const color = document.querySelector("#colors").value
            if (color) {
                const quantity = parseInt(document.querySelector("quantity").value)
                if (quantity > 0) {
                    let cart = {
                        products: []
                    }
                    if (localStorage.getItem("cart")) {
                        cart = JSON.parse(localStorage.getItem("cart"))
                    }
                    let index = cart.products.findIndex(product => product._id === data._id && product.colo === color)
                    if (index >= 0) {
                        cart.products[index].quantity += quantity
                    } else {
                        const product = {
                            _id: data._id,
                            quantity,
                            color
                        }
                        cart.products.push(product)
                    }

                    localStorage.setItem("cart", JSON.stringify(cart))
                    alert("!");
                } else {
                    alert("quantity must greater than 1.")
                }
            } else {
                alert("Must select color.")
            }
        })
    })
// TODO M7 add click event listener add to cart button
// TODO create function to add selected product to cart
// NOTE we need product ID, color and quantity so we can add it to the cart
// [{productId: ..., color: ..., quantity: ...}, ... ]