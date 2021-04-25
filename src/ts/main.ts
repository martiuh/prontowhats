import { track } from '@lib/track';

declare var DEV_SEND_MESSAGE: boolean;

window.addEventListener('load', () => {
  let countrySelectValid = false;
  let telInputValid = false;

  const countrySelect = document.getElementById('country') as HTMLSelectElement;
  countrySelect.addEventListener('change', () => {
    if (countrySelect.checkValidity()) {
      countrySelectValid = true;
    }
  });

  (async function setCountryCode() {
    try {
      const data = await fetch('https://ipapi.co/json').then((res) =>
        res.json()
      );
      const code = data?.country_code;
      if (code) {
        countrySelect.value = code;
      }
    } catch (error) {
      console.error('Error fetching IP information');
    }
  })();

  const errorClasses = ['border-2', 'border-red-500', 'text-red-500'];

  const addErrorClasses = (el: HTMLElement) =>
    el.classList.add(...errorClasses);

  const removeErrorClasses = (el: HTMLElement) => {
    if (el.classList.contains(errorClasses[1])) {
      el.classList.remove(...errorClasses);
    }
  };

  const telInput = document.getElementById('tel') as HTMLInputElement;

  telInput.addEventListener('blur', (e) => {
    if (!telInput.checkValidity()) {
      addErrorClasses(telInput);
      telInputValid = false;
    } else {
      removeErrorClasses(telInput);
      telInputValid = true;
    }
  });

  telInput.addEventListener('focus', () => {
    removeErrorClasses(telInput);
  });

  const sendWhatsForm = document.getElementById('send-form') as HTMLFormElement;
  const submitButton = document.getElementById(
    'submit-btn'
  ) as HTMLButtonElement;

  const messageArea = document.getElementById('message') as HTMLTextAreaElement;

  messageArea.addEventListener('keydown', (event) => {
    if ((event.ctrlKey || event.metaKey) && event.code === 'Enter') {
      submitButton.click();
    }
  });

  sendWhatsForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const countryCode = countrySelect.selectedOptions[0].dataset.code;
    const countryName = countrySelect.selectedOptions[0].dataset.name;

    const telephone = telInput.value;
    const msg = messageArea.value;

    const hasMsg = msg !== ' ';
    const message = hasMsg ? `&text=${encodeURI(`${msg}`)}` : '';

    if (hasMsg) {
      track('select_content', {
        content_type: 'with_message',
        item_id: '1111',
      });
    }

    const whatsAppString = `https://api.whatsapp.com/send?phone=${countryCode}${telephone}${message}`;

    track('select_content', { content_type: 'country', item_id: countryName });

    if (typeof DEV_SEND_MESSAGE !== 'undefined') {
      if (!DEV_SEND_MESSAGE) {
        console.log('SEND', whatsAppString);
        return;
      }
    }

    window.location.href = whatsAppString;
  });

  sendWhatsForm.addEventListener('change', () => {
    if (telInputValid && countrySelectValid) {
      submitButton.removeAttribute('disabled');
    }
  });
});
