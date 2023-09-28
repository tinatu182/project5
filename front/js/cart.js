let cart = [];

if (localStorage.getItem("cart")) {
    cart = JSON.parse(localStorage.getItem("cart"))
}

const cartItemSection = document.querySelector("#cart__items")
const totalQuantityElement = document.querySelector("#totalQuantity");
const totalPriceElement = document.querySelector("#totalPrice");
let globalQuantity;
let globalPrice;
let productCache = [];

function updateCart() {
    let cart = getCart();
    cartItemSection.innerHTML = ''
    totalQuantityElement.innerText = ''
    totalPriceElement.innerText = ''
    const promises = cart.map((tinyProduct) => {
        return fetch(`http://localhost:3000/api/products/${tinyProduct.id}`)
            .then(response => response.json())
            .then((product) => {
                cacheProduct(product);
                globalQuantity = parseInt(totalQuantityElement.innerText || 0) + tinyProduct.quantity
                globalPrice = parseInt(totalPriceElement.innerText || 0) + product.price * tinyProduct.quantity
                totalQuantityElement.innerText = globalQuantity
                totalPriceElement.innerText = globalPrice
                cartItemSection.innerHTML += `
                <article class="cart__item" data-id="${product._id}" data-color="${tinyProduct.color}">
                    <div class="cart__item__img">
                        <img src="${product.imageUrl}" alt="Photographie d'un canapé">
                    </div>
                    <div class="cart__item__content">
                        <div class="cart__item__content__description">
                            <h2>${product.name}</h2>
                            <p>${tinyProduct.color}</p>
                            <p>${product.price} €</p>
                        </div>
                        <div class="cart__item__content__settings">
                            <div class="cart__item__content__settings__quantity">
                                <p>Qté : </p>
                                <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${tinyProduct.quantity}">
                            </div>
                            <div class="cart__item__content__settings__delete">
                                <p class="deleteItem">Supprimer</p>
                            </div>
                        </div>
                    </div>
                </article>
            `
            })
    })

    Promise.all(promises).then(() => {
        callAllEventListener()
    })

}
updateCart()

function getCart() {
    let cart = [];
    if (localStorage.getItem("cart")) {
        cart = JSON.parse(localStorage.getItem("cart"));
    }
    return cart;
}

function cacheProduct(product) {


}





function callAllEventListener() {
    document.querySelectorAll(".itemQuantity").forEach((item) => {
        item.addEventListener("change", (event) => {
            const productId = event.target.closest('.cart__item').getAttribute("data-id")
            const color = event.target.closest('.cart__item').getAttribute("data-color")
            const quantity = parseInt(event.target.value)
            const indexToUpdate = cart.findIndex((cartItem) => cartItem.id === productId && cartItem.color === color)

            if (quantity > 0) {
                cart[indexToUpdate].quantity = quantity
                localStorage.setItem('cart', JSON.stringify(cart))
                // updateCartTotals(quantity,productId)
                updateCart()
            } else {
                event.target.value = cart[indexToUpdate].quantity
                alert("Quantity cannot be less than 1")
            }
        })
    })

    document.querySelectorAll(".deleteItem").forEach((item) => {
        item.addEventListener("click", (event) => {
            const productId = event.target.closest('.cart__item').getAttribute("data-id")
            const color = event.target.closest('.cart__item').getAttribute("data-color")
            const updatedProductList = cart.filter((cartItem) => cartItem.id !== productId || cartItem.color !== color)
            const indexToDelete = cart.findIndex((cartItem) => cartItem.id === productId && cartItem.color === color)
            const quantity = cart[indexToDelete].quantity
            localStorage.setItem('cart', JSON.stringify(updatedProductList));
            // FIXME remove deleteitem from page 
            // updateCartTotals(quantity,productId)
            updateCart()
        })
    })
}

document.getElementById("firstName").addEventListener("change", (event) => {
    ({ firstName, totalErrors } = validateFirstname(0));
})
document.getElementById("lastName").addEventListener("change", (event) => {
    ({ lastName, totalErrors } = validateLastname(0));
})
document.getElementById("address").addEventListener("change", (event) => {
    ({ address, totalErrors } = validateAddress(0));
})
document.getElementById("city").addEventListener("change", (event) => {
    ({ city, totalErrors } = validateCity(0));
})

document.getElementById("email").addEventListener("change", (event) => {
    ({ email, totalErrors } = validateEmail(0));
})

