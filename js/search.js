const mobileSearchWrap = document.querySelector('.nav-mobile-searchInput-wrap');
const mobileSearchInput = document.querySelector('.nav-mobile-searchInput');
const toolBtnWrap = document.querySelector('.tool-btn-wrap');
const searchWrap = document.querySelector('.search-wrap');
const searchInput = document.querySelector('.search-input');
const padSearchIcon = document.querySelector('.pad-searchIcon');
const inputSearchAction = document.querySelector('.inputSearchAction');
const mobileInputSearchAction = document.querySelector('.mobileInputSearchAction');
const mobileSearchIcon = document.querySelector('.nav-mobile-search-icon');

// search function
const searchCallBack = (e) => {
  e.preventDefault();
  const value = searchInput.value || mobileSearchInput.value;
  window.location.href = `index.html?tag=${value}`
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

inputSearchAction.addEventListener('submit', searchCallBack);
searchInput.addEventListener('blur', hiddenPadSearchInput);
mobileInputSearchAction.addEventListener('submit', searchCallBack);
mobileSearchIcon.addEventListener('click', showMobileSearchInput);
mobileSearchInput.addEventListener('blur', hiddenMobileSearchInput);
padSearchIcon.addEventListener('click', showPadSearchInput);