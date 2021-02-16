// , {betas: ['sepa_pm_beta_1']}
var stripe = Stripe('pk_test_np03HQCRSso2O8NqYEGVlzAu00dkOZkCxf', {betas: ['sepa_pm_beta_1']});
var elements = stripe.elements();
const PI_CLIENT_SECRET = '???';

var style = {
    base: {
      fontSize: '16px',
      color: "#32325d",
    }
  };
  
var iban = elements.create('iban', {
  style: style,
  supportedCountries: ['SEPA'],
  placeholderCountry: 'DE',
});

iban.mount('#iban-element');

var form = document.getElementById('payment-form');
var accountholderName = document.getElementById('accountholder-name');
var email = document.getElementById('email');

form.addEventListener('submit', function(event) {
  event.preventDefault();
  
  stripe.handleSepaDebitPayment(
    PI_CLIENT_SECRET,
    iban, 
    {
      payment_method_data: {
        billing_details: {
          name: accountholderName.value,
          email: email.value
        }
      }
    }
  );
});

