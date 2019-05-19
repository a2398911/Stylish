const productDetailsPhoto = document.querySelector('.product-introduction-photo');
const productDetailsColorsWrap = document.querySelector('.product-introduction-colors'); 
const productDetailsSizes = document.querySelector('.product-introduction-size');
const carShoppingBtn = document.querySelector('.carshopping-btn');
const productNumInput = document.querySelector('.product-num-input');
const productReduceBtn = document.querySelector('.product-reduceBtn');
const productAddBtn = document.querySelector('.product-addBtn');
const productCurrentNum = document.querySelector('.currentNum');
let productUpLimit = false;
let currentProductVariants;
let currentStock;
let currentId;
let currentTitle;
let currentColorCode;
let currentColorName;
let currentPrice;
let currentSize;
let currentQty;
let currentImage;

/*global getDataProductsDetails productData shoppingCartShowNum*/

const getProductDetails = function(){
  let urlParams = new URLSearchParams(window.location.search);
  const productDetailsId = urlParams.get('id');
  currentId = productDetailsId;
  getDataProductsDetails(`products/details?id=${productDetailsId}`)
}();

function getProductStockData(variants, title, price, colors, main_image) {
  currentProductVariants = variants;
  currentImage = main_image;
  currentColorCode = currentProductVariants[0].color_code;
  colors.forEach(item => {
    if (item.code === currentProductVariants[0].color_code) currentColorName = item.name;
  })
  currentTitle = title;
  currentPrice = price;
}


const changeSize  = (e) => {
  if (e.target.className !== 'product-size') return;
  const productSize = document.querySelectorAll('.product-size');
  productSize.forEach(item => item.classList.remove('active'));
  e.target.classList.add('active');
  currentSize = e.target.textContent;
  getProductStock();
  initProductNum();
  changeCarShopping();
}

const changeColors = (e) => {
  if (e.target.className !== 'product-introduction-colorRectangle') return;
  const productIntroductionColorRectangle = document.querySelectorAll('.product-introduction-colorRectangle');
  productIntroductionColorRectangle.forEach(item => item.classList.remove('active'));
  e.target.classList.add('active');
  currentColorName = e.target.dataset.color;
  let clickProductColor = e.target.style.backgroundColor;
  rgbToHex(clickProductColor.toString().match(/\d+/g));
  getProductStock();
  initProductNum();
  changeProductNumStatus();
  changeCarShopping();
}
function rgbToHex(rgb) {
  var hex = '';
  for (var i = 0; i < 3; i++) {
    hex += ("0" + Number(rgb[i]).toString(16)).slice(-2);
  }
  currentColorCode = hex.toUpperCase();
}

// getProductStock
function getProductStock() {
  currentProductVariants.forEach(item => {
    if (item['color_code'] === currentColorCode && item['size'] === currentSize){
      currentStock = item['stock']
      changeCarShopping();
      changeProductNumStatus();
    }
  })
}

// changeCarShoppingBtn
function changeCarShopping() {
  if (currentStock === undefined) {
    carShoppingBtn.classList.add('disabled');
    carShoppingBtn.textContent = '請選擇尺寸';
  } else if (currentStock === 0) {
    carShoppingBtn.classList.add('disabled');
    carShoppingBtn.textContent = 'Sold Out';
  } else if (productUpLimit) {
    carShoppingBtn.classList.add('disabled');
    carShoppingBtn.textContent = '已買到上限';
  } else {
    carShoppingBtn.classList.remove('disabled');
    carShoppingBtn.textContent = '加入購物車';
  }
}

function addCartMessageHandle() {
  const addCartMessage = document.querySelector('.addCartMessage-wrap');
  const addCartMessageProductPhoto = document.querySelector('.addCartMessage-productPhoto');
  const addCartMessageProductName = document.querySelector('.addCartMessage-productName');
  const addCartMessageProductTotalNum = document.querySelector('.addCartMessage-productTotalNum');
  const addCartMessageProductTotalPrice = document.querySelector('.addCartMessage-productTotalPrice');
  const closeAddCartMessage = document.querySelector('.close-addCartMessage');
  addCartMessage.classList.remove('h-none');
  addCartMessageProductPhoto.style.backgroundImage = `url(${currentImage})`;
  addCartMessageProductName.textContent = currentTitle;
  addCartMessageProductTotalNum.textContent = currentQty;
  addCartMessageProductTotalPrice.textContent = currentPrice*currentQty;
  closeAddCartMessage.addEventListener('click', function(){
    addCartMessage.classList.add('h-none');
  })
}

