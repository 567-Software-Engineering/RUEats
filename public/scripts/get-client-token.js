document.addEventListener('DOMContentLoaded', function() {
  const stripe = Stripe(
    'pk_test_51O7NOrDtd64NB5jL3sQrmsGQOSdMvTUpds9N0P7nfmT4697waURCZAmGs6vrIQjALewIeBpMJlDScO2NBr7h9ifN00J94KcMEj'
  ); // Publishable key

  const elements = stripe.elements();
  const cardElement = elements.create('card');

  cardElement.mount('#card-element');

  const form = document.getElementById('payment-form');
  const errorElement = document.getElementById('card-errors');
  form.addEventListener('submit', async function(event) {
    event.preventDefault();
    const {
      token,
      error
    } = await stripe.createToken(cardElement);
    
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
              token: token.id,
              amount: 1000
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
