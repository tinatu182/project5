let cart = {
    product: []
}
if (localStorage.getItem("cart")) {
    cart = JSON.parse(localStorage.getItem("cart"))
}

const cartItems = document.querySelector("#cart__items")
const url = "http://localhost:3000/api/products/"
let globalQuantity = 0
let globalPrice = 0

updateCart()
