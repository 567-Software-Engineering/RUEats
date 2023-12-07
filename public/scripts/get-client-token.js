document.addEventListener('DOMContentLoaded', function() {
  const stripe = Stripe(
    'pk_test_51O7NOrDtd64NB5jL3sQrmsGQOSdMvTUpds9N0P7nfmT4697waURCZAmGs6vrIQjALewIeBpMJlDScO2NBr7h9ifN00J94KcMEj'
  ); // Publishable key

  // // get token from local storage
  // const token = localStorage.getItem('token');
  // console.log(token);

  // // get user id from local storage
  // const userID = localStorage.getItem('userID');
  // console.log(userID);

  // get cart from local storage
  // const cart = localStorage.getItem('cart');
  // console.log(cart);

  // get subTotalValue from local storage
  const subTotalValue = localStorage.getItem('subTotalValue');
  console.log(subTotalValue);

  const elements = stripe.elements();
  const cardElement = elements.create('card');

  cardElement.mount('#card-element');

  const form = document.getElementById('payment-form');
  const errorElement = document.getElementById('card-errors');
  form.addEventListener('submit', async function(event) {
    event.preventDefault();
    const {
      paymentToken,
      error
    } = await stripe.createToken(cardElement);
    
    console.log('paymentToken');
    console.log(paymentToken.id);
    if (error) {
      // Display error to user
      errorElement.textContent = error.message;
      console.log(error.message);
    } else {
      // Clear any previous error message.
      errorElement.textContent = '';
      // Send the token to your server to complete the payment.
      try {
        fetch('/submit-token', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              token: paymentToken.id,
              amount: subTotalValue
            }), // Amount comes from orders
          })
          .then((response) => console.log(response.json()));
        document.getElementById("paymentStatus")
          .innerHTML = "Payment Successful!";
      } catch (err) {
        document.getElementById("paymentStatus")
          .innerHTML = "Payment Unsuccessful!";
      }
    }
  });
});
