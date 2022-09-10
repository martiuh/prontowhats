import { track } from '@/lib/track';
import { extendTelField } from '@/extenders/smartPaste/extendTelField';
import { randomSentences } from '@/constants/sentences'

declare var SEND_MESSAGE: boolean;

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

  const telInput = document.getElementById('tel') as HTMLInputElement;
  extendTelField(telInput);

  const infoButton = document.getElementById('info-btn') as HTMLButtonElement;
  const priceButton = document.getElementById('price-btn') as HTMLButtonElement;
  const randomButton = document.getElementById('random-sentence-btn') as HTMLButtonElement;

  infoButton.addEventListener('click', () => {
    messageArea.textContent = 'Me interesa recibir informes de '
  })

  priceButton.addEventListener('click', () => {
    messageArea.textContent = 'Me gustaria saber el precio de '
  })

  randomButton.addEventListener('click', () => {
    let result = randomSentences[getRrandomNum(randomSentences.length)]
    messageArea.textContent = `${result}`
  })

 function getRrandomNum(num: number) {
  return Math.floor(Math.random() * (num) );
}

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
    const message = hasMsg ? `?text=${encodeURI(`${msg}`)}` : '';

    if (hasMsg) {
      track('select_content', {
        content_type: 'with_message',
        item_id: '1111',
      });
    }

    const whatsAppString = `https://wa.me/${countryCode}${telephone}/${message}`;

    track('select_content', { content_type: 'country', item_id: countryName });

    if (!SEND_MESSAGE) {
      console.log('SEND', whatsAppString);
      return;
    }

    window.location.href = whatsAppString;
  });

  sendWhatsForm.addEventListener('change', () => {
    if (telInputValid && countrySelectValid) {
      submitButton.removeAttribute('disabled');
    }
  });
});


