const applicationForm = document.querySelector('.order-form');

if (applicationForm) {
  const nameInput = applicationForm.querySelector('#order-name');
  const emailInput = applicationForm.querySelector('#order-email');
  const phoneInput = applicationForm.querySelector('#order-phone');
  const formMessage = applicationForm.querySelector('.form-message');
  const otherFields = Array.from(applicationForm.elements).filter((field) =>
    field.required && field !== nameInput && field !== emailInput && field !== phoneInput
  );

  function validateName() {
    const value = nameInput.value.trim();

    if (value.length < 2) {
      showFieldError(nameInput, 'Введите имя не короче 2 символов.');
      return false;
    }

    clearFieldError(nameInput);
    return true;
  }

  function validateEmail() {
    const value = emailInput.value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(value)) {
      showFieldError(emailInput, 'Введите корректный e-mail.');
      return false;
    }

    clearFieldError(emailInput);
    return true;
  }

  function validatePhone() {
    const value = phoneInput.value.trim();
    const digits = value.replace(/\D/g, '');

    if (digits.length !== 11 || !['7', '8'].includes(digits[0])) {
      showFieldError(phoneInput, 'Введите корректный номер телефона.');
      return false;
    }

    clearFieldError(phoneInput);
    return true;
  }

  applicationForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const isNameValid = validateName();
    const isEmailValid = validateEmail();
    const isPhoneValid = validatePhone();
    const invalidFields = otherFields.filter((field) => !field.validity.valid);
    otherFields.forEach(clearFieldError);
    invalidFields.forEach((field) => showFieldError(field));

    const isFormValid = isNameValid && isEmailValid && isPhoneValid && invalidFields.length === 0;

    if (!isFormValid) {
      formMessage.textContent = 'Проверьте поля формы.';
      applicationForm.querySelector('[aria-invalid="true"]').focus();
      return;
    }

    console.log('Форма прошла учебную проверку; данные не отправлены.');
    formMessage.textContent = 'Форма прошла учебную проверку. Данные не отправлены.';
    applicationForm.reset();
    formMessage.focus();
  });

  nameInput.addEventListener('input', validateName);
  emailInput.addEventListener('input', validateEmail);
  phoneInput.addEventListener('input', validatePhone);
  otherFields.forEach((field) => field.addEventListener('change', updateFieldError));
}
