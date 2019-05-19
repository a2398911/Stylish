/*global productCardsShow loadingVision productDetailsPhoto hostName heroBtnOvalWrap heroPicturesWrap 
productDetailsSizes productDetailsColorsWrap getProductStockData addProductPriceTotal changeCartShoppingTitle changeCartProductStatus*/

// print Product Data
const printData = (productsAll) => {
  const { data } = productsAll;

  // remove loading
  const loadingg = document.querySelector('.loading-wrap');
  if (loadingg !== null) {
    productCardsShow.removeChild(loadingg);
  }

  if (data.length <= 0) {
    const noFoundSearch = document.createElement('div');
    noFoundSearch.textContent = '查無資訊';
    noFoundSearch.className = 'no-found-search'
    productCardsShow.appendChild(noFoundSearch);
  }


  data.forEach(item => {
    const { main_image, price, title, colors, id } = item;
    const div = document.createElement('div');
    const productCard = document.createElement('a');
    const productPhoto = document.createElement('div'); //
    const productColor = document.createElement('span');
    const productName = document.createElement('span');
    const productPrice = document.createElement('span');

    div.className = 'col-6 col-md-4 product-card-wrap';
    productCard.className = 'product-card h-inline-block';
    productCard.href = `./product.html?id=${id}`;
    productPhoto.className = 'product-photo h-inline-block';
    // productPhoto.src = main_image;
    productPhoto.style.backgroundImage = `url(${main_image})`;
    productColor.className = 'product-colors h-flex';
    productName.className = 'product-name h-block';
    productName.textContent = title;
    productPrice.className = 'product-price h-inline-block';
    productPrice.textContent = `TWD.${toThousands(price)}`;

    colors.forEach(color => {
      const { code } = color;
      const productColorRectangle = document.createElement('span');
      productColorRectangle.className = 'product-color-rectangle h-inline-block';
      productColorRectangle.style.backgroundColor = `#${code}`;
      if(code === 'FFFFFF') productColorRectangle.style.borderColor = "#eee";
      productColor.appendChild(productColorRectangle);
    })

    div.appendChild(productCard).appendChild(productPhoto);
    productCard.appendChild(productColor);
    productCard.appendChild(productName);
    productCard.appendChild(productPrice);
    productCardsShow.appendChild(div);
  });
};

// print CampaignsData
const printCampaignsData = (CampaignsAll) => {
  const { data } = CampaignsAll;
  console.log(data);
  data.forEach((item, index) => {
    const { picture, story } = item;
    const storyArray = story.split('。');
    const storyTitleMainArray = storyArray[0].split('\n');
    const storyTitleMain = storyTitleMainArray.join('<br>');
  
    const heroPictire = document.createElement('div');
    const container = document.createElement('div');
    const heroTitle = document.createElement('div');
    const heroTitleMain = document.createElement('div');
    const heroTitleSub = document.createElement('div');
    const heroBtnOval = document.createElement('a');

    heroPictire.className = 'hero-picture';
    container.className = 'container';
    heroTitle.className = 'hero-title';
    heroTitleMain.className = 'hero-title-main';
    heroTitleSub.className = 'hero-title-sub';
    heroBtnOval.setAttribute('href', "#");
    heroBtnOval.className = 'hero-btnOval h-inline-block';
    if (index === 0) heroBtnOval.classList.add('active');

    heroPictire.style.backgroundImage = `url(https://${hostName}/${picture})`;
    heroTitleMain.innerHTML = `${storyTitleMain}。`;
    heroTitleSub.textContent = storyArray[1];

    heroPictire.appendChild(container).appendChild(heroTitle).appendChild(heroTitleMain);
    heroTitle.appendChild(heroTitleSub);

    heroPicturesWrap.appendChild(heroPictire);
    heroBtnOvalWrap.appendChild(heroBtnOval);
  })
}

