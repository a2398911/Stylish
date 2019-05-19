const productCardsShow = document.querySelector('#product-cards-all');
const navMenus = document.querySelector('.nav-menus');
const menuLists = document.querySelectorAll('.menu-list');
const searchWrap = document.querySelector('.search-wrap');
const searchInput = document.querySelector('.search-input');
const padSearchIcon = document.querySelector('.pad-searchIcon');
const mobileSearchIcon = document.querySelector('.nav-mobile-search-icon');
const mobileSearchWrap = document.querySelector('.nav-mobile-searchInput-wrap');
const mobileSearchInput = document.querySelector('.nav-mobile-searchInput');
const toolBtnWrap = document.querySelector('.tool-btn-wrap');
const loadElement = document.querySelector('.loading')
const heroPicturesWrap = document.querySelector('.hero-pictures-wrap');
const heroBtnOvalWrap = document.querySelector('.hero-btnOval-wrap');

/*global getProduct loadingVision getDateCampaigns productCategory productPaging flag:true*/

// locationUrl 
const Url = function() {
  let urlParams = new URLSearchParams(window.location.search);
  const category = urlParams.get('category');
  const tag = urlParams.get('tag');
  console.log(window.location.search);
  if (category !== null) {
    removeProducts();
    addLoading();
    getProduct(`products/${category}`);
    addActive(category);
  } else if (tag !== null) {
    getProduct(`products/search?keyword=${tag}`);
  } else {
    loadingVision();
    getProduct('products/all');
  }
}();

// navbar add active
function addActive(category){
  for (let i=0; i<menuLists.length; i++) {
    if (category === 'women') {
      menuLists[0].classList.add('active');
    } else if (category === 'men') {
      menuLists[1].classList.add('active');
    } else {
      menuLists[2].classList.add('active');
    }
  }
}

// Add loading function
function addLoading() {
  const loadElement = document.createElement('div');
  const loadElementWrap = document.createElement('div');
  loadElementWrap.className = 'loading-wrap'
  loadElement.className = 'loading';
  productCardsShow.appendChild(loadElementWrap).appendChild(loadElement);
}

// Campaigns
getDateCampaigns('marketing/campaigns');

// remove products
function removeProducts(){
  while (productCardsShow.firstChild) {
    productCardsShow.removeChild(productCardsShow.firstChild);
  }
}

const switchBtn = (e) => {
  if (e.target.nodeName !== 'A') { return }
  e.preventDefault();

  menuLists.forEach(menuList => menuList.classList.remove('active'))
  e.target.parentNode.classList.add('active');
  
  removeProducts();
  addLoading();

  if (e.target.textContent === '女裝') {
    getProduct('products/women');
  } else if (e.target.textContent === '男裝') {
    getProduct('products/men');
  } else {
    getProduct('products/accessories');
    
  }
}

// search function
const searchCallBack = (e) => {
  if (e.keyCode === 13) {
    if (e.target.value.trim() === '') { return }
    removeProducts();
    addLoading();
    const searchValue = e.target.value;
    getProduct(`products/search?keyword=${searchValue}`);
  }
}

// scroll function
const scrollCallBack = () => {
  const productCardsHight =  productCardsShow.getBoundingClientRect().bottom;
  const windowHeight = window.innerHeight;
  
  if (productCardsHight < windowHeight && flag) {
    // console.log(productCategory);
    if (productPaging > 0 && productPaging !== undefined) {
      addLoading();
      getProduct(`${productCategory}?paging=${productPaging}`);
    }
    flag = false;
  }

}

const showMobileSearchInput = () => {
  mobileSearchWrap.classList.remove('h-none');
  mobileSearchWrap.classList.add('h-flex');
  mobileSearchInput.focus();
}

const hiddenMobileSearchInput = () => {
  mobileSearchWrap.classList.remove('h-flex');
  mobileSearchWrap.classList.add('h-none');
}

const showPadSearchInput = () => {
  toolBtnWrap.classList.remove('h-flex');
  toolBtnWrap.classList.add('h-none');
  searchWrap.classList.remove('h-none');
  searchInput.focus();
}

const hiddenPadSearchInput = () => {
  if (document.body.clientWidth >= 1200) { return }
  toolBtnWrap.classList.remove('h-none');
  toolBtnWrap.classList.add('h-flex');
  searchWrap.classList.add('h-none');
}

navMenus.addEventListener('click', switchBtn);
searchInput.addEventListener('keyup', searchCallBack);
searchInput.addEventListener('blur', hiddenPadSearchInput)
mobileSearchInput.addEventListener('keyup', searchCallBack);
mobileSearchIcon.addEventListener('click', showMobileSearchInput);
mobileSearchInput.addEventListener('blur', hiddenMobileSearchInput);
padSearchIcon.addEventListener('click', showPadSearchInput);
window.addEventListener('scroll', scrollCallBack);