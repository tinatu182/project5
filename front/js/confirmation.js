const queryString = window.location.search
const urlParams = new URLSearchParams(queryString)
const orderId = urlParams.get("orderId")
const orderIdElement = document.querySelector("#orderId");
orderIdElement.innerText = orderId

