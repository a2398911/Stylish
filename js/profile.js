const oderInfoWrap = document.querySelector('.oderInfo-wrap');
const oderInfoItem = document.querySelectorAll('.oderInfo-title');
const logInFbBtn = document.querySelector('.login-fb');
const logOutFbBtn = document.querySelector('.log-out');

/*global facebookLogin facebookLogout*/

function printProfileInfo() {
  let userInfo = JSON.parse(localStorage.getItem('userInfoData')) || [];
  const profileLogIn = document.querySelector('.profile-log-in');
  const profileLogout = document.querySelector('.profile-log-out');
  const profileName = document.querySelector('.profile-name');
  const profileEmail = document.querySelector('.profile-email');
  const profilePhoto = document.querySelector('.profile-photo');
  const profileGrade = document.querySelector('.profile-grade');
  if (userInfo.email) {
    profileEmail.textContent = userInfo.email;
    profileName.textContent = userInfo.name;
    profilePhoto.style.backgroundImage= `url(${userInfo.picture})`;
    profileGrade.classList.remove('h-none');
    profileLogIn.classList.add('h-none');
    profileLogout.classList.remove('h-none');
  } else {
    profileLogout.classList.add('h-none');
  }
}
printProfileInfo();


function changeOderInfoItem(e) {
  if (e.target.nodeName !== 'LI') { return }
  oderInfoItem.forEach(item => item.classList.remove('active'));
  e.target.classList.add('active');
}

oderInfoWrap.addEventListener('click', changeOderInfoItem);

logInFbBtn.addEventListener('click', facebookLogin);
logOutFbBtn.addEventListener('click', facebookLogout);
// logOutFbBtn.setAttribute("onclick", "facebookLogout()")