const submitButton = document.querySelector('.payBtn');
const cardNumberTitle = document.querySelector('.card-number');
const carNumber = document.querySelector('#card-number');
const cardExpirationDateTitle = document.querySelector('.card-expiration-date');
const cardExpirationDate = document.querySelector('#card-expiration-date');
const cardCcvTitle = document.querySelector('.card-ccv');
const cardCcv = document.querySelector('#card-ccv');

let userInputVerification = false;
let canGetPrime = false;

/*global TPDirect waitingThankyouPage getOrderCheckOutInfo clearShoppingCar productData*/

TPDirect.setupSDK(12348, 'app_pa1pQcKoY22IlnSXq5m5WP5jFKzoRG58VEXpT7wU62ud7mMbDOGzCYIlzzLF', 'sandbox');
TPDirect.card.setup({
  fields: {
    number: {
      element: '#card-number',
      placeholder: '**** **** **** ****'
      },
    expirationDate: {
      element: document.getElementById('card-expiration-date'),
      placeholder: 'MM / YY'
      },
    ccv: {
      element: '#card-ccv',
      placeholder: '後三碼'
      }
  },
  styles:{
    'input': {
      'color': '#3f3a3a'
    },
    '.valid': {
      'color': 'green'
    },
    '.invalid': {
      'color': '#a94442'
    },
    'input.cvc': {
      'font-size': '14px'
    },
    'input.expiration-date': {
      'font-size': '14px'
    },
    'input.card-number': {
      'font-size': '14px'
    },
  }
});

TPDirect.card.onUpdate(function (update) {
  // update.canGetPrime === true

  if (update.canGetPrime) { 
    canGetPrime = true;
    changeSubmitButtonStatus(canGetPrime, userInputVerification);
  }

  // number 欄位是錯誤的
  if (update.status.number === 2) {
    cardNumberTitle.classList.add('input-error');
    carNumber.classList.add('input-error');
    carNumber.classList.remove('card-inputing');
  } else if (update.status.number === 0) {
    cardNumberTitle.classList.remove('input-error');
    carNumber.classList.remove('input-error');
    cardNumberTitle.classList.add('card-number-success'); 
    carNumber.classList.add('card-number-success');
  }

  if (update.status.expiry === 2) {
    cardExpirationDateTitle.classList.add('input-error');
    cardExpirationDate.classList.add('input-error');
  } else if (update.status.expiry === 0) {
    cardExpirationDateTitle.classList.remove('input-error'); 
    cardExpirationDate.classList.remove('input-error');
    cardExpirationDateTitle.classList.add('card-number-success'); 
    cardExpirationDate.classList.add('card-number-success');
  }

  if (update.status.cvc === 2) {
    cardCcvTitle.classList.add('input-error');
    cardCcv.classList.add('input-error');
  } else if (update.status.cvc === 0) {
    cardCcvTitle.classList.remove('input-error');
    cardCcv.classList.remove('input-error');
    cardCcvTitle.classList.add('card-number-success'); 
    cardCcv.classList.add('card-number-success');
  }
})

function onSubmit() {
  // 取得 TapPay Fields 的 status
  const tappayStatus = TPDirect.card.getTappayFieldsStatus();
  console.log(TPDirect.card.getTappayFieldsStatus());
  // 確認是否可以 getPrime
  if (tappayStatus.canGetPrime === false) {
    return ;
  }
  TPDirect.card.getPrime((result) => {
    if (result.status !== 0) {
      return;
    }
    let resultPrime = result.card.prime;
    waitingThankyouPage();
    clearShoppingCar();
    getOrderCheckOutInfo(resultPrime, userNameInput.value, userphoneInput.value , userEmailInput.value, userAddresInput.value, userTransportInputIndex);
  })
}