// carShoppingBtnHandle
function carShoppingBtnHandle() {
  addCartMessageHandle();
  const curretnUrl = productDetailsPhoto.style.backgroundImage.slice(4, -1).replace(/"/g, "");
  let currentProductData = {
    id: currentId,
    name: currentTitle,
    price: currentPrice,
    color: {
      code: currentColorCode,
      name: currentColorName,
    },
    size: currentSize,
    qty: currentQty,
    url: curretnUrl,
    stock: currentStock
  };

  if (productData.length > 0) {
    repeatDelProductData(currentProductData);
  } else {
    productData.push(currentProductData);
  }
  localStorage.setItem('productListData', JSON.stringify(productData));
  shoppingCartShowNum();
}

// 判斷是否重複的productData
function repeatDelProductData(currentProductData){
  let repeat = false;
  let sameItem;

  productData.forEach(item => {
    if(item.id === currentId && item.size === currentSize && item.color.code === currentColorCode){
      repeat = true;
      sameItem = item;
      currentQty >= currentStock ? currentQty = currentStock : currentQty = +currentQty + 1;
      currentProductData.qty = currentQty;
      changeCarShopping();
      changeProductNumStatus();
    }
  })

  if (repeat) {
    removeArray(productData,sameItem)
    productData.push(currentProductData);
    console.log(sameItem, currentProductData);
  } else {
    productData.push(currentProductData)
  }
}

// 刪除重複的
function removeArray(array,val) {
  let index = array.indexOf(val);
  if (index > -1) { array.splice(index, 1) }
}

// changeProductNumStatus
function changeProductNumStatus() {
  currentColorCode === null || currentStock === 0 ? productNumInput.classList.add('disabled') : productNumInput.classList.remove('disabled');
}

// changeProductNum
const changeProductNum = (e) => {
  e.preventDefault();
  if (e.target.nodeName !== 'A') return;
  e.target === productAddBtn ? productCurrentNum.textContent = 
    +(productCurrentNum.textContent) + 1 : productCurrentNum.textContent = +(productCurrentNum.textContent) - 1;
    
  productCurrentNum.textContent <= 1 ? productReduceBtn.classList.add('disabled') : productReduceBtn.classList.remove('disabled');
  productCurrentNum.textContent >= currentStock ? productAddBtn.classList.add('disabled') : productAddBtn.classList.remove('disabled');
  
  currentQty = productCurrentNum.textContent;
  // console.log(productCurrentNum.textContent, currentStock);
}

// 初始ProductNum
function initProductNum() {
  let hasProduct = false;
  let productItem;
  let localProductQty;
  productData.forEach(item => {
    if(item.id === currentId && item.size === currentSize && item.color.code === currentColorCode){
      hasProduct = true;
      productItem = item;
      localProductQty = item.qty;
    }
  })
  parseInt(currentStock) === parseInt(localProductQty) && currentStock !== undefined ? productUpLimit = true : productUpLimit = false;

  if (currentStock === 0) {
    productCurrentNum.textContent = 0;
    changeProductNumStatus();
  } else if (hasProduct) {
    productCurrentNum.textContent = currentQty = productItem.qty; 
    changeCarShopping();
    changeProductNumStatus();
  } else {
    productCurrentNum.textContent = currentQty = 1;
  }
  productReduceBtn.classList.remove('disabled');
  productAddBtn.classList.remove('disabled');

  productCurrentNum.textContent <= 1 ? productReduceBtn.classList.add('disabled') : productReduceBtn.classList.remove('disabled');
  productCurrentNum.textContent >= currentStock ? productAddBtn.classList.add('disabled') : productAddBtn.classList.remove('disabled');
}

productDetailsColorsWrap.addEventListener('click', changeColors);
productDetailsSizes.addEventListener('click', changeSize);
productNumInput.addEventListener('click', changeProductNum);
carShoppingBtn.addEventListener('click', carShoppingBtnHandle);