import { inputErrors } from '@/lib/styling/inputErrors';
import { smartPaste } from './smartPaste.utils/smartPaste';

const addErrorClasses = inputErrors.add;
const removeErrorClasses = inputErrors.remove;

export function extendTelField(input: HTMLInputElement) {
  input.addEventListener('blur', () => {
    if (!input.checkValidity()) {
      addErrorClasses(input);
    } else {
      removeErrorClasses(input);
    }
  });

  input.addEventListener('focus', () => {
    removeErrorClasses(input);
  });

  input.addEventListener('paste', (event) => {
    event.preventDefault();
    event.stopPropagation();

    const pastedText = event?.clipboardData?.getData('text');

    if (pastedText) {
      const transformText = smartPaste(pastedText);
      input.value = transformText.formatted;
    }
  });

  return input;
}
