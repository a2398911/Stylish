const hostName = 'api.appworks-school.tw';
const apiVersion = '1.0';
let productCategory;
let productPaging = 0;
let flag = true;

/*global printData printCampaignsData printProductsDetails*/

const getData = (api) => {
  return new Promise( (resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('get', `https://${hostName}/api/${apiVersion}/${api}`);
    xhr.onload = function() { 
      if (200 <= xhr.status && xhr.status <= 299) {
        resolve(this.responseText);
      }
    };
    xhr.onerror = function() { reject("Error") };
    xhr.send();
  })
}

const getProduct = (api) => {
  return getData(api).then((result) => {
    const productsAll = JSON.parse(result);
    productPaging = productsAll.paging
    productCategory = api;
    
    if (productCategory.indexOf('?paging=') > 0) { productCategory = (productCategory.split('?'))[0] }
    printData(productsAll);
    
    // 初始化flag
    flag = true;
  }).catch((err) => {
    console.log(err);
  })
}

const getDateCampaigns = (api) => {
  return getData(api).then((result) => {
    const campaignsAll = JSON.parse(result);
    printCampaignsData(campaignsAll);
  })
}

const getDataProductsDetails = (api) => {
  return getData(api).then((result) => {
    const productDetails =  JSON.parse(result);
    printProductsDetails(productDetails);
  })
}

const postOrderCheck = (api, checkOutOrderData, accessToken) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('post', `https://${hostName}/api/${apiVersion}/${api}`);
    xhr.setRequestHeader('Content-type', 'application/json');
    console.log(accessToken);
    xhr.setRequestHeader('Authorization',`Bearer ${accessToken}`);
    xhr.onerror = function() { reject("Error") };
    xhr.send(JSON.stringify(checkOutOrderData));
    xhr.onload = function() { 
      if (200 <= xhr.status && xhr.status <= 299) {
        resolve(this.responseText);
      }
    };
  })
}
