/*global loadingVision printCartProducts toThousands shoppingCartShowNum productData UseraccessToken postOrderCheck*/

loadingVision();
printCartProducts(productData);

function changeCartShoppingTitle() {
  const shoppingTitle = document.querySelector('.shoppingTitle');
  shoppingTitle.textContent = `購物車(${productData.length})`;
}

function addProductPriceTotal () {
  const productTotal = document.querySelector('.productTotal');
  const cartShoppingPriceTotal = document.querySelectorAll('.cart-shoppingPriceTotal');
  const addTotal = document.querySelector('.addTotal')
  let addProductTotal = 0;
  cartShoppingPriceTotal.forEach(item => {
    addProductTotal += +((item.textContent).replace(/[^0-9]/ig,""));
  })
  productTotal.textContent = toThousands(addProductTotal);
  addTotal.textContent = toThousands(addProductTotal + 30);
}

function changeCartProductStatus() {
  const cartShoppingNum = document.querySelectorAll('.cart-shoppingNum');
  const cartShoppingOnePrice = document.querySelectorAll('.cart-shoppingOnePrice');
  const cartShoppingPriceTotal = document.querySelectorAll('.cart-shoppingPriceTotal');

  cartShoppingNum.forEach((item, index) => {
    item.addEventListener('change', function() {
      let currentQty = item.value;
      let onePrice = (cartShoppingOnePrice[index].textContent).replace(/[^0-9]/ig,"");
      cartShoppingPriceTotal[index].textContent = `NT.${onePrice * currentQty}`;
      changeLocalStorageQty(index, currentQty);
      addProductPriceTotal();
    });
  });
  DelCartProduct();
  shoppingCartShowNum();
}

function DelCartProduct() {
  const cartShoppingDel = document.querySelectorAll('.cart-shoppingDel');
  // const cartShoppingItem = document.querySelectorAll('.cart-shoppingItem');
  cartShoppingDel.forEach((item, index) => {
    item.addEventListener('click', function() {
      // cartShoppingItem[index].classList.add('disabled');
      changeLocalStorageQty(index);
    });
  });
}

function changeLocalStorageQty(index, currentQty = null) {
  if (currentQty !== null) {
    productData[index].qty = currentQty;
  } else {
    productData.splice(index, 1);
    printCartProducts(productData);
  }
  localStorage.setItem('productListData', JSON.stringify(productData));
}

function getOrderCheckOutInfo() {
  let userInfo = [ ...arguments ];
  let [prime ,name, phone, email, address, time] = userInfo;

  let recipient = getRecipientInfomation(name, phone, email, address, time);
  let order = getUserOrderinfos(recipient);
  let accessToken = UseraccessToken.accessToken || null;

  let checkOutOrder = {
    prime,
    order,
  }
  console.log(checkOutOrder);
  getOrderNumber('order/checkout', checkOutOrder, accessToken);
}

function getOrderNumber(api, checkOutOrderData, accessToken) {
  return postOrderCheck(api, checkOutOrderData, accessToken).then(result => {
    const orderNumber =  (JSON.parse(result)).data.number;
    window.location.href = `thankyou.html?orderNumber=${orderNumber}`
  })
}

function getRecipientInfomation() {
  let userInfo = [ ...arguments ];
  let [ name, phone, email, address, time] = userInfo;

  switch(time) {
    case 0:
      time = 'morning';
      break;
    case 1:
      time = 'afternoon';
      break;
    case 2:
      time = 'anytime';
      break;
  }

  let recipient = {
    name,
    phone,
    email,
    address,
    time
  }
  return recipient;
}

function getUserOrderinfos(recipient) {
  const subtotal = +((document.querySelector('.productTotal').textContent).replace(/[,]+/g, ""));
  const freight = +(document.querySelectorAll('.priceShow')[1].textContent);
  const total = +((document.querySelector('.addTotal').textContent).replace(/[,]+/g, ""));

  let order = {
    shipping: "delivery",
    payment: "credit_card",
    subtotal,
    freight,
    total,
    recipient,
    list: getStorage(productData),
  }
  return order;
}

function getStorage(productData) {
  let list = [];
  productData.forEach(item => {
    const {id, name, price, color, size ,qty} = item;
    let productItem = {
      id,
      name,
      price,
      color,
      size,
      qty
    }
    list.push(productItem);
  })
  return list
}

function waitingThankyouPage() {
  const waitingGoThankyouPage = document.querySelector('.waitingGoThankyouPage');
  waitingGoThankyouPage.classList.remove('h-none');
}