let index = 0;
let timer = null;
let currentPage = 0;

/*global heroPicturesWrap heroBtnOvalWrap*/
const changeView = () => { 
  if (index > 2) index = 0;

  // 改變頁碼
  const heroBtnAll = document.querySelectorAll('.hero-btnOval');
  heroBtnAll.forEach((item) => {
    item.classList.remove('active');
  })
  currentPage = index;
  heroBtnAll[currentPage].classList.add('active');

  let pictureWidth = heroPicturesWrap.clientWidth;
  heroPicturesWrap.style.left = -pictureWidth*index +'px'; 
}

const startTimer = () => {
  if (timer == null) {
    timer = setInterval(upData, 10000);
  }
}

const stopTimer = () => {
  clearInterval(timer);
  timer = null;
}

const upData = () => {
  index++
  changeView();
}

const clickHeroBtn = (e) => {
  if (e.target.nodeName !== 'A') { return }
  stopTimer();
  const heroBtnAll = document.querySelectorAll('.hero-btnOval');
  heroBtnAll.forEach((item, index) => {
    item.classList.remove('active');
    item.heroBtnIndex = index;
  })
  e.target.classList.add('active');
  index = e.target.heroBtnIndex;
  changeView();
  startTimer();

}

window.onresize = () => {
  changeView();
}

startTimer();
heroBtnOvalWrap.addEventListener('click', clickHeroBtn);