// print ProductsDetails
const printProductsDetails = (productDetails) => {
  const productDetailsTitle = document.querySelector('.product-introduction-title');
  const productDetailsNumber = document.querySelector('.product-introduction-number');
  const productDetailsPrice = document.querySelector('.product-introduction-price');
  const productDetailsWarn = document.querySelector('.product-warn');
  const productDetailsMaterial = document.querySelector('.product-material');
  const productDetailsDescriptionWrap = document.querySelector('.product-detail-wrap');
  

  const { data } = productDetails;
  console.log(data);
  const { title, colors, sizes, variants, 
    price, texture, description, main_image, images, story, id, note} = data;
  
  productDetailsPhoto.style.backgroundImage = `url(${main_image})`;
  productDetailsTitle.textContent = title;
  productDetailsNumber.textContent = id;
  productDetailsPrice.textContent = `TWD.${toThousands(price)}`;
  productDetailsWarn.textContent = note;

  const productDescriptionArray = description.split('\n');
  productDescriptionArray.unshift(texture);
  const productDescriptionString =  productDescriptionArray.join('<br>');
  productDetailsMaterial.innerHTML = productDescriptionString;
  
  images.forEach(item => {
    const productDetailsText = document.createElement('p');
    const productDetailsImgWrap = document.createElement('div');
    const productDetailsImg = document.createElement('div');
    productDetailsText.className = 'product-detail text';
    productDetailsText.textContent = story;
    productDetailsImgWrap.className = 'product-detail-imgWrap';
    productDetailsImg.className = 'product-detail-img';
    productDetailsImg.style.backgroundImage = `url(${item})`;
    productDetailsImgWrap.appendChild(productDetailsImg);
    productDetailsDescriptionWrap.appendChild(productDetailsText);
    productDetailsDescriptionWrap.appendChild(productDetailsImgWrap);
  })

  sizes.forEach(item => {
    const productDetailsSizeLi = document.createElement('li');
    productDetailsSizeLi.className = 'product-size';
    productDetailsSizeLi.textContent = item;
    productDetailsSizes.appendChild(productDetailsSizeLi);
  })
  
  colors.forEach((item, index) => {
    const { code, name } = item;
    const productColorRectangle = document.createElement('li');
    productColorRectangle.className = 'product-introduction-colorRectangle';
    productColorRectangle.style.backgroundColor = `#${code}`;
    productColorRectangle.setAttribute("data-color", name);
    if(code === 'FFFFFF') productColorRectangle.style.borderColor = "#eee";
    productDetailsColorsWrap.appendChild(productColorRectangle);
    if(index === 0) productColorRectangle.classList.add('active');
  })
  return getProductStockData(variants, title, price, colors, main_image)
}

