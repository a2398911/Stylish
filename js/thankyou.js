(function() {
  const backHomepage = document.querySelector('.backHomepage');
  const orderNumberCardNumber = document.querySelector('.orderNumberCard-number');
  let urlParams = new URLSearchParams(window.location.search);
  const orderNumber = urlParams.get('orderNumber');
  orderNumberCardNumber.textContent = orderNumber;
  
  backHomepage.addEventListener('click', function(){
    window.location.href = `index.html`;
  })
}());