const userphoneInput = document.querySelector('.userphone-input');
const userNameInput = document.querySelector('.userName-input');
const userEmailInput = document.querySelector('.userEmail-input');
const userAddresInput = document.querySelector('.userAddres-input');
const userTransportTimeWrap = document.querySelector('.userTransportTime-wrap');
const userInfos = document.querySelector('.user-infos');
let userTransportInputIndex = null;

function userInputPhoneStatus() {
  const userphoneTitle = document.querySelector('.userphoneTitle');
  const errorPhoneMessage = document.querySelector('.error-phone');
  let phoneRe = /^09[0-9]{8}$/;
  if (!phoneRe.test(userphoneInput.value)){ 
    userphoneInput.classList.add('input-error');
    userphoneTitle.classList.add('input-error');
    errorPhoneMessage.classList.remove('h-none');
    return false;
  } else {
    userphoneInput.classList.remove('input-error');
    userphoneTitle.classList.remove('input-error');
    errorPhoneMessage.classList.add('h-none');
    return true;
  }
}

function userInputNameStatus() {
  const userNameTitle = document.querySelector('.userName-title');
  const errorNameMessage = document.querySelector('.error-name');
  if (userNameInput.value === '') {
    userNameInput.classList.add('input-error');
    userNameTitle.classList.add('input-error');
    errorNameMessage.classList.add('h-block');
    return false;
  } else {
    userNameInput.classList.remove('input-error');
    userNameTitle.classList.remove('input-error');
    errorNameMessage.classList.remove('h-block');
    return true;
  }
}


function userInputEmailStatus() {
  const userEmailTitle = document.querySelector('.userEmailTitle');
  const errorEmailMessage = document.querySelector('.error-email');
  let emailRe =  /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/; 
  if (!emailRe.test(userEmailInput.value)) {
    userEmailInput.classList.add('input-error');
    userEmailTitle.classList.add('input-error');
    errorEmailMessage.classList.remove('h-none');
    return false;
  } else {
    userEmailInput.classList.remove('input-error');
    userEmailTitle.classList.remove('input-error');
    errorEmailMessage.classList.add('h-none');
    return true;
  }
}

function userInputAddrStatus(e) {
  const userAddresTitle = document.querySelector('.userAddresTitle');
  const errorAddresMessage = document.querySelector('.error-addres');
  if (e !== undefined) {
    if (userAddresInput.value === '') {
      userAddresInput.classList.add('input-error');
      userAddresTitle.classList.add('input-error');
      errorAddresMessage.classList.remove('h-none');
    } else {
      userAddresInput.classList.remove('input-error');
      userAddresTitle.classList.remove('input-error');
      errorAddresMessage.classList.add('h-none');
    }
  } else {
    if (userAddresInput.value === '') {
      return false;
    } else {
      return true;
    }
  }
}

function userTransportInputStatus() {
  const userTransportInput = document.querySelectorAll('.userTransport-input');
  let transportInputStatus = false;

  userTransportInput.forEach((item, index) => {
    if (item.checked) {
      userTransportInputIndex = index;
      transportInputStatus = true;
    } 
  })
  return transportInputStatus;
}

function userInputVerificationFun() {
  if (userInputPhoneStatus() && userInputNameStatus() && userInputAddrStatus() && userTransportInputStatus() && userInputEmailStatus()) {
    userInputVerification = true;
  }
  changeSubmitButtonStatus(canGetPrime, userInputVerification);
}

function changeSubmitButtonStatus(canGetPrime = false, userInputVerification) {
  canGetPrime && userInputVerification && productData.length > 0 ? submitButton.classList.remove('disabled') : submitButton.classList.add('disabled');
}

userphoneInput.addEventListener('input', userInputPhoneStatus);
userNameInput.addEventListener('blur', userInputNameStatus);
userAddresInput.addEventListener('blur', userInputAddrStatus);
userEmailInput.addEventListener('input', userInputEmailStatus);
userTransportTimeWrap.addEventListener('change', userTransportInputStatus);
userInfos.addEventListener('change', userInputVerificationFun);