// print cart products
const printCartProducts = (productData) => {
  const cartContentShoppingLists = document.querySelector('.cart-content-shoppingLists');
  while (cartContentShoppingLists.firstChild) {
    cartContentShoppingLists.removeChild(cartContentShoppingLists.firstChild);
  }
  productData.forEach(item => {
    const { id, title, price, qty, size, url, stock } = item;
    const color_name = item.color.name;

    const cartShoppingItem = document.createElement('div');
    const cartShoppingInformation = document.createElement('div');
    const cartShoppingPhoto = document.createElement('div');
    const cartShoppingTexts = document.createElement('div');
    const cartShoppingTitle = document.createElement('div');
    const cartShoppingId = document.createElement('div');
    const cartShoppingColor = document.createElement('div');
    const cartShoppingSize = document.createElement('div');
    const cartShoppingNumAndPriceWrap = document.createElement('div');
    const cartShoppingNum = document.createElement('select');
    const cartShoppingOnePrice = document.createElement('div');
    const cartShoppingPriceTotal = document.createElement('div');
    const cartShoppingDel = document.createElement('span');

    for(let i=1; i<= stock; i++) {
      const cartOption = document.createElement('option'); 
      cartOption.textContent = i;
      cartOption.setAttribute('value', i);
      if (+qty === +cartOption.textContent) cartOption.setAttribute('selected', 'true')
      cartShoppingNum.appendChild(cartOption);
    }

    for(let i=0; i<3; i++) {
      const mobileShoppingWrap = document.createElement('div');
      const mobileShoppingTitle = document.createElement('div'); 
      mobileShoppingWrap.index = i;
      mobileShoppingTitle.index = i;
      mobileShoppingWrap.className = 'mobile-shopping-wrap h-flex h-flex-column h-align-items-center';
      if (mobileShoppingTitle.index === 0) {
        mobileShoppingTitle.className = 'mobile-shoppingTitle select h-lg-none';
        mobileShoppingTitle.textContent = '數量';
        mobileShoppingWrap.appendChild(mobileShoppingTitle);
        mobileShoppingWrap.appendChild(cartShoppingNum);
        cartShoppingNumAndPriceWrap.appendChild(mobileShoppingWrap);
        
      } else if (mobileShoppingTitle.index === 1) {
        mobileShoppingTitle.className = 'mobile-shoppingTitle h-lg-none';
        mobileShoppingTitle.textContent = '單價';
        mobileShoppingWrap.appendChild(mobileShoppingTitle);
        mobileShoppingWrap.appendChild(cartShoppingOnePrice);
        cartShoppingNumAndPriceWrap.appendChild(mobileShoppingWrap);
        
      } else {
        mobileShoppingTitle.className = 'mobile-shoppingTitle h-lg-none';
        mobileShoppingTitle.textContent = '小計';
        mobileShoppingWrap.appendChild(mobileShoppingTitle);
        mobileShoppingWrap.appendChild(cartShoppingPriceTotal);
        cartShoppingNumAndPriceWrap.appendChild(mobileShoppingWrap);
      }
    }
    cartShoppingItem.className = 'cart-shoppingItem h-flex h-align-items-center h-flex-column h-flex-lg-row';
    cartShoppingInformation.className = 'cart-shoppingInformation h-flex';
    cartShoppingPhoto.className = 'cart-shoppingPhoto';
    cartShoppingPhoto.style.backgroundImage= `url(${url})`;
    cartShoppingTexts.className = 'cart-shoppingTexts';
    cartShoppingTitle.className = 'cart-shoppingTitle';
    cartShoppingTitle.textContent = title;
    cartShoppingId.className = 'cart-shoppingId';
    cartShoppingId.textContent = id;
    cartShoppingColor.className = 'cart-shoppingColor';
    cartShoppingColor.textContent = `顏色 | ${color_name}`;
    cartShoppingSize.className = 'cart-shoppingSize';
    cartShoppingSize.textContent = `尺寸 | ${size}`;
    cartShoppingNumAndPriceWrap.className = 'cart-shoppingNumAndPrice-wrap h-flex h-justify-content-between h-align-items-center';
    cartShoppingNum.className = 'cart-shoppingNum';
    cartShoppingOnePrice.className = 'cart-shoppingOnePrice'
    cartShoppingOnePrice.textContent = `NT.${toThousands(price)}`;
    cartShoppingPriceTotal.className = 'cart-shoppingPriceTotal';
    cartShoppingPriceTotal.textContent = `NT.${toThousands(price * qty)}`;
    cartShoppingDel.className = 'cart-shoppingDel h-inline-block';

    cartShoppingItem.appendChild(cartShoppingInformation);
    cartShoppingItem.appendChild(cartShoppingNumAndPriceWrap);
    cartShoppingItem.appendChild(cartShoppingDel);
    cartShoppingInformation.appendChild(cartShoppingPhoto);
    cartShoppingInformation.appendChild(cartShoppingTexts);
    cartShoppingTexts.appendChild(cartShoppingTitle);
    cartShoppingTexts.appendChild(cartShoppingId);
    cartShoppingTexts.appendChild(cartShoppingColor);
    cartShoppingTexts.appendChild(cartShoppingSize);

    cartContentShoppingLists.appendChild(cartShoppingItem); 
  })
  addProductPriceTotal();
  changeCartShoppingTitle();
  changeCartProductStatus();
}

function toThousands(num) {
  return (num || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
}

function loadingVision() {
  const loadingPage = document.querySelector('.loading-page-wrap');
  const loadingHide = document.querySelector('.loadingHide');
  loadingPage.classList.remove('h-none');
  loadingHide ? loadingHide.classList.add('h-none') : null;
  setInterval(function() {
    loadingPage.classList.add('h-none');
    loadingHide ? loadingHide.classList.remove('h-none') : null;
  }, 800);
}