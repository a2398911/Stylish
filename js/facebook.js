const BetaFBNum = '1255228684626335';
const OnLineFBNum = '1255228684626335';

/*global FB printProfileInfo*/

// This is called with the results from from FB.getLoginStatus().
function statusChangeCallback(response) {
  console.log(response);
  if (response.status === 'connected') {
    let accessToken  = response.authResponse.accessToken
    localStorage.setItem('accessTokenData', JSON.stringify({accessToken: accessToken}));
    getUserInfo();
  } else {
    let userInfo = [];
    localStorage.setItem('userInfoData', JSON.stringify(userInfo));
  }
}

function checkLoginState() {
  FB.getLoginStatus(function(response) {
    statusChangeCallback(response);
  });
}

function getUserInfo() {
  FB.api('/me',{fields: 'id,name,email'}, function (response) {
    let picture = `https://graph.facebook.com/${response.id}/picture?type=large`
    response.picture = picture;
    console.log(response);
    localStorage.setItem('userInfoData', JSON.stringify(response));
    changeHeadPhoto();
    if (window.location.href.indexOf('profile') > -1) {
      printProfileInfo();
    }
  });
}

function changeHeadPhoto() {
  let userInfo = JSON.parse(localStorage.getItem('userInfoData')) || [];
  const merberHeadPhoto = document.querySelector('.merberHeadPhoto');
  merberHeadPhoto.style.backgroundImage= `url(${userInfo.picture})`;
}


window.fbAsyncInit = function() {
  FB.init({
    appId      : OnLineFBNum,
    cookie     : true,
    xfbml      : true,
    version    : 'v3.2'
  });

  checkLoginState();

};

(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = "https://connect.facebook.net/en_US/sdk.js";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

function facebookLogin() {
  FB.login(function(response) {
    console.log(response);
    checkLoginState();
  }, {scope: 'public_profile,email'});
}

function facebookLogout(){
  FB.getLoginStatus(function(response) {
    if (response.status === 'connected') {
      FB.api(`/me/permissions`, "DELETE", function(res) {
        console.log(res);
        window.location.href = '/';
      })
      FB.logout(function() {
        let userInfo = [];
        localStorage.setItem('userInfoData', JSON.stringify(userInfo));
        checkLoginState();
      });
    }
  });
}
