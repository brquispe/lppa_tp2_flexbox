const inputs = document.querySelectorAll('form.form input');
const frmSubscribe = document.getElementById('frmSubscribe');


const validateInput = (toValidate, inputValue) => {
  const rules = toValidate.replace(/\s/g,'').split(',');
  const validations = rules.map(rule => rule.split(':'));

  console.log(validations)
  let result = false;
  let message = '';
  validations.some(validation => {
    const [rule, value] = validation
    console.log(rule)
    console.log(value)
    switch (rule) {
      case 'type': 
        console.log('validating type')
        switch (value) {
          case 'email':
            result = checkEmail(inputValue)
            message = 'Debe ser un correo electrónico.'
            break;
          case 'password':
            result = /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/.test(inputValue);
            message = 'Debe tener al menos un número y una letra.'
            break;
          case 'phone':
            result = /^[0-9]{7,}$/.test(inputValue)
            message = 'Debe contener al menos 7 números y sin símbolos o espacios.'
            break;
          case 'number':
            result = !isNaN(inputValue) && !isNaN(parseFloat(inputValue))
            message = 'Debe ser un número.'
            break;
          case 'address': 
            result = /^[a-zA-Z]*\s[0-9]*$/.test(inputValue);
            message = 'Debe contener calle y altura, con un espacio en el medio.'
            break;
          case 'letters':
            result = /^[a-zA-Z\s]*$/.test(inputValue);
            message = 'No son solo letras.'
            break;
        }
        break;
      case 'minlength':
        console.log('validating minlength')
        result = inputValue.trim().length >= value;
        message = 'Debe tener más de '+value+' caracteres.';
        break;
      case 'maxlength':
        console.log('validating maxlength')
        result = inputValue.trim().length <= value;
        break;
    }

    return !result
  })
  return {
    result,
    message
  };
}

inputs.forEach(input => {
  const errorDiv = input.parentElement.querySelector('div.error');
  const validations = input.dataset.rules;
  const label = input.parentNode.getElementsByTagName('label')[0];
  if (!validations) return;

  const setErrorMessageVisibility = (value, message) => {
    input.classList.toggle('error', value);
    if (label) label.classList.toggle('error', value);
    if (errorDiv) {
      errorDiv.classList.toggle('error--shown', value)
      errorDiv.querySelector('p.errorMessage').textContent = message;
    }
  };

  input.addEventListener('blur', e => {
    // const res = validation.test(input.value);
    const res = validateInput(validations, input.value)
    console.log(res)
    if (res.result) {
      setErrorMessageVisibility(false)
      return;
    }
    setErrorMessageVisibility(true, res.message)
  })

  input.addEventListener('focus', e => {
    setErrorMessageVisibility(false)
  })
})

frmSubscribe.addEventListener('submit', e => {
  e.preventDefault();
  inputs.forEach(input => {
    input.focus();
    input.blur();
  })
})

function checkEmail(emailAddress) {
  var sQtext = '[^\\x0d\\x22\\x5c\\x80-\\xff]';
  var sDtext = '[^\\x0d\\x5b-\\x5d\\x80-\\xff]';
  var sAtom = '[^\\x00-\\x20\\x22\\x28\\x29\\x2c\\x2e\\x3a-\\x3c\\x3e\\x40\\x5b-\\x5d\\x7f-\\xff]+';
  var sQuotedPair = '\\x5c[\\x00-\\x7f]';
  var sDomainLiteral = '\\x5b(' + sDtext + '|' + sQuotedPair + ')*\\x5d';
  var sQuotedString = '\\x22(' + sQtext + '|' + sQuotedPair + ')*\\x22';
  var sDomain_ref = sAtom;
  var sSubDomain = '(' + sDomain_ref + '|' + sDomainLiteral + ')';
  var sWord = '(' + sAtom + '|' + sQuotedString + ')';
  var sDomain = sSubDomain + '(\\x2e' + sSubDomain + ')*';
  var sLocalPart = sWord + '(\\x2e' + sWord + ')*';
  var sAddrSpec = sLocalPart + '\\x40' + sDomain; // complete RFC822 email address spec
  var sValidEmail = '^' + sAddrSpec + '$'; // as whole string

  var reValidEmail = new RegExp(sValidEmail);

  return reValidEmail.test(emailAddress);
}
