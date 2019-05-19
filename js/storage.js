let productData = JSON.parse(localStorage.getItem('productListData')) || [];
const shoppingCartIconNum = document.querySelectorAll('.shoppingCart-productNum');
let UseraccessToken = JSON.parse(localStorage.getItem('accessTokenData')) || [];
function shoppingCartShowNum() {
  shoppingCartIconNum.forEach(item => {
    item.textContent = productData.length;
  })
}
shoppingCartShowNum();

function clearShoppingCar() {
  productData = [];
  localStorage.setItem('productListData', JSON.stringify(productData));
}