document.getElementsByClassName("cart__order__form")[0].addEventListener("submit", (event) => {
    event.preventDefault()
    let totalErrors = 0

    let firstName;
    ({ firstName, totalErrors } = validateFirstname(totalErrors));

    let lastName;
    ({ lastName, totalErrors } = validateLastname(totalErrors));

    let address;
    ({ address, totalErrors } = validateAddress(totalErrors));

    let city;
    ({ city, totalErrors } = validateCity(totalErrors));

    let email;
    ({ email, totalErrors } = validateEmail(totalErrors));

    if (totalErrors === 0) {
        const contact = {
            firstName,
            lastName,
            address,
            city,
            email
        }
        const cart = getCart()
        const products = cart.map((cartItem) => cartItem.id)
        const orderInfo = { contact, products }
        fetch(`http://localhost:3000/api/products/order`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderInfo)
        })
            .then(response => response.json())
            .then((data) => {
                console.log(data)
                localStorage.removeItem('cart')

                window.location.href = `./confirmation.html?orderId=${data.orderId}`
            })
            .catch((error) => {
                alert("The transaction did not work, please try again later.")
                console.log('error', error)
            })
        console.log(orderInfo)
    }
})

function validateFirstname(totalErrors) {
    const firstNameError = document.getElementById("firstNameErrorMsg")
    const firstName = document.getElementById("firstName").value;
    firstNameError.innerHTML = ""

    if (firstName) {
        if (!firstName.match(/^[a-zA-Z -']+$/gm)) {
            totalErrors++;
            firstNameError.innerHTML = "The format is incorrect. Only letters are allowed.";
        }

    } else {
        totalErrors++;
        firstNameError.innerHTML = "This field is required.";
    }
    return { firstName, totalErrors };
}

function validateLastname(totalErrors) {
    const lastNameError = document.getElementById("lastNameErrorMsg")
    const lastName = document.getElementById("lastName").value;
    lastNameError.innerHTML = ""

    if (lastName) {
        if (!lastName.match(/^[a-zA-Z -']+$/gm)) {
            totalErrors++;
            lastNameError.innerHTML = "The format is incorrect. Only letters are allowed.";
        }
    } else {
        totalErrors++;
        lastNameError.innerHTML = "This field is required.";
    }
    return { lastName, totalErrors };
}

function validateAddress(totalErrors) {
    const addressError = document.getElementById("addressErrorMsg")
    const address = document.getElementById("address").value;
    addressError.innerHTML = ""

    if (address) {
        if (!address.match(/^[a-zA-Z0-9, -'.]+$/gm)) {
            totalErrors++;
            addressError.innerHTML = "The address format is incorrect.";
        }
    } else {
        totalErrors++;
        addressError.innerHTML = "This field is required.";
    }
    return { address, totalErrors };
}

function validateCity(totalErrors) {
    const cityError = document.getElementById("cityErrorMsg")
    const city = document.getElementById("city").value;
    cityError.innerHTML = ""

    if (city) {
        if (!city.match(/^[a-zA-Z -']+$/gm)) {
            totalErrors++;
            cityError.innerHTML = "The format is incorrect. Only letters are allowed.";
        }
    } else {
        totalErrors++;
        cityError.innerHTML = "This field is required.";
    }
    return { city, totalErrors };
}

function validateEmail(totalErrors) {
    const emailError = document.getElementById("emailErrorMsg")
    const email = document.getElementById("email").value;
    emailError.innerHTML = ""
    if (email) {
        if (!email.match(/^[a-zA-Z0-9.+-_]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,10}$/gm)) {
            totalErrors++;
            emailError.innerHTML = "The email address format is incorrect.";
        }
    } else {
        totalErrors++;
        emailError.innerHTML = "This field is required.";
    }
    return { email, totalErrors };
}

// function sendCartAndForm(form) {
//     // TODO dynamicly product array from userr card infor, use jvscript array map method to do ID array
//     const idProducts = cart.products.map((product) => product._id)
//     // TODO use fetch API to send post request with contat and product infor
//     const orderInfo = {
//         contact: form,
//         products: idProducts
//     }

//     fetch(url + "orderId", {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(orderInfo)
//     })
//         .then(response => response.json())
//         .then((data) => {
//             localStorage.removeItem('cart')

//             window.location.href = "http://localhost:5500/front/html/confirmation.html?orderId=" + data.orderId
//         })
//         .catch((error) => {
//             alert("The transaction did not work, please try again later.")
//             console.log('error', error)
//         })
//     console.log(orderInfo)
// }
